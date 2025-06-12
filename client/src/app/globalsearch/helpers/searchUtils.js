// client/src/app/globalSearch/helpers/searchUtils.js
import { GlobalSearch_RequestSchema, QuickSearch_RequestSchema } from '../constants/schema';

export const validateSearchRequest = (searchData) => {
  try {
    return GlobalSearch_RequestSchema.parse(searchData);
  } catch (error) {
    throw new Error(`Arama parametreleri geçersiz: ${error.errors?.[0]?.message || error.message}`);
  }
};

export const validateQuickSearchRequest = (searchData) => {
  try {
    return QuickSearch_RequestSchema.parse(searchData);
  } catch (error) {
    throw new Error(`Hızlı arama parametreleri geçersiz: ${error.errors?.[0]?.message || error.message}`);
  }
};

export const formatSearchResults = (results) => {
  const formatted = {};
  
  Object.keys(results).forEach(entityType => {
    if (results[entityType] && Array.isArray(results[entityType])) {
      formatted[entityType] = results[entityType].map(item => ({
        ...item,
        _entityType: entityType, // Add entity type for easier identification
        _displayName: getDisplayName(item, entityType)
      }));
    }
  });
  
  return formatted;
};

export const getDisplayName = (item, entityType) => {
  switch (entityType) {
    case 'malzeme':
      return item.vidaNo || item.kod || item.id;
    case 'personel':
      return `${item.ad || ''} ${item.soyad || ''}`.trim() || item.sicil || item.id;
    case 'birim':
    case 'sube':
    case 'buro':
    case 'marka':
    case 'model':
    case 'depo':
    case 'konum':
    case 'sabitKodu':
      return item.ad || item.id;
    default:
      return item.ad || item.name || item.id;
  }
};

export const highlightSearchTerm = (text, searchTerm) => {
  if (!text || !searchTerm) return text;
  
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const getSearchStatsText = (stats) => {
  const { totalSearches, averageResponseTime, lastSearchTime } = stats;
  
  if (totalSearches === 0) {
    return 'Henüz arama yapılmadı';
  }
  
  const lastSearch = lastSearchTime ? new Date(lastSearchTime).toLocaleString('tr-TR') : 'Bilinmiyor';
  
  return `Toplam ${totalSearches} arama • Ortalama ${averageResponseTime}ms • Son: ${lastSearch}`;
};