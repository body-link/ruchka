import React from 'react';
import { from, NEVER, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Atom } from '@grammarly/focal';
import Alert from '@material-ui/lab/Alert';
import { CircularProgress, Typography } from '@material-ui/core';
import { useObservable, useObservableFabric } from '../../../generic/supply/react-helpers';
import { createFig, figProjection, IFig } from '../../../generic/supply/atom-helpers';
import { isDefined } from '../../../generic/supply/type-guards';
import { Stack } from '../../../generic/components/layout/Stack';
import { IMapOptions } from '../types';
import { mapRowToRecord } from '../utils';
import { JSONView } from '../../../generic/components/form/JSONView';
import { tachka } from '../../shell/tachkaClient';

interface IProps {
  mapOptions: IMapOptions;
}

export const PreviewRecord = React.memo<IProps>(function PreviewRecord({ mapOptions }) {
  const state$ = React.useMemo(() => Atom.create<IFig>(createFig({ value: {} })), []);

  const { value, error, inProgress } = useObservable(state$);

  useObservableFabric(
    () =>
      of({ code: mapOptions.code, row: mapOptions.row.item }).pipe(
        map(mapRowToRecord),
        figProjection(state$, { skipProgress: true }),
        switchMap((record) =>
          isDefined(record)
            ? from(tachka.recordValidate([record])).pipe(figProjection(state$, { skipValue: true }))
            : NEVER
        )
      ),
    [mapOptions]
  );

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Record preview</Typography>
      <JSONView value={value ?? 'This row is gonna be skipped'} />
      {inProgress && (
        <Alert severity="info" icon={<CircularProgress thickness={3} size={22} />}>
          Validating record type
        </Alert>
      )}
      {!inProgress &&
        (isDefined(error) ? (
          <Alert severity="error">{error.message}</Alert>
        ) : (
          <Alert severity="success">Record is valid</Alert>
        ))}
    </Stack>
  );
});
