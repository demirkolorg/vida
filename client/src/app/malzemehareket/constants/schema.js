// client/src/app/malzemeHareket/constants/schema.js
import { z } from 'zod';

// Hareket türleri enum
export const HareketTuruEnum = {
  Kayit: 'Kayit',
  Zimmet: 'Zimmet',
  Iade: 'Iade',
  Devir: 'Devir',
  DepoTransferi: 'DepoTransferi',
  KondisyonGuncelleme: 'KondisyonGuncelleme',
  Kayip: 'Kayip',
  Dusum: 'Dusum'
};

// Malzeme kondisyonları enum
export const MalzemeKondisyonuEnum = {
  Saglam: 'Saglam',
  Arizali: 'Arizali',
  Hurda: 'Hurda'
};

// Hareket türü seçenekleri
export const HareketTuruOptions = [
  { value: HareketTuruEnum.Kayit, label: 'Kayıt' },
  { value: HareketTuruEnum.Zimmet, label: 'Zimmet' },
  { value: HareketTuruEnum.Iade, label: 'İade' },
  { value: HareketTuruEnum.Devir, label: 'Devir' },
  { value: HareketTuruEnum.DepoTransferi, label: 'Depo Transferi' },
  { value: HareketTuruEnum.KondisyonGuncelleme, label: 'Kondisyon Güncelleme' },
  { value: HareketTuruEnum.Kayip, label: 'Kayıp' },
  { value: HareketTuruEnum.Dusum, label: 'Düşüm' }
];

// Kondisyon seçenekleri
export const KondisyonOptions = [
  { value: MalzemeKondisyonuEnum.Saglam, label: 'Sağlam' },
  { value: MalzemeKondisyonuEnum.Arizali, label: 'Arızalı' },
  { value: MalzemeKondisyonuEnum.Hurda, label: 'Hurda' }
];

// İlişkili modeller için temel şemalar
export const Malzeme_BaseSchema_for_MalzemeHareket_Relation = z.object({
  id: z.string().min(1, 'Geçersiz Malzeme ID.'),
  vidaNo: z.string().optional().nullable(),
  sabitKodu: z.object({
    ad: z.string().optional().nullable()
  }).optional().nullable(),
  marka: z.object({
    ad: z.string().optional().nullable()
  }).optional().nullable(),
  model: z.object({
    ad: z.string().optional().nullable()
  }).optional().nullable(),
});

export const Personel_BaseSchema_for_MalzemeHareket_Relation = z.object({
  id: z.string().min(1, 'Geçersiz Personel ID.'),
  ad: z.string().optional().nullable(),
  sicil: z.string().optional().nullable(),
});

export const Konum_BaseSchema_for_MalzemeHareket_Relation = z.object({
  id: z.string().min(1, 'Geçersiz Konum ID.'),
  ad: z.string().min(1, { message: 'İlişkili Konum adı boş olamaz.' }),
  depo: z.object({
    ad: z.string().optional().nullable()
  }).optional().nullable(),
});

// Ana MalzemeHareket şeması
export const MalzemeHareket_Schema = z.object({
  id: z.string().min(1, 'Geçersiz Malzeme Hareket ID formatı.'),
  malzemeId: z.string().min(1, { message: 'Malzeme seçimi zorunludur.' }),
  hareketTuru: z.enum(Object.values(HareketTuruEnum), { 
    message: 'Geçerli bir hareket türü seçiniz.' 
  }),
  malzemeKondisyonu: z.enum(Object.values(MalzemeKondisyonuEnum), { 
    message: 'Geçerli bir malzeme kondisyonu seçiniz.' 
  }),
  islemTarihi: z.date().optional(),
  kaynakPersonelId: z.string().optional().nullable(),
  hedefPersonelId: z.string().optional().nullable(),
  konumId: z.string().optional().nullable(),
  aciklama: z.string().optional().nullable(),

  // İlişkiler
  malzeme: Malzeme_BaseSchema_for_MalzemeHareket_Relation.optional(),
  kaynakPersonel: Personel_BaseSchema_for_MalzemeHareket_Relation.optional().nullable(),
  hedefPersonel: Personel_BaseSchema_for_MalzemeHareket_Relation.optional().nullable(),
  konum: Konum_BaseSchema_for_MalzemeHareket_Relation.optional().nullable(),

  status: z.string().optional().default('Aktif'),
});

// Oluşturma şeması - hareket türüne göre dinamik validasyon
export const MalzemeHareket_CreateSchema = z.object({
  malzemeId: z.string({ required_error: 'Malzeme seçimi zorunludur.' }).min(1, { message: 'Geçerli bir malzeme seçiniz.' }),
  hareketTuru: z.enum(Object.values(HareketTuruEnum), { 
    required_error: 'Hareket türü zorunludur.',
    message: 'Geçerli bir hareket türü seçiniz.' 
  }),
  malzemeKondisyonu: z.enum(Object.values(MalzemeKondisyonuEnum), { 
    required_error: 'Malzeme kondisyonu zorunludur.',
    message: 'Geçerli bir malzeme kondisyonu seçiniz.' 
  }),
  islemTarihi: z.date().optional(),
  kaynakPersonelId: z.string().optional().nullable(),
  hedefPersonelId: z.string().optional().nullable(),
  konumId: z.string().optional().nullable(),
  aciklama: z.string().optional().nullable(),
}).superRefine((data, ctx) => {
  // Hareket türüne göre zorunlu alan kontrolü
  switch (data.hareketTuru) {
    case HareketTuruEnum.Kayit:
      if (!data.konumId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Kayıt işlemi için konum seçimi zorunludur.",
          path: ["konumId"]
        });
      }
      break;
    
    case HareketTuruEnum.Zimmet:
      if (!data.hedefPersonelId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Zimmet işlemi için hedef personel seçimi zorunludur.",
          path: ["hedefPersonelId"]
        });
      }
      break;
    
    case HareketTuruEnum.Iade:
      if (!data.kaynakPersonelId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "İade işlemi için kaynak personel seçimi zorunludur.",
          path: ["kaynakPersonelId"]
        });
      }
      if (!data.konumId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "İade işlemi için konum seçimi zorunludur.",
          path: ["konumId"]
        });
      }
      break;
    
    case HareketTuruEnum.Devir:
      if (!data.kaynakPersonelId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Devir işlemi için kaynak personel seçimi zorunludur.",
          path: ["kaynakPersonelId"]
        });
      }
      if (!data.hedefPersonelId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Devir işlemi için hedef personel seçimi zorunludur.",
          path: ["hedefPersonelId"]
        });
      }
      if (data.kaynakPersonelId === data.hedefPersonelId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Kaynak ve hedef personel aynı olamaz.",
          path: ["hedefPersonelId"]
        });
      }
      break;
    
    case HareketTuruEnum.DepoTransferi:
      if (!data.konumId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Depo transferi için hedef konum seçimi zorunludur.",
          path: ["konumId"]
        });
      }
      break;
  }
});

// Güncelleme şeması - sadece açıklama güncellenebilir
export const MalzemeHareket_UpdateSchema = z.object({
  aciklama: z.string().optional().nullable(),
}).partial();

// Form input şeması
export const MalzemeHareket_FormInputSchema = MalzemeHareket_CreateSchema;