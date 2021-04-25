import { TNoop, TOption, TPrimitive } from './type-utils';
import { isArray, isDefined, isObject } from './type-guards';

export const noop: TNoop = () => {};

export const getTimestamp = () => Math.floor(Date.now() / 1000);

export const isArrayEqual = <T>(
  arrA: TOption<T[]>,
  arrB: TOption<T[]>,
  toHash?: (item: T) => TPrimitive
): boolean => {
  if (arrA === arrB) {
    return true;
  }

  if (isArray(arrA) && isArray(arrB) && arrA.length === arrB.length) {
    if (isDefined(toHash)) {
      ((arrA as unknown) as TPrimitive[]) = (arrA as T[]).map(toHash);
      ((arrB as unknown) as TPrimitive[]) = (arrB as T[]).map(toHash);
    }
    return arrA.every((item) => arrB.includes(item));
  }

  return false;
};

export const isObjectShallowEqual = <T extends unknown>(objA: T, objB: T): boolean => {
  if (objA === objB) {
    return true;
  }

  if (!isObject(objA) || !isObject(objB)) {
    return false;
  }

  const aKeys = Object.keys(objA);
  const bKeys = Object.keys(objB);
  const len = aKeys.length;

  if (bKeys.length !== len) {
    return false;
  }

  for (let i = 0; i < len; i++) {
    const key = aKeys[i];
    if (objA[key] !== objB[key] || !Object.prototype.hasOwnProperty.call(objB, key)) {
      return false;
    }
  }

  return true;
};
