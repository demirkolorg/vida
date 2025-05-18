import { prisma } from '../../config/db.js';
import helper from '../../utils/helper.js';
import { HizmetName, HumanName, PrismaName } from './base.js';
import { AuditStatusEnum } from '@prisma/client';
import MarkaService from '../marka/service.js'; // Marka varlığını kontrol etmek için
import MalzemeService from '../malzeme/service.js'; // Marka varlığını kontrol etmek için

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

  getById: async data => {
    try {
      await service.checkExistsById(data.id);

      return await prisma[PrismaName].findFirst({
        where: { id: data.id, status: AuditStatusEnum.Aktif },
        include: { marka: { select: { id: true, ad: true } } },
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
        include: { marka: { select: { id: true, ad: true } } },
      });
    } catch (error) {
      throw error;
    }
  },

  create: async data => {
    try {
      await MarkaService.checkExistsById(data.markaId);

      const yeniId = helper.generateId(HizmetName);

      const createPayload = {
        id: yeniId,
        ad: data.ad,
        markaId: data.markaId,
        status: AuditStatusEnum.Aktif,
        createdById: data.islemYapanKullanici,
      };
      if (data.aciklama !== undefined) createPayload.aciklama = data.aciklama;

      return await prisma[PrismaName].create({ data: createPayload });
    } catch (error) {
      throw error;
    }
  },

  update: async data => {
    try {
      const existingEntity = await service.checkExistsById(data.id);

      const updatePayload = { updatedById: data.islemYapanKullanici };
      if (data.ad !== undefined) updatePayload.ad = data.ad;
      if (data.aciklama !== undefined) updatePayload.aciklama = data.aciklama;

      if (data.markaId !== undefined) {
        if (data.markaId !== null && data.markaId !== existingEntity.markaId) {
          await BirimService.checkExistsById(data.markaId);
        }
        updatePayload.markaId = data.markaId;
      }

      return await prisma[PrismaName].update({ where: { id: data.id }, data: updatePayload });
    } catch (error) {
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

      const bagliMalzemeler = await MalzemeService.checkModelCount(data.id);
      if (bagliMalzemeler > 0) throw new Error(`Bu ${HumanName} silinemez çünkü bağlı ${bagliMalzemeler} aktif Malzeme bulunmaktadır.`);

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
      if (data.markaId) whereClause.markaId = { contains: data.markaId, mode: 'insensitive' };

      return await prisma[PrismaName].findMany({
        where: whereClause,
        orderBy: { ad: 'asc' },
        include: { marka: { select: { id: true, ad: true } } },
      });
    } catch (error) {
      throw error;
    }
  },
};

export default service;
