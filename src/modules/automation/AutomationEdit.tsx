import React from 'react';
import {
  BooleanInput,
  Edit,
  EditProps,
  required,
  SimpleForm,
  TextInput,
  useEditController,
  DeleteButton,
} from 'react-admin';
import cronParser from 'cron-parser';
import { useFormState } from 'react-final-form';
import SaveIcon from '@material-ui/icons/Save';
import Form from '@rjsf/material-ui';
import { IChangeEvent, ISubmitEvent } from '@rjsf/core';
import { Box, Button, CircularProgress, Typography } from '@material-ui/core';
import { Stack } from '../../generic/components/layout/Stack';
import { AutomationDefinition } from './components/AutomationDefinition';
import { useObservable } from '../../generic/supply/react-helpers';
import { isDefined, isPresent, isText } from '../../generic/supply/type-guards';
import { cacheDefinitions$ } from './cache';
import { IAutomationInstance } from '../api-tachka/types/automation';

export const AutomationEdit: React.FC<EditProps> = (props) => {
  const controllerProps = useEditController({ ...props, mutationMode: 'optimistic' });
  const { save, saving, loading } = controllerProps;
  const item = controllerProps.record as IAutomationInstance;
  return (
    <Edit {...controllerProps} id={(item.id as unknown) as string}>
      <SimpleForm toolbar={<None />}>
        <FormContent item={item} save={save} isBlocked={saving || loading} />
      </SimpleForm>
    </Edit>
  );
};

const validateSchedule = (value: string = '') => {
  value = isText(value) ? value.trim() : '';
  if (value === '' || value === 'ASAP') {
    return;
  } else {
    try {
      cronParser.parseExpression(value);
      return;
    } catch (error) {
      return 'Should be ASAP or cron expression';
    }
  }
};

const None = () => null;

export const FormContent = React.memo<{
  item: IAutomationInstance;
  save: (data: Partial<IAutomationInstance>) => void;
  isBlocked: boolean;
}>(function FormContent({ item, save, isBlocked }) {
  const { value: definitions } = useObservable(cacheDefinitions$);
  const definition = definitions[item.automation];

  const formState = React.useRef<IFormState>({
    valid: false,
    values: {
      name: item.name,
      schedule: item.schedule ?? undefined,
      isOn: item.isOn,
    },
  });
  useFormState({
    onChange: (s) => {
      const nextFormState = (s as unknown) as IFormState;
      if (isPresent(nextFormState.values.schedule)) {
        nextFormState.values.schedule = nextFormState.values.schedule.trim();
        if (nextFormState.values.schedule === '') {
          delete nextFormState.values.schedule;
        }
      }
      formState.current = nextFormState;
    },
    subscription: {
      values: true,
      valid: true,
    },
  });

  const [options, setOptions] = React.useState<unknown>(item.options);

  const onSubmit = React.useCallback(
    ({ formData, errors }: ISubmitEvent<unknown>) => {
      if (errors.length === 0 && formState.current.valid) {
        save({
          ...formState.current.values,
          schedule: formState.current.values.schedule ?? null,
          options: formData,
        });
      }
    },
    [save]
  );

  const onChange = React.useCallback(({ formData }: IChangeEvent<unknown>) => {
    setOptions(formData);
  }, []);

  return (
    <div>
      {isDefined(definition) && (
        <Stack isInline spacing={3}>
          <Stack spacing={1} width={500}>
            <TextInput
              source="name"
              label="Name (used only for your convenience to distinguish)"
              validate={required()}
              disabled={isBlocked}
            />
            <Stack isInline isCentered spacing={2}>
              <TextInput
                source="schedule"
                validate={validateSchedule}
                style={{ flex: 1 }}
                disabled={isBlocked}
              />
              <BooleanInput
                source="isOn"
                label="Is Active"
                defaultValue={true}
                disabled={isBlocked}
              />
            </Stack>
            <Stack>
              <Typography variant="h5">{definition.name} options:</Typography>
              <Form
                liveValidate
                showErrorList={false}
                schema={definition.schemaOptions}
                formData={options}
                onChange={onChange}
                onSubmit={onSubmit}
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
                    {isBlocked && (
                      <CircularProgress size={18} thickness={2} style={{ marginRight: '.5em' }} />
                    )}
                    {!isBlocked && <SaveIcon style={{ marginRight: '.5em' }} />}
                    Save
                  </Button>
                  <DeleteButton basePath="/automation" record={item} />
                </Stack>
              </Form>
            </Stack>
          </Stack>
          <Box flex={1}>
            <AutomationDefinition automation={definition.automation} />
          </Box>
        </Stack>
      )}
    </div>
  );
});

interface IFormState {
  valid: boolean;
  values: { name?: string; schedule?: string; isOn: boolean };
}
