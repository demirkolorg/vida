import { PageHeader } from '@/components/pages/PageHeader';
import { EntityHuman } from '../constants/api';

import { Depo_Store as EntityStore } from '../constants/store';
import { Depo_CreateSheet as EntityCreateSheet} from '../sheets/CreateSheet';
import { Depo_EditSheet as EntityEditSheet } from '../sheets/EditSheet';
import { Depo_DeleteSheet as EntityDeleteSheet } from '../sheets/DeleteSheet';
import { Depo_DetailSheet as EntityDetailSheet} from '../sheets/DetailSheet';
import { Depo_DataTable as EntityDataTable  } from '../table/dataTable';
import { Depo_StatusDialog as EntityStatusDialog } from '../dialogs/StatusDialog';


export function Depo_ListPage() {
  return (
    <div className="mx-auto">
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
