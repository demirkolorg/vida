import { z } from 'zod';
import { EntityHuman } from './api';

// Personel için temel şema
export const Personel_BaseSchema_for_Buro_Relation = z.object({
  id: z.string().min(1, 'Geçersiz Personel ID.'),
  ad: z.string().optional().nullable(),
  sicil: z.string().optional().nullable(),
});

// Sube için temel şema
export const Sube_BaseSchema_for_Buro_Relation = z.object({
  id: z.string().min(1, 'Geçersiz Şube ID.'),
  ad: z.string().min(1, { message: 'İlişkili Şube adı boş olamaz.' }),
});

// --- Ana Buro Şeması ---
export const Buro_Schema = z.object({
  id: z.string().min(1, `Geçersiz ${EntityHuman} ID formatı.`),
  ad: z.string().min(1, { message: `${EntityHuman} adı boş olamaz.` }),
  aciklama: z.string().optional().nullable(),
  subeId: z.string().min(1, { message: 'Şube seçimi zorunludur.' }),
  amirId: z.string().optional().nullable(),

  sube: Sube_BaseSchema_for_Buro_Relation.optional(),
  amir: Personel_BaseSchema_for_Buro_Relation.optional().nullable(),
  personeller: z.array(Personel_BaseSchema_for_Buro_Relation).optional(),

  status: z.string().optional().default('Aktif'),
});

// --- Oluşturma Şeması ---
export const Buro_CreateSchema = z.object({
  ad: z.string({ required_error: `${EntityHuman} adı zorunludur.` }).min(1, { message: `${EntityHuman} adı en az 1 karakter olmalıdır.` }),
  aciklama: z.string().optional().nullable(),
  subeId: z.string({ required_error: 'Şube seçimi zorunludur.' }).min(1, { message: 'Geçerli bir şube seçiniz.' }),
  amirId: z.string().optional().nullable(),
});

// --- Güncelleme Şeması ---
export const Buro_UpdateSchema = z.object({
  ad: z.string().min(1, { message: `${EntityHuman} adı en az 1 karakter olmalıdır.` }).optional(),
  aciklama: z.string().optional().nullable(),
  subeId: z.string().min(1, { message: 'Geçerli bir şube seçiniz.' }).optional(),
  amirId: z.string().optional().nullable(),
}).partial();

// --- Form Girdi Şeması ---
export const Buro_FormInputSchema = z.object({
  ad: z.string({ required_error: `${EntityHuman} adı zorunludur.` }).min(1, { message: `${EntityHuman} adı en az 1 karakter olmalıdır.` }),
  aciklama: z.string().optional().nullable(),
  subeId: z.string({ required_error: 'Şube seçimi zorunludur.' }).min(1, { message: 'Geçerli bir şube seçiniz.' }),
  amirId: z.string().optional().nullable(),
});