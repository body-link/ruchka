export interface ITokenPayload {
  iat: number;
  name: string;
  scope: ETokenScope[];
  rg?: string[]; // Record groups for RecordByGroupInclude|RecordByGroupExclude
}

export enum ETokenScope {
  Client = 'c',
  RecordByGroupInclude = 'rgi',
  RecordByGroupExclude = 'rge',
}
