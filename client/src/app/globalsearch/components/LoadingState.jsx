// client/src/app/globalSearch/components/LoadingState.jsx
import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState = ({ message = "Aranıyor..." }) => {
  return (
    <div className="flex items-center justify-center p-6">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      <span className="ml-2 text-sm text-muted-foreground">{message}</span>
    </div>
  );
};