// client/src/app/malzeme/helpers/hareketBusinessLogic.js - DÜZELTME
export const HAREKET_TURLERI = {
  Kayit: {
    label: 'Kayıt',
    description: 'Malzemenin sisteme kayıt edildiğinde ilk hareketidir.',
    icon: 'PackageIcon',
    color: 'emerald',
    requiredFields: ['konumId'],
    optionalFields: ['aciklama'],
    fieldRules: {
      kaynakPersonelId: null,
      hedefPersonelId: null,
      konumId: 'required', // Malzemenin koyulduğu konum
    },
    businessRules: {
      preConditions: [],
      postConditions: ['malzemeDepoda'],
    },
    description_detailed: 'Malzeme sisteme kayıt edilir ve belirtilen konuma yerleştirilir.',
  },

  Zimmet: {
    label: 'Zimmet Ver',
    description: 'Depodan personele verilen malzeme hareketi',
    icon: 'UserIcon',
    color: 'blue',
    requiredFields: ['hedefPersonelId'],
    optionalFields: ['aciklama'],
    fieldRules: {
      kaynakPersonelId: null,
      hedefPersonelId: 'required',
      konumId: null, // Kişiye verilen malzemenin konumu önemli değil
    },
    businessRules: {
      preConditions: ['malzemeDepoda', 'kondisyonSaglam'],
      postConditions: ['malzemePersonelde'],
    },
    description_detailed: 'Depoda bulunan sağlam malzeme personele zimmetlenir.',
  },

  Iade: {
    label: 'İade Al',
    description: 'Personelden depoya çekilen malzeme hareketi',
    icon: 'ArrowLeftIcon',
    color: 'green',
    requiredFields: ['kaynakPersonelId', 'konumId'],
    optionalFields: ['aciklama', 'malzemeKondisyonu'],
    fieldRules: {
      kaynakPersonelId: 'required', // Malzemenin teslim alındığı personel
      hedefPersonelId: null, // Depoya çekiliyor
      konumId: 'required', // İade alınan malzemenin koyulduğu konum
    },
    businessRules: {
      preConditions: ['malzemePersonelde'],
      postConditions: ['malzemeDepoda'],
    },
    description_detailed: 'Personelde zimmetli malzeme iade alınır ve depoya yerleştirilir.',
  },

  Devir: {
    label: 'Devir Et',
    description: 'Personelden personele aktarılan malzeme hareketi',
    icon: 'ArrowRightIcon',
    color: 'orange',
    requiredFields: ['kaynakPersonelId', 'hedefPersonelId'],
    optionalFields: ['aciklama'],
    fieldRules: {
      kaynakPersonelId: 'required', // Malzeme kimden çıkıyor
      hedefPersonelId: 'required', // Malzeme kime gidiyor
      konumId: null, // Personelde olan malzemenin konumu önemli değil
    },
    businessRules: {
      preConditions: ['malzemePersonelde'],
      postConditions: ['malzemePersonelde'],
      additionalRules: ['farkliPersonel'], // Kaynak ve hedef farklı olmalı
    },
    description_detailed: 'Bir personeldeki malzeme başka personele devredilir.',
  },

  DepoTransferi: {
    label: 'Depo Transfer',
    description: 'Depodan depoya aktarılan malzeme hareketi',
    icon: 'TruckIcon',
    color: 'indigo',
    requiredFields: ['konumId'],
    optionalFields: ['aciklama'],
    fieldRules: {
      kaynakPersonelId: null,
      hedefPersonelId: null,
      konumId: 'required', // Hedef konum
    },
    businessRules: {
      preConditions: ['malzemeDepoda'],
      postConditions: ['malzemeDepoda'],
      additionalRules: ['farkliKonum'], // Mevcut ve hedef konum farklı olmalı
    },
    description_detailed: 'Depodaki malzeme farklı bir konuma transfer edilir.',
  },

  KondisyonGuncelleme: {
    label: 'Kondisyon Güncelle',
    description: 'Malzemenin kondisyon durumunu gösteren hareket',
    icon: 'RefreshCwIcon',
    color: 'purple',
    requiredFields: ['malzemeKondisyonu'],
    optionalFields: ['aciklama'],
    fieldRules: {
      kaynakPersonelId: 'preserve', // Son personel kaydı değişmeyecek
      hedefPersonelId: 'preserve', // Son personel kaydı değişmeyecek
      konumId: 'preserve', // Son konum kaydı değişmeyecek
    },
    businessRules: {
      preConditions: [],
      postConditions: ['konumKorunur'], // Mevcut konum durumu korunur
    },
    description_detailed: 'Sadece malzemenin fiziksel kondisyonu güncellenir, konum değişmez.',
  },

  Kayip: {
    label: 'Kayıp Bildir',
    description: 'Malzemenin kayıp olduğunu gösteren hareket',
    icon: 'AlertTriangleIcon',
    color: 'red',
    requiredFields: ['aciklama'],
    optionalFields: [],
    fieldRules: {
      kaynakPersonelId: null,
      hedefPersonelId: null,
      konumId: null,
    },
    businessRules: {
      preConditions: [],
      postConditions: ['malzemeYok'],
    },
    description_detailed: 'Malzeme kayıp olarak işaretlenir, konum bilgisi silinir.',
  },

  Dusum: {
    label: 'Düşüm Yap',
    description: 'Malzemenin sistemden düşümünü gösteren hareket',
    icon: 'TrendingDownIcon',
    color: 'gray',
    requiredFields: ['aciklama'],
    optionalFields: [],
    fieldRules: {
      kaynakPersonelId: null,
      hedefPersonelId: null,
      konumId: null,
    },
    businessRules: {
      preConditions: ['malzemeDepoda', 'kondisyonArizaliVeyaHurda'],
      postConditions: ['malzemeYok'],
    },
    description_detailed: 'Arızalı veya hurda malzeme sistemden düşürülür.',
  },
};

