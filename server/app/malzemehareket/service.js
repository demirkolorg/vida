// server/app/malzemeHareket/service.js
import { prisma } from '../../config/db.js';
import helper from '../../utils/helper.js';
import { HizmetName, HumanName, PrismaName } from './base.js';
import { AuditStatusEnum, HareketTuruEnum, MalzemeKondisyonuEnum } from '@prisma/client';
import MalzemeService from '../malzeme/service.js';
import PersonelService from '../personel/service.js';
import KonumService from '../konum/service.js';

const service = {
  checkExistsById: async id => {
    const result = await prisma[PrismaName].findUnique({ where: { id } });
    if (!result || result.status === AuditStatusEnum.Silindi) {
      throw new Error(`${id} ID'sine sahip aktif ${HumanName} bulunamadı.`);
    }
    return result;
  },

  // Malzemenin mevcut durumunu kontrol et
  getMalzemeDurumu: async malzemeId => {
    const sonHareket = await prisma[PrismaName].findFirst({
      where: {
        malzemeId,
        status: AuditStatusEnum.Aktif,
      },
      orderBy: { islemTarihi: 'desc' },
    });

    if (!sonHareket) {
      return {
        malzemePersonelde: false,
        malzemeDepoda: false,
        malzemeKonumsuz: false,
        malzemeYok: false,
        sonPersonelId: null,
        sonKonumId: null,
      };
    }

    const malzemePersonelde = [HareketTuruEnum.Zimmet, HareketTuruEnum.Devir].includes(sonHareket.hareketTuru);
    const malzemeDepoda = [HareketTuruEnum.Kayit, HareketTuruEnum.Iade, HareketTuruEnum.DepoTransferi].includes(sonHareket.hareketTuru);
    const malzemeKonumsuz = sonHareket.hareketTuru === HareketTuruEnum.KondisyonGuncelleme;
    const malzemeYok = [HareketTuruEnum.Kayip, HareketTuruEnum.Dusum].includes(sonHareket.hareketTuru);

    return {
      malzemePersonelde,
      malzemeDepoda,
      malzemeKonumsuz,
      malzemeYok,
      sonPersonelId: sonHareket.hedefPersonelId || sonHareket.kaynakPersonelId,
      sonKonumId: sonHareket.konumId,
    };
  },

  validateHareketKurallari: async data => {
    const malzemeDurumu = await service.getMalzemeDurumu(data.malzemeId);

    switch (data.hareketTuru) {
      case HareketTuruEnum.Kayit:
        // İlk hareket olmalı
        if (malzemeDurumu.malzemePersonelde || malzemeDurumu.malzemeDepoda || malzemeDurumu.malzemeKonumsuz || malzemeDurumu.malzemeYok) {
          throw new Error('Kayıt hareketi sadece malzemenin ilk hareketi olabilir.');
        }
        if (!data.konumId) throw new Error('Kayıt işlemi için konum belirtilmelidir.');
        break;

      case HareketTuruEnum.Zimmet:
        if (malzemeDurumu.malzemePersonelde) throw new Error('Bu malzeme zaten bir personelde bulunmakta, zimmet verilemez.');
        if (!malzemeDurumu.malzemeDepoda && !malzemeDurumu.malzemeKonumsuz) throw new Error('Malzeme depoda değil, zimmet verilemez.');
        if (malzemeDurumu.malzemeYok) throw new Error('Kayıp/düşüm yapılmış malzemeye zimmet verilemez.');
        if (!data.hedefPersonelId) throw new Error('Zimmet işlemi için hedef personel belirtilmelidir.');
        break;

      case HareketTuruEnum.Iade:
        if (!malzemeDurumu.malzemePersonelde && !malzemeDurumu.malzemeKonumsuz) throw new Error('Bu malzeme personelde değil, iade alınamaz.');
        if (malzemeDurumu.malzemeYok) throw new Error('Kayıp/düşüm yapılmış malzemeden iade alınamaz.');
        if (!data.kaynakPersonelId) throw new Error('İade işlemi için kaynak personel belirtilmelidir.');
        if (!data.konumId) throw new Error('İade işlemi için konum belirtilmelidir.');
        break;

      case HareketTuruEnum.Devir:
        if (!malzemeDurumu.malzemePersonelde && !malzemeDurumu.malzemeKonumsuz) throw new Error('Bu malzeme personelde değil, devir yapılamaz.');
        if (malzemeDurumu.malzemeYok) throw new Error('Kayıp/düşüm yapılmış malzemede devir yapılamaz.');
        if (!data.kaynakPersonelId || !data.hedefPersonelId) throw new Error('Devir işlemi için kaynak ve hedef personel belirtilmelidir.');
        if (data.kaynakPersonelId === data.hedefPersonelId) throw new Error('Kaynak ve hedef personel aynı olamaz.');
        break;

      case HareketTuruEnum.DepoTransferi:
        if (!malzemeDurumu.malzemeDepoda && !malzemeDurumu.malzemeKonumsuz) throw new Error('Bu malzeme depoda değil, depo transferi yapılamaz.');
        if (malzemeDurumu.malzemeYok) throw new Error('Kayıp/düşüm yapılmış malzemede depo transferi yapılamaz.');
        if (!data.konumId) throw new Error('Depo transferi için hedef konum belirtilmelidir.');
        break;

      case HareketTuruEnum.KondisyonGuncelleme:
        if (malzemeDurumu.malzemeYok) throw new Error('Kayıp/düşüm yapılmış malzemede kondisyon güncellemesi yapılamaz.');
        break;

      case HareketTuruEnum.Kayip:
      case HareketTuruEnum.Dusum:
        if (malzemeDurumu.malzemeYok) throw new Error('Bu malzeme zaten kayıp/düşüm yapılmış.');
        break;
    }
  },

  getAll: async () => {
    try {
      return await prisma[PrismaName].findMany({
        where: { status: AuditStatusEnum.Aktif },
        orderBy: { islemTarihi: 'desc' },
        include: {
          malzeme: {
            select: {
              id: true,
              vidaNo: true,
              sabitKodu: { select: { ad: true } },
              marka: { select: { ad: true } },
              model: { select: { ad: true } },
            },
          },
          kaynakPersonel: { select: { id: true, ad: true, sicil: true } },
          hedefPersonel: { select: { id: true, ad: true, sicil: true } },
          konum: {
            select: {
              id: true,
              ad: true,
              depo: { select: { ad: true } },
            },
          },
          createdBy: { select: { id: true, ad: true, avatar: true } },
        },
      });
    } catch (error) {
      throw error;
    }
  },

  getByQuery: async (data = {}) => {
    try {
      const whereClause = { status: AuditStatusEnum.Aktif };

      if (data.malzemeId) whereClause.malzemeId = data.malzemeId;
      if (data.hareketTuru) whereClause.hareketTuru = data.hareketTuru;
      if (data.kaynakPersonelId) whereClause.kaynakPersonelId = data.kaynakPersonelId;
      if (data.hedefPersonelId) whereClause.hedefPersonelId = data.hedefPersonelId;
      if (data.konumId) whereClause.konumId = data.konumId;
      if (data.malzemeKondisyonu) whereClause.malzemeKondisyonu = data.malzemeKondisyonu;

      return await prisma[PrismaName].findMany({
        where: whereClause,
        orderBy: { islemTarihi: 'desc' },
        include: {
          malzeme: {
            select: {
              id: true,
              vidaNo: true,
              sabitKodu: { select: { ad: true } },
              marka: { select: { ad: true } },
              model: { select: { ad: true } },
            },
          },
          kaynakPersonel: { select: { id: true, ad: true, sicil: true } },
          hedefPersonel: { select: { id: true, ad: true, sicil: true } },
          konum: {
            select: {
              id: true,
              ad: true,
              depo: { select: { ad: true } },
            },
          },
          createdBy: { select: { id: true, ad: true, avatar: true } },
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
          malzeme: {
            select: {
              id: true,
              vidaNo: true,
              sabitKodu: { select: { ad: true } },
              marka: { select: { ad: true } },
              model: { select: { ad: true } },
            },
          },
          kaynakPersonel: { select: { id: true, ad: true, sicil: true } },
          hedefPersonel: { select: { id: true, ad: true, sicil: true } },
          konum: {
            select: {
              id: true,
              ad: true,
              depo: { select: { ad: true } },
            },
          },
          createdBy: { select: { id: true, ad: true, avatar: true } },
        },
      });
    } catch (error) {
      throw error;
    }
  },

  create: async data => {
    try {
      // Doğrulamalar
      await MalzemeService.checkExistsById(data.malzemeId);

      if (data.kaynakPersonelId) await PersonelService.checkExistsById(data.kaynakPersonelId);
      if (data.hedefPersonelId) await PersonelService.checkExistsById(data.hedefPersonelId);
      if (data.konumId) await KonumService.checkExistsById(data.konumId);

      // İş kurallarını kontrol et
      await service.validateHareketKurallari(data);

      const yeniId = helper.generateId(HizmetName);

      const createPayload = {
        id: yeniId,
        malzemeId: data.malzemeId,
        hareketTuru: data.hareketTuru,
        malzemeKondisyonu: data.malzemeKondisyonu,
        status: AuditStatusEnum.Aktif,
        createdById: data.islemYapanKullanici,
      };

      // Hareket türüne göre alanları set et
      switch (data.hareketTuru) {
        case HareketTuruEnum.Kayit:
          createPayload.konumId = data.konumId;
          break;
        case HareketTuruEnum.Zimmet:
          createPayload.hedefPersonelId = data.hedefPersonelId;
          break;
        case HareketTuruEnum.Iade:
          createPayload.kaynakPersonelId = data.kaynakPersonelId;
          createPayload.konumId = data.konumId;
          break;
        case HareketTuruEnum.Devir:
          createPayload.kaynakPersonelId = data.kaynakPersonelId;
          createPayload.hedefPersonelId = data.hedefPersonelId;
          break;
        case HareketTuruEnum.DepoTransferi:
          createPayload.konumId = data.konumId;
          break;
      }

      if (data.aciklama !== undefined) createPayload.aciklama = data.aciklama;
      if (data.islemTarihi !== undefined) createPayload.islemTarihi = data.islemTarihi;

      return await prisma[PrismaName].create({
        data: createPayload,
        include: {
          malzeme: {
            select: {
              id: true,
              vidaNo: true,
              sabitKodu: { select: { ad: true } },
              marka: { select: { ad: true } },
              model: { select: { ad: true } },
            },
          },
          kaynakPersonel: { select: { id: true, ad: true, sicil: true } },
          hedefPersonel: { select: { id: true, ad: true, sicil: true } },
          konum: {
            select: {
              id: true,
              ad: true,
              depo: { select: { ad: true } },
            },
          },
          createdBy: { select: { id: true, ad: true, avatar: true } },
        },
      });
    } catch (error) {
      throw error;
    }
  },

  // Sadece açıklama güncellenebilir
  update: async data => {
    try {
      await service.checkExistsById(data.id);

      const updatePayload = { updatedById: data.islemYapanKullanici };
      if (data.aciklama !== undefined) updatePayload.aciklama = data.aciklama;

      return await prisma[PrismaName].update({
        where: { id: data.id },
        data: updatePayload,
        include: {
          malzeme: {
            select: {
              id: true,
              vidaNo: true,
              sabitKodu: { select: { ad: true } },
              marka: { select: { ad: true } },
              model: { select: { ad: true } },
            },
          },
          kaynakPersonel: { select: { id: true, ad: true, sicil: true } },
          hedefPersonel: { select: { id: true, ad: true, sicil: true } },
          konum: {
            select: {
              id: true,
              ad: true,
              depo: { select: { ad: true } },
            },
          },
          createdBy: { select: { id: true, ad: true, avatar: true } },
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

      if (data.malzemeId) whereClause.malzemeId = data.malzemeId;
      if (data.hareketTuru) whereClause.hareketTuru = data.hareketTuru;

      return await prisma[PrismaName].findMany({
        where: whereClause,
        orderBy: { islemTarihi: 'desc' },
        include: {
          malzeme: {
            select: {
              id: true,
              vidaNo: true,
              sabitKodu: { select: { ad: true } },
              marka: { select: { ad: true } },
              model: { select: { ad: true } },
            },
          },
          kaynakPersonel: { select: { id: true, ad: true, sicil: true } },
          hedefPersonel: { select: { id: true, ad: true, sicil: true } },
          konum: {
            select: {
              id: true,
              ad: true,
              depo: { select: { ad: true } },
            },
          },
          createdBy: { select: { id: true, ad: true, avatar: true } },
        },
      });
    } catch (error) {
      throw error;
    }
  },
};

export default service;
