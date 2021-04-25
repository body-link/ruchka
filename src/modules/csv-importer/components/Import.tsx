import React from 'react';
import produce from 'immer';
import Papa from 'papaparse';
import { cs } from 'rxjs-signal';
import { concat, Observable } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { Atom } from '@grammarly/focal';
import { Button, Step, StepContent, StepLabel, Stepper, Typography } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { Progress } from './Progress';
import { stateCsvImporter$ } from '../state';
import { IResCreated } from '../../api-tachka/types/common';
import { createUseWatcher, useObservable } from '../../../generic/supply/react-helpers';
import {
  isDefined,
  isNotNull,
  isNumber,
  isObject,
  isText,
} from '../../../generic/supply/type-guards';
import { IRecordCreate } from '../../api-tachka/types/record';
import { mapRowsToRecords } from '../utils';
import { tachka } from '../../shell/tachkaClient';
import { createFig, figProjection, IFig } from '../../../generic/supply/atom-helpers';
import { Stack } from '../../../generic/components/layout/Stack';

export const Import = React.memo(function Import() {
  const { cancel, reset, state$ } = useWatcher();
  const {
    stage,
    fig: {
      value: { progress, result },
      error,
    },
  } = useObservable(state$);
  return (
    <Stepper activeStep={stage} orientation="vertical">
      <Step>
        <StepLabel>Validating every record</StepLabel>
        <StepContent>
          <Progress progress={progress} onCancel={cancel} />
          {isDefined(error) && <Alert severity="error">{error.message}</Alert>}
        </StepContent>
      </Step>
      <Step>
        <StepLabel>Creating records</StepLabel>
        <StepContent>
          <Progress progress={progress} onCancel={cancel} />
        </StepContent>
      </Step>
      <Step>
        <StepLabel>Finish</StepLabel>
        <StepContent>
          <Stack spacing={2}>
            {result.created > 0 && (
              <Typography>
                Successfully created <strong>{result.created}</strong> records
              </Typography>
            )}
            {result.ignored > 0 && (
              <Typography>
                Skipped duplicates <strong>{result.ignored}</strong>
              </Typography>
            )}
            <div>
              <Button variant="contained" color="primary" onClick={reset}>
                Select another file
              </Button>
            </div>
          </Stack>
        </StepContent>
      </Step>
    </Stepper>
  );
});

const useWatcher = createUseWatcher(({ didMount$, didUnmount$ }) => {
  const cancel = cs();
  const reset = cs();
  const state$ = Atom.create<IState>({
    stage: 0,
    fig: createFig<IParseFileState>({
      value: {
        progress: 0,
        result: {
          created: 0,
          ignored: 0,
        },
        lastRows: [],
      },
    }),
  });

  didMount$
    .pipe(
      switchMap(() =>
        concat(
          parseFile$((records) => tachka.recordValidate(records)).pipe(
            tap({
              complete: () => {
                state$.lens('stage').set(1);
              },
            })
          ),
          parseFile$((records) => tachka.recordAdd(records)).pipe(
            tap({
              complete: () => {
                state$.lens('stage').set(2);
                stateCsvImporter$.lens('completed').set(5);
              },
            })
          )
        ).pipe(
          tap({
            error: () => {
              stateCsvImporter$.lens('completed').set(4);
            },
          }),
          figProjection(state$.lens('fig'), { skipProgress: true })
        )
      ),
      takeUntil(didUnmount$)
    )
    .subscribe();

  cancel.$.pipe(takeUntil(didUnmount$)).subscribe(() => {
    const {
      stage,
      fig: {
        error,
        value: { lastRows },
      },
    } = state$.get();

    if (stage === 0 && isDefined(error) && error.message.startsWith('400: Validation error')) {
      const potentialIndex = error.message.match(/at (\d+)\./);
      if (isNotNull(potentialIndex)) {
        const index = Number(potentialIndex[1]);
        const item = lastRows[index];
        if (isDefined(item)) {
          return stateCsvImporter$.modify((state) =>
            produce(state, (draft) => {
              draft.step = 2;
              draft.completed = 4;
              draft.mapOptions.row = { item, index };
            })
          );
        }
      }
    }

    stateCsvImporter$.modify((state) => ({ ...state, step: 2, completed: 4 }));
  });

  reset.$.pipe(takeUntil(didUnmount$)).subscribe(() => {
    stateCsvImporter$.lens('step').set(0);
  });

  return { cancel, reset, state$ };
});

interface IState {
  stage: number;
  fig: IFig<IParseFileState>;
}

interface IParseFileState {
  progress: number;
  result: IResCreated;
  lastRows: string[][];
}

const parseFile$ = (work: (records: IRecordCreate[]) => Promise<unknown>) =>
  new Observable<IParseFileState>((subscriber) => {
    let nChunks = 0;
    let estimated = 63;
    let processed = 0;
    const { file, parserOptions, mapOptions } = stateCsvImporter$.get();

    if (!isDefined(file)) {
      return subscriber.error(new Error('Please select file'));
    }

    const result: IParseFileState = {
      progress: 0,
      result: {
        created: 0,
        ignored: 0,
      },
      lastRows: [],
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

      chunk: ({ data }, parser) => {
        try {
          if (subscriber.closed) {
            return parser.abort();
          }

          parser.pause();

          const rows = data.map((item) => (item as unknown[]).map((i) => (isText(i) ? i : '')));

          // for first chunk
          if (++nChunks === 1) {
            if (parserOptions.hasHeader) {
              rows.shift();
            }

            if (rows.length === 0) {
              throw new Error('File has no data');
            }

            result.progress = 2;

            // estimate amount of records in file
            const totalRowBytes = rows.reduce((prevCount, row) => {
              const rowBytes = row.reduce((prev, item) => {
                return prev + countUTF8Bytes(item) + 1; // add a byte for separator or newline
              }, 0);
              return prevCount + rowBytes;
            }, 0);

            const averageRowSize = totalRowBytes / rows.length;

            if (averageRowSize > 1) {
              estimated = file.size / averageRowSize;
            }
          }

          const records: IRecordCreate[] = [];
          const lastRows: string[][] = [];

          mapRowsToRecords({ code: mapOptions.code, rows }).forEach((record, index) => {
            if (isDefined(record)) {
              records.push(record);
              lastRows.push(rows[index]);
            }
          });

          subscriber.next({ ...result, lastRows });

          const afterWork = records.length > 0 ? work(records) : Promise.resolve();

          afterWork
            .then((res) => {
              // inputs hand-picked so that correctly estimated total is about 75% of the bar
              const progressPower = 2.5 * ((processed += rows.length) / estimated);
              const progressLeft = 0.5 ** progressPower;

              // convert to .1 percent precision for smoother bar display
              result.progress = Math.floor(1000 - 1000 * progressLeft) / 10;

              if (isResCreated(res)) {
                result.result.created += res.created;
                result.result.ignored += res.ignored;
              }

              subscriber.next({ ...result });
              parser.resume();
            })
            .catch((error) => {
              subscriber.error(error);
            });
        } catch (error) {
          subscriber.error(error);
        }
      },

      complete() {
        subscriber.next({ ...result, progress: 100 });
        subscriber.complete();
      },
    });
  });

const countUTF8Bytes = (item: string) => {
  // re-encode into UTF-8
  const escaped = encodeURIComponent(item);
  // convert byte escape sequences into single character
  const normalized = escaped.replace(/%\d\d/g, '_');
  return normalized.length;
};

const isResCreated = (res: unknown): res is IResCreated =>
  isObject(res) && isNumber(res.created) && isNumber(res.ignored);
