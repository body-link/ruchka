export interface IStateCsvImporter {
  step: number;
  completed: number;
  file?: File;
  parserOptions: IParserOptions;
  mapOptions: IMapOptions;
}

export interface IParserOptions {
  hasHeader: boolean;
  skipEmpty: boolean;
  quoteChar: string;
  escapeChar: string;
  commentStr: string;
}

export interface IMapOptions {
  code: string;
  row: ISelectedRow;
}

export interface ISelectedRow {
  item: string[];
  index: number;
}
