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
import { WarehouseIcon, MapPinIcon, PackageIcon, TrendingUpIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const Konum_HierarchyDialog = ({ 
  isOpen, 
  onClose, 
  depoKonumData = [] // Depo ve konum verilerini içeren array
}) => {
  // Veriyi hiyerarşik yapıya dönüştür
  const hierarchyData = React.useMemo(() => {
    if (!depoKonumData || depoKonumData.length === 0) return [];

    // Depoları ve konumlarını grupla
    const depoMap = new Map();
    
    depoKonumData.forEach(konum => {
      const depoId = konum.depo?.id;
      const depoAd = konum.depo?.ad || 'Bilinmeyen Depo';
      
      if (!depoMap.has(depoId)) {
        depoMap.set(depoId, {
          id: depoId,
          ad: depoAd,
          konumlar: []
        });
      }
      
      depoMap.get(depoId).konumlar.push(konum);
    });

    return Array.from(depoMap.values()).sort((a, b) => 
      a.ad.localeCompare(b.ad, 'tr')
    );
  }, [depoKonumData]);

  const totalStats = React.useMemo(() => {
    const stats = {
      depoSayisi: hierarchyData.length,
      konumSayisi: depoKonumData.length,
      malzemeHareketSayisi: depoKonumData.reduce((total, konum) => 
        total + (konum.malzemeHareketleri?.length || 0), 0
      ),
      aktifKonumlar: depoKonumData.filter(konum => konum.status === 'Aktif').length
    };
    return stats;
  }, [hierarchyData, depoKonumData]);

  const getHareketTuruColor = (hareketTuru) => {
    const colors = {
      'Zimmet': 'text-blue-600',
      'Iade': 'text-green-600',
      'Kayit': 'text-purple-600',
      'Devir': 'text-orange-600',
      'Kayip': 'text-red-600',
      'KondisyonGuncelleme': 'text-yellow-600',
      'DepoTransferi': 'text-indigo-600',
      'Dusum': 'text-gray-600',
    };
    return colors[hareketTuru] || 'text-gray-600';
  };

  const getMostFrequentHareketTuru = (malzemeHareketleri) => {
    if (!malzemeHareketleri || malzemeHareketleri.length === 0) return null;
    
    const hareketSayilari = malzemeHareketleri.reduce((acc, hareket) => {
      acc[hareket.hareketTuru] = (acc[hareket.hareketTuru] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(hareketSayilari).sort(([,a], [,b]) => b - a)[0];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <WarehouseIcon className="h-5 w-5" />
            Depo ve Konum Hiyerarşisi
          </DialogTitle>
          <DialogDescription>
            Depo, konum ve malzeme hareket yapısının hiyerarşik görünümü
          </DialogDescription>
        </DialogHeader>

        {/* İstatistikler */}
        <div className="grid grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {totalStats.depoSayisi}
            </div>
            <div className="text-sm text-muted-foreground">Depo</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {totalStats.konumSayisi}
            </div>
            <div className="text-sm text-muted-foreground">Konum</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {totalStats.malzemeHareketSayisi}
            </div>
            <div className="text-sm text-muted-foreground">Malzeme Hareketi</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {totalStats.aktifKonumlar}
            </div>
            <div className="text-sm text-muted-foreground">Aktif Konum</div>
          </div>
        </div>

        <Separator />

        {/* Hiyerarşi Ağacı */}
        <ScrollArea className="h-[550px] pr-4">
          <div className="space-y-6">
            {hierarchyData.map((depo) => (
              <div key={depo.id} className="space-y-3">
                {/* Depo Başlığı */}
                <div className="flex items-center gap-3 p-3 bg-primary/50 rounded-lg border-l-4 border-l-primary">
                  <WarehouseIcon className="h-5 w-5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{depo.ad}</h3>
                    <p className="text-sm">
                      {depo.konumlar.length} konum
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-primary-foreground text-primary">
                      {depo.konumlar.reduce((total, konum) => 
                        total + (konum.malzemeHareketleri?.length || 0), 0
                      )} hareket
                    </Badge>
                    <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                      {depo.konumlar.filter(k => k.status === 'Aktif').length} aktif
                    </Badge>
                  </div>
                </div>

                {/* Konumlar */}
                <div className="ml-8 space-y-3">
                  {depo.konumlar
                    .sort((a, b) => a.ad.localeCompare(b.ad, 'tr'))
                    .map((konum) => {
                      const hareketSayisi = konum.malzemeHareketleri?.length || 0;
                      const enCokHareket = getMostFrequentHareketTuru(konum.malzemeHareketleri);
                      
                      return (
                        <div key={konum.id} className="space-y-2">
                          {/* Konum Bilgisi */}
                          <div className="flex items-center gap-3 p-3 bg-primary/20 rounded-lg border-l-4 border-l-primary/50">
                            <MapPinIcon className="h-4 w-4 flex-shrink-0" />
                            <div className="flex-1">
                              <h4 className="font-medium flex items-center gap-2">
                                {konum.ad}
                                <Badge 
                                  variant={konum.status === 'Aktif' ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {konum.status}
                                </Badge>
                              </h4>
                              {konum.aciklama && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {konum.aciklama}
                                </p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              {hareketSayisi > 0 && (
                                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                                  <PackageIcon className="h-3 w-3 mr-1" />
                                  {hareketSayisi} hareket
                                </Badge>
                              )}
                              {enCokHareket && (
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${getHareketTuruColor(enCokHareket[0])} border-current bg-current/10`}
                                >
                                  <TrendingUpIcon className="h-3 w-3 mr-1" />
                                  {enCokHareket[0]} ({enCokHareket[1]})
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Malzeme Hareketleri Özeti */}
                          {konum.malzemeHareketleri && konum.malzemeHareketleri.length > 0 && (
                            <div className="ml-8">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                {konum.malzemeHareketleri
                                  .slice(0, 6) // İlk 6 hareketi göster
                                  .map((hareket) => (
                                  <div 
                                    key={hareket.id} 
                                    className="flex items-center gap-2 p-2 bg-background rounded border text-xs"
                                  >
                                    <PackageIcon className={`h-3 w-3 flex-shrink-0 ${getHareketTuruColor(hareket.hareketTuru)}`} />
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium truncate">
                                        {hareket.malzeme?.vidaNo || 'N/A'}
                                      </div>
                                      <div className={`${getHareketTuruColor(hareket.hareketTuru)} truncate`}>
                                        {hareket.hareketTuru}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                {konum.malzemeHareketleri.length > 6 && (
                                  <div className="flex items-center justify-center p-2 bg-muted/50 rounded border text-xs text-muted-foreground">
                                    +{konum.malzemeHareketleri.length - 6} daha
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}

            {hierarchyData.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <WarehouseIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Henüz hiç konum verisi bulunmamaktadır.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};