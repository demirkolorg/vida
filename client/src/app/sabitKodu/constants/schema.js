// constants/sabitKoduSchema.js (veya benzeri bir dosya yolu)

import { z } from 'zod';
import { AuditStatusEnum } from '@prisma/client';

// Personel için temel şema (SabitKodu ilişkilerinde kullanılacak)
// Bu, Birim şemalarınızdaki Personel_BaseSchema_for_Birim_Relation ile aynı olabilir
// veya SabitKodu'na özel bir versiyon oluşturulabilir. Şimdilik aynıyı kullanalım.
export const Personel_BaseSchema_for_SabitKodu_Relation = z.object({
  id: z.string().min(1, 'Geçersiz Personel ID.'),
  ad: z.string().optional().nullable(),
  sicil: z.string().optional().nullable(),
});

// Malzeme için temel şema (SabitKodu ilişkilerinde kullanılacak)
// Bu, Birim şemalarınızdaki Malzeme_BaseSchema_for_Birim_Relation ile aynı olabilir
// veya SabitKodu'na özel bir versiyon oluşturulabilir.
export const Malzeme_BaseSchema_for_SabitKodu_Relation = z.object({
  id: z.string().min(1, 'Geçersiz Malzeme ID.'),
  vidaNo: z.string().optional().nullable(),
  // İsterseniz malzemeyle ilgili daha fazla bilgi ekleyebilirsiniz (ad, model vb.)
});


// --- Ana SabitKodu Şeması (Veritabanından gelen veya API'den dönen tam obje) ---
export const SabitKodu_Schema = z.object({
  id: z.string().min(1, 'Geçersiz Sabit Kodu ID formatı.'),
  ad: z.string().min(1, { message: 'Sabit Kodu adı boş olamaz.' }),
  aciklama: z.string().optional().nullable(),

  // İlişkili Malzemeler (opsiyonel, her zaman yüklenmeyebilir)
  malzemeler: z.array(Malzeme_BaseSchema_for_SabitKodu_Relation).optional(),

  status: z.nativeEnum(AuditStatusEnum).default(AuditStatusEnum.Aktif), // Prisma Enum'u ile eşleşmeli
  createdAt: z.coerce.date(), // String'den Date'e çevirir
  createdById: z.string(),
  createdBy: Personel_BaseSchema_for_SabitKodu_Relation.optional(), // Her zaman populate edilmeyebilir
  updatedAt: z.coerce.date(),
  updatedById: z.string().optional().nullable(),
  updatedBy: Personel_BaseSchema_for_SabitKodu_Relation.optional().nullable(),
});

// --- Oluşturma Şeması (API'ye create için gönderilecek veri) ---
export const SabitKodu_CreateSchema = z.object({
  // ID backend'de veya servis katmanında oluşturulacaksa, burada zorunlu değil.
  // Eğer client'ta oluşturuyorsanız (örn: cuid), o zaman buraya ekleyin.
  // id: z.string().cuid('Geçersiz ID formatı.').optional(), // Eğer client'ta generate ediliyorsa
  ad: z.string({ required_error: 'Sabit Kodu adı zorunludur.' })
       .min(1, { message: 'Sabit Kodu adı en az 1 karakter olmalıdır.' }),
  aciklama: z.string().optional().nullable(),
  // createdById genellikle backend'de request'i yapan kullanıcıdan alınır.
});

// --- Güncelleme Şeması (API'ye update için gönderilecek veri) ---
// `partial()` tüm alanları opsiyonel yapar.
export const SabitKodu_UpdateSchema = SabitKodu_CreateSchema.partial().extend({
  // Güncellemede ID zorunlu değil (genellikle path param veya where koşulu ile belirtilir)
  // Ad veya açıklama güncellenebilir.
  // status alanı da güncellenebilir, bu durumda enum kontrolü eklenebilir.
  status: z.nativeEnum(AuditStatusEnum).optional(),
});

// --- Form Girdi Şeması (React Hook Form için kullanılacak) ---
export const SabitKodu_FormInputSchema = z.object({
  ad: z.string({ required_error: 'Sabit Kodu adı zorunludur.' })
       .min(1, { message: 'Sabit Kodu adı en az 1 karakter olmalıdır.' }),
  aciklama: z.string().optional().nullable(),
  // status alanı forma eklenecekse buraya da eklenmeli:
  // status: z.nativeEnum(AuditStatusEnum).default(AuditStatusEnum.Aktif),
});

// Prisma Enum'larını Zod ile kullanabilmek için tanımlama
// Bu enum tanımları, Prisma client'tan import ettiğiniz enumlarla aynı olmalı
// veya doğrudan Prisma client'tan import edilmeli.
// Örnek olarak buraya ekliyorum, ama en iyisi Prisma client'tan import etmek.
// Eğer `@prisma/client` projenizin her yerinden erişilebilir değilse,
// bu enumları projenizde paylaşılan bir types dosyasında tanımlayabilirsiniz.

// import { AuditStatusEnum as PrismaAuditStatusEnum } from '@prisma/client'; // Eğer bu şekilde import edebiliyorsanız
// export const AuditStatusEnum = z.nativeEnum(PrismaAuditStatusEnum);
