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

import { ZimmetSheet } from '@/app/malzemehareket/sheets/ZimmetSheet';
import { IadeSheet } from '@/app/malzemehareket/sheets/IadeSheet';
import { DevirSheet } from '@/app/malzemehareket/sheets/DevirSheet';
import { DepoTransferiSheet } from '@/app/malzemehareket/sheets/DepoTransferiSheet';
import { KondisyonGuncellemeSheet } from '@/app/malzemehareket/sheets/KondisyonGuncellemeSheet';
import { KayipSheet } from '@/app/malzemehareket/sheets/KayipSheet';
import { DusumSheet } from '@/app/malzemehareket/sheets/DusumSheet';
import { KayitSheet } from '@/app/malzemehareket/sheets/KayitSheet';

export function Malzeme_ListPage() {
  return (
    <div className="mx-auto">
      <PageHeader EntityHuman={EntityHuman} useEntityStore={EntityStore} />
      <EntityDataTable />
      <EntityCreateSheet />
      <EntityEditSheet />
      <EntityDeleteSheet />
      <EntityDetailSheet />
      <EntityStatusDialog />

      <ZimmetSheet />
      <IadeSheet />
      <DevirSheet />
      <DepoTransferiSheet />
      <KondisyonGuncellemeSheet />
      <KayipSheet />
      <DusumSheet />
      <KayitSheet />
    </div>
  );
}
