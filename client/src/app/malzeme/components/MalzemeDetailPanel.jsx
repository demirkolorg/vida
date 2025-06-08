// client/src/app/malzeme/components/MalzemeDetailPanel.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, History, Info, Tag, Barcode, Building, FileText, Clock, User, MapPin, X, TrendingUp, Calendar } from 'lucide-react';

import { MalzemeHareket_Store } from '@/app/malzemehareket/constants/store';
import { useMalzemeHareketStore } from '@/stores/useMalzemeHareketStore';
import { hareketTuruLabels } from '@/app/malzemehareket/constants/hareketTuruEnum';
import { malzemeKondisyonuLabels } from '@/app/malzemehareket/constants/malzemeKondisyonuEnum';
import { cn } from '@/lib/utils';
import { anlamliSonHareketi, kayitUygun, zimmetUygun, iadeUygun, devirUygun, depoTransferiUygun, kondisyonGuncellemeUygun, kayipUygun, dusumUygun, sonHareketi, malzemePersonelde, malzemeDepoda, malzemeYok } from '../helpers/hareketKarar';

const MalzemeDetailPanel = ({ selectedMalzeme, onClose }) => {
  const [activeTab, setActiveTab] = useState('hareketler');

  // Malzeme hareket store
  const hareketler = MalzemeHareket_Store(state => state.malzemeGecmisi);
  const loadingHareketler = MalzemeHareket_Store(state => state.loadingMalzemeGecmisi);
  const getMalzemeGecmisi = MalzemeHareket_Store(state => state.GetMalzemeGecmisi);

  // Malzeme hareket sheet actions
  const openZimmetSheet = useMalzemeHareketStore(state => state.openZimmetSheet);
  const openIadeSheet = useMalzemeHareketStore(state => state.openIadeSheet);
  const openDevirSheet = useMalzemeHareketStore(state => state.openDevirSheet);
  const openDepoTransferiSheet = useMalzemeHareketStore(state => state.openDepoTransferiSheet);
  const openKondisyonGuncellemeSheet = useMalzemeHareketStore(state => state.openKondisyonGuncellemeSheet);
  const openKayitSheet = useMalzemeHareketStore(state => state.openKayitSheet);

  // Malzeme geçmişini yükle
  const fetchMalzemeGecmisi = useCallback(async () => {
    if (selectedMalzeme?.id) {
      try {
        await getMalzemeGecmisi(selectedMalzeme.id, { showToast: false });
      } catch (error) {
        console.error('Malzeme geçmişi yüklenirken hata:', error);
      }
    }
  }, [selectedMalzeme?.id, getMalzemeGecmisi]);

  useEffect(() => {
    if (selectedMalzeme?.id && activeTab === 'hareketler') {
      fetchMalzemeGecmisi();
    }
  }, [selectedMalzeme?.id, activeTab, fetchMalzemeGecmisi]);

  if (!selectedMalzeme) {
    return (
      <div className="h-full flex items-center justify-center text-center p-8">
        <div className="space-y-4">
          <Package className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
          <div>
            <h3 className="text-lg font-medium text-muted-foreground">Malzeme Seçilmedi</h3>
            <p className="text-sm text-muted-foreground">Detaylarını görmek için tabloda bir malzeme seçin</p>
          </div>
        </div>
      </div>
    );
  }

  const BilgiSatiri = ({ label, value, icon: IconComponent, isBadge = false, className = '' }) => {
    if (value === null || typeof value === 'undefined' || value === '') return null;

    return (
      <div className={`flex items-start gap-3 py-2 ${className}`}>
        {IconComponent && <IconComponent className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />}
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium text-muted-foreground">{label}:</span>
          <div className="mt-1">
            {isBadge ? (
              <Badge variant="secondary" className="text-xs">
                {value}
              </Badge>
            ) : (
              <span className="text-sm text-foreground break-words">{value}</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const getHareketTuruVariant = hareketTuru => {
    switch (hareketTuru) {
      case 'Kayit':
        return 'default';
      case 'Zimmet':
        return 'destructive';
      case 'Iade':
        return 'success';
      case 'Devir':
        return 'warning';
      case 'DepoTransferi':
        return 'secondary';
      case 'KondisyonGuncelleme':
        return 'info';
      case 'Kayip':
        return 'destructive';
      case 'Dusum':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const sonHareket = anlamliSonHareketi(selectedMalzeme);

  const malzemeDurumu = (() => {
    if (!sonHareket) return { text: 'Henüz hareket yok', color: 'muted', icon: Package };

    switch (sonHareket.hareketTuru) {
      case 'Kayit':
      case 'Iade':
      case 'DepoTransferi':
        return {
          text: `Depoda (${sonHareket.hedefKonum.depo?.ad || 'Bilinmeyen depo'} - ${sonHareket.hedefKonum?.ad || 'Bilinmeyen konum'})`,
          color: 'blue',
          icon: MapPin,
        };
      case 'Zimmet':
      case 'Devir':
        return {
          text: `Zimmetli - ${sonHareket.hedefPersonel?.ad} ${sonHareket.hedefPersonel?.soyad}`,
          color: 'orange',
          icon: User,
        };
      case 'Kayip':
        return { text: 'Kayıp', color: 'red', icon: Package };
      case 'Dusum':
        return { text: 'Düşüm yapıldı', color: 'gray', icon: Package };
      default:
        return { text: sonHareket.hareketTuru, color: 'muted', icon: Package };
    }
  })();

  // Hızlı aksiyonlar
  const hizliAksiyonlar = [
    {
      label: 'Kayıt Yap',
      action: () => openKayitSheet(selectedMalzeme),
      icon: User,
      variant: 'default',
      // disabled: !['Kayit', 'Iade', 'DepoTransferi'].includes(sonHareket?.hareketTuru),
      disabled: !kayitUygun(selectedMalzeme),
    },
    {
      label: 'Zimmet Ver',
      action: () => openZimmetSheet(selectedMalzeme),
      icon: User,
      variant: 'default',
      // disabled: !['Kayit', 'Iade', 'DepoTransferi'].includes(sonHareket?.hareketTuru),
      disabled: !zimmetUygun(selectedMalzeme),
    },
    {
      label: 'İade Al',
      action: () => openIadeSheet(selectedMalzeme),
      icon: Package,
      variant: 'secondary',
      // disabled: !['Zimmet', 'Devir'].includes(sonHareket?.hareketTuru),
      disabled: !iadeUygun(selectedMalzeme),
    },
    {
      label: 'Devir Et',
      action: () => openDevirSheet(selectedMalzeme),
      icon: TrendingUp,
      variant: 'secondary',
      // disabled: !['Zimmet', 'Devir'].includes(sonHareket?.hareketTuru),
      disabled: !devirUygun(selectedMalzeme),
    },
    {
      label: 'Depo Transfer',
      action: () => openDepoTransferiSheet(selectedMalzeme),
      icon: MapPin,
      variant: 'outline',
      // disabled: !['Kayit', 'Iade', 'DepoTransferi'].includes(sonHareket?.hareketTuru),
      disabled: !depoTransferiUygun(selectedMalzeme),
    },
    {
      label: 'Kondisyon Güncelle',
      action: () => openKondisyonGuncellemeSheet(selectedMalzeme),
      icon: Info,
      variant: 'outline',
      // disabled: false,
      disabled: !kondisyonGuncellemeUygun(selectedMalzeme),
    },
  ];

  return (
    <div className="h-[calc(100vh-150px)] flex flex-col border rounded-lg bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-primary/10 border-b">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Package className="h-5 w-5 text-primary flex-shrink-0" />
          <div className="min-w-0 flex gap-2 items-center">
            <h2 className="font-semibold text-lg truncate">{selectedMalzeme.vidaNo || `ID: ${selectedMalzeme.id}`}</h2>
            <p className="text-sm text-muted-foreground truncate">
              {selectedMalzeme.sabitKodu?.ad} - {selectedMalzeme.marka?.ad} {selectedMalzeme.model?.ad}
            </p>
          </div>
        </div>

        <Button variant="destructive" size="icon" onClick={onClose}>
          <X size={64} />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid grid-cols-2 mx-auto mt-4 ">
            <TabsTrigger value="hareketler">Hareket Geçmişi</TabsTrigger>
            <TabsTrigger value="overview">Genel Bilgiler</TabsTrigger>
          </TabsList>

          <TabsContent value="hareketler" className="flex-1 mt-4 overflow-hidden">
            {/* Mevcut Durum Kartı */}
            <Card className="mx-4 mb-4 border-none">
              <CardContent className="flex gap-2 justify-between pt-0">
                <div className="flex items-center gap-2">
                  <malzemeDurumu.icon className="h-4 w-4" />
                  <CardTitle className="text-base">Mevcut Durum</CardTitle>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline" className={cn('text-sm', malzemeDurumu.color === 'blue' && 'text-blue-700 border-blue-200 bg-blue-50 dark:text-blue-300 dark:border-blue-800 dark:bg-blue-950/50', malzemeDurumu.color === 'orange' && 'text-orange-700 border-orange-200 bg-orange-50 dark:text-orange-300 dark:border-orange-800 dark:bg-orange-950/50', malzemeDurumu.color === 'red' && 'text-red-700 border-red-200 bg-red-50 dark:text-red-300 dark:border-red-800 dark:bg-red-950/50', malzemeDurumu.color === 'gray' && 'text-gray-700 border-gray-200 bg-gray-50 dark:text-gray-300 dark:border-gray-700 dark:bg-gray-800/50', malzemeDurumu.color === 'muted' && 'text-muted-foreground border-muted bg-muted/50 dark:text-muted-foreground dark:border-muted dark:bg-muted/30')}>
                    {malzemeDurumu.text}
                  </Badge>
                  {/* {sonHareket && <div className="text-xs text-muted-foreground">Son hareket: {format(new Date(sonHareket.islemTarihi), 'dd.MM.yyyy HH:mm', { locale: tr })}</div>} */}
                </div>
              </CardContent>
            </Card>

            {/* Hareket Geçmişi Header */}
            <div className="flex items-center justify-between px-8 pb-4">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4" />
                <h3 className="font-medium">Hareket Geçmişi ({hareketler.length})</h3>
              </div>
              <Button variant="outline" size="sm" onClick={fetchMalzemeGecmisi} disabled={loadingHareketler}>
                {loadingHareketler ? 'Yükleniyor...' : 'Yenile'}
              </Button>
            </div>

            <ScrollArea className="h-full px-4 pb-34">
              <div className="space-y-4 pb-4">
                {/* Hareket Listesi */}
                {loadingHareketler ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-sm text-muted-foreground mt-2">Hareket geçmişi yükleniyor...</p>
                  </div>
                ) : !hareketler || hareketler.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Henüz hareket kaydı bulunmuyor.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {hareketler.map((hareket, index) => (
                      <Card key={hareket.id} className="relative">
                        <CardContent className="px-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant={getHareketTuruVariant(hareket.hareketTuru)} className="text-xs -mt-7 -ml-4">
                                  {hareketTuruLabels[hareket.hareketTuru] || hareket.hareketTuru}
                                </Badge>
                                {index === 0 && (
                                  <Badge variant="outline" className="text-xs  -mt-7">
                                    Son Hareket
                                  </Badge>
                                )}
                              </div>

                              <div className="space-y-1 text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground">Tarih:</span>
                                  <Clock className="h-3 w-3" />
                                  {format(new Date(hareket.islemTarihi), 'dd.MM.yyyy', { locale: tr })}
                                  {' - '}
                                  {format(new Date(hareket.islemTarihi), 'HH:mm', { locale: tr })}
                                </div>

                                {hareket.kaynakPersonel && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">Kaynak:</span>
                                    <span className="font-medium">{hareket.kaynakPersonel.ad} {hareket.kaynakPersonel.soyad}</span>
                                  </div>
                                )}
                                {hareket.hedefPersonel && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">Hedef:</span>
                                    <span className="font-medium">{hareket.hedefPersonel.ad} {hareket.hedefPersonel.soyad}</span>
                                  </div>
                                )}
                                {hareket.konum && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">Konum:</span>
                                    <span className="font-medium">
                                      {hareket.konum.ad}
                                      {hareket.konum.depo && <span className="text-muted-foreground"> - {hareket.konum.depo.ad}</span>}
                                    </span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground">Kondisyon:</span>
                                  <Badge variant="outline" className="text-xs">
                                    {malzemeKondisyonuLabels[hareket.malzemeKondisyonu] || hareket.malzemeKondisyonu}
                                  </Badge>
                                </div>
                              </div>

                              {hareket.aciklama && <p className="text-xs text-muted-foreground mt-2 p-2 bg-muted/50 rounded">{hareket.aciklama}</p>}
                            </div>

                            {/* <div className="text-right flex-shrink-0">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {format(new Date(hareket.islemTarihi), 'dd.MM.yyyy', { locale: tr })}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">{format(new Date(hareket.islemTarihi), 'HH:mm', { locale: tr })}</div>
                            </div> */}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="overview" className="flex-1 mt-4 overflow-hidden">
            <ScrollArea className="h-full px-4">
              <div className="space-y-4 pb-4">
                {/* Mevcut Durum Kartı */}
                <Card>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-2 pb-2">
                      <malzemeDurumu.icon className="h-4 w-4" />
                      <CardTitle className="text-base">Mevcut Durum</CardTitle>
                    </div>
                    <div className="space-y-2">
                      <Badge variant="outline" className={cn('text-sm', malzemeDurumu.color === 'blue' && 'text-blue-700 border-blue-200 bg-blue-50', malzemeDurumu.color === 'orange' && 'text-orange-700 border-orange-200 bg-orange-50', malzemeDurumu.color === 'red' && 'text-red-700 border-red-200 bg-red-50', malzemeDurumu.color === 'gray' && 'text-gray-700 border-gray-200 bg-gray-50', malzemeDurumu.color === 'muted' && 'text-muted-foreground border-muted bg-muted/50')}>
                        {malzemeDurumu.text}
                      </Badge>
                      {sonHareket && <div className="text-xs text-muted-foreground">Son hareket: {format(new Date(sonHareket.islemTarihi), 'dd.MM.yyyy HH:mm', { locale: tr })}</div>}
                    </div>
                  </CardContent>
                </Card>

                {/* Hızlı Aksiyonlar */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Hızlı İşlemler</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 gap-2">
                      {hizliAksiyonlar
                        .filter(aksiyon => !aksiyon.disabled)
                        .map(aksiyon => (
                          <Button key={aksiyon.label} variant={aksiyon.variant} size="sm" onClick={aksiyon.action} disabled={aksiyon.disabled} className="justify-start h-8">
                            <aksiyon.icon className="h-3 w-3 mr-2" />
                            {aksiyon.label}
                          </Button>
                        ))}
                    </div>
                  </CardContent>
                </Card>
                {/* Açıklama */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Açıklama</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-start gap-3">
                      <FileText className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                      <p className="text-sm text-muted-foreground leading-relaxed">{selectedMalzeme?.aciklama || 'Açıklama yok'}</p>
                    </div>
                  </CardContent>
                </Card>
                {/* Seri Numaraları */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Seri Numaraları</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-1">
                    <BilgiSatiri label="Kod" value={selectedMalzeme.kod} icon={Barcode} />
                    <BilgiSatiri label="Badem Seri No" value={selectedMalzeme.bademSeriNo} icon={Barcode} />
                    <BilgiSatiri label="ETMYS Seri No" value={selectedMalzeme.etmysSeriNo} icon={Barcode} />
                    <BilgiSatiri label="Stok/Demirbaş No" value={selectedMalzeme.stokDemirbasNo} icon={Barcode} />
                  </CardContent>
                </Card>
                {/* Temel Bilgiler */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Temel Bilgiler</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-1">
                    <BilgiSatiri label="Malzeme Tipi" value={selectedMalzeme.malzemeTipi} icon={Info} isBadge />
                    <BilgiSatiri label="Sabit Kodu" value={selectedMalzeme.sabitKodu?.ad} icon={Tag} isBadge />
                    <BilgiSatiri label="Marka" value={selectedMalzeme.marka?.ad} icon={Tag} />
                    <BilgiSatiri label="Model" value={selectedMalzeme.model?.ad} icon={Tag} />
                    <BilgiSatiri label="Birim" value={selectedMalzeme.birim?.ad} icon={Building} />
                    <BilgiSatiri label="Şube" value={selectedMalzeme.sube?.ad} icon={Building} />
                    {selectedMalzeme.kayitTarihi && <BilgiSatiri label="Kayıt Tarihi" value={format(new Date(selectedMalzeme.kayitTarihi), 'dd.MM.yyyy', { locale: tr })} icon={Calendar} />}
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MalzemeDetailPanel;
