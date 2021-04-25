import React from 'react';
import { Importer } from './Importer';
import { Box } from '@material-ui/core';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'csv-importer',
};

export const StoryImporter = () => {
  return (
    <Box p={2}>
      <Importer />
    </Box>
  );
};

StoryImporter.storyName = '🛡️ Importer';
