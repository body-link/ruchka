import React from 'react';
import { format } from 'date-fns';
import cronParser from 'cron-parser';
import cronToHumanReadable from 'cronstrue';
import { Typography } from '@material-ui/core';
import { IAutomationInstance } from '../../api-tachka/types/automation';
import { Stack } from '../../../generic/components/layout/Stack';

interface IProps {
  schedule: IAutomationInstance['schedule'];
}

export const Schedule = React.memo<IProps>(function Schedule({ schedule }) {
  if (schedule === null) {
    return <Typography variant="body2">Manual start</Typography>;
  } else if (schedule === 'ASAP') {
    return <Typography variant="body2">Start once ASAP</Typography>;
  }

  const humanReadable = cronToHumanReadable.toString(schedule, { use24HourTimeFormat: true });
  const nextEvent = format(
    cronParser.parseExpression(schedule, { utc: true }).next().toDate(),
    'PPPPpppp'
  );

  return (
    <Stack spacing={0.5}>
      <Typography variant="body2">Scheduled: {humanReadable}</Typography>
      <Typography variant="body2" color="textSecondary">
        Next start: {nextEvent}
      </Typography>
    </Stack>
  );
});
