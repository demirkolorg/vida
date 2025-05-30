// server/app/malzemeHareket/services/hareketServices.js
import { prisma } from '../../../config/db.js';
import helper from '../../../utils/helper.js';
import { HizmetName, PrismaName, HumanName } from '../base.js';
import { AuditStatusEnum, HareketTuruEnum, MalzemeKondisyonuEnum } from '@prisma/client';
import MalzemeService from '../../malzeme/service.js';
import PersonelService from '../../personel/service.js';
import KonumService from '../../konum/service.js';

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

const orderByEntity = { islemTarihi: 'desc' };

const checkExistsById = async id => {
  const result = await prisma[PrismaName].findUnique({ where: { id } });
  if (!result || result.status === AuditStatusEnum.Silindi) {
    throw new Error(`${id} ID'sine sahip aktif ${HumanName} bulunamadı.`);
  }
  return result;
};

const getLastHareketByMalzemeId = async malzemeId => {
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
};

const checkMalzemeZimmetDurumu = async malzemeId => {
  const lastHareket = await getLastHareketByMalzemeId(malzemeId);

  if (!lastHareket) {
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

  // Durum analizi
  const hareketTuru = lastHareket.hareketTuru;
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
};

// Kayıt Servisi
export const KayitService = {
  validate: async data => {
    await MalzemeService.checkExistsById(data.malzemeId);
    if (!data.konumId) throw new Error('Kayıt işlemi için başlangıç konumu zorunludur.');
    await KonumService.checkExistsById(data.konumId);

    // Malzemenin daha önce hareketi olup olmadığını kontrol et
    const existingHareket = await getLastHareketByMalzemeId(data.malzemeId);
    if (existingHareket) {
      throw new Error('Bu malzemenin zaten hareket geçmişi var. "Kayıt" işlemi yapılamaz.');
    }
  },

  create: async data => {
    await KayitService.validate(data);

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
  },
};

// Zimmet Servisi
export const ZimmetService = {
  validate: async data => {
    await MalzemeService.checkExistsById(data.malzemeId);
    if (!data.hedefPersonelId) throw new Error('Zimmet işlemi için hedef personel zorunludur.');
    await PersonelService.checkExistsById(data.hedefPersonelId);

    const malzemeDurum = await checkMalzemeZimmetDurumu(data.malzemeId);

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

    return malzemeDurum;
  },

  create: async data => {
    await ZimmetService.validate(data);

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
  },
};

// İade Servisi
export const IadeService = {
  validate: async data => {
    await MalzemeService.checkExistsById(data.malzemeId);
    if (!data.kaynakPersonelId) throw new Error('İade işlemi için kaynak personel zorunludur.');
    await PersonelService.checkExistsById(data.kaynakPersonelId);
    if (!data.konumId) throw new Error('İade işlemi için hedef konum zorunludur.');
    await KonumService.checkExistsById(data.konumId);

    const malzemeDurum = await checkMalzemeZimmetDurumu(data.malzemeId);

    if (!malzemeDurum.malzemePersonelde) {
      throw new Error('Bu malzeme zimmetli değil. İade işlemi yapılamaz.');
    }
    if (malzemeDurum.currentPersonel && data.kaynakPersonelId !== malzemeDurum.currentPersonel.id) {
      throw new Error(`Bu malzeme "${malzemeDurum.currentPersonel.ad}" adlı personelde zimmetli. İade işlemi sadece o personel tarafından yapılabilir.`);
    }

    return malzemeDurum;
  },

  create: async data => {
    await IadeService.validate(data);

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
  },
};

// Devir Servisi
export const DevirService = {
  validate: async data => {
    await MalzemeService.checkExistsById(data.malzemeId);
    if (!data.kaynakPersonelId || !data.hedefPersonelId) {
      throw new Error('Devir işlemi için kaynak ve hedef personel zorunludur.');
    }
    if (data.kaynakPersonelId === data.hedefPersonelId) {
      throw new Error('Kaynak ve hedef personel aynı olamaz.');
    }
    await PersonelService.checkExistsById(data.kaynakPersonelId);
    await PersonelService.checkExistsById(data.hedefPersonelId);

    const malzemeDurum = await checkMalzemeZimmetDurumu(data.malzemeId);

    if (!malzemeDurum.malzemePersonelde) {
      throw new Error('Bu malzeme zimmetli değil. Devir işlemi yapılamaz.');
    }
    if (malzemeDurum.currentPersonel && data.kaynakPersonelId !== malzemeDurum.currentPersonel.id) {
      throw new Error(`Bu malzeme "${malzemeDurum.currentPersonel.ad}" adlı personelde zimmetli. Devir işlemi sadece o personel tarafından yapılabilir.`);
    }

    return malzemeDurum;
  },

  create: async data => {
    await DevirService.validate(data);

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
  },
};

// Depo Transfer Servisi
export const DepoTransferiService = {
  validate: async data => {
    await MalzemeService.checkExistsById(data.malzemeId);
    if (!data.konumId) throw new Error('Depo transferi için hedef konum zorunludur.');
    await KonumService.checkExistsById(data.konumId);

    const malzemeDurum = await checkMalzemeZimmetDurumu(data.malzemeId);

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

    return malzemeDurum;
  },

  create: async data => {
    await DepoTransferiService.validate(data);

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
  },
};

// Kondisyon Güncelleme Servisi
export const KondisyonGuncellemeService = {
  validate: async data => {
    await MalzemeService.checkExistsById(data.malzemeId);
    if (!data.malzemeKondisyonu) {
      throw new Error('Kondisyon güncelleme için yeni kondisyon zorunludur.');
    }

    const malzemeDurum = await checkMalzemeZimmetDurumu(data.malzemeId);
    if (malzemeDurum.currentKondisyon === data.malzemeKondisyonu) {
      console.warn('Kondisyon güncelleme: Yeni kondisyon mevcut kondisyon ile aynı.');
    }

    return malzemeDurum;
  },

  create: async data => {
    const malzemeDurum = await KondisyonGuncellemeService.validate(data);

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
  },
};

// Kayıp Servisi
export const KayipService = {
  validate: async data => {
    await MalzemeService.checkExistsById(data.malzemeId);
    if (!data.aciklama) throw new Error('Kayıp bildirimi için açıklama zorunludur.');

    const malzemeDurum = await checkMalzemeZimmetDurumu(data.malzemeId);
    if (malzemeDurum.malzemeYok) {
      throw new Error('Zaten kayıp veya düşüm yapılmış malzemeler için tekrar kayıp bildirimi yapılamaz.');
    }

    return malzemeDurum;
  },

  create: async data => {
    await KayipService.validate(data);

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
  },
};

// Düşüm Servisi
export const DusumService = {
  validate: async data => {
    await MalzemeService.checkExistsById(data.malzemeId);
    if (!data.aciklama) throw new Error('Düşüm işlemi için açıklama zorunludur.');

    const malzemeDurum = await checkMalzemeZimmetDurumu(data.malzemeId);

    if (malzemeDurum.malzemePersonelde) {
      throw new Error('Zimmetli malzemeler düşüm yapılamaz. Önce iade alınmalı.');
    }
    if (!['Arizali', 'Hurda'].includes(malzemeDurum.currentKondisyon)) {
      throw new Error('Sadece arızalı veya hurda durumundaki malzemeler düşüm yapılabilir.');
    }
    if (malzemeDurum.malzemeYok) {
      throw new Error('Zaten kayıp veya düşüm yapılmış malzemeler için tekrar düşüm yapılamaz.');
    }

    return malzemeDurum;
  },

  create: async data => {
    await DusumService.validate(data);

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
  },
};

// Servis fabrikası - hangi servisi kullanacağını belirler
export const getHareketService = hareketTuru => {
  const services = {
    Kayit: KayitService,
    Zimmet: ZimmetService,
    Iade: IadeService,
    Devir: DevirService,
    DepoTransferi: DepoTransferiService,
    KondisyonGuncelleme: KondisyonGuncellemeService,
    Kayip: KayipService,
    Dusum: DusumService,
  };

  return services[hareketTuru];
};

// Ortak yardımcı fonksiyonları export et
export { checkExistsById, getLastHareketByMalzemeId, checkMalzemeZimmetDurumu };
