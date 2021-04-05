import React from 'react';
import { Edit, EditProps, NumberInput, Record, required, SimpleForm, TextInput } from 'react-admin';
import { UnixTimestamp } from '../../generic/components/form/UnixTimestamp';
import { Stack } from '../../generic/components/layout/Stack';
import { JSONInput } from '../../generic/components/form/JSONInput';

export const RecordEdit: React.FC<EditProps> = (props) => (
  <Edit {...props} transform={transform}>
    <SimpleForm>
      <Stack isInline spacing={4}>
        <Stack spacing={1}>
          <TextInput label="ID" source="id" disabled fullWidth />
          <TextInput source="group" validate={required()} />
          <TextInput source="bucket" validate={required()} />
          <TextInput source="provider" validate={required()} />
          <Stack isInline spacing={2}>
            <UnixTimestamp source="timestamp" validate={required()} />
            <NumberInput source="offset" placeholder="null" style={{ width: '80px' }} />
          </Stack>
        </Stack>
        <Stack flexGrow={1}>
          <JSONInput source="data" validate={required()} />
        </Stack>
      </Stack>
    </SimpleForm>
  </Edit>
);

const transform = (data: Record) => ({
  ...data,
  timestamp: parseInt(data.timestamp),
  offset: data.offset ?? null,
});
