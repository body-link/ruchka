import React from 'react';
import { JsonEditorProps } from 'jsoneditor-react';
import { isDefined } from '../../supply/type-guards';
import { Stack } from '../layout/Stack';
import { FormHelperText, FormLabel } from '@material-ui/core';
import { FieldTitle, InputProps, useInput, useTranslate } from 'react-admin';
import { JSONField } from './JSONField';

interface IProps extends InputProps, Pick<JsonEditorProps, 'mode'> {}

export const JSONInput: React.FC<IProps> = ({ mode = 'code', ...inputProps }) => {
  const translate = useTranslate();
  const { input, meta } = useInput({
    ...inputProps,
    // this fn convert nullable to empty string :-(
    format: (value: unknown) => value ?? NULLABLE,
    parse: (value: unknown) => value,
  });
  const { touched = false, error } = meta;
  return (
    <Stack spacing={1} flexGrow={1}>
      <FormLabel>
        <FieldTitle {...inputProps} />
      </FormLabel>
      <JSONField
        mode={mode}
        value={input.value === NULLABLE ? null : input.value}
        onChange={input.onChange}
        htmlElementProps={{
          onBlur: input.onBlur,
          onFocus: input.onFocus,
          style: {
            flexGrow: 1,
          },
        }}
      />
      <FormHelperText error children={touched && isDefined(error) ? translate(error) : ' '} />
    </Stack>
  );
};

const NULLABLE = '@@**__NULLABLE__**@@';
