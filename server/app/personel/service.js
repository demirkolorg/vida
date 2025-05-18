import { prisma } from '../../config/db.js';
import helper from '../../utils/helper.js';
import { HizmetName, HumanName, PrismaName } from './base.js';
import { AuditStatusEnum, RoleEnum } from '@prisma/client';
import BuroService from '../buro/service.js'; // Büro varlığını kontrol etmek için

const service = {
  checkExistsById: async id => {
    try {
      const result = await prisma[PrismaName].findUnique({ where: { id } });
      if (!result || result.status === AuditStatusEnum.Silindi) {
        throw new Error(`${id} ID'sine sahip aktif ${HumanName} bulunamadı.`);
      }
      return result;
    } catch (error) {
      throw error;
    }
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
        include: { buro: { select: { id: true, ad: true } } },
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
        include: { buro: { select: { id: true, ad: true } } },
      });
    } catch (error) {
      throw error;
    }
  },

  getByBuroId: async data => {
    try {
      await BuroService.checkExistsById(data.buroId);

      return await prisma[PrismaName].findFirst({
        where: { buroId: data.buroId, status: AuditStatusEnum.Aktif },
        include: { buro: { select: { id: true, ad: true } } },
      });
    } catch (error) {
      throw error;
    }
  },

  getByRole: async data => {
    try {
      if (!Object.values(RoleEnum).includes(data.role)) throw new Error(`Girilen '${data.role}' rolü geçerli bir rol değildir.`);

      return await prisma[PrismaName].findFirst({
        where: { role: data.role, status: AuditStatusEnum.Aktif },
        include: { buro: { select: { id: true, ad: true } } },
      });
    } catch (error) {
      throw error;
    }
  },

  getByIsUser: async data => {
    try {
      // await BuroService.checkExistsById(data.role);

      return await prisma[PrismaName].findFirst({
        where: { isUser: data.isUser, status: AuditStatusEnum.Aktif },
        include: { buro: { select: { id: true, ad: true } } },
      });
    } catch (error) {
      throw error;
    }
  },
  getByIsAmir: async data => {
    try {
      // await BuroService.checkExistsById(data.role);

      return await prisma[PrismaName].findFirst({
        where: { isAmir: data.isAmir, status: AuditStatusEnum.Aktif },
        include: { buro: { select: { id: true, ad: true } } },
      });
    } catch (error) {
      throw error;
    }
  },

  create: async data => {
    try {
      await BuroService.checkExistsById(data.buroId);

      const yeniId = helper.generateId(HizmetName);

      const createPayload = {
        id: yeniId,
        ad: data.ad,
        role: data.role,
        buroId: data.buroId,
        isUser: data.isUser !== undefined ? data.isUser : false,
        isAmir: data.isAmir !== undefined ? data.isAmir : false,
        status: AuditStatusEnum.Aktif,
        createdById: data.islemYapanKullanici,
      };
      if (data.avatar !== undefined) createPayload.avatar = data.avatar;

      return await prisma[PrismaName].create({ data: createPayload });
    } catch (error) {
      throw error;
    }
  },

  update: async data => {
    try {
      const existingEntity = await service.checkExistsById(data.id);
      if (data.role === undefined || !Object.values(RoleEnum).includes(data.role)) throw new Error(`Girilen '${data.role}' rolü geçerli bir rol değildir.`);

      const updatePayload = { updatedById: data.islemYapanKullanici };
      if (data.ad !== undefined) updatePayload.ad = data.ad;
      if (data.avatar !== undefined) updatePayload.avatar = data.avatar;
      if (data.isUser !== undefined) updatePayload.isUser = data.isUser;
      if (data.isAmir !== undefined) updatePayload.isAmir = data.isAmir;
      if (data.role !== undefined && Object.values(RoleEnum).includes(data.role)) updatePayload.role = data.role;

      if (data.buroId !== undefined) {
        if (data.buroId !== null && data.buroId !== existingEntity.buroId) {
          await BirimService.checkExistsById(data.buroId);
        }
        updatePayload.buroId = data.buroId;
      }
      // Eğer isAmir false yapılıyorsa ve bu personel bir büronun amiri ise, o büronun amirId'sini null yap
      if (data.isAmir === false && existingEntity.isAmir === true) {
        await prisma.buro.updateMany({
          where: { amirId: data.id },
          data: { amirId: null },
        });
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
      const personel = await service.checkExistsById(data.id);
      const personelId = data.id;

      // 1. Bu personel bir büronun amiri mi kontrol et (yonettigiBurolar)
      if (personel.isAmir) {
        const yonettigiBuroSayisi = await prisma.buro.count({ where: { amirId: personelId, status: AuditStatusEnum.Aktif } });
        if (yonettigiBuroSayisi > 0) throw new Error(`Bu ${HumanName} silinemez çünkü  ${aktifZimmetSayisi} aktif büro amiri kaydı bulunmaktadır.`);
      }

      // 2. Bu personele bağlı aktif malzeme hareketi var mı kontrol et (kaynak veya hedef olarak)
      // (malzemeHareketleriKaynak, malzemeHareketleriHedef)
      // Bu kontrol, personelin üzerinde hala zimmetli malzeme olup olmadığını anlamak için daha karmaşık bir sorgu gerektirebilir.
      // Şimdilik, personelin herhangi bir aktif harekette kaynak veya hedef olup olmadığına bakıyoruz.
      // Daha iyisi: Bu personelin üzerinde aktif zimmetli malzeme olup olmadığını kontrol etmek
      // (yani en son hareketinin hedefPersonelId olduğu ve iade edilmemiş malzemeler)
      const aktifZimmetSayisi = await prisma.malzemeHareket.count({
        where: {
          hedefPersonelId: personelId,
          status: AuditStatusEnum.Aktif, // Hareketin durumu
          // Ek olarak, bu hareketin bir "iade" veya "devir (kaynak olarak)" ile sonlanmadığını kontrol etmek gerekir.
          // Bu, daha karmaşık bir alt sorgu veya mantık gerektirir.
          // Şimdilik, sadece hedef olduğu aktif hareketlere bakıyoruz.
          // Daha kapsamlı kontrol: Malzemenin son hareketine bakıp, o hareketin hedefi bu personel mi ve türü zimmet mi?
        },
      });
      if (aktifZimmetSayisi > 0) throw new Error(`Bu ${NAME_HUMAN} silinemez çünkü üzerine zimmetli ${aktifZimmetSayisi} aktif malzeme bulunmaktadır.`);

      // 3. Diğer tablolarda createdBy veya updatedBy olarak kullanılıyor mu?
      const referansKontrolleri = [
        { model: prisma.birim, adi: 'Birim (Oluşturan)', alan: 'createdById' },
        { model: prisma.birim, adi: 'Birim (Güncelleyen)', alan: 'updatedById' },
        { model: prisma.sube, adi: 'Şube (Oluşturan)', alan: 'createdById' },
        { model: prisma.sube, adi: 'Şube (Güncelleyen)', alan: 'updatedById' },
        { model: prisma.buro, adi: 'Büro (Oluşturan)', alan: 'createdById' },
        { model: prisma.buro, adi: 'Büro (Güncelleyen)', alan: 'updatedById' },
        // yonettigiBurolar zaten yukarıda amirId ile kontrol edildi.
        { model: prisma.sabitKodu, adi: 'Sabit Kod (Oluşturan)', alan: 'createdById' },
        { model: prisma.sabitKodu, adi: 'Sabit Kod (Güncelleyen)', alan: 'updatedById' },
        { model: prisma.marka, adi: 'Marka (Oluşturan)', alan: 'createdById' },
        { model: prisma.marka, adi: 'Marka (Güncelleyen)', alan: 'updatedById' },
        { model: prisma.model, adi: 'Model (Oluşturan)', alan: 'createdById' },
        { model: prisma.model, adi: 'Model (Güncelleyen)', alan: 'updatedById' },
        { model: prisma.depo, adi: 'Depo (Oluşturan)', alan: 'createdById' },
        { model: prisma.depo, adi: 'Depo (Güncelleyen)', alan: 'updatedById' },
        { model: prisma.konum, adi: 'Konum (Oluşturan)', alan: 'createdById' },
        { model: prisma.konum, adi: 'Konum (Güncelleyen)', alan: 'updatedById' },
        { model: prisma.malzeme, adi: 'Malzeme (Oluşturan)', alan: 'createdById' },
        { model: prisma.malzeme, adi: 'Malzeme (Güncelleyen)', alan: 'updatedById' },
        { model: prisma.malzemeHareket, adi: 'Malzeme Hareketi (Oluşturan)', alan: 'createdById' },
        // MalzemeHareket'te kaynak/hedef personel zaten zimmet kontrolünde ele alındı.
        { model: prisma.auditLog, adi: 'Audit Log (Oluşturan)', alan: 'createdById' },
        // Personel tablosunda başka personelleri oluşturmuş/güncellemiş mi?
        // Bu genellikle silme işlemini engellemez ama loglanabilir veya özel bir kurala tabi olabilir.
        // Şimdilik bu kontrolü atlıyoruz, çünkü bir personelin diğerlerini yönetmesi normaldir.
      ];

      for (const kontrol of referansKontrolleri) {
        const sayi = await kontrol.model.count({ where: { [kontrol.alan]: personelId, status: AuditStatusEnum.Aktif } });
        if (sayi > 0) throw new Error(`Bu ${HumanName} silinemez çünkü ${sayi} adet aktif ${kontrol.adi} kaydında referans olarak kullanılmaktadır.`);
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
      if (data.buroId) whereClause.buroId = { contains: data.buroId, mode: 'insensitive' };
      if (data.role) whereClause.role = { contains: data.role, mode: 'insensitive' };
      if (data.isUser !== undefined) whereClause.isUser = data.isUser;
      if (data.isAmir !== undefined) whereClause.isAmir = data.isAmir;

      return await prisma[PrismaName].findMany({
        where: whereClause,
        orderBy: { ad: 'asc' },
        include: { marka: { select: { id: true, ad: true } } },
      });
    } catch (error) {
      throw error;
    }
  },
};

export default service;
