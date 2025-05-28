import { PageHeader } from '@/components/pages/PageHeader';
import { EntityHuman } from '../constants/api';

import { Sube_Store as EntityStore } from '../constants/store';
import { Sube_CreateSheet as EntityCreateSheet} from '../sheets/CreateSheet';
import { Sube_EditSheet as EntityEditSheet } from '../sheets/EditSheet';
import { Sube_DeleteSheet as EntityDeleteSheet } from '../sheets/DeleteSheet';
import { Sube_DetailSheet as EntityDetailSheet} from '../sheets/DetailSheet';
import { Sube_DataTable as EntityDataTable  } from '../table/dataTable';
import { Sube_StatusDialog as EntityStatusDialog } from '../dialogs/StatusDialog';


export function Sube_ListPage() {
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
