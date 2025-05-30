// client/src/app/malzeme/pages/ListPage.jsx - Güncellenmiş
import { PageHeader } from '@/components/pages/PageHeader';
import { EntityHuman } from '../constants/api';

import { Malzeme_Store as EntityStore } from '../constants/store';
import { Malzeme_CreateSheet as EntityCreateSheet } from '../sheets/CreateSheet';
import { Malzeme_EditSheet as EntityEditSheet } from '../sheets/EditSheet';
import { Malzeme_DeleteSheet as EntityDeleteSheet } from '../sheets/DeleteSheet';
import { Malzeme_DetailSheet as EntityDetailSheet } from '../sheets/DetailSheet';
import { Malzeme_DataTable as EntityDataTable } from '../table/dataTable';
import { Malzeme_StatusDialog as EntityStatusDialog } from '../dialogs/StatusDialog';

// Yeni MalzemeHareket sheet'lerini ekle
// import { MalzemeHareket_ZimmetSheet } from '@/app/malzemeHareket/sheets/ZimmetSheet';
// import { MalzemeHareket_IadeSheet } from '@/app/malzemeHareket/sheets/IadeSheet';
// import { MalzemeHareket_DevirSheet } from '@/app/malzemeHareket/sheets/DevirSheet';
// import { MalzemeHareket_DepoTransferSheet } from '@/app/malzemeHareket/sheets/DepoTransferSheet';
// import { MalzemeHareket_KondisyonSheet } from '@/app/malzemeHareket/sheets/KondisyonSheet';
// import { MalzemeHareket_KayipSheet } from '@/app/malzemeHareket/sheets/KayipSheet';
// import { MalzemeHareket_DusumSheet } from '@/app/malzemeHareket/sheets/DusumSheet';

import { ZimmetSheet } from '@/app/malzemehareket/sheets/ZimmetSheet';

export function Malzeme_ListPage() {
  return (
    <div className=" mx-auto">
      <PageHeader EntityHuman={EntityHuman} useEntityStore={EntityStore} />
      <EntityDataTable />

      {/* Malzeme CRUD Sheet'leri */}
      <EntityCreateSheet />
      <EntityEditSheet />
      <EntityDeleteSheet />
      <EntityDetailSheet />
      <EntityStatusDialog />

      {/* Yeni İş Süreçleri Sheet'leri */}
      {/* <MalzemeHareket_ZimmetSheet />
      <MalzemeHareket_IadeSheet />
      <MalzemeHareket_DevirSheet />
      <MalzemeHareket_DepoTransferSheet />
      <MalzemeHareket_KondisyonSheet />
      <MalzemeHareket_KayipSheet />
      <MalzemeHareket_DusumSheet /> */}

      <ZimmetSheet />
    </div>
  );
}
