import { TNullable } from '../../../generic/supply/type-utils';

export interface IResOk {
  ok: true;
}

export interface IResAffected {
  affected: TNullable<number>;
}

export interface IResCreated {
  created: number;
  ignored: number;
}
