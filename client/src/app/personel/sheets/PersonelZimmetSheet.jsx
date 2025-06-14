// client/src/app/personel/sheets/PersonelZimmetSheet.jsx
'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Package, User, Calendar, MapPin, Tag, Barcode, AlertTriangle, CheckCircle, Package2, Building2, Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Card, CardDescription, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Store importları
import { MalzemeHareket_Store } from '@/app/malzemehareket/constants/store';
import { usePersonelStore } from '@/stores/usePersonelStore';
import { hareketTuruLabels } from '@/app/malzemehareket/constants/hareketTuruEnum';

export function PersonelZimmetSheet() {
  const personelZimmetleri = MalzemeHareket_Store(state => state.personelZimmetleri);
  const loadingPersonelZimmetleri = MalzemeHareket_Store(state => state.loadingPersonelZimmetleri);
  
  const isSheetOpen = usePersonelStore(state => state.isPersonelZimmetSheetOpen);
  const currentPersonel = usePersonelStore(state => state.currentPersonelZimmet);
  const closeSheet = usePersonelStore(state => state.closePersonelZimmetSheet);

  const zimmetliMalzemeler = personelZimmetleri || [];

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getKondisyonBadgeVariant = (kondisyon) => {
    switch (kondisyon) {
      case 'Saglam': return 'default';
      case 'Arizali': return 'destructive';
      case 'Hurda': return 'secondary';
      case 'Kayip': return 'destructive';
      case 'Dusum': return 'secondary';
      default: return 'outline';
    }
  };

  if (!isSheetOpen || !currentPersonel) {
    return null;
  }

  return (
    <Sheet open={isSheetOpen} onOpenChange={open => { if (!open) closeSheet(); }}>
      <SheetContent className="sm:max-w-4xl w-full p-0 flex flex-col h-full">
        {/* Compact Header */}
        <SheetHeader className="p-4 border-b bg-muted/30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Package2 className="h-4 w-4 text-primary-foreground" />
              
            </div>
             <div className="ml-auto text-right">
              <div className="text-2xl font-bold text-primary">{zimmetliMalzemeler.length}</div>
              <div className="text-xs text-muted-foreground">adet</div>
            </div>
            <div>
              <SheetTitle className="text-lg">Zimmetli Malzeme</SheetTitle>
              <p className="text-xs text-muted-foreground">
                {currentPersonel.ad} {currentPersonel.soyad} ({currentPersonel.sicil})
              </p>
            </div>
            <div className="ml-auto text-right">
            </div>
          </div>
        </SheetHeader>

        {/* Loading State */}
        {loadingPersonelZimmetleri && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="text-sm text-muted-foreground">Yükleniyor...</p>
            </div>
          </div>
        )}

        {/* Content */}
        {!loadingPersonelZimmetleri && (
          <div className="flex-1 overflow-hidden">
            {zimmetliMalzemeler.length === 0 ? (
              <div className="p-4 flex-1 flex items-center justify-center">
                <Alert className="max-w-md">
                  <Package className="h-4 w-4" />
                  <AlertDescription>
                    Bu personelin zimmetinde malzeme bulunmamaktadır.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <ScrollArea className="h-full">
                <div className="p-4 space-y-3">
                  {zimmetliMalzemeler.map((malzeme, index) => (
                    <Card key={`${malzeme.id}-${index}`} className="hover:shadow-sm transition-shadow border-l-2 border-l-primary/50">
                      <CardContent className="p-4">
                        <div className="flex flex-col lg:flex-row gap-4">
                          {/* Sol: Ana Bilgiler */}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium text-sm leading-tight">
                                  {malzeme?.sabitKodu?.ad || 'Bilinmeyen Malzeme'}
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  {malzeme?.marka?.ad} {malzeme?.model?.ad}
                                </p>
                              </div>
                              <div className="flex gap-1">
                                <Badge variant="outline" className="text-xs px-1 py-0">
                                  {malzeme?.malzemeTipi === 'Demirbas' ? 'D' : 'S'}
                                </Badge>
                                <Badge variant={getKondisyonBadgeVariant(malzeme.zimmetBilgileri?.malzemeKondisyonu)} className="text-xs px-1 py-0">
                                  {malzeme.zimmetBilgileri?.malzemeKondisyonu === 'Saglam' ? 'Sağlam' : malzeme.zimmetBilgileri?.malzemeKondisyonu || 'N/A'}
                                </Badge>
                              </div>
                            </div>

                            {/* Kompakt Kimlik Bilgileri */}
                            <div className="grid grid-cols-2 gap-1 text-xs">
                              {malzeme?.vidaNo && (
                                <div className="flex items-center gap-1 p-1 bg-muted/30 rounded">
                                  <Barcode className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-muted-foreground">Vida:</span>
                                  <code className="font-mono text-xs">{malzeme.vidaNo}</code>
                                </div>
                              )}
                              {malzeme?.kod && (
                                <div className="flex items-center gap-1 p-1 bg-muted/30 rounded">
                                  <Tag className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-muted-foreground">Etmys:</span>
                                  <code className="font-mono text-xs">{malzeme.etmysSeriNo}</code>
                                </div>
                              )}
                              {malzeme?.bademSeriNo && (
                                <div className="flex items-center gap-1 p-1 bg-muted/30 rounded">
                                  <Tag className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-muted-foreground">Badem:</span>
                                  <code className="font-mono text-xs">{malzeme.bademSeriNo}</code>
                                </div>
                              )}
                              {malzeme?.stokDemirbasNo && (
                                <div className="flex items-center gap-1 p-1 bg-muted/30 rounded">
                                  <Tag className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-muted-foreground">Stok:</span>
                                  <code className="font-mono text-xs">{malzeme.stokDemirbasNo}</code>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Sağ: Zimmet Bilgileri */}
                          <div className="lg:w-64 space-y-2">
                            <div className="bg-muted/20 rounded p-2 space-y-1">
                              <div className="flex items-center justify-between">
                                <Badge variant="default" className="text-xs">
                                  {hareketTuruLabels[malzeme.zimmetBilgileri?.zimmetTuru] || 'Zimmet'}
                                </Badge>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {formatDate(malzeme.zimmetBilgileri?.zimmetTarihi)}
                                </div>
                              </div>

                              {malzeme.zimmetBilgileri?.kaynakPersonel && (
                                <div className="text-xs">
                                  <span className="text-muted-foreground">Veren:</span>
                                  <span className="ml-1 font-medium">
                                    {malzeme.zimmetBilgileri.kaynakPersonel.ad} ({malzeme.zimmetBilgileri.kaynakPersonel.sicil})
                                  </span>
                                </div>
                              )}

                              {malzeme.zimmetBilgileri?.zimmetAciklamasi && (
                                <div className="text-xs">
                                  <span className="text-muted-foreground">Not:</span>
                                  <p className="text-xs mt-0.5 p-1 bg-background rounded border leading-tight">
                                    {malzeme.zimmetBilgileri.zimmetAciklamasi}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        )}

        {/* Compact Footer */}
        <SheetFooter className="p-4 border-t bg-muted/30 flex-shrink-0">
          <div className="flex justify-between items-center w-full">
            <div className="text-xs text-muted-foreground">
              {zimmetliMalzemeler.length > 0 && `${zimmetliMalzemeler.length} zimmetli malzeme`}
            </div>
            <SheetClose asChild>
              <Button variant="outline" size="sm">Kapat</Button>
            </SheetClose>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}