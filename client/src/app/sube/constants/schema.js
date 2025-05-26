import { z } from 'zod';
import { EntityHuman } from './api';

// Personel için temel şema
export const Personel_BaseSchema_for_Sube_Relation = z.object({
  id: z.string().min(1, 'Geçersiz Personel ID.'),
  ad: z.string().optional().nullable(),
  sicil: z.string().optional().nullable(),
});

// Birim için temel şema
export const Birim_BaseSchema_for_Sube_Relation = z.object({
  id: z.string().min(1, 'Geçersiz Birim ID.'),
  ad: z.string().min(1, { message: 'İlişkili Birim adı boş olamaz.' }),
});

// Buro için temel şema
export const Buro_BaseSchema_for_Sube_Relation = z.object({
  id: z.string().min(1, 'Geçersiz Büro ID.'),
  ad: z.string().min(1, { message: 'İlişkili Büro adı boş olamaz.' }),
});

// Malzeme için temel şema
export const Malzeme_BaseSchema_for_Sube_Relation = z.object({
  id: z.string().min(1, 'Geçersiz Malzeme ID.'),
  vidaNo: z.string().optional().nullable(),
});

// --- Ana Sube Şeması ---
export const Sube_Schema = z.object({
  id: z.string().min(1, `Geçersiz ${EntityHuman} ID formatı.`),
  ad: z.string().min(1, { message: `${EntityHuman} adı boş olamaz.` }),
  aciklama: z.string().optional().nullable(),
  birimId: z.string().min(1, { message: 'Birim seçimi zorunludur.' }),

  birim: Birim_BaseSchema_for_Sube_Relation.optional(),
  burolar: z.array(Buro_BaseSchema_for_Sube_Relation).optional(),
  malzemeler: z.array(Malzeme_BaseSchema_for_Sube_Relation).optional(),

  status: z.string().optional().default('Aktif'),
});

// --- Oluşturma Şeması ---
export const Sube_CreateSchema = z.object({
  ad: z.string({ required_error: `${EntityHuman} adı zorunludur.` }).min(1, { message: `${EntityHuman} adı en az 1 karakter olmalıdır.` }),
  aciklama: z.string().optional().nullable(),
  birimId: z.string({ required_error: 'Birim seçimi zorunludur.' }).min(1, { message: 'Geçerli bir birim seçiniz.' }),
});

// --- Güncelleme Şeması ---
export const Sube_UpdateSchema = z.object({
  ad: z.string().min(1, { message: `${EntityHuman} adı en az 1 karakter olmalıdır.` }).optional(),
  aciklama: z.string().optional().nullable(),
  birimId: z.string().min(1, { message: 'Geçerli bir birim seçiniz.' }).optional(),
}).partial();

// --- Form Girdi Şeması ---
export const Sube_FormInputSchema = z.object({
  ad: z.string({ required_error: `${EntityHuman} adı zorunludur.` }).min(1, { message: `${EntityHuman} adı en az 1 karakter olmalıdır.` }),
  aciklama: z.string().optional().nullable(),
  birimId: z.string({ required_error: 'Birim seçimi zorunludur.' }).min(1, { message: 'Geçerli bir birim seçiniz.' }),
});