import { z } from 'zod';
import { EntityHuman } from './api';

// Personel için temel şema
export const Personel_BaseSchema_for_Model_Relation = z.object({
  id: z.string().min(1, 'Geçersiz Personel ID.'),
  ad: z.string().optional().nullable(),
  sicil: z.string().optional().nullable(),
});

// Marka için temel şema
export const Marka_BaseSchema_for_Model_Relation = z.object({
  id: z.string().min(1, 'Geçersiz Marka ID.'),
  ad: z.string().min(1, { message: 'İlişkili Marka adı boş olamaz.' }),
});

// Malzeme için temel şema
export const Malzeme_BaseSchema_for_Model_Relation = z.object({
  id: z.string().min(1, 'Geçersiz Malzeme ID.'),
  vidaNo: z.string().optional().nullable(),
});

// --- Ana Model Şeması ---
export const Model_Schema = z.object({
  id: z.string().min(1, `Geçersiz ${EntityHuman} ID formatı.`),
  ad: z.string().min(1, { message: `${EntityHuman} adı boş olamaz.` }),
  aciklama: z.string().optional().nullable(),
  markaId: z.string().min(1, { message: 'Marka seçimi zorunludur.' }),

  marka: Marka_BaseSchema_for_Model_Relation.optional(),
  malzemeler: z.array(Malzeme_BaseSchema_for_Model_Relation).optional(),

  status: z.string().optional().default('Aktif'),
});

// --- Oluşturma Şeması ---
export const Model_CreateSchema = z.object({
  ad: z.string({ required_error: `${EntityHuman} adı zorunludur.` }).min(1, { message: `${EntityHuman} adı en az 1 karakter olmalıdır.` }),
  aciklama: z.string().optional().nullable(),
  markaId: z.string({ required_error: 'Marka seçimi zorunludur.' }).min(1, { message: 'Geçerli bir marka seçiniz.' }),
});

// --- Güncelleme Şeması ---
export const Model_UpdateSchema = z.object({
  ad: z.string().min(1, { message: `${EntityHuman} adı en az 1 karakter olmalıdır.` }).optional(),
  aciklama: z.string().optional().nullable(),
  markaId: z.string().min(1, { message: 'Geçerli bir marka seçiniz.' }).optional(),
}).partial();

// --- Form Girdi Şeması ---
export const Model_FormInputSchema = z.object({
  ad: z.string({ required_error: `${EntityHuman} adı zorunludur.` }).min(1, { message: `${EntityHuman} adı en az 1 karakter olmalıdır.` }),
  aciklama: z.string().optional().nullable(),
  markaId: z.string({ required_error: 'Marka seçimi zorunludur.' }).min(1, { message: 'Geçerli bir marka seçiniz.' }),
});