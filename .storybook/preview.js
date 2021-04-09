import '../src/init';
import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

export const decorators = [
  (Story) =>
    React.createElement(ThemeProvider, {
      theme: createMuiTheme(),
      children: React.createElement(Story),
    }),
];

export const parameters = {
  layout: 'fullscreen',
  actions: {
    argTypesRegex: '^on[A-Z].*',
  },
};
