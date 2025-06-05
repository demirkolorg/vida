// client/src/components/reports/hooks/useTutanakYazdir.js
import { useState } from 'react';
import { toast } from 'sonner';

export const useTutanakYazdir = () => {
  const [showTutanak, setShowTutanak] = useState(false);
  const [tutanakData, setTutanakData] = useState(null);

  // Tutanak numarası oluştur
  const generateTutanakNo = (hareketTuru) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const time = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0');
    
    const prefix = {
      'Zimmet': 'ZIM',
      'Iade': 'IAD', 
      'Devir': 'DEV',
      'DepoTransferi': 'TRF',
      'KondisyonGuncelleme': 'KND',
      'Kayip': 'KYP',
      'Dusum': 'DUS',
      'Kayit': 'KAY'
    };
    
    return `${prefix[hareketTuru] || 'HRK'}-${year}${month}${day}-${time}`;
  };

  // Malzeme verilerini tutanak formatına dönüştür
  const formatMalzemeForTutanak = (malzeme) => {
    return {
      id: malzeme.id,
      vidaNo: malzeme.vidaNo || '-',
      sabitKodu: malzeme.sabitKodu?.ad || '-',
      marka: malzeme.marka?.ad || '-',
      model: malzeme.model?.ad || '-',
      bademSeriNo: malzeme.bademSeriNo || '-',
      etmysSeriNo: malzeme.etmysSeriNo || '-',
      stokDemirbasNo: malzeme.stokDemirbasNo || '-',
      malzemeTipi: malzeme.malzemeTipi || '-',
      kondisyon: malzeme.kondisyon || 'Saglam'
    };
  };

  // Tek malzeme işlemi için tutanak aç
  const openSingleTutanak = (hareketTuru, malzeme, personelBilgileri, islemBilgileri = {}) => {
    const data = {
      hareketTuru,
      malzemeler: [formatMalzemeForTutanak(malzeme)],
      personelBilgileri: personelBilgileri || {},
      islemBilgileri: {
        tarih: new Date().toLocaleDateString('tr-TR'),
        saat: new Date().toLocaleTimeString('tr-TR'),
        kondisyon: islemBilgileri.kondisyon || 'Saglam',
        aciklama: islemBilgileri.aciklama || '',
        islemYapan: islemBilgileri.islemYapan || getCurrentUser(),
        ...islemBilgileri
      },
      tutanakNo: generateTutanakNo(hareketTuru),
      isBulk: false
    };
    
    setTutanakData(data);
    setShowTutanak(true);
    
    toast.info('Tutanak hazırlandı. Yazdırmak için "Yazdır" butonuna tıklayın.');
  };

  // Toplu işlem için tutanak aç
  const openBulkTutanak = (hareketTuru, malzemeler, personelBilgileri, islemBilgileri = {}) => {
    const data = {
      hareketTuru,
      malzemeler: malzemeler.map(formatMalzemeForTutanak),
      personelBilgileri: personelBilgileri || {},
      islemBilgileri: {
        tarih: new Date().toLocaleDateString('tr-TR'),
        saat: new Date().toLocaleTimeString('tr-TR'),
        kondisyon: islemBilgileri.kondisyon || 'Saglam',
        aciklama: islemBilgileri.aciklama || '',
        islemYapan: islemBilgileri.islemYapan || getCurrentUser(),
        ...islemBilgileri
      },
      tutanakNo: generateTutanakNo(hareketTuru),
      isBulk: true
    };
    
    setTutanakData(data);
    setShowTutanak(true);
    
    toast.info(`${malzemeler.length} malzeme için toplu tutanak hazırlandı.`);
  };

  // Mevcut hareket için tutanak aç (eski hareketler için)
  const openExistingHareketTutanak = (hareketData) => {
    const data = {
      hareketTuru: hareketData.hareketTuru,
      malzemeler: [formatMalzemeForTutanak(hareketData.malzeme)],
      personelBilgileri: {
        kaynakPersonel: hareketData.kaynakPersonel,
        hedefPersonel: hareketData.hedefPersonel
      },
      islemBilgileri: {
        tarih: new Date(hareketData.islemTarihi).toLocaleDateString('tr-TR'),
        saat: new Date(hareketData.islemTarihi).toLocaleTimeString('tr-TR'),
        kondisyon: hareketData.malzemeKondisyonu,
        aciklama: hareketData.aciklama || '',
        islemYapan: hareketData.createdBy,
        konum: hareketData.konum
      },
      tutanakNo: `${hareketData.id.slice(-8).toUpperCase()}`, // Hareket ID'sinden türet
      isBulk: false,
      isExisting: true
    };
    
    setTutanakData(data);
    setShowTutanak(true);
    
    toast.info('Mevcut hareket için tutanak hazırlandı.');
  };

  // Tutanak kapat
  const closeTutanak = () => {
    setShowTutanak(false);
    setTutanakData(null);
  };

  // Yazdırma işlemi
  const printTutanak = () => {
    // Print-specific styling'i aktifleştir
    document.body.classList.add('printing');
    
    setTimeout(() => {
      window.print();
      document.body.classList.remove('printing');
      toast.success('Tutanak yazdırma penceresi açıldı');
    }, 100);
  };

  // PDF olarak kaydet (opsiyonel)
  const saveTutanakAsPDF = () => {
    // Bu fonksiyon ileride PDF library ile implementlenebilir
    toast.info('PDF kaydetme özelliği yakında eklenecek');
  };

  // Mevcut kullanıcı bilgisini al (bu fonksiyon proje yapınıza göre değişebilir)
  const getCurrentUser = () => {
    // Bu kısım auth store'unuzdan gelecek
    return {
      ad: 'Sistem Kullanıcısı', // Auth store'dan alınacak
      sicil: 'SYS001', // Auth store'dan alınacak
      role: 'Admin' // Auth store'dan alınacak
    };
  };

  return {
    // State
    showTutanak,
    tutanakData,
    
    // Actions
    openSingleTutanak,
    openBulkTutanak,
    openExistingHareketTutanak,
    closeTutanak,
    printTutanak,
    saveTutanakAsPDF,
    
    // Utils
    generateTutanakNo,
    formatMalzemeForTutanak
  };
};