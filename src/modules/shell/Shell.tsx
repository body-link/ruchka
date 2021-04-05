import * as React from 'react';
import { Admin, Resource, ListGuesser } from 'react-admin';
import { dataProvider, EResource } from './dataProvider';
import { authProvider } from './authProvider';
import { PageLogin } from '../page-login/PageLogin';
import { RecordList } from '../record/RecordList';
import { AutomationList } from '../automation/AutomationList';
import { RecordCreate } from '../record/RecordCreate';
import { RecordEdit } from '../record/RecordEdit';

export const Shell = () => (
  <Admin dataProvider={dataProvider} authProvider={authProvider} loginPage={PageLogin}>
    <Resource name={EResource.Record} list={RecordList} create={RecordCreate} edit={RecordEdit} />
    <Resource name={EResource.Automation} list={AutomationList} />
    <Resource name="record" list={ListGuesser} />
  </Admin>
);
