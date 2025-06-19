import { z } from 'zod';
import { EntityHuman } from './api';

// Büro için temel şema
export const Buro_BaseSchema_for_Personel_Relation = z.object({
  id: z.string().min(1, 'Geçersiz Büro ID.'),
  ad: z.string().min(1, { message: 'İlişkili Büro adı boş olamaz.' }),
  sube: z.object({
    id: z.string(),
    ad: z.string(),
  }).optional(),
});

// Role enum şeması
export const RoleSchema = z.enum(['User', 'Personel', 'Admin', 'Superadmin']);

// --- Ana Personel Şeması ---
export const Personel_Schema = z.object({
  id: z.string().min(1, `Geçersiz ${EntityHuman} ID formatı.`),
  ad: z.string().min(1, { message: `${EntityHuman} adı boş olamaz.` }),
  soyad: z.string().min(1, { message: `${EntityHuman} soyad boş olamaz.` }),
  sicil: z.string().min(1, { message: 'Sicil numarası zorunludur.' }),
  parola: z.string().optional(),
  role: RoleSchema.default('Personel'),
  avatar: z.string().url().optional().nullable(),
  buroId: z.string().optional().nullable(),
  isUser: z.boolean().default(false),
  isAmir: z.boolean().default(false),
  lastLogin: z.string().datetime().optional().nullable(),
  lastLogout: z.string().datetime().optional().nullable(),

  buro: Buro_BaseSchema_for_Personel_Relation.optional().nullable(),

  status: z.string().optional().default('Aktif'),
});

// --- Oluşturma Şeması ---
export const Personel_CreateSchema = z.object({
  ad: z.string({ required_error: `${EntityHuman} adı zorunludur.` }).min(1, { message: `${EntityHuman} adı en az 1 karakter olmalıdır.` }),
  soyad: z.string({ required_error: `${EntityHuman} soyadı zorunludur.` }).min(1, { message: `${EntityHuman} soyadı en az 1 karakter olmalıdır.` }),
  sicil: z.string({ required_error: 'Sicil numarası zorunludur.' }).min(1, { message: 'Sicil numarası en az 1 karakter olmalıdır.' }),
  parola: z.string().min(6, { message: 'Parola en az 6 karakter olmalıdır.' }).optional(),
  // role: RoleSchema.default('Personel'),
  // avatar: z.string().url({ message: 'Geçerli bir URL giriniz.' }).optional().nullable(),
  // buroId: z.string().optional().nullable(),
  // isUser: z.boolean().default(false),
  // isAmir: z.boolean().default(false),
});

// --- Güncelleme Şeması ---
export const Personel_UpdateSchema = z.object({
  ad: z.string().min(1, { message: `${EntityHuman} adı en az 1 karakter olmalıdır.` }).optional(),
  soyad: z.string().min(1, { message: `${EntityHuman} soyadı en az 1 karakter olmalıdır.` }).optional(),
  sicil: z.string().min(1, { message: 'Sicil numarası en az 1 karakter olmalıdır.' }).optional(),
  parola: z.string().min(6, { message: 'Parola en az 6 karakter olmalıdır.' }).optional(),
  // role: RoleSchema.optional(),
  // avatar: z.string().url({ message: 'Geçerli bir URL giriniz.' }).optional().nullable(),
  // buroId: z.string().optional().nullable(),
  // isUser: z.boolean().optional(),
  // isAmir: z.boolean().optional(),
}).partial();

// --- Form Girdi Şeması ---
export const Personel_FormInputSchema = z.object({
  ad: z.string({ required_error: `${EntityHuman} adı zorunludur.` }).min(1, { message: `${EntityHuman} adı en az 1 karakter olmalıdır.` }),
  soyad: z.string({ required_error: `${EntityHuman} soyadı zorunludur.` }).min(1, { message: `${EntityHuman} soyadı en az 1 karakter olmalıdır.` }),
  sicil: z.string({ required_error: 'Sicil numarası zorunludur.' }).min(1, { message: 'Sicil numarası en az 1 karakter olmalıdır.' }),
  parola: z.string().min(6, { message: 'Parola en az 6 karakter olmalıdır.' }).optional(),
  // role: RoleSchema.default('Personel'),
  // avatar: z.string().url({ message: 'Geçerli bir URL giriniz.' }).optional().nullable(),
  // buroId: z.string().optional().nullable(),
  // isUser: z.boolean().default(false),
  // isAmir: z.boolean().default(false),
});