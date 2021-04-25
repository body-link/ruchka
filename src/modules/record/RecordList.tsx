import React, { cloneElement, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import {
  BulkActionProps,
  BulkDeleteButton,
  BulkDeleteButtonProps,
  BulkExportButton,
  BulkExportButtonProps,
  Datagrid,
  Filter,
  FilterProps,
  ListActionsProps,
  FunctionField,
  List,
  Pagination,
  PaginationProps,
  ResourceComponentProps,
  TextField,
  TextInput,
  Button,
  CreateButton,
  ExportButton,
  TopToolbar,
  sanitizeListRestProps,
  useListContext,
  useResourceContext,
  useResourceDefinition,
} from 'react-admin';
import ImportIcon from '@material-ui/icons/Publish';
import { isRecord } from '../api-tachka/types/record';
import { UnixTimestamp } from '../../generic/components/form/UnixTimestamp';
import { RecordEdit } from './RecordEdit';

export const RecordList: React.FC<ResourceComponentProps> = (props) => {
  return (
    <List
      {...props}
      perPage={50}
      pagination={<RecordPagination />}
      sort={{ field: 'timestamp', order: 'DESC' }}
      filters={<RecordFilter />}
      actions={<RecordListActions />}
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
    return format(new Date(record.timestamp * 1000), '📅 yyyy/MM/dd 🕒 H:mm:ss');
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

const RecordListActions: React.FC<ListActionsProps> = (props) => {
  const { className, exporter, filters, ...rest } = props;
  const {
    currentSort,
    displayedFilters,
    filterValues,
    basePath,
    selectedIds,
    showFilter,
    total,
  } = useListContext(props);
  const resource = useResourceContext(rest);
  const { hasCreate } = useResourceDefinition(rest);
  return useMemo(
    () => (
      <TopToolbar className={className} {...sanitizeListRestProps(rest)}>
        {filters &&
          cloneElement(filters, {
            resource,
            showFilter,
            displayedFilters,
            filterValues,
            context: 'button',
          })}
        {hasCreate && <CreateButton basePath={basePath} />}
        {exporter !== false && (
          <ExportButton
            disabled={total === 0}
            resource={resource}
            sort={currentSort}
            filterValues={filterValues}
          />
        )}
        <Button component={Link} to="/import/csv" label="Import csv">
          <ImportIcon />
        </Button>
      </TopToolbar>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resource, displayedFilters, filterValues, selectedIds, filters, total]
  );
};
