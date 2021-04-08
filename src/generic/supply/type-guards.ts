/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable } from 'rxjs';
import { Atom, ReadOnlyAtom } from '@grammarly/focal';

type Maybe<T> = T | null | undefined | unknown;

type ObjectCheck<T> = T extends object ? T : Record<any, unknown>;

export function isAnyAtom<T>(value: unknown): value is Atom<T> | ReadOnlyAtom<T> {
  return value instanceof Observable && isFunction((value as any).view);
}

export function isAtom<T>(value: unknown): value is Atom<T> {
  return isAnyAtom(value) && isFunction((value as any).set);
}

export function isReadOnlyAtom<T>(value: unknown): value is ReadOnlyAtom<T> {
  return isAnyAtom(value) && isUndefined((value as any).set);
}

// tslint:disable-next-line: ban-types
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

export function isDefined<T>(value: T): value is Exclude<T, undefined> {
  return value !== undefined;
}

export function isNull(value: unknown): value is null {
  return value === null;
}

export function isNotNull<T>(value: T): value is Exclude<T, null> {
  return value !== null;
}

export function isPresent<T>(value: T): value is NonNullable<T> {
  return value !== undefined && value !== null;
}

export function isError(value: unknown): value is Error {
  const tag = toString.call(value);
  switch (tag) {
    case '[object Error]':
      return true;
    case '[object Exception]':
      return true;
    case '[object DOMException]':
      return true;
    default:
      return value instanceof Error;
  }
}

export function isArray<T>(value: T): value is Extract<T, any[] | ReadonlyArray<any>> {
  return Array.isArray(value) || value instanceof Array;
}

// http://jsperf.com/isobject4
export function isObject<T extends Maybe<{}>>(value: T): value is ObjectCheck<NonNullable<T>> {
  return value !== null && typeof value === 'object';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isText(value: unknown): value is string {
  return isString(value) && value !== '';
}

export function isNotText<T>(value: T): value is Exclude<T, string> {
  return !isText(value);
}

export function isHTMLElement(value: unknown): value is HTMLElement {
  return value instanceof HTMLElement;
}

export function isSVGElement(value: unknown): value is SVGElement {
  return value instanceof SVGElement;
}

export function isMouseEvent(value: unknown): value is MouseEvent {
  return value instanceof MouseEvent;
}
