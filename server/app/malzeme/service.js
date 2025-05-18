import { prisma } from '../../config/db.js';
import helper from '../../utils/helper.js';
import { HizmetName, HumanName, PrismaName } from './base.js';
import { AuditStatusEnum } from '@prisma/client';
import BirimService from '../birim/service.js';
import SubeService from '../sube/service.js';
import SabitKoduService from '../sabitKodu/service.js';
import MarkaService from '../marka/service.js';
import ModelService from '../model/service.js';
import MalzemeHareketService from '../malzemehareket/service.js'; // Marka varlığını kontrol etmek için

const service = {
  checkExistsById: async id => {
    const result = await prisma[PrismaName].findUnique({ where: { id } });
    if (!result || result.status === AuditStatusEnum.Silindi) {
      throw new Error(`${id} ID'sine sahip aktif ${HumanName} bulunamadı.`);
    }
    return result;
  },

  checkMarkaCount: async markaId => {
    try {
      return await prisma[PrismaName].count({ where: { markaId, status: AuditStatusEnum.Aktif } });
    } catch (error) {
      throw error;
    }
  },

  checkModelCount: async modelId => {
    try {
      return await prisma[PrismaName].count({ where: { modelId, status: AuditStatusEnum.Aktif } });
    } catch (error) {
      throw error;
    }
  },

  getAll: async () => {
    try {
      return await prisma[PrismaName].findMany({
        where: { status: AuditStatusEnum.Aktif },
        orderBy: { ad: 'asc' },
        include: { marka: { select: { id: true, ad: true } } },
      });
    } catch (error) {
      throw error;
    }
  },

  getAllQuery: async (data = {}) => {
    try {
      const whereClause = { status: AuditStatusEnum.Aktif };
      if (data.subeId) whereClause.subeId = data.subeId;
      if (data.birimId) whereClause.birimId = data.birimId;
      if (data.sabitKoduId) whereClause.sabitKoduId = data.sabitKoduId;
      if (data.markaId) whereClause.markaId = data.markaId;
      if (data.modelId) whereClause.modelId = data.modelId;
      if (data.malzemeTipi) whereClause.malzemeTipi = data.malzemeTipi;

      return await prisma[PrismaName].findMany({
        where: whereClause,
        orderBy: [{ kayitTarihi: 'desc' }, { ad: 'asc' }],
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
        },
      });
    } catch (error) {
      throw error;
    }
  },

  getByBirimId: async data => {
    try {
      await BirimService.checkExistsById(data.birimId);

      return await prisma[PrismaName].findFirst({
        where: { birimId: data.birimId, status: AuditStatusEnum.Aktif },
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

      return await prisma[PrismaName].findFirst({
        where: { subeId: data.subeId, status: AuditStatusEnum.Aktif },
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

  getBySabitKoduId: async data => {
    try {
      await SabitKoduService.checkExistsById(data.sabitKoduId);

      return await prisma[PrismaName].findFirst({
        where: { sabitKoduId: data.sabitKoduId, status: AuditStatusEnum.Aktif },
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

  getByMarkaId: async data => {
    try {
      await MarkaService.checkExistsById(data.markaId);

      return await prisma[PrismaName].findFirst({
        where: { markaId: data.markaId, status: AuditStatusEnum.Aktif },
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

  getByModelId: async data => {
    try {
      await ModelService.checkExistsById(data.modelId);

      return await prisma[PrismaName].findFirst({
        where: { modelId: data.modelId, status: AuditStatusEnum.Aktif },
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
      await BirimService.checkExistsById(data.birimId);
      await SubeService.checkExistsById(data.subeId);
      await SabitKoduService.checkExistsById(data.sabitKoduId);
      await MarkaService.checkExistsById(data.markaId);
      const model = await ModelService.getById(data.modelId);
      if (!model || model.markaId !== data.markaId) throw new Error(`Belirtilen model, seçilen markaya ait değil veya bulunamadı.`);
      if (!data.malzemeTipi || !Object.values(MalzemeTipiEnum).includes(data.malzemeTipi)) throw new Error(message.error.gecersizMalzemeTipi);

      const yeniId = helper.generateId(HizmetName);
      return await prisma[PrismaName].create({
        data: {
          id: yeniId,
          vidaNo: data.vidaNo,
          kayitTarihi: data.kayitTarihi ? new Date(data.kayitTarihi) : null,
          malzemeTipi: data.malzemeTipi,
          birimId: data.birimId,
          subeId: data.subeId,
          sabitKoduId: data.sabitKoduId,
          markaId: data.markaId,
          modelId: data.modelId,
          kod: data.kod,
          bademSeriNo: data.bademSeriNo,
          etmysSeriNo: data.etmysSeriNo,
          stokDemirbasNo: data.stokDemirbasNo,
          aciklama: data.aciklama,
          status: AuditStatusEnum.Aktif,
          createdById: data.islemYapanKullanici,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        if (error.meta?.target?.includes('vidaNo')) throw new Error(message.error.vidaNoBenzersizDegil);
        if (error.meta?.target?.includes('stokDemirbasNo')) throw new Error(message.error.stokNoBenzersizDegil);
      }
      throw error;
    }
  },

  update: async data => {
    try {
      const existingEntity = await service.checkExistsById(data.id);

      if (data.birimId && data.birimId !== existingMalzeme.birimId) await BirimService.checkExistsById(data.birimId);
      if (data.subeId && data.subeId !== existingMalzeme.subeId) await SubeService.checkExistsById(data.subeId);
      if (data.sabitKoduId && data.sabitKoduId !== existingMalzeme.sabitKoduId) await SabitKoduService.checkExistsById(data.sabitKoduId);
      if (data.markaId && data.markaId !== existingMalzeme.markaId) await MarkaService.checkExistsById(data.markaId);
      if (data.modelId && data.modelId !== existingMalzeme.modelId) {
        const model = await ModelService.getById(data.modelId);
        const markaToCheck = data.markaId || existingMalzeme.markaId; // Eğer marka da güncelleniyorsa yeni markayı, değilse eskisini kontrol et
        if (!model || model.markaId !== markaToCheck) throw new Error(`Belirtilen model, seçilen markaya ait değil veya bulunamadı.`);
      }
      if (data.malzemeTipi && !Object.values(MalzemeTipiEnum).includes(data.malzemeTipi)) throw new Error(message.error.gecersizMalzemeTipi);

      const updatePayload = { updatedById: data.islemYapanKullanici };

      if (data.vidaNo !== undefined) updatePayload.vidaNo = data.vidaNo;
      if (data.aciklama !== undefined) updatePayload.aciklama = data.aciklama;
      if (data.kayitTarihi !== undefined) updatePayload.kayitTarihi = new Date(data.kayitTarihi);
      if (data.malzemeTipi !== undefined) updatePayload.malzemeTipi = data.malzemeTipi;
      if (data.birimId !== undefined) updatePayload.birimId = data.birimId;
      if (data.sabitKoduId !== undefined) updatePayload.sabitKoduId = data.sabitKoduId;
      if (data.markaId !== undefined) updatePayload.markaId = data.markaId;
      if (data.modelId !== undefined) updatePayload.modelId = data.modelId;
      if (data.kod !== undefined) updatePayload.kod = data.kod;
      if (data.bademSeriNo !== undefined) updatePayload.bademSeriNo = data.bademSeriNo;
      if (data.etmysSeriNo !== undefined) updatePayload.etmysSeriNo = data.etmysSeriNo;
      if (data.stokDemirbasNo !== undefined) updatePayload.stokDemirbasNo = data.stokDemirbasNo;

      return await prisma[PrismaName].update({ where: { id: data.id }, data: updatePayload });
    } catch (error) {
      if (error.code === 'P2002') {
        if (error.meta?.target?.includes('vidaNo')) throw new Error(message.error.vidaNoBenzersizDegil);
        if (error.meta?.target?.includes('stokDemirbasNo')) throw new Error(message.error.stokNoBenzersizDegil);
      }
      throw error;
    }
  },

  updateStatus: async data => {
    try {
      await service.checkExistsById(data.id);

      if (!Object.values(AuditStatusEnum).includes(data.status)) throw new Error(`Girilen '${data.status}' durumu geçerli bir durum değildir.`);

      const updatePayload = { updatedById: data.islemYapanKullanici };
      if (data.status !== undefined) updatePayload.status = data.status;

      return await prisma[PrismaName].update({ where: { id: data.id }, data: updatePayload });
    } catch (error) {
      throw error;
    }
  },

  delete: async data => {
    try {
      await service.checkExistsById(data.id);

      const bagliHareketler = await MalzemeHareketService.checkMalzemeCount(data.id);
      if (bagliHareketler > 0) throw new Error(`Bu ${HumanName} silinemez çünkü bağlı ${bagliHareketler} aktif bağlı hareketi bulunmaktadır.`);

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
      if (data.malzemeTipi) whereClause.malzemeTipi = { contains: data.malzemeTipi, mode: 'insensitive' };
      if (data.birimId) whereClause.birimId = { contains: data.birimId, mode: 'insensitive' };
      if (data.subeId) whereClause.subeId = { contains: data.subeId, mode: 'insensitive' };
      if (data.sabitKoduId) whereClause.sabitKoduId = { contains: data.sabitKoduId, mode: 'insensitive' };
      if (data.markaId) whereClause.markaId = { contains: data.markaId, mode: 'insensitive' };
      if (data.modelId) whereClause.modelId = { contains: data.modelId, mode: 'insensitive' };
      if (data.kod) whereClause.kod = { contains: data.kod, mode: 'insensitive' };
      if (data.bademSeriNo) whereClause.bademSeriNo = { contains: data.bademSeriNo, mode: 'insensitive' };
      if (data.etmysSeriNo) whereClause.etmysSeriNo = { contains: data.etmysSeriNo, mode: 'insensitive' };
      if (data.stokDemirbasNo) whereClause.stokDemirbasNo = { contains: data.stokDemirbasNo, mode: 'insensitive' };
      if (data.aciklama) whereClause.aciklama = { contains: data.aciklama, mode: 'insensitive' };

      return await prisma[PrismaName].findMany({
        where: whereClause,
        orderBy: [{ kayitTarihi: 'desc' }, { stokDemirbasNo: 'asc' }],
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
};

export default service;
