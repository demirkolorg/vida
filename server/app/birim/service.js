import { prisma } from '../../config/db.js';
import helper from '../../utils/helper.js';
import { HizmetName, PrismaName, HumanName } from './base.js';
import { AuditStatusEnum } from '@prisma/client';

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
          subeler: {
            where: { status: AuditStatusEnum.Aktif },
            select: { id: true, ad: true },
          },
          malzemeler: {
            where: { status: AuditStatusEnum.Aktif },
            select: { id: true, vidaNo: true, sabitKodu: { select: { ad: true } } },
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
        orderBy: { ad: 'asc' },
        include: {
          subeler: {
            where: { status: AuditStatusEnum.Aktif },
            select: { id: true, ad: true },
          },
          malzemeler: {
            where: { status: AuditStatusEnum.Aktif },
            select: { id: true, vidaNo: true, sabitKodu: { select: { ad: true } } },
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
      const yeniId = helper.generateId(HizmetName);
      const createPayload = {
        id: yeniId,
        ad: data.ad,
        status: AuditStatusEnum.Aktif,
        createdById: data.islemYapanKullanici,
      };
      if (data.aciklama !== undefined) createPayload.aciklama = data.aciklama;

      return await prisma[PrismaName].create({
        data: createPayload,
        include: {
          subeler: {
            where: { status: AuditStatusEnum.Aktif },
            select: { id: true, ad: true },
          },
          malzemeler: {
            where: { status: AuditStatusEnum.Aktif },
            select: { id: true, vidaNo: true, sabitKodu: { select: { ad: true } } },
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
      await service.checkExistsById(data.id);

      const updatePayload = { updatedById: data.islemYapanKullanici };
      if (data.ad !== undefined) updatePayload.ad = data.ad;
      if (data.aciklama !== undefined) updatePayload.aciklama = data.aciklama;

      return await prisma[PrismaName].update({
        where: { id: data.id },
        data: updatePayload,
        include: {
          subeler: {
            where: { status: AuditStatusEnum.Aktif },
            select: { id: true, ad: true },
          },
          malzemeler: {
            where: { status: AuditStatusEnum.Aktif },
            select: { id: true, vidaNo: true, sabitKodu: { select: { ad: true } } },
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
          subeler: {
            where: { status: AuditStatusEnum.Aktif },
            select: { id: true, ad: true },
          },
          malzemeler: {
            where: { status: AuditStatusEnum.Aktif },
            select: { id: true, vidaNo: true, sabitKodu: { select: { ad: true } } },
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

      return await prisma[PrismaName].findMany({
        where: whereClause,
        orderBy: { ad: 'asc' },
        include: {
          subeler: {
            where: { status: AuditStatusEnum.Aktif },
            select: { id: true, ad: true },
          },
          malzemeler: {
            where: { status: AuditStatusEnum.Aktif },
            select: { id: true, vidaNo: true, sabitKodu: { select: { ad: true } } },
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
