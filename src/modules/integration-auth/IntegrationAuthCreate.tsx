import React from 'react';
import {
  Create,
  CreateProps,
  required,
  SimpleForm,
  TextInput,
  useNotify,
  useRedirect,
  useRefresh,
} from 'react-admin';
import { Stack } from '../../generic/components/layout/Stack';
import { JSONInput } from '../../generic/components/form/JSONInput';

export const IntegrationAuthCreate: React.FC<CreateProps> = (props) => {
  const notify = useNotify();
  const refresh = useRefresh();
  const redirect = useRedirect();

  const onSuccess = () => {
    notify('ra.notification.created', 'info', { smart_count: 1 });
    redirect('/IntegrationAuth');
    refresh();
  };

  return (
    <Create {...props} onSuccess={onSuccess}>
      <SimpleForm>
        <Stack spacing={1}>
          <Stack isInline spacing={2}>
            <TextInput source="integration" validate={required()} fullWidth />
            <TextInput source="profile" validate={required()} fullWidth />
          </Stack>
          <JSONInput source="data" validate={required()} />
        </Stack>
      </SimpleForm>
    </Create>
  );
};
