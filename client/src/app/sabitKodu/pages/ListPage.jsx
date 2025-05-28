import { PageHeader } from '@/components/pages/PageHeader';
import { EntityHuman } from '../constants/api';

import { SabitKodu_Store as EntityStore } from '../constants/store';
import { SabitKodu_CreateSheet as EntityCreateSheet} from '../sheets/CreateSheet';
import { SabitKodu_EditSheet as EntityEditSheet } from '../sheets/EditSheet';
import { SabitKodu_DeleteSheet as EntityDeleteSheet } from '../sheets/DeleteSheet';
import { SabitKodu_DetailSheet as EntityDetailSheet} from '../sheets/DetailSheet';
import { SabitKodu_DataTable as EntityDataTable  } from '../table/dataTable';
import { SabitKodu_StatusDialog as EntityStatusDialog } from '../dialogs/StatusDialog';


export function SabitKodu_ListPage() {
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
