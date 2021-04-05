import React from 'react';
import {
  Create,
  CreateProps,
  SimpleForm,
  NumberInput,
  TextInput,
  required,
  Record,
  useNotify,
  useRefresh,
  useRedirect,
} from 'react-admin';
import { nanoid } from 'nanoid';
import { UnixTimestamp } from '../../generic/components/form/UnixTimestamp';
import { Stack } from '../../generic/components/layout/Stack';
import { JSONInput } from '../../generic/components/form/JSONInput';

export const RecordCreate: React.FC<CreateProps> = (props) => {
  const notify = useNotify();
  const refresh = useRefresh();
  const redirect = useRedirect();

  const onSuccess = () => {
    notify('ra.notification.created', 'info', { smart_count: 1 });
    redirect('/record');
    refresh();
  };

  return (
    <Create {...props} transform={transform} onSuccess={onSuccess}>
      <SimpleForm>
        <Stack isInline spacing={4}>
          <Stack spacing={1}>
            <TextInput
              label="ID"
              source="id"
              defaultValue={nanoid()}
              validate={required()}
              fullWidth
            />
            <TextInput source="group" validate={required()} />
            <TextInput source="bucket" validate={required()} />
            <TextInput source="provider" validate={required()} />
            <Stack isInline spacing={2}>
              <UnixTimestamp
                source="timestamp"
                defaultValue={Math.floor(Date.now() / 1000)}
                validate={required()}
              />
              <NumberInput
                source="offset"
                defaultValue={new Date().getTimezoneOffset()}
                placeholder="null"
                style={{ width: '80px' }}
              />
            </Stack>
          </Stack>
          <Stack flexGrow={1}>
            <JSONInput source="data" validate={required()} />
          </Stack>
        </Stack>
      </SimpleForm>
    </Create>
  );
};

const transform = (data: Record) => ({
  ...data,
  timestamp: parseInt(data.timestamp),
  offset: data.offset ?? null,
});
