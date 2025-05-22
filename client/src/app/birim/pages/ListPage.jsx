import { PageHeader } from '@/components/pages/PageHeader';
import { useBirimStore } from '../constants/store';
import { BirimCreateSheet } from '../sheets/CreateSheet';
import { BirimEditSheet } from '../sheets/EditSheet';
import { BirimDeleteSheet } from '../sheets/DeleteSheet';
import { BirimDetailSheet } from '../sheets/DetailSheet';
import { BirimDataTable } from '../table/dataTable';
import { StatusDialog } from '../dialogs/StatusDialog';
import { EntityHuman } from '../constants/api';

export function BirimListPage() {
  return (
    <div className="container mx-auto">
      <PageHeader EntityHuman={EntityHuman} useEntityStore={useBirimStore} />
      <BirimDataTable />
      <BirimCreateSheet />
      <BirimEditSheet />
      <BirimDeleteSheet />
      <BirimDetailSheet />
      <StatusDialog />
    </div>
  );
}
