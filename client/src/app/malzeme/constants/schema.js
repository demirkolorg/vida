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
    message: 'Malzeme tipi Demirbaş veya Sarf olmalıdır.' 
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
export const Malzeme_UpdateSchema = z.object({
  vidaNo: z.string().optional().nullable(),
  kayitTarihi: z.date().optional().nullable(),
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
}).partial();

// --- Form Girdi Şeması ---
export const Malzeme_FormInputSchema = z.object({
  vidaNo: z.string().optional().nullable(),
  kayitTarihi: z.date().optional().nullable(),
  malzemeTipi: z.enum(['Demirbas', 'Sarf'], { 
    required_error: 'Malzeme tipi zorunludur.',
    message: 'Malzeme tipi Demirbaş veya Sarf olmalıdır.' 
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