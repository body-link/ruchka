import React from 'react';
import { Box } from '@material-ui/core';
import { JSField } from './JSField';
import { action } from '@storybook/addon-actions';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'components/form',
};

export const StoryJSField = () => {
  return (
    <Box p={2}>
      <JSField initialValue={`const a = 3;\nconsole.log(a);`} onChange={action('onChange')} />
    </Box>
  );
};

StoryJSField.storyName = '🛡️ JSField';
