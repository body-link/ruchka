import { MonoTypeOperatorFunction, Observable, throwError, timer } from 'rxjs';
import { dematerialize, materialize, mergeMap, retryWhen, tap } from 'rxjs/operators';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debug = <T>(...args: any[]): MonoTypeOperatorFunction<T> => {
  return (source: Observable<T>) =>
    source.pipe(
      materialize(),
      tap((n) => console.log(...args, n)),
      dematerialize()
    );
};

// 60 attempts its ~1h and 1m
export const retryStrategy = <T>(maxAttempts = 60) => {
  return retryWhen<T>((attempts) =>
    attempts.pipe(
      mergeMap((error, i) =>
        i < maxAttempts ? timer((i < 7 ? (i + 1) * 2 : 60) * 1000) : throwError(error)
      )
    )
  );
};
