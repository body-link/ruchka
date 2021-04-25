import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Paper, Typography } from '@material-ui/core';
import { Stack } from '../../../generic/components/layout/Stack';
import { isDefined } from '../../../generic/supply/type-guards';
import { PreviewRaw } from './PreviewRaw';
import { WizardControls } from './WizardControls';
import { useObservableFabric } from '../../../generic/supply/react-helpers';
import { stateCsvImporter$ } from '../state';

export const SelectFile = React.memo(function SelectFile() {
  const file = useObservableFabric(() => stateCsvImporter$.view('file'), []);

  const onNext = React.useCallback(
    (nextStep: number) => () => {
      stateCsvImporter$.modify((state) => ({
        ...state,
        step: nextStep,
        completed: state.completed < nextStep ? nextStep : state.completed,
      }));
    },
    []
  );

  const dropHandler = React.useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      stateCsvImporter$.modify((state) => ({
        ...state,
        file: acceptedFiles[0],
        completed: state.completed < 1 ? 1 : state.completed,
      }));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: dropHandler,
  });

  return (
    <Stack spacing={4}>
      <Paper
        variant={isDragActive ? 'elevation' : 'outlined'}
        elevation={3}
        style={{ outline: 'none' }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <Stack isMiddled height={isDefined(file) ? 100 : 240}>
          <Typography style={{ userSelect: 'none' }}>
            {isDragActive
              ? 'Drop CSV file here...'
              : isDefined(file)
              ? `Replace file ${file.name}`
              : 'Drag-and-drop CSV file here, or click to select in folder'}
          </Typography>
        </Stack>
      </Paper>
      {isDefined(file) && <PreviewRaw file={file} />}
      <WizardControls onNext={isDefined(file) ? onNext(1) : undefined} nextText="Parse" />
    </Stack>
  );
});
