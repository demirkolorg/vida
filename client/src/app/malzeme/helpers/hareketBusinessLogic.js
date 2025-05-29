// app/malzeme/helpers/hareketBusinessLogic.js

/**
 * Malzeme hareket türleri için iş mantığı kuralları
 */

// Hareket türü tanımları ve koşulları
export const HAREKET_TURLERI = {
  Zimmet: {
    label: 'Zimmet Ver',
    description: 'Malzemeyi personele zimmet ver',
    icon: 'UserIcon',
    color: 'blue',
    requiredFields: ['hedefPersonelId'],
    optionalFields: ['aciklama'],
    kondisyonKisitlari: ['Saglam'], // Sadece sağlam malzemeler zimmetlenebilir
    conditions: {
      // Malzeme zimmetli olmamalı
      notZimmetli: true,
      // Malzeme sağlam durumda olmalı  
      kondisyon: ['Saglam']
    }
  },
  
  Iade: {
    label: 'İade Al',
    description: 'Zimmetli malzemeyi iade al',
    icon: 'ArrowLeftIcon',
    color: 'green',
    requiredFields: ['kaynakPersonelId'],
    optionalFields: ['aciklama', 'malzemeKondisyonu'],
    conditions: {
      // Malzeme zimmetli olmalı
      zimmetli: true
    }
  },
  
  Devir: {
    label: 'Devir Et',
    description: 'Malzemeyi başka personele devret',
    icon: 'ArrowRightIcon',
    color: 'orange',
    requiredFields: ['kaynakPersonelId', 'hedefPersonelId'],
    optionalFields: ['aciklama'],
    conditions: {
      // Malzeme zimmetli olmalı
      zimmetli: true,
      // Kaynak ve hedef personel farklı olmalı
      farkliPersonel: true
    }
  },
  
  KondisyonGuncelleme: {
    label: 'Kondisyon Güncelle',
    description: 'Malzemenin kondisyonunu güncelle',
    icon: 'RefreshCwIcon',
    color: 'purple',
    requiredFields: ['malzemeKondisyonu'],
    optionalFields: ['aciklama'],
    conditions: {
      // Her zaman yapılabilir
      always: true
    },
    special: {
      // Kondisyon güncelleme özel işlem - diğer bilgiler korunur
      preserveExistingData: true
    }
  },
  
  Kayip: {
    label: 'Kayıp Bildir',
    description: 'Malzemenin kayıp olduğunu bildir',
    icon: 'AlertTriangleIcon',
    color: 'red',
    requiredFields: ['kaynakPersonelId', 'aciklama'],
    optionalFields: [],
    conditions: {
      // Malzeme zimmetli olmalı
      zimmetli: true
    },
    special: {
      // Kayıp bildirimi sonrası malzeme durumu değişir
      updateMalzemeStatus: 'Kayip'
    }
  },
  
  DepoTransferi: {
    label: 'Depo Transfer',
    description: 'Malzemeyi başka depoya transfer et',
    icon: 'TruckIcon',
    color: 'indigo',
    requiredFields: ['konumId'],
    optionalFields: ['aciklama'],
    conditions: {
      // Malzeme zimmetli olmamalı
      notZimmetli: true
    }
  },
  
  Dusum: {
    label: 'Düşüm Yap',
    description: 'Malzemeyi envanterden düş',
    icon: 'TrendingDownIcon',
    color: 'gray',
    requiredFields: ['aciklama'],
    optionalFields: [],
    conditions: {
      // Malzeme hurda veya arızalı olmalı
      kondisyon: ['Hurda', 'Arizali'],
      // Zimmetli olmamalı
      notZimmetli: true
    },
    special: {
      // Düşüm sonrası malzeme pasif duruma geçer
      updateMalzemeStatus: 'Pasif'
    }
  },
  
  Kayit: {
    label: 'Yeni Kayıt',
    description: 'Yeni malzeme kaydı',
    icon: 'PackageIcon',
    color: 'emerald',
    requiredFields: ['konumId'],
    optionalFields: ['aciklama'],
    conditions: {
      // Genellikle sistem tarafından otomatik yapılır
      systemOnly: true
    }
  }
};

/**
 * Malzemenin mevcut durumuna göre yapılabilecek hareket türlerini döndürür
 * @param {Object} malzeme - Malzeme bilgileri
 * @returns {Array} - Yapılabilecek hareket türleri
 */
