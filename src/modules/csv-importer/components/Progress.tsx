import React from 'react';
import { TNoop } from '../../../generic/supply/type-utils';
import { Stack } from '../../../generic/components/layout/Stack';
import { Box, Button, LinearProgress, Typography } from '@material-ui/core';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';

interface IProps {
  progress: number;
  onCancel: TNoop;
}

const BorderLinearProgress = withStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 8,
    },
    colorPrimary: {
      backgroundColor: theme.palette.grey[200],
    },
    bar: {
      backgroundColor: theme.palette.success.main,
    },
  })
)(LinearProgress);

export const Progress = React.memo<IProps>(function Progress({ progress, onCancel }) {
  return (
    <Stack isInline isCentered spacing={1}>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(progress)}%`}</Typography>
      </Box>
      <Box flex={1}>
        <BorderLinearProgress variant="determinate" value={progress} />
      </Box>
      <Button onClick={onCancel} color="secondary">
        Cancel
      </Button>
    </Stack>
  );
});
