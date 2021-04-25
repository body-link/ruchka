import { cs } from 'rxjs-signal';
import { Atom } from '@grammarly/focal';
import { BehaviorSubject, Observable, Subscriber, Subscription } from 'rxjs';
import { debounceTime, skip, take } from 'rxjs/operators';
import { createFig, figProjection, IFig } from './atom-helpers';
import { isObjectShallowEqual } from './utils';

export class AtomCache<T> extends BehaviorSubject<IFig<T>> {
  readonly load = cs<void, void, Promise<T>>((emit) => {
    emit();
    return this.params.getValue$.pipe(take(1), figProjection(this.params.fig$)).toPromise();
  });

  private sub = this.params.fig$
    .pipe(
      skip(1), // skip cuz we get initial state in constructor
      debounceTime(100)
    )
    .subscribe((fig) => {
      if (!isObjectShallowEqual(fig, this.value)) {
        this.next(fig);
      }
    });

  constructor(
    public params: {
      fig$: Atom<IFig<T>>;
      getValue$: Observable<T>;
      shouldLoad: (value: T) => boolean;
    }
  ) {
    super(AtomCache.createState(params));
  }

  static createState<T>(params: { fig$: Atom<IFig<T>>; shouldLoad: (value: T) => boolean }) {
    const fig = params.fig$.get();
    return params.shouldLoad(fig.value)
      ? createFig<T>({ inProgress: true, value: fig.value })
      : fig;
  }

  _subscribe(subscriber: Subscriber<IFig<T>>): Subscription {
    if (this.params.shouldLoad(this.value.value)) {
      this.load();
    }
    return super._subscribe(subscriber);
  }
}
