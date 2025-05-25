import { PageHeader } from '@/components/pages/PageHeader';
import { useSabitKoduStore as EntityStore} from '../constants/store';
import { SabitKoduCreateSheet } from '../sheets/CreateSheet';
import { SabitKoduEditSheet } from '../sheets/EditSheet';
import { SabitKoduDeleteSheet } from '../sheets/DeleteSheet';
import { SabitKoduDetailSheet } from '../sheets/DetailSheet';
import { SabitKoduDataTable } from '../table/dataTable';
import { SabitKoduStatusDialog } from '../dialogs/StatusDialog';
import { EntityHuman } from '../constants/api';


export function SabitKoduListPage() {
  return (
    <div className="container mx-auto">
      <PageHeader EntityHuman={EntityHuman} useEntityStore={EntityStore} />
      <SabitKoduDataTable />
      <SabitKoduCreateSheet />
      <SabitKoduEditSheet />
      <SabitKoduDeleteSheet />
      <SabitKoduDetailSheet />
      <SabitKoduStatusDialog />
    </div>
  );
}
