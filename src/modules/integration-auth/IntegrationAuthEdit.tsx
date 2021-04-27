import React from 'react';
import { Edit, EditProps, required, SimpleForm, TextInput } from 'react-admin';
import { Stack } from '../../generic/components/layout/Stack';
import { JSONInput } from '../../generic/components/form/JSONInput';

export const IntegrationAuthEdit: React.FC<EditProps> = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <Stack spacing={1}>
        <Stack isInline spacing={2}>
          <TextInput label="ID" source="id" disabled />
          <TextInput source="integration" validate={required()} fullWidth />
          <TextInput source="profile" validate={required()} fullWidth />
        </Stack>
        <JSONInput source="data" validate={required()} />
      </Stack>
    </SimpleForm>
  </Edit>
);
