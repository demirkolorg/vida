// client/src/app/globalSearch/hooks/useGlobalSearch.js
import { useState, useCallback, useRef, useEffect } from 'react';
import { GlobalSearch_Store } from '../constants/store';
import { validateSearchRequest } from '../helpers/searchUtils';
import { toast } from 'sonner';

export const useGlobalSearch = (options = {}) => {
  const {
    debounceMs = 300,
    entityTypes = [],
    autoSearch = true,
    minQueryLength = 2,
    onError = null,
    onSuccess = null
  } = options;

  // Store hooks
  const {
    currentQuery,
    searchResults,
    isSearching,
    searchError,
    recentSearches,
    expandedCategories,
    searchStats,
    performGlobalSearch,
    clearSearch,
    toggleCategoryExpansion,
    loadRecentSearches,
    addToRecentSearches,
    clearRecentSearches,
    getTotalResults,
    getResultsByEntity,
    hasResultsForEntity
  } = GlobalSearch_Store();

  const [query, setQuery] = useState(currentQuery || '');
  const [isOpen, setIsOpen] = useState(false);
  
  const debounceRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Load recent searches on mount
  useEffect(() => {
    loadRecentSearches();
  }, [loadRecentSearches]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Perform search function
  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim() || searchQuery.trim().length < minQueryLength) {
      clearSearch();
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    try {
      const searchParams = validateSearchRequest({
        query: searchQuery.trim(),
        entityTypes,
        limit: 50,
        includeRelations: true
      });

      const results = await performGlobalSearch(searchParams, { showToast: false });
      onSuccess?.(results, searchQuery);
    } catch (error) {
      const errorMessage = error.message || 'Arama sırasında bir hata oluştu';
      onError?.(error);
      toast.error(`Arama hatası: ${errorMessage}`);
    }
  }, [entityTypes, minQueryLength, performGlobalSearch, onError, onSuccess, clearSearch]);

  // Debounced search trigger
  const search = useCallback((searchQuery) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (autoSearch) {
      debounceRef.current = setTimeout(() => {
        performSearch(searchQuery);
      }, debounceMs);
    }
  }, [performSearch, debounceMs, autoSearch]);

  // Manual search (immediate)
  const searchImmediate = useCallback((searchQuery) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    performSearch(searchQuery);
  }, [performSearch]);

  // Handle query change
  const handleQueryChange = useCallback((newQuery) => {
    setQuery(newQuery);
    search(newQuery);
  }, [search]);

  // Save to recent searches
  const saveToRecent = useCallback((searchQuery) => {
    if (searchQuery && searchQuery.trim().length >= minQueryLength) {
      addToRecentSearches(searchQuery.trim());
    }
  }, [addToRecentSearches, minQueryLength]);

  // Clear search and query
  const handleClearSearch = useCallback(() => {
    setQuery('');
    clearSearch();
    setIsOpen(false);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, [clearSearch]);

  // Handle recent search click
  const handleRecentSearchClick = useCallback((recentQuery) => {
    setQuery(recentQuery);
    searchImmediate(recentQuery);
    setIsOpen(true);
  }, [searchImmediate]);

  const totalResults = getTotalResults();
  const hasResults = totalResults > 0;
  const hasQuery = query.trim().length >= minQueryLength;

  return {
    // State
    query,
    results: searchResults,
    isLoading: isSearching,
    error: searchError,
    recentSearches,
    expandedCategories,
    searchStats,
    totalResults,
    hasResults,
    hasQuery,
    isOpen,

    // Actions
    setQuery: handleQueryChange,
    search: searchImmediate,
    clearSearch: handleClearSearch,
    saveToRecent,
    clearRecentSearches,
    setIsOpen,

    // UI Actions
    toggleCategoryExpansion,
    handleRecentSearchClick,

    // Utils
    getResultsByEntity,
    hasResultsForEntity
  };
};