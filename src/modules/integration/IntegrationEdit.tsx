import React from 'react';
import Form from '@rjsf/material-ui';
import { ISubmitEvent } from '@rjsf/core';
import SaveIcon from '@material-ui/icons/Save';
import { Button, CircularProgress } from '@material-ui/core';
import { EditContextProvider, EditProps, useEditController } from 'react-admin';
import { IIntegrationDataListItem } from '../api-tachka/types/integration';
import { Stack } from '../../generic/components/layout/Stack';
import { isDefined } from '../../generic/supply/type-guards';

export const IntegrationEdit: React.FC<EditProps> = (props) => {
  const controllerProps = useEditController({ ...props, mutationMode: 'optimistic' });
  const { save, saving, loading } = controllerProps;
  const isBlocked = saving || loading;
  const { id, data, schema } = controllerProps.record as IIntegrationDataListItem;

  const value = React.useMemo(() => {
    return {
      onSubmit: ({ formData, errors }: ISubmitEvent<unknown>) => {
        if (errors.length === 0) {
          save({ id, data: formData });
        }
      },
      onRemove: () => {
        save({ id });
      },
    };
  }, [save, id]);

  return (
    <EditContextProvider value={controllerProps}>
      <Form
        liveValidate
        schema={schema}
        formData={data}
        onSubmit={value.onSubmit}
        disabled={isBlocked}
      >
        <Stack isInline spacing={2} p="8px 0" justifyContent="space-between">
          <Button
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            disabled={isBlocked}
          >
            {saving && <CircularProgress size={18} thickness={2} style={{ marginRight: '.5em' }} />}
            {!saving && <SaveIcon style={{ marginRight: '.5em' }} />}
            Save
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={value.onRemove}
            disabled={!isDefined(data) || isBlocked}
          >
            Remove configuration data
          </Button>
        </Stack>
      </Form>
    </EditContextProvider>
  );
};
