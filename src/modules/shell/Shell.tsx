import * as React from 'react';
import { Admin, Resource, ListGuesser } from 'react-admin';
import { dataProvider } from './dataProvider';
import { authProvider } from './authProvider';
import { PageLogin } from '../page-login/PageLogin';

export const Shell = () => (
  <Admin dataProvider={dataProvider} authProvider={authProvider} loginPage={PageLogin}>
    <Resource name="users" list={ListGuesser} />
  </Admin>
);
