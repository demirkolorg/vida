// src/components/FontSizeControls.jsx
import React from 'react';
import { useThemeStore } from '@/stores/useThemeStore';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function FontSizeControls() {
  const {
    fontSize,
    minFontSize,
    maxFontSize,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    isLoadingSettings
  } = useThemeStore();

  if (isLoadingSettings) {
    return (
      <div className="fixed bottom-6 right-6 bg-background/95 backdrop-blur-lg p-4 rounded-2xl shadow-2xl border border-border/50">
        <Skeleton className="h-10 w-48" />
      </div>
    );
  }

  const isMinSize = fontSize <= minFontSize;
  const isMaxSize = fontSize >= maxFontSize;
  const isDefaultSize = fontSize === 15;

  return (
    <div className="p-4">
      <div className="flex items-center gap-3">
        {/* Font Size Label */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Yazı Boyutu:</span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Decrease Button */}
          <Button 
            onClick={decreaseFontSize} 
            aria-label="Yazı boyutunu azalt" 
            variant="ghost"
            size="icon"
            disabled={isMinSize}
            className={`
              h-10 w-10 rounded-xl transition-all duration-200 
              ${!isMinSize ? 'hover:scale-105 hover:bg-primary/10 hover:text-primary' : ''}
              ${isMinSize ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </Button>
          
          {/* Font Size Display */}
          <div className="bg-muted/50 px-3 py-2 rounded-lg border border-border/50">
            <span className="text-sm font-mono text-foreground min-w-[3rem] text-center block">
              {fontSize}px
            </span>
          </div>
          
          {/* Increase Button */}
          <Button 
            onClick={increaseFontSize} 
            aria-label="Yazı boyutunu arttır" 
            variant="ghost"
            size="icon"
            disabled={isMaxSize}
            className={`
              h-10 w-10 rounded-xl transition-all duration-200 
              ${!isMaxSize ? 'hover:scale-105 hover:bg-primary/10 hover:text-primary' : ''}
              ${isMaxSize ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </Button>

          {/* Reset Button */}
          {!isDefaultSize && (
            <Button 
              onClick={resetFontSize} 
              aria-label="Varsayılan font boyutuna dön" 
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl transition-all duration-200 hover:scale-105 hover:bg-secondary/80 hover:text-secondary-foreground ml-1"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Font Size Range Indicator */}
        <div className="flex flex-col items-center gap-1">
          <div className="text-xs text-muted-foreground">
            {minFontSize}-{maxFontSize}px
          </div>
          {/* Progress Bar */}
          <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{
                width: `${((fontSize - minFontSize) / (maxFontSize - minFontSize)) * 100}%`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}