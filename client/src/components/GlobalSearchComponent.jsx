import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, FileText, Users, Building, Package, Wrench, Archive, MapPin, Warehouse, Tag, Loader2, Clock, ChevronDown, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

// Global arama API fonksiyonu (gerçek implementasyon için)
const globalSearchApi = async (query, entityTypes = []) => {
  // Bu fonksiyon backend'e global arama isteği gönderecek
  // Şimdilik mock data döndürüyoruz
  
  if (!query.trim()) return {};
  
  // Simulated delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock search results
  const mockResults = {
    birim: [
      { id: '1', ad: 'Bilgi İşlem Müdürlüğü', aciklama: 'Teknoloji ve bilgi işlem hizmetleri', status: 'Aktif', subeSayisi: 3 },
      { id: '2', ad: 'İnsan Kaynakları Müdürlüğü', aciklama: 'Personel yönetimi', status: 'Aktif', subeSayisi: 2 }
    ],
    personel: [
      { id: '1', ad: 'Ahmet', soyad: 'YILMAZ', sicil: '100001', role: 'Admin', avatar: 'https://avatar.iran.liara.run/public/38' },
      { id: '2', ad: 'Ayşe', soyad: 'DEMİR', sicil: '100002', role: 'Personel', avatar: 'https://avatar.iran.liara.run/public/51' }
    ],
    malzeme: [
      { id: '1', vidaNo: 'BLG-2024-001', aciklama: 'Dell masaüstü bilgisayar', marka: { ad: 'Dell' }, model: { ad: 'OptiPlex 7090' }, status: 'Aktif' },
      { id: '2', vidaNo: 'BLG-2024-002', aciklama: 'HP laptop', marka: { ad: 'HP' }, model: { ad: 'EliteBook 850' }, status: 'Aktif' }
    ],
    sube: [
      { id: '1', ad: 'İstanbul Şubesi', aciklama: 'İstanbul bölge şubesi', birim: { ad: 'Bilgi İşlem Müdürlüğü' }, status: 'Aktif' }
    ]
  };
  
  // Filter results based on query (simple mock filtering)
  const filteredResults = {};
  Object.keys(mockResults).forEach(entityType => {
    if (entityTypes.length === 0 || entityTypes.includes(entityType)) {
      filteredResults[entityType] = mockResults[entityType].filter(item => {
        const searchText = query.toLowerCase();
        return JSON.stringify(item).toLowerCase().includes(searchText);
      });
    }
  });
  
  return filteredResults;
};

// Entity icons and labels
const entityConfig = {
  birim: { icon: Building, label: 'Birimler', color: 'text-blue-600' },
  sube: { icon: Archive, label: 'Şubeler', color: 'text-green-600' },
  buro: { icon: FileText, label: 'Bürolar', color: 'text-purple-600' },
  personel: { icon: Users, label: 'Personeller', color: 'text-orange-600' },
  malzeme: { icon: Package, label: 'Malzemeler', color: 'text-red-600' },
  malzemeHareket: { icon: Wrench, label: 'Malzeme Hareketleri', color: 'text-yellow-600' },
  marka: { icon: Tag, label: 'Markalar', color: 'text-indigo-600' },
  model: { icon: Tag, label: 'Modeller', color: 'text-pink-600' },
  depo: { icon: Warehouse, label: 'Depolar', color: 'text-cyan-600' },
  konum: { icon: MapPin, label: 'Konumlar', color: 'text-emerald-600' },
  sabitKodu: { icon: Tag, label: 'Sabit Kodlar', color: 'text-slate-600' }
};

