import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, shareReplay, takeUntil } from 'rxjs/operators';
import { Atom, ReadOnlyAtom } from '@grammarly/focal';
import { ca } from './action-helpers';
import { isAnyAtom, isDefined, isFunction, isNotNull } from './type-guards';
import { isArrayEqual } from './utils';
import { TOption } from './type-utils';

export const setRef = <T>(ref: React.Ref<T>, instance: T | null): void => {
  if (isNotNull(ref)) {
    if (isFunction(ref)) {
      ref(instance);
    } else {
      (ref as React.MutableRefObject<T | null>).current = instance;
    }
  }
};

export const useForkRef = <T>(refA: React.Ref<T>, refB: React.Ref<T>): React.Ref<T> => {
  return useCallback(
    (instance: T | null) => {
      setRef(refA, instance);
      setRef(refB, instance);
    },
    [refA, refB]
  );
};

export function createUseWatcher<
  TCreate extends (context: {
    didMount$: Observable<void>;
    didUnmount$: Observable<void>;
    currentDeps$: BehaviorSubject<unknown[]>;
  }) => unknown
>(create: TCreate): () => ReturnType<TCreate>;
export function createUseWatcher<TDeps extends unknown[], TReturn>(
  create: (context: {
    didMount$: Observable<void>;
    didUnmount$: Observable<void>;
    currentDeps$: BehaviorSubject<TDeps>;
  }) => TReturn
): (dependencies: TDeps) => TReturn;
export function createUseWatcher<TDeps extends unknown[], TReturn>(
  create: (context: {
    didMount$: Observable<void>;
    didUnmount$: Observable<void>;
    currentDeps$: BehaviorSubject<TDeps>;
  }) => TReturn
): (dependencies?: TDeps) => TReturn {
  return (dependencies) => {
    const deps = (isDefined(dependencies) ? dependencies : []) as TDeps;
    const [deps$, initialize, terminate, result] = useMemo(() => {
      const currentDeps$ = new BehaviorSubject(deps);
      const didUnmount$ = new Subject<void>();
      const didUnmount = () => {
        didUnmount$.next();
        didUnmount$.complete();
        currentDeps$.complete();
      };
      const didMount = ca<void>();
      const didMount$ = didMount.$.pipe(
        shareReplay({
          bufferSize: 1,
          refCount: true,
        }),
        takeUntil(didUnmount$)
      );
      didMount$.subscribe();
      return [
        currentDeps$,
        didMount,
        didUnmount,
        create({
          didMount$,
          didUnmount$,
          currentDeps$,
        }),
      ];
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      initialize();
      return terminate;
    }, [initialize, terminate]);

    const prevDeps = deps$.getValue();
    if (!isArrayEqual(prevDeps, deps)) {
      deps$.next(deps);
    }

    return result;
  };
}

export function createUseWatcherSingleton<TReturn>(
  initialize: (terminate$: Observable<void>) => TReturn
): () => TReturn {
  let refCount = 0;
  let result: TOption<TReturn>;
  let terminate$: TOption<Subject<void>>;
  return () => {
    useEffect(() => {
      if (refCount++ === 0) {
        terminate$ = new Subject<void>();
        result = initialize(terminate$);
      }
      return () => {
        if (--refCount === 0) {
          terminate$!.next();
          terminate$!.complete();
          terminate$ = undefined;
          result = undefined;
        }
      };
    }, []);
    return result!;
  };
}

export function useObservable<T>($: BehaviorSubject<T> | Atom<T> | ReadOnlyAtom<T>): T;
export function useObservable<T>($: Observable<T>): TOption<T>;
export function useObservable<T>($: Observable<T>, defaultValue: T): T;
export function useObservable<T>($: Observable<T>, defaultValue?: T) {
  const [value, setValue] = useState(() => {
    // The conditions order matters
    if (isAnyAtom<T>($)) {
      return $.get();
    } else if ($ instanceof BehaviorSubject) {
      return $.getValue();
    } else {
      return isDefined(defaultValue) ? defaultValue : undefined;
    }
  });
  useEffect(() => {
    const sub = $.pipe(distinctUntilChanged()).subscribe((nextValue) => {
      setValue(() => nextValue); // Use callback to safely transfer fn in stream
    });
    return () => sub.unsubscribe();
  }, [$]);
  return value;
}

export function useObservableFabric<T>(
  fb: () => BehaviorSubject<T> | Atom<T> | ReadOnlyAtom<T>,
  deps: unknown[]
): T;
export function useObservableFabric<T>(fb: () => Observable<T>, deps: unknown[]): TOption<T>;
export function useObservableFabric<T>(
  fb: () => Observable<T>,
  deps: unknown[],
  defaultValue: T
): T;
export function useObservableFabric<T>(fb: () => Observable<T>, deps: unknown[], defaultValue?: T) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const $ = useMemo(fb, deps);
  return useObservable($, defaultValue);
}
