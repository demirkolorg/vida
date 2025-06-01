// src/contexts/LayoutContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LayoutContextType {
  isDetailPanelOpen: boolean;
  setIsDetailPanelOpen: (isOpen: boolean) => void;
  disablePadding: boolean;
  setDisablePadding: (disable: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};

interface LayoutProviderProps {
  children: ReactNode;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [disablePadding, setDisablePadding] = useState(false);

  return (
    <LayoutContext.Provider 
      value={{ 
        isDetailPanelOpen, 
        setIsDetailPanelOpen, 
        disablePadding, 
        setDisablePadding 
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};