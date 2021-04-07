import React from 'react';
import { BooleanField, Datagrid, List, ResourceComponentProps, TextField } from 'react-admin';

export const AutomationList: React.FC<ResourceComponentProps> = (props) => {
  return (
    <List {...props} pagination={false} bulkActionButtons={false} exporter={false}>
      <Datagrid rowClick="edit">
        <TextField label="ID" source="id" sortable={false} />
        <TextField source="automation" sortable={false} />
        <TextField source="schedule" sortable={false} />
        <BooleanField label="Is ON" source="isOn" sortable={false} />
        <TextField source="status" sortable={false} />
      </Datagrid>
    </List>
  );
};
