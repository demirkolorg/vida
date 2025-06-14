// 1. SORUN TESPİTİ: HeaderSearchComponent'teki PersonelZimmetSheet store'dan habersiz
// client/src/app/globalsearch/pages/HeaderSearchComponent.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { GlobalSearchComponent } from '../components/GlobalSearchComponent';
import { createGlobalSearchNavigationHandler } from '../components/globalSearchNavigation';

// Sheet'leri import et - DİKKAT: Bu sheet'ler store'larla bağlantılı olmalı
import { PersonelZimmetSheet } from '@/app/personel/sheets/PersonelZimmetSheet';
import { BulkIadeSheet } from '@/app/malzemehareket/sheets/BulkIadeSheet';
import { BulkDevirSheet } from '@/app/malzemehareket/sheets/BulkDevirSheet';

// Malzeme hareket sheet'leri
import { ZimmetSheet } from '@/app/malzemehareket/sheets/ZimmetSheet';
import { IadeSheet } from '@/app/malzemehareket/sheets/IadeSheet';
import { DevirSheet } from '@/app/malzemehareket/sheets/DevirSheet';
import { BulkZimmetSheet } from '@/app/malzemehareket/sheets/BulkZimmetSheet';
import { DepoTransferiSheet } from '@/app/malzemehareket/sheets/DepoTransferiSheet';
import { BulkDepoTransferiSheet } from '@/app/malzemehareket/sheets/BulkDepoTransferiSheet';
import { KondisyonGuncellemeSheet } from '@/app/malzemehareket/sheets/KondisyonGuncellemeSheet';
import { BulkKondisyonGuncellemeSheet } from '@/app/malzemehareket/sheets/BulkKondisyonGuncellemeSheet';
import { KayipSheet } from '@/app/malzemehareket/sheets/KayipSheet';
import { DusumSheet } from '@/app/malzemehareket/sheets/DusumSheet';
import { KayitSheet } from '@/app/malzemehareket/sheets/KayitSheet';

// Header'da kullanılmak üzere kompakt versiyonu
export const HeaderSearchComponent = () => {
  const navigate = useNavigate();
  const handleResultSelect = createGlobalSearchNavigationHandler(navigate, toast);

  return (
    <>
      {/* TÜM SHEET'LER - Global search'te context menu'lardan açılabilsin diye */}
      {/* Store state'leri kontrol et ve sadece gerektiğinde render et */}

      {/* Personel Sheet'leri */}
      <PersonelZimmetSheet />
      <BulkIadeSheet />
      <BulkDevirSheet />

      {/* Malzeme Hareket Sheet'leri */}
      <ZimmetSheet />
      <IadeSheet />
      <DevirSheet />
      <BulkZimmetSheet />
      <DepoTransferiSheet />
      <BulkDepoTransferiSheet />
      <KondisyonGuncellemeSheet />
      <BulkKondisyonGuncellemeSheet />
      <KayipSheet />
      <DusumSheet />
      <KayitSheet />

      {/* RETURN */}
      <GlobalSearchComponent enableContextMenu={true} onResultSelect={handleResultSelect} />
    </>
  );
};
