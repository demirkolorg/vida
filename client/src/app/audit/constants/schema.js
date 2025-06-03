import { z } from 'zod';

// Personel için temel şema (AuditLog ilişkisi için)
// Bu şema, AuditLog.createdBy alanı için kullanılacaktır.
export const Personel_BaseSchema_for_AuditLog_Relation = z.object({
  id: z.string().min(1, 'Geçersiz Personel ID.'),
  ad: z.string().optional().nullable(),
  sicil: z.string().optional().nullable(),
  // Personel modelinden AuditLog'da göstermek isteyebileceğiniz diğer temel alanlar eklenebilir.
});

// --- Ana AuditLog Şeması ---
// Veritabanından okunan veya tam bir AuditLog nesnesini temsil eden şema.
export const AuditLog_Schema = z.object({
  id: z.string().min(1, 'Geçersiz AuditLog ID.'),
  level: z.string(), // Create şemasında zorunluluk ve min uzunluk kontrolü yapılır
  rota: z.string(),  // Create şemasında zorunluluk ve min uzunluk kontrolü yapılır
  hizmet: z.string(), // Create şemasında zorunluluk ve min uzunluk kontrolü yapılır
  log: z.any(), // Prisma'daki Json tipi için genel bir karşılık (herhangi bir JSON değeri olabilir)
  createdAt: z.date(), // Prisma'dan Date nesnesi olarak gelir

  createdById: z.string().optional().nullable(),
  createdBy: Personel_BaseSchema_for_AuditLog_Relation.optional().nullable(),
});

// --- Oluşturma Şeması ---
// Yeni bir AuditLog kaydı oluşturmak için kullanılacak şema.
// 'id' ve 'createdAt' gibi alanlar genellikle veritabanı/ORM tarafından otomatik yönetilir.
export const AuditLog_CreateSchema = z.object({
  level: z.string({ required_error: 'Level zorunludur.' }).min(1, { message: 'Level boş olamaz.' }),
  rota: z.string({ required_error: 'Rota zorunludur.' }).min(1, { message: 'Rota boş olamaz.' }),
  hizmet: z.string({ required_error: 'Hizmet zorunludur.' }).min(1, { message: 'Hizmet boş olamaz.' }),
  log: z.any({ required_error: 'Log içeriği zorunludur.' }), // Log içeriğinin var olması beklenir
  createdById: z.string({ invalid_type_error: 'Geçersiz Personel ID formatı.' }).optional().nullable(), // Oluşturan kullanıcı ID'si, opsiyonel olabilir
});

// --- Güncelleme Şeması ---
// AuditLog kayıtları genellikle güncellenmez (immutable) olduğundan bu şema pratikte sık kullanılmaz.
// Teorik bir güncelleme senaryosu veya özel durumlar için tanımlanmıştır.
export const AuditLog_UpdateSchema = z.object({
  // Normal şartlarda audit logları güncellenmez.
  // Eğer spesifik bir ihtiyaç doğrultusunda bir alanın güncellenmesi gerekirse,
  // o alan buraya eklenebilir. Örneğin:
  // level: z.string().min(1, { message: 'Level boş olamaz.' }).optional(),
  // Ancak bu, audit loglarının doğasına aykırı olabilir.
}).partial(); // .partial() ile tanımlanan tüm alanlar opsiyonel hale gelir.

// --- Form Girdi Şeması ---
// AuditLog oluşturma işlemleri için API istek gövdelerinden veya (varsa) formlardan gelen veriyi doğrulamak için.
// Genellikle CreateSchema ile aynı veya çok benzerdir.
export const AuditLog_FormInputSchema = z.object({
  level: z.string({ required_error: 'Level zorunludur.' }).min(1, { message: 'Level boş olamaz.' }),
  rota: z.string({ required_error: 'Rota zorunludur.' }).min(1, { message: 'Rota boş olamaz.' }),
  hizmet: z.string({ required_error: 'Hizmet zorunludur.' }).min(1, { message: 'Hizmet boş olamaz.' }),
  log: z.any({ required_error: 'Log içeriği zorunludur.' }),
  createdById: z.string({ invalid_type_error: 'Geçersiz Personel ID formatı.' }).optional().nullable(),
});