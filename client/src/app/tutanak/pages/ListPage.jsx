// client/src/app/tutanak/pages/ListPage.jsx - Split Layout ile Tutanak Listesi
import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/pages/PageHeader';
import { EntityHuman } from '../constants/api';
import { useLayout } from '@/contexts/LayoutContext';

import { Tutanak_Store as EntityStore } from '../constants/store';
import { Tutanak_DataTable as EntityDataTable } from '../table/dataTable';
import { Tutanak_StatusDialog as EntityStatusDialog } from '../dialogs/StatusDialog';

// Tutanak önizleme paneli
import TutanakDetailPanel from '../components/TutanakDetailPanel';
import { useLocation } from 'react-router-dom';

export function Tutanak_ListPage() {
  const [selectedTutanak, setSelectedTutanak] = useState(null);
  const { setDisablePadding, setIsDetailPanelOpen } = useLayout();
  const location = useLocation();
  const showPrint = location.state?.showPrint;
  const selectedTutanakId = location.state?.selectedTutanakId;

  // Store'dan tutanakları al
  const tutanakData = EntityStore(state => state.datas);
  const getAll = EntityStore(state => state.GetAll);

  // selectedTutanak durumuna göre layout padding'ini kontrol et
  useEffect(() => {
    if (selectedTutanak) {
      setDisablePadding(true);
      setIsDetailPanelOpen(true);
    } else {
      setDisablePadding(false);
      setIsDetailPanelOpen(false);
    }
  }, [selectedTutanak, setDisablePadding, setIsDetailPanelOpen]);

  // Component unmount olduğunda padding'i eski haline getir
  useEffect(() => {
    return () => {
      setDisablePadding(false);
      setIsDetailPanelOpen(false);
    };
  }, [setDisablePadding, setIsDetailPanelOpen]);

  // Location state'ten gelen tutanak ID'sini handle et
  useEffect(() => {
    if (selectedTutanakId && showPrint && tutanakData?.length > 0) {
      console.log("Location state'ten tutanak aranıyor:", selectedTutanakId);

      const foundTutanak = tutanakData.find(t => t.id === selectedTutanakId);

      if (foundTutanak) {
        setSelectedTutanak(foundTutanak);
      } else {
        getAll();
      }

      // State'i temizle (tek seferlik işlem)
      window.history.replaceState({}, document.title);
    }
  }, [selectedTutanakId, showPrint, tutanakData, getAll]);

  // Tutanak listesi güncellendiğinde tekrar kontrol et
  useEffect(() => {
    if (selectedTutanakId && showPrint && tutanakData?.length > 0 && !selectedTutanak) {
      const foundTutanak = tutanakData.find(t => t.id === selectedTutanakId);
      if (foundTutanak) {
        console.log('Liste güncellendikten sonra tutanak bulundu:', foundTutanak);
        setSelectedTutanak(foundTutanak);
      }
    }
  }, [tutanakData, selectedTutanakId, showPrint, selectedTutanak]);

  const handleRowClick = tutanak => {
    setSelectedTutanak(tutanak);
  };

  const handleCloseDetailPanel = () => {
    setSelectedTutanak(null);
  };

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Ana İçerik - Split Layout */}
      <div className="flex-1 flex min-h-0 gap-4">
        {/* Sol Panel - Tutanak Tablosu */}
        <div className={`transition-all duration-300 ${selectedTutanak ? 'w-[65%]' : 'w-full'} overflow-hidden`}>
          {/* Page Header - Sabit yükseklik */}
          <div className="flex-shrink-0">
            <PageHeader EntityHuman={EntityHuman} useEntityStore={EntityStore} />
          </div>
          <EntityDataTable onRowClick={handleRowClick} />
        </div>

        {/* Sağ Panel - Tutanak Önizlemesi */}
        {selectedTutanak && (
          <div className="w-[35%] transition-all duration-300 mb-16">
            <TutanakDetailPanel selectedTutanak={selectedTutanak} onClose={handleCloseDetailPanel} showPrint={showPrint} />
          </div>
        )}
      </div>

      {/* Dialog'lar */}
      <EntityStatusDialog />
    </div>
  );
}
