import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSheetStore } from '@/stores/sheetStore';
import { MalzemeHareket_Store } from '../constants/store';
import { 
  BarChart3, 
  TrendingUp, 
  Package, 
  ArrowRightLeft, 
  ArrowLeftRight, 
  AlertTriangle,
  Settings,
  MapPin,
  Users,
  Calendar
} from 'lucide-react';
import { Spinner } from '@/components/general/Spinner';

export const MalzemeHareket_IstatistikSheet = () => {
  const { mode, entityType, isOpen, closeSheet } = useSheetStore();
  const datas = MalzemeHareket_Store(state => state.datas);
  const getHareketIstatistikleri = MalzemeHareket_Store(state => state.GetHareketIstatistikleri);
  const isLoading = MalzemeHareket_Store(state => state.loadingList);
  
  const [istatistikData, setIstatistikData] = useState(null);
  const [loading, setLoading] = useState(false);

  const isIstatistikSheetOpen = isOpen && mode === 'istatistik' && entityType === 'malzemeHareket';

  // İstatistikleri hesapla
  useEffect(() => {
    if (isIstatistikSheetOpen && datas && datas.length > 0) {
      setLoading(true);
      calculateStatistics();
      setLoading(false);
    }
  }, [isIstatistikSheetOpen, datas]);

  const calculateStatistics = () => {
    if (!datas || datas.length === 0) {
      setIstatistikData(null);
      return;
    }

    // Hareket türlerine göre grupla
    const hareketTurleri = {};
    const kondisyonlar = {};
    const aylikHareketler = {};
    const personelHareketleri = {};
    
    datas.forEach(hareket => {
      // Hareket türleri
      hareketTurleri[hareket.hareketTuru] = (hareketTurleri[hareket.hareketTuru] || 0) + 1;
      
      // Kondisyonlar
      kondisyonlar[hareket.malzemeKondisyonu] = (kondisyonlar[hareket.malzemeKondisyonu] || 0) + 1;
      
      // Aylık hareketler
      const ay = new Date(hareket.islemTarihi).toLocaleDateString('tr-TR', { 
        year: 'numeric', 
        month: 'long' 
      });
      aylikHareketler[ay] = (aylikHareketler[ay] || 0) + 1;
      
      // Personel hareketleri
      if (hareket.hedefPersonel) {
        const personelAd = hareket.hedefPersonel.ad;
        personelHareketleri[personelAd] = (personelHareketleri[personelAd] || 0) + 1;
      }
      if (hareket.kaynakPersonel) {
        const personelAd = hareket.kaynakPersonel.ad;
        personelHareketleri[personelAd] = (personelHareketleri[personelAd] || 0) + 1;
      }
    });

    // Son 30 gün içindeki hareketler
    const son30Gun = new Date();
    son30Gun.setDate(son30Gun.getDate() - 30);
    const son30GunHareketleri = datas.filter(h => new Date(h.islemTarihi) >= son30Gun);
    
    setIstatistikData({
      toplamHareket: datas.length,
      hareketTurleri,
      kondisyonlar,
      aylikHareketler,
      personelHareketleri,
      son30GunHareketleri: son30GunHareketleri.length,
      enAktifPersonel: Object.entries(personelHareketleri)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5),
      enAktifAylar: Object.entries(aylikHareketler)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 6)
    });
  };

  const getHareketTuruIcon = (tur) => {
    switch (tur) {
      case 'Zimmet': return <ArrowRightLeft className="h-4 w-4" />;
      case 'Iade': return <ArrowLeftRight className="h-4 w-4" />;
      case 'Devir': return <Users className="h-4 w-4" />;
      case 'DepoTransferi': return <MapPin className="h-4 w-4" />;
      case 'Kayip': return <AlertTriangle className="h-4 w-4" />;
      case 'KondisyonGuncelleme': return <Settings className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getHareketTuruColor = (tur) => {
    switch (tur) {
      case 'Zimmet': return 'bg-blue-100 text-blue-800';
      case 'Iade': return 'bg-green-100 text-green-800';
      case 'Devir': return 'bg-purple-100 text-purple-800';
      case 'DepoTransferi': return 'bg-orange-100 text-orange-800';
      case 'Kayip': return 'bg-red-100 text-red-800';
      case 'KondisyonGuncelleme': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getKondisyonColor = (kondisyon) => {
    switch (kondisyon) {
      case 'Saglam': return 'bg-green-100 text-green-800';
      case 'Arizali': return 'bg-yellow-100 text-yellow-800';
      case 'Hurda': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isIstatistikSheetOpen) return null;

  return (
    <Sheet open={isIstatistikSheetOpen} onOpenChange={closeSheet}>
      <SheetContent className="sm:max-w-4xl w-full">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Malzeme Hareket İstatistikleri
          </SheetTitle>
          <SheetDescription>
            Malzeme hareket verilerinizin detaylı analizi ve istatistikleri
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          {loading || isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner size="large" />
            </div>
          ) : !istatistikData ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Henüz analiz edilecek hareket verisi bulunmamaktadır.</p>
            </div>
          ) : (
            <div className="space-y-6 pb-6">
              {/* Genel İstatistikler */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Package className="h-4 w-4 text-blue-500" />
                      Toplam Hareket
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {istatistikData.toplamHareket}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      Son 30 Gün
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {istatistikData.son30GunHareketleri}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <ArrowRightLeft className="h-4 w-4 text-purple-500" />
                      Zimmet
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">
                      {istatistikData.hareketTurleri.Zimmet || 0}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      Kayıp
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {istatistikData.hareketTurleri.Kayip || 0}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Hareket Türleri Dağılımı */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Hareket Türleri Dağılımı
                  </CardTitle>
                  <CardDescription>
                    Tüm hareket türlerinin sayısal dağılımı
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {Object.entries(istatistikData.hareketTurleri).map(([tur, sayi]) => (
                      <div key={tur} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          {getHareketTuruIcon(tur)}
                          <span className="text-sm font-medium">{tur}</span>
                        </div>
                        <Badge className={getHareketTuruColor(tur)}>
                          {sayi}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Kondisyon Durumları */}
              <Card>
                <CardHeader>
                  <CardTitle>Malzeme Kondisyon Durumları</CardTitle>
                  <CardDescription>
                    Hareketlerdeki malzeme kondisyon dağılımı
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(istatistikData.kondisyonlar).map(([kondisyon, sayi]) => (
                      <div key={kondisyon} className="flex items-center justify-between p-4 border rounded-lg">
                        <span className="text-sm font-medium">{kondisyon}</span>
                        <Badge className={getKondisyonColor(kondisyon)}>
                          {sayi}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* En Aktif Personeller */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    En Aktif Personeller
                  </CardTitle>
                  <CardDescription>
                    En çok hareket işlemi yapan personeller
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {istatistikData.enAktifPersonel.map(([personel, sayi], index) => (
                      <div key={personel} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
                            {index + 1}
                          </Badge>
                          <span className="font-medium">{personel}</span>
                        </div>
                        <Badge variant="secondary">{sayi} hareket</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Aylık Hareket Trendi */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Aylık Hareket Trendi
                  </CardTitle>
                  <CardDescription>
                    Son 6 ayın hareket sayıları
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {istatistikData.enAktifAylar.map(([ay, sayi]) => (
                      <div key={ay} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">{ay}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ 
                                width: `${(sayi / Math.max(...istatistikData.enAktifAylar.map(([,s]) => s))) * 100}%` 
                              }}
                            ></div>
                          </div>
                          <Badge variant="outline">{sayi}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};