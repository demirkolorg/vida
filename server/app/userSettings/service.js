import { prisma } from '../../config/db.js';
import helper from '../../utils/helper.js';
import { VarlıkKod, HumanName, PrismaName } from './base.js';
import { AuditStatusEnum } from '@prisma/client';
import PersonelService from '../personel/service.js';

const service = {
  checkExistsById: async id => {
    const result = await prisma[PrismaName].findUnique({ where: { id } });
    if (!result) {
      throw new Error(`${id} ID'sine sahip aktif ${HumanName} bulunamadı.`);
    }
    return result;
  },

  getAll: async () => {
    try {
      return await prisma[PrismaName].findMany({
        include: {
          personel: {
            select: { id: true, ad: true ,sicil:true},
          },
        },
      });
    } catch (error) {
      throw error;
    }
  },

  getByQuery: async (data = {}) => {
    try {
      const whereClause = {};
      if (data.theme) whereClause.theme = data.theme;
      if (data.isDarkMode) whereClause.isDarkMode = data.isDarkMode;
      if (data.fontSize) whereClause.fontSize = data.fontSize; 
      if (data.dataTableSettings) whereClause.dataTableSettings = data.dataTableSettings; 


      return await prisma[PrismaName].findMany({
        where: whereClause,
        orderBy: { theme: 'asc' },
        personel: {
            select: { id: true, ad: true ,sicil:true},
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
        where: { id: data.id, },
        include: { personel: { select: { id: true, ad: true ,sicil:true} } },
      });
    } catch (error) {
      throw error;
    }
  },

  getByPersonelId: async data => {
    try {
      await PersonelService.checkExistsById(data.personelId);

      return await prisma[PrismaName].findFirst({
        where: { personelId: data.personelId, },
        include: { personel: { select: { id: true, ad: true,sicil:true } } },
      });
    } catch (error) {
      throw error;
    }
  },
  getMySettings: async data => {
    try {
      await PersonelService.checkExistsById(data.personelId);

      return await prisma[PrismaName].findFirst({
        where: { personelId: data.personelId, },
        include: { personel: { select: { id: true, ad: true,sicil:true } } },
      });
    } catch (error) {
      throw error;
    }
  },


  updateMySettings: async data => {

    try {
      await PersonelService.checkExistsById(data.personelId);

      const validUpdateData = {};
      if (data.themeName !== undefined) validUpdateData.themeName = data.themeName;
      if (data.isDarkMode !== undefined) validUpdateData.isDarkMode = data.isDarkMode;
      if (data.fontSize !== undefined) validUpdateData.fontSize = data.fontSize;
      if (data.dataTableSettings !== undefined) validUpdateData.dataTableSettings = data.dataTableSettings;

      if (Object.keys(validUpdateData).length === 0) {
        const existingSettings = await prisma[PrismaName].findUnique({
          where: { personelId: data.personelId },
        });
        if (existingSettings) return existingSettings;
      }

      return await prisma[PrismaName].upsert({
        where: { personelId: data.personelId },
        update: validUpdateData,
        create: {
          personelId: data.personelId,
          themeName: validUpdateData.themeName !== undefined ? validUpdateData.themeName : 'default',
          isDarkMode: validUpdateData.isDarkMode !== undefined ? validUpdateData.isDarkMode : false,
          fontSize: validUpdateData.fontSize !== undefined ? validUpdateData.fontSize : "16",
          dataTableSettings: validUpdateData.dataTableSettings !== undefined ? validUpdateData.dataTableSettings : {},
        },
        include: {
          personel: {
            select: { id: true, ad: true,sicil:true },
          },
        },
      });
    } catch (error) {
      console.error(`Error in UserSetting service (upsert for personelId: ):`, error);
      throw error;
    }
  },

  create: async data => {
    try {
      await BirimService.checkExistsById(data.personelId);


      const createPayload = {
        theme: data.theme || 'violet',
        isDarkMode: data.isDarkMode || true,
        fontSize: data.fontSize || "16",
        personelId: data.personelId,
        dataTableSettings:data.dataTableSettings
      };
      return await prisma[PrismaName].create({ data: createPayload });
    } catch (error) {
      throw error;
    }
  },

  update: async data => {
    try {
      await service.checkExistsById(data.personelId);

      const updatePayload = {};
      if (data.theme !== undefined) updatePayload.theme = data.theme;
      if (data.isDarkMode !== undefined) updatePayload.isDarkMode = data.isDarkMode;
      if (data.fontSize !== undefined) updatePayload.fontSize = data.fontSize;
      if (data.dataTableSettings !== undefined) updatePayload.dataTableSettings = data.dataTableSettings;

      return await prisma[PrismaName].update({ where: { personelId: data.personelId }, data: updatePayload });
    } catch (error) {
      throw error;
    }
  },

  delete: async data => {
    try {
      await service.checkExistsById(data.id);

      return await prisma[PrismaName].delete({
        where: { id: data.id },
      });
    } catch (error) {
      throw error;
    }
  },


};

export default service;
