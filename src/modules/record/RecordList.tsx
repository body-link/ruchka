import React from 'react';
import {
  BulkActionProps,
  BulkDeleteButton,
  BulkDeleteButtonProps,
  BulkExportButton,
  BulkExportButtonProps,
  Datagrid,
  Filter,
  FilterProps,
  FunctionField,
  List,
  Pagination,
  PaginationProps,
  ResourceComponentProps,
  TextField,
  TextInput,
} from 'react-admin';
import { isRecord } from '../api-tachka/types/record';
import { UnixTimestamp } from '../../generic/components/form/UnixTimestamp';
import { format } from 'date-fns';
import { RecordEdit } from './RecordEdit';

export const RecordList: React.FC<ResourceComponentProps> = (props) => {
  return (
    <List
      {...props}
      perPage={50}
      pagination={<RecordPagination />}
      sort={{ field: 'timestamp', order: 'DESC' }}
      filters={<RecordFilter />}
      bulkActionButtons={<RecordBulkActionButtons />}
    >
      <Datagrid rowClick="expand" expand={<RecordEdit />}>
        <TextField source="group" sortable={false} />
        <TextField source="bucket" sortable={false} />
        <TextField source="provider" sortable={false} />
        <FunctionField label="Time" render={getDate} sortBy="timestamp" />
      </Datagrid>
    </List>
  );
};

const getDate = (record: unknown) => {
  if (isRecord(record)) {
    return format(new Date(record.timestamp * 1000), '📅 yyyy/MM/dd HH:mm:ss 🕒 H:mm:ss');
  }
};

const RecordPagination: React.FC<PaginationProps> = (props) => (
  <Pagination rowsPerPageOptions={[25, 50, 100]} {...props} />
);

const RecordFilter: React.FC<Omit<FilterProps, 'children'>> = (props) => (
  <Filter {...props}>
    <TextInput label="Group" source="group" alwaysOn />
    <TextInput label="Bucket" source="bucket" alwaysOn />
    <TextInput label="Provider" source="provider" alwaysOn />
    <UnixTimestamp label="From date-time" source="from" />
    <UnixTimestamp label="To date-time" source="to" />
  </Filter>
);

const RecordBulkActionButtons: React.FC<BulkActionProps> = (props) => (
  <>
    <BulkExportButton {...(props as BulkExportButtonProps)} />
    <BulkDeleteButton {...(props as BulkDeleteButtonProps)} />
  </>
);
