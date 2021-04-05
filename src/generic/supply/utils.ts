import { isDefined } from './type-guards';

export const noop = () => {};

export const convertISOStringToServerFormat = (str: string) => {
  const date = new Date(str);
  const timestamp = Math.floor(date.getTime() / 1000);
  const offset = date.getTimezoneOffset();
  return {
    timestamp,
    offset,
  };
};

export const convertISOStringToTimestamp = (str?: string) =>
  isDefined(str) ? convertISOStringToServerFormat(str).timestamp : undefined;
