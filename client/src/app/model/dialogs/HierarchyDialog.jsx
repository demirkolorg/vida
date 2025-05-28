import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Building2Icon, TagIcon, PackageIcon, Layers3Icon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const Model_HierarchyDialog = ({ 
  isOpen, 
  onClose, 
  markaData = [] // Model ve marka verilerini içeren array
}) => {
  // Veriyi hiyerarşik yapıya dönüştür
  const hierarchyData = React.useMemo(() => {
    if (!markaData || markaData.length === 0) return [];

    // Markaları ve modellerini grupla
    const markaMap = new Map();
    
    markaData.forEach(model => {
      const markaId = model.marka?.id;
      const markaAd = model.marka?.ad || 'Bilinmeyen Marka';
      
      if (!markaMap.has(markaId)) {
        markaMap.set(markaId, {
          id: markaId,
          ad: markaAd,
          modeller: []
        });
      }
      
      markaMap.get(markaId).modeller.push(model);
    });

    return Array.from(markaMap.values()).sort((a, b) => 
      a.ad.localeCompare(b.ad, 'tr')
    );
  }, [markaData]);

  const totalStats = React.useMemo(() => {
    const stats = {
      markaSayisi: hierarchyData.length,
      modelSayisi: markaData.length,
      malzemeSayisi: markaData.reduce((total, model) => 
        total + (model.malzemeler?.length || 0), 0
      ),
      ortalamaMalzemePerModel: markaData.length > 0 
        ? Math.round(markaData.reduce((total, model) => 
            total + (model.malzemeler?.length || 0), 0) / markaData.length * 100) / 100 
        : 0
    };
    return stats;
  }, [hierarchyData, markaData]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layers3Icon className="h-5 w-5" />
            Model Hiyerarşisi
          </DialogTitle>
          <DialogDescription>
            Marka ve model yapısının hiyerarşik görünümü
          </DialogDescription>
        </DialogHeader>

        {/* İstatistikler */}
        <div className="grid grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {totalStats.markaSayisi}
            </div>
            <div className="text-sm text-muted-foreground">Marka</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {totalStats.modelSayisi}
            </div>
            <div className="text-sm text-muted-foreground">Model</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {totalStats.malzemeSayisi}
            </div>
            <div className="text-sm text-muted-foreground">Malzeme</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {totalStats.ortalamaMalzemePerModel}
            </div>
            <div className="text-sm text-muted-foreground">Ort. Malzeme/Model</div>
          </div>
        </div>

        <Separator />

        {/* Hiyerarşi Ağacı */}
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6">
            {hierarchyData.map((marka) => (
              <div key={marka.id} className="space-y-3">
                {/* Marka Başlığı */}
                <div className="flex items-center gap-3 p-3 bg-primary/50 rounded-lg border-l-4 border-l-primary">
                  <Building2Icon className="h-5 w-5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{marka.ad}</h3>
                    <p className="text-sm">
                      {marka.modeller.length} model
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-primary-foreground text-primary">
                    {marka.modeller.reduce((total, model) => 
                      total + (model.malzemeler?.length || 0), 0
                    )} malzeme
                  </Badge>
                </div>

                {/* Modeller */}
                <div className="ml-8 space-y-3">
                  {marka.modeller
                    .sort((a, b) => a.ad.localeCompare(b.ad, 'tr'))
                    .map((model) => (
                    <div key={model.id} className="space-y-2">
                      {/* Model Bilgisi */}
                      <div className="flex items-center gap-3 p-3 bg-primary/20 rounded-lg border-l-4 border-l-primary/50">
                        <TagIcon className="h-4 w-4 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="font-medium">{model.ad}</h4>
                          {model.aciklama && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {model.aciklama}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {model.malzemeler && model.malzemeler.length > 0 && (
                            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                              <PackageIcon className="h-3 w-3 mr-1" />
                              {model.malzemeler.length} malzeme
                            </Badge>
                          )}
                          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 font-mono text-xs">
                            ID: {model.id.slice(-8)}
                          </Badge>
                        </div>
                      </div>

                      {/* Malzemeler - Sadece ilk birkaçını göster */}
                      {model.malzemeler && model.malzemeler.length > 0 && (
                        <div className="ml-8 space-y-1">
                          <div className="text-xs font-medium text-muted-foreground mb-2">
                            Malzemeler:
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                            {model.malzemeler
                              .slice(0, 4) // İlk 4 malzemeyi göster
                              .map((malzeme) => (
                              <div 
                                key={malzeme.id} 
                                className="flex items-center gap-2 p-2 bg-orange-50 rounded border-l-2 border-l-orange-400"
                              >
                                <PackageIcon className="h-3 w-3 text-orange-600 flex-shrink-0" />
                                <span className="text-sm font-medium text-orange-900 truncate">
                                  {malzeme.vidaNo || malzeme.kod || `ID: ${malzeme.id.slice(-6)}`}
                                </span>
                              </div>
                            ))}
                          </div>
                          {model.malzemeler.length > 4 && (
                            <div className="text-xs text-muted-foreground mt-2 ml-2">
                              ... ve {model.malzemeler.length - 4} malzeme daha
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {hierarchyData.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Layers3Icon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Henüz hiç model verisi bulunmamaktadır.</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Özet Bilgiler */}
        {hierarchyData.length > 0 && (
          <>
            <Separator />
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Building2Icon className="h-4 w-4" />
                Özet Bilgiler
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">En Çok Modeli Olan Marka:</span>
                  <div className="text-blue-600 font-semibold">
                    {hierarchyData.reduce((max, marka) => 
                      marka.modeller.length > max.modeller.length ? marka : max
                    ).ad} ({hierarchyData.reduce((max, marka) => 
                      marka.modeller.length > max.modeller.length ? marka : max
                    ).modeller.length})
                  </div>
                </div>
                <div>
                  <span className="font-medium">En Çok Malzemesi Olan Model:</span>
                  <div className="text-green-600 font-semibold">
                    {(() => {
                      const maxModel = markaData.reduce((max, model) => 
                        (model.malzemeler?.length || 0) > (max.malzemeler?.length || 0) ? model : max
                      );
                      return `${maxModel.ad} (${maxModel.malzemeler?.length || 0})`;
                    })()}
                  </div>
                </div>
                <div>
                  <span className="font-medium">Toplam Benzersiz Marka:</span>
                  <div className="text-orange-600 font-semibold">
                    {hierarchyData.length}
                  </div>
                </div>
                <div>
                  <span className="font-medium">Toplam Model:</span>
                  <div className="text-purple-600 font-semibold">
                    {totalStats.modelSayisi}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};