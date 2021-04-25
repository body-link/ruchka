import React from 'react';
import { Button } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { Stack } from '../../../generic/components/layout/Stack';
import { isDefined } from '../../../generic/supply/type-guards';

interface IProps {
  onBack?: () => void;
  onNext?: () => void;
  nextText?: string;
}

export const WizardControls = React.memo<IProps>(function WizardControls({
  nextText = 'Next',
  onNext,
  onBack,
}) {
  return (
    <Stack isInline isMiddled>
      <Stack isInline spacing={2} maxWidth={600} flex="1" justifyContent="space-between">
        <Button
          variant="outlined"
          onClick={onBack}
          disabled={!isDefined(onBack)}
          startIcon={<ArrowBackIcon />}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={onNext}
          disabled={!isDefined(onNext)}
          endIcon={<ArrowForwardIcon />}
        >
          {nextText}
        </Button>
      </Stack>
    </Stack>
  );
});
