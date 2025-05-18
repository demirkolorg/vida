import { prisma } from '../../config/db.js';
import helper from '../../utils/helper.js';
import { HizmetName, HumanName, PrismaName } from './base.js';
import { AuditStatusEnum } from '@prisma/client';
import DepoService from '../depo/service.js'; // Marka varlığını kontrol etmek için
import MalzemeHareketService from '../malzemehareket/service.js'; // Marka varlığını kontrol etmek için

const service = {
  checkExistsById: async id => {
    const result = await prisma[PrismaName].findUnique({ where: { id } });
    if (!result || result.status === AuditStatusEnum.Silindi) {
      throw new Error(`${id} ID'sine sahip aktif ${HumanName} bulunamadı.`);
    }
    return result;
  },

  checkDepoCount: async depoId => {
    try {
      return await prisma[PrismaName].count({ where: { depoId, status: AuditStatusEnum.Aktif } });
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

  getByDepoId: async data => {
    try {
      await DepoService.checkExistsById(data.depoId);

      return await prisma[PrismaName].findFirst({
        where: { depoId: data.depoId, status: AuditStatusEnum.Aktif },
        include: { depo: { select: { id: true, ad: true } } },
      });
    } catch (error) {
      throw error;
    }
  },

  create: async data => {
    try {
      await DepoService.checkExistsById(data.depoId);

      const yeniId = helper.generateId(HizmetName);

      const createPayload = {
        id: yeniId,
        ad: data.ad,
        depoId: data.depoId,
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

      if (data.depoId !== undefined) {
        if (data.depoId !== null && data.depoId !== existingEntity.depoId) {
          await BirimService.checkExistsById(data.depoId);
        }
        updatePayload.depoId = data.depoId;
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

      const bagliHareketler = await MalzemeHareketService.checkKonumCount(data.id);
      if (bagliHareketler > 0) throw new Error(`Bu ${HumanName} silinemez çünkü bağlı ${bagliHareketler} aktif Malzeme bulunmaktadır.`);

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
      if (data.depoId) whereClause.depoId = { contains: data.depoId, mode: 'insensitive' };

      return await prisma[PrismaName].findMany({
        where: whereClause,
        orderBy: { ad: 'asc' },
        include: { depo: { select: { id: true, ad: true } } },
      });
    } catch (error) {
      throw error;
    }
  },
};

export default service;
