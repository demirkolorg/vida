import { prisma } from '../../config/db.js';
import helper from '../../utils/helper.js';
import { PrismaName,VarlıkKod } from './base.js';
import { AuditStatusEnum } from '@prisma/client';

const serializeLog = log => {
  try {
    if (typeof log === 'function') {
      return 'Function cannot be serialized';
    }

    if (typeof log === 'object') {
      if (log instanceof Error) {
        return {
          message: log.message,
          stack: log.stack,
          name: log.name,
        };
      }
      return JSON.stringify(log);
    }

    return String(log);
  } catch (err) {
    return 'Log serialization failed';
  }
};

const service = {
  checkLogExistsId: async id => {
    const result = await prisma[PrismaName].findUnique({ where: { id } });
    if (!result) throw new Error(`${id} ID'sine sahip log bulunamadı.`);
  },
  info: async (createdById, HizmetName, rota, log = {}) => {
    const logData = serializeLog(log);
    const newAudit = await prisma[PrismaName].create({
      data: {
        level: 'INFO',
        createdById,
        hizmet: HizmetName,
        rota,
        log: logData,
      },
    });

    return { newAudit };
  },
  error: async (createdById, HizmetName, rota, log = {}) => {
    const logData = serializeLog(log);

    const newAudit = await prisma[PrismaName].create({
      data: {
        level: 'ERROR',
        createdById,
        hizmet: HizmetName,
        rota,
        log: logData,
      },
    });

    return { newAudit };
  },
  warning: async (createdById, HizmetName, rota, log = {}) => {
    const logData = serializeLog(log);
    const newAudit = await prisma[PrismaName].create({
      data: {
        level: 'WARNING',
        createdById,
        hizmet: HizmetName,
        rota,
        log: logData,
      },
    });

    return { newAudit };
  },
  success: async (createdById, HizmetName, rota, log = {}) => {
    const logData = serializeLog(log);
    const newAudit = await prisma[PrismaName].create({
      data: {
        level: 'SUCCESS',
        createdById,
        hizmet: HizmetName,
        rota,
        log: logData,
      },
    });

    return { newAudit };
  },
  getLogsByLevel: async level => {
    try {
      const logs = await prisma[PrismaName].findMany({
        where: { level },
        orderBy: {
          created_at: 'desc', // Tarihe göre sıralama (en son log en üstte)
        },
      });
      return logs;
    } catch (error) {
      console.error(`Log seviyesine göre loglar alınırken hata oluştu: ${level}`, error);
      throw new Error('Log kayıtlarını getirme başarısız.');
    }
  },
  getAllLogs: async () => {
    try {
      const logs = await prisma[PrismaName].findMany({
        orderBy: {
          // created_at: "desc", // Tarihe göre sıralama (en son log en üstte)
        },
      });
      return logs;
    } catch (error) {
      console.error('Tüm loglar alınırken hata oluştu:', error);
      throw new Error('Tüm log kayıtlarını getirme başarısız.');
    }
  },
  getByQuery: async (data = {}) => {
    try {
      const whereClause = {};
      if (data.level) whereClause.level = data.level;
      if (data.rota) whereClause.rota = data.rota;
      if (data.hizmet) whereClause.hizmet = data.hizmet;
      if (data.log) whereClause.log = data.log;

      return await prisma.auditLog.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        include: {
  createdBy: { select: { id: true, ad: true,soyad:true,sicil: true, avatar: true } },
        },
      });
    } catch (error) {
      throw error;
    }
  },
  getById: async data => {
    try {
      const result = await prisma[PrismaName].findUnique({
        where: { id: data.id },
      });
      return result;
    } catch (error) {
      throw error;
    }
  },
  getByUserId: async data => {
    try {
      const result = await prisma[PrismaName].findMany({
        where: { createdById: data.createdById },
      });
      return result;
    } catch (error) {
      throw error;
    }
  },
  getLastRecord: async () => {
    try {
      return await prisma[PrismaName].findFirst({
        orderBy: { created_at: 'desc' },
      });
    } catch (error) {
      throw error;
    }
  },
};
export default service;
