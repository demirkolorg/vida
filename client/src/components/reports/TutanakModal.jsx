// client/src/components/reports/TutanakModal.jsx
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Printer, 
  Download, 
  X, 
  FileText, 
  Calendar, 
  Clock, 
  User,
  Package,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

// Tutanak bileşenlerini import et
import BaseMalzemeHareketTutanagi from './BaseMalzemeHareketTutanagi';
import ZimmetTutanagi from './tutanaklar/ZimmetTutanagi';
// İleriki adımlarda eklenecek:
// import IadeTutanagi from './tutanaklar/IadeTutanagi';

export const TutanakModal = ({ 
  isOpen, 
  onClose, 
  tutanakData,
  onPrint,
  onSavePDF 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!tutanakData) return null;

  const { 
    hareketTuru, 
    malzemeler, 
    personelBilgileri, 
    islemBilgileri, 
    tutanakNo, 
    isBulk, 
    isExisting 
  } = tutanakData;

  // Hareket türüne göre renk ve ikon
  const getHareketTuruInfo = (tur) => {
    const info = {
      'Zimmet': { color: 'bg-blue-500', icon: User, label: 'Zimmet Tutanağı' },
      'Iade': { color: 'bg-green-500', icon: Package, label: 'İade Tutanağı' },
      'Devir': { color: 'bg-orange-500', icon: User, label: 'Devir Tutanağı' },
      'DepoTransferi': { color: 'bg-purple-500', icon: Package, label: 'Depo Transfer Tutanağı' },
      'KondisyonGuncelleme': { color: 'bg-yellow-500', icon: FileText, label: 'Kondisyon Güncelleme Tutanağı' },
      'Kayip': { color: 'bg-red-500', icon: AlertCircle, label: 'Kayıp Tutanağı' },
      'Dusum': { color: 'bg-gray-500', icon: FileText, label: 'Düşüm Tutanağı' },
      'Kayit': { color: 'bg-indigo-500', icon: Package, label: 'Kayıt Tutanağı' }
    };
    return info[tur] || { color: 'bg-gray-500', icon: FileText, label: 'Hareket Tutanağı' };
  };

  const hareketInfo = getHareketTuruInfo(hareketTuru);
  const IconComponent = hareketInfo.icon;

  // Yazdırma işlemi
  const handlePrint = async () => {
    setIsLoading(true);
    try {
      // Print-specific class'ı ekle
      document.body.classList.add('printing');
      
      // Modal'ı gizle
      const modalElement = document.querySelector('[data-radix-dialog-content]');
      if (modalElement) {
        modalElement.style.display = 'none';
      }
      
      // Kısa bir gecikme ile print dialog'u aç
      setTimeout(() => {
        window.print();
        
        // Print işlemi sonrası temizlik
        document.body.classList.remove('printing');
        if (modalElement) {
          modalElement.style.display = '';
        }
        
        setIsLoading(false);
        
        if (onPrint) onPrint();
        toast.success('Tutanak yazdırıldı');
      }, 100);
    } catch (error) {
      console.error('Print error:', error);
      setIsLoading(false);
      document.body.classList.remove('printing');
      toast.error('Yazdırma sırasında hata oluştu');
    }
  };

  // PDF kaydetme işlemi (ileride implementlenecek)
  const handleSavePDF = async () => {
    setIsLoading(true);
    try {
      // PDF save logic burada olacak
      setTimeout(() => {
        setIsLoading(false);
        if (onSavePDF) onSavePDF();
        toast.info('PDF kaydetme özelliği yakında eklenecek');
      }, 1000);
    } catch (error) {
      console.error('PDF save error:', error);
      setIsLoading(false);
      toast.error('PDF kaydetme sırasında hata oluştu');
    }
  };

  // Tutanak bileşenini seç
  const renderTutanak = () => {
    // Hareket türüne göre specific tutanak bileşenini seç
    switch (hareketTuru) {
      case 'Zimmet':
        return <ZimmetTutanagi tutanakData={tutanakData} className="tutanak-content" />;
      case 'Iade':
        // return <IadeTutanagi tutanakData={tutanakData} className="tutanak-content" />;
        break;
      case 'Devir':
        // return <DevirTutanagi tutanakData={tutanakData} className="tutanak-content" />;
        break;
      // ... diğer türler için specific tutanaklar
      default:
        // Fallback olarak Base tutanağı kullan
        return (
          <BaseMalzemeHareketTutanagi
            hareketTuru={hareketTuru}
            tutanakNo={tutanakNo}
            tarih={islemBilgileri.tarih}
            malzemeler={malzemeler}
            className="tutanak-content print:shadow-none"
          />
        );
    }
    
    // Henüz implementlenmemiş türler için Base tutanak
    return (
      <BaseMalzemeHareketTutanagi
        hareketTuru={hareketTuru}
        tutanakNo={tutanakNo}
        tarih={islemBilgileri.tarih}
        malzemeler={malzemeler}
        className="tutanak-content print:shadow-none"
      />
    );
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl h-[90vh] flex flex-col p-0">
          {/* Header */}
          <DialogHeader className="flex-shrink-0 p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${hareketInfo.color} text-white`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold">
                    {hareketInfo.label}
                  </DialogTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span>Tutanak No: {tutanakNo}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{islemBilgileri.tarih}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{islemBilgileri.saat}</span>
                    </div>
                    {isBulk && (
                      <Badge variant="secondary" className="ml-2">
                        <Package className="h-3 w-3 mr-1" />
                        Toplu İşlem
                      </Badge>
                    )}
                    {isExisting && (
                      <Badge variant="outline" className="ml-2">
                        Mevcut Hareket
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm">
                  {malzemeler.length} Malzeme
                </Badge>
              </div>
            </div>
          </DialogHeader>

          {/* Content - Tutanak */}
          <div className="flex-1 overflow-auto bg-gray-50 p-4">
            <div className="max-w-4xl mx-auto">
              {renderTutanak()}
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="flex-shrink-0 p-6 border-t bg-white">
            <div className="flex items-center justify-between w-full">
              {/* Sol taraf - Bilgiler */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>İşlem Yapan: {islemBilgileri.islemYapan?.ad || 'Bilinmiyor'}</span>
                </div>
                {islemBilgileri.aciklama && (
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span>Açıklama: {islemBilgileri.aciklama.slice(0, 50)}...</span>
                  </div>
                )}
              </div>

              {/* Sağ taraf - Butonlar */}
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handleSavePDF}
                  disabled={isLoading}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  PDF Kaydet
                </Button>
                
                <Button
                  onClick={handlePrint}
                  disabled={isLoading}
                  className="gap-2"
                >
                  <Printer className="h-4 w-4" />
                  {isLoading ? 'Hazırlanıyor...' : 'Yazdır'}
                </Button>
                
                <Separator orientation="vertical" className="h-6" />
                
                <Button
                  variant="ghost"
                  onClick={onClose}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Kapat
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          /* Tüm sayfa elementlerini gizle */
          body * {
            visibility: hidden;
          }
          
          /* Sadece tutanak içeriğini göster */
          .tutanak-content,
          .tutanak-content * {
            visibility: visible;
          }
          
          /* Tutanak içeriğini tam sayfa yap */
          .tutanak-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
          }
          
          /* Dialog ve modal elementlerini tamamen gizle */
          [data-radix-dialog-overlay],
          [data-radix-dialog-content],
          .dialog-content {
            display: none !important;
          }
          
          /* Print sırasında sayfa ayarları */
          @page {
            margin: 0.5in;
            size: A4;
          }
          
          /* Body ayarları */
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          /* Tutanak için özel print ayarları */
          .tutanak-content {
            font-size: 12pt !important;
            line-height: 1.4 !important;
            color: black !important;
          }
          
          /* Tablo print ayarları */
          .tutanak-content table {
            page-break-inside: avoid;
            border-collapse: collapse !important;
          }
          
          .tutanak-content th,
          .tutanak-content td {
            border: 1px solid black !important;
            padding: 4pt !important;
          }
          
          /* Sayfa kırılma kontrolü */
          .tutanak-content .space-y-8 > div {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
        
        /* Print hazırlık durumu */
        .printing {
          overflow: hidden;
        }
        
        .printing .dialog-content {
          display: none !important;
        }
      `}</style>
    </>
  );
};