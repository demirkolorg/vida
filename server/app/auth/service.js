import { prisma } from '../../config/db.js';
import helper from '../../utils/helper.js';
import { HizmetName, PrismaName, VarlıkKod } from './base.js';
import { AuditStatusEnum } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getDomainName } from './utils/domainUtil.js';
import { ldapLogin } from './utils/ldapLogin.js';

const service = {
  checkExistsId: async email => {
    const result = await prisma[PrismaName].findUnique({ where: { sicil, status: AuditStatusEnum.Aktif } });
    if (!result) throw new Error(`${email} adresine kayıtlı kullanıcı bulunamadı.`);
  },

  login: async data => {
    try {
      const domain = await getDomainName();
      const user = await prisma[PrismaName].findFirst({
        where: {
          sicil: data.sicil,
          status: AuditStatusEnum.Aktif,
          isUser: true,
        },
      });

      if (!user) throw new Error('Kullanıcı bulunamadı veya aktif değil.');
      if (!user.parola) throw new Error('Parola ayarlanmamış.');
      const isMatch = await bcrypt.compare(data.parola, user.parola);
      if (!isMatch) throw new Error('Geçersiz parola.');
      const tokenPayload = { id: user.id, role: user.role, sicil: user.sicil };
      const accessToken = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION || '60d',
      });
      const refreshToken = jwt.sign(tokenPayload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || '60d',
      });

      await prisma[PrismaName].update({
        where: {
          id: user.id,
        },

        data: {
          lastLogin: new Date(),
        },
      });

      return {
        accessToken,

        refreshToken,

        user: {
          id: user.id,

          sicil: user.sicil,

          ad: user.ad,

          soyad: user.soyad,

          role: user.role,

          avatar: user.avatar,
        },
      };
    } catch (error) {
      throw new Error(`Giriş hatası:
${error.message}`);
    }
  },

  loginWithAd: async data => {
    try {
      const user = await prisma[PrismaName].findFirst({
        where: {
          sicil: data.sicil,
          status: AuditStatusEnum.Aktif,
          isUser: true,
        },
      });

      if (!user) throw new Error('Kullanıcı bulunamadı veya aktif değil.');
      let isAuthenticated = false;

      const domain = await getDomainName();
      if (domain.toUpperCase() === 'EGMIDB') {
        isAuthenticated = await ldapLogin(data.sicil, data.parola);
        if (!isAuthenticated) throw new Error('Etki alanı doğrulaması başarısız.');
      } else {
        if (!user.parola) throw new Error('Parola ayarlanmamış.');
        isAuthenticated = await bcrypt.compare(data.parola, user.parola);
        if (!isAuthenticated) throw new Error('Geçersiz parola.');
      }
      const tokenPayload = {
        id: user.id,
        role: user.role,
        sicil: user.sicil,
      };
      const accessToken = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION || '60d',
      });
      const refreshToken = jwt.sign(tokenPayload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || '60d',
      });
      await prisma[PrismaName].update({
        where: {
          id: user.id,
        },
        data: {
          lastLogin: new Date(),
        },
      });

      return {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          sicil: user.sicil,
          ad: user.ad,
          soyad: user.soyad,
          role: user.role,
          avatar: user.avatar,
        },
      };
    } catch (error) {
      throw new Error(`Giriş hatası: ${error.message}`);
    }
  },

  register: async data => {
    try {
      const hashedPassword = await bcrypt.hash(data.parola, 12);
      const result = await prisma[PrismaName].create({
        data: {
          ad: data.ad,
          soyad: data.soyad,
          sicil: data.sicil,
          parola: hashedPassword,
          role: data.role,
          avatar: data.avatar,
        },
      });

      delete result.parola;
      return result;
    } catch (error) {
      throw new Error(`Kayıt hatası: ${error.message}`);
    }
  },

  refreshAccessToken: async data => {
    try {
      const payload = jwt.verify(data.refreshToken, process.env.REFRESH_TOKEN_SECRET);
      const user = await prisma[PrismaName].findFirst({
        where: {
          id: payload.id,
          status: AuditStatusEnum.Aktif,
        },
      });

      if (!user) throw new Error('Kullanıcı bulunamadı veya aktif değil.');
      const accessToken = jwt.sign(
        {
          id: payload.id,
          role: user.role,
          sicil: user.sicil,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION || '60d' },
      );

      return { accessToken };
    } catch (error) {
      throw new Error(`Token yenileme hatası:
${error.message}`);
    }
  },

  logout: async data => {
    try {
      return await prisma[PrismaName].update({
        where: {
          id: data.id,
          status: AuditStatusEnum.Aktif,
        },
        data: {
          lastLogout: new Date(),
        },
      });
    } catch (error) {
      throw new Error(`Çıkış yapılırken hata oluştu: ${error.message}`);
    }
  },
};

export default service;
