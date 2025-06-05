// client/src/app/tutanak/components/TutanakDetailPanel.jsx
import { useRef, useState, useCallback, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { XIcon, PrinterIcon, FileTextIcon, CalendarIcon, UserIcon, PackageIcon, MapPinIcon } from 'lucide-react';
import BaseMalzemeHareketTutanagi from '@/components/tutanak/BaseMalzemeHareketTutanagi';
import { useReactToPrint } from 'react-to-print';

export default function TutanakDetailPanel({ selectedTutanak, onClose, showPrint = false }) {
  const { id, hareketTuru, createdAt, createdBy, status, personelBilgileri, islemBilgileri, konumBilgileri, malzemeler = [], toplamMalzeme, demirbasSayisi, sarfSayisi } = selectedTutanak;
  const [activeTab, setActiveTab] = useState('preview');
  const componentRef = useRef(null);
  const handleAfterPrint = useCallback(() => {}, []);
  const handleBeforePrint = useCallback(() => {
    return Promise.resolve();
  }, []);

  const printFn = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Tutanak-${selectedTutanak?.id || 'Document'}`,
    onAfterPrint: handleAfterPrint,
    onBeforePrint: handleBeforePrint,
  });

  useEffect(() => {
    if (showPrint) {
      printFn();
    }
  }, []);

  if (!selectedTutanak) return null;
  const kaynakPersonel = personelBilgileri?.kaynakPersonel || null;
  const hedefPersonel = personelBilgileri?.hedefPersonel || null;
  const islemTarihi = islemBilgileri?.tarih || createdAt;
  const aciklama = islemBilgileri?.aciklama || '';
  const konum = konumBilgileri || null;

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col border rounded-lg bg-background pb-8">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-primary/10 border-b gap-2">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <FileTextIcon className="h-5 w-5 text-primary flex-shrink-0" />
          <div className="min-w-0 flex gap-2 items-center">
            <h2 className="font-semibold text-lg truncate">Tutanak Önizleme</h2>
          </div>
        </div>

        <Button onClick={printFn}>
          <PrinterIcon className="h-3 w-3" />
          Yazdır
        </Button>

        <Button variant="destructive" onClick={onClose}>
          <XIcon className="h-3 w-3" />
          Kapat
        </Button>
      </div>

      {/* Content with Tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid grid-cols-3 mx-auto mt-4 mb-2">
            <TabsTrigger value="preview" className="text-xs">
              Önizleme
            </TabsTrigger>
            <TabsTrigger value="details" className="text-xs">
              Detaylar
            </TabsTrigger>
            <TabsTrigger value="materials" className="text-xs">
              Malzemeler ({toplamMalzeme || 0})
            </TabsTrigger>
          </TabsList>

          {/* Preview Tab */}
          <TabsContent value="preview" className="flex-1 overflow-hidden">
            <ScrollArea className="h-full pr-2">
              <BaseMalzemeHareketTutanagi ref={componentRef} selectedTutanak={selectedTutanak} className="border-1 border-primary shadow-2xl" />
            </ScrollArea>
          </TabsContent>

          {/* Materials Tab */}
          <TabsContent value="materials" className="flex-1 p-8 overflow-hidden">
            <ScrollArea className="h-full pr-2">
              <div className="space-y-2">
                {malzemeler.length > 0 ? (
                  malzemeler.map((malzeme, index) => (
                    <div key={malzeme.id || index} className="p-3 border rounded-lg bg-card">
                      <div className="flex items-center gap-2 mb-2">
                        <PackageIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">{malzeme.vidaNo || malzeme.stokDemirbasNo || `Malzeme #${index + 1}`}</span>
                        <Badge variant={malzeme.malzemeTipi === 'Demirbas' ? 'default' : 'secondary'} className="text-xs ml-auto">
                          {malzeme.malzemeTipi}
                        </Badge>
                      </div>

                      {malzeme.sabitKodu && (
                        <div className="text-xs text-muted-foreground mb-1">
                          <strong>Sabit Kod:</strong> {malzeme.sabitKodu}
                        </div>
                      )}

                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {malzeme.kondisyon || 'Saglam'}
                        </Badge>
                        {malzeme.marka && <span className="text-xs text-muted-foreground">{malzeme.marka}</span>}
                        {malzeme.model && <span className="text-xs text-muted-foreground">• {malzeme.model}</span>}
                      </div>

                      {/* Ek bilgiler */}
                      <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                        {malzeme.bademSeriNo && (
                          <div>
                            <strong>Badem SN:</strong> {malzeme.bademSeriNo}
                          </div>
                        )}
                        {malzeme.etmysSeriNo && (
                          <div>
                            <strong>ETMYS SN:</strong> {malzeme.etmysSeriNo}
                          </div>
                        )}
                        {malzeme.birim && (
                          <div>
                            <strong>Birim:</strong> {malzeme.birim}
                          </div>
                        )}
                        {malzeme.sube && (
                          <div>
                            <strong>Şube:</strong> {malzeme.sube}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <PackageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <div className="text-sm">Bu tutanağa ait malzeme bulunamadı</div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="flex-1 p-6 overflow-hidden">
            <ScrollArea className="h-full pr-2">
              <div className="space-y-4 m-2">
                {/* İşlem Tarihi */}
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">İşlem Tarihi</div>
                    <div className="text-xs text-muted-foreground">{islemTarihi ? format(new Date(islemTarihi), 'dd MMMM yyyy, HH:mm', { locale: tr }) : '-'}</div>
                  </div>
                </div>

                {/* Kaynak Personel */}
                {kaynakPersonel ? (
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={kaynakPersonel.avatar} />
                        <AvatarFallback className="text-xs">{kaynakPersonel.ad?.charAt(0) || 'K'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">Kaynak: {kaynakPersonel.ad || '-'}</div>
                        <div className="text-xs text-muted-foreground">{kaynakPersonel.sicil || '-'}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Kaynak: Depo</div>
                      <div className="text-xs text-muted-foreground">Malzeme deposundan</div>
                    </div>
                  </div>
                )}

                {/* Hedef Personel */}
                {hedefPersonel && (
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={hedefPersonel.avatar} />
                        <AvatarFallback className="text-xs">{hedefPersonel.ad?.charAt(0) || 'H'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">Hedef: {hedefPersonel.ad || '-'}</div>
                        <div className="text-xs text-muted-foreground">
                          {hedefPersonel.sicil || '-'}
                          {hedefPersonel.buro && ` • ${hedefPersonel.buro}`}
                        </div>
                        {hedefPersonel.sube && (
                          <div className="text-xs text-muted-foreground">
                            {hedefPersonel.sube} {hedefPersonel.birim && ` • ${hedefPersonel.birim}`}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Konum */}
                {konum && (
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">{konum.ad}</div>
                      {konum.depo && <div className="text-xs text-muted-foreground">{konum.depo}</div>}
                    </div>
                  </div>
                )}

                {/* Malzeme İstatistikleri */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 bg-blue-50 rounded-lg text-center">
                    <div className="text-lg font-bold text-blue-600">{toplamMalzeme || 0}</div>
                    <div className="text-xs text-blue-600">Toplam</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg text-center">
                    <div className="text-lg font-bold text-green-600">{demirbasSayisi || 0}</div>
                    <div className="text-xs text-green-600">Demirbaş</div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg text-center">
                    <div className="text-lg font-bold text-orange-600">{sarfSayisi || 0}</div>
                    <div className="text-xs text-orange-600">Sarf</div>
                  </div>
                </div>

                {/* Açıklama */}
                {aciklama && (
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <div className="text-sm font-medium mb-1">Açıklama</div>
                    <div className="text-xs text-muted-foreground">{aciklama}</div>
                  </div>
                )}
              </div>
              <div className="space-y-3 m-4">
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tutanak ID:</span>
                    <span className="font-mono text-xs">{id}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tutanak No:</span>
                    <span className="font-mono text-xs">{id}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hareket Türü:</span>
                    <Badge variant="outline" className="text-xs">
                      {hareketTuru}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Oluşturan:</span>
                    <span>{createdBy?.ad || '-'}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Oluşturulma:</span>
                    <span className="text-xs">{createdAt ? format(new Date(createdAt), 'dd.MM.yyyy HH:mm', { locale: tr }) : '-'}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kayıt Durumu:</span>
                    <Badge variant={status === 'Aktif' ? 'default' : 'secondary'} className="text-xs">
                      {status}
                    </Badge>
                  </div>

                  {/* İşlem bilgileri */}
                  {islemBilgileri?.hareketId && (
                    <>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Hareket ID:</span>
                        <span className="font-mono text-xs">{islemBilgileri.hareketId}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
