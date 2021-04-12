import React from 'react';
import { Status } from './Status';
import { Schedule } from './Schedule';
import { Stack } from '../../../generic/components/layout/Stack';
import { Box, Typography } from '@material-ui/core';
import { AutomationInstanceCard } from './AutomationInstanceCard';
import { SelectAutomation } from './SelectAutomation';
import { TOption } from '../../../generic/supply/type-utils';

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

export const StoryAutomationInstanceCard = () => {
  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(auto-fill, minmax(288px, 1fr))"
      gridGap="16px"
      p={2}
    >
      <AutomationInstanceCard
        automationInstance={{
          id: 3,
          automation: 'automation-google-photos-food',
          name: 'SZ google photos',
          options: {
            recordGroup: 'photos-group-sz',
            profile: 'sukazavr@gmail.com',
            initialFromDate: '2019-09-01T00:00:00.000Z',
          },
          schedule: null,
          isOn: true,
        }}
      />
      <AutomationInstanceCard
        automationInstance={{
          id: 3,
          automation: 'automation-google-photos-food',
          name: 'SZ google photos',
          options: {
            recordGroup: 'photos-group-sz',
            profile: 'sukazavr@gmail.com',
            initialFromDate: '2019-09-01T00:00:00.000Z',
          },
          schedule: null,
          isOn: false,
        }}
      />
      <AutomationInstanceCard
        automationInstance={{
          id: 3,
          automation: 'automation-google-photos-food',
          name: 'SZ google photos',
          options: {
            recordGroup: 'photos-group-sz',
            profile: 'sukazavr@gmail.com',
            initialFromDate: '2019-09-01T00:00:00.000Z',
          },
          schedule: 'ASAP',
          isOn: true,
        }}
      />
      <AutomationInstanceCard
        automationInstance={{
          id: 3,
          automation: 'automation-google-photos-food',
          name: 'SZ google photos',
          options: {
            recordGroup: 'photos-group-sz',
            profile: 'sukazavr@gmail.com',
            initialFromDate: '2019-09-01T00:00:00.000Z',
          },
          schedule: '30 9 * * 1-5',
          isOn: true,
        }}
      />
    </Box>
  );
};

StoryAutomationInstanceCard.storyName = '🛡️ AutomationInstanceCard';

export const StorySelectAutomation = () => {
  const [automation, setAutomation] = React.useState<TOption<string>>();
  return (
    <Box p={2}>
      <SelectAutomation onChange={setAutomation} automation={automation} />
    </Box>
  );
};

StorySelectAutomation.storyName = '🛡️ SelectAutomation';