/**
 * Malzemenin mevcut durumunu analiz eden fonksiyon
 */
export const analyzeMalzemeDurumu = malzeme => {
  if (!malzeme || !malzeme.malzemeHareketleri || malzeme.malzemeHareketleri.length === 0) {
    return {
      malzemePersonelde: false,
      malzemeDepoda: false,
      malzemeKonumsuz: true,
      malzemeYok: false,
      sonHareket: null,
      mevcentKondisyon: 'Saglam',
      zimmetliPersonel: null,
      mevcentKonum: null,
      isFirstMovement: true,
    };
  }

  const sonHareket = malzeme.malzemeHareketleri[0]; // En son hareket
  const hareketTuru = sonHareket.hareketTuru;

  // Durum analizi
  const malzemePersonelde = ['Zimmet', 'Devir'].includes(hareketTuru);
  const malzemeDepoda = ['Kayit', 'Iade', 'DepoTransferi'].includes(hareketTuru);
  const malzemeKonumsuz = ['KondisyonGuncelleme'].includes(hareketTuru);
  const malzemeYok = ['Kayip', 'Dusum'].includes(hareketTuru);

  return {
    malzemePersonelde,
    malzemeDepoda,
    malzemeKonumsuz,
    malzemeYok,
    sonHareket,
    mevcentKondisyon: sonHareket.malzemeKondisyonu || 'Saglam',
    zimmetliPersonel: malzemePersonelde ? sonHareket.hedefPersonel : null,
    mevcentKonum: malzemeDepoda ? sonHareket.konum : null,
    isFirstMovement: false,
  };
};

/**
 * Malzemenin mevcut durumuna göre yapılabilecek hareket türlerini döndürür
 */
export const getAvailableHareketTurleri = malzeme => {
  if (!malzeme) return [];

  const durum = analyzeMalzemeDurumu(malzeme);
  const availableHareketler = [];

  Object.entries(HAREKET_TURLERI).forEach(([key, hareketTuru]) => {
    let canPerform = true;
    const preConditions = hareketTuru.businessRules.preConditions;

    // Ön koşulları kontrol et
    preConditions.forEach(condition => {
      switch (condition) {
        case 'malzemePersonelde':
          if (!durum.malzemePersonelde) canPerform = false;
          break;
        case 'malzemeDepoda':
          if (!durum.malzemeDepoda) canPerform = false;
          break;
        case 'kondisyonSaglam':
          if (durum.mevcentKondisyon !== 'Saglam') canPerform = false;
          break;
        case 'kondisyonArizaliVeyaHurda':
          if (!['Arizali', 'Hurda'].includes(durum.mevcentKondisyon)) canPerform = false;
          break;
      }
    });

    // Özel kuralları kontrol et
    if (hareketTuru.businessRules.additionalRules) {
      hareketTuru.businessRules.additionalRules.forEach(rule => {
        switch (rule) {
          case 'farkliPersonel':
            // Bu kontrol form seviyesinde yapılacak
            break;
          case 'farkliKonum':
            // Bu kontrol form seviyesinde yapılacak
            break;
        }
      });
    }

    // Kayıt işlemi sadece hiç hareket kaydı olmayan malzemeler için
    if (key === 'Kayit' && !durum.isFirstMovement) {
      canPerform = false;
    }

    // Malzeme yoksa hiçbir işlem yapılamaz
    if (durum.malzemeYok && key !== 'KondisyonGuncelleme') {
      canPerform = false;
    }

    if (canPerform) {
      availableHareketler.push({
        key,
        ...hareketTuru,
        currentInfo: durum,
      });
    }
  });

  return availableHareketler;
};

/**
 * Hareket türü için form field'larının görünürlük kuralları
 */
