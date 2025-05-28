import { z } from 'zod';

// Personel için temel şema
export const Personel_BaseSchema_for_Malzeme_Relation = z.object({
  id: z.string().min(1, 'Geçersiz Personel ID.'),
  ad: z.string().optional().nullable(),
  sicil: z.string().optional().nullable(),
});

// Birim için temel şema
export const Birim_BaseSchema_for_Malzeme_Relation = z.object({
  id: z.string().min(1, 'Geçersiz Birim ID.'),
  ad: z.string().min(1, { message: 'İlişkili Birim adı boş olamaz.' }),
});

// Şube için temel şema
export const Sube_BaseSchema_for_Malzeme_Relation = z.object({
  id: z.string().min(1, 'Geçersiz Şube ID.'),
  ad: z.string().min(1, { message: 'İlişkili Şube adı boş olamaz.' }),
});

// Sabit Kodu için temel şema
export const SabitKodu_BaseSchema_for_Malzeme_Relation = z.object({
  id: z.string().min(1, 'Geçersiz Sabit Kodu ID.'),
  ad: z.string().min(1, { message: 'İlişkili Sabit Kodu adı boş olamaz.' }),
});

// Marka için temel şema
export const Marka_BaseSchema_for_Malzeme_Relation = z.object({
  id: z.string().min(1, 'Geçersiz Marka ID.'),
  ad: z.string().min(1, { message: 'İlişkili Marka adı boş olamaz.' }),
});

// Model için temel şema
export const Model_BaseSchema_for_Malzeme_Relation = z.object({
  id: z.string().min(1, 'Geçersiz Model ID.'),
  ad: z.string().min(1, { message: 'İlişkili Model adı boş olamaz.' }),
});

// Malzeme Hareket için temel şema
export const MalzemeHareket_BaseSchema_for_Malzeme_Relation = z.object({
  id: z.string().min(1, 'Geçersiz Malzeme Hareket ID.'),
  hareketTuru: z.string().optional().nullable(),
  islemTarihi: z.string().optional().nullable(),
});

// --- Ana Malzeme Şeması ---
export const Malzeme_Schema = z.object({
  id: z.string().min(1, 'Geçersiz Malzeme ID formatı.'),
  vidaNo: z.string().optional().nullable(),
  kayitTarihi: z.date().optional().nullable(),
  malzemeTipi: z.enum(['Demirbas', 'Sarf'], { message: 'Malzeme tipi Demirbaş veya Sarf olmalıdır.' }),
  birimId: z.string().min(1, { message: 'Birim seçimi zorunludur.' }),
  subeId: z.string().min(1, { message: 'Şube seçimi zorunludur.' }),
  sabitKoduId: z.string().min(1, { message: 'Sabit Kodu seçimi zorunludur.' }),
  markaId: z.string().min(1, { message: 'Marka seçimi zorunludur.' }),
  modelId: z.string().min(1, { message: 'Model seçimi zorunludur.' }),
  kod: z.string().optional().nullable(),
  bademSeriNo: z.string().optional().nullable(),
  etmysSeriNo: z.string().optional().nullable(),
  stokDemirbasNo: z.string().optional().nullable(),
  aciklama: z.string().optional().nullable(),

  birim: Birim_BaseSchema_for_Malzeme_Relation.optional(),
  sube: Sube_BaseSchema_for_Malzeme_Relation.optional(),
  sabitKodu: SabitKodu_BaseSchema_for_Malzeme_Relation.optional(),
  marka: Marka_BaseSchema_for_Malzeme_Relation.optional(),
  model: Model_BaseSchema_for_Malzeme_Relation.optional(),
  malzemeHareketleri: z.array(MalzemeHareket_BaseSchema_for_Malzeme_Relation).optional(),

  status: z.string().optional().default('Aktif'),
});

// --- Oluşturma Şeması ---
export const Malzeme_CreateSchema = z.object({
  vidaNo: z.string().optional().nullable(),
  kayitTarihi: z.date().optional().nullable(),
  malzemeTipi: z.enum(['Demirbas', 'Sarf'], {
    required_error: 'Malzeme tipi zorunludur.',
    message: 'Malzeme tipi Demirbaş veya Sarf olmalıdır.',
  }),
  birimId: z.string({ required_error: 'Birim seçimi zorunludur.' }).min(1, { message: 'Geçerli bir birim seçiniz.' }),
  subeId: z.string({ required_error: 'Şube seçimi zorunludur.' }).min(1, { message: 'Geçerli bir şube seçiniz.' }),
  sabitKoduId: z.string({ required_error: 'Sabit Kodu seçimi zorunludur.' }).min(1, { message: 'Geçerli bir sabit kodu seçiniz.' }),
  markaId: z.string({ required_error: 'Marka seçimi zorunludur.' }).min(1, { message: 'Geçerli bir marka seçiniz.' }),
  modelId: z.string({ required_error: 'Model seçimi zorunludur.' }).min(1, { message: 'Geçerli bir model seçiniz.' }),
  kod: z.string().optional().nullable(),
  bademSeriNo: z.string().optional().nullable(),
  etmysSeriNo: z.string().optional().nullable(),
  stokDemirbasNo: z.string().optional().nullable(),
  aciklama: z.string().optional().nullable(),
});

