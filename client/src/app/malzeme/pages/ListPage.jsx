// client/src/app/malzeme/pages/ListPage.jsx - Güncellenmiş Split Layout
import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/pages/PageHeader';
import { EntityHuman } from '../constants/api';
import { useLayout } from '@/contexts/LayoutContext';

import { Malzeme_Store as EntityStore } from '../constants/store';
import { Malzeme_CreateSheet as EntityCreateSheet } from '../sheets/CreateSheet';
import { Malzeme_EditSheet as EntityEditSheet } from '../sheets/EditSheet';
import { Malzeme_DeleteSheet as EntityDeleteSheet } from '../sheets/DeleteSheet';
import { Malzeme_DetailSheet as EntityDetailSheet } from '../sheets/DetailSheet';
import { Malzeme_DataTable as EntityDataTable } from '../table/dataTable';
import { Malzeme_StatusDialog as EntityStatusDialog } from '../dialogs/StatusDialog';

// Malzeme hareket sheet'leri
import { ZimmetSheet } from '@/app/malzemehareket/sheets/ZimmetSheet';
import { IadeSheet } from '@/app/malzemehareket/sheets/IadeSheet';
import { DevirSheet } from '@/app/malzemehareket/sheets/DevirSheet';
import { DepoTransferiSheet } from '@/app/malzemehareket/sheets/DepoTransferiSheet';
import { KondisyonGuncellemeSheet } from '@/app/malzemehareket/sheets/KondisyonGuncellemeSheet';
import { KayipSheet } from '@/app/malzemehareket/sheets/KayipSheet';
import { DusumSheet } from '@/app/malzemehareket/sheets/DusumSheet';
import { KayitSheet } from '@/app/malzemehareket/sheets/KayitSheet';

// Yeni detay paneli
import MalzemeDetailPanel from '../components/MalzemeDetailPanel';

export function Malzeme_ListPage() {
  const [selectedMalzeme, setSelectedMalzeme] = useState(null);
  const { setDisablePadding, setIsDetailPanelOpen } = useLayout();

  // selectedMalzeme durumuna göre layout padding'ini kontrol et
  useEffect(() => {
    if (selectedMalzeme) {
      setDisablePadding(true);
      setIsDetailPanelOpen(true);
    } else {
      setDisablePadding(false);
      setIsDetailPanelOpen(false);
    }
  }, [selectedMalzeme, setDisablePadding, setIsDetailPanelOpen]);

  // Component unmount olduğunda padding'i eski haline getir
  useEffect(() => {
    return () => {
      setDisablePadding(false);
      setIsDetailPanelOpen(false);
    };
  }, [setDisablePadding, setIsDetailPanelOpen]);

  const handleRowClick = malzeme => {
    setSelectedMalzeme(malzeme);
  };

  const handleCloseDetailPanel = () => {
    setSelectedMalzeme(null);
  };

  return (
    <div className="flex flex-col overflow-hidden">
    

      {/* Ana İçerik - Split Layout */}
      <div className="flex-1 flex min-h-0 gap-4 ">
        {/* Sol Panel - Malzeme Tablosu (%70) */}
        <div className={`transition-all duration-300 ${selectedMalzeme ? 'w-[80%]' : 'w-full'} overflow-hidden`}>
            {/* Page Header - Sabit yükseklik */}
      <div className="flex-shrink-0">
        <PageHeader EntityHuman={EntityHuman} useEntityStore={EntityStore} />
      </div>
          <EntityDataTable onRowClick={handleRowClick} />
        </div>

        {/* Sağ Panel - Malzeme Detayları (%30) */}
        {selectedMalzeme && (
          <div className="w-[20%]  transition-all duration-300 ">
            <MalzemeDetailPanel selectedMalzeme={selectedMalzeme} onClose={handleCloseDetailPanel} />
          </div>
        )}
      </div>

      <>
        {/* Sheet'ler ve Dialog'lar */}
        <EntityCreateSheet />
        <EntityEditSheet />
        <EntityDeleteSheet />
        <EntityDetailSheet />
        <EntityStatusDialog />

        {/* Malzeme Hareket Sheet'leri */}
        <ZimmetSheet />
        <IadeSheet />
        <DevirSheet />
        <DepoTransferiSheet />
        <KondisyonGuncellemeSheet />
        <KayipSheet />
        <DusumSheet />
        <KayitSheet />
      </>
    </div>
  );
}
