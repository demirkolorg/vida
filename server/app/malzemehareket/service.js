// server/app/malzemeHareket/service.js
import { prisma } from '../../config/db.js';
import helper from '../../utils/helper.js';
import { HizmetName, PrismaName, HumanName } from './base.js';
import { AuditStatusEnum, HareketTuruEnum, MalzemeKondisyonuEnum } from '@prisma/client';
import MalzemeService from '../malzeme/service.js';
import PersonelService from '../personel/service.js';
import KonumService from '../konum/service.js';

const service = {
  checkExistsById: async id => {
    const result = await prisma[PrismaName].findUnique({ where: { id } });
    if (!result || result.status === AuditStatusEnum.Silindi) {
      throw new Error(`${id} ID'sine sahip aktif ${HumanName} bulunamadı.`);
    }
    return result;
  },

  getAll: async () => {
    try {
      return await prisma[PrismaName].findMany({
        where: { status: AuditStatusEnum.Aktif },
        orderBy: { islemTarihi: 'desc' },
        include: {
          malzeme: {
            select: {
              id: true,
              vidaNo: true,
              sabitKodu: { select: { ad: true } },
              marka: { select: { ad: true } },
              model: { select: { ad: true } }
            }
          },
          kaynakPersonel: { select: { id: true, ad: true, sicil: true } },
          hedefPersonel: { select: { id: true, ad: true, sicil: true } },
          konum: { 
            select: { 
              id: true, 
              ad: true,
              depo: { select: { ad: true } }
            }
          },
          createdBy: { select: { id: true, ad: true, sicil: true } },
        },
      });
    } catch (error) {
      throw error;
    }
  },

  getByQuery: async (data = {}) => {
    try {
      const whereClause = {};
      if (data.status) whereClause.status = data.status;
      if (data.malzemeId) whereClause.malzemeId = data.malzemeId;
      if (data.hareketTuru) whereClause.hareketTuru = data.hareketTuru;
      if (data.malzemeKondisyonu) whereClause.malzemeKondisyonu = data.malzemeKondisyonu;
      if (data.kaynakPersonelId) whereClause.kaynakPersonelId = data.kaynakPersonelId;
      if (data.hedefPersonelId) whereClause.hedefPersonelId = data.hedefPersonelId;
      if (data.konumId) whereClause.konumId = data.konumId;

      // Tarih aralığı filtresi
      if (data.startDate || data.endDate) {
        whereClause.islemTarihi = {};
        if (data.startDate) whereClause.islemTarihi.gte = new Date(data.startDate);
        if (data.endDate) whereClause.islemTarihi.lte = new Date(data.endDate);
      }

      return await prisma[PrismaName].findMany({
        where: whereClause,
        orderBy: { islemTarihi: 'desc' },
        include: {
          malzeme: {
            select: {
              id: true,
              vidaNo: true,
              sabitKodu: { select: { ad: true } },
              marka: { select: { ad: true } },
              model: { select: { ad: true } }
            }
          },
          kaynakPersonel: { select: { id: true, ad: true, sicil: true } },
          hedefPersonel: { select: { id: true, ad: true, sicil: true } },
          konum: { 
            select: { 
              id: true, 
              ad: true,
              depo: { select: { ad: true } }
            }
          },
          createdBy: { select: { id: true, ad: true, sicil: true } },
        },
      });
    } catch (error) {
      throw error;
    }
  },

  getById: async data => {
    try {
      await service.checkExistsById(data.id);

      return await prisma[PrismaName].findFirst({
        where: { id: data.id, status: AuditStatusEnum.Aktif },
        include: {
          malzeme: {
            include: {
              sabitKodu: true,
              marka: true,
              model: true,
              birim: { select: { ad: true } },
              sube: { select: { ad: true } }
            }
          },
          kaynakPersonel: { 
            select: { 
              id: true, 
              ad: true, 
              sicil: true,
              buro: {
                select: {
                  ad: true,
                  sube: { select: { ad: true } }
                }
              }
            }
          },
          hedefPersonel: { 
            select: { 
              id: true, 
              ad: true, 
              sicil: true,
              buro: {
                select: {
                  ad: true,
                  sube: { select: { ad: true } }
                }
              }
            }
          },
          konum: { 
            include: { 
              depo: { select: { ad: true } }
            }
          },
          createdBy: { select: { id: true, ad: true, sicil: true } },
        },
      });
    } catch (error) {
      throw error;
    }
  },

  // İş süreçlerine özel fonksiyonlar
  
  // Malzeme Zimmet İşlemi
  zimmetVer: async data => {
    try {
      // Validasyonlar
      await MalzemeService.checkExistsById(data.malzemeId);
      await PersonelService.checkExistsById(data.hedefPersonelId);
      if (data.kaynakPersonelId) await PersonelService.checkExistsById(data.kaynakPersonelId);

      const yeniId = helper.generateId(HizmetName);
      
      const createPayload = {
        id: yeniId,
        hareketTuru: HareketTuruEnum.Zimmet,
        malzemeKondisyonu: data.malzemeKondisyonu || MalzemeKondisyonuEnum.Saglam,
        malzemeId: data.malzemeId,
        hedefPersonelId: data.hedefPersonelId,
        status: AuditStatusEnum.Aktif,
        createdById: data.islemYapanKullanici,
      };

      if (data.kaynakPersonelId) createPayload.kaynakPersonelId = data.kaynakPersonelId;
      if (data.konumId) {
        await KonumService.checkExistsById(data.konumId);
        createPayload.konumId = data.konumId;
      }
      if (data.aciklama) createPayload.aciklama = data.aciklama;
      if (data.islemTarihi) createPayload.islemTarihi = new Date(data.islemTarihi);

      return await prisma[PrismaName].create({
        data: createPayload,
        include: {
          malzeme: {
            select: {
              vidaNo: true,
              sabitKodu: { select: { ad: true } }
            }
          },
          hedefPersonel: { select: { ad: true, sicil: true } },
        },
      });
    } catch (error) {
      throw error;
    }
  },

  // Malzeme İade İşlemi
  iadeAl: async data => {
    try {
      await MalzemeService.checkExistsById(data.malzemeId);
      if (data.kaynakPersonelId) await PersonelService.checkExistsById(data.kaynakPersonelId);
      if (data.hedefPersonelId) await PersonelService.checkExistsById(data.hedefPersonelId);

      const yeniId = helper.generateId(HizmetName);
      
      const createPayload = {
        id: yeniId,
        hareketTuru: HareketTuruEnum.Iade,
        malzemeKondisyonu: data.malzemeKondisyonu || MalzemeKondisyonuEnum.Saglam,
        malzemeId: data.malzemeId,
        status: AuditStatusEnum.Aktif,
        createdById: data.islemYapanKullanici,
      };

      if (data.kaynakPersonelId) createPayload.kaynakPersonelId = data.kaynakPersonelId;
      if (data.hedefPersonelId) createPayload.hedefPersonelId = data.hedefPersonelId;
      if (data.konumId) {
        await KonumService.checkExistsById(data.konumId);
        createPayload.konumId = data.konumId;
      }
      if (data.aciklama) createPayload.aciklama = data.aciklama;
      if (data.islemTarihi) createPayload.islemTarihi = new Date(data.islemTarihi);

      return await prisma[PrismaName].create({
        data: createPayload,
        include: {
          malzeme: {
            select: {
              vidaNo: true,
              sabitKodu: { select: { ad: true } }
            }
          },
          kaynakPersonel: { select: { ad: true, sicil: true } },
        },
      });
    } catch (error) {
      throw error;
    }
  },

  // Malzeme Devir İşlemi
  devirYap: async data => {
    try {
      await MalzemeService.checkExistsById(data.malzemeId);
      await PersonelService.checkExistsById(data.kaynakPersonelId);
      await PersonelService.checkExistsById(data.hedefPersonelId);

      const yeniId = helper.generateId(HizmetName);
      
      const createPayload = {
        id: yeniId,
        hareketTuru: HareketTuruEnum.Devir,
        malzemeKondisyonu: data.malzemeKondisyonu || MalzemeKondisyonuEnum.Saglam,
        malzemeId: data.malzemeId,
        kaynakPersonelId: data.kaynakPersonelId,
        hedefPersonelId: data.hedefPersonelId,
        status: AuditStatusEnum.Aktif,
        createdById: data.islemYapanKullanici,
      };

      if (data.konumId) {
        await KonumService.checkExistsById(data.konumId);
        createPayload.konumId = data.konumId;
      }
      if (data.aciklama) createPayload.aciklama = data.aciklama;
      if (data.islemTarihi) createPayload.islemTarihi = new Date(data.islemTarihi);

      return await prisma[PrismaName].create({
        data: createPayload,
        include: {
          malzeme: {
            select: {
              vidaNo: true,
              sabitKodu: { select: { ad: true } }
            }
          },
          kaynakPersonel: { select: { ad: true, sicil: true } },
          hedefPersonel: { select: { ad: true, sicil: true } },
        },
      });
    } catch (error) {
      throw error;
    }
  },

  // Depo Transfer İşlemi
  depoTransferi: async data => {
    try {
      await MalzemeService.checkExistsById(data.malzemeId);
      await KonumService.checkExistsById(data.konumId);
      if (data.kaynakPersonelId) await PersonelService.checkExistsById(data.kaynakPersonelId);

      const yeniId = helper.generateId(HizmetName);
      
      const createPayload = {
        id: yeniId,
        hareketTuru: HareketTuruEnum.DepoTransferi,
        malzemeKondisyonu: data.malzemeKondisyonu || MalzemeKondisyonuEnum.Saglam,
        malzemeId: data.malzemeId,
        konumId: data.konumId,
        status: AuditStatusEnum.Aktif,
        createdById: data.islemYapanKullanici,
      };

      if (data.kaynakPersonelId) createPayload.kaynakPersonelId = data.kaynakPersonelId;
      if (data.hedefPersonelId) createPayload.hedefPersonelId = data.hedefPersonelId;
      if (data.aciklama) createPayload.aciklama = data.aciklama;
      if (data.islemTarihi) createPayload.islemTarihi = new Date(data.islemTarihi);

      return await prisma[PrismaName].create({
        data: createPayload,
        include: {
          malzeme: {
            select: {
              vidaNo: true,
              sabitKodu: { select: { ad: true } }
            }
          },
          konum: {
            select: {
              ad: true,
              depo: { select: { ad: true } }
            }
          },
        },
      });
    } catch (error) {
      throw error;
    }
  },

  // Kayıp Bildirimi
  kayipBildir: async data => {
    try {
      await MalzemeService.checkExistsById(data.malzemeId);
      if (data.kaynakPersonelId) await PersonelService.checkExistsById(data.kaynakPersonelId);

      const yeniId = helper.generateId(HizmetName);
      
      const createPayload = {
        id: yeniId,
        hareketTuru: HareketTuruEnum.Kayip,
        malzemeKondisyonu: MalzemeKondisyonuEnum.Hurda, // Kayıp malzemeler Hurda olarak işaretlenir
        malzemeId: data.malzemeId,
        status: AuditStatusEnum.Aktif,
        createdById: data.islemYapanKullanici,
      };

      if (data.kaynakPersonelId) createPayload.kaynakPersonelId = data.kaynakPersonelId;
      if (data.aciklama) createPayload.aciklama = data.aciklama;
      if (data.islemTarihi) createPayload.islemTarihi = new Date(data.islemTarihi);

      return await prisma[PrismaName].create({
        data: createPayload,
        include: {
          malzeme: {
            select: {
              vidaNo: true,
              sabitKodu: { select: { ad: true } }
            }
          },
          kaynakPersonel: { select: { ad: true, sicil: true } },
        },
      });
    } catch (error) {
      throw error;
    }
  },

  // Kondisyon Güncelleme
  kondisyonGuncelle: async data => {
    try {
      await MalzemeService.checkExistsById(data.malzemeId);
      if (data.kaynakPersonelId) await PersonelService.checkExistsById(data.kaynakPersonelId);

      const yeniId = helper.generateId(HizmetName);
      
      const createPayload = {
        id: yeniId,
        hareketTuru: HareketTuruEnum.KondisyonGuncelleme,
        malzemeKondisyonu: data.malzemeKondisyonu,
        malzemeId: data.malzemeId,
        status: AuditStatusEnum.Aktif,
        createdById: data.islemYapanKullanici,
      };

      if (data.kaynakPersonelId) createPayload.kaynakPersonelId = data.kaynakPersonelId;
      if (data.aciklama) createPayload.aciklama = data.aciklama;
      if (data.islemTarihi) createPayload.islemTarihi = new Date(data.islemTarihi);

      return await prisma[PrismaName].create({
        data: createPayload,
        include: {
          malzeme: {
            select: {
              vidaNo: true,
              sabitKodu: { select: { ad: true } }
            }
          },
          kaynakPersonel: { select: { ad: true, sicil: true } },
        },
      });
    } catch (error) {
      throw error;
    }
  },

  // Genel Create (Tüm hareket türleri için)
  create: async data => {
    try {
      // Validasyonlar
      await MalzemeService.checkExistsById(data.malzemeId);
      if (data.kaynakPersonelId) await PersonelService.checkExistsById(data.kaynakPersonelId);
      if (data.hedefPersonelId) await PersonelService.checkExistsById(data.hedefPersonelId);
      if (data.konumId) await KonumService.checkExistsById(data.konumId);

      const yeniId = helper.generateId(HizmetName);
      
      const createPayload = {
        id: yeniId,
        hareketTuru: data.hareketTuru,
        malzemeKondisyonu: data.malzemeKondisyonu,
        malzemeId: data.malzemeId,
        status: AuditStatusEnum.Aktif,
        createdById: data.islemYapanKullanici,
      };

      if (data.kaynakPersonelId) createPayload.kaynakPersonelId = data.kaynakPersonelId;
      if (data.hedefPersonelId) createPayload.hedefPersonelId = data.hedefPersonelId;
      if (data.konumId) createPayload.konumId = data.konumId;
      if (data.aciklama) createPayload.aciklama = data.aciklama;
      if (data.islemTarihi) createPayload.islemTarihi = new Date(data.islemTarihi);

      return await prisma[PrismaName].create({
        data: createPayload,
        include: {
          malzeme: {
            select: {
              id: true,
              vidaNo: true,
              sabitKodu: { select: { ad: true } },
              marka: { select: { ad: true } },
              model: { select: { ad: true } }
            }
          },
          kaynakPersonel: { select: { id: true, ad: true, sicil: true } },
          hedefPersonel: { select: { id: true, ad: true, sicil: true } },
          konum: { 
            select: { 
              id: true, 
              ad: true,
              depo: { select: { ad: true } }
            }
          },
          createdBy: { select: { id: true, ad: true, sicil: true } },
        },
      });
    } catch (error) {
      throw error;
    }
  },

  update: async data => {
    try {
      await service.checkExistsById(data.id);

      const updatePayload = {};
      
      if (data.hareketTuru !== undefined) updatePayload.hareketTuru = data.hareketTuru;
      if (data.malzemeKondisyonu !== undefined) updatePayload.malzemeKondisyonu = data.malzemeKondisyonu;
      
      if (data.kaynakPersonelId !== undefined) {
        if (data.kaynakPersonelId) await PersonelService.checkExistsById(data.kaynakPersonelId);
        updatePayload.kaynakPersonelId = data.kaynakPersonelId;
      }
      
      if (data.hedefPersonelId !== undefined) {
        if (data.hedefPersonelId) await PersonelService.checkExistsById(data.hedefPersonelId);
        updatePayload.hedefPersonelId = data.hedefPersonelId;
      }
      
      if (data.konumId !== undefined) {
        if (data.konumId) await KonumService.checkExistsById(data.konumId);
        updatePayload.konumId = data.konumId;
      }
      
      if (data.aciklama !== undefined) updatePayload.aciklama = data.aciklama;
      if (data.islemTarihi !== undefined) updatePayload.islemTarihi = new Date(data.islemTarihi);

      return await prisma[PrismaName].update({
        where: { id: data.id },
        data: updatePayload,
        include: {
          malzeme: {
            select: {
              id: true,
              vidaNo: true,
              sabitKodu: { select: { ad: true } },
              marka: { select: { ad: true } },
              model: { select: { ad: true } }
            }
          },
          kaynakPersonel: { select: { id: true, ad: true, sicil: true } },
          hedefPersonel: { select: { id: true, ad: true, sicil: true } },
          konum: { 
            select: { 
              id: true, 
              ad: true,
              depo: { select: { ad: true } }
            }
          },
          createdBy: { select: { id: true, ad: true, sicil: true } },
        },
      });
    } catch (error) {
      throw error;
    }
  },

  updateStatus: async data => {
    try {
      await service.checkExistsById(data.id);

      if (!Object.values(AuditStatusEnum).includes(data.status)) {
        throw new Error(`Girilen '${data.status}' durumu geçerli bir durum değildir.`);
      }

      return await prisma[PrismaName].update({
        where: { id: data.id },
        data: { status: data.status },
        include: {
          malzeme: {
            select: {
              vidaNo: true,
              sabitKodu: { select: { ad: true } }
            }
          },
        },
      });
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
        },
      });
    } catch (error) {
      throw error;
    }
  },

  search: async data => {
    try {
      const whereClause = { status: AuditStatusEnum.Aktif };

      if (data.hareketTuru) whereClause.hareketTuru = data.hareketTuru;
      if (data.malzemeKondisyonu) whereClause.malzemeKondisyonu = data.malzemeKondisyonu;
      if (data.malzemeId) whereClause.malzemeId = data.malzemeId;
      if (data.kaynakPersonelId) whereClause.kaynakPersonelId = data.kaynakPersonelId;
      if (data.hedefPersonelId) whereClause.hedefPersonelId = data.hedefPersonelId;
      if (data.konumId) whereClause.konumId = data.konumId;

      // Metin araması
      if (data.aciklama) {
        whereClause.aciklama = { contains: data.aciklama, mode: 'insensitive' };
      }

      return await prisma[PrismaName].findMany({
        where: whereClause,
        orderBy: { islemTarihi: 'desc' },
        include: {
          malzeme: {
            select: {
              id: true,
              vidaNo: true,
              sabitKodu: { select: { ad: true } },
              marka: { select: { ad: true } },
              model: { select: { ad: true } }
            }
          },
          kaynakPersonel: { select: { id: true, ad: true, sicil: true } },
          hedefPersonel: { select: { id: true, ad: true, sicil: true } },
          konum: { 
            select: { 
              id: true, 
              ad: true,
              depo: { select: { ad: true } }
            }
          },
          createdBy: { select: { id: true, ad: true, sicil: true } },
        },
      });
    } catch (error) {
      throw error;
    }
  },

  // Raporlama fonksiyonları
  getMalzemeGecmisi: async data => {
    try {
      await MalzemeService.checkExistsById(data.malzemeId);

      return await prisma[PrismaName].findMany({
        where: { 
          malzemeId: data.malzemeId,
          status: AuditStatusEnum.Aktif 
        },
        orderBy: { islemTarihi: 'desc' },
        include: {
          kaynakPersonel: { select: { ad: true, sicil: true } },
          hedefPersonel: { select: { ad: true, sicil: true } },
          konum: { 
            select: { 
              ad: true,
              depo: { select: { ad: true } }
            }
          },
          createdBy: { select: { ad: true, sicil: true } },
        },
      });
    } catch (error) {
      throw error;
    }
  },

  getPersonelZimmetleri: async data => {
    try {
      await PersonelService.checkExistsById(data.personelId);

      return await prisma[PrismaName].findMany({
        where: { 
          hedefPersonelId: data.personelId,
          hareketTuru: HareketTuruEnum.Zimmet,
          status: AuditStatusEnum.Aktif 
        },
        orderBy: { islemTarihi: 'desc' },
        include: {
          malzeme: {
            select: {
              vidaNo: true,
              sabitKodu: { select: { ad: true } },
              marka: { select: { ad: true } },
              model: { select: { ad: true } }
            }
          },
        },
      });
    } catch (error) {
      throw error;
    }
  },

  getHareketIstatistikleri: async (data = {}) => {
    try {
      const whereClause = { status: AuditStatusEnum.Aktif };
      
      if (data.startDate) whereClause.islemTarihi = { gte: new Date(data.startDate) };
      if (data.endDate) {
        whereClause.islemTarihi = { 
          ...whereClause.islemTarihi,
          lte: new Date(data.endDate) 
        };
      }

      const hareketTurleriGrouped = await prisma[PrismaName].groupBy({
        by: ['hareketTuru'],
        where: whereClause,
        _count: { id: true },
      });

      const kondisyonGrouped = await prisma[PrismaName].groupBy({
        by: ['malzemeKondisyonu'],
        where: whereClause,
        _count: { id: true },
      });

      return {
        hareketTurleri: hareketTurleriGrouped,
        kondisyonlar: kondisyonGrouped,
      };
    } catch (error) {
      throw error;
    }
  },
};

export default service;