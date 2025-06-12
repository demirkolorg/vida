// client/src/app/globalSearch/constants/store.js
import { createCrudStore } from '@/stores/crudStoreFactory';
import { EntityHuman } from './api';
import { GlobalSearch_ApiService as EntityApiService } from "./api";

export const GlobalSearch_Store = createCrudStore(EntityHuman, EntityApiService,
  (set, get, baseStore) => {
    return {
      // Global Search specific state
      currentQuery: '',
      searchResults: {},
      isSearching: false,
      searchError: null,
      recentSearches: [],
      quickSearchResults: {},
      expandedCategories: {},
      searchHistory: [],
      searchStats: {
        totalSearches: 0,
        lastSearchTime: null,
        averageResponseTime: 0
      },

      // Global Search Actions
      performGlobalSearch: async (searchParams, options = {}) => {
        const { showToast = false, saveToHistory = true } = options;
        
        if (get().isSearching) return null;
        
        set({ 
          isSearching: true, 
          searchError: null,
          currentQuery: searchParams.query 
        });

        const startTime = Date.now();

        try {
          const results = await EntityApiService.globalSearch(searchParams);
          const responseTime = Date.now() - startTime;
          
          set(state => ({
            searchResults: results,
            isSearching: false,
            searchStats: {
              ...state.searchStats,
              totalSearches: state.searchStats.totalSearches + 1,
              lastSearchTime: new Date().toISOString(),
              averageResponseTime: Math.round(
                (state.searchStats.averageResponseTime * (state.searchStats.totalSearches - 1) + responseTime) / 
                state.searchStats.totalSearches
              )
            }
          }));

          // Save to search history
          if (saveToHistory) {
            get().addToSearchHistory({
              query: searchParams.query,
              entityTypes: searchParams.entityTypes || [],
              resultsCount: Object.values(results).reduce((sum, arr) => sum + (arr?.length || 0), 0),
              timestamp: new Date().toISOString(),
              responseTime
            });
          }

          // Auto-expand categories with results
          const newExpandedCategories = {};
          Object.keys(results).forEach(entityType => {
            if (results[entityType] && results[entityType].length > 0) {
              newExpandedCategories[entityType] = true;
            }
          });
          set({ expandedCategories: newExpandedCategories });

          if (showToast) {
            const totalResults = Object.values(results).reduce((sum, arr) => sum + (arr?.length || 0), 0);
            if (totalResults > 0) {
              // Toast will be handled by the component
            }
          }

          return results;
        } catch (error) {
          const errorMessage = error.message || 'Arama sırasında bir hata oluştu';
          set({ 
            searchError: errorMessage, 
            isSearching: false,
            searchResults: {}
          });
          
          if (showToast) {
            // Toast will be handled by the component
          }
          
          throw error;
        }
      },

      performQuickSearch: async (searchParams, options = {}) => {
        const { showToast = false } = options;
        
        try {
          const results = await EntityApiService.quickSearch(searchParams);
          set({ quickSearchResults: results });
          return results;
        } catch (error) {
          const errorMessage = error.message || 'Hızlı arama sırasında bir hata oluştu';
          console.error('Quick search error:', errorMessage);
          set({ quickSearchResults: {} });
          throw error;
        }
      },

      searchByEntity: async (entityType, query, options = {}) => {
        const searchParams = {
          query,
          entityTypes: [entityType],
          ...options
        };
        
        const results = await get().performGlobalSearch(searchParams, options);
        return results[entityType] || [];
      },

      clearSearch: () => {
        set({
          currentQuery: '',
          searchResults: {},
          searchError: null,
          quickSearchResults: {},
          expandedCategories: {}
        });
      },

      toggleCategoryExpansion: (entityType) => {
        set(state => ({
          expandedCategories: {
            ...state.expandedCategories,
            [entityType]: !state.expandedCategories[entityType]
          }
        }));
      },

      // Recent Searches Management
      loadRecentSearches: () => {
        try {
          const saved = localStorage.getItem('vida-recent-searches');
          if (saved) {
            const recentSearches = JSON.parse(saved);
            set({ recentSearches });
          }
        } catch (error) {
          console.error('Recent searches load error:', error);
        }
      },

      addToRecentSearches: (query) => {
        if (!query.trim()) return;
        
        set(state => {
          const newRecentSearches = [
            query.trim(),
            ...state.recentSearches.filter(s => s !== query.trim())
          ].slice(0, 5);
          
          localStorage.setItem('vida-recent-searches', JSON.stringify(newRecentSearches));
          return { recentSearches: newRecentSearches };
        });
      },

      clearRecentSearches: () => {
        set({ recentSearches: [] });
        localStorage.removeItem('vida-recent-searches');
      },

      // Search History Management
      addToSearchHistory: (searchRecord) => {
        set(state => {
          const newHistory = [
            searchRecord,
            ...state.searchHistory.filter(h => 
              !(h.query === searchRecord.query && 
                JSON.stringify(h.entityTypes) === JSON.stringify(searchRecord.entityTypes))
            )
          ].slice(0, 50); // Keep last 50 searches
          
          return { searchHistory: newHistory };
        });
      },

      getSearchHistory: () => get().searchHistory,

      clearSearchHistory: () => {
        set({ searchHistory: [] });
      },

      // Utility functions
      getTotalResults: () => {
        const results = get().searchResults;
        return Object.values(results).reduce((sum, arr) => sum + (arr?.length || 0), 0);
      },

      getResultsByEntity: (entityType) => {
        return get().searchResults[entityType] || [];
      },

      hasResultsForEntity: (entityType) => {
        return (get().searchResults[entityType]?.length || 0) > 0;
      },

      getCategoriesWithResults: () => {
        const results = get().searchResults;
        return Object.keys(results).filter(entityType => 
          results[entityType] && results[entityType].length > 0
        );
      },

      // Health check
      checkHealth: async () => {
        try {
          const healthData = await EntityApiService.health();
          return healthData;
        } catch (error) {
          console.error('Global search health check failed:', error);
          return null;
        }
      }
    };
  },
);