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

  checkKonumCount: async konumId => {
    try {
      return await prisma[PrismaName].count({ where: { konumId, status: AuditStatusEnum.Aktif } });
    } catch (error) {
      throw error;
    }
  },

  checkMalzemeCount: async malzemeId => {
    try {
      return await prisma[PrismaName].count({ where: { malzemeId, status: AuditStatusEnum.Aktif } });
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

  getAllQuery: async (data = {}) => {
    try {
      const whereClause = { status: AuditStatusEnum.Aktif };
      if (data.malzemeId) whereClause.malzemeId = data.malzemeId;
      if (data.hedefPersonelId) whereClause.hedefPersonelId = data.hedefPersonelId;
      if (data.konumId) whereClause.konumId = data.konumId;
      if (data.hareketTuru) whereClause.hareketTuru = data.hareketTuru;

      // Tarih aralığına göre filtreleme eklenebilir

      return await prisma[PrismaName].findMany({
        where: whereClause,
        orderBy: { islemTarihi: 'desc' }, // En son hareket en üstte
        include: {
          malzeme: { select: { id: true, vidaNo: true, stokDemirbasNo: true } },
          kaynakPersonel: { select: { id: true, ad: true } },
          hedefPersonel: { select: { id: true, ad: true } },
          konum: { select: { id: true, ad: true, depo: { select: { ad: true } } } },
          createdBy: { select: { id: true, ad: true } },
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
          malzeme: { select: { id: true, vidaNo: true, stokDemirbasNo: true } },
          kaynakPersonel: { select: { id: true, ad: true } },
          hedefPersonel: { select: { id: true, ad: true } },
          konum: { select: { id: true, ad: true, depo: { select: { ad: true } } } },
          createdBy: { select: { id: true, ad: true } },
        },
      });
    } catch (error) {
      throw error;
    }
  },

  getByMalzemeId: async data => {
    try {
      await MalzemeService.checkExistsById(data.malzemeId);

      return await prisma[PrismaName].findFirst({
        where: { malzemeId: data.malzemeId, status: AuditStatusEnum.Aktif },
        include: {
          malzeme: { select: { id: true, vidaNo: true, stokDemirbasNo: true } },
          kaynakPersonel: { select: { id: true, ad: true } },
          hedefPersonel: { select: { id: true, ad: true } },
          konum: { select: { id: true, ad: true, depo: { select: { ad: true } } } },
          createdBy: { select: { id: true, ad: true } },
        },
      });
    } catch (error) {
      throw error;
    }
  },

  getByKaynakPersonelId: async data => {
    try {
      await PersonelService.checkExistsById(data.kaynakPersonelId);

      return await prisma[PrismaName].findFirst({
        where: { kaynakPersonelId: data.kaynakPersonelId, status: AuditStatusEnum.Aktif },
        include: {
          malzeme: { select: { id: true, vidaNo: true, stokDemirbasNo: true } },
          kaynakPersonel: { select: { id: true, ad: true } },
          hedefPersonel: { select: { id: true, ad: true } },
          konum: { select: { id: true, ad: true, depo: { select: { ad: true } } } },
          createdBy: { select: { id: true, ad: true } },
        },
      });
    } catch (error) {
      throw error;
    }
  },

  getByHedefPersonelId: async data => {
    try {
      await PersonelService.checkExistsById(data.hedefPersonelId);

      return await prisma[PrismaName].findFirst({
        where: { hedefPersonelId: data.hedefPersonelId, status: AuditStatusEnum.Aktif },
        include: {
          malzeme: { select: { id: true, vidaNo: true, stokDemirbasNo: true } },
          kaynakPersonel: { select: { id: true, ad: true } },
          hedefPersonel: { select: { id: true, ad: true } },
          konum: { select: { id: true, ad: true, depo: { select: { ad: true } } } },
          createdBy: { select: { id: true, ad: true } },
        },
      });
    } catch (error) {
      throw error;
    }
  },

  getByCreatedPersonelId: async data => {
    try {
      await PersonelService.checkExistsById(data.createdById);

      return await prisma[PrismaName].findFirst({
        where: { createdById: data.createdById, status: AuditStatusEnum.Aktif },
        include: {
          malzeme: { select: { id: true, vidaNo: true, stokDemirbasNo: true } },
          kaynakPersonel: { select: { id: true, ad: true } },
          hedefPersonel: { select: { id: true, ad: true } },
          konum: { select: { id: true, ad: true, depo: { select: { ad: true } } } },
          createdBy: { select: { id: true, ad: true } },
        },
      });
    } catch (error) {
      throw error;
    }
  },

  getByKonumId: async data => {
    try {
      await KonumService.checkExistsById(data.konumId);

      return await prisma[PrismaName].findFirst({
        where: { konumId: data.konumId, status: AuditStatusEnum.Aktif },
        include: {
          malzeme: { select: { id: true, vidaNo: true, stokDemirbasNo: true } },
          kaynakPersonel: { select: { id: true, ad: true } },
          hedefPersonel: { select: { id: true, ad: true } },
          konum: { select: { id: true, ad: true, depo: { select: { ad: true } } } },
          createdBy: { select: { id: true, ad: true } },
        },
      });
    } catch (error) {
      throw error;
    }
  },

  // --- Yeni Spesifik Hareket Oluşturma Fonksiyonları ---

  /**
   * Malzemenin sisteme ilk kaydını (depoya giriş) oluşturur.
   * data: { malzemeId, malzemeKondisyonu, hedefKonumId, islemTarihi?, aciklama?, islemYapanKullanici }
   */
  kayitYap: async data => {
    try {
      // if (!data.malzemeKondisyonu || !Object.values(MalzemeKondisyonuEnum).includes(data.malzemeKondisyonu)) throw new Error(message.error.gecersizKondisyon);

      await MalzemeService.checkExistsById(data.malzemeId);
      await KonumService.checkExistsById(data.hedefKonumId);

      const yeniId = helper.generateId(HizmetName);
      return await prisma[PrismaName].create({
        data: {
          id: yeniId,
          islemTarihi: data.islemTarihi ? new Date(data.islemTarihi) : new Date(),
          hareketTuru: HareketTuruEnum.Kayit,
          malzemeKondisyonu: data.malzemeKondisyonu,
          malzemeId: data.malzemeId,
          konumId: data.hedefKonumId, // Kayıtta sadece hedef konum olur
          aciklama: data.aciklama,
          status: AuditStatusEnum.Aktif,
          createdById: data.islemYapanKullanici,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * Malzemeyi bir personele zimmetler.
   * data: { malzemeId, malzemeKondisyonu, hedefPersonelId, kaynakKonumId?, islemTarihi?, aciklama?, islemYapanKullanici }
   */
  zimmetYap: async data => {
    try {
      // if (!data.malzemeKondisyonu || !Object.values(MalzemeKondisyonuEnum).includes(data.malzemeKondisyonu)) throw new Error(message.error.gecersizKondisyon);

      await MalzemeService.checkExistsById(data.malzemeId);
      await PersonelService.checkExistsById(data.hedefPersonelId);

      const yeniId = helper.generateId(HizmetName);
      return await prisma[PrismaName].create({
        data: {
          id: yeniId,
          islemTarihi: data.islemTarihi ? new Date(data.islemTarihi) : new Date(),
          hareketTuru: HareketTuruEnum.Zimmet,
          malzemeKondisyonu: data.malzemeKondisyonu,
          malzemeId: data.malzemeId,
          hedefPersonelId: data.hedefPersonelId,
          aciklama: data.aciklama,
          status: AuditStatusEnum.Aktif,
          createdById: data.islemYapanKullanici,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * Malzemeyi personelden iade alır.
   * data: { malzemeId, malzemeKondisyonu, kaynakPersonelId, hedefKonumId, islemTarihi?, aciklama?, islemYapanKullanici }
   */
  iadeAl: async data => {
    try {
      await MalzemeService.checkExistsById(data.malzemeId);
      await PersonelService.checkExistsById(data.kaynakPersonelId);
      await KonumService.checkExistsById(data.hedefKonumId);

      const yeniId = helper.generateId(HizmetName);
      return await prisma[PrismaName].create({
        data: {
          id: yeniId,
          islemTarihi: data.islemTarihi ? new Date(data.islemTarihi) : new Date(),
          hareketTuru: HareketTuruEnum.Iade,
          malzemeKondisyonu: data.malzemeKondisyonu,
          malzemeId: data.malzemeId,
          kaynakPersonelId: data.kaynakPersonelId,
          konumId: data.hedefKonumId, // İadede 'konumId' hedef konumu ifade eder
          aciklama: data.aciklama,
          status: AuditStatusEnum.Aktif,
          createdById: data.islemYapanKullanici,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * Malzemeyi bir personelden diğerine devreder.
   * data: { malzemeId, malzemeKondisyonu, kaynakPersonelId, hedefPersonelId, islemTarihi?, aciklama?, islemYapanKullanici }
   */
  devirYap: async data => {
    try {
      await MalzemeService.checkExistsById(data.malzemeId);
      await PersonelService.checkExistsById(data.kaynakPersonelId);
      await PersonelService.checkExistsById(data.hedefPersonelId);

      const yeniId = helper.generateId(HizmetName);
      return await prisma[PrismaName].create({
        data: {
          id: yeniId,
          islemTarihi: data.islemTarihi ? new Date(data.islemTarihi) : new Date(),
          hareketTuru: HareketTuruEnum.Devir,
          malzemeKondisyonu: data.malzemeKondisyonu,
          malzemeId: data.malzemeId,
          kaynakPersonelId: data.kaynakPersonelId,
          hedefPersonelId: data.hedefPersonelId,
          aciklama: data.aciklama,
          status: AuditStatusEnum.Aktif,
          createdById: data.islemYapanKullanici,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * Malzemenin kayıp olduğunu bildirir.
   * data: { malzemeId, malzemeKondisyonu, kaynakPersonelId?, kaynakKonumId?, islemTarihi?, aciklama, islemYapanKullanici }
   */
  kayipBildir: async data => {
    try {
      await MalzemeService.checkExistsById(data.malzemeId);

      const yeniId = helper.generateId(HizmetName);
      return await prisma[PrismaName].create({
        data: {
          id: yeniId,
          islemTarihi: data.islemTarihi ? new Date(data.islemTarihi) : new Date(),
          hareketTuru: HareketTuruEnum.Kayip,
          malzemeKondisyonu: data.malzemeKondisyonu, // Kayıp anındaki bilinen son kondisyonu
          malzemeId: data.malzemeId,
          aciklama: data.aciklama,
          status: AuditStatusEnum.Aktif, // Hareketin kendisi aktif
          createdById: data.islemYapanKullanici,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * Malzemenin sadece kondisyonunu günceller (yer veya kişi değişmez).
   * data: { malzemeId, yeniMalzemeKondisyonu, islemTarihi?, aciklama, islemYapanKullanici }
   */
  kondisyonGuncelle: async data => {
    try {
      await MalzemeService.checkExistsById(data.malzemeId);

      const yeniId = helper.generateId(HizmetName);
      return await prisma[PrismaName].create({
        data: {
          id: yeniId,
          islemTarihi: data.islemTarihi ? new Date(data.islemTarihi) : new Date(),
          hareketTuru: HareketTuruEnum.KondisyonGuncelleme,
          malzemeKondisyonu: data.yeniMalzemeKondisyonu,
          malzemeId: data.malzemeId,
          aciklama: data.aciklama,
          status: AuditStatusEnum.Aktif,
          createdById: data.islemYapanKullanici,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * Malzemeyi bir depodan/konumdan başka bir depoya/konuma transfer eder.
   * data: { malzemeId, malzemeKondisyonu, kaynakKonumId, hedefKonumId, islemTarihi?, aciklama?, islemYapanKullanici }
   */
  depoTransferiYap: async data => {
    try {
      await MalzemeService.checkExistsById(data.malzemeId);
      await KonumService.checkExistsById(data.kaynakKonumId);
      await KonumService.checkExistsById(data.hedefKonumId);

      const yeniId = helper.generateId(HizmetName);
      return await prisma[PrismaName].create({
        data: {
          id: yeniId,
          islemTarihi: data.islemTarihi ? new Date(data.islemTarihi) : new Date(),
          hareketTuru: HareketTuruEnum.DepoTransferi,
          malzemeKondisyonu: data.malzemeKondisyonu,
          malzemeId: data.malzemeId,
          // kaynakKonumId ve hedefKonumId'yi nasıl saklayacağımıza karar vermeliyiz.
          // Şemada tek konumId var. Belki açıklamaya yazılır veya şema güncellenir.
          // Şimdilik hedef konumu ana konumId'ye yazıyoruz.
          konumId: data.hedefKonumId,
          aciklama: `Kaynak Konum ID: ${data.kaynakKonumId}. ${data.aciklama || ''}`.trim(),
          status: AuditStatusEnum.Aktif,
          createdById: data.islemYapanKullanici,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * Malzemenin hurdaya ayrılmasını (düşümünü) kaydeder.
   * data: { malzemeId, malzemeKondisyonu (genellikle Hurda), kaynakPersonelId?, kaynakKonumId?, islemTarihi?, aciklama, islemYapanKullanici }
   */
  dusumYap: async data => {
    try {
      await MalzemeService.checkExistsById(data.malzemeId);

      const yeniId = helper.generateId(HizmetName);
      return await prisma[PrismaName].create({
        data: {
          id: yeniId,
          islemTarihi: data.islemTarihi ? new Date(data.islemTarihi) : new Date(),
          hareketTuru: HareketTuruEnum.Dusum,
          malzemeKondisyonu: data.malzemeKondisyonu,
          malzemeId: data.malzemeId,
          konumId: data.kaynakKonumId, // Düşüm yapıldığı son bilinen konum/personel
          aciklama: data.aciklama,
          status: AuditStatusEnum.Aktif, // Hareketin kendisi aktif
          createdById: data.islemYapanKullanici,
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
      if (data.personelId) whereClause.OR = [{ kaynakPersonelId: data.personelId }, { hedefPersonelId: data.personelId }];
      if (data.konumId) whereClause.konumId = data.konumId;
      if (data.hareketTuru) whereClause.hareketTuru = data.hareketTuru;
      if (data.malzemeKondisyonu) whereClause.malzemeKondisyonu = data.malzemeKondisyonu;

      if (data.baslangicTarihi && data.bitisTarihi) {
        whereClause.islemTarihi = { gte: new Date(data.baslangicTarihi), lte: new Date(new Date(data.bitisTarihi).setHours(23, 59, 59, 999)) };
      } else if (data.baslangicTarihi) {
        whereClause.islemTarihi = { gte: new Date(data.baslangicTarihi) };
      } else if (data.bitisTarihi) {
        whereClause.islemTarihi = { lte: new Date(new Date(data.bitisTarihi).setHours(23, 59, 59, 999)) };
      }

      return await prisma[PrismaName].findMany({
        where: whereClause,
        orderBy: { islemTarihi: 'desc' },
        include: {
          malzeme: { select: { id: true, vidaNo: true, stokDemirbasNo: true } },
          kaynakPersonel: { select: { id: true, ad: true } },
          hedefPersonel: { select: { id: true, ad: true } },
          konum: { select: { id: true, ad: true, depo: { select: { ad: true } } } },
          createdBy: { select: { id: true, ad: true } },
        },
      });
    } catch (error) {
      throw error;
    }
  },
};

export default service;
