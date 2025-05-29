// app/malzemeHareket/constants/schema.js
import { z } from 'zod';

// Hareket türü enum'ı
export const HareketTuruEnum = z.enum([ // Added export
  'Zimmet',
  'Iade',
  'Kayit',
  'Devir',
  'Kayip',
  'KondisyonGuncelleme',
  'DepoTransferi',
  'Dusum'
]);

// Malzeme kondisyonu enum'ı
export const MalzemeKondisyonuEnum = z.enum([ // Added export
  'Saglam',
  'Arizali',
  'Hurda'
]);

// Personel için temel şema
export const Personel_BaseSchema_for_MalzemeHareket_Relation = z.object({
  id: z.string().min(1, 'Geçersiz Personel ID.'),
  ad: z.string().optional().nullable(),
  sicil: z.string().optional().nullable(),
  avatar: z.string().optional().nullable(),
});

// Malzeme için temel şema
export const Malzeme_BaseSchema_for_MalzemeHareket_Relation = z.object({
  id: z.string().min(1, 'Geçersiz Malzeme ID.'),
  vidaNo: z.string().optional().nullable(),
  sabitKodu: z.object({
    id: z.string(),
    ad: z.string()
  }).optional().nullable(),
  marka: z.object({
    id: z.string(),
    ad: z.string()
  }).optional().nullable(),
  model: z.object({
    id: z.string(),
    ad: z.string()
  }).optional().nullable(),
});

// Konum için temel şema
export const Konum_BaseSchema_for_MalzemeHareket_Relation = z.object({
  id: z.string().min(1, 'Geçersiz Konum ID.'),
  ad: z.string().min(1, { message: 'İlişkili Konum adı boş olamaz.' }),
  depo: z.object({
    id: z.string(),
    ad: z.string()
  }).optional().nullable(),
});

// --- Ana MalzemeHareket Şeması ---
export const MalzemeHareket_Schema = z.object({
  id: z.string().min(1, 'Geçersiz MalzemeHareket ID formatı.'),
  islemTarihi: z.date().or(z.string().datetime()),
  hareketTuru: HareketTuruEnum,
  malzemeKondisyonu: MalzemeKondisyonuEnum,
  malzemeId: z.string().min(1, 'Malzeme ID zorunludur.'),
  kaynakPersonelId: z.string().optional().nullable(),
  hedefPersonelId: z.string().optional().nullable(),
  konumId: z.string().optional().nullable(),
  aciklama: z.string().optional().nullable(),

  // İlişkili veriler
  malzeme: Malzeme_BaseSchema_for_MalzemeHareket_Relation.optional(),
  kaynakPersonel: Personel_BaseSchema_for_MalzemeHareket_Relation.optional().nullable(),
  hedefPersonel: Personel_BaseSchema_for_MalzemeHareket_Relation.optional().nullable(),
  konum: Konum_BaseSchema_for_MalzemeHareket_Relation.optional().nullable(),

  status: z.string().optional().default('Aktif'),
  createdAt: z.date().or(z.string().datetime()).optional(),
  createdById: z.string(),
  createdBy: Personel_BaseSchema_for_MalzemeHareket_Relation.optional().nullable(),
});

// --- Oluşturma Şeması ---
export const MalzemeHareket_CreateSchema = z.object({
  islemTarihi: z.string().or(z.date())
    .transform((date) => {
      if (typeof date === 'string') {
        // YYYY-MM-DD formatını kontrol et ve dönüştür
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
          throw new Error('Geçersiz tarih formatı');
        }
        return parsedDate.toISOString();
      }
      return date.toISOString();
    }),
  hareketTuru: HareketTuruEnum,
  malzemeKondisyonu: MalzemeKondisyonuEnum.default('Saglam'),
  malzemeId: z.string({ required_error: 'Malzeme seçimi zorunludur.' })
    .min(1, { message: 'Geçerli bir malzeme seçiniz.' }),
  kaynakPersonelId: z.string().optional().nullable(),
  hedefPersonelId: z.string().optional().nullable(),
  konumId: z.string().optional().nullable(),
  aciklama: z.string().optional().nullable(),
})
.refine((data) => {
  // Hareket türüne göre özel validasyonlar
  switch (data.hareketTuru) {
    case 'Zimmet':
      return !!data.hedefPersonelId;
    case 'Iade':
      return !!data.kaynakPersonelId;
    case 'Devir':
      return !!(data.kaynakPersonelId && data.hedefPersonelId && data.kaynakPersonelId !== data.hedefPersonelId);
    case 'Kayip':
      return !!(data.kaynakPersonelId && data.aciklama);
    case 'DepoTransferi':
      return !!data.konumId;
    case 'Dusum':
      return !!data.aciklama;
    default:
      return true;
  }
}, {
  message: 'Seçilen hareket türü için gerekli alanlar eksik',
  path: ['hareketTuru']
});

