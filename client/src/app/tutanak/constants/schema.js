// client/src/app/tutanak/constants/schema.js

import { z } from 'zod';

// Hareket türleri enum'u
export const HareketTuruEnum = {
  Kayit: 'Kayit',
  Zimmet: 'Zimmet',
  Iade: 'Iade',
  Devir: 'Devir',
  DepoTransferi: 'DepoTransferi',
  KondisyonGuncelleme: 'KondisyonGuncelleme',
  Kayip: 'Kayip',
  Dusum: 'Dusum',
  Bilgi: 'Bilgi', // YENİ: Personel zimmet bilgi fişi
};

// Malzeme tipi enum'u
export const MalzemeTipiEnum = {
  Demirbas: 'Demirbas',
  Sarf: 'Sarf',
};

// Personel için temel şema
export const Personel_BaseSchema_for_Tutanak_Relation = z.object({
  id: z.string().min(1, 'Geçersiz Personel ID.'),
  ad: z.string().optional().nullable(),
  sicil: z.string().optional().nullable(),
});

// Malzeme için temel şema
export const Malzeme_BaseSchema_for_Tutanak_Relation = z.object({
  id: z.string().min(1, 'Geçersiz Malzeme ID.'),
  vidaNo: z.string().optional().nullable(),
  sabitKodu: z.string().optional().nullable(),
  marka: z.string().optional().nullable(),
  model: z.string().optional().nullable(),
  bademSeriNo: z.string().optional().nullable(),
  malzemeTipi: z.enum([MalzemeTipiEnum.Demirbas, MalzemeTipiEnum.Sarf]),
  kondisyon: z.string().optional().nullable(),
});

// Personel bilgileri şeması
export const PersonelBilgileri_Schema = z.object({
  kaynakPersonel: Personel_BaseSchema_for_Tutanak_Relation.optional().nullable(),
  hedefPersonel: Personel_BaseSchema_for_Tutanak_Relation.optional().nullable(),
});

// İşlem bilgileri şeması
export const IslemBilgileri_Schema = z.object({
  tarih: z.date().optional(),
  hareketTuru: z.enum(Object.values(HareketTuruEnum)),
  aciklama: z.string().optional().nullable(),
  hareketIds: z.array(z.string()).optional(),
});

// Konum bilgileri şeması
export const KonumBilgileri_Schema = z
  .object({
    id: z.string().optional().nullable(),
    ad: z.string().optional().nullable(),
    depo: z.string().optional().nullable(),
  })
  .optional()
  .nullable();