export const getFieldVisibilityRules = hareketTuru => {
  const hareket = HAREKET_TURLERI[hareketTuru];
  if (!hareket) return { show: [], required: [], hidden: [] };

  const allFields = ['malzemeId', 'hareketTuru', 'islemTarihi', 'malzemeKondisyonu', 'kaynakPersonelId', 'hedefPersonelId', 'konumId', 'aciklama'];

  const show = ['malzemeId', 'hareketTuru', 'islemTarihi', 'malzemeKondisyonu'];
  const required = ['malzemeId', 'hareketTuru', 'islemTarihi'];
  const hidden = [];

  // Required field'ları ekle
  hareket.requiredFields.forEach(field => {
    if (!show.includes(field)) show.push(field);
    if (!required.includes(field)) required.push(field);
  });

  // Optional field'ları ekle
  hareket.optionalFields.forEach(field => {
    if (!show.includes(field)) show.push(field);
  });

  // Field rules'a göre hidden field'ları belirle
  Object.entries(hareket.fieldRules).forEach(([field, rule]) => {
    if (rule === null) {
      hidden.push(field);
      // show array'inden kaldır
      const index = show.indexOf(field);
      if (index > -1) show.splice(index, 1);
      // required array'inden kaldır
      const reqIndex = required.indexOf(field);
      if (reqIndex > -1) required.splice(reqIndex, 1);
    }
  });

  return { show, required, hidden };
};

/**
 * Hareket türü için ön doldurulacak form verilerini döndürür
 * DÜZELTME: Güvenli null check'ler eklendi
 */
export const getPrefilledFormData = (hareketTuru, malzeme, currentDurum) => {
  const hareket = HAREKET_TURLERI[hareketTuru];
  if (!hareket) return {};

  // Güvenli varsayılan değerler
  const safeCurrentDurum = currentDurum || {
    mevcentKondisyon: 'Saglam',
    zimmetliPersonel: null,
    mevcentKonum: null,
  };

  const formData = {
    hareketTuru,
    malzemeId: malzeme?.id || '', // Güvenli null check
    islemTarihi: new Date().toISOString().split('T')[0],
    malzemeKondisyonu: safeCurrentDurum.mevcentKondisyon || 'Saglam',
  };

  // Field rules'a göre preserve edilen değerleri doldur
  Object.entries(hareket.fieldRules).forEach(([field, rule]) => {
    if (rule === 'preserve') {
      switch (field) {
        case 'kaynakPersonelId':
          if (safeCurrentDurum.zimmetliPersonel?.id) {
            formData.kaynakPersonelId = safeCurrentDurum.zimmetliPersonel.id;
          }
          break;
        case 'hedefPersonelId':
          if (safeCurrentDurum.zimmetliPersonel?.id) {
            formData.hedefPersonelId = safeCurrentDurum.zimmetliPersonel.id;
          }
          break;
        case 'konumId':
          if (safeCurrentDurum.mevcentKonum?.id) {
            formData.konumId = safeCurrentDurum.mevcentKonum.id;
          }
          break;
      }
    }
  });

  // Özel durum doldurmaları
  if (hareketTuru === 'Iade' && safeCurrentDurum.zimmetliPersonel?.id) {
    formData.kaynakPersonelId = safeCurrentDurum.zimmetliPersonel.id;
  }

  if (hareketTuru === 'Devir' && safeCurrentDurum.zimmetliPersonel?.id) {
    formData.kaynakPersonelId = safeCurrentDurum.zimmetliPersonel.id;
  }

  return formData;
};

/**
 * Form validasyon kuralları
 */
export const validateHareketForm = (hareketTuru, formData, currentDurum) => {
  const errors = {};
  const hareket = HAREKET_TURLERI[hareketTuru];

  if (!hareket) {
    errors.hareketTuru = 'Geçersiz hareket türü';
    return errors;
  }

  // Güvenli currentDurum kontrolü
  const safeCurrentDurum = currentDurum || {};

  // Zorunlu alanları kontrol et
  hareket.requiredFields.forEach(field => {
    if (!formData[field] || (typeof formData[field] === 'string' && formData[field].trim() === '')) {
      const fieldLabels = {
        hedefPersonelId: 'Hedef Personel',
        kaynakPersonelId: 'Kaynak Personel',
        konumId: 'Konum',
        malzemeKondisyonu: 'Malzeme Kondisyonu',
        aciklama: 'Açıklama',
      };
      errors[field] = `${fieldLabels[field] || field} zorunludur`;
    }
  });

  // Özel validasyonlar
  if (hareketTuru === 'Devir' && formData.kaynakPersonelId === formData.hedefPersonelId) {
    errors.hedefPersonelId = 'Kaynak ve hedef personel aynı olamaz';
  }

  if (hareketTuru === 'DepoTransferi' && formData.konumId === safeCurrentDurum.mevcentKonum?.id) {
    errors.konumId = 'Hedef konum mevcut konumdan farklı olmalıdır';
  }

  return errors;
};

/**
 * Hareket türü label'ını döndürür
 */
export const getHareketTuruLabel = hareketTuru => {
  return HAREKET_TURLERI[hareketTuru]?.label || hareketTuru || 'Bilinmiyor';
};

/**
 * Hareket türü açıklamasını döndürür
 */
export const getHareketTuruDescription = hareketTuru => {
  return HAREKET_TURLERI[hareketTuru]?.description_detailed || 'Açıklama mevcut değil';
};
