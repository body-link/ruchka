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

export interface IIntegrationAuthCreate {
  integration: TIntegrationID;
  profile: string;
  data: unknown;
}

export interface IIntegrationAuth extends IIntegrationAuthCreate {
  id: number;
}

export const isIntegrationDataListItem = (value: unknown): value is IIntegrationDataListItem =>
  isObject(value) && isDefined(value.id) && isDefined(value.schema);

export const isIntegrationAuthListItem = (value: unknown): value is IIntegrationAuth =>
  isObject(value) && isDefined(value.id) && isDefined(value.integration);
