// client/src/app/globalSearch/components/SearchResults.jsx
import React from 'react';
import { Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SearchResultCategory } from './SearchResultCategory';

export const SearchResults = ({ 
  results = {}, 
  query = '', 
  totalResults = 0, 
  isLoading = false, 
  error = null, 
  expandedCategories = {}, 
  onToggleCategoryExpansion, 
  onItemSelect, 
  enableContextMenu = false, 
  contextMenuRenderer = null 
}) => {
  const hasResults = totalResults > 0;
  const hasQuery = query.trim().length > 0;

  if (error) {
    return (
      <div className="p-4 text-center text-destructive text-sm">
        {error}
      </div>
    );
  }

  if (!hasQuery) return null;

  if (!hasResults && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <Search className="h-8 w-8 text-muted-foreground mb-2" />
        <div className="text-sm text-muted-foreground">
          "<span className="font-medium">{query}</span>" için sonuç bulunamadı
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-196">
      {/* Header - Sabit */}
      <div className="flex-shrink-0 p-4 pt-0">
        <div className="mb-4 p-3 bg-primary/10 rounded-lg">
          <div className="text-sm text-muted-foreground">
            "<span className="font-medium text-primary">{query}</span>" için {totalResults} sonuç bulundu
          </div>
        </div>
      </div>

      {/* ScrollArea - Esnek yükseklik */}
      <div className="flex-1 min-h-0 px-4 h-full">
        <ScrollArea className="h-full">
          <div className="space-y-3 pb-4">
            {Object.keys(results).map(entityType => (
              <SearchResultCategory 
                key={entityType} 
                entityType={entityType} 
                results={results[entityType]} 
                onItemSelect={onItemSelect} 
                isExpanded={expandedCategories[entityType]} 
                onToggleExpand={() => onToggleCategoryExpansion?.(entityType)} 
                enableContextMenu={enableContextMenu} 
                searchTerm={query} 
                contextMenuRenderer={contextMenuRenderer} 
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};