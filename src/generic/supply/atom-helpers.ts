import { Atom, Option } from '@grammarly/focal';
import { MonoTypeOperatorFunction, Observable, Operator, Subscriber, TeardownLogic } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface IFig {
  inProgress: boolean;
  error?: Error;
}

export interface IFigProjectionOptions {
  isErrorTransparent: boolean;
}

export const createFig = (fig?: Option<Partial<IFig>>): IFig => {
  return {
    inProgress: false,
    ...fig,
  };
};

const figProjectionDefaultOptions = { isErrorTransparent: false };

export const figProjection = <T>(
  fig$: Atom<IFig>,
  options: Partial<IFigProjectionOptions> = figProjectionDefaultOptions
): MonoTypeOperatorFunction<T> => (source: Observable<T>) =>
  source.lift(
    new FigOperator<T>(fig$, { ...figProjectionDefaultOptions, ...options })
  );

class FigOperator<T> implements Operator<T, T> {
  constructor(private fig$: Atom<IFig>, private options: IFigProjectionOptions) {}
  call(subscriber: Subscriber<T>, source: Observable<T>): TeardownLogic {
    return source.subscribe(new FigSubscriber(subscriber, this.fig$, this.options));
  }
}

class FigSubscriber<T> extends Subscriber<T> {
  constructor(
    destination: Subscriber<T>,
    private fig$: Atom<IFig>,
    private options: IFigProjectionOptions
  ) {
    super(destination);
    this.fig$.set({ inProgress: true });
  }

  _next(value: T) {
    this.fig$.set({ inProgress: false });
    this.destination.next!(value);
  }

  error(error: Error) {
    this.fig$.set({ inProgress: false, error });
    if (this.options.isErrorTransparent) {
      super.error(error);
    } else {
      this.destination.complete!();
    }
  }

  unsubscribe() {
    const fig = this.fig$.get();
    this.fig$.set({ ...fig, inProgress: false });
    super.unsubscribe();
  }
}

export const atomProjection = <T1, T2 extends T1>(atom: Atom<T1>): MonoTypeOperatorFunction<T2> => (
  source: Observable<T2>
) => source.pipe(tap((n) => atom.set(n)));
