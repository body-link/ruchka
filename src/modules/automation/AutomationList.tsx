import React from 'react';
import { List, BooleanField, Datagrid, TextField, ResourceComponentProps } from 'react-admin';

export const AutomationList: React.FC<ResourceComponentProps> = (props) => {
  return (
    <List {...props}>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="automation" />
        <TextField source="schedule" />
        <BooleanField source="isOn" />
        <TextField source="status" />
      </Datagrid>
    </List>
  );
};
