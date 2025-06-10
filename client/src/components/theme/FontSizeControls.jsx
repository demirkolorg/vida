import React from 'react';
import { useSettings } from './SettingsContext';

export function FontSizeControls() {
  const { increaseFontSize, decreaseFontSize, baseFontSize } = useSettings();

  return (
    <div className="fixed bottom-6 right-6 bg-gradient-to-r from-slate-800 to-slate-900 backdrop-blur-lg p-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700/50">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-slate-300">Aa</span>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={decreaseFontSize} 
            aria-label="Yazı boyutunu azalt" 
            className="group bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white font-bold h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          
          <div className="bg-slate-700/50 px-3 py-2 rounded-lg border border-slate-600/50">
            <span className="text-sm font-mono text-slate-200 min-w-[3rem] text-center block">
              {baseFontSize}px
            </span>
          </div>
          
          <button 
            onClick={increaseFontSize} 
            aria-label="Yazı boyutunu arttır" 
            className="group bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white font-bold h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}