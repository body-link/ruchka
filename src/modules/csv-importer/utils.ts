import { isObject, isPresent } from '../../generic/supply/type-guards';
import { IRecordCreate } from '../api-tachka/types/record';
import { TOption } from '../../generic/supply/type-utils';

export const mapRowsToRecords = ({
  code,
  rows,
}: {
  code: string;
  rows: string[][];
}): TOption<IRecordCreate>[] => {
  return rows.map((row) => mapRowToRecord({ code, row }));
};

export const mapRowToRecord = ({
  code,
  row,
}: {
  code: string;
  row: string[];
}): TOption<IRecordCreate> => {
  const variables = Array.from(
    new Set(Array.from(code.matchAll(regExp)).map((m) => Number(m[1])))
  ).reduce((acc, val) => `${acc}const $${val} = '${row[val - 1] ?? ''}';`, '');
  // eslint-disable-next-line no-eval
  const record = eval(`(function(){${variables}${code.trim()}})()`);
  if (isPresent(record)) {
    if (!isObject(record)) {
      throw new Error('Code should return object which represents record');
    }
    return JSON.parse(JSON.stringify(record));
  }
};

const regExp = /\$([1-9][0-9]*)\W/g;