// --- Güncelleme Şeması ---
export const MalzemeHareket_UpdateSchema = z.object({
  islemTarihi: z.string().or(z.date()).optional()
    .transform((date) => {
      if (!date) return undefined;
      if (typeof date === 'string') {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
          throw new Error('Geçersiz tarih formatı');
        }
        return parsedDate.toISOString();
      }
      return date.toISOString();
    }),
  hareketTuru: HareketTuruEnum.optional(),
  malzemeKondisyonu: MalzemeKondisyonuEnum.optional(),
  malzemeId: z.string().min(1, { message: 'Geçerli bir malzeme seçiniz.' }).optional(),
  kaynakPersonelId: z.string().optional().nullable(),
  hedefPersonelId: z.string().optional().nullable(),
  konumId: z.string().optional().nullable(),
  aciklama: z.string().optional().nullable(),
}).partial();

// --- Form Girdi Şeması ---
export const MalzemeHareket_FormInputSchema = z.object({
  islemTarihi: z.string({ required_error: 'İşlem tarihi zorunludur.' })
    .min(1, { message: 'İşlem tarihi boş olamaz.' }),
  hareketTuru: HareketTuruEnum,
  malzemeKondisyonu: MalzemeKondisyonuEnum.default('Saglam'),
  malzemeId: z.string({ required_error: 'Malzeme seçimi zorunludur.' })
    .min(1, { message: 'Geçerli bir malzeme seçiniz.' }),
  kaynakPersonelId: z.string().optional().nullable(),
  hedefPersonelId: z.string().optional().nullable(),
  konumId: z.string().optional().nullable(),
  aciklama: z.string().optional().nullable(),
})
.refine((data) => {
  // Hareket türüne göre dinamik validasyonlar
  const errors = [];

  switch (data.hareketTuru) {
    case 'Zimmet':
      if (!data.hedefPersonelId) {
        errors.push({ path: ['hedefPersonelId'], message: 'Zimmet işlemi için hedef personel seçimi zorunludur.' });
      }
      break;

    case 'Iade':
      if (!data.kaynakPersonelId) {
        errors.push({ path: ['kaynakPersonelId'], message: 'İade işlemi için kaynak personel seçimi zorunludur.' });
      }
      break;

    case 'Devir':
      if (!data.kaynakPersonelId) {
        errors.push({ path: ['kaynakPersonelId'], message: 'Devir işlemi için kaynak personel seçimi zorunludur.' });
      }
      if (!data.hedefPersonelId) {
        errors.push({ path: ['hedefPersonelId'], message: 'Devir işlemi için hedef personel seçimi zorunludur.' });
      }
      if (data.kaynakPersonelId === data.hedefPersonelId) {
        errors.push({ path: ['hedefPersonelId'], message: 'Kaynak ve hedef personel aynı olamaz.' });
      }
      break;

    case 'Kayip':
      if (!data.kaynakPersonelId) {
        errors.push({ path: ['kaynakPersonelId'], message: 'Kayıp bildirimi için kaynak personel seçimi zorunludur.' });
      }
      if (!data.aciklama || data.aciklama.trim().length === 0) {
        errors.push({ path: ['aciklama'], message: 'Kayıp bildirimi için açıklama zorunludur.' });
      }
      break;

    case 'DepoTransferi':
      if (!data.konumId) {
        errors.push({ path: ['konumId'], message: 'Depo transferi için konum seçimi zorunludur.' });
      }
      break;

    case 'Dusum':
      if (!data.aciklama || data.aciklama.trim().length === 0) {
        errors.push({ path: ['aciklama'], message: 'Düşüm işlemi için açıklama zorunludur.' });
      }
      break;

    case 'Kayit':
      if (!data.konumId) {
        errors.push({ path: ['konumId'], message: 'Kayıt işlemi için konum seçimi zorunludur.' });
      }
      break;
  }

  return errors.length === 0;
}, {
  message: 'Seçilen hareket türü için gerekli alanlar tamamlanmamış.',
});

// --- Kondisyon Güncelleme Özel Şeması ---
export const MalzemeHareket_KondisyonGuncellemeSchema = z.object({
  malzemeId: z.string({ required_error: 'Malzeme ID zorunludur.' })
    .min(1, { message: 'Geçerli bir malzeme seçiniz.' }),
  malzemeKondisyonu: MalzemeKondisyonuEnum,
  islemTarihi: z.string({ required_error: 'İşlem tarihi zorunludur.' })
    .min(1, { message: 'İşlem tarihi boş olamaz.' }),
  aciklama: z.string()
    .optional()
    .nullable()
    .default('Kondisyon güncelleme işlemi'),
});


