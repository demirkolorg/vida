import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getEntityConfig } from '../helpers/entityConfig';
import { SearchResultItem } from './SearchResultItem';

export const SearchResultCategory = ({ 
  entityType, 
  results, 
  onItemSelect, 
  isExpanded, 
  onToggleExpand, 
  enableContextMenu = false, 
  searchTerm = '', 
  contextMenuRenderer = null 
}) => {
  const config = getEntityConfig(entityType);
  const Icon = config.icon;

  if (!results || results.length === 0) return null;

  const hasContextMenuSupport = ['malzeme', 'birim', 'personel', 'sube'].includes(entityType);

  const renderItem = (item, index) => {
    const itemComponent = (
      <SearchResultItem 
        key={item.id || index} 
        item={item} 
        entityType={entityType} 
        onSelect={onItemSelect} 
        hasContextMenu={enableContextMenu && hasContextMenuSupport} 
        searchTerm={searchTerm} 
      />
    );

  // Context menu desteği kontrolü - BU KOD DÜZELTILMELI
    if (enableContextMenu && contextMenuRenderer && typeof contextMenuRenderer === 'function') {
      try {
        return contextMenuRenderer(itemComponent, item, entityType);
      } catch (error) {
        console.error('Context menu render error:', error);
        return itemComponent;
      }
    }

    return itemComponent;
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggleExpand} className="border border-border rounded-lg overflow-hidden">
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between p-3 bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors">
          <div className="flex items-center gap-2">
            <Icon className={cn('h-4 w-4', config.color)} />
            <span className="font-medium text-sm">{config.label}</span>
            <Badge variant="secondary" className="text-xs">
              {results.length}
            </Badge>
          </div>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="bg-background">
          {results.map((item, index) => renderItem(item, index))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};