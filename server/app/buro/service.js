import { prisma } from '../../config/db.js';
import helper from '../../utils/helper.js';
import { HizmetName, HumanName, PrismaName } from './base.js';
import { AuditStatusEnum } from '@prisma/client';
import SubeService from '../sube/service.js';
import PersonelService from '../personel/service.js';

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
        orderBy: { ad: 'asc' },
        include: {
          sube: {
            select: { 
              id: true, 
              ad: true,
              birim: { select: { id: true, ad: true } }
            },
          },
          amir: { 
            select: { id: true, ad: true, sicil: true, avatar: true } 
          },
          personeller: {
            where: { status: AuditStatusEnum.Aktif },
            select: { id: true, ad: true, sicil: true, avatar: true },
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
      if (data.ad) whereClause.ad = data.ad;
      if (data.aciklama) whereClause.aciklama = data.aciklama;
      if (data.subeId) whereClause.subeId = data.subeId;
      if (data.amirId) whereClause.amirId = data.amirId;

      return await prisma[PrismaName].findMany({
        where: whereClause,
        orderBy: { ad: 'asc' },
        include: {
          sube: {
            select: { 
              id: true, 
              ad: true,
              birim: { select: { id: true, ad: true } }
            },
          },
          amir: { 
            select: { id: true, ad: true, sicil: true, avatar: true } 
          },
          personeller: {
            where: { status: AuditStatusEnum.Aktif },
            select: { id: true, ad: true, sicil: true, avatar: true },
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
          sube: {
            select: { 
              id: true, 
              ad: true,
              birim: { select: { id: true, ad: true } }
            },
          },
          amir: { 
            select: { id: true, ad: true, sicil: true, avatar: true } 
          },
          personeller: {
            where: { status: AuditStatusEnum.Aktif },
            select: { id: true, ad: true, sicil: true, avatar: true },
          },
          createdBy: { select: { id: true, ad: true, avatar: true } },
          updatedBy: { select: { id: true, ad: true, avatar: true } },
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
        orderBy: { ad: 'asc' },
        include: {
          sube: {
            select: { 
              id: true, 
              ad: true,
              birim: { select: { id: true, ad: true } }
            },
          },
          amir: { 
            select: { id: true, ad: true, sicil: true, avatar: true } 
          },
          personeller: {
            where: { status: AuditStatusEnum.Aktif },
            select: { id: true, ad: true, sicil: true, avatar: true },
          },
          createdBy: { select: { id: true, ad: true, avatar: true } },
          updatedBy: { select: { id: true, ad: true, avatar: true } },
        },
      });
    } catch (error) {
      throw error;
    }
  },

  create: async data => {
    try {
      await SubeService.checkExistsById(data.subeId);
      if (data.amirId) await PersonelService.checkExistsById(data.amirId);

      const yeniId = helper.generateId(HizmetName);

      const createPayload = {
        id: yeniId,
        ad: data.ad,
        subeId: data.subeId,
        status: AuditStatusEnum.Aktif,
        createdById: data.islemYapanKullanici,
      };
      if (data.aciklama !== undefined) createPayload.aciklama = data.aciklama;
      if (data.amirId !== undefined) createPayload.amirId = data.amirId;

      return await prisma[PrismaName].create({
        data: createPayload,
        include: {
          sube: {
            select: { 
              id: true, 
              ad: true,
              birim: { select: { id: true, ad: true } }
            },
          },
          amir: { 
            select: { id: true, ad: true, sicil: true, avatar: true } 
          },
          personeller: {
            where: { status: AuditStatusEnum.Aktif },
            select: { id: true, ad: true, sicil: true, avatar: true },
          },
          createdBy: { select: { id: true, ad: true, avatar: true } },
          updatedBy: { select: { id: true, ad: true, avatar: true } },
        },
      });
    } catch (error) {
      throw error;
    }
  },

  update: async data => {
    try {
      const existingBuro = await service.checkExistsById(data.id);

      const updatePayload = { updatedById: data.islemYapanKullanici };
      if (data.ad !== undefined) updatePayload.ad = data.ad;
      if (data.aciklama !== undefined) updatePayload.aciklama = data.aciklama;

      if (data.subeId !== undefined) {
        if (data.subeId !== null && data.subeId !== existingBuro.subeId) {
          await SubeService.checkExistsById(data.subeId);
        }
        updatePayload.subeId = data.subeId;
      }

      if (data.amirId !== undefined) {
        if (data.amirId !== null && data.amirId !== existingBuro.amirId) {
          await PersonelService.checkExistsById(data.amirId);
        }
        updatePayload.amirId = data.amirId;
      }

      return await prisma[PrismaName].update({
        where: { id: data.id },
        data: updatePayload,
        include: {
          sube: {
            select: { 
              id: true, 
              ad: true,
              birim: { select: { id: true, ad: true } }
            },
          },
          amir: { 
            select: { id: true, ad: true, sicil: true, avatar: true } 
          },
          personeller: {
            where: { status: AuditStatusEnum.Aktif },
            select: { id: true, ad: true, sicil: true, avatar: true },
          },
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

      if (!Object.values(AuditStatusEnum).includes(data.status)) throw new Error(`Girilen '${data.status}' durumu geçerli bir durum değildir.`);

      const updatePayload = { updatedById: data.islemYapanKullanici };
      if (data.status !== undefined) updatePayload.status = data.status;

      return await prisma[PrismaName].update({
        where: { id: data.id },
        data: updatePayload,
        include: {
          sube: {
            select: { 
              id: true, 
              ad: true,
              birim: { select: { id: true, ad: true } }
            },
          },
          amir: { 
            select: { id: true, ad: true, sicil: true, avatar: true } 
          },
          personeller: {
            where: { status: AuditStatusEnum.Aktif },
            select: { id: true, ad: true, sicil: true, avatar: true },
          },
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

      const bagliPersoneller = await prisma.personel.count({ where: { buroId: data.id, status: AuditStatusEnum.Aktif } });
      if (bagliPersoneller > 0) {
        throw new Error(`Bu ${HumanName} silinemez çünkü bağlı ${bagliPersoneller} aktif Personel bulunmaktadır.`);
      }

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
      if (data.subeId) whereClause.subeId = { contains: data.subeId, mode: 'insensitive' };

      return await prisma[PrismaName].findMany({
        where: whereClause,
        orderBy: { ad: 'asc' },
        include: {
          sube: {
            select: { 
              id: true, 
              ad: true,
              birim: { select: { id: true, ad: true } }
            },
          },
          amir: { 
            select: { id: true, ad: true, sicil: true, avatar: true } 
          },
          personeller: {
            where: { status: AuditStatusEnum.Aktif },
            select: { id: true, ad: true, sicil: true, avatar: true },
          },
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