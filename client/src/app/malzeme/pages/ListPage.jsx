// client/src/app/malzeme/pages/ListPage.jsx
import { PageHeader } from '@/components/pages/PageHeader';
import { EntityHuman } from '../constants/api';

import { Malzeme_Store as EntityStore } from '../constants/store';
import { Malzeme_CreateSheet as EntityCreateSheet} from '../sheets/CreateSheet';
import { Malzeme_EditSheet as EntityEditSheet } from '../sheets/EditSheet';
import { Malzeme_DeleteSheet as EntityDeleteSheet } from '../sheets/DeleteSheet';
import { Malzeme_DetailSheet as EntityDetailSheet} from '../sheets/DetailSheet';
import { Malzeme_DataTable as EntityDataTable  } from '../table/dataTable';
import { Malzeme_StatusDialog as EntityStatusDialog } from '../dialogs/StatusDialog';

// MalzemeHareket sheet'lerini ekle
import { MalzemeHareket_CreateSheet } from '@/app/malzemeHareket/sheets/CreateSheet';
import { MalzemeHareket_EditSheet } from '@/app/malzemeHareket/sheets/EditSheet';
import { MalzemeHareket_DeleteSheet } from '@/app/malzemeHareket/sheets/DeleteSheet';
import { MalzemeHareket_DetailSheet } from '@/app/malzemeHareket/sheets/DetailSheet';

export function Malzeme_ListPage() {
  return (
    <div className=" mx-auto">
      <PageHeader EntityHuman={EntityHuman} useEntityStore={EntityStore} />
      <EntityDataTable/>
      
      {/* Malzeme CRUD Sheet'leri */}
      <EntityCreateSheet />
      <EntityEditSheet />
      <EntityDeleteSheet />
      <EntityDetailSheet />
      <EntityStatusDialog />
      
      {/* MalzemeHareket Sheet'leri - Context menüden açılabilir */}
      <MalzemeHareket_CreateSheet />
      <MalzemeHareket_EditSheet />
      <MalzemeHareket_DeleteSheet />
      <MalzemeHareket_DetailSheet />
    </div>
  );
}