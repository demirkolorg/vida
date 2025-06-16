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

  getAll: async () => {
    try {
      return await prisma[PrismaName].findMany({
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

      return await prisma[PrismaName].findMany({
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
    } catch (error) {
      throw error;
    }
  },

  create: async data => {
    try {
      if (data.buroId) await BuroService.checkExistsById(data.buroId);

      const createPayload = {
        ad: data.ad,
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

      return await prisma[PrismaName].create({
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
    } catch (error) {
      throw error;
    }
  },

  update: async data => {
    try {
      const existingEntity = await service.checkExistsById(data.id);
      const updatePayload = { updatedById: data.islemYapanKullanici };

      if (data.ad !== undefined) updatePayload.ad = data.ad;
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

      return await prisma[PrismaName].update({
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

      return await prisma[PrismaName].update({
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

      return await prisma[PrismaName].findMany({
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
    } catch (error) {
      throw error;
    }
  },
};

export default service;
