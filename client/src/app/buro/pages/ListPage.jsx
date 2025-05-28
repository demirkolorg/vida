import { PageHeader } from '@/components/pages/PageHeader';
import { EntityHuman } from '../constants/api';

import { Buro_Store as EntityStore } from '../constants/store';
import { Buro_CreateSheet as EntityCreateSheet} from '../sheets/CreateSheet';
import { Buro_EditSheet as EntityEditSheet } from '../sheets/EditSheet';
import { Buro_DeleteSheet as EntityDeleteSheet } from '../sheets/DeleteSheet';
import { Buro_DetailSheet as EntityDetailSheet} from '../sheets/DetailSheet';
import { Buro_DataTable as EntityDataTable  } from '../table/dataTable';
import { Buro_StatusDialog as EntityStatusDialog } from '../dialogs/StatusDialog';


export function Buro_ListPage() {
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
