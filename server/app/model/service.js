import { prisma } from '../../config/db.js';
import helper from '../../utils/helper.js';
import { VarlıkKod, PrismaName, HumanName } from './base.js';
import { AuditStatusEnum } from '@prisma/client';
import MarkaService from '../marka/service.js';

const service = {
  checkExistsById: async id => {
    const result = await prisma[PrismaName].findUnique({ where: { id } });
    if (!result || result.status === AuditStatusEnum.Silindi) {
      throw new Error(`${id} ID'sine sahip aktif ${HumanName} bulunamadı.`);
    }
    return result;
  },

  checkModelMarkaUnique: async (ad, markaId, excludeId = null) => {
    const whereClause = { ad, markaId, status: AuditStatusEnum.Aktif };
    if (excludeId) whereClause.id = { not: excludeId };
    
    const existing = await prisma[PrismaName].findFirst({ where: whereClause });
    if (existing) {
      throw new Error(`Bu marka için "${ad}" adında bir model zaten mevcut.`);
    }
  },

  getAll: async () => {
    try {
      return await prisma[PrismaName].findMany({
        where: { status: AuditStatusEnum.Aktif },
        orderBy: [{ marka: { ad: 'asc' } }, { ad: 'asc' }],
        include: {
          marka: { select: { id: true, ad: true } },
          malzemeler: {
            where: { status: AuditStatusEnum.Aktif },
            select: { id: true, vidaNo: true },
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
      if (data.markaId) whereClause.markaId = data.markaId;
      if (data.aciklama) whereClause.aciklama = data.aciklama;

      return await prisma[PrismaName].findMany({
        where: whereClause,
        orderBy: [{ marka: { ad: 'asc' } }, { ad: 'asc' }],
        include: {
          marka: { select: { id: true, ad: true } },
          malzemeler: {
            where: { status: AuditStatusEnum.Aktif },
            select: { id: true, vidaNo: true },
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
          marka: { select: { id: true, ad: true } },
          malzemeler: {
            where: { status: AuditStatusEnum.Aktif },
            select: { id: true, vidaNo: true },
          },
          createdBy: { select: { id: true, ad: true, soyad: true, avatar: true } },
          updatedBy: { select: { id: true, ad: true, soyad: true, avatar: true } },
        },
      });
    } catch (error) {
      throw error;
    }
  },

  getByMarkaId: async data => {
    try {
      await MarkaService.checkExistsById(data.markaId);

      return await prisma[PrismaName].findMany({
        where: { markaId: data.markaId, status: AuditStatusEnum.Aktif },
        orderBy: { ad: 'asc' },
        include: {
          marka: { select: { id: true, ad: true } },
          malzemeler: {
            where: { status: AuditStatusEnum.Aktif },
            select: { id: true, vidaNo: true },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  },

  create: async data => {
    try {
      await MarkaService.checkExistsById(data.markaId);
      await service.checkModelMarkaUnique(data.ad, data.markaId);

      const yeniId = helper.generateId(VarlıkKod);
      const createPayload = {
        id: yeniId,
        ad: data.ad,
        markaId: data.markaId,
        status: AuditStatusEnum.Aktif,
        createdById: data.islemYapanKullanici,
      };
      if (data.aciklama !== undefined) createPayload.aciklama = data.aciklama;

      return await prisma[PrismaName].create({
        data: createPayload,
        include: {
          marka: { select: { id: true, ad: true } },
          malzemeler: {
            where: { status: AuditStatusEnum.Aktif },
            select: { id: true, vidaNo: true },
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
      if (data.aciklama !== undefined) updatePayload.aciklama = data.aciklama;

      if (data.markaId !== undefined) {
        if (data.markaId !== existingEntity.markaId) {
          await MarkaService.checkExistsById(data.markaId);
        }
        updatePayload.markaId = data.markaId;
      }

      // Model adı veya marka değişiyorsa unique kontrolü yap
      const finalAd = data.ad !== undefined ? data.ad : existingEntity.ad;
      const finalMarkaId = data.markaId !== undefined ? data.markaId : existingEntity.markaId;
      
      if (data.ad !== undefined || data.markaId !== undefined) {
        await service.checkModelMarkaUnique(finalAd, finalMarkaId, data.id);
      }

      return await prisma[PrismaName].update({
        where: { id: data.id },
        data: updatePayload,
        include: {
          marka: { select: { id: true, ad: true } },
          malzemeler: {
            where: { status: AuditStatusEnum.Aktif },
            select: { id: true, vidaNo: true },
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

      if (!Object.values(AuditStatusEnum).includes(data.status)) {
        throw new Error(`Girilen '${data.status}' durumu geçerli bir durum değildir.`);
      }

      const updatePayload = { updatedById: data.islemYapanKullanici };
      if (data.status !== undefined) updatePayload.status = data.status;

      return await prisma[PrismaName].update({
        where: { id: data.id },
        data: updatePayload,
        include: {
          marka: { select: { id: true, ad: true } },
          malzemeler: {
            where: { status: AuditStatusEnum.Aktif },
            select: { id: true, vidaNo: true },
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

      const bagliMalzemeler = await prisma.malzeme.count({
        where: { modelId: data.id, status: AuditStatusEnum.Aktif }
      });
      
      if (bagliMalzemeler > 0) {
        throw new Error(`Bu ${HumanName} silinemez çünkü bağlı ${bagliMalzemeler} aktif malzeme bulunmaktadır.`);
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
      if (data.markaId) whereClause.markaId = data.markaId;

      return await prisma[PrismaName].findMany({
        where: whereClause,
        orderBy: [{ marka: { ad: 'asc' } }, { ad: 'asc' }],
        include: {
          marka: { select: { id: true, ad: true } },
          malzemeler: {
            where: { status: AuditStatusEnum.Aktif },
            select: { id: true, vidaNo: true },
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