// --- Güncelleme Şeması ---
export const Malzeme_UpdateSchema = z
  .object({
    vidaNo: z.string().optional().nullable(),
    malzemeTipi: z.enum(['Demirbas', 'Sarf']).optional(),
    birimId: z.string().min(1, { message: 'Geçerli bir birim seçiniz.' }).optional(),
    subeId: z.string().min(1, { message: 'Geçerli bir şube seçiniz.' }).optional(),
    sabitKoduId: z.string().min(1, { message: 'Geçerli bir sabit kodu seçiniz.' }).optional(),
    markaId: z.string().min(1, { message: 'Geçerli bir marka seçiniz.' }).optional(),
    modelId: z.string().min(1, { message: 'Geçerli bir model seçiniz.' }).optional(),
    kod: z.string().optional().nullable(),
    bademSeriNo: z.string().optional().nullable(),
    etmysSeriNo: z.string().optional().nullable(),
    stokDemirbasNo: z.string().optional().nullable(),
    aciklama: z.string().optional().nullable(),

    kayitTarihi: z.preprocess(
      arg => {
        if (typeof arg === 'string') {
          const date = new Date(arg);
          // If the string cannot be parsed into a valid date,
          // return `undefined` to let z.date() trigger its invalid_type_error.
          // Otherwise, return the valid Date object.
          return isNaN(date.getTime()) ? undefined : date;
        }
        if (arg instanceof Date) {
          // If it's already a Date object, ensure it's a valid one.
          return isNaN(arg.getTime()) ? undefined : arg;
        }
        // Pass through null/undefined or other types for z.date() to handle.
        // If null is a valid state (e.g., date can be cleared), .nullable() below handles it.
        return arg;
      },
      z
        .date({
          // This error message will be shown if the preprocessed value is not a valid Date
          // and not null (if .nullable() is used).
          invalid_type_error: 'Lütfen geçerli bir tarih giriniz.',
        })
        .nullable(), // Add .nullable() if the date can be cleared/set to null by the user.
      // Remove .nullable() if the date is always required in the edit form.
    ),
  })
  .partial();

// --- Form Girdi Şeması ---
export const Malzeme_FormInputSchema = z.object({
  vidaNo: z.string().optional().nullable(),
  malzemeTipi: z.enum(['Demirbas', 'Sarf'], {
    required_error: 'Malzeme tipi zorunludur.',
    message: 'Malzeme tipi Demirbaş veya Sarf olmalıdır.',
  }),
  birimId: z.string({ required_error: 'Birim seçimi zorunludur.' }).min(1, { message: 'Geçerli bir birim seçiniz.' }),
  subeId: z.string({ required_error: 'Şube seçimi zorunludur.' }).min(1, { message: 'Geçerli bir şube seçiniz.' }),
  sabitKoduId: z.string({ required_error: 'Sabit Kodu seçimi zorunludur.' }).min(1, { message: 'Geçerli bir sabit kodu seçiniz.' }),
  markaId: z.string({ required_error: 'Marka seçimi zorunludur.' }).min(1, { message: 'Geçerli bir marka seçiniz.' }),
  modelId: z.string({ required_error: 'Model seçimi zorunludur.' }).min(1, { message: 'Geçerli bir model seçiniz.' }),
  kod: z.string().optional().nullable(),
  bademSeriNo: z.string().optional().nullable(),
  etmysSeriNo: z.string().optional().nullable(),
  stokDemirbasNo: z.string().optional().nullable(),
  aciklama: z.string().optional().nullable(),
  // kayitTarihi: z.date().optional().nullable(),
  
   kayitTarihi: z.preprocess(
      arg => {
        if (typeof arg === 'string' || arg instanceof Date) { // Simplified check
          const date = new Date(arg);
          return isNaN(date.getTime()) ? undefined : date;
        }
        return arg; // Pass through null or undefined
      },
      z.date({ invalid_type_error: 'Lütfen geçerli bir tarih giriniz.' })
       .nullable() // Allows null (e.g., if the user clears the date)
       .optional(), // Makes the field itself optional in the form data
    ),
});