// Search result item component
const SearchResultItem = ({ item, entityType, onSelect }) => {
  const config = entityConfig[entityType];
  const Icon = config?.icon || FileText;

  const renderItemContent = () => {
    switch (entityType) {
      case 'birim':
        return (
          <div className="space-y-1">
            <div className="font-medium">{item.ad}</div>
            {item.aciklama && (
              <div className="text-sm text-muted-foreground">{item.aciklama}</div>
            )}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-xs">
                {item.status}
              </Badge>
              {item.subeSayisi > 0 && (
                <span>{item.subeSayisi} şube</span>
              )}
            </div>
          </div>
        );
      
      case 'personel':
        return (
          <div className="flex items-center gap-3">
            {item.avatar && (
              <img 
                src={item.avatar} 
                alt={`${item.ad} ${item.soyad}`}
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <div className="space-y-1">
              <div className="font-medium">{item.ad} {item.soyad}</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Sicil: {item.sicil}</span>
                <Badge variant="outline" className="text-xs">
                  {item.role}
                </Badge>
              </div>
            </div>
          </div>
        );
      
      case 'malzeme':
        return (
          <div className="space-y-1">
            <div className="font-medium">{item.vidaNo}</div>
            {item.aciklama && (
              <div className="text-sm text-muted-foreground">{item.aciklama}</div>
            )}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {item.marka && <span>{item.marka.ad}</span>}
              {item.model && <span>{item.model.ad}</span>}
              <Badge variant="outline" className="text-xs">
                {item.status}
              </Badge>
            </div>
          </div>
        );
      
      case 'sube':
        return (
          <div className="space-y-1">
            <div className="font-medium">{item.ad}</div>
            {item.aciklama && (
              <div className="text-sm text-muted-foreground">{item.aciklama}</div>
            )}
            {item.birim && (
              <div className="text-xs text-muted-foreground">
                Birim: {item.birim.ad}
              </div>
            )}
          </div>
        );
      
      default:
        return (
          <div className="space-y-1">
            <div className="font-medium">{item.ad || item.name || item.id}</div>
            {item.aciklama && (
              <div className="text-sm text-muted-foreground">{item.aciklama}</div>
            )}
          </div>
        );
    }
  };

  return (
    <div
      className="flex items-start gap-3 p-3  hover:bg-accent/50 cursor-pointer transition-colors"
      onClick={() => onSelect?.(item, entityType)}
    >
      <Icon className={cn("h-5 w-5 mt-0.5", config?.color)} />
      <div className="flex-1 min-w-0">
        {renderItemContent()}
      </div>
    </div>
  );
};

// Search results category component
const SearchResultCategory = ({ entityType, results, onItemSelect, isExpanded, onToggleExpand }) => {
  const config = entityConfig[entityType];
  const Icon = config?.icon || FileText;

  if (!results || results.length === 0) return null;

  return (
    <div className="border-primary ">
      <Collapsible open={isExpanded} onOpenChange={onToggleExpand} className="my-2  border border-primary/50 rounded-xl">
        <CollapsibleTrigger asChild>
          <div className={` ${!isExpanded?"rounded-xl":"rounded-t-xl"} flex items-center justify-between p-3 bg-primary/20  cursor-pointer`}>
            <div className="flex items-center gap-2">
              <Icon className={cn("h-4 w-4", config?.color)} />
              <span className="font-medium text-sm">{config?.label}</span>
              <Badge className="text-xs bg-primary/70">
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
          <div className="space-y-1 pb-2">
            {results.map((item, index) => (
              <SearchResultItem
                key={item.id || index}
                item={item}
                entityType={entityType}
                onSelect={onItemSelect}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

// Main global search component
export const GlobalSearchComponent = ({ 
  placeholder = "Tüm kayıtlarda ara...",
  entityTypes = [], // Boş array = tüm entity'lerde ara
  onResultSelect,
  className 
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  
  const searchRef = useRef(null);
  const containerRef = useRef(null);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('vida-recent-searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error('Recent searches parse error:', e);
      }
    }
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery) => {
      if (!searchQuery.trim()) {
        setResults({});
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const searchResults = await globalSearchApi(searchQuery, entityTypes);
        setResults(searchResults);
        
        // Auto-expand categories with results
        const newExpandedCategories = {};
        Object.keys(searchResults).forEach(entityType => {
          if (searchResults[entityType] && searchResults[entityType].length > 0) {
            newExpandedCategories[entityType] = true;
          }
        });
        setExpandedCategories(newExpandedCategories);
      } catch (error) {
        console.error('Global search error:', error);
        setResults({});
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [entityTypes]
  );

  // Handle input change
  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setIsOpen(true);
    debouncedSearch(newQuery);
  };

  // Handle search focus
  const handleFocus = () => {
    setIsOpen(true);
  };

  // Save recent search
  const saveRecentSearch = (searchQuery) => {
    console.log("searchQuery",searchQuery)
    if (!searchQuery.trim()) return;
    
    const newRecentSearches = [
      searchQuery,
      ...recentSearches.filter(s => s !== searchQuery)
    ].slice(0, 5); // Keep only 5 recent searches
    
    setRecentSearches(newRecentSearches);
    localStorage.setItem('vida-recent-searches', JSON.stringify(newRecentSearches));
  };

  // Handle result selection
  const handleResultSelect = (item, entityType) => {
    saveRecentSearch(query);
    setIsOpen(false);
    onResultSelect?.(item, entityType);
  };

  // Handle recent search click
  const handleRecentSearchClick = (recentQuery) => {
    setQuery(recentQuery);
    debouncedSearch(recentQuery);
  };

  // Clear search
  const handleClear = () => {
    setQuery('');
    setResults({});
    setIsOpen(false);
    searchRef.current?.focus();
  };

  // Toggle category expansion
  const handleToggleCategoryExpansion = (entityType) => {
    setExpandedCategories(prev => ({
      ...prev,
      [entityType]: !prev[entityType]
    }));
  };

  // Calculate total results
  const totalResults = Object.values(results).reduce((sum, categoryResults) => 
    sum + (categoryResults?.length || 0), 0
  );

  // Check if we have any results
  const hasResults = totalResults > 0;
  const hasQuery = query.trim().length > 0;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={searchRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          className="px-10 py-6 mb-2 border border-primary"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <Card className="absolute p-4 w-full mt-1 z-44 shadow-xl border-primary ">
          <CardContent className="p-0">
            <ScrollArea className="">
              {isLoading && (
                <div className="flex items-center justify-center p-6">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">Aranıyor...</span>
                </div>
              )}

              {!isLoading && hasQuery && !hasResults && (
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <Search className="h-8 w-8 text-muted-foreground mb-2" />
                  <div className="text-sm text-muted-foreground">
                    "<span className="font-medium">{query}</span>" için sonuç bulunamadı
                  </div>
                </div>
              )}

              {!isLoading && hasQuery && hasResults && (
                <div>
                  <div className="px-3 py-2 border-b  rounded-xl  bg-primary/10">
                    <div className="text-sm text-muted-foreground">
                      "<span className="font-medium">{query}</span>" için {totalResults} sonuç bulundu
                    </div>
                  </div>
                  
                  {Object.keys(results).map(entityType => (
                    <SearchResultCategory
                      key={entityType}
                      entityType={entityType}
                      results={results[entityType]}
                      onItemSelect={handleResultSelect}
                      isExpanded={expandedCategories[entityType]}
                      onToggleExpand={() => handleToggleCategoryExpansion(entityType)}
                    />
                  ))}
                </div>
              )}

              {!isLoading && !hasQuery && recentSearches.length > 0 && (
                <div>
                  <div className="px-3 py-2 border-b bg-muted/50">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Son aramalar
                    </div>
                  </div>
                  <div className="p-2">
                    {recentSearches.map((recentQuery, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 rounded hover:bg-accent cursor-pointer"
                        onClick={() => handleRecentSearchClick(recentQuery)}
                      >
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{recentQuery}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!isLoading && !hasQuery && recentSearches.length === 0 && (
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <Search className="h-8 w-8 text-muted-foreground mb-2" />
                  <div className="text-sm text-muted-foreground">
                    Tüm kayıtlarda arama yapmak için yazmaya başlayın
                  </div>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Export for use in other components
export default GlobalSearchComponent;