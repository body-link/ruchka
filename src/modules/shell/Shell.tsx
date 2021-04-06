import * as React from 'react';
import { Admin, Resource } from 'react-admin';
import IntegrationsIcon from '@material-ui/icons/SettingsInputComponent';
import RecordsIcon from '@material-ui/icons/InsertDriveFile';
import AutomationsIcon from '@material-ui/icons/Android';
import { dataProvider, EResource } from './dataProvider';
import { authProvider } from './authProvider';
import { PageLogin } from '../page-login/PageLogin';
import { RecordList } from '../record/RecordList';
import { AutomationList } from '../automation/AutomationList';
import { RecordCreate } from '../record/RecordCreate';
import { RecordEdit } from '../record/RecordEdit';
import { IntegrationList } from '../integration/IntegrationList';
import { IntegrationEdit } from '../integration/IntegrationEdit';

export const Shell = () => (
  <Admin dataProvider={dataProvider} authProvider={authProvider} loginPage={PageLogin}>
    <Resource
      name={EResource.Record}
      list={RecordList}
      create={RecordCreate}
      edit={RecordEdit}
      options={{ label: 'Records' }}
      icon={RecordsIcon}
    />
    <Resource
      name={EResource.Automation}
      list={AutomationList}
      options={{ label: 'Automations' }}
      icon={AutomationsIcon}
    />
    <Resource
      name={EResource.IntegrationData}
      list={IntegrationList}
      edit={IntegrationEdit}
      options={{ label: 'Integrations' }}
      icon={IntegrationsIcon}
    />
  </Admin>
);
