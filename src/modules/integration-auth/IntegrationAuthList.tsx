import React from 'react';
import { Datagrid, FunctionField, List, ResourceComponentProps, TextField } from 'react-admin';
import { IntegrationAuthEdit } from './IntegrationAuthEdit';
import { isIntegrationAuthListItem } from '../api-tachka/types/integration';

export const IntegrationAuthList: React.FC<ResourceComponentProps> = (props) => {
  return (
    <List {...props} pagination={false} bulkActionButtons={false} exporter={false}>
      <Datagrid rowClick="expand" expand={<IntegrationAuthEdit />}>
        <TextField label="ID" source="id" sortable={false} />
        <TextField source="integration" sortable={false} />
        <TextField source="profile" sortable={false} />
        <FunctionField label="Data" render={getData} sortable={false} />
      </Datagrid>
    </List>
  );
};

const getData = (record: unknown) => {
  if (isIntegrationAuthListItem(record)) {
    return JSON.stringify(record.data);
  }
};