export const getAvailableHareketTurleri = (malzeme) => {
  if (!malzeme) return [];

  const availableHareketler = [];
  const lastHareket = getLastHareket(malzeme);
  const currentKondisyon = getCurrentKondisyon(malzeme);
  const isZimmetli = checkIfZimmetli(malzeme, lastHareket);

  // Her hareket türü için koşulları kontrol et
  Object.entries(HAREKET_TURLERI).forEach(([key, hareketTuru]) => {
    if (hareketTuru.conditions.systemOnly) return; // Sistem işlemleri hariç

    let canPerform = false;

    // Always condition - her zaman yapılabilir
    if (hareketTuru.conditions.always) {
      canPerform = true;
    }
    
    // Zimmet durumu kontrolü
    if (hareketTuru.conditions.zimmetli && !isZimmetli) {
      canPerform = false;
    }
    
    if (hareketTuru.conditions.notZimmetli && isZimmetli) {
      canPerform = false;
    }
    
    // Kondisyon kontrolü
    if (hareketTuru.conditions.kondisyon) {
      if (!hareketTuru.conditions.kondisyon.includes(currentKondisyon)) {
        canPerform = false;
      }
    }
    
    // Kondisyon kısıtlaması kontrolü (sadece belirli kondisyonlarda yapılabilir)
    if (hareketTuru.kondisyonKisitlari) {
      if (!hareketTuru.kondisyonKisitlari.includes(currentKondisyon)) {
        canPerform = false;
      }
    }

    // Always condition tekrar kontrol et (diğer koşulları geçersiz kılar)
    if (hareketTuru.conditions.always) {
      canPerform = true;
    }

    if (canPerform) {
      availableHareketler.push({
        key,
        ...hareketTuru,
        currentInfo: {
          isZimmetli,
          currentKondisyon,
          lastHareket: lastHareket?.hareketTuru,
          lastPersonel: lastHareket?.hedefPersonel?.ad || lastHareket?.kaynakPersonel?.ad
        }
      });
    }
  });

  return availableHareketler;
};

/**
 * Malzemenin son hareket kaydını döndürür
 * @param {Object} malzeme - Malzeme bilgileri
 * @returns {Object|null} - Son hareket kaydı
 */
export const getLastHareket = (malzeme) => {
  if (!malzeme?.malzemeHareketleri || malzeme.malzemeHareketleri.length === 0) {
    return null;
  }
  
  // En son tarihe göre sırala ve ilkini al
  const sortedHareketler = [...malzeme.malzemeHareketleri].sort((a, b) => 
    new Date(b.islemTarihi) - new Date(a.islemTarihi)
  );
  
  return sortedHareketler[0];
};

/**
 * Malzemenin mevcut kondisyonunu döndürür
 * @param {Object} malzeme - Malzeme bilgileri
 * @returns {string} - Mevcut kondisyon
 */
export const getCurrentKondisyon = (malzeme) => {
  const lastHareket = getLastHareket(malzeme);
  return lastHareket?.malzemeKondisyonu || 'Saglam';
};

/**
 * Malzemenin zimmetli olup olmadığını kontrol eder
 * @param {Object} malzeme - Malzeme bilgileri
 * @param {Object} lastHareket - Son hareket kaydı (opsiyonel, performans için)
 * @returns {boolean} - Zimmetli mi?
 */
export const checkIfZimmetli = (malzeme, lastHareket = null) => {
  const sonHareket = lastHareket || getLastHareket(malzeme);
  
  if (!sonHareket) return false;
  
  // Zimmet verme işlemi yapılmış ve henüz iade edilmemiş
  if (sonHareket.hareketTuru === 'Zimmet') return true;
  
  // Devir işlemi yapılmış (yeni personele geçmiş)
  if (sonHareket.hareketTuru === 'Devir') return true;
  
  // İade, kayıp, düşüm gibi işlemler zimmet durumunu sonlandırır
  if (['Iade', 'Kayip', 'Dusum'].includes(sonHareket.hareketTuru)) return false;
  
  // Kondisyon güncelleme zimmet durumunu etkilemez
  if (sonHareket.hareketTuru === 'KondisyonGuncelleme') {
    // Bir önceki harekete bak
    const previousHareket = getPreviousHareket(malzeme, sonHareket);
    return checkIfZimmetli(malzeme, previousHareket);
  }
  
  return false;
};

