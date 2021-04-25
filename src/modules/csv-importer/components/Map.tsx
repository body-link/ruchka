import React from 'react';
import { Stack } from '../../../generic/components/layout/Stack';
import { WizardControls } from './WizardControls';
import { stateCsvImporter$ } from '../state';
import { JSField } from '../../../generic/components/form/JSField';
import { Box, Typography } from '@material-ui/core';
import { isDefined } from '../../../generic/supply/type-guards';
import { useObservable } from '../../../generic/supply/react-helpers';
import { PreviewCsv } from './PreviewCsv';
import { PreviewRecord } from './PreviewRecord';
import { ISelectedRow } from '../types';

export const Map = React.memo(function Map() {
  const { file, parserOptions, mapOptions } = useObservable(stateCsvImporter$);

  const value = React.useMemo(
    () => ({
      onBack: () => {
        stateCsvImporter$.lens('step').set(1);
      },
      onNext: () => {
        stateCsvImporter$.modify((state) => ({
          ...state,
          step: 3,
          completed: 3,
        }));
      },
      setCode: (code: string) => {
        stateCsvImporter$.lens('mapOptions').lens('code').set(code);
      },
      onSelect: (row: ISelectedRow) => {
        stateCsvImporter$.lens('mapOptions').lens('row').set(row);
      },
    }),
    []
  );

  return (
    <Stack spacing={4}>
      <Stack isInline spacing={2}>
        <Stack spacing={1} flex={1}>
          <Typography variant="subtitle2">JS code map csv item to record</Typography>
          <JSField
            onChange={value.setCode}
            initialValue={mapOptions.code}
            style={{ height: 500 }}
          />
        </Stack>
        <Box flex={1}>
          <PreviewRecord mapOptions={mapOptions} />
        </Box>
      </Stack>
      {isDefined(file) && (
        <PreviewCsv
          file={file}
          parserOptions={parserOptions}
          selectedRow={mapOptions.row}
          onSelect={value.onSelect}
        />
      )}
      <WizardControls onBack={value.onBack} onNext={value.onNext} nextText="Import" />
    </Stack>
  );
});
