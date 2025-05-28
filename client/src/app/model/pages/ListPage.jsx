import { PageHeader } from '@/components/pages/PageHeader';
import { EntityHuman } from '../constants/api';

import { Model_Store as EntityStore } from '../constants/store';
import { Model_CreateSheet as EntityCreateSheet} from '../sheets/CreateSheet';
import { Model_EditSheet as EntityEditSheet } from '../sheets/EditSheet';
import { Model_DeleteSheet as EntityDeleteSheet } from '../sheets/DeleteSheet';
import { Model_DetailSheet as EntityDetailSheet} from '../sheets/DetailSheet';
import { Model_DataTable as EntityDataTable  } from '../table/dataTable';
import { Model_StatusDialog as EntityStatusDialog } from '../dialogs/StatusDialog';

export function Model_ListPage() {
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