import React from 'react';
import Papa from 'papaparse';
import { Observable } from 'rxjs';
import { useObservable, useObservableFabric } from '../../../generic/supply/react-helpers';
import { Atom } from '@grammarly/focal';
import { figProjection, IFig } from '../../../generic/supply/atom-helpers';
import { isDefined } from '../../../generic/supply/type-guards';
import { Stack } from '../../../generic/components/layout/Stack';
import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { IParserOptions, ISelectedRow } from '../types';
import { isArrayEqual } from '../../../generic/supply/utils';

interface IProps {
  file: File;
  parserOptions: IParserOptions;
  selectedRow?: ISelectedRow;
  onSelect?: (row: ISelectedRow) => void;
}

export const PreviewCsv = React.memo<IProps>(function PreviewCsv({
  file,
  parserOptions,
  selectedRow,
  onSelect,
}) {
  const state$ = React.useMemo(
    () =>
      Atom.create<IFig<IParseFileState>>({
        inProgress: true,
        value: {
          header: [],
          data: [],
          columns: 0,
          hasMore: false,
        },
      }),
    []
  );

  const { value, error, inProgress } = useObservable(state$);

  React.useEffect(() => {
    if (value.data.length > 0 && isDefined(onSelect) && isDefined(selectedRow)) {
      if (
        selectedRow.index < 0 ||
        (selectedRow.index in value.data &&
          !isArrayEqual(value.data[selectedRow.index], selectedRow.item))
      ) {
        onSelect({ index: 0, item: value.data[0] });
      }
    }
  }, [value, onSelect, selectedRow]);

  useObservableFabric(() => parseFile$(file, parserOptions).pipe(figProjection(state$)), [
    file,
    parserOptions,
  ]);

  const select = React.useCallback(
    (row: ISelectedRow) => {
      if (isDefined(onSelect)) {
        onSelect(row);
      }
    },
    [onSelect]
  );

  const isBlocked = inProgress || isDefined(error);
  const hover = isDefined(onSelect);
  const title =
    value.data.length > 1
      ? `Preview of first ${value.data.length} items${value.hasMore ? ' (has more)' : ''}`
      : 'Preview';

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2">{title}</Typography>
      <Paper
        variant="outlined"
        style={{
          display: 'grid',
          height: 220,
          overflow: 'auto',
          boxSizing: 'border-box',
        }}
      >
        {isBlocked && (
          <Stack isMiddled>
            {inProgress && <CircularProgress thickness={3} />}
            {!inProgress && isDefined(error) && <Alert severity="error">{error.message}</Alert>}
          </Stack>
        )}
        {!isBlocked && (
          <TableContainer>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell width={120}>#</TableCell>
                  {value.header.map((item, i) => (
                    <TableCell key={i} align="right">
                      {item}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {value.data.map((item, index) => (
                  <TableRow
                    key={index}
                    selected={selectedRow?.index === index}
                    hover={hover}
                    onClick={() => select({ item, index })}
                  >
                    <TableCell component="th">{index + 1}</TableCell>
                    {item.map((item, i) => (
                      <TableCell key={i} align="right">
                        {item === '' ? <span style={{ color: 'red' }}>Empty</span> : item}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
      {!isBlocked && isDefined(value.warning) && (
        <Alert severity="warning">{value.warning.message}</Alert>
      )}
    </Stack>
  );
});

const parseFile$ = (file: File, parserOptions: IParserOptions) =>
  new Observable<IParseFileState>((subscriber) => {
    let nChunks = 0;
    const result: IParseFileState = {
      header: [],
      data: [],
      columns: 0,
      hasMore: false,
    };
    Papa.parse(file, {
      skipEmptyLines: parserOptions.skipEmpty ? 'greedy' : false,
      quoteChar: parserOptions.quoteChar,
      escapeChar: parserOptions.escapeChar,
      comments: parserOptions.commentStr,

      chunkSize: 2000,

      error: (error) => {
        subscriber.error(error);
      },

      chunk: ({ data, errors }, parser) => {
        if (++nChunks > 1) {
          result.hasMore = true;
          parser.abort();
        } else {
          (data as string[][]).forEach((item) => {
            if (item.length > result.columns) {
              result.columns = item.length;
            }
            result.data.push(item);
          });
        }
        if (errors.length > 0) {
          result.warning = errors[0];
        }
      },

      complete() {
        const { columns, data } = result;
        if (data.length > 0) {
          data.forEach((item) => {
            if (item.length !== columns) {
              const prevLength = item.length;
              item.length = columns;
              item.fill('', prevLength);
            }
          });
          const nextHeader = parserOptions.hasHeader
            ? (data.shift() as string[])
            : Array.from(Array(columns));
          result.header = nextHeader.map(
            (item, index) => `${index + 1}${isDefined(item) ? `. ${item}` : ''}`
          );
        }
        if (data.length === 0) {
          result.warning = new Error('File has no data');
        }
        subscriber.next(result);
        subscriber.complete();
      },
    });
  });

interface IParseFileState {
  header: string[];
  data: string[][];
  columns: number;
  hasMore: boolean;
  warning?: Papa.ParseError | Error;
}
