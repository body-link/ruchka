import React from 'react';
import Papa from 'papaparse';
import { Observable } from 'rxjs';
import { useObservable, useObservableFabric } from '../../../generic/supply/react-helpers';
import { Atom } from '@grammarly/focal';
import { figProjection, IFig } from '../../../generic/supply/atom-helpers';
import { isDefined } from '../../../generic/supply/type-guards';
import { Stack } from '../../../generic/components/layout/Stack';
import { CircularProgress, Paper, Typography } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

interface IProps {
  file: File;
}

export const PreviewRaw = React.memo<IProps>(function PreviewRaw({ file }) {
  const state$ = React.useMemo(
    () =>
      Atom.create<IFig<IParseFileState>>({
        inProgress: true,
        value: {
          hasMore: false,
          chunk: '',
        },
      }),
    []
  );

  const { value, error, inProgress } = useObservable(state$);

  useObservableFabric(() => parseFile$(file).pipe(figProjection(state$)), [file]);

  const isBlocked = inProgress || isDefined(error);

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Raw content of {file.name}</Typography>
      <Paper
        variant="outlined"
        style={{
          display: 'grid',
          height: 220,
          overflow: 'auto',
          padding: '1em',
          backgroundColor: '#f0f0f0',
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
          <Typography
            style={{
              whiteSpace: 'pre-wrap',
              fontFamily: 'monospace',
              lineHeight: '1.7em',
            }}
          >
            {value.chunk}
            {value.hasMore && (
              <span
                style={{
                  marginLeft: '4px',
                  padding: '2px 4px',
                  backgroundColor: 'black',
                  color: 'white',
                }}
              >
                and more...
              </span>
            )}
          </Typography>
        )}
      </Paper>
      {!isBlocked && isDefined(value.warning) && (
        <Alert severity="warning">{value.warning.message}</Alert>
      )}
    </Stack>
  );
});

const parseFile$ = (file: File) =>
  new Observable<IParseFileState>((subscriber) => {
    let nChunks = 0;
    const result: IParseFileState = {
      hasMore: false,
      chunk: '',
    };
    Papa.parse(file, {
      chunkSize: 2000,

      error: (error) => {
        subscriber.error(error);
      },

      beforeFirstChunk: (chunk) => {
        result.chunk = chunk;
      },

      chunk: ({ errors }, parser) => {
        if (++nChunks > 1) {
          result.hasMore = true;
          parser.abort();
        }
        if (errors.length > 0) {
          result.warning = errors[0];
        }
      },

      complete() {
        subscriber.next(result);
        subscriber.complete();
      },
    });
  });

interface IParseFileState {
  chunk: string;
  hasMore: boolean;
  warning?: Papa.ParseError;
}
