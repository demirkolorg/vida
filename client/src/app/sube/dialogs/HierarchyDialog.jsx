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
import { Building2Icon, HomeIcon, UsersIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const Sube_HierarchyDialog = ({ 
  isOpen, 
  onClose, 
  birimData = [] // Birim ve şube verilerini içeren array
}) => {
  // Veriyi hiyerarşik yapıya dönüştür
  const hierarchyData = React.useMemo(() => {
    if (!birimData || birimData.length === 0) return [];

    // Birimler ve şubelerini grupla
    const birimMap = new Map();
    
    birimData.forEach(sube => {
      const birimId = sube.birim?.id;
      const birimAd = sube.birim?.ad || 'Bilinmeyen Birim';
      
      if (!birimMap.has(birimId)) {
        birimMap.set(birimId, {
          id: birimId,
          ad: birimAd,
          subeler: []
        });
      }
      
      birimMap.get(birimId).subeler.push(sube);
    });

    return Array.from(birimMap.values()).sort((a, b) => 
      a.ad.localeCompare(b.ad, 'tr')
    );
  }, [birimData]);

  const totalStats = React.useMemo(() => {
    const stats = {
      birimSayisi: hierarchyData.length,
      subeSayisi: birimData.length,
      buroSayisi: birimData.reduce((total, sube) => 
        total + (sube.burolar?.length || 0), 0
      ),
      malzemeSayisi: birimData.reduce((total, sube) => 
        total + (sube.malzemeler?.length || 0), 0
      )
    };
    return stats;
  }, [hierarchyData, birimData]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2Icon className="h-5 w-5" />
            Organizasyonel Hiyerarşi
          </DialogTitle>
          <DialogDescription>
            Birim, şube ve büro yapısının hiyerarşik görünümü
          </DialogDescription>
        </DialogHeader>

        {/* İstatistikler */}
        <div className="grid grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {totalStats.birimSayisi}
            </div>
            <div className="text-sm text-muted-foreground">Birim</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {totalStats.subeSayisi}
            </div>
            <div className="text-sm text-muted-foreground">Şube</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {totalStats.buroSayisi}
            </div>
            <div className="text-sm text-muted-foreground">Büro</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {totalStats.malzemeSayisi}
            </div>
            <div className="text-sm text-muted-foreground">Malzeme</div>
          </div>
        </div>

        <Separator />

        {/* Hiyerarşi Ağacı */}
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6">
            {hierarchyData.map((birim) => (
              <div key={birim.id} className="space-y-3">
                {/* Birim Başlığı */}
                <div className="flex items-center gap-3 p-3 bg-primary/50 rounded-lg border-l-4 border-l-primary">
                  <Building2Icon className="h-5 w-5  flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold ">{birim.ad}</h3>
                    <p className="text-sm ">
                      {birim.subeler.length} şube
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-primary-foreground text-primary">
                    {birim.subeler.reduce((total, sube) => 
                      total + (sube.burolar?.length || 0), 0
                    )} büro
                  </Badge>
                </div>

                {/* Şubeler */}
                <div className="ml-8 space-y-3">
                  {birim.subeler
                    .sort((a, b) => a.ad.localeCompare(b.ad, 'tr'))
                    .map((sube) => (
                    <div key={sube.id} className="space-y-2">
                      {/* Şube Bilgisi */}
                      <div className="flex items-center gap-3 p-3 bg-primary/20 rounded-lg border-l-4 border-l-primary/50">
                        <HomeIcon className="h-4 w-4  flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="font-medium ">{sube.ad}</h4>
                          {sube.aciklama && (
                            <p className="text-sm mt-1">
                              {sube.aciklama}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {sube.burolar && sube.burolar.length > 0 && (
                            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                              <UsersIcon className="h-3 w-3 mr-1" />
                              {sube.burolar.length} büro
                            </Badge>
                          )}
                          {sube.malzemeler && sube.malzemeler.length > 0 && (
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                              {sube.malzemeler.length} malzeme
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Bürolar */}
                      {sube.burolar && sube.burolar.length > 0 && (
                        <div className="ml-8 grid grid-cols-1 md:grid-cols-2 gap-2">
                          {sube.burolar
                            .sort((a, b) => a.ad.localeCompare(b.ad, 'tr'))
                            .map((buro) => (
                            <div 
                              key={buro.id} 
                              className="flex items-center gap-2 p-2 bg-orange-50 rounded border-l-2 border-l-orange-400"
                            >
                              <UsersIcon className="h-3 w-3 text-orange-600 flex-shrink-0" />
                              <span className="text-sm font-medium text-orange-900">
                                {buro.ad}
                              </span>
                              {buro.amir && (
                                <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                                  {buro.amir.ad || buro.amir.sicil}
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {hierarchyData.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Building2Icon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Henüz hiç şube verisi bulunmamaktadır.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};