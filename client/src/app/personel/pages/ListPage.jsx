import { PageHeader } from '@/components/pages/PageHeader';
import { EntityHuman } from '../constants/api';

import { Personel_Store as EntityStore } from '../constants/store';
import { Personel_DataTable as EntityDataTable } from '../table/dataTable';
import { Personel_StatusDialog as EntityStatusDialog } from '../dialogs/StatusDialog';
import { Personel_CreateSheet as EntityCreateSheet } from '../sheets/CreateSheet';
import { Personel_EditSheet as EntityEditSheet } from '../sheets/EditSheet';
import { Personel_DeleteSheet as EntityDeleteSheet } from '../sheets/DeleteSheet';
import { Personel_DetailSheet as EntityDetailSheet } from '../sheets/DetailSheet';
import { PersonelZimmetSheet } from '../sheets/PersonelZimmetSheet'; // Yeni eklenen import
// Bulk işlem sheet'leri - personel zimmetlerinden iade/devir için gerekli
import { BulkIadeSheet } from '@/app/malzemehareket/sheets/BulkIadeSheet';
import { BulkDevirSheet } from '@/app/malzemehareket/sheets/BulkDevirSheet';

export function Personel_ListPage() {
  return (
    <div className="mx-auto">
      <PageHeader EntityHuman={EntityHuman} useEntityStore={EntityStore} />
      <EntityDataTable />
      <EntityCreateSheet />
      <EntityEditSheet />
      <EntityDeleteSheet />
      <EntityDetailSheet />
      <EntityStatusDialog />
      //!
      <PersonelZimmetSheet />
      <BulkIadeSheet />
      <BulkDevirSheet />
    </div>
  );
}
