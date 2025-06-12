// client/src/app/globalSearch/components/RecentSearches.jsx
import React from 'react';
import { Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const RecentSearches = ({ 
  recentSearches = [], 
  onRecentSearchClick,
  onClearRecentSearches,
  showClearButton = true 
}) => {
  if (recentSearches.length === 0) return null;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Son aramalar
        </div>
        {showClearButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearRecentSearches}
            className="h-6 px-2 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Temizle
          </Button>
        )}
      </div>
      <div className="space-y-1">
        {recentSearches.map((recentQuery, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-2 rounded hover:bg-accent cursor-pointer group"
            onClick={() => onRecentSearchClick?.(recentQuery)}
          >
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm flex-1">{recentQuery}</span>
            <Badge variant="secondary" className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">
              Ara
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};