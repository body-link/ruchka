import React from 'react';
import { Status } from './Status';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'automation',
};

export const StoryAutomationStatus = () => {
  return <Status id={3} />;
};

StoryAutomationStatus.storyName = '🛡️ Status';
