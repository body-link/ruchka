import { Atom, Option } from '@grammarly/focal';
import { MonoTypeOperatorFunction, Observable, Operator, Subscriber, TeardownLogic } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isError } from './type-guards';
import { TOption } from './type-utils';

export interface IFig<Value = unknown> {
  value: Value;
  inProgress: boolean;
  error?: Error;
}

export interface IFigProjectionOptions {
  skipValue: boolean;
  skipError: boolean;
  skipProgress: boolean;
  errorHandlingStrategy: 'ignore' | 'pass' | 'complete';
}

export function createFig(fig?: Option<Partial<IFig<undefined>>>): IFig<undefined>;
export function createFig<T>(): IFig<TOption<T>>;
export function createFig<T>(fig: Pick<IFig<T>, 'value'> & Partial<IFig<T>>): IFig<T>;
export function createFig<T>(fig?: Option<Partial<IFig<T>>>) {
  return {
    value: undefined,
    inProgress: false,
    ...fig,
  } as IFig<T>;
}

const figProjectionDefaultOptions: IFigProjectionOptions = {
  skipValue: false,
  skipError: false,
  skipProgress: false,
  errorHandlingStrategy: 'complete',
};

export const figProjection = <T>(
  fig$: Atom<IFig<T>>,
  options: Partial<IFigProjectionOptions> = figProjectionDefaultOptions
): MonoTypeOperatorFunction<T> => (source: Observable<T>) =>
  source.lift(
    new FigOperator<T>(fig$, { ...figProjectionDefaultOptions, ...options })
  );

class FigOperator<T> implements Operator<T, T> {
  constructor(private fig$: Atom<IFig<T>>, private options: IFigProjectionOptions) {
    if (options.skipValue && options.skipError && options.skipProgress) {
      throw new Error("You don't need to use figProjection if you skip every IFig property");
    }
  }
  call(subscriber: Subscriber<T>, source: Observable<T>): TeardownLogic {
    return source.subscribe(new FigSubscriber(subscriber, this.fig$, this.options));
  }
}

class FigSubscriber<T> extends Subscriber<T> {
  constructor(
    destination: Subscriber<T>,
    private fig$: Atom<IFig<T>>,
    private options: IFigProjectionOptions
  ) {
    super(destination);
    if (!this.options.skipProgress) {
      this.fig$.lens('inProgress').set(true);
    }
  }

  _next(value: T) {
    this.fig$.modify((state) => ({
      value: this.options.skipValue ? state.value : value,
      inProgress: this.options.skipProgress ? state.inProgress : false,
    }));
    (this.destination as Subscriber<T>).next(value);
  }

  error(error: unknown) {
    const { skipError, skipProgress, errorHandlingStrategy } = this.options;
    this.fig$.modify((fig) => {
      const nextFig: IFig<T> = { ...fig };
      if (!skipError) {
        nextFig.error = isError(error) ? error : new Error(String(error));
      }
      if (!skipProgress) {
        nextFig.inProgress = false;
      }
      return nextFig;
    });
    if (errorHandlingStrategy === 'pass') {
      super.error(error);
    } else if (errorHandlingStrategy === 'complete') {
      (this.destination as Subscriber<T>).complete();
    }
  }

  unsubscribe() {
    if (!this.options.skipProgress) {
      this.fig$.lens('inProgress').set(false);
    }
    super.unsubscribe();
  }
}

export const atomProjection = <T1, T2 extends T1>(atom: Atom<T1>): MonoTypeOperatorFunction<T2> => (
  source: Observable<T2>
) => source.pipe(tap((n) => atom.set(n)));
