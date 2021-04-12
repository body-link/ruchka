import React from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Radio,
  Typography,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { Stack } from '../../../generic/components/layout/Stack';
import { useObservable } from '../../../generic/supply/react-helpers';
import { cacheDefinitions$ } from '../cache';
import { isDefined } from '../../../generic/supply/type-guards';

interface IProps {
  automation?: string;
  onChange: (automation: string) => void;
}

export const SelectAutomation = React.memo<IProps>(function SelectAutomation({
  automation,
  onChange,
}) {
  const { fig, value } = useObservable(cacheDefinitions$);
  const isBlocked = fig.inProgress || isDefined(fig.error);
  return (
    <Paper variant="outlined">
      {isBlocked && (
        <Stack isMiddled height={500} p={4} boxSizing="border-box">
          {fig.inProgress && <CircularProgress thickness={3} />}
          {!fig.inProgress && isDefined(fig.error) && (
            <Alert
              severity="error"
              action={
                <Button color="inherit" size="small" onClick={cacheDefinitions$.load}>
                  Retry
                </Button>
              }
            >
              {fig.error.message}
            </Alert>
          )}
        </Stack>
      )}
      {!isBlocked && (
        <Stack isInline height={500}>
          <List style={{ overflow: 'auto', width: 300 }}>
            {Object.values(value).map(({ automation: a, name, description }, index) => {
              return (
                <React.Fragment key={a}>
                  {index !== 0 && <Divider component="li" />}
                  <ListItem button onClick={() => onChange(a)}>
                    <ListItemIcon>
                      <Radio checked={automation === a} />
                    </ListItemIcon>
                    <ListItemText primary={name} secondary={description} />
                  </ListItem>
                </React.Fragment>
              );
            })}
          </List>
          <Divider orientation="vertical" flexItem />
          <Box p={4} flex={1} style={{ overflow: 'auto' }}>
            {isDefined(automation) && (
              <Typography>
                <ReactMarkdown>{value[automation].recipe}</ReactMarkdown>
              </Typography>
            )}
            {!isDefined(automation) && <Alert severity="info">Please select automation</Alert>}
          </Box>
        </Stack>
      )}
    </Paper>
  );
});
