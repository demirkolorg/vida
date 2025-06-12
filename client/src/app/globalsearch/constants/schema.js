// client/src/app/globalSearch/constants/schema.js
import { z } from 'zod';

// Entity types için enum şema
export const EntityTypeEnum = z.enum([
  'birim', 'sube', 'buro', 'personel', 'malzeme', 'malzemeHareket',
  'marka', 'model', 'depo', 'konum', 'sabitKodu'
]);

// Global Search için ana şema
export const GlobalSearch_RequestSchema = z.object({
  query: z.string()
    .min(2, { message: 'Arama terimi en az 2 karakter olmalıdır.' })
    .max(100, { message: 'Arama terimi en fazla 100 karakter olabilir.' }),
  entityTypes: z.array(EntityTypeEnum).optional().default([]),
  limit: z.number().min(1).max(100).optional().default(50),
  includeInactive: z.boolean().optional().default(false),
  includeRelations: z.boolean().optional().default(true)
});

// Quick Search şeması
export const QuickSearch_RequestSchema = z.object({
  query: z.string()
    .min(1, { message: 'Arama terimi en az 1 karakter olmalıdır.' })
    .max(50, { message: 'Hızlı arama terimi en fazla 50 karakter olabilir.' }),
  limit: z.number().min(1).max(20).optional().default(10)
});

// Search Result Item şeması (her entity için genel)
export const SearchResultItem_Schema = z.object({
  id: z.string(),
  ad: z.string().optional().nullable(),
  aciklama: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  // Entity-specific fields will be added dynamically
});

// Malzeme Search Result şeması
export const MalzemeSearchResult_Schema = SearchResultItem_Schema.extend({
  vidaNo: z.string().optional().nullable(),
  kod: z.string().optional().nullable(),
  malzemeTipi: z.string().optional(),
  marka: z.object({
    id: z.string(),
    ad: z.string()
  }).optional().nullable(),
  model: z.object({
    id: z.string(),
    ad: z.string()
  }).optional().nullable(),
  malzemeHareketleri: z.array(z.object({
    id: z.string(),
    hareketTuru: z.string(),
    malzemeKondisyonu: z.string(),
    islemTarihi: z.string(),
    hedefPersonel: z.object({
      id: z.string(),
      ad: z.string(),
      soyad: z.string()
    }).optional().nullable(),
    hedefKonum: z.object({
      id: z.string(),
      ad: z.string(),
      depo: z.object({
        id: z.string(),
        ad: z.string()
      }).optional()
    }).optional().nullable()
  })).optional().default([])
});

// Personel Search Result şeması
export const PersonelSearchResult_Schema = SearchResultItem_Schema.extend({
  soyad: z.string().optional().nullable(),
  sicil: z.string().optional().nullable(),
  role: z.string().optional(),
  avatar: z.string().optional().nullable(),
  buro: z.object({
    id: z.string(),
    ad: z.string(),
    sube: z.object({
      id: z.string(),
      ad: z.string(),
      birim: z.object({
        id: z.string(),
        ad: z.string()
      }).optional()
    }).optional()
  }).optional().nullable()
});

// Birim Search Result şeması
export const BirimSearchResult_Schema = SearchResultItem_Schema.extend({
  subeler: z.array(z.object({
    id: z.string(),
    ad: z.string()
  })).optional().default([]),
  malzemeler: z.array(z.object({
    id: z.string(),
    vidaNo: z.string().optional().nullable()
  })).optional().default([])
});

// Global Search Response şeması
export const GlobalSearchResponse_Schema = z.object({
  birim: z.array(BirimSearchResult_Schema).optional().default([]),
  sube: z.array(SearchResultItem_Schema).optional().default([]),
  buro: z.array(SearchResultItem_Schema).optional().default([]),
  personel: z.array(PersonelSearchResult_Schema).optional().default([]),
  malzeme: z.array(MalzemeSearchResult_Schema).optional().default([]),
  malzemeHareket: z.array(SearchResultItem_Schema).optional().default([]),
  marka: z.array(SearchResultItem_Schema).optional().default([]),
  model: z.array(SearchResultItem_Schema).optional().default([]),
  depo: z.array(SearchResultItem_Schema).optional().default([]),
  konum: z.array(SearchResultItem_Schema).optional().default([]),
  sabitKodu: z.array(SearchResultItem_Schema).optional().default([])
});

// Recent Search şeması
export const RecentSearch_Schema = z.object({
  query: z.string(),
  timestamp: z.string(),
  entityTypes: z.array(EntityTypeEnum).optional().default([]),
  resultsCount: z.number().optional().default(0)
});