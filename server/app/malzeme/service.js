import { prisma } from '../../config/db.js';
import helper from '../../utils/helper.js';
import { HizmetName, PrismaName, HumanName } from './base.js';
import { AuditStatusEnum, MalzemeTipiEnum } from '@prisma/client';
import BirimService from '../birim/service.js';
import SubeService from '../sube/service.js';
import SabitKoduService from '../sabitKodu/service.js';
import MarkaService from '../marka/service.js';
import ModelService from '../model/service.js';

const service = {
  checkExistsById: async id => {
    const result = await prisma[PrismaName].findUnique({ where: { id } });
    if (!result || result.status === AuditStatusEnum.Silindi) {
      throw new Error(`${id} ID'sine sahip aktif ${HumanName} bulunamadı.`);
    }
    return result;
  },

  checkVidaNoExists: async (vidaNo, excludeId = null) => {
    if (!vidaNo) return;
    const whereClause = { vidaNo, status: { not: AuditStatusEnum.Silindi } };
    if (excludeId) whereClause.id = { not: excludeId };
    
    const result = await prisma[PrismaName].findFirst({ where: whereClause });
    if (result) {
      throw new Error(`${vidaNo} Vida No'ya sahip bir ${HumanName} zaten mevcut.`);
    }
  },

  checkStokDemirbasNoExists: async (stokDemirbasNo, excludeId = null) => {
    if (!stokDemirbasNo) return;
    const whereClause = { stokDemirbasNo, status: { not: AuditStatusEnum.Silindi } };
    if (excludeId) whereClause.id = { not: excludeId };
    
    const result = await prisma[PrismaName].findFirst({ where: whereClause });
    if (result) {
      throw new Error(`${stokDemirbasNo} Stok/Demirbaş No'ya sahip bir ${HumanName} zaten mevcut.`);
    }
  },

  getAll: async () => {
    try {
      return await prisma[PrismaName].findMany({
        where: { status: AuditStatusEnum.Aktif },
        orderBy: { createdAt: 'desc' },
        include: {
          birim: { select: { id: true, ad: true } },
          sube: { select: { id: true, ad: true } },
          sabitKodu: { select: { id: true, ad: true } },
          marka: { select: { id: true, ad: true } },
          model: { select: { id: true, ad: true } },
          malzemeHareketleri: {
            where: { status: AuditStatusEnum.Aktif },
            select: { 
              id: true, 
              hareketTuru: true, 
              islemTarihi: true,
              malzemeKondisyonu: true 
            },
            orderBy: { createdAt: 'desc' },
            take: 1
          },
          createdBy: { select: { id: true, ad: true, avatar: true } },
          updatedBy: { select: { id: true, ad: true, avatar: true } },
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
      if (data.malzemeTipi) whereClause.malzemeTipi = data.malzemeTipi;
      if (data.birimId) whereClause.birimId = data.birimId;
      if (data.subeId) whereClause.subeId = data.subeId;
      if (data.sabitKoduId) whereClause.sabitKoduId = data.sabitKoduId;
      if (data.markaId) whereClause.markaId = data.markaId;
      if (data.modelId) whereClause.modelId = data.modelId;
      if (data.vidaNo) whereClause.vidaNo = { contains: data.vidaNo, mode: 'insensitive' };

      return await prisma[PrismaName].findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        include: {
          birim: { select: { id: true, ad: true } },
          sube: { select: { id: true, ad: true } },
          sabitKodu: { select: { id: true, ad: true } },
          marka: { select: { id: true, ad: true } },
          model: { select: { id: true, ad: true } },
          malzemeHareketleri: {
            where: { status: AuditStatusEnum.Aktif },
            select: { 
              id: true, 
              hareketTuru: true, 
              islemTarihi: true,
              malzemeKondisyonu: true 
            },
            orderBy: { createdAt: 'desc' },
            take: 1
          },
          createdBy: { select: { id: true, ad: true, avatar: true } },
          updatedBy: { select: { id: true, ad: true, avatar: true } },
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
          birim: { select: { id: true, ad: true } },
          sube: { select: { id: true, ad: true } },
          sabitKodu: { select: { id: true, ad: true } },
          marka: { select: { id: true, ad: true } },
          model: { select: { id: true, ad: true } },
          malzemeHareketleri: {
            where: { status: AuditStatusEnum.Aktif },
            select: { 
              id: true, 
              hareketTuru: true, 
              islemTarihi: true,
              malzemeKondisyonu: true,
              kaynakPersonel: { select: { ad: true, sicil: true } },
              hedefPersonel: { select: { ad: true, sicil: true } },
              konum: { select: { ad: true, depo: { select: { ad: true } } } },
              aciklama: true
            },
            orderBy: { islemTarihi: 'desc' }
          },
          createdBy: { select: { id: true, ad: true, avatar: true } },
          updatedBy: { select: { id: true, ad: true, avatar: true } },
        },
      });
    } catch (error) {
      throw error;
    }
  },

  getByBirimId: async data => {
    try {
      await BirimService.checkExistsById(data.birimId);

      return await prisma[PrismaName].findMany({
        where: { birimId: data.birimId, status: AuditStatusEnum.Aktif },
        orderBy: { createdAt: 'desc' },
        include: {
          birim: { select: { id: true, ad: true } },
          sube: { select: { id: true, ad: true } },
          sabitKodu: { select: { id: true, ad: true } },
          marka: { select: { id: true, ad: true } },
          model: { select: { id: true, ad: true } },
        },
      });
    } catch (error) {
      throw error;
    }
  },

  getBySubeId: async data => {
    try {
      await SubeService.checkExistsById(data.subeId);

      return await prisma[PrismaName].findMany({
        where: { subeId: data.subeId, status: AuditStatusEnum.Aktif },
        orderBy: { createdAt: 'desc' },
        include: {
          birim: { select: { id: true, ad: true } },
          sube: { select: { id: true, ad: true } },
          sabitKodu: { select: { id: true, ad: true } },
          marka: { select: { id: true, ad: true } },
          model: { select: { id: true, ad: true } },
        },
      });
    } catch (error) {
      throw error;
    }
  },

  create: async data => {
    try {
      // İlişkili kayıtları kontrol et
      await BirimService.checkExistsById(data.birimId);
      await SubeService.checkExistsById(data.subeId);
      await SabitKoduService.checkExistsById(data.sabitKoduId);
      await MarkaService.checkExistsById(data.markaId);
      await ModelService.checkExistsById(data.modelId);

      // Benzersizlik kontrolü
      if (data.vidaNo) await service.checkVidaNoExists(data.vidaNo);
      if (data.stokDemirbasNo) await service.checkStokDemirbasNoExists(data.stokDemirbasNo);

      const yeniId = helper.generateId(HizmetName);
      const createPayload = {
        id: yeniId,
        malzemeTipi: data.malzemeTipi,
        birimId: data.birimId,
        subeId: data.subeId,
        sabitKoduId: data.sabitKoduId,
        markaId: data.markaId,
        modelId: data.modelId,
        status: AuditStatusEnum.Aktif,
        createdById: data.islemYapanKullanici,
      };

      // Opsiyonel alanlar
      if (data.vidaNo !== undefined) createPayload.vidaNo = data.vidaNo;
      if (data.kod !== undefined) createPayload.kod = data.kod;
      if (data.bademSeriNo !== undefined) createPayload.bademSeriNo = data.bademSeriNo;
      if (data.etmysSeriNo !== undefined) createPayload.etmysSeriNo = data.etmysSeriNo;
      if (data.stokDemirbasNo !== undefined) createPayload.stokDemirbasNo = data.stokDemirbasNo;
      if (data.aciklama !== undefined) createPayload.aciklama = data.aciklama;
      if (data.kayitTarihi !== undefined) createPayload.kayitTarihi = data.kayitTarihi;

      return await prisma[PrismaName].create({
        data: createPayload,
        include: {
          birim: { select: { id: true, ad: true } },
          sube: { select: { id: true, ad: true } },
          sabitKodu: { select: { id: true, ad: true } },
          marka: { select: { id: true, ad: true } },
          model: { select: { id: true, ad: true } },
          createdBy: { select: { id: true, ad: true, avatar: true } },
          updatedBy: { select: { id: true, ad: true, avatar: true } },
          malzemeHareketleri: {
            where: { status: AuditStatusEnum.Aktif },
            select: { 
              id: true, 
              hareketTuru: true, 
              islemTarihi: true,
              malzemeKondisyonu: true 
            },
            orderBy: { createdAt: 'desc' },
            take: 1
          },
        },
      });
    } catch (error) {
      throw error;
    }
  },

  update: async data => {
    try {
      const existingEntity = await service.checkExistsById(data.id);

      const updatePayload = { updatedById: data.islemYapanKullanici };

      // İlişkili kayıtları kontrol et (değiştiyse)
      if (data.birimId !== undefined && data.birimId !== existingEntity.birimId) {
        await BirimService.checkExistsById(data.birimId);
        updatePayload.birimId = data.birimId;
      }
      if (data.subeId !== undefined && data.subeId !== existingEntity.subeId) {
        await SubeService.checkExistsById(data.subeId);
        updatePayload.subeId = data.subeId;
      }
      if (data.sabitKoduId !== undefined && data.sabitKoduId !== existingEntity.sabitKoduId) {
        await SabitKoduService.checkExistsById(data.sabitKoduId);
        updatePayload.sabitKoduId = data.sabitKoduId;
      }
      if (data.markaId !== undefined && data.markaId !== existingEntity.markaId) {
        await MarkaService.checkExistsById(data.markaId);
        updatePayload.markaId = data.markaId;
      }
      if (data.modelId !== undefined && data.modelId !== existingEntity.modelId) {
        await ModelService.checkExistsById(data.modelId);
        updatePayload.modelId = data.modelId;
      }

      // Benzersizlik kontrolü (değiştiyse)
      if (data.vidaNo !== undefined && data.vidaNo !== existingEntity.vidaNo) {
        await service.checkVidaNoExists(data.vidaNo, data.id);
        updatePayload.vidaNo = data.vidaNo;
      }
      if (data.stokDemirbasNo !== undefined && data.stokDemirbasNo !== existingEntity.stokDemirbasNo) {
        await service.checkStokDemirbasNoExists(data.stokDemirbasNo, data.id);
        updatePayload.stokDemirbasNo = data.stokDemirbasNo;
      }

      // Diğer alanlar
      if (data.malzemeTipi !== undefined) updatePayload.malzemeTipi = data.malzemeTipi;
      if (data.kayitTarihi !== undefined) updatePayload.kayitTarihi = data.kayitTarihi;
      if (data.kod !== undefined) updatePayload.kod = data.kod;
      if (data.bademSeriNo !== undefined) updatePayload.bademSeriNo = data.bademSeriNo;
      if (data.etmysSeriNo !== undefined) updatePayload.etmysSeriNo = data.etmysSeriNo;
      if (data.aciklama !== undefined) updatePayload.aciklama = data.aciklama;

      return await prisma[PrismaName].update({
        where: { id: data.id },
        data: updatePayload,
        include: {
          birim: { select: { id: true, ad: true } },
          sube: { select: { id: true, ad: true } },
          sabitKodu: { select: { id: true, ad: true } },
          marka: { select: { id: true, ad: true } },
          model: { select: { id: true, ad: true } },
          createdBy: { select: { id: true, ad: true, avatar: true } },
          updatedBy: { select: { id: true, ad: true, avatar: true } },
        },
      });
    } catch (error) {
      throw error;
    }
  },

  updateStatus: async data => {
    try {
      await service.checkExistsById(data.id);

      if (!Object.values(AuditStatusEnum).includes(data.status)) 
        throw new Error(`Girilen '${data.status}' durumu geçerli bir durum değildir.`);

      const updatePayload = { updatedById: data.islemYapanKullanici };
      if (data.status !== undefined) updatePayload.status = data.status;

      return await prisma[PrismaName].update({
        where: { id: data.id },
        data: updatePayload,
        include: {
          birim: { select: { id: true, ad: true } },
          sube: { select: { id: true, ad: true } },
          sabitKodu: { select: { id: true, ad: true } },
          marka: { select: { id: true, ad: true } },
          model: { select: { id: true, ad: true } },
          createdBy: { select: { id: true, ad: true, avatar: true } },
          updatedBy: { select: { id: true, ad: true, avatar: true } },
        },
      });
    } catch (error) {
      throw error;
    }
  },

  delete: async data => {
    try {
      await service.checkExistsById(data.id);

      const bagliHareketler = await prisma.malzemeHareket.count({ 
        where: { malzemeId: data.id, status: AuditStatusEnum.Aktif } 
      });
      if (bagliHareketler > 0) 
        throw new Error(`Bu ${HumanName} silinemez çünkü bağlı ${bagliHareketler} aktif malzeme hareketi bulunmaktadır.`);

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

      if (data.vidaNo) whereClause.vidaNo = { contains: data.vidaNo, mode: 'insensitive' };
      if (data.kod) whereClause.kod = { contains: data.kod, mode: 'insensitive' };
      if (data.stokDemirbasNo) whereClause.stokDemirbasNo = { contains: data.stokDemirbasNo, mode: 'insensitive' };
      if (data.malzemeTipi) whereClause.malzemeTipi = data.malzemeTipi;
      if (data.birimId) whereClause.birimId = data.birimId;

      return await prisma[PrismaName].findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        include: {
          birim: { select: { id: true, ad: true } },
          sube: { select: { id: true, ad: true } },
          sabitKodu: { select: { id: true, ad: true } },
          marka: { select: { id: true, ad: true } },
          model: { select: { id: true, ad: true } },
          createdBy: { select: { id: true, ad: true, avatar: true } },
          updatedBy: { select: { id: true, ad: true, avatar: true } },
        },
      });
    } catch (error) {
      throw error;
    }
  },
};

export default service;