// client/src/app/globalSearch/components/GlobalSearchComponent.jsx
import React, { useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ContextMenu, ContextMenuTrigger, ContextMenuContent } from '@/components/ui/context-menu';
import { cn } from '@/lib/utils';
import { useGlobalSearch } from '../hooks/useGlobalSearch';
import { GlobalSearchInput } from './GlobalSearchInput';
import { SearchResults } from './SearchResults';
import { RecentSearches } from './RecentSearches';
import { EmptyState } from './EmptyState';
import { LoadingState } from './LoadingState';

// Context menü componentlerini import et
import { Malzeme_ContextMenu } from '@/app/malzeme/table/contextMenu';
import { Birim_ContextMenu } from '@/app/birim/table/contextMenu';
import { Personel_ContextMenu } from '@/app/personel/table/contextMenu';
import { Sube_ContextMenu } from '@/app/sube/table/contextMenu';

export const GlobalSearchComponent = ({
  placeholder = "Tüm kayıtlarda ara...",
  entityTypes = [],
  onResultSelect,
  enableContextMenu = true,
  showStats = true,
  autoFocus = false,
  className
}) => {
  const containerRef = useRef(null);

  const {
    query,
    results,
    isLoading,
    error,
    recentSearches,
    expandedCategories,
    searchStats,
    totalResults,
    hasResults,
    hasQuery,
    isOpen,
    setQuery,
    clearSearch,
    saveToRecent,
    clearRecentSearches,
    setIsOpen,
    toggleCategoryExpansion,
    handleRecentSearchClick
  } = useGlobalSearch({
    entityTypes,
    debounceMs: 300,
    minQueryLength: 2
  });

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsOpen]);

  // Handle input focus
  const handleFocus = () => {
    setIsOpen(true);
  };

  // Handle result selection
  const handleResultSelect = (item, entityType) => {
    saveToRecent(query);
    setIsOpen(false);
    onResultSelect?.(item, entityType);
  };

  // Context menu renderer - mevcut context menüleri kullan
  const renderWithContextMenu = (itemComponent, item, entityType) => {
    if (!enableContextMenu) {
      return itemComponent;
    }

    // Context menu desteklenen entity'ler için mevcut componentleri kullan
    const getContextMenuComponent = (entityType, item) => {
      switch (entityType) {
        case 'malzeme':
          return (
            <Malzeme_ContextMenu 
              item={item}
              selectedItems={[]} // Global search'te çoklu seçim yok
              isCurrentItemSelected={false}
              selectionCount={0}
            />
          );
        case 'birim':
          return (
            <Birim_ContextMenu 
              item={item}
              selectedItems={[]}
              isCurrentItemSelected={false}
              selectionCount={0}
            />
          );
        case 'personel':
          return (
            <Personel_ContextMenu 
              item={item}
              selectedItems={[]}
              isCurrentItemSelected={false}
              selectionCount={0}
            />
          );
        case 'sube':
          return (
            <Sube_ContextMenu 
              item={item}
              selectedItems={[]}
              isCurrentItemSelected={false}
              selectionCount={0}
            />
          );
        default:
          return null;
      }
    };

    const contextMenuComponent = getContextMenuComponent(entityType, item);
    
    if (!contextMenuComponent) {
      return itemComponent;
    }

    return (
      <ContextMenu key={`context-${item.id}`}>
        <ContextMenuTrigger asChild>
          {itemComponent}
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          {contextMenuComponent}
        </ContextMenuContent>
      </ContextMenu>
    );
  };

  // Render dropdown content
  const renderDropdownContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (hasQuery) {
      return (
        <SearchResults
          results={results}
          query={query}
          totalResults={totalResults}
          isLoading={isLoading}
          error={error}
          expandedCategories={expandedCategories}
          onToggleCategoryExpansion={toggleCategoryExpansion}
          onItemSelect={handleResultSelect}
          enableContextMenu={enableContextMenu}
          contextMenuRenderer={renderWithContextMenu}
        />
      );
    }

    if (recentSearches.length > 0) {
      return (
        <RecentSearches
          recentSearches={recentSearches}
          onRecentSearchClick={handleRecentSearchClick}
          onClearRecentSearches={clearRecentSearches}
        />
      );
    }

    return <EmptyState enableContextMenu={enableContextMenu} />;
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Search Input */}
      <GlobalSearchInput
        value={query}
        onChange={setQuery}
        onFocus={handleFocus}
        onClear={clearSearch}
        placeholder={placeholder}
        isLoading={isLoading}
        autoFocus={autoFocus}
      />

      {/* Search Results Dropdown */}
      {isOpen && (
        <Card className="absolute right-0 px-0 pt-3 pb-1 w-[550px] mt-1 z-50 shadow-xl border-primary">
          <CardContent className="p-0">
            {renderDropdownContent()}
          </CardContent>
        </Card>
      )}
    </div>
  );
};