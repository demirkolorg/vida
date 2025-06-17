import { prisma } from '../../config/db.js';
import helper from '../../utils/helper.js';
import { VarlıkKod, HumanName, PrismaName } from './base.js';
import { AuditStatusEnum } from '@prisma/client';
import bcrypt from 'bcryptjs';
import BuroService from '../buro/service.js';

const service = {
  checkExistsById: async id => {
    const result = await prisma[PrismaName].findUnique({ where: { id } });
    if (!result || result.status === AuditStatusEnum.Silindi) {
      throw new Error(`${id} ID'sine sahip aktif ${HumanName} bulunamadı.`);
    }
    return result;
  },

  checkBuroCount: async buroId => {
    try {
      return await prisma[PrismaName].count({ where: { buroId, status: AuditStatusEnum.Aktif } });
    } catch (error) {
      throw error;
    }
  },

  // Personel malzeme sayılarını hesaplayan yardımcı fonksiyon
  calculateMalzemeSayilari: async personelId => {
    try {
      // Son hareket türü Zimmet veya Devir olan ve hedef personeli bu personel olan malzemeleri bul
      const zimmetliHareketler = await prisma.malzemeHareket.findMany({
        where: {
          hedefPersonelId: personelId,
          hareketTuru: { in: ['Zimmet', 'Devir'] },
          status: AuditStatusEnum.Aktif,
        },
        include: {
          malzeme: {
            select: {
              id: true,
              malzemeTipi: true,
              malzemeHareketleri: {
                where: { status: AuditStatusEnum.Aktif },
                orderBy: { createdAt: 'desc' },
                take: 1,
                select: {
                  hareketTuru: true,
                  hedefPersonelId: true,
                  kaynakPersonelId: true,
                },
              },
            },
          },
        },
      });

      // Gerçekten zimmetli olan malzemeleri filtrele
      const aktifZimmetler = zimmetliHareketler.filter(hareket => {
        const sonHareket = hareket.malzeme.malzemeHareketleri[0];
        // Son hareket zimmet/devir ise ve hedef personel bu personel ise aktif zimmet
        return sonHareket && ['Zimmet', 'Devir'].includes(sonHareket.hareketTuru) && sonHareket.hedefPersonelId === personelId;
      });

      const toplamMalzeme = aktifZimmetler.length;
      const demirbasSayisi = aktifZimmetler.filter(hareket => hareket.malzeme.malzemeTipi === 'Demirbas').length;
      const sarfSayisi = aktifZimmetler.filter(hareket => hareket.malzeme.malzemeTipi === 'Sarf').length;

      return {
        malzemeSayisi: toplamMalzeme,
        demirbasSayisi,
        sarfSayisi,
      };
    } catch (error) {
      console.error('Malzeme sayıları hesaplanırken hata:', error);
      return {
        malzemeSayisi: 0,
        demirbasSayisi: 0,
        sarfSayisi: 0,
      };
    }
  },

  // Tüm personeller için malzeme sayılarını toplu hesaplayan fonksiyon
  // getPersonelZimmetleri fonksiyonunu doğrudan kullanarak kesin doğru sonuç alır
  bulkCalculateMalzemeSayilari: async personelIds => {
    try {
      const malzemeSayilariMap = {};

      // MalzemeHareket servisini import et (eğer yoksa)
      const MalzemeHareketService = (await import('../malzemehareket/service.js')).default;

      // Her personel için getPersonelZimmetleri fonksiyonunu kullan
      for (const personelId of personelIds) {
        try {
          // getPersonelZimmetleri fonksiyonunu kullan - bu fonksiyon test edilmiş ve doğru
          const zimmetliMalzemeler = await MalzemeHareketService.getPersonelZimmetleri({
            personelId,
          });

          // Sayıları hesapla
          const toplamMalzeme = zimmetliMalzemeler.length;
          const demirbasSayisi = zimmetliMalzemeler.filter(malzeme => malzeme.malzemeTipi === 'Demirbas').length;
          const sarfSayisi = zimmetliMalzemeler.filter(malzeme => malzeme.malzemeTipi === 'Sarf').length;

          malzemeSayilariMap[personelId] = {
            malzemeSayisi: toplamMalzeme,
            demirbasSayisi,
            sarfSayisi,
          };
        } catch (personelError) {
          console.error(`Personel ${personelId} için malzeme sayıları hesaplanırken hata:`, personelError);
          // Hata durumunda 0 değerleri ata
          malzemeSayilariMap[personelId] = {
            malzemeSayisi: 0,
            demirbasSayisi: 0,
            sarfSayisi: 0,
          };
        }
      }

      return malzemeSayilariMap;
    } catch (error) {
      console.error('Toplu malzeme sayıları hesaplanırken hata:', error);
      return {};
    }
  },

  getAll: async () => {
    try {
      const personeller = await prisma[PrismaName].findMany({
        where: { status: AuditStatusEnum.Aktif },
        orderBy: { ad: 'asc' },
        include: {
          buro: {
            select: {
              id: true,
              ad: true,
              sube: {
                select: { id: true, ad: true },
              },
            },
          },
          createdBy: { select: { id: true, ad: true, soyad: true, avatar: true } },
          updatedBy: { select: { id: true, ad: true, soyad: true, avatar: true } },
        },
      });

      // Tüm personeller için malzeme sayılarını hesapla
      const personelIds = personeller.map(p => p.id);
      const malzemeSayilariMap = await service.bulkCalculateMalzemeSayilari(personelIds);

      // Personel verilerine malzeme sayılarını ekle
      const personellerWithMalzemeSayilari = personeller.map(personel => ({
        ...personel,
        ...(malzemeSayilariMap[personel.id] || {
          malzemeSayisi: 0,
          demirbasSayisi: 0,
          sarfSayisi: 0,
        }),
      }));

      return personellerWithMalzemeSayilari;
    } catch (error) {
      throw error;
    }
  },

  getByQuery: async (data = {}) => {
    try {
      const whereClause = {};
      if (data.status) whereClause.status = data.status;
      if (data.ad) whereClause.ad = data.ad;
      if (data.sicil) whereClause.sicil = data.sicil;
      if (data.role) whereClause.role = data.role;
      if (data.buroId) whereClause.buroId = data.buroId;
      if (data.isUser !== undefined) whereClause.isUser = data.isUser;
      if (data.isAmir !== undefined) whereClause.isAmir = data.isAmir;

      const personeller = await prisma[PrismaName].findMany({
        where: whereClause,
        orderBy: { ad: 'asc' },
        include: {
          buro: {
            select: {
              id: true,
              ad: true,
              sube: {
                select: { id: true, ad: true },
              },
            },
          },
          createdBy: { select: { id: true, ad: true, soyad: true, avatar: true } },
          updatedBy: { select: { id: true, ad: true, soyad: true, avatar: true } },
        },
      });

      // Tüm personeller için malzeme sayılarını hesapla
      const personelIds = personeller.map(p => p.id);
      const malzemeSayilariMap = await service.bulkCalculateMalzemeSayilari(personelIds);

      // Personel verilerine malzeme sayılarını ekle
      const personellerWithMalzemeSayilari = personeller.map(personel => ({
        ...personel,
        ...(malzemeSayilariMap[personel.id] || {
          malzemeSayisi: 0,
          demirbasSayisi: 0,
          sarfSayisi: 0,
        }),
      }));

      return personellerWithMalzemeSayilari;
    } catch (error) {
      throw error;
    }
  },

  getById: async data => {
    try {
      await service.checkExistsById(data.id);

      const personel = await prisma[PrismaName].findFirst({
        where: { id: data.id, status: AuditStatusEnum.Aktif },
        include: {
          buro: {
            select: {
              id: true,
              ad: true,
              sube: {
                select: { id: true, ad: true },
              },
            },
          },
          createdBy: { select: { id: true, ad: true, soyad: true, avatar: true } },
          updatedBy: { select: { id: true, ad: true, soyad: true, avatar: true } },
        },
      });

      // Bu personel için malzeme sayılarını hesapla
      const malzemeSayilari = await service.calculateMalzemeSayilari(data.id);

      return {
        ...personel,
        ...malzemeSayilari,
      };
    } catch (error) {
      throw error;
    }
  },

  create: async data => {
    try {
      if (data.buroId) await BuroService.checkExistsById(data.buroId);

      const createPayload = {
        ad: data.ad,
        soyad: data.soyad, // Eksik olan soyad alanı eklendi
        sicil: data.sicil,
        role: data.role || 'Personel',
        isUser: data.isUser || false,
        isAmir: data.isAmir || false,
        status: AuditStatusEnum.Aktif,
        createdById: data.islemYapanKullanici,
      };

      if (data.buroId !== undefined) createPayload.buroId = data.buroId;
      if (data.avatar !== undefined) createPayload.avatar = data.avatar;

      // Parola varsa hashle
      if (data.parola) {
        const saltRounds = 10;
        createPayload.parola = await bcrypt.hash(data.parola, saltRounds);
      }

      const yeniPersonel = await prisma[PrismaName].create({
        data: createPayload,
        include: {
          buro: {
            select: {
              id: true,
              ad: true,
              sube: {
                select: { id: true, ad: true },
              },
            },
          },
          createdBy: { select: { id: true, ad: true, soyad: true, avatar: true } },
          updatedBy: { select: { id: true, ad: true, soyad: true, avatar: true } },
        },
      });

      // Yeni personel için malzeme sayıları (başlangıçta 0 olacak)
      return {
        ...yeniPersonel,
        malzemeSayisi: 0,
        demirbasSayisi: 0,
        sarfSayisi: 0,
      };
    } catch (error) {
      throw error;
    }
  },

  update: async data => {
    try {
      const existingEntity = await service.checkExistsById(data.id);
      const updatePayload = { updatedById: data.islemYapanKullanici };

      if (data.ad !== undefined) updatePayload.ad = data.ad;
      if (data.soyad !== undefined) updatePayload.soyad = data.soyad; // Soyad güncellemesi eklendi
      if (data.sicil !== undefined) updatePayload.sicil = data.sicil;
      if (data.role !== undefined) updatePayload.role = data.role;
      if (data.avatar !== undefined) updatePayload.avatar = data.avatar;
      if (data.isUser !== undefined) updatePayload.isUser = data.isUser;
      if (data.isAmir !== undefined) updatePayload.isAmir = data.isAmir;

      if (data.buroId !== undefined) {
        if (data.buroId !== null && data.buroId !== existingEntity.buroId) {
          await BuroService.checkExistsById(data.buroId);
        }
        updatePayload.buroId = data.buroId;
      }

      // ÖNEMLİ: Parola sadece gönderilmişse ve boş değilse hashle
      if (data.parola && data.parola.trim() !== '') {
        const saltRounds = 10;
        updatePayload.parola = await bcrypt.hash(data.parola, saltRounds);
      }
      // Parola gönderilmemişse veya boşsa, mevcut parolayı koru (updatePayload'a ekleme)

      const güncelPersonel = await prisma[PrismaName].update({
        where: { id: data.id },
        data: updatePayload,
        include: {
          buro: {
            select: {
              id: true,
              ad: true,
              sube: {
                select: { id: true, ad: true },
              },
            },
          },
          createdBy: { select: { id: true, ad: true, soyad: true, avatar: true } },
          updatedBy: { select: { id: true, ad: true, soyad: true, avatar: true } },
        },
      });

      // Güncellenmiş personel için malzeme sayılarını hesapla
      const malzemeSayilari = await service.calculateMalzemeSayilari(data.id);

      return {
        ...güncelPersonel,
        ...malzemeSayilari,
      };
    } catch (error) {
      throw error;
    }
  },

  updateStatus: async data => {
    try {
      await service.checkExistsById(data.id);

      if (!Object.values(AuditStatusEnum).includes(data.status)) throw new Error(`Girilen '${data.status}' durumu geçerli bir durum değildir.`);

      const updatePayload = {
        updatedById: data.islemYapanKullanici,
        status: data.status,
      };

      const güncelPersonel = await prisma[PrismaName].update({
        where: { id: data.id },
        data: updatePayload,
        include: {
          buro: {
            select: {
              id: true,
              ad: true,
              sube: {
                select: { id: true, ad: true },
              },
            },
          },
          createdBy: { select: { id: true, ad: true, soyad: true, avatar: true } },
          updatedBy: { select: { id: true, ad: true, soyad: true, avatar: true } },
        },
      });

      // Durum güncellenmiş personel için malzeme sayılarını hesapla
      const malzemeSayilari = await service.calculateMalzemeSayilari(data.id);

      return {
        ...güncelPersonel,
        ...malzemeSayilari,
      };
    } catch (error) {
      throw error;
    }
  },

  delete: async data => {
    try {
      await service.checkExistsById(data.id);

      return await prisma[PrismaName].update({
        where: { id: data.id },
        data: {
          status: AuditStatusEnum.Silindi,
          updatedById: data.islemYapanKullanici,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  search: async data => {
    try {
      const whereClause = { status: AuditStatusEnum.Aktif };

      if (data.ad) whereClause.ad = { contains: data.ad, mode: 'insensitive' };
      if (data.sicil) whereClause.sicil = { contains: data.sicil, mode: 'insensitive' };
      if (data.role) whereClause.role = data.role;
      if (data.buroId) whereClause.buroId = data.buroId;

      const personeller = await prisma[PrismaName].findMany({
        where: whereClause,
        orderBy: { ad: 'asc' },
        include: {
          buro: {
            select: {
              id: true,
              ad: true,
              sube: {
                select: { id: true, ad: true },
              },
            },
          },
          createdBy: { select: { id: true, ad: true, soyad: true, avatar: true } },
          updatedBy: { select: { id: true, ad: true, soyad: true, avatar: true } },
        },
      });

      // Arama sonuçları için malzeme sayılarını hesapla
      const personelIds = personeller.map(p => p.id);
      const malzemeSayilariMap = await service.bulkCalculateMalzemeSayilari(personelIds);

      // Personel verilerine malzeme sayılarını ekle
      const personellerWithMalzemeSayilari = personeller.map(personel => ({
        ...personel,
        ...(malzemeSayilariMap[personel.id] || {
          malzemeSayisi: 0,
          demirbasSayisi: 0,
          sarfSayisi: 0,
        }),
      }));

      return personellerWithMalzemeSayilari;
    } catch (error) {
      throw error;
    }
  },
};

export default service;
