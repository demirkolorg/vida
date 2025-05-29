import { PageHeader } from '@/components/pages/PageHeader';
import { EntityHuman } from '../constants/api';

import { MalzemeHareket_Store as EntityStore } from '../constants/store';
import { MalzemeHareket_DetailSheet as EntityDetailSheet } from '../sheets/DetailSheet';
import { MalzemeHareket_DataTable as EntityDataTable } from '../table/dataTable';
import { MalzemeHareket_StatusDialog as EntityStatusDialog } from '../dialogs/StatusDialog';

// Sadece raporlama için gerekli sheet'ler
import { MalzemeHareket_IstatistikSheet } from '../sheets/IstatistikSheet';

export function MalzemeHareket_ListPage() {
  return (
    <div className="mx-auto">
      <PageHeader 
        EntityHuman={EntityHuman} 
        useEntityStore={EntityStore}
        // Create/Edit/Delete butonlarını gizle çünkü işlemler malzeme tablosundan yapılacak
        showCreateButton={false}
      />
      
      <EntityDataTable />
      
      {/* Sadece görüntüleme ve durum güncelleme */}
      <EntityDetailSheet />
      <EntityStatusDialog />
      
      {/* Sadece raporlama */}
      <MalzemeHareket_IstatistikSheet />
    </div>
  );
}