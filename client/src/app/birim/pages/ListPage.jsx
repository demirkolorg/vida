import { PageHeader } from '@/components/pages/PageHeader';
import { EntityHuman } from '../constants/api';

import { Birim_Store as EntityStore } from '../constants/store';
import { Birim_CreateSheet as EntityCreateSheet} from '../sheets/CreateSheet';
import { Birim_EditSheet as EntityEditSheet } from '../sheets/EditSheet';
import { Birim_DeleteSheet as EntityDeleteSheet } from '../sheets/DeleteSheet';
import { Birim_DetailSheet as EntityDetailSheet} from '../sheets/DetailSheet';
import { Birim_DataTable as EntityDataTable  } from '../table/dataTable';
import { Birim_StatusDialog as EntityStatusDialog } from '../dialogs/StatusDialog';


export function Birim_ListPage() {
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
