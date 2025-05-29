// client/src/app/malzemeHareket/constants/schema.js
import { z } from 'zod';
import { EntityHuman } from './api';

// Personel için temel şema
export const Personel_BaseSchema_for_MalzemeHareket_Relation = z.object({
  id: z.string().min(1, 'Geçersiz Personel ID.'),
  ad: z.string().optional().nullable(),
  sicil: z.string().optional().nullable(),
});

// Malzeme için temel şema
export const Malzeme_BaseSchema_for_MalzemeHareket_Relation = z.object({
  id: z.string().min(1, 'Geçersiz Malzeme ID.'),
  vidaNo: z.string().optional().nullable(),
  sabitKodu: z.object({
    ad: z.string().optional().nullable(),
  }).optional().nullable(),
});

// Konum için temel şema
export const Konum_BaseSchema_for_MalzemeHareket_Relation = z.object({
  id: z.string().min(1, 'Geçersiz Konum ID.'),
  ad: z.string().min(1, { message: 'İlişkili Konum adı boş olamaz.' }),
  depo: z.object({
    ad: z.string().optional().nullable(),
  }).optional().nullable(),
});

// Hareket türü enum'u
export const HareketTuruEnum = z.enum([
  'Zimmet',
  'Iade', 
  'Kayit',
  'Devir',
  'Kayip',
  'KondisyonGuncelleme',
  'DepoTransferi',
  'Dusum'
]);

// Malzeme kondisyonu enum'u
export const MalzemeKondisyonuEnum = z.enum([
  'Saglam',
  'Arizali',
  'Hurda'
]);

// --- Ana MalzemeHareket Şeması ---
export const MalzemeHareket_Schema = z.object({
  id: z.string().min(1, `Geçersiz ${EntityHuman} ID formatı.`),
  islemTarihi: z.string().datetime().or(z.date()),
  hareketTuru: HareketTuruEnum,
  malzemeKondisyonu: MalzemeKondisyonuEnum,
  malzemeId: z.string().min(1, { message: 'Malzeme seçimi zorunludur.' }),
  kaynakPersonelId: z.string().optional().nullable(),
  hedefPersonelId: z.string().optional().nullable(),
  konumId: z.string().optional().nullable(),
  aciklama: z.string().optional().nullable(),

  malzeme: Malzeme_BaseSchema_for_MalzemeHareket_Relation.optional(),
  kaynakPersonel: Personel_BaseSchema_for_MalzemeHareket_Relation.optional().nullable(),
  hedefPersonel: Personel_BaseSchema_for_MalzemeHareket_Relation.optional().nullable(),
  konum: Konum_BaseSchema_for_MalzemeHareket_Relation.optional().nullable(),

  status: z.string().optional().default('Aktif'),
});

// --- Zimmet Verme Şeması ---
export const MalzemeHareket_ZimmetSchema = z.object({
  malzemeId: z.string({ required_error: 'Malzeme seçimi zorunludur.' }).min(1, { message: 'Geçerli bir malzeme seçiniz.' }),
  hedefPersonelId: z.string({ required_error: 'Hedef personel seçimi zorunludur.' }).min(1, { message: 'Geçerli bir personel seçiniz.' }),
  malzemeKondisyonu: MalzemeKondisyonuEnum,
  kaynakPersonelId: z.string().optional().nullable(),
  konumId: z.string().optional().nullable(),
  aciklama: z.string().optional().nullable(),
  islemTarihi: z.string().datetime().optional().nullable(),
});

// --- İade Alma Şeması ---
export const MalzemeHareket_IadeSchema = z.object({
  malzemeId: z.string({ required_error: 'Malzeme seçimi zorunludur.' }).min(1, { message: 'Geçerli bir malzeme seçiniz.' }),
  malzemeKondisyonu: MalzemeKondisyonuEnum,
  kaynakPersonelId: z.string().optional().nullable(),
  hedefPersonelId: z.string().optional().nullable(),
  konumId: z.string().optional().nullable(),
  aciklama: z.string().optional().nullable(),
  islemTarihi: z.string().datetime().optional().nullable(),
});

// --- Devir Yapma Şeması ---
export const MalzemeHareket_DevirSchema = z.object({
  malzemeId: z.string({ required_error: 'Malzeme seçimi zorunludur.' }).min(1, { message: 'Geçerli bir malzeme seçiniz.' }),
  kaynakPersonelId: z.string({ required_error: 'Kaynak personel seçimi zorunludur.' }).min(1, { message: 'Geçerli bir kaynak personel seçiniz.' }),
  hedefPersonelId: z.string({ required_error: 'Hedef personel seçimi zorunludur.' }).min(1, { message: 'Geçerli bir hedef personel seçiniz.' }),
  malzemeKondisyonu: MalzemeKondisyonuEnum,
  konumId: z.string().optional().nullable(),
  aciklama: z.string().optional().nullable(),
  islemTarihi: z.string().datetime().optional().nullable(),
});

