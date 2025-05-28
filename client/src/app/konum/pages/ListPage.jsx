import { PageHeader } from '@/components/pages/PageHeader';
import { EntityHuman } from '../constants/api';

import { Konum_Store as EntityStore } from '../constants/store';
import { Konum_CreateSheet as EntityCreateSheet} from '../sheets/CreateSheet';
import { Konum_EditSheet as EntityEditSheet } from '../sheets/EditSheet';
import { Konum_DeleteSheet as EntityDeleteSheet } from '../sheets/DeleteSheet';
import { Konum_DetailSheet as EntityDetailSheet} from '../sheets/DetailSheet';
import { Konum_DataTable as EntityDataTable  } from '../table/dataTable';
import { Konum_StatusDialog as EntityStatusDialog } from '../dialogs/StatusDialog';

export function Konum_ListPage() {
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