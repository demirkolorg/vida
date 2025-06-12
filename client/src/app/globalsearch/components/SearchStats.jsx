// client/src/app/globalSearch/components/SearchStats.jsx
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, Search, Zap } from 'lucide-react';
import { getSearchStatsText } from '../helpers/searchUtils';

export const SearchStats = ({ stats = {} }) => {
  const { totalSearches = 0, averageResponseTime = 0, lastSearchTime = null } = stats;

  if (totalSearches === 0) return null;

  return (
    <div className="flex items-center gap-2 p-2 text-xs text-muted-foreground border-t">
      <div className="flex items-center gap-1">
        <Search className="h-3 w-3" />
        <span>{totalSearches} arama</span>
      </div>
      <div className="flex items-center gap-1">
        <Zap className="h-3 w-3" />
        <span>{averageResponseTime} ms ort.</span>
      </div>
      {lastSearchTime && (
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>Son: {new Date(lastSearchTime).toLocaleTimeString('tr-TR')}</span>
        </div>
      )}
    </div>
  );
};