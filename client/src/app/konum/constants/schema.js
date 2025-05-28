import { z } from 'zod';

// Personel için temel şema
export const Personel_BaseSchema_for_Konum_Relation = z.object({
  id: z.string().min(1, 'Geçersiz Personel ID.'),
  ad: z.string().optional().nullable(),
  sicil: z.string().optional().nullable(),
});

// Depo için temel şema
export const Depo_BaseSchema_for_Konum_Relation = z.object({
  id: z.string().min(1, 'Geçersiz Depo ID.'),
  ad: z.string().min(1, { message: 'İlişkili Depo adı boş olamaz.' }),
});

// Malzeme Hareket için temel şema
export const MalzemeHareket_BaseSchema_for_Konum_Relation = z.object({
  id: z.string().min(1, 'Geçersiz Malzeme Hareket ID.'),
  hareketTuru: z.string().optional().nullable(),
});

// --- Ana Konum Şeması ---
export const Konum_Schema = z.object({
  id: z.string().min(1, 'Geçersiz Konum ID formatı.'),
  ad: z.string().min(1, { message: 'Konum adı boş olamaz.' }),
  aciklama: z.string().optional().nullable(),
  depoId: z.string().min(1, { message: 'Depo seçimi zorunludur.' }),

  depo: Depo_BaseSchema_for_Konum_Relation.optional(),
  malzemeHareketleri: z.array(MalzemeHareket_BaseSchema_for_Konum_Relation).optional(),

  status: z.string().optional().default('Aktif'),
});

// --- Oluşturma Şeması ---
export const Konum_CreateSchema = z.object({
  ad: z.string({ required_error: 'Konum adı zorunludur.' }).min(1, { message: 'Konum adı en az 1 karakter olmalıdır.' }),
  aciklama: z.string().optional().nullable(),
  depoId: z.string({ required_error: 'Depo seçimi zorunludur.' }).min(1, { message: 'Geçerli bir depo seçiniz.' }),
});

// --- Güncelleme Şeması ---
export const Konum_UpdateSchema = z.object({
  ad: z.string().min(1, { message: 'Konum adı en az 1 karakter olmalıdır.' }).optional(),
  aciklama: z.string().optional().nullable(),
  depoId: z.string().min(1, { message: 'Geçerli bir depo seçiniz.' }).optional(),
}).partial();

// --- Form Girdi Şeması ---
export const Konum_FormInputSchema = z.object({
  ad: z.string({ required_error: 'Konum adı zorunludur.' }).min(1, { message: 'Konum adı en az 1 karakter olmalıdır.' }),
  aciklama: z.string().optional().nullable(),
  depoId: z.string({ required_error: 'Depo seçimi zorunludur.' }).min(1, { message: 'Geçerli bir depo seçiniz.' }),
});