// --- Helper Functions ---
export const getHareketTuruDisplayName = (hareketTuru) => {
  const names = {
    'Zimmet': 'Zimmet Ver',
    'Iade': 'İade Al',
    'Kayit': 'Kayıt',
    'Devir': 'Devir Et',
    'Kayip': 'Kayıp Bildir',
    'KondisyonGuncelleme': 'Kondisyon Güncelle',
    'DepoTransferi': 'Depo Transfer',
    'Dusum': 'Düşüm Yap'
  };

  return names[hareketTuru] || hareketTuru;
};

export const getMalzemeKondisyonuDisplayName = (kondisyon) => {
  const names = {
    'Saglam': 'Sağlam',
    'Arizali': 'Arızalı',
    'Hurda': 'Hurda'
  };

  return names[kondisyon] || kondisyon;
};

// --- Options for UI (e.g., Select components) ---
export const HareketTuruOptions = HareketTuruEnum.options.map(value => ({
  value: value,
  label: getHareketTuruDisplayName(value)
}));

export const KondisyonOptions = MalzemeKondisyonuEnum.options.map(value => ({
  value: value,
  label: getMalzemeKondisyonuDisplayName(value)
}));


// --- Hareket Türü Validation Fonksiyonları ---
export const validateHareketTuruRequirements = (hareketTuru, data) => {
  const requirements = {
    Zimmet: ['hedefPersonelId'],
    Iade: ['kaynakPersonelId'],
    Devir: ['kaynakPersonelId', 'hedefPersonelId'],
    Kayip: ['kaynakPersonelId', 'aciklama'],
    DepoTransferi: ['konumId'],
    Dusum: ['aciklama'],
    Kayit: ['konumId'],
    KondisyonGuncelleme: ['malzemeKondisyonu']
  };

  const required = requirements[hareketTuru] || [];
  const missing = required.filter(field => !data[field]);

  return {
    isValid: missing.length === 0,
    missingFields: missing,
    requiredFields: required
  };
};


// --- Form Field Visibility Rules ---
export const getFieldVisibilityRules = (hareketTuru) => {
  const rules = {
    Zimmet: {
      show: ['malzemeId', 'hareketTuru', 'hedefPersonelId', 'malzemeKondisyonu', 'islemTarihi', 'aciklama'],
      required: ['malzemeId', 'hareketTuru', 'hedefPersonelId', 'islemTarihi']
    },
    Iade: {
      show: ['malzemeId', 'hareketTuru', 'kaynakPersonelId', 'malzemeKondisyonu', 'islemTarihi', 'aciklama'],
      required: ['malzemeId', 'hareketTuru', 'kaynakPersonelId', 'islemTarihi']
    },
    Devir: {
      show: ['malzemeId', 'hareketTuru', 'kaynakPersonelId', 'hedefPersonelId', 'malzemeKondisyonu', 'islemTarihi', 'aciklama'],
      required: ['malzemeId', 'hareketTuru', 'kaynakPersonelId', 'hedefPersonelId', 'islemTarihi']
    },
    Kayip: {
      show: ['malzemeId', 'hareketTuru', 'kaynakPersonelId', 'malzemeKondisyonu', 'islemTarihi', 'aciklama'],
      required: ['malzemeId', 'hareketTuru', 'kaynakPersonelId', 'islemTarihi', 'aciklama']
    },
    DepoTransferi: {
      show: ['malzemeId', 'hareketTuru', 'konumId', 'malzemeKondisyonu', 'islemTarihi', 'aciklama'],
      required: ['malzemeId', 'hareketTuru', 'konumId', 'islemTarihi']
    },
    Dusum: {
      show: ['malzemeId', 'hareketTuru', 'malzemeKondisyonu', 'islemTarihi', 'aciklama'],
      required: ['malzemeId', 'hareketTuru', 'islemTarihi', 'aciklama']
    },
    Kayit: {
      show: ['malzemeId', 'hareketTuru', 'konumId', 'malzemeKondisyonu', 'islemTarihi', 'aciklama'],
      required: ['malzemeId', 'hareketTuru', 'konumId', 'islemTarihi']
    },
    KondisyonGuncelleme: {
      show: ['malzemeId', 'hareketTuru', 'malzemeKondisyonu', 'islemTarihi', 'aciklama'],
      required: ['malzemeId', 'hareketTuru', 'malzemeKondisyonu', 'islemTarihi']
    }
  };

  return rules[hareketTuru] || { show: [], required: [] };
};