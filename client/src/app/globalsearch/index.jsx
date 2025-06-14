// client/src/app/globalSearch/index.js - Main export file
export { GlobalSearchComponent } from './components/GlobalSearchComponent';
export { QuickSearchComponent } from './components/QuickSearchComponent';
export { GlobalSearchPage } from './pages/GlobalSearchPage';
export { useGlobalSearch } from './hooks/useGlobalSearch';
export { GlobalSearch_Store } from './constants/store';
export { GlobalSearch_ApiService } from './constants/api';
export { GlobalSearch_RequestSchema, QuickSearch_RequestSchema, GlobalSearchResponse_Schema } from './constants/schema';
export { entityConfig, getEntityConfig, getAllEntityTypes, getContextMenuSupportedEntities } from './helpers/entityConfig';
export { validateSearchRequest, validateQuickSearchRequest, formatSearchResults, getDisplayName, highlightSearchTerm, debounce, getSearchStatsText } from './helpers/searchUtils';

// client/src/app/globalSearch/components/HeaderSearchComponent.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalSearchComponent } from './components/GlobalSearchComponent';
import { toast } from 'sonner';
import { createGlobalSearchNavigationHandler } from './components/globalSearchNavigation';

// Sheet'leri import et
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

  // const handleResultSelect = (item, entityType) => {
  //   // Entity tipine göre navigasyon
  //   switch (entityType) {
  //     case 'malzeme':
  //       navigate(`/malzeme?highlight=${item.id}`);
  //       break;
  //     case 'birim':
  //       navigate(`/birim?highlight=${item.id}`);
  //       break;
  //     case 'personel':
  //       navigate(`/personel?highlight=${item.id}`);
  //       break;
  //     case 'sube':
  //       navigate(`/sube?highlight=${item.id}`);
  //       break;
  //     case 'malzemeHareket':
  //       navigate(`/malzeme-hareketleri?highlight=${item.id}`);
  //       break;
  //     default:
  //       navigate(`/${entityType}?highlight=${item.id}`);
  //   }

  //   toast.success(`${item.ad || item.vidaNo || item.sicil} seçildi`);
  // };

  return (
    <>
      {/* TÜM SHEET'LER - Global search'te context menu'lardan açılabilsin diye */}
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
