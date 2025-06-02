// client/src/app/malzeme/components/BulkOperationsToolbar.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  RotateCcw, 
  ArrowUpDown, 
  Truck, 
  Settings, 
  AlertTriangle, 
  TrendingDown,
  Package,
  X,
  ChevronDown,
  CheckSquare,
  Square
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MalzemeHareket_Store } from '@/app/malzemehareket/constants/store';
import { cn } from '@/lib/utils';

const BulkOperationsToolbar = ({ selectedMalzemeler, onClearSelection, onBulkOperationStart }) => {
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState(null);
  
  const selectedCount = selectedMalzemeler?.length || 0;
  const validateMalzemelerForBulkOperation = MalzemeHareket_Store(state => state.validateMalzemelerForBulkOperation);

  // Bulk işlem seçenekleri
  const bulkOperations = [
    {
      type: 'ZIMMET',
      label: 'Toplu Zimmet',
      description: 'Seçili malzemeleri toplu olarak zimmetle',
      icon: Users,
      color: 'blue',
      requiresPersonel: true
    },
    {
      type: 'IADE',
      label: 'Toplu İade',
      description: 'Seçili malzemeleri toplu olarak iade al',
      icon: RotateCcw,
      color: 'green',
      requiresKonum: true
    },
    {
      type: 'DEVIR',
      label: 'Toplu Devir',
      description: 'Seçili malzemeleri toplu olarak devret',
      icon: ArrowUpDown,
      color: 'orange',
      requiresPersonel: true
    },
    {
      type: 'DEPO_TRANSFER',
      label: 'Toplu Depo Transfer',
      description: 'Seçili malzemeleri toplu olarak transfer et',
      icon: Truck,
      color: 'indigo',
      requiresKonum: true
    },
    {
      type: 'KONDISYON',
      label: 'Toplu Kondisyon Güncelleme',
      description: 'Seçili malzemelerin kondisyonunu toplu güncelle',
      icon: Settings,
      color: 'purple',
      requiresKondisyon: true
    },
    {
      type: 'KAYIP',
      label: 'Toplu Kayıp Bildirimi',
      description: 'Seçili malzemeleri toplu kayıp olarak işaretle',
      icon: AlertTriangle,
      color: 'red',
      destructive: true
    },
    {
      type: 'DUSUM',
      label: 'Toplu Düşüm',
      description: 'Seçili malzemeleri toplu olarak düşür',
      icon: TrendingDown,
      color: 'gray',
      destructive: true
    },
    {
      type: 'KAYIT',
      label: 'Toplu İlk Kayıt',
      description: 'Seçili malzemeleri toplu olarak kayıt et',
      icon: Package,
      color: 'emerald',
      requiresKonum: true
    }
  ];

  const handleOperationClick = (operation) => {
    // Malzemelerin bu işlem için uygunluğunu kontrol et
    const validation = validateMalzemelerForBulkOperation(operation.type, selectedMalzemeler);
    
    if (!validation.isValid) {
      // Uygunluk hatalarını göster
      setSelectedOperation({
        ...operation,
        validation: validation
      });
      setShowBulkDialog(true);
      return;
    }

    // İşlem uygunsa direkt başlat veya form aç
    if (onBulkOperationStart) {
      onBulkOperationStart(operation.type, selectedMalzemeler);
    }
  };

  const getOperationColor = (color) => {
    const colors = {
      blue: 'text-blue-600 hover:bg-blue-50',
      green: 'text-green-600 hover:bg-green-50',
      orange: 'text-orange-600 hover:bg-orange-50',
      indigo: 'text-indigo-600 hover:bg-indigo-50',
      purple: 'text-purple-600 hover:bg-purple-50',
      red: 'text-red-600 hover:bg-red-50',
      gray: 'text-gray-600 hover:bg-gray-50',
      emerald: 'text-emerald-600 hover:bg-emerald-50'
    };
    return colors[color] || 'text-gray-600 hover:bg-gray-50';
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <>
      <div className="flex items-center gap-3 p-3 bg-primary/5 border-b border-primary/20">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">
            {selectedCount} malzeme seçildi
          </span>
          <Badge variant="secondary" className="ml-1">
            {selectedCount}
          </Badge>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Toplu İşlemler:</span>
          
          {/* Normal butonlar (sık kullanılanlar) */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOperationClick(bulkOperations[0])} // Zimmet
              className="h-8 text-blue-600 hover:bg-blue-50"
            >
              <Users className="h-3 w-3 mr-1" />
              Zimmet
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOperationClick(bulkOperations[1])} // İade
              className="h-8 text-green-600 hover:bg-green-50"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              İade
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOperationClick(bulkOperations[2])} // Devir
              className="h-8 text-orange-600 hover:bg-orange-50"
            >
              <ArrowUpDown className="h-3 w-3 mr-1" />
              Devir
            </Button>
          </div>

          {/* Dropdown menu (diğer işlemler) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                Diğer İşlemler
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-72">
              <DropdownMenuLabel>Toplu İşlemler</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {bulkOperations.slice(3).map((operation) => {
                const IconComponent = operation.icon;
                const validation = validateMalzemelerForBulkOperation(operation.type, selectedMalzemeler);
                const isValid = validation.isValid;

                return (
                  <DropdownMenuItem
                    key={operation.type}
                    onClick={() => handleOperationClick(operation)}
                    className={cn(
                      "flex flex-col items-start p-3 cursor-pointer",
                      getOperationColor(operation.color),
                      !isValid && "opacity-50"
                    )}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <IconComponent className="h-4 w-4" />
                      <div className="flex-1">
                        <div className="font-medium">{operation.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {operation.description}
                        </div>
                      </div>
                      {!isValid && (
                        <Badge variant="destructive" className="text-xs">
                          {validation.invalidCount} Uygun Değil
                        </Badge>
                      )}
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="h-8 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3 mr-1" />
            Seçimi Temizle
          </Button>
        </div>
      </div>

      {/* Bulk İşlem Doğrulama Dialog'u */}
      <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedOperation?.icon && <selectedOperation.icon className="h-5 w-5" />}
              {selectedOperation?.label}
            </DialogTitle>
            <DialogDescription>
              Seçili malzemelerden bazıları bu işlem için uygun değil.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {selectedOperation?.validation && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Toplam Seçili:</span>
                  <Badge variant="secondary">{selectedCount}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Uygun Olan:</span>
                  <Badge variant="success">{selectedOperation.validation.validCount}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Uygun Olmayan:</span>
                  <Badge variant="destructive">{selectedOperation.validation.invalidCount}</Badge>
                </div>

                {selectedOperation.validation.invalidMalzemeler?.length > 0 && (
                  <div className="border rounded-lg p-3 bg-muted/50">
                    <div className="text-sm font-medium mb-2">Uygun Olmayan Malzemeler:</div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {selectedOperation.validation.invalidMalzemeler.slice(0, 5).map((invalid, index) => (
                        <div key={index} className="text-xs text-muted-foreground">
                          <span className="font-mono">{invalid.malzeme.vidaNo || invalid.malzeme.id}</span>
                          <span className="mx-2">-</span>
                          <span>{invalid.reason}</span>
                        </div>
                      ))}
                      {selectedOperation.validation.invalidMalzemeler.length > 5 && (
                        <div className="text-xs text-muted-foreground">
                          ... ve {selectedOperation.validation.invalidMalzemeler.length - 5} daha
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowBulkDialog(false)}>
                İptal
              </Button>
              {selectedOperation?.validation?.validCount > 0 && (
                <Button
                  onClick={() => {
                    // Sadece uygun malzemelerle işlemi başlat
                    const validMalzemeler = selectedMalzemeler.filter(malzeme => 
                      !selectedOperation.validation.invalidMalzemeler.some(invalid => 
                        invalid.malzeme.id === malzeme.id
                      )
                    );
                    
                    if (onBulkOperationStart) {
                      onBulkOperationStart(selectedOperation.type, validMalzemeler);
                    }
                    setShowBulkDialog(false);
                  }}
                  className={cn(
                    selectedOperation?.destructive && "bg-destructive hover:bg-destructive/90"
                  )}
                >
                  {selectedOperation?.validation?.validCount} Malzeme ile Devam Et
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BulkOperationsToolbar;