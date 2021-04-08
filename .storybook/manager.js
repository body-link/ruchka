import { addons } from '@storybook/addons';
import { create } from '@storybook/theming';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Ruchka',
    brandUrl: 'https://github.com/body-link/ruchka',
  }),
  showRoots: true,
  panelPosition: 'right',
  enableShortcuts: false,
});
