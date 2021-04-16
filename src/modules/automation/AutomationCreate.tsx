import React from 'react';
import {
  BooleanInput,
  Create,
  CreateProps,
  Record as RaRecord,
  required,
  SimpleForm,
  TextInput,
  useCreateController,
} from 'react-admin';
import cronParser from 'cron-parser';
import { useFormState } from 'react-final-form';
import SaveIcon from '@material-ui/icons/Save';
import Form from '@rjsf/material-ui';
import { IChangeEvent, ISubmitEvent } from '@rjsf/core';
import { Box, Button, CircularProgress, Typography } from '@material-ui/core';
import { SelectAutomation } from './components/SelectAutomation';
import { TOption } from '../../generic/supply/type-utils';
import { Stack } from '../../generic/components/layout/Stack';
import { AutomationDefinition } from './components/AutomationDefinition';
import { useObservable } from '../../generic/supply/react-helpers';
import { isDefined } from '../../generic/supply/type-guards';
import { cacheDefinitions$ } from './cache';

export const AutomationCreate: React.FC<CreateProps> = (props) => {
  const controllerProps = useCreateController(props);
  const { save, saving, loading } = controllerProps;
  const callback = React.useCallback((data: unknown) => save(data as RaRecord, '/automation'), [
    save,
  ]);
  return (
    <Create {...controllerProps}>
      <SimpleForm toolbar={<None />}>
        <FormContent save={callback} isBlocked={saving || loading} />
      </SimpleForm>
    </Create>
  );
};

const validateSchedule = (value: string = '') => {
  value = value.trim();
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

export const FormContent = React.memo<{ save: (data: unknown) => void; isBlocked: boolean }>(
  function FormContent({ save, isBlocked }) {
    const { fig, value: definitions } = useObservable(cacheDefinitions$);
    const areDefinitionsReady = !(fig.inProgress || isDefined(fig.error));

    const formState = React.useRef<IFormState>({
      valid: false,
      values: {
        isOn: true,
      },
    });
    useFormState({
      onChange: (s) => {
        const nextFormState = (s as unknown) as IFormState;
        if (isDefined(nextFormState.values.schedule)) {
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

    const [stage, setStage] = React.useState(0);
    const [automation, setAutomation] = React.useState<TOption<string>>();
    const [options, setOptions] = React.useState<unknown>();

    const automationOnChange = React.useCallback(
      (nextAutomation: string) => {
        if (nextAutomation !== automation) {
          setAutomation(nextAutomation);
          setOptions(undefined);
        }
        setStage(1);
      },
      [automation]
    );

    const onSubmit = React.useCallback(
      ({ formData, errors }: ISubmitEvent<unknown>) => {
        if (errors.length === 0 && formState.current.valid) {
          save({
            automation,
            ...formState.current.values,
            schedule: formState.current.values.schedule ?? null,
            options: formData,
          });
        }
      },
      [save, automation]
    );

    const onChange = React.useCallback(({ formData }: IChangeEvent<unknown>) => {
      setOptions(formData);
    }, []);

    return (
      <div>
        {stage === 0 && <SelectAutomation automation={automation} onChange={automationOnChange} />}
        {stage === 1 && isDefined(automation) && areDefinitionsReady && (
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
                <Typography variant="h5">{definitions[automation].name} options:</Typography>
                <Form
                  liveValidate
                  showErrorList={false}
                  schema={definitions[automation].schemaOptions}
                  formData={options}
                  onChange={onChange}
                  onSubmit={onSubmit}
                  disabled={isBlocked}
                >
                  <Stack isInline spacing={2} p="8px 0">
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
                  </Stack>
                </Form>
              </Stack>
            </Stack>
            <Box flex={1}>
              <AutomationDefinition
                automation={automation}
                onChange={isBlocked ? undefined : () => setStage(0)}
              />
            </Box>
          </Stack>
        )}
      </div>
    );
  }
);

interface IFormState {
  valid: boolean;
  values: { name?: string; schedule?: string; isOn: boolean };
}