// --- Depo Transfer Şeması ---
export const MalzemeHareket_DepoTransferSchema = z.object({
  malzemeId: z.string({ required_error: 'Malzeme seçimi zorunludur.' }).min(1, { message: 'Geçerli bir malzeme seçiniz.' }),
  konumId: z.string({ required_error: 'Hedef konum seçimi zorunludur.' }).min(1, { message: 'Geçerli bir konum seçiniz.' }),
  malzemeKondisyonu: MalzemeKondisyonuEnum,
  kaynakPersonelId: z.string().optional().nullable(),
  hedefPersonelId: z.string().optional().nullable(),
  aciklama: z.string().optional().nullable(),
  islemTarihi: z.string().datetime().optional().nullable(),
});

// --- Kayıp Bildirimi Şeması ---
export const MalzemeHareket_KayipSchema = z.object({
  malzemeId: z.string({ required_error: 'Malzeme seçimi zorunludur.' }).min(1, { message: 'Geçerli bir malzeme seçiniz.' }),
  kaynakPersonelId: z.string().optional().nullable(),
  aciklama: z.string().min(1, { message: 'Kayıp sebebi açıklaması zorunludur.' }),
  islemTarihi: z.string().datetime().optional().nullable(),
});

// --- Kondisyon Güncelleme Şeması ---
export const MalzemeHareket_KondisyonSchema = z.object({
  malzemeId: z.string({ required_error: 'Malzeme seçimi zorunludur.' }).min(1, { message: 'Geçerli bir malzeme seçiniz.' }),
  malzemeKondisyonu: MalzemeKondisyonuEnum,
  kaynakPersonelId: z.string().optional().nullable(),
  aciklama: z.string().optional().nullable(),
  islemTarihi: z.string().datetime().optional().nullable(),
});

// --- Genel Oluşturma Şeması ---
export const MalzemeHareket_CreateSchema = z.object({
  malzemeId: z.string({ required_error: 'Malzeme seçimi zorunludur.' }).min(1, { message: 'Geçerli bir malzeme seçiniz.' }),
  hareketTuru: HareketTuruEnum,
  malzemeKondisyonu: MalzemeKondisyonuEnum,
  kaynakPersonelId: z.string().optional().nullable(),
  hedefPersonelId: z.string().optional().nullable(),
  konumId: z.string().optional().nullable(),
  aciklama: z.string().optional().nullable(),
  islemTarihi: z.string().datetime().optional().nullable(),
});

// --- Güncelleme Şeması ---
export const MalzemeHareket_UpdateSchema = z.object({
  hareketTuru: HareketTuruEnum.optional(),
  malzemeKondisyonu: MalzemeKondisyonuEnum.optional(),
  kaynakPersonelId: z.string().optional().nullable(),
  hedefPersonelId: z.string().optional().nullable(),
  konumId: z.string().optional().nullable(),
  aciklama: z.string().optional().nullable(),
  islemTarihi: z.string().datetime().optional().nullable(),
}).partial();

// --- Form Girdi Şeması ---
export const MalzemeHareket_FormInputSchema = z.object({
  malzemeId: z.string({ required_error: 'Malzeme seçimi zorunludur.' }).min(1, { message: 'Geçerli bir malzeme seçiniz.' }),
  hareketTuru: HareketTuruEnum,
  malzemeKondisyonu: MalzemeKondisyonuEnum,
  kaynakPersonelId: z.string().optional().nullable(),
  hedefPersonelId: z.string().optional().nullable(),
  konumId: z.string().optional().nullable(),
  aciklama: z.string().optional().nullable(),
  islemTarihi: z.string().datetime().optional().nullable(),
});

// --- Hareket Türü Seçenekleri ---
export const HareketTuruOptions = [
  { value: 'Zimmet', label: 'Zimmet Verme' },
  { value: 'Iade', label: 'İade Alma' },
  { value: 'Kayit', label: 'Kayıt' },
  { value: 'Devir', label: 'Devir' },
  { value: 'Kayip', label: 'Kayıp Bildirimi' },
  { value: 'KondisyonGuncelleme', label: 'Kondisyon Güncelleme' },
  { value: 'DepoTransferi', label: 'Depo Transferi' },
  { value: 'Dusum', label: 'Düşüm' },
];

// --- Malzeme Kondisyonu Seçenekleri ---
export const MalzemeKondisyonuOptions = [
  { value: 'Saglam', label: 'Sağlam' },
  { value: 'Arizali', label: 'Arızalı' },
  { value: 'Hurda', label: 'Hurda' },
];