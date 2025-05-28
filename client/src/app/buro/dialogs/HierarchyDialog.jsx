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
import { Building2Icon, HomeIcon, UsersIcon, UserIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const Buro_HierarchyDialog = ({ 
  isOpen, 
  onClose, 
  buroData = [] // Büro verilerini içeren array
}) => {
  // Veriyi hiyerarşik yapıya dönüştür (Birim > Şube > Büro)
  const hierarchyData = React.useMemo(() => {
    if (!buroData || buroData.length === 0) return [];

    // Birimler, şubeler ve bürolarını grupla
    const birimMap = new Map();
    
    buroData.forEach(buro => {
      const birimId = buro.sube?.birim?.id;
      const birimAd = buro.sube?.birim?.ad || 'Bilinmeyen Birim';
      const subeId = buro.sube?.id;
      const subeAd = buro.sube?.ad || 'Bilinmeyen Şube';
      
      if (!birimMap.has(birimId)) {
        birimMap.set(birimId, {
          id: birimId,
          ad: birimAd,
          subeler: new Map()
        });
      }
      
      const birim = birimMap.get(birimId);
      if (!birim.subeler.has(subeId)) {
        birim.subeler.set(subeId, {
          id: subeId,
          ad: subeAd,
          aciklama: buro.sube?.aciklama,
          burolar: []
        });
      }
      
      birim.subeler.get(subeId).burolar.push(buro);
    });

    // Map'leri array'e dönüştür ve sırala
    return Array.from(birimMap.values()).map(birim => ({
      ...birim,
      subeler: Array.from(birim.subeler.values()).sort((a, b) => 
        a.ad.localeCompare(b.ad, 'tr')
      )
    })).sort((a, b) => a.ad.localeCompare(b.ad, 'tr'));
  }, [buroData]);

  const totalStats = React.useMemo(() => {
    const stats = {
      birimSayisi: hierarchyData.length,
      subeSayisi: hierarchyData.reduce((total, birim) => 
        total + birim.subeler.length, 0
      ),
      buroSayisi: buroData.length,
      personelSayisi: buroData.reduce((total, buro) => 
        total + (buro.personeller?.length || 0), 0
      )
    };
    return stats;
  }, [hierarchyData, buroData]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5" />
            Büro Hiyerarşisi
          </DialogTitle>
          <DialogDescription>
            Büroların birim ve şube bazında hiyerarşik görünümü
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
              {totalStats.personelSayisi}
            </div>
            <div className="text-sm text-muted-foreground">Personel</div>
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
                  <Building2Icon className="h-5 w-5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{birim.ad}</h3>
                    <p className="text-sm">
                      {birim.subeler.length} şube, {birim.subeler.reduce((total, sube) => 
                        total + sube.burolar.length, 0
                      )} büro
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-primary-foreground text-primary">
                    {birim.subeler.reduce((total, sube) => 
                      total + sube.burolar.reduce((buroTotal, buro) => 
                        buroTotal + (buro.personeller?.length || 0), 0
                      ), 0
                    )} personel
                  </Badge>
                </div>

                {/* Şubeler */}
                <div className="ml-8 space-y-4">
                  {birim.subeler.map((sube) => (
                    <div key={sube.id} className="space-y-3">
                      {/* Şube Bilgisi */}
                      <div className="flex items-center gap-3 p-3 bg-primary/20 rounded-lg border-l-4 border-l-primary/50">
                        <HomeIcon className="h-4 w-4 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="font-medium">{sube.ad}</h4>
                          {sube.aciklama && (
                            <p className="text-sm mt-1 text-muted-foreground">
                              {sube.aciklama}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground mt-1">
                            {sube.burolar.length} büro
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          {sube.burolar.reduce((total, buro) => 
                            total + (buro.personeller?.length || 0), 0
                          )} personel
                        </Badge>
                      </div>

                      {/* Bürolar */}
                      <div className="ml-8 space-y-2">
                        {sube.burolar
                          .sort((a, b) => a.ad.localeCompare(b.ad, 'tr'))
                          .map((buro) => (
                          <div key={buro.id} className="space-y-2">
                            {/* Büro Bilgisi */}
                            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border-l-4 border-l-orange-400">
                              <UsersIcon className="h-4 w-4 text-orange-600 flex-shrink-0" />
                              <div className="flex-1">
                                <h5 className="font-medium text-orange-900">{buro.ad}</h5>
                                {buro.aciklama && (
                                  <p className="text-sm text-orange-700 mt-1">
                                    {buro.aciklama}
                                  </p>
                                )}
                                <div className="flex items-center gap-2 mt-1">
                                  {buro.amir && (
                                    <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                                      Amir: {buro.amir.ad || buro.amir.sicil}
                                    </Badge>
                                  )}
                                  {buro.personeller && buro.personeller.length > 0 && (
                                    <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                                      {buro.personeller.length} personel
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Personeller */}
                            {buro.personeller && buro.personeller.length > 0 && (
                              <div className="ml-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                {buro.personeller
                                  .sort((a, b) => (a.ad || a.sicil).localeCompare(b.ad || b.sicil, 'tr'))
                                  .map((personel) => (
                                  <div 
                                    key={personel.id || personel.sicil} 
                                    className="flex items-center gap-2 p-2 bg-purple-50 rounded border-l-2 border-l-purple-400"
                                  >
                                    <UserIcon className="h-3 w-3 text-purple-600 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <span className="text-sm font-medium text-purple-900 block truncate">
                                        {personel.ad || personel.sicil}
                                      </span>
                                      {personel.unvan && (
                                        <span className="text-xs text-purple-700 block truncate">
                                          {personel.unvan}
                                        </span>
                                      )}
                                    </div>
                                    {personel.sicil && (
                                      <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800 flex-shrink-0">
                                        {personel.sicil}
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
                </div>
              </div>
            ))}

            {hierarchyData.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <UsersIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Henüz hiç büro verisi bulunmamaktadır.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};