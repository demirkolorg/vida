// GlobalSearchComponent'e debug ekleyelim
import React, { useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ContextMenu, ContextMenuTrigger, ContextMenuContent,ContextMenuItem } from '@/components/ui/context-menu';
import { cn } from '@/lib/utils';
import { useGlobalSearch } from '../hooks/useGlobalSearch';
import { GlobalSearchInput } from './GlobalSearchInput';
import { SearchResults } from './SearchResults';
import { RecentSearches } from './RecentSearches';
import { EmptyState } from './EmptyState';
import { LoadingState } from './LoadingState';
import { ContextMenuManager } from '../contextMenus';



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

  console.log('🔧 GlobalSearchComponent props:', { enableContextMenu, entityTypes });

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
  const handleResultSelect = (item, entityType, options = {}) => {
    console.log('🔧 handleResultSelect called:', { item, entityType, options });
    saveToRecent(query);
    setIsOpen(false);
    onResultSelect?.(item, entityType, options);
  };

  // Context menu navigation handler
  const handleContextMenuNavigation = (item, entityType, action) => {
    console.log('🔧 Context menu navigation:', { item, entityType, action });
    
    // Action türüne göre farklı navigasyonlar yapılabilir
    switch (action) {
      case 'view':
        handleResultSelect(item, entityType, { action: 'view' });
        break;
      case 'edit':
        handleResultSelect(item, entityType, { action: 'edit' });
        break;
      default:
        handleResultSelect(item, entityType, { action });
    }
  };

  // Context menu renderer
  const renderWithContextMenu = (itemComponent, item, entityType) => {
    console.log('🔧 renderWithContextMenu called:', { 
      entityType, 
      enableContextMenu, 
      itemId: item?.id,
      itemName: item?.ad || item?.vidaNo || item?.sicil 
    });
    
    if (!enableContextMenu) {
      console.log('🔧 Context menu disabled globally');
      return itemComponent;
    }

    const supportedEntities = [
      'malzeme', 
      'personel', 
      'birim', 
      'sube', 
      'buro', 
      'marka', 
      'model', 
      'depo', 
      'konum', 
      'malzemeHareket', 
      'sabitKodu'
    ];

    if (!supportedEntities.includes(entityType)) {
      console.log(`🔧 Context menu not supported for entity type: ${entityType}`);
      return itemComponent;
    }

    try {
      console.log(`🔧 Creating context menu for ${entityType} - ${item.id}`);
      
      // Context menu'yu wrap ederken ekstra log ekleyelim
      const wrappedComponent = (
        <ContextMenu key={`context-${item.id}`}>
          <ContextMenuTrigger 
            asChild
            onPointerDown={(e) => console.log('🔧 ContextMenuTrigger pointerDown:', e)}
            onContextMenu={(e) => console.log('🔧 ContextMenuTrigger contextMenu:', e)}
          >
            {itemComponent}
          </ContextMenuTrigger>
          <ContextMenuContent 
            className="w-64"
            onOpenAutoFocus={(e) => console.log('🔧 ContextMenuContent opened:', e)}
          >
            <ContextMenuManager 
              entityType={entityType} 
              item={item} 
              onNavigate={handleContextMenuNavigation}
            />
          </ContextMenuContent>
        </ContextMenu>
      );
      
      return wrappedComponent;
    } catch (error) {
      console.error('🔧 Context menu render error:', error);
      return itemComponent;
    }
  };

  // Render dropdown content
  const renderDropdownContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (hasQuery) {
      console.log('🔧 Rendering SearchResults with:', {
        enableContextMenu,
        contextMenuRenderer: !!renderWithContextMenu,
        resultsKeys: Object.keys(results)
      });

      return (
        <>
          {/* Debug componenti ekle */}
          {/* <SuperDebugContextMenu /> */}
          
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
        </>
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

      {/* Search Dropdown */}
      {isOpen && (
        <Card className="absolute right-0 w-[550px] mt-1 z-50 shadow-xl border-primary">
          <CardContent className="p-0">
            {renderDropdownContent()}
          </CardContent>
        </Card>
      )}
    </div>
  );
};