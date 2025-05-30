// client/src/app/malzemeHareket/constants/schema.js - Basitleştirilmiş versiyon
import { z } from 'zod';

// Hareket türü enum'ı
export const HareketTuruEnum = z.enum(['Zimmet', 'Iade', 'Kayit', 'Devir', 'Kayip', 'KondisyonGuncelleme', 'DepoTransferi', 'Dusum']);

// Malzeme kondisyonu enum'ı
export const MalzemeKondisyonuEnum = z.enum(['Saglam', 'Arizali', 'Hurda']);

// --- Basitleştirilmiş Oluşturma Şeması ---
export const MalzemeHareket_CreateSchema = z.object({
  islemTarihi: z
    .string()
    .min(1, 'İşlem tarihi zorunludur.')
    .transform(str => {
      // YYYY-MM-DD formatını ISO string'e çevir
      if (str.includes('T')) {
        return str; // Zaten ISO format
      }
      return new Date(str + 'T12:00:00.000Z').toISOString();
    }),
  hareketTuru: HareketTuruEnum,
  malzemeKondisyonu: MalzemeKondisyonuEnum.default('Saglam'),
  malzemeId: z.string().min(1, 'Malzeme seçimi zorunludur.'),
  kaynakPersonelId: z.string().optional().nullable(),
  hedefPersonelId: z.string().optional().nullable(),
  konumId: z.string().optional().nullable(),
  aciklama: z.string().optional().nullable(),
});

// --- Güncelleme Şeması ---
export const MalzemeHareket_UpdateSchema = z
  .object({
    aciklama: z.string().optional().nullable(),
  })
  .partial();

// --- Form Girdi Şeması ---
export const MalzemeHareket_FormInputSchema = MalzemeHareket_CreateSchema;

// --- Helper Functions ---
export const getHareketTuruDisplayName = hareketTuru => {
  const names = {
    Zimmet: 'Zimmet Ver',
    Iade: 'İade Al',
    Kayit: 'Kayıt',
    Devir: 'Devir Et',
    Kayip: 'Kayıp Bildir',
    KondisyonGuncelleme: 'Kondisyon Güncelle',
    DepoTransferi: 'Depo Transfer',
    Dusum: 'Düşüm Yap',
  };

  return names[hareketTuru] || hareketTuru;
};

export const getMalzemeKondisyonuDisplayName = kondisyon => {
  const names = {
    Saglam: 'Sağlam',
    Arizali: 'Arızalı',
    Hurda: 'Hurda',
  };

  return names[kondisyon] || kondisyon;
};

// --- Options for UI (e.g., Select components) ---
export const HareketTuruOptions = HareketTuruEnum.options.map(value => ({
  value: value,
  label: getHareketTuruDisplayName(value),
}));

export const KondisyonOptions = MalzemeKondisyonuEnum.options.map(value => ({
  value: value,
  label: getMalzemeKondisyonuDisplayName(value),
}));

// --- Hareket Türü Validation (Basitleştirilmiş) ---
export const validateHareketTuruRequirements = (hareketTuru, data) => {
  const requirements = {
    Zimmet: ['hedefPersonelId'],
    Iade: ['kaynakPersonelId'],
    Devir: ['kaynakPersonelId', 'hedefPersonelId'],
    Kayip: ['kaynakPersonelId', 'aciklama'],
    DepoTransferi: ['konumId'],
    Dusum: ['aciklama'],
    Kayit: [], // Kayıt için özel gereksinim yok
    KondisyonGuncelleme: ['malzemeKondisyonu'],
  };

  const required = requirements[hareketTuru] || [];
  const missing = required.filter(field => !data[field] || data[field].trim() === '');

  return {
    isValid: missing.length === 0,
    missingFields: missing,
    requiredFields: required,
  };
};

// --- Form Field Visibility Rules (Basitleştirilmiş) ---
export const getFieldVisibilityRules = hareketTuru => {
  const rules = {
    Zimmet: {
      show: ['malzemeId', 'hareketTuru', 'hedefPersonelId', 'malzemeKondisyonu', 'islemTarihi', 'aciklama'],
      required: ['malzemeId', 'hareketTuru', 'hedefPersonelId', 'islemTarihi'],
    },
    Iade: {
      show: ['malzemeId', 'hareketTuru', 'kaynakPersonelId', 'malzemeKondisyonu', 'islemTarihi', 'aciklama'],
      required: ['malzemeId', 'hareketTuru', 'kaynakPersonelId', 'islemTarihi'],
    },
    Devir: {
      show: ['malzemeId', 'hareketTuru', 'kaynakPersonelId', 'hedefPersonelId', 'malzemeKondisyonu', 'islemTarihi', 'aciklama'],
      required: ['malzemeId', 'hareketTuru', 'kaynakPersonelId', 'hedefPersonelId', 'islemTarihi'],
    },
    Kayip: {
      show: ['malzemeId', 'hareketTuru', 'kaynakPersonelId', 'malzemeKondisyonu', 'islemTarihi', 'aciklama'],
      required: ['malzemeId', 'hareketTuru', 'kaynakPersonelId', 'islemTarihi', 'aciklama'],
    },
    DepoTransferi: {
      show: ['malzemeId', 'hareketTuru', 'konumId', 'malzemeKondisyonu', 'islemTarihi', 'aciklama'],
      required: ['malzemeId', 'hareketTuru', 'konumId', 'islemTarihi'],
    },
    Dusum: {
      show: ['malzemeId', 'hareketTuru', 'malzemeKondisyonu', 'islemTarihi', 'aciklama'],
      required: ['malzemeId', 'hareketTuru', 'islemTarihi', 'aciklama'],
    },
    Kayit: {
      show: ['malzemeId', 'hareketTuru', 'konumId', 'malzemeKondisyonu', 'islemTarihi', 'aciklama'],
      required: ['malzemeId', 'hareketTuru', 'islemTarihi'],
    },
    KondisyonGuncelleme: {
      show: ['malzemeId', 'hareketTuru', 'malzemeKondisyonu', 'islemTarihi', 'aciklama'],
      required: ['malzemeId', 'hareketTuru', 'malzemeKondisyonu', 'islemTarihi'],
    },
  };

  return rules[hareketTuru] || { show: [], required: [] };
};

export const zimmetFormSchema = z.object({
  hedefPersonelId: z.string({
    required_error: 'Lütfen bir personel seçin.',
  }),
  islemTarihi: z.date({
    required_error: 'İşlem tarihi gereklidir.',
  }),
  malzemeKondisyonu: z.enum(Object.values(MalzemeKondisyonuEnum), {
    // z.nativeEnum yerine z.enum
    required_error: 'Lütfen malzeme kondisyonunu seçin.',
  }),
  aciklama: z.string().max(500, 'Açıklama en fazla 500 karakter olabilir.').optional(),
});
