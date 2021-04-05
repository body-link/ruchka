import { isDefined, isObject } from '../../../generic/supply/type-guards';

export interface IRecord {
  id: string;
  group: string;
  bucket: string;
  provider: string;
  timestamp: number;
  offset: number | null;
  data: unknown;
}

export interface IRecordListQuery {
  page?: number;
  limit?: number;
  order?: 'timestamp' | '-timestamp';
  group?: string;
  bucket?: string;
  provider?: string;
  from?: number;
  to?: number;
}

export const isRecord = (value: unknown): value is IRecord =>
  isObject(value) && isDefined(value.id) && isDefined(value.group) && isDefined(value.bucket);
