import { isDefined, isObject } from '../../../generic/supply/type-guards';
import { JSONSchema7 } from 'json-schema';

export type TIntegrationID = string;

export interface IIntegrationData {
  id: TIntegrationID;
  data: unknown;
}

export interface IIntegrationDataListItem {
  id: TIntegrationID;
  data?: unknown;
  schema: JSONSchema7;
}

export const isIntegrationDataListItem = (value: unknown): value is IIntegrationDataListItem =>
  isObject(value) && isDefined(value.id) && isDefined(value.schema);
