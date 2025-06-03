// components/reports/MalzemeHareketRapor.jsx
'use client';

import React, { forwardRef, useMemo } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Package, 
  User, 
  MapPin, 
  Calendar, 
  FileText, 
  Building2,
  ClipboardCheck,
  Info
} from 'lucide-react';

// Hareket türü etiketleri ve renkleri
const hareketTuruLabels = {
  Kayit: 'Kayıt İşlemi',
  Zimmet: 'Zimmet Verme',
  Iade: 'İade Alma',
  Devir: 'Devir İşlemi',
  DepoTransferi: 'Depo Transferi',
  KondisyonGuncelleme: 'Kondisyon Güncelleme',
  Kayip: 'Kayıp Bildirimi',
  Dusum: 'Düşüm İşlemi',
};

const kondisyonLabels = {
  Saglam: 'Sağlam',
  Arizali: 'Arızalı',
  Hurda: 'Hurda',
  Kayip: 'Kayıp',
  Dusum: 'Düşüm',
};

// Yazdırılabilir rapor bileşeni
export const MalzemeHareketRapor = forwardRef(({ 
  hareketler = [], 
  raporBasligi = "Malzeme Hareket Tutanağı",
  raporTipi = "single", // "single", "bulk", "selected"
  islemTarihi = new Date(),
  islemYapan = "Sistem Kullanıcısı",
  kurumBilgileri = {
    ad: "Şirket Adı",
    adres: "Şirket Adresi",
    telefon: "Telefon Numarası"
  }
}, ref) => {
  
  // Hareketleri grupla ve analiz et
  const hareketAnalizi = useMemo(() => {
    if (!hareketler || hareketler.length === 0) return null;

    const gruplar = hareketler.reduce((acc, hareket) => {
      const tur = hareket.hareketTuru;
      if (!acc[tur]) {
        acc[tur] = [];
      }
      acc[tur].push(hareket);
      return acc;
    }, {});

    const toplamMalzeme = hareketler.length;
    const benzersizPersoneller = new Set();
    const benzersizKonumlar = new Set();
    const benzersizMalzemeler = new Set();

    hareketler.forEach(hareket => {
      if (hareket.kaynakPersonel?.id) benzersizPersoneller.add(hareket.kaynakPersonel.id);
      if (hareket.hedefPersonel?.id) benzersizPersoneller.add(hareket.hedefPersonel.id);
      if (hareket.konum?.id) benzersizKonumlar.add(hareket.konum.id);
      if (hareket.malzeme?.id) benzersizMalzemeler.add(hareket.malzeme.id);
    });

    return {
      gruplar,
      toplamMalzeme,
      benzersizPersonelSayisi: benzersizPersoneller.size,
      benzersizKonumSayisi: benzersizKonumlar.size,
      benzersizMalzemeSayisi: benzersizMalzemeler.size,
      hareketTurleri: Object.keys(gruplar)
    };
  }, [hareketler]);

  if (!hareketAnalizi) {
    return (
      <div className="print-container p-8 bg-white min-h-screen">
        <div className="text-center text-gray-500">
          Rapor oluşturmak için hareket verisi gereklidir.
        </div>
      </div>
    );
  }

  const RaporBilgiSatiri = ({ ikon: Ikon, baslik, deger, renkSinifi = "" }) => (
    <div className="flex items-center gap-3 py-2">
      {Ikon && <Ikon className={`h-4 w-4 ${renkSinifi}`} />}
      <span className="font-medium min-w-[120px]">{baslik}:</span>
      <span className="flex-1">{deger}</span>
    </div>
  );

  const MalzemeBilgiKarti = ({ malzeme, hareket }) => (
    <div className="border rounded-lg p-3 mb-3 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <Package className="h-4 w-4" />
            Malzeme Bilgileri
          </h5>
          <div className="space-y-1 text-sm">
            <div><strong>Vida No:</strong> {malzeme?.vidaNo || '-'}</div>
            <div><strong>Sabit Kod:</strong> {malzeme?.sabitKodu?.ad || '-'}</div>
            <div><strong>Marka/Model:</strong> {malzeme?.marka?.ad || ''} {malzeme?.model?.ad || ''}</div>
            <div><strong>Seri No:</strong> {malzeme?.bademSeriNo || '-'}</div>
            {malzeme?.aciklama && (
              <div><strong>Açıklama:</strong> {malzeme.aciklama}</div>
            )}
          </div>
        </div>
        <div>
          <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" />
            İşlem Bilgileri
          </h5>
          <div className="space-y-1 text-sm">
            <div><strong>Kondisyon:</strong> {kondisyonLabels[hareket?.malzemeKondisyonu] || hareket?.malzemeKondisyonu}</div>
            {hareket?.kaynakPersonel && (
              <div><strong>Kaynak Personel:</strong> {hareket.kaynakPersonel.ad} ({hareket.kaynakPersonel.sicil})</div>
            )}
            {hareket?.hedefPersonel && (
              <div><strong>Hedef Personel:</strong> {hareket.hedefPersonel.ad} ({hareket.hedefPersonel.sicil})</div>
            )}
            {hareket?.konum && (
              <div><strong>Konum:</strong> {hareket.konum.depo?.ad} - {hareket.konum.ad}</div>
            )}
            {hareket?.aciklama && (
              <div><strong>İşlem Açıklaması:</strong> {hareket.aciklama}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div ref={ref} className="print-container p-8 bg-white min-h-screen font-sans">
      {/* SAYFA BAŞLIĞI */}
      <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{kurumBilgileri.ad}</h1>
        <p className="text-sm text-gray-600 mb-4">{kurumBilgileri.adres}</p>
        <h2 className="text-xl font-semibold text-blue-800">{raporBasligi}</h2>
        <p className="text-sm text-gray-500 mt-2">
          Rapor Tarihi: {format(islemTarihi, 'dd MMMM yyyy - HH:mm', { locale: tr })}
        </p>
      </div>

      {/* ÖZET BİLGİLER */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-600" />
          İşlem Özeti
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{hareketAnalizi.toplamMalzeme}</div>
            <div className="text-sm text-gray-600">Toplam İşlem</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{hareketAnalizi.benzersizMalzemeSayisi}</div>
            <div className="text-sm text-gray-600">Benzersiz Malzeme</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">{hareketAnalizi.benzersizPersonelSayisi}</div>
            <div className="text-sm text-gray-600">İlgili Personel</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">{hareketAnalizi.benzersizKonumSayisi}</div>
            <div className="text-sm text-gray-600">İlgili Konum</div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <RaporBilgiSatiri 
            ikon={User} 
            baslik="İşlemi Yapan" 
            deger={islemYapan} 
            renkSinifi="text-blue-600" 
          />
          <RaporBilgiSatiri 
            ikon={Calendar} 
            baslik="İşlem Tarihi" 
            deger={format(islemTarihi, 'dd MMMM yyyy - HH:mm', { locale: tr })} 
            renkSinifi="text-green-600" 
          />
          <RaporBilgiSatiri 
            ikon={FileText} 
            baslik="İşlem Türleri" 
            deger={hareketAnalizi.hareketTurleri.map(tur => hareketTuruLabels[tur]).join(', ')} 
            renkSinifi="text-purple-600" 
          />
        </div>
      </div>

      {/* DETAYLAR - HAREKET TÜRÜNE GÖRE GRUPLANMIŞ */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Package className="h-5 w-5 text-green-600" />
          İşlem Detayları
        </h3>

        {Object.entries(hareketAnalizi.gruplar).map(([hareketTuru, hareketler]) => (
          <div key={hareketTuru} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <h4 className="text-md font-semibold">{hareketTuruLabels[hareketTuru]}</h4>
              <Badge variant="outline" className="bg-blue-50">
                {hareketler.length} işlem
              </Badge>
            </div>

            <div className="space-y-3">
              {hareketler.map((hareket, index) => (
                <div key={hareket.id || index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      İşlem #{index + 1} - {format(new Date(hareket.islemTarihi), 'dd.MM.yyyy HH:mm', { locale: tr })}
                    </span>
                    {hareket.createdBy && (
                      <span className="text-xs text-gray-500">
                        İşleyen: {hareket.createdBy}
                      </span>
                    )}
                  </div>
                  <MalzemeBilgiKarti malzeme={hareket.malzeme} hareket={hareket} />
                </div>
              ))}
            </div>

            {Object.keys(hareketAnalizi.gruplar).indexOf(hareketTuru) < Object.keys(hareketAnalizi.gruplar).length - 1 && (
              <Separator className="my-6" />
            )}
          </div>
        ))}
      </div>

      {/* İMZA ALANLARI */}
      <div className="mt-12 pt-8 border-t-2 border-gray-300">
        <h3 className="text-lg font-semibold mb-6">Onay ve İmza Alanları</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="border-b-2 border-gray-400 h-16 mb-3"></div>
            <p className="font-semibold">İşlemi Yapan</p>
            <p className="text-sm text-gray-600">{islemYapan}</p>
            <p className="text-xs text-gray-500 mt-2">Tarih: .....................</p>
          </div>

          <div className="text-center">
            <div className="border-b-2 border-gray-400 h-16 mb-3"></div>
            <p className="font-semibold">Kontrol Eden</p>
            <p className="text-sm text-gray-600">Yönetici/Sorumlu</p>
            <p className="text-xs text-gray-500 mt-2">Tarih: .....................</p>
          </div>

          <div className="text-center">
            <div className="border-b-2 border-gray-400 h-16 mb-3"></div>
            <p className="font-semibold">Onaylayan</p>
            <p className="text-sm text-gray-600">Departman Müdürü</p>
            <p className="text-xs text-gray-500 mt-2">Tarih: .....................</p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
        <p>Bu belge elektronik ortamda oluşturulmuş olup, sistem tarafından otomatik olarak üretilmiştir.</p>
        <p>Belge No: MH-{format(islemTarihi, 'yyyyMMdd-HHmmss')}</p>
        <p className="mt-2">{kurumBilgileri.telefon} | Sayfa 1</p>
      </div>

      {/* YAZDIRMA STİLLERİ */}
      <style jsx>{`
        @media print {
          .print-container {
            max-width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            box-shadow: none !important;
            background: white !important;
          }
          
          .bg-blue-50, .bg-green-50, .bg-orange-50, .bg-purple-50, .bg-gray-50 {
            background-color: #f8f9fa !important;
            border: 1px solid #dee2e6 !important;
          }
          
          .border-b-2 {
            border-bottom: 2px solid #000 !important;
          }
          
          * {
            color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
});

MalzemeHareketRapor.displayName = 'MalzemeHareketRapor';