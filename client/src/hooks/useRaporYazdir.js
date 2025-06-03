// hooks/useRaporYazdir.js
import { useRef, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';
import { toast } from 'sonner';

export const useRaporYazdir = () => {
  const raporRef = useRef();

  const yazdirmaIslemi = useReactToPrint({
    content: () => raporRef.current,
    documentTitle: 'Malzeme Hareket Tutanagi',
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      @media print {
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.4;
        }
        .page-break {
          page-break-before: always;
        }
      }
    `,
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 100);
      });
    },
    onAfterPrint: () => {
      toast.success('Rapor başarıyla yazdırıldı veya PDF olarak kaydedildi.');
    },
    onPrintError: () => {
      toast.error('Yazdırma işlemi sırasında bir hata oluştu.');
    }
  });

  const yazdir = useCallback((hareketler, options = {}) => {
    if (!hareketler || hareketler.length === 0) {
      toast.warning('Yazdırılacak hareket bulunamadı.');
      return;
    }

    // Yazdırma seçenekleri
    const yazdirmaSeçenekleri = {
      raporBasligi: options.raporBasligi || 'Malzeme Hareket Tutanağı',
      raporTipi: options.raporTipi || 'selected',
      islemTarihi: options.islemTarihi || new Date(),
      islemYapan: options.islemYapan || 'Sistem Kullanıcısı',
      kurumBilgileri: options.kurumBilgileri || {
        ad: 'Şirket Adı',
        adres: 'Şirket Adresi',
        telefon: 'Telefon Numarası'
      },
      ...options
    };

    // State'e seçenekleri kaydet ve yazdır
    setTimeout(() => {
      yazdirmaIslemi();
    }, 200);

    return yazdirmaSeçenekleri;
  }, [yazdirmaIslemi]);

  return {
    raporRef,
    yazdir,
    yazdirmaIslemi
  };
};

// components/dialogs/RaporOnizlemeDialog.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MalzemeHareketRapor } from '../reports/MalzemeHareketRapor';
import { useRaporYazdir } from '@/hooks/useRaporYazdir';
import { Printer, Eye, FileDown, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const RaporOnizlemeDialog = ({ 
  isOpen, 
  onClose, 
  hareketler = [],
  varsayilanBaslik = "Malzeme Hareket Tutanağı",
  raporTipi = "selected"
}) => {
  const { raporRef, yazdir } = useRaporYazdir();
  
  const [raporSeçenekleri, setRaporSeçenekleri] = useState({
    raporBasligi: varsayilanBaslik,
    raporTipi: raporTipi,
    islemTarihi: new Date(),
    islemYapan: 'Sistem Kullanıcısı', // Bu gerçek kullanıcı bilgisinden gelecek
    kurumBilgileri: {
      ad: 'Şirket Adı',
      adres: 'Şirket Adresi, İl/İlçe, Posta Kodu',
      telefon: '+90 XXX XXX XX XX'
    }
  });

  const handleSeçenekDeğişikliği = (alan, değer) => {
    setRaporSeçenekleri(prev => ({
      ...prev,
      [alan]: değer
    }));
  };

  const handleKurumBilgisiDeğişikliği = (alan, değer) => {
    setRaporSeçenekleri(prev => ({
      ...prev,
      kurumBilgileri: {
        ...prev.kurumBilgileri,
        [alan]: değer
      }
    }));
  };

  const handleYazdir = () => {
    yazdir(hareketler, raporSeçenekleri);
  };

  const handlePDFOlarakKaydet = () => {
    // PDF kaydetme mantığı burada olacak
    // window.print() kullanarak varsayılan PDF kaydetme
    yazdir(hareketler, { 
      ...raporSeçenekleri,
      documentTitle: `${raporSeçenekleri.raporBasligi.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}`
    });
  };

  if (!hareketler || hareketler.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Rapor Oluşturulamıyor</DialogTitle>
            <DialogDescription>
              Rapor oluşturmak için en az bir hareket seçmelisiniz.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>Kapat</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileDown className="h-5 w-5" />
            Rapor Önizleme ve Yazdırma
          </DialogTitle>
          <DialogDescription>
            {hareketler.length} adet hareket için rapor oluşturuluyor
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="onizleme" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="onizleme" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Önizleme
            </TabsTrigger>
            <TabsTrigger value="ayarlar" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Rapor Ayarları
            </TabsTrigger>
          </TabsList>

          <TabsContent value="onizleme" className="flex-1">
            <ScrollArea className="h-[500px] w-full border rounded-lg">
              <MalzemeHareketRapor
                ref={raporRef}
                hareketler={hareketler}
                raporBasligi={raporSeçenekleri.raporBasligi}
                raporTipi={raporSeçenekleri.raporTipi}
                islemTarihi={raporSeçenekleri.islemTarihi}
                islemYapan={raporSeçenekleri.islemYapan}
                kurumBilgileri={raporSeçenekleri.kurumBilgileri}
              />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="ayarlar" className="flex-1">
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-6">
                {/* Rapor Başlığı */}
                <div className="space-y-2">
                  <Label htmlFor="raporBasligi">Rapor Başlığı</Label>
                  <Input
                    id="raporBasligi"
                    value={raporSeçenekleri.raporBasligi}
                    onChange={(e) => handleSeçenekDeğişikliği('raporBasligi', e.target.value)}
                    placeholder="Rapor başlığını girin..."
                  />
                </div>

                {/* İşlemi Yapan */}
                <div className="space-y-2">
                  <Label htmlFor="islemYapan">İşlemi Yapan Kişi</Label>
                  <Input
                    id="islemYapan"
                    value={raporSeçenekleri.islemYapan}
                    onChange={(e) => handleSeçenekDeğişikliği('islemYapan', e.target.value)}
                    placeholder="İşlemi yapan kişinin adını girin..."
                  />
                </div>

                {/* Kurum Bilgileri */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Kurum Bilgileri</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="kurumAd">Kurum/Şirket Adı</Label>
                    <Input
                      id="kurumAd"
                      value={raporSeçenekleri.kurumBilgileri.ad}
                      onChange={(e) => handleKurumBilgisiDeğişikliği('ad', e.target.value)}
                      placeholder="Kurum adını girin..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kurumAdres">Adres</Label>
                    <Textarea
                      id="kurumAdres"
                      value={raporSeçenekleri.kurumBilgileri.adres}
                      onChange={(e) => handleKurumBilgisiDeğişikliği('adres', e.target.value)}
                      placeholder="Kurum adresini girin..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kurumTelefon">Telefon</Label>
                    <Input
                      id="kurumTelefon"
                      value={raporSeçenekleri.kurumBilgileri.telefon}
                      onChange={(e) => handleKurumBilgisiDeğişikliği('telefon', e.target.value)}
                      placeholder="Telefon numarasını girin..."
                    />
                  </div>
                </div>

                {/* İstatistik Bilgisi */}
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Rapor İçeriği</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Toplam Hareket:</strong> {hareketler.length}</p>
                    <p><strong>Hareket Türleri:</strong> {[...new Set(hareketler.map(h => h.hareketTuru))].join(', ')}</p>
                    <p><strong>Rapor Türü:</strong> {raporTipi === 'single' ? 'Tekil İşlem' : raporTipi === 'bulk' ? 'Toplu İşlem' : 'Seçili İşlemler'}</p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            İptal
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePDFOlarakKaydet}>
              <FileDown className="h-4 w-4 mr-2" />
              PDF Kaydet
            </Button>
            <Button onClick={handleYazdir}>
              <Printer className="h-4 w-4 mr-2" />
              Yazdır
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};