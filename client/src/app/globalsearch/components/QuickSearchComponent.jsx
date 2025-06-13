// client/src/app/globalsearch/components/QuickSearchComponent.jsx
import React, { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils'; // EKSIK OLAN IMPORT
import { GlobalSearch_Store } from '../constants/store';
import { getEntityConfig } from '../helpers/entityConfig';
import { debounce } from '../helpers/searchUtils';

export const QuickSearchComponent = ({
  placeholder = "Hızlı ara...",
  onResultSelect,
  limit = 10,
  className
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { performQuickSearch } = GlobalSearch_Store();
  const [quickResults, setQuickResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useCallback(
    debounce(async (searchQuery) => {
      if (!searchQuery.trim() || searchQuery.length < 1) {
        setQuickResults({});
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const results = await performQuickSearch({ query: searchQuery, limit });
        setQuickResults(results);
      } catch (error) {
        console.error('Quick search error:', error);
        setQuickResults({});
      } finally {
        setIsLoading(false);
      }
    }, 200),
    [performQuickSearch, limit]
  );

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setIsOpen(true);
    debouncedSearch(newQuery);
  };

  const handleResultClick = (item, entityType) => {
    setIsOpen(false);
    setQuery('');
    onResultSelect?.(item, entityType);
  };

  const totalResults = Object.values(quickResults).reduce((sum, arr) => sum + (arr?.length || 0), 0);

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className="pl-10"
        />
      </div>

      {isOpen && query.trim() && (
        <Card className="absolute w-full mt-1 z-50 shadow-lg">
          <CardContent className="p-2">
            {isLoading && (
              <div className="text-center text-sm text-muted-foreground py-2">
                Aranıyor...
              </div>
            )}
            
            {!isLoading && totalResults === 0 && (
              <div className="text-center text-sm text-muted-foreground py-2">
                Sonuç bulunamadı
              </div>
            )}

            {!isLoading && totalResults > 0 && (
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {Object.entries(quickResults).map(([entityType, items]) => 
                  items.map((item) => {
                    const config = getEntityConfig(entityType);
                    const Icon = config.icon;
                    
                    return (
                      <div
                        key={`${entityType}-${item.id}`}
                        className="flex items-center gap-2 p-2 hover:bg-accent rounded cursor-pointer"
                        onClick={() => handleResultClick(item, entityType)}
                      >
                        <Icon className={cn("h-4 w-4", config.color)} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            {item.ad || item.vidaNo || item.sicil || item.id}
                          </div>
                          {item.aciklama && (
                            <div className="text-xs text-muted-foreground truncate">
                              {item.aciklama}
                            </div>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {config.label}
                        </Badge>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};