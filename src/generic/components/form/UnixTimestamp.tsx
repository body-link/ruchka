import React from 'react';
import { startOfToday } from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { FieldTitle, InputProps, useInput } from 'ra-core';
import {
  KeyboardDateTimePicker,
  KeyboardDateTimePickerProps,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { isDefined, isNotNull, isNumber, isText } from '../../supply/type-guards';
import { TIdentifier } from '../../supply/type-utils';
import { useTranslate } from 'react-admin';

interface IProps extends InputProps<KeyboardDateTimePickerProps> {}

export const UnixTimestamp: React.FC<IProps> = ({ options, className, ...inputProps }) => {
  const translate = useTranslate();
  const { input, meta } = useInput({
    ...inputProps,
    // this fn convert nullable to empty string :-(
    format: (value?: TIdentifier) => {
      const timestamp = isText(value) ? parseInt(value) : isNumber(value) ? value : undefined;
      return isDefined(timestamp) ? new Date(timestamp * 1000) : undefined;
    },
    parse: (value: Date | null) =>
      isNotNull(value) ? Math.floor(value.getTime() / 1000).toString() : undefined,
  });
  const { touched = false, error } = meta;
  const hasError = touched && isDefined(error);
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDateTimePicker
        inputVariant="filled"
        ampm={false}
        clearable
        showTodayButton
        initialFocusedDate={startOfToday()}
        format="yyyy/MM/dd HH:mm:ss"
        {...options}
        label={<FieldTitle {...inputProps} />}
        error={hasError}
        className={className}
        helperText={hasError && translate(error)}
        value={input.value ?? null}
        onChange={input.onChange}
        onBlur={input.onBlur}
        onFocus={input.onFocus}
      />
    </MuiPickersUtilsProvider>
  );
};
