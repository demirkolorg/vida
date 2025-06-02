// server/app/malzemeHareket/service.js - Bulk işlemleri eklenmiş versiyon
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
    if (!hareketler || hareketler.length === 0) {
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
    const anlamliSonHareket = service.getAnlamliSonHareket(hareketler);
    const hareketTuru = anlamliSonHareket?.hareketTuru;

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

  // BULK İŞLEMLERİ - YENİ METODLAR

  // Toplu malzeme kontrolü
  checkMultipleMalzemeExists: async malzemeIds => {
    const existingMalzemeler = await prisma.malzeme.findMany({
      where: {
        id: { in: malzemeIds },
        status: AuditStatusEnum.Aktif,
      },
      select: { id: true, vidaNo: true },
    });

    const existingIds = existingMalzemeler.map(m => m.id);
    const notFoundIds = malzemeIds.filter(id => !existingIds.includes(id));

    if (notFoundIds.length > 0) {
      throw new Error(`Şu malzeme ID'lerine sahip malzemeler bulunamadı veya aktif değil: ${notFoundIds.join(', ')}`);
    }

    return existingMalzemeler;
  },

  // Toplu personel kontrolü
  checkMultiplePersonelExists: async personelIds => {
    const existingPersoneller = await prisma.personel.findMany({
      where: {
        id: { in: personelIds },
        status: AuditStatusEnum.Aktif,
      },
      select: { id: true, ad: true, sicil: true },
    });

    const existingIds = existingPersoneller.map(p => p.id);
    const notFoundIds = personelIds.filter(id => !existingIds.includes(id));

    if (notFoundIds.length > 0) {
      throw new Error(`Şu personeller bulunamadı: ${notFoundIds.join(', ')}`);
    }

    return existingPersoneller;
  },

  // Toplu konum kontrolü
  checkMultipleKonumExists: async konumIds => {
    const existingKonumlar = await prisma.konum.findMany({
      where: {
        id: { in: konumIds },
        status: AuditStatusEnum.Aktif,
      },
      select: { id: true, ad: true },
    });

    const existingIds = existingKonumlar.map(k => k.id);
    const notFoundIds = konumIds.filter(id => !existingIds.includes(id));

    if (notFoundIds.length > 0) {
      throw new Error(`Şu konumlar bulunamadı: ${notFoundIds.join(', ')}`);
    }

    return existingKonumlar;
  },

  // Bulk zimmet işlemi - Düzeltilmiş versiyon
  bulkZimmet: async data => {
    try {
      const malzemeIdList = data.malzemeler.map(malzeme => {
        if (!malzeme || typeof malzeme.id !== 'string' || malzeme.id.trim() === '') {
          throw new Error('Malzemeler listesindeki her bir öğe geçerli bir "id" propertysine sahip olmalıdır.');
        }
        return malzeme.id;
      });

      if (malzemeIdList.length === 0) {
        throw new Error("Geçerli malzeme ID'si bulunamadı.");
      }

      // Validasyonlar
      await service.checkMultipleMalzemeExists(malzemeIdList);
      await service.checkPersonelExists(data.hedefPersonelId);

      const results = [];
      const errors = [];

      // Her malzeme için zimmet kontrolü ve işlemi
      for (const malzemeId of malzemeIdList) {
        try {
          const malzemeDurum = await service.checkMalzemeZimmetDurumu(malzemeId);

          if (malzemeDurum.malzemePersonelde) {
            errors.push({ malzemeId, error: 'Malzeme zaten zimmetli durumda' });
            continue;
          }

          if (malzemeDurum.currentKondisyon !== MalzemeKondisyonuEnum.Saglam) {
            errors.push({
              malzemeId,
              error: `Malzeme sağlam durumda değil (Mevcut Kondisyon: ${malzemeDurum.currentKondisyon}). Sadece sağlam malzemeler zimmetlenebilir.`,
            });
            continue;
          }

          if (!malzemeDurum.malzemeDepoda && !malzemeDurum.malzemeKonumsuz) {
            errors.push({ malzemeId, error: 'Malzeme depoda (veya zimmetlenebilir bir konumda) değil.' });
            continue;
          }

          if (malzemeDurum.malzemeYok) {
            errors.push({ malzemeId, error: 'Malzeme kayıp veya düşüm yapılmış.' });
            continue;
          }

          const yeniId = helper.generateId(HizmetName);
          const createPayload = {
            id: yeniId,
            islemTarihi: new Date(data.islemTarihi || new Date()),
            hareketTuru: HareketTuruEnum.Zimmet,
            malzemeKondisyonu: data.malzemeKondisyonu || MalzemeKondisyonuEnum.Saglam,
            malzemeId: malzemeId,
            hedefPersonelId: data.hedefPersonelId,
            kaynakPersonelId: null,
            konumId: null,
            aciklama: data.aciklama || `Toplu zimmet - ${malzemeId}`,
            status: AuditStatusEnum.Aktif,
            createdById: data.islemYapanKullanici,
          };

          const result = await prisma[PrismaName].create({
            data: createPayload,
            include: includeEntity,
          });

          results.push(result);
        } catch (innerError) {
          const errorMessage = innerError instanceof Error ? innerError.message : String(innerError);
          errors.push({ malzemeId, error: errorMessage });
        }
      }

      const finalResult = {
        success: results,
        errors: errors,
        successCount: results.length,
        errorCount: errors.length,
        totalCount: malzemeIdList.length,
      };

      return finalResult;
    } catch (error) {
      throw error;
    }
  },

  // Bulk iade işlemi - Güncellendi
  bulkIade: async data => {
    try {
      // Girdi olarak data.malzemeler (obje array'i) bekleniyor
      if (!data.malzemeler || !Array.isArray(data.malzemeler) || data.malzemeler.length === 0) {
        throw new Error('İade için malzeme listesi (data.malzemeler) zorunludur ve en az bir malzeme içermelidir.');
      }
      if (!data.konumId) {
        throw new Error('İade için hedef konum zorunludur.');
      }

      // Malzeme ID'lerini data.malzemeler array'inden çıkar
      const malzemeIdList = data.malzemeler.map(malzeme => {
        if (!malzeme || typeof malzeme.id !== 'string' || malzeme.id.trim() === '') {
          throw new Error('Malzemeler listesindeki her bir öğe geçerli bir "id" propertysine sahip olmalıdır.');
        }
        return malzeme.id;
      });

      if (malzemeIdList.length === 0) {
        throw new Error("Geçerli malzeme ID'si bulunamadı.");
      }

      // Validasyonlar
      await service.checkMultipleMalzemeExists(malzemeIdList);
      await service.checkKonumExists(data.konumId);

      const results = [];
      const errors = [];

      // Her malzeme için iade kontrolü ve işlemi
      for (const malzemeId of malzemeIdList) {
        try {
          const malzemeDurum = await service.checkMalzemeZimmetDurumu(malzemeId);

          if (!malzemeDurum.malzemePersonelde) {
            errors.push({ malzemeId, error: 'Malzeme zimmetli değil' });
            continue;
          }

          // Kaynak personeli son hareketten al
          const kaynakPersonelId = malzemeDurum.currentPersonel?.id;
          if (!kaynakPersonelId) {
            errors.push({ malzemeId, error: 'Zimmetli personel bulunamadı' });
            continue;
          }

          const yeniId = helper.generateId(HizmetName);
          const createPayload = {
            id: yeniId,
            islemTarihi: new Date(data.islemTarihi || new Date()),
            hareketTuru: HareketTuruEnum.Iade,
            malzemeKondisyonu: data.malzemeKondisyonu || MalzemeKondisyonuEnum.Saglam,
            malzemeId: malzemeId,
            kaynakPersonelId: kaynakPersonelId,
            konumId: data.konumId,
            hedefPersonelId: null,
            aciklama: data.aciklama || `Toplu iade - ${malzemeId}`,
            status: AuditStatusEnum.Aktif,
            createdById: data.islemYapanKullanici,
          };

          const result = await prisma[PrismaName].create({
            data: createPayload,
            include: includeEntity,
          });

          results.push(result);
        } catch (innerError) {
          console.error(`Service - Error processing malzeme ${malzemeId}:`, innerError);
          const errorMessage = innerError instanceof Error ? innerError.message : String(innerError);
          errors.push({ malzemeId, error: errorMessage });
        }
      }

      const finalResult = {
        success: results,
        errors: errors,
        successCount: results.length,
        errorCount: errors.length,
        totalCount: malzemeIdList.length,
      };

      return finalResult;
    } catch (error) {
      throw error;
    }
  },

  // Bulk devir işlemi - Düzeltilmiş versiyon
  bulkDevir: async data => {
    try {
      // Malzeme ID'lerini data.malzemeler array'inden çıkar
      const malzemeIdList = data.malzemeler.map(malzeme => {
        if (!malzeme || typeof malzeme.id !== 'string' || malzeme.id.trim() === '') {
          throw new Error('Malzemeler listesindeki her bir öğe geçerli bir "id" propertysine sahip olmalıdır.');
        }
        return malzeme.id;
      });

      // Eğer malzemeIdList boşsa
      if (malzemeIdList.length === 0) throw new Error("Geçerli malzeme ID'si bulunamadı.");

      // Malzeme ID'lerini data.malzemeler array'inden çıkar
      const kaynakPersonelIdList = data.malzemeler.map(personel => {
        if (!personel || typeof personel.kaynakPersonelId !== 'string' || personel.kaynakPersonelId.trim() === '') {
          throw new Error('Malzemeler listesindeki her bir öğe geçerli bir "kaynakPersonelId" propertysine sahip olmalıdır.');
        }
        return personel.kaynakPersonelId;
      });

      // Eğer malzemeIdList boşsa
      if (kaynakPersonelIdList.length === 0) throw new Error("Geçerli personel ID'si bulunamadı.");

      // Validasyonlar
      await service.checkMultipleMalzemeExists(malzemeIdList);
      await service.checkPersonelExists(data.hedefPersonelId);
      await service.checkMultiplePersonelExists(kaynakPersonelIdList);

      const results = [];
      const errors = [];

      for (const malzemeId of malzemeIdList) {
        try {
          const malzemeDurum = await service.checkMalzemeZimmetDurumu(malzemeId);

         
          if (malzemeDurum.currentKondisyon !== MalzemeKondisyonuEnum.Saglam) {
            errors.push({
              malzemeId,
              error: `Malzeme sağlam durumda değil (Mevcut Kondisyon: ${malzemeDurum.currentKondisyon}). Sadece sağlam malzemeler zimmetlenebilir.`,
            });
            continue;
          }

          if (!malzemeDurum.malzemePersonelde ) {
            errors.push({ malzemeId, error: 'Malzeme personelde  (veya zimmetlenebilir bir konumda) değil.' });
            continue;
          }

          if (malzemeDurum.malzemeYok) {
            errors.push({ malzemeId, error: 'Malzeme kayıp veya düşüm yapılmış.' });
            continue;
          }

           // İlgili malzemeyi data içinden bul
          const ilgiliMalzeme = data.malzemeler.find(m => m.id === malzemeId);
          const kaynakPersonelId = ilgiliMalzeme?.kaynakPersonelId;


          const yeniId = helper.generateId(HizmetName);
          const createPayload = {
            id: yeniId,
            islemTarihi: new Date(data.islemTarihi || new Date()),
            hareketTuru: HareketTuruEnum.Devir,
            malzemeKondisyonu: data.malzemeKondisyonu || MalzemeKondisyonuEnum.Saglam,
            malzemeId: malzemeId,
            hedefPersonelId: data.hedefPersonelId,
            kaynakPersonelId: kaynakPersonelId,
            konumId: null,
            aciklama: data.aciklama || `Toplu devir - ${malzemeId}`,
            status: AuditStatusEnum.Aktif,
            createdById: data.islemYapanKullanici,
          };

          const result = await prisma[PrismaName].create({ data: createPayload, include: includeEntity });
          results.push(result);
        } catch (innerError) {
          console.error(`Service - Error processing malzeme ${malzemeId}:`, innerError);
          const errorMessage = innerError instanceof Error ? innerError.message : String(innerError);
          errors.push({ malzemeId, error: errorMessage });
        }
      }

      const finalResult = {
        success: results,
        errors: errors,
        successCount: results.length,
        errorCount: errors.length,
        totalCount: malzemeIdList.length,
      };

      return finalResult;
    } catch (error) {
      throw error;
    }
  },

  // Bulk depo transferi - Güncellendi
  bulkDepoTransfer: async data => {
    try {
      console.log('Service - bulkDepoTransfer called with data:', data);

      // Girdi olarak data.malzemeler (obje array'i) bekleniyor
      if (!data.malzemeler || !Array.isArray(data.malzemeler) || data.malzemeler.length === 0) {
        throw new Error('Depo transferi için malzeme listesi (data.malzemeler) zorunludur ve en az bir malzeme içermelidir.');
      }
      if (!data.konumId) {
        throw new Error('Depo transferi için hedef konum zorunludur.');
      }

      // Malzeme ID'lerini data.malzemeler array'inden çıkar
      const malzemeIdList = data.malzemeler.map(malzeme => {
        if (!malzeme || typeof malzeme.id !== 'string' || malzeme.id.trim() === '') {
          throw new Error('Malzemeler listesindeki her bir öğe geçerli bir "id" propertysine sahip olmalıdır.');
        }
        return malzeme.id;
      });

      console.log('Service - Extracted malzeme IDs:', malzemeIdList);

      if (malzemeIdList.length === 0) {
        throw new Error("Geçerli malzeme ID'si bulunamadı.");
      }

      // Validasyonlar
      console.log('Service - Starting validations...');
      await service.checkMultipleMalzemeExists(malzemeIdList);
      await service.checkKonumExists(data.konumId);

      const results = [];
      const errors = [];

      console.log('Service - Processing malzemeler...');

      // Her malzeme için transfer kontrolü ve işlemi
      for (const malzemeId of malzemeIdList) {
        try {
          console.log(`Service - Processing malzeme ${malzemeId}`);

          const malzemeDurum = await service.checkMalzemeZimmetDurumu(malzemeId);

          if (malzemeDurum.malzemePersonelde) {
            errors.push({ malzemeId, error: 'Zimmetli malzemeler transfer edilemez' });
            continue;
          }
          if (!malzemeDurum.malzemeDepoda && !malzemeDurum.malzemeKonumsuz) {
            errors.push({ malzemeId, error: 'Malzeme transfer edilebilir durumda değil' });
            continue;
          }
          if (malzemeDurum.currentKonum?.id === data.konumId) {
            errors.push({ malzemeId, error: 'Malzeme zaten bu konumda' });
            continue;
          }
          if (malzemeDurum.malzemeYok) {
            errors.push({ malzemeId, error: 'Kayıp veya düşüm yapılmış malzemeler transfer edilemez' });
            continue;
          }

          const yeniId = helper.generateId(HizmetName);
          const createPayload = {
            id: yeniId,
            islemTarihi: new Date(data.islemTarihi || new Date()),
            hareketTuru: HareketTuruEnum.DepoTransferi,
            malzemeKondisyonu: data.malzemeKondisyonu || MalzemeKondisyonuEnum.Saglam,
            malzemeId: malzemeId,
            konumId: data.konumId,
            kaynakPersonelId: null,
            hedefPersonelId: null,
            aciklama: data.aciklama || `Toplu depo transferi - ${malzemeId}`,
            status: AuditStatusEnum.Aktif,
            createdById: data.islemYapanKullanici,
          };

          console.log(`Service - Creating depo transfer record for ${malzemeId}:`, createPayload);

          const result = await prisma[PrismaName].create({
            data: createPayload,
            include: includeEntity,
          });

          console.log(`Service - Successfully created depo transfer for ${malzemeId}`);
          results.push(result);
        } catch (innerError) {
          console.error(`Service - Error processing malzeme ${malzemeId}:`, innerError);
          const errorMessage = innerError instanceof Error ? innerError.message : String(innerError);
          errors.push({ malzemeId, error: errorMessage });
        }
      }

      const finalResult = {
        success: results,
        errors: errors,
        successCount: results.length,
        errorCount: errors.length,
        totalCount: malzemeIdList.length,
      };

      console.log('Service - Final bulk depo transfer result:', finalResult);

      return finalResult;
    } catch (error) {
      console.error('Service - Bulk depo transfer general error:', error);
      throw error;
    }
  },

  // Bulk kondisyon güncelleme - Güncellendi
  bulkKondisyonGuncelleme: async data => {
    try {
      console.log('Service - bulkKondisyonGuncelleme called with data:', data);

      // Girdi olarak data.malzemeler (obje array'i) bekleniyor
      if (!data.malzemeler || !Array.isArray(data.malzemeler) || data.malzemeler.length === 0) {
        throw new Error('Kondisyon güncelleme için malzeme listesi (data.malzemeler) zorunludur ve en az bir malzeme içermelidir.');
      }
      if (!data.malzemeKondisyonu) {
        throw new Error('Yeni kondisyon zorunludur.');
      }

      // Malzeme ID'lerini data.malzemeler array'inden çıkar
      const malzemeIdList = data.malzemeler.map(malzeme => {
        if (!malzeme || typeof malzeme.id !== 'string' || malzeme.id.trim() === '') {
          throw new Error('Malzemeler listesindeki her bir öğe geçerli bir "id" propertysine sahip olmalıdır.');
        }
        return malzeme.id;
      });

      console.log('Service - Extracted malzeme IDs:', malzemeIdList);

      if (malzemeIdList.length === 0) {
        throw new Error("Geçerli malzeme ID'si bulunamadı.");
      }

      // Validasyonlar
      console.log('Service - Starting validations...');
      await service.checkMultipleMalzemeExists(malzemeIdList);

      const results = [];
      const errors = [];

      console.log('Service - Processing malzemeler...');

      // Her malzeme için kondisyon güncelleme
      for (const malzemeId of malzemeIdList) {
        try {
          console.log(`Service - Processing malzeme ${malzemeId}`);

          const malzemeDurum = await service.checkMalzemeZimmetDurumu(malzemeId);

          if (malzemeDurum.currentKondisyon === data.malzemeKondisyonu) {
            errors.push({ malzemeId, error: 'Kondisyon zaten aynı' });
            continue;
          }

          const yeniId = helper.generateId(HizmetName);
          const createPayload = {
            id: yeniId,
            islemTarihi: new Date(data.islemTarihi || new Date()),
            hareketTuru: HareketTuruEnum.KondisyonGuncelleme,
            malzemeKondisyonu: data.malzemeKondisyonu,
            malzemeId: malzemeId,
            aciklama: data.aciklama || `Toplu kondisyon güncelleme - ${malzemeId}`,
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

          console.log(`Service - Creating kondisyon guncelleme record for ${malzemeId}:`, createPayload);

          const result = await prisma[PrismaName].create({
            data: createPayload,
            include: includeEntity,
          });

          console.log(`Service - Successfully created kondisyon guncelleme for ${malzemeId}`);
          results.push(result);
        } catch (innerError) {
          console.error(`Service - Error processing malzeme ${malzemeId}:`, innerError);
          const errorMessage = innerError instanceof Error ? innerError.message : String(innerError);
          errors.push({ malzemeId, error: errorMessage });
        }
      }

      const finalResult = {
        success: results,
        errors: errors,
        successCount: results.length,
        errorCount: errors.length,
        totalCount: malzemeIdList.length,
      };

      console.log('Service - Final bulk kondisyon guncelleme result:', finalResult);

      return finalResult;
    } catch (error) {
      console.error('Service - Bulk kondisyon guncelleme general error:', error);
      throw error;
    }
  },

  // Bulk kayıp bildirimi - Güncellendi
  bulkKayip: async data => {
    try {
      console.log('Service - bulkKayip called with data:', data);

      // Girdi olarak data.malzemeler (obje array'i) bekleniyor
      if (!data.malzemeler || !Array.isArray(data.malzemeler) || data.malzemeler.length === 0) {
        throw new Error('Kayıp bildirimi için malzeme listesi (data.malzemeler) zorunludur ve en az bir malzeme içermelidir.');
      }
      if (!data.aciklama) {
        throw new Error('Kayıp bildirimi için açıklama zorunludur.');
      }

      // Malzeme ID'lerini data.malzemeler array'inden çıkar
      const malzemeIdList = data.malzemeler.map(malzeme => {
        if (!malzeme || typeof malzeme.id !== 'string' || malzeme.id.trim() === '') {
          throw new Error('Malzemeler listesindeki her bir öğe geçerli bir "id" propertysine sahip olmalıdır.');
        }
        return malzeme.id;
      });

      console.log('Service - Extracted malzeme IDs:', malzemeIdList);

      if (malzemeIdList.length === 0) {
        throw new Error("Geçerli malzeme ID'si bulunamadı.");
      }

      // Validasyonlar
      console.log('Service - Starting validations...');
      await service.checkMultipleMalzemeExists(malzemeIdList);

      const results = [];
      const errors = [];

      console.log('Service - Processing malzemeler...');

      // Her malzeme için kayıp bildirimi
      for (const malzemeId of malzemeIdList) {
        try {
          console.log(`Service - Processing malzeme ${malzemeId}`);

          const malzemeDurum = await service.checkMalzemeZimmetDurumu(malzemeId);

          if (malzemeDurum.malzemeYok) {
            errors.push({ malzemeId, error: 'Zaten kayıp veya düşüm yapılmış' });
            continue;
          }

          const yeniId = helper.generateId(HizmetName);
          const createPayload = {
            id: yeniId,
            islemTarihi: new Date(data.islemTarihi || new Date()),
            hareketTuru: HareketTuruEnum.Kayip,
            malzemeKondisyonu: data.malzemeKondisyonu || MalzemeKondisyonuEnum.Kayip,
            malzemeId: malzemeId,
            kaynakPersonelId: null,
            hedefPersonelId: null,
            konumId: null,
            aciklama: data.aciklama,
            status: AuditStatusEnum.Aktif,
            createdById: data.islemYapanKullanici,
          };

          console.log(`Service - Creating kayip record for ${malzemeId}:`, createPayload);

          const result = await prisma[PrismaName].create({
            data: createPayload,
            include: includeEntity,
          });

          console.log(`Service - Successfully created kayip for ${malzemeId}`);
          results.push(result);
        } catch (innerError) {
          console.error(`Service - Error processing malzeme ${malzemeId}:`, innerError);
          const errorMessage = innerError instanceof Error ? innerError.message : String(innerError);
          errors.push({ malzemeId, error: errorMessage });
        }
      }

      const finalResult = {
        success: results,
        errors: errors,
        successCount: results.length,
        errorCount: errors.length,
        totalCount: malzemeIdList.length,
      };

      console.log('Service - Final bulk kayip result:', finalResult);

      return finalResult;
    } catch (error) {
      console.error('Service - Bulk kayip general error:', error);
      throw error;
    }
  },

  // Bulk düşüm işlemi - Güncellendi
  bulkDusum: async data => {
    try {
      console.log('Service - bulkDusum called with data:', data);

      // Girdi olarak data.malzemeler (obje array'i) bekleniyor
      if (!data.malzemeler || !Array.isArray(data.malzemeler) || data.malzemeler.length === 0) {
        throw new Error('Düşüm için malzeme listesi (data.malzemeler) zorunludur ve en az bir malzeme içermelidir.');
      }
      if (!data.aciklama) {
        throw new Error('Düşüm için açıklama zorunludur.');
      }

      // Malzeme ID'lerini data.malzemeler array'inden çıkar
      const malzemeIdList = data.malzemeler.map(malzeme => {
        if (!malzeme || typeof malzeme.id !== 'string' || malzeme.id.trim() === '') {
          throw new Error('Malzemeler listesindeki her bir öğe geçerli bir "id" propertysine sahip olmalıdır.');
        }
        return malzeme.id;
      });

      console.log('Service - Extracted malzeme IDs:', malzemeIdList);

      if (malzemeIdList.length === 0) {
        throw new Error("Geçerli malzeme ID'si bulunamadı.");
      }

      // Validasyonlar
      console.log('Service - Starting validations...');
      await service.checkMultipleMalzemeExists(malzemeIdList);

      const results = [];
      const errors = [];
      const updatedMalzemeler = [];

      console.log('Service - Processing malzemeler...');

      // Her malzeme için düşüm işlemi
      for (const malzemeId of malzemeIdList) {
        try {
          console.log(`Service - Processing malzeme ${malzemeId}`);

          const malzemeDurum = await service.checkMalzemeZimmetDurumu(malzemeId);

          if (malzemeDurum.malzemePersonelde) {
            errors.push({ malzemeId, error: 'Zimmetli malzemeler düşüm yapılamaz' });
            continue;
          }
          if (!['Arizali', 'Hurda'].includes(malzemeDurum.currentKondisyon)) {
            errors.push({ malzemeId, error: 'Sadece arızalı veya hurda malzemeler düşüm yapılabilir' });
            continue;
          }
          if (malzemeDurum.malzemeYok) {
            errors.push({ malzemeId, error: 'Zaten kayıp veya düşüm yapılmış' });
            continue;
          }

          const yeniId = helper.generateId(HizmetName);
          const createPayload = {
            id: yeniId,
            islemTarihi: new Date(data.islemTarihi || new Date()),
            hareketTuru: HareketTuruEnum.Dusum,
            malzemeKondisyonu: data.malzemeKondisyonu || MalzemeKondisyonuEnum.Hurda,
            malzemeId: malzemeId,
            kaynakPersonelId: null,
            hedefPersonelId: null,
            konumId: null,
            aciklama: data.aciklama,
            status: AuditStatusEnum.Aktif,
            createdById: data.islemYapanKullanici,
          };

          console.log(`Service - Creating dusum record for ${malzemeId}:`, createPayload);

          const result = await prisma[PrismaName].create({
            data: createPayload,
            include: includeEntity,
          });

          console.log(`Service - Successfully created dusum for ${malzemeId}`);
          results.push(result);
          updatedMalzemeler.push(malzemeId);
        } catch (innerError) {
          console.error(`Service - Error processing malzeme ${malzemeId}:`, innerError);
          const errorMessage = innerError instanceof Error ? innerError.message : String(innerError);
          errors.push({ malzemeId, error: errorMessage });
        }
      }

      // Başarılı düşüm yapılan malzemeleri pasif yap
      if (updatedMalzemeler.length > 0) {
        console.log('Service - Setting malzemeler to pasif:', updatedMalzemeler);
        await prisma.malzeme.updateMany({
          where: { id: { in: updatedMalzemeler } },
          data: { status: AuditStatusEnum.Pasif },
        });
      }

      const finalResult = {
        success: results,
        errors: errors,
        successCount: results.length,
        errorCount: errors.length,
        totalCount: malzemeIdList.length,
        updatedMalzemeCount: updatedMalzemeler.length,
      };

      console.log('Service - Final bulk dusum result:', finalResult);

      return finalResult;
    } catch (error) {
      console.error('Service - Bulk dusum general error:', error);
      throw error;
    }
  },

  // Bulk kayıt işlemi - Yeni eklendi
  bulkKayit: async data => {
    try {
      console.log('Service - bulkKayit called with data:', data);

      // Girdi olarak data.malzemeler (obje array'i) bekleniyor
      if (!data.malzemeler || !Array.isArray(data.malzemeler) || data.malzemeler.length === 0) {
        throw new Error('Kayıt için malzeme listesi (data.malzemeler) zorunludur ve en az bir malzeme içermelidir.');
      }
      if (!data.konumId) {
        throw new Error('Kayıt için konum zorunludur.');
      }

      // Malzeme ID'lerini data.malzemeler array'inden çıkar
      const malzemeIdList = data.malzemeler.map(malzeme => {
        if (!malzeme || typeof malzeme.id !== 'string' || malzeme.id.trim() === '') {
          throw new Error('Malzemeler listesindeki her bir öğe geçerli bir "id" propertysine sahip olmalıdır.');
        }
        return malzeme.id;
      });

      console.log('Service - Extracted malzeme IDs:', malzemeIdList);

      if (malzemeIdList.length === 0) {
        throw new Error("Geçerli malzeme ID'si bulunamadı.");
      }

      // Validasyonlar
      console.log('Service - Starting validations...');
      await service.checkMultipleMalzemeExists(malzemeIdList);
      await service.checkKonumExists(data.konumId);

      const results = [];
      const errors = [];

      console.log('Service - Processing malzemeler...');

      // Her malzeme için kayıt işlemi
      for (const malzemeId of malzemeIdList) {
        try {
          console.log(`Service - Processing malzeme ${malzemeId}`);

          const malzemeDurum = await service.checkMalzemeZimmetDurumu(malzemeId);

          // Zaten kayıtlı malzemeler için kontrol
          if (!malzemeDurum.malzemeKonumsuz) {
            errors.push({ malzemeId, error: 'Malzeme zaten kayıtlı durumda' });
            continue;
          }

          if (malzemeDurum.malzemeYok) {
            errors.push({ malzemeId, error: 'Kayıp veya düşüm yapılmış malzemeler kayıt edilemez' });
            continue;
          }

          const yeniId = helper.generateId(HizmetName);
          const createPayload = {
            id: yeniId,
            islemTarihi: new Date(data.islemTarihi || new Date()),
            hareketTuru: HareketTuruEnum.Kayit,
            malzemeKondisyonu: data.malzemeKondisyonu || MalzemeKondisyonuEnum.Saglam,
            malzemeId: malzemeId,
            konumId: data.konumId,
            kaynakPersonelId: null,
            hedefPersonelId: null,
            aciklama: data.aciklama || `Toplu kayıt - ${malzemeId}`,
            status: AuditStatusEnum.Aktif,
            createdById: data.islemYapanKullanici,
          };

          console.log(`Service - Creating kayit record for ${malzemeId}:`, createPayload);

          const result = await prisma[PrismaName].create({
            data: createPayload,
            include: includeEntity,
          });

          console.log(`Service - Successfully created kayit for ${malzemeId}`);
          results.push(result);
        } catch (innerError) {
          console.error(`Service - Error processing malzeme ${malzemeId}:`, innerError);
          const errorMessage = innerError instanceof Error ? innerError.message : String(innerError);
          errors.push({ malzemeId, error: errorMessage });
        }
      }

      const finalResult = {
        success: results,
        errors: errors,
        successCount: results.length,
        errorCount: errors.length,
        totalCount: malzemeIdList.length,
      };

      console.log('Service - Final bulk kayit result:', finalResult);

      return finalResult;
    } catch (error) {
      console.error('Service - Bulk kayit general error:', error);
      throw error;
    }
  },

  // BULK STATUS İŞLEMLERİ

  // Toplu status güncelleme
  bulkUpdateStatus: async data => {
    try {
      if (!data.idList || !Array.isArray(data.idList) || data.idList.length === 0) {
        throw new Error('ID listesi zorunludur.');
      }
      if (!data.newStatus) {
        throw new Error('Yeni status zorunludur.');
      }

      const results = [];
      const errors = [];

      for (const id of data.idList) {
        try {
          await service.checkExistsById(id);

          const result = await prisma[PrismaName].update({
            where: { id },
            data: {
              status: data.newStatus,
              updatedById: data.islemYapanKullanici,
            },
            include: includeEntity,
          });

          results.push(result);
        } catch (error) {
          errors.push({ id, error: error.message });
        }
      }

      return {
        success: results,
        errors: errors,
        successCount: results.length,
        errorCount: errors.length,
        totalCount: data.idList.length,
      };
    } catch (error) {
      throw error;
    }
  },

  // Toplu silme
  bulkDelete: async data => {
    try {
      if (!data.idList || !Array.isArray(data.idList) || data.idList.length === 0) {
        throw new Error('ID listesi zorunludur.');
      }

      const results = [];
      const errors = [];

      for (const id of data.idList) {
        try {
          await service.checkExistsById(id);

          const result = await prisma[PrismaName].update({
            where: { id },
            data: {
              status: AuditStatusEnum.Silindi,
              updatedById: data.islemYapanKullanici,
            },
          });

          results.push(result);
        } catch (error) {
          errors.push({ id, error: error.message });
        }
      }

      return {
        success: results,
        errors: errors,
        successCount: results.length,
        errorCount: errors.length,
        totalCount: data.idList.length,
      };
    } catch (error) {
      throw error;
    }
  },

  // BULK RAPORLAMA VE SORGULAMA

  // Toplu malzeme durumu sorgulama
  bulkCheckMalzemeDurumu: async data => {
    try {
      if (!data.malzemeIdList || !Array.isArray(data.malzemeIdList) || data.malzemeIdList.length === 0) {
        throw new Error('Malzeme ID listesi zorunludur.');
      }

      await service.checkMultipleMalzemeExists(data.malzemeIdList);

      const results = [];

      for (const malzemeId of data.malzemeIdList) {
        try {
          const durum = await service.checkMalzemeZimmetDurumu(malzemeId);
          results.push({
            malzemeId,
            durum,
          });
        } catch (error) {
          results.push({
            malzemeId,
            error: error.message,
          });
        }
      }

      return results;
    } catch (error) {
      throw error;
    }
  },

  // MEVCUT TEK İŞLEM METODLARI (değişiklik yok)

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

  // ÖZEL SORGU METODLARI

  // Malzeme geçmişi
  getMalzemeGecmisi: async data => {
    try {
      if (!data.malzemeId) throw new Error('Malzeme ID zorunludur.');
      await service.checkMalzemeExists(data.malzemeId);

      return await prisma[PrismaName].findMany({
        where: {
          malzemeId: data.malzemeId,
          status: AuditStatusEnum.Aktif,
        },
        orderBy: orderByEntity,
        include: includeEntity,
      });
    } catch (error) {
      throw error;
    }
  },

  // Personel zimmetleri
  getPersonelZimmetleri: async data => {
    try {
      if (!data.personelId) throw new Error('Personel ID zorunludur.');
      await service.checkPersonelExists(data.personelId);

      // Personelin zimmetli malzemelerini getir (son hareketlerini kontrol ederek)
      const allHareketler = await prisma[PrismaName].findMany({
        where: {
          hedefPersonelId: data.personelId,
          status: AuditStatusEnum.Aktif,
        },
        include: {
          malzeme: {
            include: {
              malzemeHareketleri: {
                orderBy: { createdAt: 'desc' },
                take: 1,
              },
            },
          },
          ...includeEntity,
        },
        orderBy: orderByEntity,
      });

      // Sadece hala zimmetli olan malzemeleri filtrele
      const zimmetliHareketler = allHareketler.filter(hareket => {
        const sonHareket = hareket.malzeme?.malzemeHareketleri?.[0];
        return sonHareket && ['Zimmet', 'Devir'].includes(sonHareket.hareketTuru) && sonHareket.hedefPersonelId === data.personelId;
      });

      return zimmetliHareketler;
    } catch (error) {
      throw error;
    }
  },

  // İŞ SÜREÇLERİ - TEK HAREKET METODLARI

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
      const sonHareketi = existingHareket?.hareketTuru;
      if (existingHareket && sonHareketi && sonHareketi !== 'Kayip') {
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
