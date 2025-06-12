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
import { SearchStats } from './SearchStats';

// Context menu imports
import { Malzeme_ContextMenu } from '@/app/malzeme/table/contextMenu';
import { Birim_ContextMenu } from '@/app/birim/table/contextMenu';
// Import other context menus as needed

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

  // Context menu renderer
  const renderContextMenu = (itemComponent, item, entityType) => {
    let contextMenuComponent = null;

    switch (entityType) {
      case 'malzeme':
        contextMenuComponent = (
          <Malzeme_ContextMenu 
            item={item}
            selectedItems={[]}
            isCurrentItemSelected={false}
            selectionCount={0}
          />
        );
        break;
      case 'birim':
        contextMenuComponent = <Birim_ContextMenu item={item} />;
        break;
      // Add other cases as needed
      default:
        return itemComponent;
    }

    if (!contextMenuComponent) return itemComponent;

    return (
      <ContextMenu key={item.id}>
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
          contextMenuRenderer={enableContextMenu ? renderContextMenu : null}
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
          <CardContent className="p-0 ">
            {renderDropdownContent()}
            {/* {showStats && <SearchStats stats={searchStats} />} */}
          </CardContent>
        </Card>
      )}
    </div>
  );
};