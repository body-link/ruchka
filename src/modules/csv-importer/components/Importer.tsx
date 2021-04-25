import React from 'react';
import { Box, Step, StepButton, StepLabel, Stepper } from '@material-ui/core';
import { SelectFile } from './SelectFile';
import { isDefined } from '../../../generic/supply/type-guards';
import { useObservableFabric } from '../../../generic/supply/react-helpers';
import { stateCsvImporter$ } from '../state';
import { Parse } from './Parse';
import { Map } from './Map';
import { Import } from './Import';

export const Importer = React.memo(function Importer() {
  const { step, completed } = useObservableFabric(
    () => stateCsvImporter$.view((v) => (isDefined(v.file) ? v : { step: 0, completed: 0 })),
    []
  );
  return (
    <Box>
      <Stepper activeStep={step} nonLinear>
        <Step>
          <StepButton
            onClick={() => stateCsvImporter$.lens('step').set(0)}
            disabled={completed === 3 || step === 0}
            completed={completed > 0}
          >
            Select File
          </StepButton>
        </Step>
        <Step>
          <StepButton
            onClick={() => stateCsvImporter$.lens('step').set(1)}
            disabled={completed === 3 || completed < 1 || step === 1}
            completed={completed > 1}
          >
            Parse
          </StepButton>
        </Step>
        <Step>
          <StepButton
            onClick={() => stateCsvImporter$.lens('step').set(2)}
            disabled={completed === 3 || completed < 2 || step === 2}
            completed={completed > 2}
          >
            Map
          </StepButton>
        </Step>
        <Step completed={completed > 4}>
          <StepLabel>Import</StepLabel>
        </Step>
      </Stepper>
      <Box p={2}>
        {step === 0 && <SelectFile />}
        {step === 1 && <Parse />}
        {step === 2 && <Map />}
        {step === 3 && <Import />}
      </Box>
    </Box>
  );
});
