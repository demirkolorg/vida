// server/app/malzemeHareket/service.js - Düzeltilmiş versiyon
import { prisma } from '../../config/db.js';
import helper from '../../utils/helper.js';
import { HizmetName, PrismaName, HumanName } from './base.js';
import { AuditStatusEnum, HareketTuruEnum, MalzemeKondisyonuEnum } from '@prisma/client';

// Ortak include ve orderBy
const includeEntity = {
  malzeme: {
    select: {
      id: true,
      vidaNo: true,
      sabitKodu: { select: { id: true, ad: true } },
      marka: { select: { id: true, ad: true } },
      model: { select: { id: true, ad: true } },
    },
  },
  kaynakPersonel: { select: { id: true, ad: true, sicil: true, avatar: true } },
  hedefPersonel: { select: { id: true, ad: true, sicil: true, avatar: true } },
  konum: {
    select: {
      id: true,
      ad: true,
      depo: { select: { id: true, ad: true } },
    },
  },
  createdBy: { select: { id: true, ad: true, avatar: true } },
};

const orderByEntity = { createdAt: 'desc' };

const service = {
  checkExistsById: async id => {
    const result = await prisma[PrismaName].findUnique({ where: { id } });
    if (!result || result.status === AuditStatusEnum.Silindi) {
      throw new Error(`${id} ID'sine sahip aktif ${HumanName} bulunamadı.`);
    }
    return result;
  },

  checkMalzemeExists: async malzemeId => {
    const result = await prisma.malzeme.findUnique({
      where: { id: malzemeId, status: AuditStatusEnum.Aktif },
    });
    if (!result) {
      throw new Error(`${malzemeId} ID'sine sahip aktif malzeme bulunamadı.`);
    }
    return result;
  },

  checkPersonelExists: async personelId => {
    const result = await prisma.personel.findUnique({
      where: { id: personelId, status: AuditStatusEnum.Aktif },
    });
    if (!result) {
      throw new Error(`${personelId} ID'sine sahip aktif personel bulunamadı.`);
    }
    return result;
  },

  checkKonumExists: async konumId => {
    const result = await prisma.konum.findUnique({
      where: { id: konumId, status: AuditStatusEnum.Aktif },
    });
    if (!result) {
      throw new Error(`${konumId} ID'sine sahip aktif konum bulunamadı.`);
    }
    return result;
  },

  getAnlamliSonHareket: malzemeHareketleri => {
  if (!malzemeHareketleri || malzemeHareketleri.length === 0) return undefined;
  for (const hareket of malzemeHareketleri) {
    if (hareket.hareketTuru !== 'KondisyonGuncelleme') {
      return hareket;
    }
  }
  return undefined;
},

  getLastHareketByMalzemeId: async malzemeId => {
    return await prisma[PrismaName].findFirst({
      where: {
        malzemeId,
        status: AuditStatusEnum.Aktif,
      },
      orderBy: orderByEntity,
      include: {
        kaynakPersonel: { select: { id: true, ad: true, sicil: true } },
        hedefPersonel: { select: { id: true, ad: true, sicil: true } },
        konum: {
          select: {
            id: true,
            ad: true,
            depo: { select: { id: true, ad: true } },
          },
        },
      },
    });
  },
  getHareketlerByMalzemeId: async malzemeId => {
    return await prisma[PrismaName].findMany({
      where: {
        malzemeId,
        status: AuditStatusEnum.Aktif,
      },
      orderBy: orderByEntity,
      include: {
        kaynakPersonel: { select: { id: true, ad: true, sicil: true } },
        hedefPersonel: { select: { id: true, ad: true, sicil: true } },
        konum: {
          select: {
            id: true,
            ad: true,
            depo: { select: { id: true, ad: true } },
          },
        },
      },
    });
  },
  checkMalzemeZimmetDurumu: async malzemeId => {
    const hareketler = await service.getHareketlerByMalzemeId(malzemeId);
    if (!hareketler) {
      return {
        malzemePersonelde: false,
        malzemeDepoda: false,
        malzemeKonumsuz: true,
        malzemeYok: false,
        currentPersonel: null,
        currentKonum: null,
        currentKondisyon: 'Saglam',
        lastHareketTuru: null,
        lastHareket: null,
      };
    }
    const lastHareket = await service.getLastHareketByMalzemeId(malzemeId);
    const hareketTuru=await service.getAnlamliSonHareket(hareketler).hareketTuru
    
    // const hareketTuru = lastHareket.hareketTuru;
    const malzemePersonelde = ['Zimmet', 'Devir'].includes(hareketTuru);
    const malzemeDepoda = ['Kayit', 'Iade', 'DepoTransferi'].includes(hareketTuru);
    const malzemeKonumsuz = ['KondisyonGuncelleme'].includes(hareketTuru);
    const malzemeYok = ['Kayip', 'Dusum'].includes(hareketTuru);

    let currentPersonel = null;
    let currentKonum = null;

    if (malzemePersonelde) {
      currentPersonel = lastHareket.hedefPersonel;
    } else if (malzemeDepoda) {
      currentKonum = lastHareket.konum;
    }

    return {
      malzemePersonelde,
      malzemeDepoda,
      malzemeKonumsuz,
      malzemeYok,
      currentPersonel,
      currentKonum,
      currentKondisyon: lastHareket.malzemeKondisyonu,
      lastHareketTuru: hareketTuru,
      lastHareket,
    };
  },

  getAll: async () => {
    try {
      return await prisma[PrismaName].findMany({
        where: { status: AuditStatusEnum.Aktif },
        orderBy: { createdAt: 'desc' },
        include: includeEntity,
      });
    } catch (error) {
      throw error;
    }
  },

  getByQuery: async (data = {}) => {
    try {
      const whereClause = {};
      if (data.status) whereClause.status = data.status;
      if (data.hareketTuru) whereClause.hareketTuru = data.hareketTuru;
      if (data.malzemeId) whereClause.malzemeId = data.malzemeId;
      if (data.malzemeKondisyonu) whereClause.malzemeKondisyonu = data.malzemeKondisyonu;
      if (data.kaynakPersonelId) whereClause.kaynakPersonelId = data.kaynakPersonelId;
      if (data.hedefPersonelId) whereClause.hedefPersonelId = data.hedefPersonelId;
      if (data.konumId) whereClause.konumId = data.konumId;

      return await prisma[PrismaName].findMany({
        where: whereClause,
        orderBy: orderByEntity,
        include: includeEntity,
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
        include: includeEntity,
      });
    } catch (error) {
      throw error;
    }
  },

  create: async data => {
    try {
      await service.checkMalzemeExists(data.malzemeId);

      const yeniId = helper.generateId(HizmetName);
      const createPayload = {
        id: yeniId,
        islemTarihi: new Date(data.islemTarihi || new Date()),
        hareketTuru: data.hareketTuru,
        malzemeKondisyonu: data.malzemeKondisyonu || 'Saglam',
        malzemeId: data.malzemeId,
        status: AuditStatusEnum.Aktif,
        createdById: data.islemYapanKullanici,
      };

      // Opsiyonel alanlar
      if (data.kaynakPersonelId) {
        await service.checkPersonelExists(data.kaynakPersonelId);
        createPayload.kaynakPersonelId = data.kaynakPersonelId;
      }
      if (data.hedefPersonelId) {
        await service.checkPersonelExists(data.hedefPersonelId);
        createPayload.hedefPersonelId = data.hedefPersonelId;
      }
      if (data.konumId) {
        await service.checkKonumExists(data.konumId);
        createPayload.konumId = data.konumId;
      }
      if (data.aciklama !== undefined) createPayload.aciklama = data.aciklama;

      return await prisma[PrismaName].create({
        data: createPayload,
        include: includeEntity,
      });
    } catch (error) {
      throw error;
    }
  },

  update: async data => {
    try {
      await service.checkExistsById(data.id);

      const updatePayload = {
        updatedById: data.islemYapanKullanici,
      };

      if (data.aciklama !== undefined) updatePayload.aciklama = data.aciklama;

      return await prisma[PrismaName].update({
        where: { id: data.id },
        data: updatePayload,
        include: includeEntity,
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

      if (data.hareketTuru) whereClause.hareketTuru = data.hareketTuru;
      if (data.malzemeId) whereClause.malzemeId = data.malzemeId;
      if (data.malzemeKondisyonu) whereClause.malzemeKondisyonu = data.malzemeKondisyonu;

      return await prisma[PrismaName].findMany({
        where: whereClause,
        orderBy: orderByEntity,
        include: includeEntity,
      });
    } catch (error) {
      throw error;
    }
  },

  // İŞ SÜREÇLERİ - ÖZEL HAREKET METODLARI

  // ZIMMET SERVISI
  zimmet: async data => {
    try {
      if (!data.malzemeId) throw new Error('Zimmet işlemi için malzeme zorunludur.');
      await service.checkMalzemeExists(data.malzemeId);
      
      if (!data.hedefPersonelId) throw new Error('Zimmet işlemi için hedef personel zorunludur.');
      await service.checkPersonelExists(data.hedefPersonelId);

      const malzemeDurum = await service.checkMalzemeZimmetDurumu(data.malzemeId);

      if (malzemeDurum.malzemePersonelde) {
        throw new Error('Bu malzeme zaten zimmetli durumda. Önce iade alınmalı.');
      }
      if (!malzemeDurum.malzemeDepoda && !malzemeDurum.malzemeKonumsuz) {
        throw new Error('Malzeme depoda değil. Zimmet verilemez.');
      }
      if (malzemeDurum.currentKondisyon !== 'Saglam') {
        throw new Error('Sadece sağlam durumda olan malzemeler zimmetlenebilir.');
      }
      if (malzemeDurum.malzemeYok) {
        throw new Error('Kayıp veya düşüm yapılmış malzemeler zimmetlenemez.');
      }

      const yeniId = helper.generateId(HizmetName);
      const createPayload = {
        id: yeniId,
        islemTarihi: new Date(data.islemTarihi || new Date()),
        hareketTuru: 'Zimmet',
        malzemeKondisyonu: data.malzemeKondisyonu || 'Saglam',
        malzemeId: data.malzemeId,
        hedefPersonelId: data.hedefPersonelId,
        kaynakPersonelId: null,
        konumId: null,
        aciklama: data.aciklama,
        status: AuditStatusEnum.Aktif,
        createdById: data.islemYapanKullanici,
      };

      return await prisma[PrismaName].create({
        data: createPayload,
        include: includeEntity,
      });
    } catch (error) {
      throw error;
    }
  },

  // İADE SERVISI
  iade: async data => {
    try {
      if (!data.malzemeId) throw new Error('İade işlemi için malzeme zorunludur.');
      await service.checkMalzemeExists(data.malzemeId);

      if (!data.kaynakPersonelId) throw new Error('İade işlemi için kaynak personel zorunludur.');
      await service.checkPersonelExists(data.kaynakPersonelId);

      if (!data.konumId) throw new Error('İade işlemi için hedef konum zorunludur.');
      await service.checkKonumExists(data.konumId);

      const malzemeDurum = await service.checkMalzemeZimmetDurumu(data.malzemeId);

      if (!malzemeDurum.malzemePersonelde) {
        throw new Error('Bu malzeme zimmetli değil. İade işlemi yapılamaz.');
      }
      if (malzemeDurum.currentPersonel && data.kaynakPersonelId !== malzemeDurum.currentPersonel.id) {
        throw new Error(`Bu malzeme "${malzemeDurum.currentPersonel.ad}" adlı personelde zimmetli. İade işlemi sadece o personel tarafından yapılabilir.`);
      }

      const yeniId = helper.generateId(HizmetName);
      const createPayload = {
        id: yeniId,
        islemTarihi: new Date(data.islemTarihi || new Date()),
        hareketTuru: 'Iade',
        malzemeKondisyonu: data.malzemeKondisyonu || 'Saglam',
        malzemeId: data.malzemeId,
        kaynakPersonelId: data.kaynakPersonelId,
        konumId: data.konumId,
        hedefPersonelId: null,
        aciklama: data.aciklama,
        status: AuditStatusEnum.Aktif,
        createdById: data.islemYapanKullanici,
      };

      return await prisma[PrismaName].create({
        data: createPayload,
        include: includeEntity,
      });
    } catch (error) {
      throw error;
    }
  },

  // DEVİR SERVISI
  devir: async data => {
    try {
      await service.checkMalzemeExists(data.malzemeId);
      if (!data.kaynakPersonelId || !data.hedefPersonelId) {
        throw new Error('Devir işlemi için kaynak ve hedef personel zorunludur.');
      }
      if (data.kaynakPersonelId === data.hedefPersonelId) {
        throw new Error('Kaynak ve hedef personel aynı olamaz.');
      }
      await service.checkPersonelExists(data.kaynakPersonelId);
      await service.checkPersonelExists(data.hedefPersonelId);

      const malzemeDurum = await service.checkMalzemeZimmetDurumu(data.malzemeId);

      if (!malzemeDurum.malzemePersonelde) {
        throw new Error('Bu malzeme zimmetli değil. Devir işlemi yapılamaz.');
      }
      if (malzemeDurum.currentPersonel && data.kaynakPersonelId !== malzemeDurum.currentPersonel.id) {
        throw new Error(`Bu malzeme "${malzemeDurum.currentPersonel.ad}" adlı personelde zimmetli. Devir işlemi sadece o personel tarafından yapılabilir.`);
      }

      const yeniId = helper.generateId(HizmetName);
      const createPayload = {
        id: yeniId,
        islemTarihi: new Date(data.islemTarihi || new Date()),
        hareketTuru: 'Devir',
        malzemeKondisyonu: data.malzemeKondisyonu || 'Saglam',
        malzemeId: data.malzemeId,
        kaynakPersonelId: data.kaynakPersonelId,
        hedefPersonelId: data.hedefPersonelId,
        konumId: null,
        aciklama: data.aciklama,
        status: AuditStatusEnum.Aktif,
        createdById: data.islemYapanKullanici,
      };

      return await prisma[PrismaName].create({
        data: createPayload,
        include: includeEntity,
      });
    } catch (error) {
      throw error;
    }
  },

  // DEPO TRANSFER SERVISI
  depoTransfer: async data => {
    try {
      await service.checkMalzemeExists(data.malzemeId);
      if (!data.konumId) throw new Error('Depo transferi için hedef konum zorunludur.');
      await service.checkKonumExists(data.konumId);

      const malzemeDurum = await service.checkMalzemeZimmetDurumu(data.malzemeId);

      if (malzemeDurum.malzemePersonelde) {
        throw new Error('Zimmetli malzemeler depo transferi yapılamaz. Önce iade alınmalı.');
      }
      if (!malzemeDurum.malzemeDepoda && !malzemeDurum.malzemeKonumsuz) {
        throw new Error('Malzemenin transfer edilebilmesi için mevcut bir konumda olması gerekir.');
      }
      if (malzemeDurum.currentKonum?.id === data.konumId) {
        throw new Error('Malzeme zaten bu konumda. Farklı bir hedef konum seçin.');
      }
      if (malzemeDurum.malzemeYok) {
        throw new Error('Kayıp veya düşüm yapılmış malzemeler transfer edilemez.');
      }

      const yeniId = helper.generateId(HizmetName);
      const createPayload = {
        id: yeniId,
        islemTarihi: new Date(data.islemTarihi || new Date()),
        hareketTuru: 'DepoTransferi',
        malzemeKondisyonu: data.malzemeKondisyonu || 'Saglam',
        malzemeId: data.malzemeId,
        konumId: data.konumId,
        kaynakPersonelId: null,
        hedefPersonelId: null,
        aciklama: data.aciklama,
        status: AuditStatusEnum.Aktif,
        createdById: data.islemYapanKullanici,
      };

      return await prisma[PrismaName].create({
        data: createPayload,
        include: includeEntity,
      });
    } catch (error) {
      throw error;
    }
  },

  // KONDİSYON GÜNCELLEME SERVISI
  kondisyonGuncelleme: async data => {
    try {
      await service.checkMalzemeExists(data.malzemeId);
      if (!data.malzemeKondisyonu) {
        throw new Error('Kondisyon güncelleme için yeni kondisyon zorunludur.');
      }

      const malzemeDurum = await service.checkMalzemeZimmetDurumu(data.malzemeId);
      if (malzemeDurum.currentKondisyon === data.malzemeKondisyonu) {
        console.warn('Kondisyon güncelleme: Yeni kondisyon mevcut kondisyon ile aynı.');
      }

      const yeniId = helper.generateId(HizmetName);
      const createPayload = {
        id: yeniId,
        islemTarihi: new Date(data.islemTarihi || new Date()),
        hareketTuru: 'KondisyonGuncelleme',
        malzemeKondisyonu: data.malzemeKondisyonu,
        malzemeId: data.malzemeId,
        aciklama: data.aciklama,
        status: AuditStatusEnum.Aktif,
        createdById: data.islemYapanKullanici,
      };

      // Mevcut durumu koru
      if (malzemeDurum.currentPersonel) {
        createPayload.kaynakPersonelId = malzemeDurum.currentPersonel.id;
        createPayload.hedefPersonelId = malzemeDurum.currentPersonel.id;
      }
      if (malzemeDurum.currentKonum) {
        createPayload.konumId = malzemeDurum.currentKonum.id;
      }

      return await prisma[PrismaName].create({
        data: createPayload,
        include: includeEntity,
      });
    } catch (error) {
      throw error;
    }
  },

  // KAYIP SERVISI
  kayip: async data => {
    try {
      await service.checkMalzemeExists(data.malzemeId);
      if (!data.aciklama) throw new Error('Kayıp bildirimi için açıklama zorunludur.');

      const malzemeDurum = await service.checkMalzemeZimmetDurumu(data.malzemeId);
      if (malzemeDurum.malzemeYok) {
        throw new Error('Zaten kayıp veya düşüm yapılmış malzemeler için tekrar kayıp bildirimi yapılamaz.');
      }

      const yeniId = helper.generateId(HizmetName);
      const createPayload = {
        id: yeniId,
        islemTarihi: new Date(data.islemTarihi || new Date()),
        hareketTuru: 'Kayip',
        malzemeKondisyonu: data.malzemeKondisyonu || 'Kayip',
        malzemeId: data.malzemeId,
        kaynakPersonelId: null,
        hedefPersonelId: null,
        konumId: null,
        aciklama: data.aciklama,
        status: AuditStatusEnum.Aktif,
        createdById: data.islemYapanKullanici,
      };

      return await prisma[PrismaName].create({
        data: createPayload,
        include: includeEntity,
      });
    } catch (error) {
      throw error;
    }
  },

  // DÜŞÜM SERVISI
  dusum: async data => {
    try {
      await service.checkMalzemeExists(data.malzemeId);
      if (!data.aciklama) throw new Error('Düşüm işlemi için açıklama zorunludur.');

      const malzemeDurum = await service.checkMalzemeZimmetDurumu(data.malzemeId);

      if (malzemeDurum.malzemePersonelde) {
        throw new Error('Zimmetli malzemeler düşüm yapılamaz. Önce iade alınmalı.');
      }
      if (!['Arizali', 'Hurda'].includes(malzemeDurum.currentKondisyon)) {
        throw new Error('Sadece arızalı veya hurda durumundaki malzemeler düşüm yapılabilir.');
      }
      if (malzemeDurum.malzemeYok) {
        throw new Error('Zaten kayıp veya düşüm yapılmış malzemeler için tekrar düşüm yapılamaz.');
      }

      const yeniId = helper.generateId(HizmetName);
      const createPayload = {
        id: yeniId,
        islemTarihi: new Date(data.islemTarihi || new Date()),
        hareketTuru: 'Dusum',
        malzemeKondisyonu: data.malzemeKondisyonu || 'Hurda',
        malzemeId: data.malzemeId,
        kaynakPersonelId: null,
        hedefPersonelId: null,
        konumId: null,
        aciklama: data.aciklama,
        status: AuditStatusEnum.Aktif,
        createdById: data.islemYapanKullanici,
      };

      const result = await prisma[PrismaName].create({
        data: createPayload,
        include: includeEntity,
      });

      // Düşüm sonrası malzemeyi pasif yap
      await prisma.malzeme.update({
        where: { id: data.malzemeId },
        data: { status: AuditStatusEnum.Pasif },
      });

      return result;
    } catch (error) {
      throw error;
    }
  },

  // KAYIT SERVISI
  kayit: async data => {
    try {
      await service.checkMalzemeExists(data.malzemeId);
      if (!data.konumId) throw new Error('Kayıt işlemi için başlangıç konumu zorunludur.');
      await service.checkKonumExists(data.konumId);

      // Malzemenin daha önce hareketi olup olmadığını kontrol et
      const existingHareket = await service.getLastHareketByMalzemeId(data.malzemeId);
      const sonHareketi=existingHareket?.hareketTuru
      if (existingHareket&&sonHareketi&& sonHareketi!=="Kayip") {
        throw new Error('Bu malzemenin zaten hareket geçmişi var. Kayıp olmayan malzemeler haricinde "Kayıt" işlemi yapılamaz.');
      }

      const yeniId = helper.generateId(HizmetName);
      const createPayload = {
        id: yeniId,
        islemTarihi: new Date(data.islemTarihi || new Date()),
        hareketTuru: 'Kayit',
        malzemeKondisyonu: data.malzemeKondisyonu || 'Saglam',
        malzemeId: data.malzemeId,
        konumId: data.konumId,
        kaynakPersonelId: null,
        hedefPersonelId: null,
        aciklama: data.aciklama,
        status: AuditStatusEnum.Aktif,
        createdById: data.islemYapanKullanici,
      };

      return await prisma[PrismaName].create({
        data: createPayload,
        include: includeEntity,
      });
    } catch (error) {
      throw error;
    }
  },
};

export default service;
