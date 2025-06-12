// client/src/app/globalSearch/components/GlobalSearchComponent.jsx
import React, { useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useGlobalSearch } from '../hooks/useGlobalSearch';
import { GlobalSearchInput } from './GlobalSearchInput';
import { SearchResults } from './SearchResults';
import { RecentSearches } from './RecentSearches';
import { EmptyState } from './EmptyState';
import { LoadingState } from './LoadingState';

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
    console.log('Result selected:', item, entityType);
    saveToRecent(query);
    setIsOpen(false);
    onResultSelect?.(item, entityType);
  };

  // Gerçek context menu renderer
  const renderWithContextMenu = (itemComponent, item, entityType) => {
    if (!enableContextMenu) {
      return itemComponent;
    }

    // Context menu desteklenen entity'ler
    const supportedEntities = ['malzeme', 'birim', 'personel', 'sube'];
    
    if (!supportedEntities.includes(entityType)) {
      return itemComponent;
    }

    return (
      <div
        key={`context-${item.id}`}
        onContextMenu={(e) => {
          e.preventDefault();
          console.log('Context menu açılacak:', entityType, item);
          
          // Mevcut context menu varsa temizle
          const existingMenu = document.querySelector('.search-context-menu');
          if (existingMenu) {
            existingMenu.remove();
          }
          
          // Context menu container oluştur
          const contextMenuContainer = document.createElement('div');
          contextMenuContainer.className = 'search-context-menu';
          contextMenuContainer.style.position = 'fixed';
          contextMenuContainer.style.left = e.clientX + 'px';
          contextMenuContainer.style.top = e.clientY + 'px';
          contextMenuContainer.style.zIndex = '9999';
          contextMenuContainer.style.background = 'white';
          contextMenuContainer.style.border = '1px solid #e2e8f0';
          contextMenuContainer.style.borderRadius = '8px';
          contextMenuContainer.style.padding = '4px';
          contextMenuContainer.style.minWidth = '200px';
          contextMenuContainer.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
          
          // Entity tipine göre context menu içeriği
          let menuContent = '';
          
          switch (entityType) {
            case 'malzeme':
              menuContent = `
                <div class="context-menu-header" style="font-weight: 600; padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px;">
                  ${item.vidaNo || item.kod || 'Malzeme'}
                </div>
                <div class="context-menu-item" style="padding: 8px 12px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px;" data-action="view-detail">
                  <span>👁️</span> Detay Görüntüle
                </div>
                <div class="context-menu-item" style="padding: 8px 12px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px;" data-action="assign">
                  <span>📋</span> Zimmet Ver
                </div>
                <div class="context-menu-item" style="padding: 8px 12px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px;" data-action="return">
                  <span>↩️</span> İade Al
                </div>
                <div class="context-menu-item" style="padding: 8px 12px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px;" data-action="transfer">
                  <span>🔄</span> Devir Et
                </div>
                <div class="context-menu-item" style="padding: 8px 12px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px;" data-action="edit">
                  <span>✏️</span> Düzenle
                </div>
              `;
              break;
              
            case 'birim':
              menuContent = `
                <div class="context-menu-header" style="font-weight: 600; padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px;">
                  ${item.ad || 'Birim'}
                </div>
                <div class="context-menu-item" style="padding: 8px 12px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px;" data-action="view-detail">
                  <span>👁️</span> Detay Görüntüle
                </div>
                <div class="context-menu-item" style="padding: 8px 12px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px;" data-action="view-personnel">
                  <span>👥</span> Personelleri Görüntüle
                </div>
                <div class="context-menu-item" style="padding: 8px 12px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px;" data-action="view-materials">
                  <span>📦</span> Malzemeleri Görüntüle
                </div>
                <div class="context-menu-item" style="padding: 8px 12px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px;" data-action="edit">
                  <span>✏️</span> Düzenle
                </div>
              `;
              break;
              
            case 'personel':
              menuContent = `
                <div class="context-menu-header" style="font-weight: 600; padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px;">
                  ${item.ad} ${item.soyad || ''}
                </div>
                <div class="context-menu-item" style="padding: 8px 12px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px;" data-action="view-profile">
                  <span>👤</span> Profil Görüntüle
                </div>
                <div class="context-menu-item" style="padding: 8px 12px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px;" data-action="view-assignments">
                  <span>📋</span> Zimmetleri Görüntüle
                </div>
                <div class="context-menu-item" style="padding: 8px 12px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px;" data-action="assign-material">
                  <span>➕</span> Malzeme Zimmetle
                </div>
                <div class="context-menu-item" style="padding: 8px 12px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px;" data-action="edit">
                  <span>✏️</span> Düzenle
                </div>
              `;
              break;
              
            case 'sube':
              menuContent = `
                <div class="context-menu-header" style="font-weight: 600; padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px;">
                  ${item.ad || 'Şube'}
                </div>
                <div class="context-menu-item" style="padding: 8px 12px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px;" data-action="view-detail">
                  <span>👁️</span> Detay Görüntüle
                </div>
                <div class="context-menu-item" style="padding: 8px 12px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px;" data-action="view-offices">
                  <span>🏢</span> Büroları Görüntüle
                </div>
                <div class="context-menu-item" style="padding: 8px 12px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px;" data-action="edit">
                  <span>✏️</span> Düzenle
                </div>
              `;
              break;
          }
          
          contextMenuContainer.innerHTML = menuContent;
          
          // Menu item hover efektleri
          const style = document.createElement('style');
          style.textContent = `
            .context-menu-item:hover {
              background-color: #f1f5f9 !important;
            }
          `;
          document.head.appendChild(style);
          
          // Click event'leri ekle
          contextMenuContainer.addEventListener('click', (clickEvent) => {
            const target = clickEvent.target.closest('.context-menu-item');
            if (target) {
              const action = target.getAttribute('data-action');
              handleContextMenuAction(action, item, entityType);
              contextMenuContainer.remove();
            }
          });
          
          document.body.appendChild(contextMenuContainer);
          
          // Dışarı tıklayınca kapat
          const closeMenu = (clickEvent) => {
            if (!contextMenuContainer.contains(clickEvent.target)) {
              contextMenuContainer.remove();
              document.removeEventListener('click', closeMenu);
            }
          };
          
          setTimeout(() => {
            document.addEventListener('click', closeMenu);
          }, 100);
          
          // Ekran dışına taşma kontrolü
          const rect = contextMenuContainer.getBoundingClientRect();
          if (rect.right > window.innerWidth) {
            contextMenuContainer.style.left = (e.clientX - rect.width) + 'px';
          }
          if (rect.bottom > window.innerHeight) {
            contextMenuContainer.style.top = (e.clientY - rect.height) + 'px';
          }
        }}
      >
        {itemComponent}
      </div>
    );
  };

  // Context menu action handler
  const handleContextMenuAction = (action, item, entityType) => {
    console.log('Context menu action:', action, entityType, item);
    
    switch (action) {
      case 'view-detail':
        // Detay sayfasına yönlendir
        onResultSelect?.(item, entityType);
        break;
        
      case 'assign':
        // Zimmet ver modal'ı aç
        console.log('Zimmet ver:', item);
        // Burada zimmet modal'ını açabilirsiniz
        break;
        
      case 'return':
        // İade al modal'ı aç
        console.log('İade al:', item);
        break;
        
      case 'transfer':
        // Devir et modal'ı aç
        console.log('Devir et:', item);
        break;
        
      case 'edit':
        // Düzenleme modal'ı aç
        console.log('Düzenle:', item);
        break;
        
      case 'view-personnel':
        // Personelleri görüntüle
        console.log('Personelleri görüntüle:', item);
        break;
        
      case 'view-materials':
        // Malzemeleri görüntüle
        console.log('Malzemeleri görüntüle:', item);
        break;
        
      case 'view-profile':
        // Profil görüntüle
        console.log('Profil görüntüle:', item);
        break;
        
      case 'view-assignments':
        // Zimmetleri görüntüle
        console.log('Zimmetleri görüntüle:', item);
        break;
        
      case 'assign-material':
        // Malzeme zimmetle
        console.log('Malzeme zimmetle:', item);
        break;
        
      case 'view-offices':
        // Büroları görüntüle
        console.log('Büroları görüntüle:', item);
        break;
        
      default:
        console.log('Bilinmeyen action:', action);
    }
  };

  // Render dropdown content
  const renderDropdownContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (hasQuery) {
      console.log('Rendering SearchResults with context menu:', enableContextMenu);
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