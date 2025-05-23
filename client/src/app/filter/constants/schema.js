// client/src/app/savedFilter/constants/schema.js (Yeni dosya veya uygun bir yere)
import { z } from 'zod';

// Personel için temel şema (SavedFilter ilişkisi için)
// Bu, Birim şemasındakiyle aynı veya benzer olabilir.
// İhtiyaç duyulan minimum alanları içermelidir.
export const Personel_BaseSchema_for_SavedFilter_Relation = z.object({
  id: z.string().min(1, 'Geçersiz Personel ID.'),
  ad: z.string().optional().nullable(),
  soyad: z.string().optional().nullable(), // Soyad da eklenebilir
  // avatar: z.string().url().optional().nullable(), // Eğer avatar gösterilecekse
});

// --- Ana Kaydedilmiş Filtre Şeması (API'den gelen veri için) ---
export const SavedFilter_Schema = z.object({
  id: z.string().min(1, 'Geçersiz Filtre ID formatı.'),
  filterName: z.string().min(1, { message: 'Filtre adı boş olamaz.' }),
  entityType: z.string().min(1, { message: 'Varlık türü (entityType) boş olamaz.' }),
  filterState: z.any(), // z.record(z.any()) veya daha spesifik bir Json şeması olabilir
                        // TanStack Table state'i karmaşık olabileceği için z.any() başlangıç için uygun olabilir.
                        // Daha güvenli olması için:
                        // filterState: z.object({
                        //   columnFilters: z.array(z.object({ id: z.string(), value: z.any() })).optional(),
                        //   globalFilter: z.any().optional(),
                        //   sorting: z.array(z.object({ id: z.string(), desc: z.boolean() })).optional(),
                        //   pagination: z.object({ pageIndex: z.number(), pageSize: z.number() }).optional(),
                        //   columnVisibility: z.record(z.boolean()).optional()
                        // }).nullable(),
  description: z.string().optional().nullable(),

  status: z.string().optional().default('Aktif'), // Veya enum: z.enum(['Aktif', 'Pasif', 'Silindi'])
  createdAt: z.string().datetime().or(z.date()).optional(), // API'den string, istemcide Date olabilir
  createdById: z.string(),
  createdBy: Personel_BaseSchema_for_SavedFilter_Relation.optional().nullable(),
  updatedAt: z.string().datetime().or(z.date()).optional(),
  updatedById: z.string().optional().nullable(),
  updatedBy: Personel_BaseSchema_for_SavedFilter_Relation.optional().nullable(),
});

// --- Oluşturma Şeması (API'ye gönderilecek veri için) ---
export const SavedFilter_CreateSchema = z.object({
  filterName: z.string({ required_error: 'Filtre adı zorunludur.' }).min(1, { message: 'Filtre adı en az 1 karakter olmalıdır.' }),
  entityType: z.string({ required_error: 'Varlık türü (entityType) zorunludur.' }).min(1, { message: 'Varlık türü boş olamaz.' }),
  filterState: z.any({ required_error: 'Filtre durumu (filterState) zorunludur.' }), // Oluştururken filterState zorunlu olmalı
  description: z.string().optional().nullable(),
  // createdById backend'de req.user.id'den alınacak, client'tan gönderilmesine gerek yok.
});

// --- Güncelleme Şeması (API'ye gönderilecek veri için) ---
export const SavedFilter_UpdateSchema = z.object({
  filterName: z.string().min(1, { message: 'Filtre adı en az 1 karakter olmalıdır.' }).optional(),
  // entityType genellikle güncellenmez ama ihtiyaç olursa eklenebilir.
  // entityType: z.string().min(1, { message: 'Varlık türü boş olamaz.' }).optional(),
  filterState: z.any().optional(), // filterState güncellenebilir
  description: z.string().optional().nullable(),
  // updatedById backend'de req.user.id'den alınacak.
}).partial(); // .partial() tüm alanları opsiyonel yapar, sadece gönderilenler güncellenir.

// --- Form Girdi Şeması (Kaydetme/Düzenleme dialoğu için) ---
// Bu şema, FilterManager.jsx içindeki form için kullanılacak.
export const SavedFilter_FormInputSchema = z.object({
  filterName: z.string({ required_error: 'Filtre adı zorunludur.' }).min(1, { message: 'Filtre adı en az 1 karakter olmalıdır.' }),
  description: z.string().max(255, { message: 'Açıklama en fazla 255 karakter olabilir.' }).optional().nullable(),
  // filterState ve entityType formda direkt input olarak yer almaz,
  // onlar `table.getState()` ve `entityType` prop'undan alınır.
});