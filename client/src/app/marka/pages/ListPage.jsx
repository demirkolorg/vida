import { PageHeader } from '@/components/pages/PageHeader';
import { EntityHuman } from '../constants/api';

import { Marka_Store as EntityStore } from '../constants/store';
import { Marka_CreateSheet as EntityCreateSheet} from '../sheets/CreateSheet';
import { Marka_EditSheet as EntityEditSheet } from '../sheets/EditSheet';
import { Marka_DeleteSheet as EntityDeleteSheet } from '../sheets/DeleteSheet';
import { Marka_DetailSheet as EntityDetailSheet} from '../sheets/DetailSheet';
import { Marka_DataTable as EntityDataTable  } from '../table/dataTable';
import { Marka_StatusDialog as EntityStatusDialog } from '../dialogs/StatusDialog';


export function Marka_ListPage() {
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
