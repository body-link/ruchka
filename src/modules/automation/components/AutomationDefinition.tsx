import React from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Typography,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { Stack } from '../../../generic/components/layout/Stack';
import { useObservable } from '../../../generic/supply/react-helpers';
import { cacheDefinitions$ } from '../cache';
import { isDefined } from '../../../generic/supply/type-guards';

interface IProps {
  automation: string;
  onChange?: () => void;
}

export const AutomationDefinition = React.memo<IProps>(function AutomationDefinition({
  automation,
  onChange,
}) {
  const { value, error, inProgress } = useObservable(cacheDefinitions$);
  const isBlocked = inProgress || isDefined(error);
  return (
    <Paper variant="outlined">
      {isBlocked && (
        <Stack isMiddled height={500} p={4} boxSizing="border-box">
          {inProgress && <CircularProgress thickness={3} />}
          {!inProgress && isDefined(error) && (
            <Alert
              severity="error"
              action={
                <Button color="inherit" size="small" onClick={cacheDefinitions$.load}>
                  Retry
                </Button>
              }
            >
              {error.message}
            </Alert>
          )}
        </Stack>
      )}
      {!isBlocked && (
        <Stack height={500}>
          <List>
            <ListItem>
              <ListItemText
                primary={value[automation].name}
                secondary={value[automation].description}
              />
              {isDefined(onChange) && (
                <ListItemSecondaryAction>
                  <Button variant="outlined" onClick={onChange}>
                    Change
                  </Button>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          </List>
          <Divider />
          <Box p={4} flex={1} style={{ overflow: 'auto' }}>
            <Typography>
              <ReactMarkdown>{value[automation].recipe}</ReactMarkdown>
            </Typography>
          </Box>
        </Stack>
      )}
    </Paper>
  );
});
