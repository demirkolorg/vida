// client/src/app/malzemeHareket/pages/ListPage.jsx
import { PageHeader } from '@/components/pages/PageHeader';
import { EntityHuman } from '../constants/api';

import { MalzemeHareket_Store as EntityStore } from '../constants/store';
import { MalzemeHareket_CreateSheet as EntityCreateSheet} from '../sheets/CreateSheet';
import { MalzemeHareket_EditSheet as EntityEditSheet } from '../sheets/EditSheet';
import { MalzemeHareket_DeleteSheet as EntityDeleteSheet } from '../sheets/DeleteSheet';
import { MalzemeHareket_DetailSheet as EntityDetailSheet} from '../sheets/DetailSheet';
import { MalzemeHareket_DataTable as EntityDataTable  } from '../table/dataTable';

export function MalzemeHareket_ListPage() {
  return (
    <div className=" mx-auto">
      <PageHeader EntityHuman={EntityHuman} useEntityStore={EntityStore} />
      <EntityDataTable/>
      <EntityCreateSheet />
      <EntityEditSheet />
      <EntityDeleteSheet />
      <EntityDetailSheet />
    </div>
  );
}