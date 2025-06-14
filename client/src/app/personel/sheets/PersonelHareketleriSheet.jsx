// client/src/app/personel/sheets/PersonelHareketleriSheet.jsx
'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Search, Filter, Package, ArrowLeftRight, RotateCcw, Package2, Activity, TrendingUp, TrendingDown, ChevronLeft, ChevronRight, Calendar, User, Clock, MapPin, FileText } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

// Store importları
import { MalzemeHareket_Store } from '@/app/malzemehareket/constants/store';
import { usePersonelStore } from '@/stores/usePersonelStore';
import { hareketTuruLabels, HareketTuruEnum } from '@/app/malzemehareket/constants/hareketTuruEnum';

export function PersonelHareketleriSheet() {
  // Store state'leri
  const personelHareketleri = MalzemeHareket_Store(state => state.personelHareketleri);
  const loadingPersonelHareketleri = MalzemeHareket_Store(state => state.loadingPersonelHareketleri);
  const personelHareketleriSayfalama = MalzemeHareket_Store(state => state.personelHareketleriSayfalama);
  const personelHareketleriIstatistikler = MalzemeHareket_Store(state => state.personelHareketleriIstatistikler);
  const personelHareketleriFiltreler = MalzemeHareket_Store(state => state.personelHareketleriFiltreler);
  
  // Store actions
  const GetPersonelHareketleri = MalzemeHareket_Store(state => state.GetPersonelHareketleri);
  const GetPersonelHareketleriWithFilter = MalzemeHareket_Store(state => state.GetPersonelHareketleriWithFilter);
  const GetPersonelHareketleriNextPage = MalzemeHareket_Store(state => state.GetPersonelHareketleriNextPage);
  const GetPersonelHareketleriPrevPage = MalzemeHareket_Store(state => state.GetPersonelHareketleriPrevPage);
  
  // Sheet state'leri
  const isSheetOpen = usePersonelStore(state => state.isPersonelHareketleriSheetOpen);
  const currentPersonel = usePersonelStore(state => state.currentPersonelHareketleri);
  const closeSheet = usePersonelStore(state => state.closePersonelHareketleriSheet);

  // Local state'ler
  const [filtreAcik, setFiltreAcik] = useState(false);
  const [filtreler, setFiltreler] = useState({
    hareketTuru: '',
    baslangicTarihi: null,
    bitisTarihi: null
  });
  const [tarihPopoverAcik, setTarihPopoverAcik] = useState({
    baslangic: false,
    bitis: false
  });

  // Filtre uygulama
  const handleFiltreUygula = async () => {
    if (!currentPersonel?.id) return;
    
    const filtreData = {
      page: 1,
      limit: 50,
      sortBy: 'islemTarihi',
      sortOrder: 'desc',
      ...(filtreler.hareketTuru && { hareketTuru: filtreler.hareketTuru }),
      ...(filtreler.baslangicTarihi && { baslangicTarihi: filtreler.baslangicTarihi }),
      ...(filtreler.bitisTarihi && { bitisTarihi: filtreler.bitisTarihi })
    };

    await GetPersonelHareketleriWithFilter(currentPersonel.id, filtreData, { showToast: true });
    setFiltreAcik(false);
  };

  // Filtreleri temizle
  const handleFiltreTemizle = async () => {
    setFiltreler({
      hareketTuru: '',
      baslangicTarihi: null,
      bitisTarihi: null
    });
    
    if (currentPersonel?.id) {
      await GetPersonelHareketleri(currentPersonel.id, { showToast: false });
    }
    setFiltreAcik(false);
  };

  // Sayfa değiştirme
  const handleSayfaDegistir = async (yön) => {
    if (!currentPersonel?.id) return;
    
    if (yön === 'sonraki') {
      await GetPersonelHareketleriNextPage(currentPersonel.id);
    } else if (yön === 'önceki') {
      await GetPersonelHareketleriPrevPage(currentPersonel.id);
    }
  };

  // Tarih formatlama
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Hareket türü badge'i
  const getHareketTuruBadge = (hareketTuru, personelRolu) => {
    const variants = {
      Zimmet: 'default',
      Iade: 'secondary', 
      Devir: 'outline',
      Kayit: 'secondary',
      DepoTransferi: 'outline',
      Kayip: 'destructive',
      Dusum: 'destructive'
    };

    const colors = {
      Zimmet: 'text-blue-700 bg-blue-100',
      Iade: 'text-green-700 bg-green-100',
      Devir: 'text-purple-700 bg-purple-100',
      Kayit: 'text-gray-700 bg-gray-100',
      DepoTransferi: 'text-orange-700 bg-orange-100',
      Kayip: 'text-red-700 bg-red-100',
      Dusum: 'text-red-700 bg-red-100'
    };

    return (
      <div className="flex items-center gap-2">
        <Badge variant={variants[hareketTuru]} className={colors[hareketTuru]}>
          {hareketTuruLabels[hareketTuru] || hareketTuru}
        </Badge>
        <Badge variant="outline" className="text-xs">
          {personelRolu === 'ALAN' ? 'Alan' : 'Veren'}
        </Badge>
      </div>
    );
  };

  if (!isSheetOpen || !currentPersonel) {
    return null;
  }

  return (
    <Sheet open={isSheetOpen} onOpenChange={open => { if (!open) closeSheet(); }}>
      <SheetContent className="sm:max-w-6xl w-full p-0 flex flex-col h-full">
        {/* Header */}
        <SheetHeader className="p-6 border-b bg-muted/30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <SheetTitle className="text-xl font-semibold">
                {currentPersonel.ad} {currentPersonel.soyad} - Malzeme Hareketleri
              </SheetTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Sicil: {currentPersonel.sicil} • {personelHareketleriIstatistikler.toplamHareket} toplam hareket
              </p>
            </div>
          
          </div>

          {/* İstatistikler */}
          <div className="grid grid-cols-4 gap-4 mt-4">
            <Card className="p-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Zimmet Alınan</p>
                  <p className="text-lg font-semibold">{personelHareketleriIstatistikler.zimmetAlinan}</p>
                </div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-xs text-muted-foreground">İade Edilen</p>
                  <p className="text-lg font-semibold">{personelHareketleriIstatistikler.iadeEdilen}</p>
                </div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Devir Alınan</p>
                  <p className="text-lg font-semibold">{personelHareketleriIstatistikler.devirAlinan}</p>
                </div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="h-4 w-4 text-orange-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Devir Verilen</p>
                  <p className="text-lg font-semibold">{personelHareketleriIstatistikler.devirVerilen}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Filtre Alanı */}
          {filtreAcik && (
            <Card className="p-4 mt-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="hareketTuru">Hareket Türü</Label>
                  <Select 
                    value={filtreler.hareketTuru} 
                    onValueChange={(value) => setFiltreler(prev => ({ ...prev, hareketTuru: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tüm hareketler" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tüm hareketler</SelectItem>
                      {Object.entries(hareketTuruLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Başlangıç Tarihi</Label>
                  <Popover open={tarihPopoverAcik.baslangic} onOpenChange={(open) => setTarihPopoverAcik(prev => ({ ...prev, baslangic: open }))}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filtreler.baslangicTarihi ? format(filtreler.baslangicTarihi, "dd/MM/yyyy", { locale: tr }) : "Tarih seçin"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={filtreler.baslangicTarihi}
                        onSelect={(date) => {
                          setFiltreler(prev => ({ ...prev, baslangicTarihi: date }));
                          setTarihPopoverAcik(prev => ({ ...prev, baslangic: false }));
                        }}
                        locale={tr}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Bitiş Tarihi</Label>
                  <Popover open={tarihPopoverAcik.bitis} onOpenChange={(open) => setTarihPopoverAcik(prev => ({ ...prev, bitis: open }))}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filtreler.bitisTarihi ? format(filtreler.bitisTarihi, "dd/MM/yyyy", { locale: tr }) : "Tarih seçin"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={filtreler.bitisTarihi}
                        onSelect={(date) => {
                          setFiltreler(prev => ({ ...prev, bitisTarihi: date }));
                          setTarihPopoverAcik(prev => ({ ...prev, bitis: false }));
                        }}
                        locale={tr}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button onClick={handleFiltreUygula} size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Filtrele
                </Button>
                <Button onClick={handleFiltreTemizle} variant="outline" size="sm">
                  Temizle
                </Button>
              </div>
            </Card>
          )}
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 flex flex-col h-full pb-44">
          <ScrollArea className="flex-1 p-6 h-full overflow-y-auto pb-18">
            {loadingPersonelHareketleri ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2">Hareketler yükleniyor...</span>
              </div>
            ) : personelHareketleri.length === 0 ? (
              <Alert>
                <Activity className="h-4 w-4" />
                <AlertDescription>
                  {currentPersonel.ad} {currentPersonel.soyad} adlı personel için hareket kaydı bulunamadı.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                {personelHareketleri.map((hareket, index) => (
                  <Card key={hareket.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                            {hareket.hareketTuru === 'Zimmet' && <Package className="h-4 w-4" />}
                            {hareket.hareketTuru === 'Iade' && <RotateCcw className="h-4 w-4" />}
                            {hareket.hareketTuru === 'Devir' && <ArrowLeftRight className="h-4 w-4" />}
                            {!['Zimmet', 'Iade', 'Devir'].includes(hareket.hareketTuru) && <Activity className="h-4 w-4" />}
                          </div>
                          <div>
                            <CardTitle className="text-base">
                              {hareket.malzeme?.vidaNo || 'Malzeme Bilgisi Yok'}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {hareket.malzeme?.sabitKodu?.ad} - {hareket.malzeme?.marka?.ad} {hareket.malzeme?.model?.ad}
                            </p>
                          </div>
                        </div>
                        {getHareketTuruBadge(hareket.hareketTuru, hareket.personelRolu)}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-muted-foreground">İşlem Tarihi</p>
                            <p className="font-medium">{formatDate(hareket.islemTarihi)}</p>
                          </div>
                        </div>

                        {hareket.hedefPersonel && (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-muted-foreground">Hedef Personel</p>
                              <p className="font-medium">{hareket.hedefPersonel.ad} {hareket.hedefPersonel.soyad}</p>
                            </div>
                          </div>
                        )}

                        {hareket.kaynakPersonel && (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-muted-foreground">Kaynak Personel</p>
                              <p className="font-medium">{hareket.kaynakPersonel.ad} {hareket.kaynakPersonel.soyad}</p>
                            </div>
                          </div>
                        )}

                        {(hareket.konum || hareket.hedefKonum) && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-muted-foreground">Konum</p>
                              <p className="font-medium">
                                {hareket.hedefKonum?.ad || hareket.konum?.ad || '-'}
                              </p>
                            </div>
                          </div>
                        )}

                        {hareket.malzemeKondisyonu && (
                          <div className="flex items-center gap-2">
                            <Package2 className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-muted-foreground">Kondisyon</p>
                              <Badge variant="outline" className="font-medium">
                                {hareket.malzemeKondisyonu}
                              </Badge>
                            </div>
                          </div>
                        )}

                        {hareket.aciklama && (
                          <div className="col-span-2 flex items-start gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-muted-foreground">Açıklama</p>
                              <p className="font-medium">{hareket.aciklama}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Malzeme Detay Bilgileri */}
                      {hareket.malzeme && (
                        <div className="mt-4 pt-4 border-t bg-muted/30 rounded-lg p-3">
                          <p className="text-sm font-medium mb-2">Malzeme Detayları</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                            {hareket.malzeme.bademSeriNo && (
                              <div>
                                <span className="text-muted-foreground">Badem Seri:</span>
                                <span className="ml-1 font-medium">{hareket.malzeme.bademSeriNo}</span>
                              </div>
                            )}
                            {hareket.malzeme.etmysSeriNo && (
                              <div>
                                <span className="text-muted-foreground">ETMYS Seri:</span>
                                <span className="ml-1 font-medium">{hareket.malzeme.etmysSeriNo}</span>
                              </div>
                            )}
                            {hareket.malzeme.stokDemirbasNo && (
                              <div>
                                <span className="text-muted-foreground">Stok/Demirbaş:</span>
                                <span className="ml-1 font-medium">{hareket.malzeme.stokDemirbasNo}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Sayfalama */}
          {personelHareketleriSayfalama.totalPages > 1 && (
            <div className="border-t p-4 flex items-center justify-between bg-muted/30">
              <div className="text-sm text-muted-foreground">
                Sayfa {personelHareketleriSayfalama.currentPage} / {personelHareketleriSayfalama.totalPages} 
                ({personelHareketleriSayfalama.totalRecords} toplam kayıt)
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSayfaDegistir('önceki')}
                  disabled={!personelHareketleriSayfalama.hasPrevPage || loadingPersonelHareketleri}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Önceki
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSayfaDegistir('sonraki')}
                  disabled={!personelHareketleriSayfalama.hasNextPage || loadingPersonelHareketleri}
                >
                  Sonraki
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}