// --- Ana Tutanak Şeması ---
export const Tutanak_Schema = z.object({
  id: z.string().min(1, 'Geçersiz Tutanak ID formatı.'),
  hareketTuru: z.enum(Object.values(HareketTuruEnum)),

  malzemeIds: z.array(z.string()).optional(),
  malzemeler: z.array(Malzeme_BaseSchema_for_Tutanak_Relation).optional(),

  personelBilgileri: PersonelBilgileri_Schema.optional(),
  islemBilgileri: IslemBilgileri_Schema.optional(),
  konumBilgileri: KonumBilgileri_Schema.optional().nullable(),

  toplamMalzeme: z.number().int().min(0).default(0),
  demirbasSayisi: z.number().int().min(0).default(0),
  sarfSayisi: z.number().int().min(0).default(0),

  ekDosyalar: z.any().optional().nullable(), // JSON field

  status: z.string().optional().default('Aktif'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  createdBy: Personel_BaseSchema_for_Tutanak_Relation.optional(),
  updatedBy: Personel_BaseSchema_for_Tutanak_Relation.optional().nullable(),
});

// --- Oluşturma Şeması ---
export const Tutanak_CreateSchema = z.object({
  hareketTuru: z.enum(Object.values(HareketTuruEnum), {
    required_error: 'Hareket türü zorunludur.',
  }),
  malzemeIds: z.array(z.string()).min(1, {
    message: 'En az bir malzeme seçilmelidir.',
  }),
  malzemeler: z.array(Malzeme_BaseSchema_for_Tutanak_Relation).optional(),
  personelBilgileri: PersonelBilgileri_Schema.optional(),
  islemBilgileri: IslemBilgileri_Schema.optional(),
  konumBilgileri: KonumBilgileri_Schema.optional().nullable(),
  ekDosyalar: z.any().optional().nullable(),
});

// --- Güncelleme Şeması ---
export const Tutanak_UpdateSchema = z
  .object({
    hareketTuru: z.enum(Object.values(HareketTuruEnum)).optional(),
    malzemeIds: z.array(z.string()).optional(),
    malzemeler: z.array(Malzeme_BaseSchema_for_Tutanak_Relation).optional(),
    personelBilgileri: PersonelBilgileri_Schema.optional(),
    islemBilgileri: IslemBilgileri_Schema.optional(),
    konumBilgileri: KonumBilgileri_Schema.optional().nullable(),
    ekDosyalar: z.any().optional().nullable(),
  })
  .partial();

// --- Form Girdi Şeması ---
export const Tutanak_FormInputSchema = z.object({
  hareketTuru: z.enum(Object.values(HareketTuruEnum), {
    required_error: 'Hareket türü zorunludur.',
  }),
  malzemeIds: z.array(z.string()).min(1, {
    message: 'En az bir malzeme seçilmelidir.',
  }),
  aciklama: z.string().optional().nullable(),
});

// --- Hareketlerden Tutanak Oluşturma Şeması ---
export const TutanakFromHareketler_Schema = z.object({
  hareketIds: z.array(z.string()).min(1, {
    message: 'En az bir hareket seçilmelidir.',
  }),
  hareketTuru: z.enum(Object.values(HareketTuruEnum), {
    required_error: 'Hareket türü zorunludur.',
  }),
  aciklama: z.string().optional().nullable(),
});

// --- Malzemelerden Tutanak Oluşturma Şeması ---
export const TutanakFromMalzemeler_Schema = z.object({
  malzemeIds: z.array(z.string()).min(1, {
    message: 'En az bir malzeme seçilmelidir.',
  }),
  hareketTuru: z.enum(Object.values(HareketTuruEnum), {
    required_error: 'Hareket türü zorunludur.',
  }),
  personelBilgileri: PersonelBilgileri_Schema.optional(),
  aciklama: z.string().optional().nullable(),
});

// --- Bulk Tutanak Oluşturma Şeması ---
export const BulkTutanak_Schema = z.object({
  bulkResult: z.object({
    success: z.array(z.any()).min(1, {
      message: 'Başarılı işlem sonucu gerekli.',
    }),
    failed: z.array(z.any()).optional(),
  }),
  hareketTuru: z.enum(Object.values(HareketTuruEnum), {
    required_error: 'Hareket türü zorunludur.',
  }),
  aciklama: z.string().optional().nullable(),
});

// --- Arama Şeması ---
export const Tutanak_SearchSchema = z.object({
  hareketTuru: z.enum(Object.values(HareketTuruEnum)).optional().nullable(),
  createdById: z.string().optional().nullable(),
  tarihBaslangic: z.date().optional().nullable(),
  tarihBitis: z.date().optional().nullable(),
});

// Hareket türleri için human-readable labels
export const HareketTuruLabels = {
  [HareketTuruEnum.Kayit]: 'Kayıt',
  [HareketTuruEnum.Zimmet]: 'Zimmet',
  [HareketTuruEnum.Iade]: 'İade',
  [HareketTuruEnum.Devir]: 'Devir',
  [HareketTuruEnum.DepoTransferi]: 'Depo Transferi',
  [HareketTuruEnum.KondisyonGuncelleme]: 'Kondisyon Güncelleme',
  [HareketTuruEnum.Kayip]: 'Kayıp',
  [HareketTuruEnum.Dusum]: 'Düşüm',
  [HareketTuruEnum.Bilgi]: 'Zimmet Bilgilendirme', // YENİ
};

// Malzeme tipi için human-readable labels
export const MalzemeTipiLabels = {
  [MalzemeTipiEnum.Demirbas]: 'Demirbaş',
  [MalzemeTipiEnum.Sarf]: 'Sarf',
};
