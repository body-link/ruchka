import React from 'react';
import { EditButton } from 'react-admin';
import { Card, CardActions, CardContent, Typography } from '@material-ui/core';
import { IAutomationInstance } from '../../api-tachka/types/automation';
import { Stack } from '../../../generic/components/layout/Stack';
import { Status } from './Status';
import { Schedule } from './Schedule';

interface IProps {
  automationInstance: IAutomationInstance;
}

export const AutomationInstanceCard = React.memo<IProps>(function AutomationInstanceCard({
  automationInstance,
}) {
  return (
    <Card style={{ display: 'flex', flexDirection: 'column' }}>
      <CardContent style={{ flex: '1' }}>
        <Typography variant="subtitle1">{automationInstance.name}</Typography>
        <Typography color="textSecondary" gutterBottom variant="subtitle2">
          {automationInstance.automation}
        </Typography>
        {automationInstance.isOn && (
          <Stack>
            <Status id={automationInstance.id} />
            <Schedule schedule={automationInstance.schedule} />
          </Stack>
        )}
        {!automationInstance.isOn && (
          <Typography color="textSecondary" variant="overline">
            Disabled
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <EditButton basePath="/automation" label="Edit" record={automationInstance} />
      </CardActions>
    </Card>
  );
});
