// server/src/services/tutanak/service.js

import { prisma } from '../../config/db.js';
import helper from '../../utils/helper.js';
import { PrismaName, HumanName, VarlıkKod } from './base.js';
import { AuditStatusEnum, HareketTuruEnum, MalzemeTipiEnum } from '@prisma/client';

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
        orderBy: { createdAt: 'desc' },
        include: {
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
      const whereClause = { status: AuditStatusEnum.Aktif };
      
      if (data.hareketTuru) whereClause.hareketTuru = data.hareketTuru;
      if (data.tutanakNo) whereClause.tutanakNo = { contains: data.tutanakNo, mode: 'insensitive' };
      if (data.createdById) whereClause.createdById = data.createdById;
      
      if (data.tarihBaslangic && data.tarihBitis) {
        whereClause.createdAt = {
          gte: new Date(data.tarihBaslangic),
          lte: new Date(data.tarihBitis)
        };
      }

      return await prisma[PrismaName].findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        include: {
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
      const yeniId = helper.generateId(VarlıkKod);
      
      // Tutanak numarası oluştur (format: TTN-YYYY-MM-DD-XXXX)
      const tarih = new Date();
      const yil = tarih.getFullYear();
      const ay = String(tarih.getMonth() + 1).padStart(2, '0');
      const gun = String(tarih.getDate()).padStart(2, '0');
      
      // Aynı gün içindeki son tutanak numarasını bul
      const sonTutanak = await prisma[PrismaName].findFirst({
        where: {
          tutanakNo: { startsWith: `TTN-${yil}-${ay}-${gun}-` },
          status: AuditStatusEnum.Aktif
        },
        orderBy: { tutanakNo: 'desc' }
      });

      let siraNo = 1;
      if (sonTutanak) {
        const sonSiraNo = parseInt(sonTutanak.tutanakNo.split('-')[2]);
        siraNo = sonSiraNo + 1;
      }

      const tutanakNo = `TTN-${yil}${ay}${gun}-${String(siraNo).padStart(4, '0')}`;

      // İstatistikleri hesapla
      const malzemeler = data.malzemeler || [];
      const toplamMalzeme = malzemeler.length;
      const demirbasSayisi = malzemeler.filter(m => m.malzemeTipi === 'Demirbas').length;
      const sarfSayisi = malzemeler.filter(m => m.malzemeTipi === 'Sarf').length;

      const createPayload = {
        id: yeniId,
        tutanakNo,
        hareketTuru: data.hareketTuru,
        malzemeIds: data.malzemeIds || [],
        malzemeler: data.malzemeler || [],
        personelBilgileri: data.personelBilgileri || {},
        islemBilgileri: data.islemBilgileri || {},
        konumBilgileri: data.konumBilgileri || null,
        toplamMalzeme,
        demirbasSayisi,
        sarfSayisi,
        ekDosyalar: data.ekDosyalar || null,
        status: AuditStatusEnum.Aktif,
        createdById: data.islemYapanKullanici,
      };

      return await prisma[PrismaName].create({
        data: createPayload,
        include: {
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
      
      if (data.hareketTuru !== undefined) updatePayload.hareketTuru = data.hareketTuru;
      if (data.malzemeIds !== undefined) updatePayload.malzemeIds = data.malzemeIds;
      if (data.malzemeler !== undefined) {
        updatePayload.malzemeler = data.malzemeler;
        // İstatistikleri güncelle
        updatePayload.toplamMalzeme = data.malzemeler.length;
        updatePayload.demirbasSayisi = data.malzemeler.filter(m => m.malzemeTipi === 'Demirbas').length;
        updatePayload.sarfSayisi = data.malzemeler.filter(m => m.malzemeTipi === 'Sarf').length;
      }
      if (data.personelBilgileri !== undefined) updatePayload.personelBilgileri = data.personelBilgileri;
      if (data.islemBilgileri !== undefined) updatePayload.islemBilgileri = data.islemBilgileri;
      if (data.konumBilgileri !== undefined) updatePayload.konumBilgileri = data.konumBilgileri;
      if (data.ekDosyalar !== undefined) updatePayload.ekDosyalar = data.ekDosyalar;

      return await prisma[PrismaName].update({
        where: { id: data.id },
        data: updatePayload,
        include: {
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

      if (!Object.values(AuditStatusEnum).includes(data.status)) {
        throw new Error(`Girilen '${data.status}' durumu geçerli bir durum değildir.`);
      }

      const updatePayload = { 
        status: data.status,
        updatedById: data.islemYapanKullanici 
      };

      return await prisma[PrismaName].update({
        where: { id: data.id },
        data: updatePayload,
        include: {
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

      if (data.tutanakNo) {
        whereClause.tutanakNo = { contains: data.tutanakNo, mode: 'insensitive' };
      }
      if (data.hareketTuru) {
        whereClause.hareketTuru = data.hareketTuru;
      }

      return await prisma[PrismaName].findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: { select: { id: true, ad: true, avatar: true } },
          updatedBy: { select: { id: true, ad: true, avatar: true } },
        },
      });
    } catch (error) {
      throw error;
    }
  },

  // Özel tutanak metodları
  generateFromHareketler: async data => {
    try {
      const { hareketIds, hareketTuru, islemYapanKullanici } = data;

      if (!hareketIds || !Array.isArray(hareketIds) || hareketIds.length === 0) {
        throw new Error('Tutanak için hareket ID\'leri gerekli.');
      }

      if (!Object.values(HareketTuruEnum).includes(hareketTuru)) {
        throw new Error('Geçersiz hareket türü.');
      }

      // Hareket bilgilerini getir
      const hareketler = await prisma.malzemeHareket.findMany({
        where: {
          id: { in: hareketIds },
          hareketTuru,
          status: AuditStatusEnum.Aktif
        },
        include: {
          malzeme: {
            include: {
              sabitKodu: true,
              marka: true,
              model: true
            }
          },
          kaynakPersonel: true,
          hedefPersonel: true,
          konum: {
            include: { depo: true }
          }
        }
      });

      if (hareketler.length === 0) {
        throw new Error('Belirtilen hareket türünde hareket bulunamadı.');
      }

      // Malzeme ID'leri ve detayları
      const malzemeIds = hareketler.map(h => h.malzeme.id);
      const malzemeler = hareketler.map(hareket => ({
        id: hareket.malzeme.id,
        vidaNo: hareket.malzeme.vidaNo,
        sabitKodu: hareket.malzeme.sabitKodu?.ad,
        marka: hareket.malzeme.marka?.ad,
        model: hareket.malzeme.model?.ad,
        bademSeriNo: hareket.malzeme.bademSeriNo,
        malzemeTipi: hareket.malzeme.malzemeTipi,
        kondisyon: hareket.malzemeKondisyonu
      }));

      // Personel bilgilerini düzenle
      const personelBilgileri = {
        kaynakPersonel: hareketler[0]?.kaynakPersonel ? {
          id: hareketler[0].kaynakPersonel.id,
          ad: hareketler[0].kaynakPersonel.ad,
          sicil: hareketler[0].kaynakPersonel.sicil
        } : null,
        hedefPersonel: hareketler[0]?.hedefPersonel ? {
          id: hareketler[0].hedefPersonel.id,
          ad: hareketler[0].hedefPersonel.ad,
          sicil: hareketler[0].hedefPersonel.sicil
        } : null
      };

      // İşlem bilgileri
      const islemBilgileri = {
        tarih: new Date(),
        hareketTuru,
        aciklama: data.aciklama || `${hareketTuru} işlemi için otomatik oluşturulan tutanak`,
        hareketIds
      };

      // Konum bilgileri
      const konumBilgileri = hareketler[0]?.konum ? {
        id: hareketler[0].konum.id,
        ad: hareketler[0].konum.ad,
        depo: hareketler[0].konum.depo?.ad
      } : null;

      // Tutanak oluştur
      const tutanakData = {
        hareketTuru,
        malzemeIds,
        malzemeler,
        personelBilgileri,
        islemBilgileri,
        konumBilgileri,
        islemYapanKullanici
      };

      return await service.create(tutanakData);
    } catch (error) {
      throw error;
    }
  },

  generateFromMalzemeler: async data => {
    try {
      const { malzemeIds, hareketTuru, personelBilgileri, islemYapanKullanici } = data;

      if (!malzemeIds || !Array.isArray(malzemeIds) || malzemeIds.length === 0) {
        throw new Error('Tutanak için malzeme ID\'leri gerekli.');
      }

      // Malzeme bilgilerini getir
      const malzemeler = await prisma.malzeme.findMany({
        where: {
          id: { in: malzemeIds },
          status: AuditStatusEnum.Aktif
        },
        include: {
          sabitKodu: true,
          marka: true,
          model: true,
          malzemeHareketleri: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            where: { status: AuditStatusEnum.Aktif }
          }
        }
      });

      if (malzemeler.length === 0) {
        throw new Error('Belirtilen malzemeler bulunamadı.');
      }

      // Malzeme bilgilerini düzenle
      const malzemelerData = malzemeler.map(malzeme => ({
        id: malzeme.id,
        vidaNo: malzeme.vidaNo,
        sabitKodu: malzeme.sabitKodu?.ad,
        marka: malzeme.marka?.ad,
        model: malzeme.model?.ad,
        bademSeriNo: malzeme.bademSeriNo,
        malzemeTipi: malzeme.malzemeTipi,
        kondisyon: malzeme.malzemeHareketleri[0]?.malzemeKondisyonu || 'Saglam'
      }));

      // İşlem bilgileri
      const islemBilgileri = {
        tarih: new Date(),
        hareketTuru,
        aciklama: data.aciklama || `${hareketTuru} işlemi için oluşturulan tutanak`
      };

      // Tutanak oluştur
      const tutanakData = {
        hareketTuru,
        malzemeIds,
        malzemeler: malzemelerData,
        personelBilgileri: personelBilgileri || {},
        islemBilgileri,
        konumBilgileri: data.konumBilgileri || null,
        islemYapanKullanici
      };

      return await service.create(tutanakData);
    } catch (error) {
      throw error;
    }
  },

  getByHareketTuru: async (hareketTuru) => {
    try {
      if (!Object.values(HareketTuruEnum).includes(hareketTuru)) {
        throw new Error('Geçersiz hareket türü.');
      }

      return await prisma[PrismaName].findMany({
        where: { 
          hareketTuru,
          status: AuditStatusEnum.Aktif 
        },
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: { select: { id: true, ad: true, avatar: true } },
          updatedBy: { select: { id: true, ad: true, avatar: true } },
        },
      });
    } catch (error) {
      throw error;
    }
  },

  getIstatistikler: async () => {
    try {
      const toplam = await prisma[PrismaName].count({
        where: { status: AuditStatusEnum.Aktif }
      });

      const hareketTuruIstatistik = await prisma[PrismaName].groupBy({
        by: ['hareketTuru'],
        where: { status: AuditStatusEnum.Aktif },
        _count: { hareketTuru: true },
        _sum: { toplamMalzeme: true, demirbasSayisi: true, sarfSayisi: true }
      });

      const aylikIstatistik = await prisma[PrismaName].groupBy({
        by: ['createdAt'],
        where: { 
          status: AuditStatusEnum.Aktif,
          createdAt: {
            gte: new Date(new Date().getFullYear(), 0, 1)
          }
        },
        _count: { createdAt: true }
      });

      return {
        toplam,
        hareketTuruIstatistik,
        aylikIstatistik
      };
    } catch (error) {
      throw error;
    }
  }
};

export default service;