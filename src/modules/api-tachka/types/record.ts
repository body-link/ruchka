export interface IRecord {
  id: string;
  bucket: string;
  provider: string;
  timestamp: number;
  offset?: number;
  data: unknown;
}

export interface IRecordListQuery {
  page?: number;
  limit?: number;
  order?: 'timestamp' | '-timestamp';
  bucket?: string;
  provider?: string;
  from?: number;
  to?: number;
}
