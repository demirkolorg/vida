import { z } from 'zod';

// Personel için temel şema
export const Personel_BaseSchema_for_Depo_Relation = z.object({
  id: z.string().min(1, 'Geçersiz Personel ID.'),
  ad: z.string().optional().nullable(),
  sicil: z.string().optional().nullable(),
});

// Sube için temel şema
export const Konum_BaseSchema_for_Depo_Relation = z.object({
  id: z.string().min(1, 'Geçersiz Şube ID.'),
  ad: z.string().min(1, { message: 'İlişkili Şube adı boş olamaz.' }),
});

// Malzeme için temel şema
export const Malzeme_BaseSchema_for_Depo_Relation = z.object({
  id: z.string().min(1, 'Geçersiz Malzeme ID.'),
  vidaNo: z.string().optional().nullable(),
});

// --- Ana Birim Şeması ---
export const Depo_Schema = z.object({
  id: z.string().min(1, 'Geçersiz Birim ID formatı.'),
  ad: z.string().min(1, { message: 'Birim adı boş olamaz.' }),
  aciklama: z.string().optional().nullable(),

  konumlar: z.array(Konum_BaseSchema_for_Depo_Relation).optional(),

  status: z.string().optional().default('Aktif'),
});

// --- Oluşturma Şeması ---
export const Depo_CreateSchema = z.object({
  ad: z.string({ required_error: 'Birim adı zorunludur.' }).min(1, { message: 'Birim adı en az 1 karakter olmalıdır.' }),
  aciklama: z.string().optional().nullable(),
});

// --- Güncelleme Şeması ---
export const Depo_UpdateSchema = z.object({
  ad: z.string().min(1, { message: 'Birim adı en az 1 karakter olmalıdır.' }).optional(),
  aciklama: z.string().optional().nullable(),
}).partial(); 

// --- Form Girdi Şeması ---
export const Depo_FormInputSchema = z.object({
  ad: z.string({ required_error: 'Birim adı zorunludur.' }).min(1, { message: 'Birim adı en az 1 karakter olmalıdır.' }),
  aciklama: z.string().optional().nullable(),
});
