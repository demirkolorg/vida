import { useMemo } from 'react';
import { DataTable } from '@/components/table/DataTable';
import { Birim_Columns as EntityColumns } from './columns';
import { BirimContextMenu as EntityContextMenu } from './contextMenu';

const sorting = [{ id: 'ad', desc: false }];
const facesFilterData = [
  { columnId: 'status', title: 'Durum' },
  { columnId: 'createdBy', title: 'Oluşturan' },
];

export function BirimDataTable({ data, isLoading, onRowClick, onRefresh, entityType }) {
  const columns = useMemo(() => EntityColumns(), []);
  const contextMenu = row => <EntityContextMenu entityType={entityType} item={row.original} />;
  return (
    <DataTable
      data={data}
      columns={columns}
      isLoading={isLoading}
      onRefresh={onRefresh}
      entityType={entityType}
      onRowClick={onRowClick}
      rowContextMenu={contextMenu}
      facetedFilterSetup={facesFilterData}
      initialSortingState={sorting}
      // moreButtonRendered={moreButtonRendered}
    />
  );
}
