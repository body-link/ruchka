import { JSONSchema7 } from 'json-schema';

export type TAutomationInstanceID = number;

export interface IAutomationInstance {
  id: TAutomationInstanceID;
  automation: string;
  name: string;
  options: unknown;
  schedule: string | null | 'ASAP';
  isOn: boolean;
}

export interface IAutomationDefinition {
  automation: string;
  name: string;
  description: string;
  recipe: string;
  schemaOptions: JSONSchema7;
}

export interface IAutomationInstanceStatus {
  status: 'crashed' | 'working' | 'stopped';
  error?: string;
}
