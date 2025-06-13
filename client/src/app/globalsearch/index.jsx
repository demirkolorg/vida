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

// Header'da kullanılmak üzere kompakt versiyonu
export const HeaderSearchComponent = () => {
  const navigate = useNavigate();

  const handleResultSelect = (item, entityType) => {
    // Entity tipine göre navigasyon
    switch (entityType) {
      case 'malzeme':
        navigate(`/malzeme?highlight=${item.id}`);
        break;
      case 'birim':
        navigate(`/birim?highlight=${item.id}`);
        break;
      case 'personel':
        navigate(`/personel?highlight=${item.id}`);
        break;
      case 'sube':
        navigate(`/sube?highlight=${item.id}`);
        break;
      case 'malzemeHareket':
        navigate(`/malzeme-hareketleri?highlight=${item.id}`);
        break;
      default:
        navigate(`/${entityType}?highlight=${item.id}`);
    }

    toast.success(`${item.ad || item.vidaNo || item.sicil} seçildi`);
  };

  return <GlobalSearchComponent  onResultSelect={handleResultSelect}  />;
};
