import React from 'react';
import { Datagrid, FunctionField, List, ResourceComponentProps, TextField } from 'react-admin';
import { IntegrationEdit } from './IntegrationEdit';
import { isIntegrationDataListItem } from '../api-tachka/types/integration';
import { isDefined } from '../../generic/supply/type-guards';

export const IntegrationList: React.FC<ResourceComponentProps> = (props) => {
  return (
    <List {...props} pagination={false} bulkActionButtons={false} exporter={false}>
      <Datagrid rowClick="expand" expand={<IntegrationEdit />}>
        <TextField label="ID" source="id" sortable={false} />
        <FunctionField label="Status" render={getStatus} sortable={false} />
      </Datagrid>
    </List>
  );
};

const getStatus = (record: unknown) => {
  if (isIntegrationDataListItem(record)) {
    return isDefined(record.data) ? 'Configured ✅' : 'Not configured 🔘';
  }
};
