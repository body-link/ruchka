import React from 'react';
import { Status } from './Status';
import { Schedule } from './Schedule';
import { Stack } from '../../../generic/components/layout/Stack';
import { Typography } from '@material-ui/core';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'automation',
};

export const StoryAutomationStatus = () => {
  return <Status id={3} />;
};

StoryAutomationStatus.storyName = '🛡️ Status';

export const StoryAutomationSchedule = () => {
  return (
    <Stack spacing={5}>
      <Stack spacing={2}>
        <Typography variant="subtitle2">null</Typography>
        <Schedule schedule={null} />
      </Stack>
      <Stack spacing={2}>
        <Typography variant="subtitle2">ASAP</Typography>
        <Schedule schedule="ASAP" />
      </Stack>
      <Stack spacing={2}>
        <Typography variant="subtitle2">30 9 * * 1-5</Typography>
        <Schedule schedule="30 9 * * 1-5" />
      </Stack>
    </Stack>
  );
};

StoryAutomationSchedule.storyName = '🛡️ Schedule';
