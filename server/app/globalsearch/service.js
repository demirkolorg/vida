// server/app/globalSearch/service.js
import { prisma } from '../../config/db.js';
import { HumanName } from './base.js';
import { AuditStatusEnum } from '@prisma/client';

// Türkçe karakter normalizasyon yardımcı fonksiyonu
const normalizeTurkishText = text => {
  if (!text) return '';

  return text.replace(/İ/g, 'i').replace(/I/g, 'ı').replace(/Ğ/g, 'ğ').replace(/Ü/g, 'ü').replace(/Ş/g, 'ş').replace(/Ö/g, 'ö').replace(/Ç/g, 'ç').toLowerCase();
};

const service = {
  // Ana global search fonksiyonu
  globalSearch: async data => {
    try {
      const { query, entityTypes = [], limit = 50, includeInactive = false, includeRelations = true } = data;

      // Arama terimini Türkçe karakter duyarlı olarak temizle
      const searchTerm = query.replace(/İ/g, 'i');
      console.log('searchTerm', searchTerm);

      if (searchTerm.length < 2) throw new Error('Arama terimi en az 2 karakter olmalıdır.');
      const searchResults = {};
      const statusClause = includeInactive ? {} : { status: AuditStatusEnum.Aktif };
      const availableEntities = ['birim', 'sube', 'buro', 'personel', 'malzeme', 'malzemeHareket', 'marka', 'model', 'depo', 'konum', 'sabitKodu'];
      const entitiesToSearch = entityTypes.length > 0 ? entityTypes.filter(et => availableEntities.includes(et)) : availableEntities;
      for (const entityType of entitiesToSearch) {
        try {
          searchResults[entityType] = await service[`search${entityType.charAt(0).toUpperCase() + entityType.slice(1)}`](searchTerm, statusClause, limit, includeRelations);
        } catch (error) {
          console.error(`Error searching ${entityType}:`, error);
          searchResults[entityType] = [];
        }
      }

      return searchResults;
    } catch (error) {
      throw error;
    }
  },
  // Birim arama
  searchBirim: async (searchTerm, statusClause, limit, includeRelations) => {
    return await prisma.birim.findMany({
      where: {
        ...statusClause,
        OR: [{ ad: { contains: searchTerm, mode: 'insensitive' } }, { aciklama: { contains: searchTerm, mode: 'insensitive' } }],
      },
      include: includeRelations
        ? {
            subeler: {
              where: { status: AuditStatusEnum.Aktif },
              select: { id: true, ad: true },
            },
            malzemeler: {
              where: { status: AuditStatusEnum.Aktif },
              select: { id: true, vidaNo: true },
            },
            createdBy: { select: { id: true, ad: true, soyad: true, avatar: true } },
            updatedBy: { select: { id: true, ad: true, soyad: true, avatar: true } },
          }
        : {},
      orderBy: { ad: 'asc' },
      take: limit,
    });
  },

  // Şube arama
  searchSube: async (searchTerm, statusClause, limit, includeRelations) => {
    return await prisma.sube.findMany({
      where: {
        ...statusClause,
        OR: [{ ad: { contains: searchTerm, mode: 'insensitive' } }, { aciklama: { contains: searchTerm, mode: 'insensitive' } }],
      },
      include: includeRelations
        ? {
            birim: { select: { id: true, ad: true } },
            burolar: {
              where: { status: AuditStatusEnum.Aktif },
              select: { id: true, ad: true },
            },
            malzemeler: {
              where: { status: AuditStatusEnum.Aktif },
              select: { id: true, vidaNo: true },
            },
            createdBy: { select: { id: true, ad: true, soyad: true, avatar: true } },
          }
        : {},
      orderBy: { ad: 'asc' },
      take: limit,
    });
  },

  // Büro arama
  searchBuro: async (searchTerm, statusClause, limit, includeRelations) => {
    return await prisma.buro.findMany({
      where: {
        ...statusClause,
        OR: [{ ad: { contains: searchTerm, mode: 'insensitive' } }, { aciklama: { contains: searchTerm, mode: 'insensitive' } }],
      },
      include: includeRelations
        ? {
            sube: {
              select: {
                id: true,
                ad: true,
                birim: { select: { id: true, ad: true } },
              },
            },
            amir: { select: { id: true, ad: true, soyad: true, avatar: true } },
            personeller: {
              where: { status: AuditStatusEnum.Aktif },
              select: { id: true, ad: true, soyad: true, sicil: true },
            },
            createdBy: { select: { id: true, ad: true, soyad: true, avatar: true } },
          }
        : {},
      orderBy: { ad: 'asc' },
      take: limit,
    });
  },

  // Personel arama
  searchPersonel: async (searchTerm, statusClause, limit, includeRelations) => {
    return await prisma.personel.findMany({
      where: {
        ...statusClause,
        OR: [
          { ad: { contains: searchTerm, mode: 'insensitive' } },
          { soyad: { contains: searchTerm, mode: 'insensitive' } },
          { sicil: { contains: searchTerm, mode: 'insensitive' } },
          {
            AND: [{ ad: { contains: searchTerm.split(' ')[0] || '', mode: 'insensitive' } }, { soyad: { contains: searchTerm.split(' ')[1] || '', mode: 'insensitive' } }],
          },
        ],
      },
      select: {
        id: true,
        ad: true,
        soyad: true,
        sicil: true,
        role: true,
        avatar: true,
        status: true,
        isUser: true,
        isAmir: true,
        ...(includeRelations && {
          buro: {
            select: {
              id: true,
              ad: true,
              sube: {
                select: {
                  id: true,
                  ad: true,
                  birim: { select: { id: true, ad: true } },
                },
              },
            },
          },
        }),
      },
      orderBy: [{ ad: 'asc' }, { soyad: 'asc' }],
      take: limit,
    });
  },

  // Malzeme arama
  searchMalzeme: async (searchTerm, statusClause, limit, includeRelations) => {
    return await prisma.malzeme.findMany({
      where: {
        ...statusClause,
        OR: [{ vidaNo: { contains: searchTerm, mode: 'insensitive' } }, { aciklama: { contains: searchTerm, mode: 'insensitive' } }, { kod: { contains: searchTerm, mode: 'insensitive' } }, { bademSeriNo: { contains: searchTerm, mode: 'insensitive' } }, { etmysSeriNo: { contains: searchTerm, mode: 'insensitive' } }, { stokDemirbasNo: { contains: searchTerm, mode: 'insensitive' } }],
      },
      include: includeRelations
        ? {
            marka: { select: { id: true, ad: true } },
            model: { select: { id: true, ad: true } },
            sabitKodu: { select: { id: true, ad: true } },
            birim: { select: { id: true, ad: true } },
            sube: { select: { id: true, ad: true } },
            malzemeHareketleri: {
              orderBy: { islemTarihi: 'desc' },
              take: 1,
              include: {
                hedefPersonel: { select: { id: true, ad: true, soyad: true } },
                kaynakPersonel: { select: { id: true, ad: true, soyad: true } },
                hedefKonum: {
                  select: {
                    id: true,
                    ad: true,
                    depo: { select: { id: true, ad: true } },
                  },
                },
                kaynakKonum: {
                  select: {
                    id: true,
                    ad: true,
                    depo: { select: { id: true, ad: true } },
                  },
                },
              },
            },
            createdBy: { select: { id: true, ad: true, soyad: true, avatar: true } },
          }
        : {},
      orderBy: { vidaNo: 'asc' },
      take: limit,
    });
  },

  // Malzeme Hareket arama
  searchMalzemeHareket: async (searchTerm, statusClause, limit, includeRelations) => {
    return await prisma.malzemeHareket.findMany({
      where: {
        ...statusClause,
        OR: [{ aciklama: { contains: searchTerm, mode: 'insensitive' } }, { malzeme: { vidaNo: { contains: searchTerm, mode: 'insensitive' } } }, { malzeme: { aciklama: { contains: searchTerm, mode: 'insensitive' } } }],
      },
      include: includeRelations
        ? {
            malzeme: {
              select: {
                id: true,
                vidaNo: true,
                aciklama: true,
                marka: { select: { ad: true } },
                model: { select: { ad: true } },
              },
            },
            hedefPersonel: { select: { id: true, ad: true, soyad: true } },
            kaynakPersonel: { select: { id: true, ad: true, soyad: true } },
            hedefKonum: {
              select: {
                id: true,
                ad: true,
                depo: { select: { id: true, ad: true } },
              },
            },
            kaynakKonum: {
              select: {
                id: true,
                ad: true,
                depo: { select: { id: true, ad: true } },
              },
            },
            createdBy: { select: { id: true, ad: true, soyad: true, avatar: true } },
          }
        : {},
      orderBy: { islemTarihi: 'desc' },
      take: limit,
    });
  },

  // Marka arama
  searchMarka: async (searchTerm, statusClause, limit, includeRelations) => {
    return await prisma.marka.findMany({
      where: {
        ...statusClause,
        OR: [{ ad: { contains: searchTerm, mode: 'insensitive' } }, { aciklama: { contains: searchTerm, mode: 'insensitive' } }],
      },
      include: includeRelations
        ? {
            modeller: {
              where: { status: AuditStatusEnum.Aktif },
              select: { id: true, ad: true },
            },
            malzemeler: {
              where: { status: AuditStatusEnum.Aktif },
              select: { id: true, vidaNo: true },
            },
            createdBy: { select: { id: true, ad: true, soyad: true, avatar: true } },
          }
        : {},
      orderBy: { ad: 'asc' },
      take: limit,
    });
  },

  // Model arama
  searchModel: async (searchTerm, statusClause, limit, includeRelations) => {
    return await prisma.model.findMany({
      where: {
        ...statusClause,
        OR: [{ ad: { contains: searchTerm, mode: 'insensitive' } }, { aciklama: { contains: searchTerm, mode: 'insensitive' } }],
      },
      include: includeRelations
        ? {
            marka: { select: { id: true, ad: true } },
            malzemeler: {
              where: { status: AuditStatusEnum.Aktif },
              select: { id: true, vidaNo: true },
            },
            createdBy: { select: { id: true, ad: true, soyad: true, avatar: true } },
          }
        : {},
      orderBy: { ad: 'asc' },
      take: limit,
    });
  },

  // Depo arama
  searchDepo: async (searchTerm, statusClause, limit, includeRelations) => {
    return await prisma.depo.findMany({
      where: {
        ...statusClause,
        OR: [{ ad: { contains: searchTerm, mode: 'insensitive' } }, { aciklama: { contains: searchTerm, mode: 'insensitive' } }],
      },
      include: includeRelations
        ? {
            konumlar: {
              where: { status: AuditStatusEnum.Aktif },
              select: { id: true, ad: true },
            },
            createdBy: { select: { id: true, ad: true, soyad: true, avatar: true } },
          }
        : {},
      orderBy: { ad: 'asc' },
      take: limit,
    });
  },

  // Konum arama
  searchKonum: async (searchTerm, statusClause, limit, includeRelations) => {
    return await prisma.konum.findMany({
      where: {
        ...statusClause,
        OR: [{ ad: { contains: searchTerm, mode: 'insensitive' } }, { aciklama: { contains: searchTerm, mode: 'insensitive' } }],
      },
      include: includeRelations
        ? {
            depo: { select: { id: true, ad: true } },
            createdBy: { select: { id: true, ad: true, soyad: true, avatar: true } },
          }
        : {},
      orderBy: { ad: 'asc' },
      take: limit,
    });
  },

  // Sabit Kodu arama
  searchSabitKodu: async (searchTerm, statusClause, limit, includeRelations) => {
    return await prisma.sabitKodu.findMany({
      where: {
        ...statusClause,
        OR: [{ ad: { contains: searchTerm, mode: 'insensitive' } }, { aciklama: { contains: searchTerm, mode: 'insensitive' } }],
      },
      include: includeRelations
        ? {
            malzemeler: {
              where: { status: AuditStatusEnum.Aktif },
              select: { id: true, vidaNo: true },
            },
            createdBy: { select: { id: true, ad: true, soyad: true, avatar: true } },
          }
        : {},
      orderBy: { ad: 'asc' },
      take: limit,
    });
  },

  // Hızlı arama (sadece isim/başlık alanları)
  quickSearch: async data => {
    try {
      const { query, limit = 10 } = data;
      const searchTerm = query.trim().toLowerCase();

      if (searchTerm.length < 1) {
        return {};
      }

      const statusClause = { status: AuditStatusEnum.Aktif };

      // Hızlı sonuçlar için daha az alan ve include
      const quickResults = {};

      // En çok aranan entity'ler için hızlı arama
      const quickSearchPromises = [
        prisma.malzeme
          .findMany({
            where: {
              ...statusClause,
              vidaNo: { contains: searchTerm, mode: 'insensitive' },
            },
            select: { id: true, vidaNo: true, aciklama: true },
            take: limit,
          })
          .then(results => {
            quickResults.malzeme = results;
          }),

        prisma.personel
          .findMany({
            where: {
              ...statusClause,
              OR: [{ ad: { contains: searchTerm, mode: 'insensitive' } }, { soyad: { contains: searchTerm, mode: 'insensitive' } }, { sicil: { contains: searchTerm, mode: 'insensitive' } }],
            },
            select: { id: true, ad: true, soyad: true, sicil: true, avatar: true },
            take: limit,
          })
          .then(results => {
            quickResults.personel = results;
          }),

        prisma.birim
          .findMany({
            where: {
              ...statusClause,
              ad: { contains: searchTerm, mode: 'insensitive' },
            },
            select: { id: true, ad: true, aciklama: true },
            take: limit,
          })
          .then(results => {
            quickResults.birim = results;
          }),
      ];

      await Promise.all(quickSearchPromises);

      return quickResults;
    } catch (error) {
      throw error;
    }
  },
};

export default service;
