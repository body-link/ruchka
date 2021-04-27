import * as React from 'react';
import { Route } from 'react-router-dom';
import { Admin, Resource } from 'react-admin';
import IntegrationsIcon from '@material-ui/icons/SettingsInputComponent';
import IntegrationsAuthIcon from '@material-ui/icons/AccountBox';
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
import { AutomationCreate } from '../automation/AutomationCreate';
import { AutomationEdit } from '../automation/AutomationEdit';
import { PageCsvImporter } from '../csv-importer/PageCsvImporter';
import { IntegrationAuthList } from '../integration-auth/IntegrationAuthList';
import { IntegrationAuthEdit } from '../integration-auth/IntegrationAuthEdit';
import { IntegrationAuthCreate } from '../integration-auth/IntegrationAuthCreate';

export const Shell = () => (
  <Admin
    dataProvider={dataProvider}
    authProvider={authProvider}
    loginPage={PageLogin}
    customRoutes={[<Route path="/import/csv" component={PageCsvImporter} />]}
  >
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
      create={AutomationCreate}
      edit={AutomationEdit}
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
    <Resource
      name={EResource.IntegrationAuth}
      list={IntegrationAuthList}
      create={IntegrationAuthCreate}
      edit={IntegrationAuthEdit}
      options={{ label: 'Integrations Auths' }}
      icon={IntegrationsAuthIcon}
    />
  </Admin>
);
