import React from 'react';
import { Stack } from '../../../generic/components/layout/Stack';
import { WizardControls } from './WizardControls';
import { stateCsvImporter$ } from '../state';
import { Checkbox, FormControlLabel, TextField, Typography } from '@material-ui/core';
import { useObservable } from '../../../generic/supply/react-helpers';
import { PreviewRaw } from './PreviewRaw';
import { isDefined } from '../../../generic/supply/type-guards';
import { PreviewCsv } from './PreviewCsv';

export const Parse = React.memo(function Parse() {
  const { file, parserOptions } = useObservable(stateCsvImporter$);

  const value = React.useMemo(
    () => ({
      onBack: () => {
        stateCsvImporter$.lens('step').set(0);
      },
      onNext: (nextStep: number) => () => {
        stateCsvImporter$.modify((state) => ({
          ...state,
          step: nextStep,
          completed: state.completed < nextStep ? nextStep : state.completed,
        }));
      },
      handleHasHeader: (_: unknown, isChecked: boolean) => {
        stateCsvImporter$.lens('parserOptions').lens('hasHeader').set(isChecked);
      },
      handleSkipEmpty: (_: unknown, isChecked: boolean) => {
        stateCsvImporter$.lens('parserOptions').lens('skipEmpty').set(isChecked);
      },
      handleQuoteChar: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        stateCsvImporter$.lens('parserOptions').lens('quoteChar').set(e.target.value);
      },
      handleEscapeChar: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        stateCsvImporter$.lens('parserOptions').lens('escapeChar').set(e.target.value);
      },
      handleCommentStr: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        stateCsvImporter$.lens('parserOptions').lens('commentStr').set(e.target.value);
      },
    }),
    []
  );

  if (!isDefined(file)) {
    return null;
  }

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="subtitle2">Parser options</Typography>
        <Stack spacing={2}>
          <Stack spacing={2} isInline>
            <FormControlLabel
              control={
                <Checkbox
                  checked={parserOptions.skipEmpty}
                  onChange={value.handleSkipEmpty}
                  color="primary"
                />
              }
              label="Skip empty lines"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={parserOptions.hasHeader}
                  onChange={value.handleHasHeader}
                  color="primary"
                />
              }
              label="First line is header"
            />
          </Stack>
          <Stack spacing={2} isInline>
            <TextField
              label="Character used to quote fields"
              variant="outlined"
              type="string"
              value={parserOptions.quoteChar}
              onChange={value.handleQuoteChar}
            />
            <TextField
              label="Character used to escape the quote character"
              variant="outlined"
              type="string"
              value={parserOptions.escapeChar}
              onChange={value.handleEscapeChar}
            />
            <TextField
              label="String that indicates a comment"
              variant="outlined"
              type="string"
              value={parserOptions.commentStr}
              onChange={value.handleCommentStr}
            />
          </Stack>
        </Stack>
      </Stack>
      <PreviewCsv file={file} parserOptions={parserOptions} />
      <PreviewRaw file={file} />
      <WizardControls onBack={value.onBack} onNext={value.onNext(2)} nextText="Map" />
    </Stack>
  );
});