/**
 * Belirtilen hareketten önceki hareket kaydını döndürür
 * @param {Object} malzeme - Malzeme bilgileri
 * @param {Object} currentHareket - Mevcut hareket kaydı
 * @returns {Object|null} - Önceki hareket kaydı
 */
export const getPreviousHareket = (malzeme, currentHareket) => {
  if (!malzeme?.malzemeHareketleri || malzeme.malzemeHareketleri.length <= 1) {
    return null;
  }
  
  const sortedHareketler = [...malzeme.malzemeHareketleri].sort((a, b) => 
    new Date(b.islemTarihi) - new Date(a.islemTarihi)
  );
  
  const currentIndex = sortedHareketler.findIndex(h => h.id === currentHareket.id);
  
  if (currentIndex < sortedHareketler.length - 1) {
    return sortedHareketler[currentIndex + 1];
  }
  
  return null;
};

/**
 * Malzemenin zimmetli olduğu personeli döndürür
 * @param {Object} malzeme - Malzeme bilgileri
 * @returns {Object|null} - Zimmetli personel bilgisi
 */
export const getCurrentPersonel = (malzeme) => {
  const lastHareket = getLastHareket(malzeme);
  const isZimmetli = checkIfZimmetli(malzeme, lastHareket);
  
  if (!isZimmetli || !lastHareket) return null;
  
  // Zimmet veya devir işleminde hedef personel mevcut sahip
  if (['Zimmet', 'Devir'].includes(lastHareket.hareketTuru)) {
    return lastHareket.hedefPersonel;
  }
  
  return null;
};

/**
 * Malzemenin mevcut konumunu döndürür
 * @param {Object} malzeme - Malzeme bilgileri
 * @returns {Object|null} - Mevcut konum bilgisi
 */
export const getCurrentKonum = (malzeme) => {
  const lastHareket = getLastHareket(malzeme);
  
  if (!lastHareket) return null;
  
  // Depo transferi veya kayıt işleminde konum bilgisi
  if (['DepoTransferi', 'Kayit'].includes(lastHareket.hareketTuru)) {
    return lastHareket.konum;
  }
  
  return null;
};

/**
 * Kondisyon label'ını döndürür
 * @param {string} kondisyon - Kondisyon değeri
 * @returns {string} - Kondisyon label'ı
 */
export const getKondisyonLabel = (kondisyon) => {
  const kondisyonMap = {
    'Saglam': 'Sağlam',
    'Arizali': 'Arızalı', 
    'Hurda': 'Hurda'
  };
  
  return kondisyonMap[kondisyon] || kondisyon || 'Bilinmiyor';
};

/**
 * Hareket türü label'ını döndürür
 * @param {string} hareketTuru - Hareket türü değeri
 * @returns {string} - Hareket türü label'ı
 */
export const getHareketTuruLabel = (hareketTuru) => {
  return HAREKET_TURLERI[hareketTuru]?.label || hareketTuru || 'Bilinmiyor';
};

/**
 * Form validation kuralları
 * @param {string} hareketTuru - Hareket türü
 * @param {Object} formData - Form verileri
 * @returns {Object} - Validation hataları
 */
export const validateHareketForm = (hareketTuru, formData) => {
  const errors = {};
  const hareketConfig = HAREKET_TURLERI[hareketTuru];
  
  if (!hareketConfig) {
    errors.hareketTuru = 'Geçersiz hareket türü';
    return errors;
  }
  
  // Zorunlu alanları kontrol et
  hareketConfig.requiredFields.forEach(field => {
    if (!formData[field]) {
      const fieldLabels = {
        'hedefPersonelId': 'Hedef Personel',
        'kaynakPersonelId': 'Kaynak Personel',
        'konumId': 'Konum',
        'malzemeKondisyonu': 'Malzeme Kondisyonu',
        'aciklama': 'Açıklama'
      };
      errors[field] = `${fieldLabels[field] || field} zorunludur`;
    }
  });
  
  // Özel validasyonlar
  if (hareketTuru === 'Devir' && formData.kaynakPersonelId === formData.hedefPersonelId) {
    errors.hedefPersonelId = 'Kaynak ve hedef personel aynı olamaz';
  }
  
  return errors;
};