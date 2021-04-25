import React from 'react';
import { cs, Signal } from 'rxjs-signal';
import { Atom, Lens } from '@grammarly/focal';
import {
  IAutomationInstanceStatus,
  TAutomationInstanceID,
} from '../../api-tachka/types/automation';
import { createUseWatcher, useObservable } from '../../../generic/supply/react-helpers';
import {
  atomProjection,
  createFig,
  figProjection,
  IFig,
} from '../../../generic/supply/atom-helpers';
import { exhaustMap, switchMap, takeUntil } from 'rxjs/operators';
import { defer, NEVER, timer } from 'rxjs';
import { tachka } from '../../shell/tachkaClient';
import { retryStrategy } from '../../../generic/supply/rxjs-helpers';
import { Box, CircularProgress, IconButton, Popover, Typography } from '@material-ui/core';
import { isDefined } from '../../../generic/supply/type-guards';
import StartIcon from '@material-ui/icons/PlayCircleFilled';
import { Stack } from '../../../generic/components/layout/Stack';
import { TOption } from '../../../generic/supply/type-utils';

interface IProps {
  id: TAutomationInstanceID;
}

export const Status = React.memo<IProps>(function Status({ id }) {
  const { start, state$ } = useWatcher([id]);
  const { figStatus, figStart } = useObservable(state$);
  const status = figStatus.value;
  const [anchorEl, setAnchorEl] = React.useState<HTMLSpanElement | null>(null);
  return isDefined(status) ? (
    <>
      {status.status === 'working' ? (
        <Stack isInline isCentered spacing={1} height={32}>
          <Typography>Working</Typography>
          <CircularProgress size={16} thickness={3} />
        </Stack>
      ) : (
        <Stack isInline isCentered spacing={1} height={32}>
          {status.status === 'stopped' ? (
            <Typography>Idle</Typography>
          ) : (
            <>
              <Typography
                color="error"
                onClick={(event) => setAnchorEl(event.currentTarget)}
                style={{ borderBottom: '1px dashed', cursor: 'pointer' }}
              >
                Crashed
              </Typography>
              <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <Box p={2}>
                  <Typography
                    style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxWidth: '620px' }}
                  >
                    {status.error}
                  </Typography>
                </Box>
              </Popover>
            </>
          )}
          {figStart.inProgress && <CircularProgress size={16} thickness={3} color="secondary" />}
          {!figStart.inProgress && (
            <IconButton
              size="small"
              color={isDefined(figStart.error) ? 'secondary' : 'primary'}
              aria-label="Start automation"
              onClick={start}
            >
              <StartIcon />
            </IconButton>
          )}
        </Stack>
      )}
    </>
  ) : (
    <Stack isMiddled height={32}>
      {figStatus.inProgress && <CircularProgress size={16} thickness={3} />}
      {!figStatus.inProgress && isDefined(figStatus.error) && (
        <Typography color="error">{figStatus.error.message}</Typography>
      )}
    </Stack>
  );
});

const useWatcher = createUseWatcher<
  [TAutomationInstanceID],
  { start: Signal; state$: Atom<IState> }
>(({ currentDeps$, didUnmount$ }) => {
  const start = cs();
  const state$ = Atom.create<IState>({
    figStatus: createFig<IAutomationInstanceStatus>(),
    figStart: createFig(),
  });

  const getStatus$ = defer(() => tachka.automationInstanceStatus(currentDeps$.getValue()[0])).pipe(
    figProjection(state$.lens('figStatus'), { errorHandlingStrategy: 'pass' }),
    retryStrategy()
  );

  const start$ = defer(() => tachka.automationInstanceStart(currentDeps$.getValue()[0])).pipe(
    figProjection(state$.lens('figStart'), { skipValue: true }),
    atomProjection(
      state$
        .lens('figStatus')
        .lens('value')
        .lens(
          Lens.create<TOption<IAutomationInstanceStatus>, unknown>(
            () => {},
            () => ({ status: 'working' })
          )
        )
    )
  );

  state$
    .view('figStatus')
    .view('value')
    .view((v) => (v?.status ?? 'working') === 'working')
    .pipe(
      switchMap((isWorking) =>
        isWorking ? timer(0, 2000).pipe(exhaustMap(() => getStatus$)) : NEVER
      ),
      takeUntil(didUnmount$)
    )
    .subscribe();

  start.$.pipe(
    exhaustMap(() => start$),
    takeUntil(didUnmount$)
  ).subscribe();

  return {
    start,
    state$,
  };
});

interface IState {
  figStatus: IFig<TOption<IAutomationInstanceStatus>>;
  figStart: IFig;
}
