import React from 'react';
import {
  ListContextProvider,
  ResourceComponentProps,
  useListContext,
  useListController,
} from 'react-admin';
import { Box } from '@material-ui/core';
import { IAutomationInstance } from '../api-tachka/types/automation';
import { AutomationInstanceCard } from './components/AutomationInstanceCard';

export const AutomationList: React.FC<ResourceComponentProps> = (props) => {
  const controllerProps = useListController(props);
  return (
    <ListContextProvider value={controllerProps}>
      <Grid />
    </ListContextProvider>
  );
};

export const Grid = React.memo(function Grid() {
  const { ids, data } = useListContext();
  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(auto-fill, minmax(288px, 1fr))"
      gridGap="16px"
      p={2}
    >
      {ids.map((id) => {
        const automationInstance = data[id] as IAutomationInstance;
        return <AutomationInstanceCard key={id} automationInstance={automationInstance} />;
      })}
    </Box>
  );
});
