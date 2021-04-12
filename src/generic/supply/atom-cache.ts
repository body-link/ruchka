import { cs } from 'rxjs-signal';
import { Atom } from '@grammarly/focal';
import { BehaviorSubject, combineLatest, Observable, Subscriber, Subscription } from 'rxjs';
import { debounceTime, skip, take } from 'rxjs/operators';
import { atomProjection, createFig, figProjection, IFig } from './atom-helpers';

export class AtomCache<T> extends BehaviorSubject<IAtomCacheState<T>> {
  readonly load = cs<void, void, Promise<T>>((emit) => {
    emit();
    return this.params.getValue$
      .pipe(take(1), figProjection(this.params.fig$), atomProjection(this.params.value$))
      .toPromise();
  });

  private sub = combineLatest([this.params.fig$, this.params.value$])
    .pipe(
      skip(1), // skip cuz we get initial state in constructor
      debounceTime(100)
    )
    .subscribe(([nextFig, nextValue]) => {
      const { fig, value } = this.value;
      if (
        fig.inProgress !== nextFig.inProgress ||
        fig.error !== nextFig.error ||
        value !== nextValue
      ) {
        this.next({ fig: nextFig, value: nextValue });
      }
    });

  constructor(
    public params: {
      fig$: Atom<IFig>;
      value$: Atom<T>;
      getValue$: Observable<T>;
      shouldLoad: (value: T) => boolean;
    }
  ) {
    super(AtomCache.createState(params));
  }

  static createState<T>(params: {
    fig$: Atom<IFig>;
    value$: Atom<T>;
    shouldLoad: (value: T) => boolean;
  }) {
    const value = params.value$.get();
    const fig = params.shouldLoad(value) ? createFig({ inProgress: true }) : params.fig$.get();
    return { fig, value };
  }

  _subscribe(subscriber: Subscriber<IAtomCacheState<T>>): Subscription {
    if (this.params.shouldLoad(this.value.value)) {
      this.load();
    }
    return super._subscribe(subscriber);
  }
}

export interface IAtomCacheState<T> {
  fig: IFig;
  value: T;
}
