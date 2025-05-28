import { PageHeader } from '@/components/pages/PageHeader';
import { EntityHuman } from '../constants/api';

import { Personel_Store as EntityStore } from '../constants/store';
import { Personel_CreateSheet as EntityCreateSheet} from '../sheets/CreateSheet';
import { Personel_EditSheet as EntityEditSheet } from '../sheets/EditSheet';
import { Personel_DeleteSheet as EntityDeleteSheet } from '../sheets/DeleteSheet';
import { Personel_DetailSheet as EntityDetailSheet} from '../sheets/DetailSheet';
import { Personel_DataTable as EntityDataTable  } from '../table/dataTable';
import { Personel_StatusDialog as EntityStatusDialog } from '../dialogs/StatusDialog';

export function Personel_ListPage() {
  return (
    <div className="container mx-auto">
      <PageHeader EntityHuman={EntityHuman} useEntityStore={EntityStore} />
      <EntityDataTable/>
      <EntityCreateSheet />
      <EntityEditSheet />
      <EntityDeleteSheet />
      <EntityDetailSheet />
      <EntityStatusDialog />
    </div>
  );
}