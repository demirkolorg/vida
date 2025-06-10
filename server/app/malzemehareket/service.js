// server/app/malzemeHareket/service.js - Bulk işlemleri eklenmiş versiyon
import { prisma } from '../../config/db.js';
import helper from '../../utils/helper.js';
import { VarlıkKod, PrismaName, HumanName } from './base.js';
import { AuditStatusEnum, HareketTuruEnum, MalzemeKondisyonuEnum } from '@prisma/client';
import TutanakService from '../tutanak/service.js';

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
  kaynakPersonel: { select: { id: true, ad: true, soyad: true, sicil: true, avatar: true } },
  hedefPersonel: { select: { id: true, ad: true, soyad: true, sicil: true, avatar: true } },

  kaynakKonum: {
    select: {
      id: true,
      ad: true,
      depo: { select: { id: true, ad: true } },
    },
  },
  hedefKonum: {
    select: {
      id: true,
      ad: true,
      depo: { select: { id: true, ad: true } },
    },
  },
  createdBy: { select: { id: true, ad: true, soyad: true, sicil: true, avatar: true } },
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
      include: includeEntity,
    });
  },

  getHareketlerByMalzemeId: async malzemeId => {
    return await prisma[PrismaName].findMany({
      where: {
        malzemeId,
        status: AuditStatusEnum.Aktif,
      },
      orderBy: orderByEntity,
      include: includeEntity,
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

  getAnlamliSonHareketByMalzemeId: async malzemeId => {
    const hareketler = await prisma[PrismaName].findMany({
      where: {
        malzemeId,
        status: AuditStatusEnum.Aktif,
      },
      orderBy: orderByEntity,
      include: includeEntity,
    });

    if (!hareketler || hareketler.length === 0) return undefined;
    for (const hareket of hareketler) {
      if (hareket.hareketTuru !== 'KondisyonGuncelleme') {
        return hareket;
      }
    }
    return undefined;
  },
  getKonumluSonHareketByMalzemeId: async malzemeId => {
    const hareketler = await prisma[PrismaName].findMany({
      where: {
        malzemeId,
        status: AuditStatusEnum.Aktif,
      },
      orderBy: orderByEntity,
      include: includeEntity,
    });

    if (!hareketler || hareketler.length === 0) return undefined;
    for (const hareket of hareketler) {
      if (hareket.hedefKonumId || hareket.kaynakKonumId) return hareket;
    }
    return undefined;
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
      select: { id: true, ad: true, soyad: true, sicil: true },
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

  // İŞ SÜREÇLERİ
  //!
  //zimmet
  zimmet: async data => {
    try {
      if (!data.malzemeId) throw new Error('Zimmet işlemi için malzeme zorunludur.');
      await service.checkMalzemeExists(data.malzemeId);

      if (!data.hedefPersonelId) throw new Error('Zimmet işlemi için hedef personel zorunludur.');
      await service.checkPersonelExists(data.hedefPersonelId);

      const anlamliSonHareket = await service.getAnlamliSonHareketByMalzemeId(data.malzemeId);
      const kaynakKonumId = anlamliSonHareket?.hedefKonumId ? anlamliSonHareket?.hedefKonumId : anlamliSonHareket?.kaynakKonumId;

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

      // Transaction ile zimmet + tutanak işlemini atomik yap
      const result = await prisma.$transaction(async tx => {
        // 1. Zimmet hareketini oluştur
        const createPayload = {
          islemTarihi: new Date(data.islemTarihi || new Date()),
          hareketTuru: 'Zimmet',
          malzemeKondisyonu: data.malzemeKondisyonu || 'Saglam',
          malzemeId: data.malzemeId,
          hedefPersonelId: data.hedefPersonelId,
          kaynakPersonelId: null,
          hedefKonumId: null,
          kaynakKonumId: kaynakKonumId,
          aciklama: data.aciklama,
          status: AuditStatusEnum.Aktif,
          createdById: data.islemYapanKullanici,
        };

        const yeniHareket = await tx[PrismaName].create({
          data: createPayload,
          include: includeEntity,
        });

        // 2. Tutanak için gerekli verileri hazırla
        const malzemeBilgileri = await tx.malzeme.findUnique({
          where: { id: data.malzemeId },
          include: {
            sabitKodu: true,
            marka: true,
            model: true,
            birim: true,
            sube: true,
          },
        });
        const hedefPersonelBilgileri = await tx.personel.findUnique({
          where: { id: data.hedefPersonelId },
          include: {
            buro: {
              include: {
                sube: {
                  include: { birim: true },
                },
              },
            },
          },
        });
        const konumBilgileri = await tx.konum.findUnique({
          where: { id: anlamliSonHareket.hedefKonumId },
          include: {
            depo: true,
          },
        });

        // 3. Tutanak oluştur
        const tutanakData = {
          hareketTuru: 'Zimmet',
          malzemeIds: [data.malzemeId],
          malzemeler: [
            {
              id: malzemeBilgileri.id,
              vidaNo: malzemeBilgileri.vidaNo,
              sabitKodu: malzemeBilgileri.sabitKodu?.ad,
              marka: malzemeBilgileri.marka?.ad,
              model: malzemeBilgileri.model?.ad,
              bademSeriNo: malzemeBilgileri.bademSeriNo,
              etmysSeriNo: malzemeBilgileri.etmysSeriNo,
              stokDemirbasNo: malzemeBilgileri.stokDemirbasNo,
              malzemeTipi: malzemeBilgileri.malzemeTipi,
              kondisyon: data.malzemeKondisyonu || 'Saglam',
              birim: malzemeBilgileri.birim?.ad,
              sube: malzemeBilgileri.sube?.ad,
            },
          ],
          personelBilgileri: {
            hedefPersonel: {
              id: hedefPersonelBilgileri.id,
              ad: hedefPersonelBilgileri.ad,
              soyad: hedefPersonelBilgileri.soyad,

              avatar: hedefPersonelBilgileri.avatar,
              sicil: hedefPersonelBilgileri.sicil,
              buro: hedefPersonelBilgileri.buro?.ad,
              sube: hedefPersonelBilgileri.buro?.sube?.ad,
              birim: hedefPersonelBilgileri.buro?.sube?.birim?.ad,
            },
            kaynakPersonel: null, // Zimmet işleminde kaynak depo
          },
          islemBilgileri: {
            tarih: yeniHareket.islemTarihi,
            hareketTuru: 'Zimmet',
            aciklama: data.aciklama || 'Malzeme zimmet işlemi',
            hareketId: yeniHareket.id,
            kondisyon: data.malzemeKondisyonu || 'Saglam',
          },
          konumBilgileri: {
            kaynakKonum: {
              id: konumBilgileri.id,
              ad: konumBilgileri.ad,
              depo: konumBilgileri.depo?.ad,
            },
          }, // Zimmet işleminde konum bilgisi yok
          islemYapanKullanici: data.islemYapanKullanici,
        };

        const tutanak = await TutanakService.create(tutanakData);

        return {
          hareket: yeniHareket,
          tutanak: tutanak,
        };
      });

      return result.hareket; // Geriye uyumluluk için hareket döndür
    } catch (error) {
      throw error;
    }
  },
  // Bulk zimmet
  bulkZimmet: async data => {
    try {
      const malzemeIdList = data.malzemeler.map(malzeme => malzeme.id);

      if (malzemeIdList.length === 0) {
        throw new Error("Geçerli malzeme ID'si bulunamadı.");
      }

      // Transaction ile tüm işlemleri atomik yap
      const result = await prisma.$transaction(async tx => {
        const results = [];
        const errors = [];
        const malzemeKonumBilgileri = {};

        // Her malzeme için zimmet işlemi
        for (const malzemeId of malzemeIdList) {
          try {
            // Son hareket ve konum bilgisini al
            const anlamliSonHareket = await service.getAnlamliSonHareketByMalzemeId(malzemeId);
            const malzemeDurum = await service.checkMalzemeZimmetDurumu(malzemeId);

            // Validasyonlar...
            if (malzemeDurum.malzemePersonelde) {
              errors.push({ malzemeId, error: 'Malzeme zaten zimmetli durumda' });
              continue;
            }

            // Kaynak konum bilgisini al ve sakla
            if (anlamliSonHareket?.hedefKonumId) {
              const konumBilgileri = await tx.konum.findUnique({
                where: { id: anlamliSonHareket.hedefKonumId },
                include: { depo: true },
              });

              malzemeKonumBilgileri[malzemeId] = {
                id: konumBilgileri?.id,
                ad: konumBilgileri?.ad,
                depo: konumBilgileri?.depo?.ad,
              };
            }

            // Zimmet hareketini oluştur
            const yeniHareket = await tx[PrismaName].create({
              data: {
                islemTarihi: new Date(data.islemTarihi || new Date()),
                hareketTuru: HareketTuruEnum.Zimmet,
                malzemeKondisyonu: data.malzemeKondisyonu || MalzemeKondisyonuEnum.Saglam,
                malzemeId: malzemeId,
                hedefPersonelId: data.hedefPersonelId,
                kaynakPersonelId: null,
                kaynakKonumId: anlamliSonHareket?.hedefKonumId,
                hedefKonumId: null,
                aciklama: data.aciklama || `Toplu zimmet - ${malzemeId}`,
                status: AuditStatusEnum.Aktif,
                createdById: data.islemYapanKullanici,
              },
              include: includeEntity,
            });

            results.push(yeniHareket);
          } catch (innerError) {
            errors.push({
              malzemeId,
              error: innerError instanceof Error ? innerError.message : String(innerError),
            });
          }
        }

        // Başarılı işlemler varsa tutanak oluştur
        let tutanak = null;
        if (results.length > 0) {
          // Malzeme ve personel bilgilerini al
          const successfulMalzemeIds = results.map(h => h.malzemeId);

          const malzemeBilgileri = await tx.malzeme.findMany({
            where: { id: { in: successfulMalzemeIds } },
            include: {
              sabitKodu: true,
              marka: true,
              model: true,
              birim: true,
              sube: true,
            },
          });

          const hedefPersonelBilgileri = await tx.personel.findUnique({
            where: { id: data.hedefPersonelId },
            include: {
              buro: {
                include: {
                  sube: { include: { birim: true } },
                },
              },
            },
          });

          // Tutanak verisini hazırla
          const tutanakMalzemeleri = malzemeBilgileri.map(malzeme => ({
            id: malzeme.id,
            vidaNo: malzeme.vidaNo,
            sabitKodu: malzeme.sabitKodu?.ad,
            marka: malzeme.marka?.ad,
            model: malzeme.model?.ad,
            bademSeriNo: malzeme.bademSeriNo,
            etmysSeriNo: malzeme.etmysSeriNo,
            stokDemirbasNo: malzeme.stokDemirbasNo,
            malzemeTipi: malzeme.malzemeTipi,
            kondisyon: data.malzemeKondisyonu || 'Saglam',
            birim: malzeme.birim?.ad,
            sube: malzeme.sube?.ad,
            kaynakKonum: malzemeKonumBilgileri[malzeme.id] || null,
          }));

          const tutanakData = {
            hareketTuru: 'Zimmet',
            malzemeIds: successfulMalzemeIds,
            malzemeler: tutanakMalzemeleri,
            personelBilgileri: {
              hedefPersonel: {
                id: hedefPersonelBilgileri.id,
                ad: hedefPersonelBilgileri.ad,
                soyad: hedefPersonelBilgileri.soyad,

                sicil: hedefPersonelBilgileri.sicil,
                avatar: hedefPersonelBilgileri.avatar,
                buro: hedefPersonelBilgileri.buro?.ad,
                sube: hedefPersonelBilgileri.buro?.sube?.ad,
                birim: hedefPersonelBilgileri.buro?.sube?.birim?.ad,
              },
              kaynakPersonel: null,
            },
            islemBilgileri: {
              tarih: new Date(data.islemTarihi || new Date()),
              hareketTuru: 'Zimmet',
              aciklama: data.aciklama || `Toplu zimmet - ${successfulMalzemeIds.length} malzeme`,
              hareketIds: results.map(h => h.id),
              kondisyon: data.malzemeKondisyonu || 'Saglam',
            },
            konumBilgileri: {
              kaynakKonumlar: malzemeKonumBilgileri,
            },
            islemYapanKullanici: data.islemYapanKullanici,
          };

          tutanak = await TutanakService.create(tutanakData);
        }

        return {
          success: results,
          errors: errors,
          tutanak: tutanak,
          malzemeKonumBilgileri: malzemeKonumBilgileri,
          successCount: results.length,
          errorCount: errors.length,
          totalCount: malzemeIdList.length,
        };
      });

      return result;
    } catch (error) {
      throw error;
    }
  },
  //!
  // İADE SERVISI - Tutanak entegrasyonlu
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

      // Transaction ile iade + tutanak işlemini atomik yap
      const result = await prisma.$transaction(async tx => {
        // 1. İade hareketini oluştur
        const createPayload = {
          islemTarihi: new Date(data.islemTarihi || new Date()),
          hareketTuru: 'Iade',
          malzemeKondisyonu: data.malzemeKondisyonu || 'Saglam',
          malzemeId: data.malzemeId,
          kaynakPersonelId: data.kaynakPersonelId,
          hedefKonumId: data.konumId,
          kaynakKonumId: null,
          hedefPersonelId: null,
          aciklama: data.aciklama,
          status: AuditStatusEnum.Aktif,
          createdById: data.islemYapanKullanici,
        };

        const yeniHareket = await tx[PrismaName].create({
          data: createPayload,
          include: includeEntity,
        });

        // 2. Tutanak için gerekli verileri hazırla
        const malzemeBilgileri = await tx.malzeme.findUnique({
          where: { id: data.malzemeId },
          include: {
            sabitKodu: true,
            marka: true,
            model: true,
            birim: true,
            sube: true,
          },
        });

        const kaynakPersonelBilgileri = await tx.personel.findUnique({
          where: { id: data.kaynakPersonelId },
          include: {
            buro: {
              include: {
                sube: {
                  include: { birim: true },
                },
              },
            },
          },
        });

        const konumBilgileri = await tx.konum.findUnique({
          where: { id: data.konumId },
          include: {
            depo: true,
          },
        });

        // 3. Tutanak oluştur
        const tutanakData = {
          hareketTuru: 'Iade',
          malzemeIds: [data.malzemeId],
          malzemeler: [
            {
              id: malzemeBilgileri.id,
              vidaNo: malzemeBilgileri.vidaNo,
              sabitKodu: malzemeBilgileri.sabitKodu?.ad,
              marka: malzemeBilgileri.marka?.ad,
              model: malzemeBilgileri.model?.ad,
              bademSeriNo: malzemeBilgileri.bademSeriNo,
              etmysSeriNo: malzemeBilgileri.etmysSeriNo,
              stokDemirbasNo: malzemeBilgileri.stokDemirbasNo,
              malzemeTipi: malzemeBilgileri.malzemeTipi,
              kondisyon: data.malzemeKondisyonu || 'Saglam',
              birim: malzemeBilgileri.birim?.ad,
              sube: malzemeBilgileri.sube?.ad,
            },
          ],
          personelBilgileri: {
            kaynakPersonel: {
              id: kaynakPersonelBilgileri.id,
              ad: kaynakPersonelBilgileri.ad,
              soyad: kaynakPersonelBilgileri.soyad,

              avatar: kaynakPersonelBilgileri.avatar,
              sicil: kaynakPersonelBilgileri.sicil,
              buro: kaynakPersonelBilgileri.buro?.ad,
              sube: kaynakPersonelBilgileri.buro?.sube?.ad,
              birim: kaynakPersonelBilgileri.buro?.sube?.birim?.ad,
            },
            hedefPersonel: null, // İade işleminde hedef depo
          },
          islemBilgileri: {
            tarih: yeniHareket.islemTarihi,
            hareketTuru: 'Iade',
            aciklama: data.aciklama || 'Malzeme iade işlemi',
            hareketId: yeniHareket.id,
            kondisyon: data.malzemeKondisyonu || 'Saglam',
          },
          konumBilgileri: {
            hedefKonum: {
              id: konumBilgileri.id,
              ad: konumBilgileri.ad,
              depo: konumBilgileri.depo?.ad,
            },
          },
          islemYapanKullanici: data.islemYapanKullanici,
        };

        const tutanak = await TutanakService.create(tutanakData);

        return {
          hareket: yeniHareket,
          tutanak: tutanak,
        };
      });

      return result.hareket; // Geriye uyumluluk için hareket döndür
    } catch (error) {
      throw error;
    }
  },
  // Bulk iade işlemi - Tutanak entegrasyonlu
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
      const tutanaklar = [];

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

          const createPayload = {
            islemTarihi: new Date(data.islemTarihi || new Date()),
            hareketTuru: HareketTuruEnum.Iade,
            malzemeKondisyonu: data.malzemeKondisyonu || MalzemeKondisyonuEnum.Saglam,
            malzemeId: malzemeId,
            kaynakPersonelId: kaynakPersonelId,
            hedefKonumId: data.konumId,
            hedefPersonelId: null,
            kaynakKonumId: null,
            aciklama: data.aciklama || `Toplu iade - ${malzemeId}`,
            status: AuditStatusEnum.Aktif,
            createdById: data.islemYapanKullanici,
          };

          const yeniHareket = await prisma[PrismaName].create({
            data: createPayload,
            include: includeEntity,
          });

          results.push(yeniHareket);
        } catch (innerError) {
          const errorMessage = innerError instanceof Error ? innerError.message : String(innerError);
          errors.push({ malzemeId, error: errorMessage });
        }
      }

      // Başarılı iade işlemleri varsa toplu tutanak oluştur
      if (results.length > 0) {
        try {
          // Başarılı iade yapılan malzemelerin bilgilerini al
          const successfulMalzemeIds = results.map(hareket => hareket.malzemeId);

          const malzemeBilgileri = await prisma.malzeme.findMany({
            where: { id: { in: successfulMalzemeIds } },
            include: {
              sabitKodu: true,
              marka: true,
              model: true,
              birim: true,
              sube: true,
            },
          });

          // Kaynak personeller (iade eden personeller) - unique'ler
          const kaynakPersonelIds = [...new Set(results.map(hareket => hareket.kaynakPersonelId))];
          const kaynakPersonelBilgileri = await prisma.personel.findMany({
            where: { id: { in: kaynakPersonelIds } },
            include: {
              buro: {
                include: {
                  sube: {
                    include: { birim: true },
                  },
                },
              },
            },
          });
          const kaynakPersonel = kaynakPersonelBilgileri[0];

          const konumBilgileri = await prisma.konum.findUnique({
            where: { id: data.konumId },
            include: {
              depo: true,
            },
          });

          // Tutanak için malzeme listesi hazırla
          const tutanakMalzemeleri = malzemeBilgileri.map(malzeme => ({
            id: malzeme.id,
            vidaNo: malzeme.vidaNo,
            sabitKodu: malzeme.sabitKodu?.ad,
            marka: malzeme.marka?.ad,
            model: malzeme.model?.ad,
            bademSeriNo: malzeme.bademSeriNo,
            etmysSeriNo: malzeme.etmysSeriNo,
            stokDemirbasNo: malzeme.stokDemirbasNo,
            malzemeTipi: malzeme.malzemeTipi,
            kondisyon: data.malzemeKondisyonu || 'Saglam',
            birim: malzeme.birim?.ad,
            sube: malzeme.sube?.ad,
            // İade eden personel bilgisini ekle
            iadeEdenPersonel: results.find(h => h.malzemeId === malzeme.id)?.kaynakPersonelId,
          }));

          // Toplu tutanak oluştur
          const tutanakData = {
            hareketTuru: 'Iade',
            malzemeIds: successfulMalzemeIds,
            malzemeler: tutanakMalzemeleri,
            personelBilgileri: {
              kaynakPersonel: {
                id: kaynakPersonel.id,
                ad: kaynakPersonel.ad,
                soyad: kaynakPersonel.soyad,
                sicil: kaynakPersonel.sicil,
                avatar: kaynakPersonel.avatar,
                buro: kaynakPersonel.buro?.ad,
                sube: kaynakPersonel.buro?.sube?.ad,
                birim: kaynakPersonel.buro?.sube?.birim?.ad,
              },
              hedefPersonel: null, // İade işleminde hedef depo
            },
            islemBilgileri: {
              tarih: new Date(data.islemTarihi || new Date()),
              hareketTuru: 'Iade',
              aciklama: data.aciklama || `Toplu iade işlemi - ${successfulMalzemeIds.length} malzeme`,
              hareketIds: results.map(h => h.id), // Tüm hareket ID'leri
              kondisyon: data.malzemeKondisyonu || 'Saglam',
            },
            konumBilgileri: {
              hedefKonum: {
                id: konumBilgileri.id,
                ad: konumBilgileri.ad,
                depo: konumBilgileri.depo?.ad,
              },
            },
            islemYapanKullanici: data.islemYapanKullanici,
          };

          const tutanak = await TutanakService.create(tutanakData);
          tutanaklar.push(tutanak);
        } catch (tutanakError) {
          // Tutanak hatası iade işlemlerini etkilemez, sadece log'larız
        }
      }

      // Eğer hiç başarılı işlem yoksa ve sadece hatalar varsa
      if (results.length === 0 && errors.length > 0) {
        throw new Error(`Toplu iade işleminde hiçbir malzeme başarıyla iade edilemedi. Hatalar: ${errors.map(e => `${e.malzemeId}: ${e.error}`).join(', ')}`);
      }

      const finalResult = {
        success: results,
        errors: errors,
        tutanaklar: tutanaklar,
        successCount: results.length,
        errorCount: errors.length,
        totalCount: malzemeIdList.length,
        summary: {
          message: `${results.length}/${malzemeIdList.length} malzeme başarıyla iade edildi.`,
          hasErrors: errors.length > 0,
          tutanakCount: tutanaklar.length,
        },
      };

      return finalResult;
    } catch (error) {
      throw error;
    }
  },
  //!
  // DEVİR SERVISI - Tutanak entegrasyonlu
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

      // Transaction ile devir + tutanak işlemini atomik yap
      const result = await prisma.$transaction(async tx => {
        // 1. Devir hareketini oluştur
        const createPayload = {
          islemTarihi: new Date(data.islemTarihi || new Date()),
          hareketTuru: 'Devir',
          malzemeKondisyonu: data.malzemeKondisyonu || 'Saglam',
          malzemeId: data.malzemeId,
          kaynakPersonelId: data.kaynakPersonelId,
          hedefPersonelId: data.hedefPersonelId,
          kaynakKonumId: null,
          hedefKonumId: null,
          aciklama: data.aciklama,
          status: AuditStatusEnum.Aktif,
          createdById: data.islemYapanKullanici,
        };

        const yeniHareket = await tx[PrismaName].create({
          data: createPayload,
          include: includeEntity,
        });

        // 2. Tutanak için gerekli verileri hazırla
        const malzemeBilgileri = await tx.malzeme.findUnique({
          where: { id: data.malzemeId },
          include: {
            sabitKodu: true,
            marka: true,
            model: true,
            birim: true,
            sube: true,
          },
        });

        const kaynakPersonelBilgileri = await tx.personel.findUnique({
          where: { id: data.kaynakPersonelId },
          include: {
            buro: {
              include: {
                sube: {
                  include: { birim: true },
                },
              },
            },
          },
        });

        const hedefPersonelBilgileri = await tx.personel.findUnique({
          where: { id: data.hedefPersonelId },
          include: {
            buro: {
              include: {
                sube: {
                  include: { birim: true },
                },
              },
            },
          },
        });

        // 3. Tutanak oluştur
        const tutanakData = {
          hareketTuru: 'Devir',
          malzemeIds: [data.malzemeId],
          malzemeler: [
            {
              id: malzemeBilgileri.id,
              vidaNo: malzemeBilgileri.vidaNo,
              sabitKodu: malzemeBilgileri.sabitKodu?.ad,
              marka: malzemeBilgileri.marka?.ad,
              model: malzemeBilgileri.model?.ad,
              bademSeriNo: malzemeBilgileri.bademSeriNo,
              etmysSeriNo: malzemeBilgileri.etmysSeriNo,
              stokDemirbasNo: malzemeBilgileri.stokDemirbasNo,
              malzemeTipi: malzemeBilgileri.malzemeTipi,
              kondisyon: data.malzemeKondisyonu || 'Saglam',
              birim: malzemeBilgileri.birim?.ad,
              sube: malzemeBilgileri.sube?.ad,
            },
          ],
          personelBilgileri: {
            kaynakPersonel: {
              id: kaynakPersonelBilgileri.id,
              ad: kaynakPersonelBilgileri.ad,
              soyad: kaynakPersonelBilgileri.soyad,

              avatar: kaynakPersonelBilgileri.avatar,
              sicil: kaynakPersonelBilgileri.sicil,
              buro: kaynakPersonelBilgileri.buro?.ad,
              sube: kaynakPersonelBilgileri.buro?.sube?.ad,
              birim: kaynakPersonelBilgileri.buro?.sube?.birim?.ad,
            },
            hedefPersonel: {
              id: hedefPersonelBilgileri.id,
              ad: hedefPersonelBilgileri.ad,
              soyad: hedefPersonelBilgileri.soyad,

              avatar: hedefPersonelBilgileri.avatar,
              sicil: hedefPersonelBilgileri.sicil,
              buro: hedefPersonelBilgileri.buro?.ad,
              sube: hedefPersonelBilgileri.buro?.sube?.ad,
              birim: hedefPersonelBilgileri.buro?.sube?.birim?.ad,
            },
          },
          islemBilgileri: {
            tarih: yeniHareket.islemTarihi,
            hareketTuru: 'Devir',
            aciklama: data.aciklama || 'Malzeme devir işlemi',
            hareketId: yeniHareket.id,
            kondisyon: data.malzemeKondisyonu || 'Saglam',
          },
          konumBilgileri: null, // Devir işleminde konum bilgisi yok (personel arası transfer)
          islemYapanKullanici: data.islemYapanKullanici,
        };

        const tutanak = await TutanakService.create(tutanakData);

        return {
          hareket: yeniHareket,
          tutanak: tutanak,
        };
      });

      return result.hareket; // Geriye uyumluluk için hareket döndür
    } catch (error) {
      throw error;
    }
  },
  // Bulk devir işlemi - Tutanak entegrasyonlu
  bulkDevir: async data => {
    try {
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

      // Kaynak personel ID'lerini data.malzemeler array'inden çıkar
      const kaynakPersonelIdList = data.malzemeler.map(personel => {
        if (!personel || typeof personel.kaynakPersonelId !== 'string' || personel.kaynakPersonelId.trim() === '') {
          throw new Error('Malzemeler listesindeki her bir öğe geçerli bir "kaynakPersonelId" propertysine sahip olmalıdır.');
        }
        return personel.kaynakPersonelId;
      });

      if (kaynakPersonelIdList.length === 0) {
        throw new Error("Geçerli kaynak personel ID'si bulunamadı.");
      }

      // Validasyonlar
      await service.checkMultipleMalzemeExists(malzemeIdList);
      await service.checkPersonelExists(data.hedefPersonelId);
      await service.checkMultiplePersonelExists(kaynakPersonelIdList);

      const results = [];
      const errors = [];
      const tutanaklar = [];

      // Her malzeme için devir kontrolü ve işlemi
      for (const malzemeId of malzemeIdList) {
        try {
          const malzemeDurum = await service.checkMalzemeZimmetDurumu(malzemeId);

          if (malzemeDurum.currentKondisyon !== MalzemeKondisyonuEnum.Saglam) {
            errors.push({
              malzemeId,
              error: `Malzeme sağlam durumda değil (Mevcut Kondisyon: ${malzemeDurum.currentKondisyon}). Sadece sağlam malzemeler devredillebilir.`,
            });
            continue;
          }

          if (!malzemeDurum.malzemePersonelde) {
            errors.push({ malzemeId, error: 'Malzeme personelde (veya devredillebilir bir konumda) değil.' });
            continue;
          }

          if (malzemeDurum.malzemeYok) {
            errors.push({ malzemeId, error: 'Malzeme kayıp veya düşüm yapılmış.' });
            continue;
          }

          // İlgili malzemeyi data içinden bul
          const ilgiliMalzeme = data.malzemeler.find(m => m.id === malzemeId);
          const kaynakPersonelId = ilgiliMalzeme?.kaynakPersonelId;

          if (!kaynakPersonelId) {
            errors.push({ malzemeId, error: 'Kaynak personel ID bulunamadı.' });
            continue;
          }

          // Kaynak personel kontrolü
          if (malzemeDurum.currentPersonel && kaynakPersonelId !== malzemeDurum.currentPersonel.id) {
            errors.push({
              malzemeId,
              error: `Bu malzeme "${malzemeDurum.currentPersonel.ad}" adlı personelde zimmetli. Devir işlemi sadece o personel tarafından yapılabilir.`,
            });
            continue;
          }

          const createPayload = {
            islemTarihi: new Date(data.islemTarihi || new Date()),
            hareketTuru: HareketTuruEnum.Devir,
            malzemeKondisyonu: data.malzemeKondisyonu || MalzemeKondisyonuEnum.Saglam,
            malzemeId: malzemeId,
            hedefPersonelId: data.hedefPersonelId,
            kaynakPersonelId: kaynakPersonelId,
            kaynakKonumId: null,
            hedefKonumId: null,
            aciklama: data.aciklama || `Toplu devir - ${malzemeId}`,
            status: AuditStatusEnum.Aktif,
            createdById: data.islemYapanKullanici,
          };

          const yeniHareket = await prisma[PrismaName].create({
            data: createPayload,
            include: includeEntity,
          });

          results.push(yeniHareket);
        } catch (innerError) {
          const errorMessage = innerError instanceof Error ? innerError.message : String(innerError);
          errors.push({ malzemeId, error: errorMessage });
        }
      }

      // Başarılı devir işlemleri varsa toplu tutanak oluştur
      if (results.length > 0) {
        try {
          // Başarılı devir yapılan malzemelerin bilgilerini al
          const successfulMalzemeIds = results.map(hareket => hareket.malzemeId);

          const malzemeBilgileri = await prisma.malzeme.findMany({
            where: { id: { in: successfulMalzemeIds } },
            include: {
              sabitKodu: true,
              marka: true,
              model: true,
              birim: true,
              sube: true,
            },
          });

          // Kaynak personeller (devir veren personeller) - unique'ler
          const kaynakPersonelIds = [...new Set(results.map(hareket => hareket.kaynakPersonelId))];
          const kaynakPersonelBilgileri = await prisma.personel.findMany({
            where: { id: { in: kaynakPersonelIds } },
            include: {
              buro: {
                include: {
                  sube: {
                    include: { birim: true },
                  },
                },
              },
            },
          });
          const kaynakPersonel = kaynakPersonelBilgileri[0];

          // Hedef personel bilgileri
          const hedefPersonelBilgileri = await prisma.personel.findUnique({
            where: { id: data.hedefPersonelId },
            include: {
              buro: {
                include: {
                  sube: {
                    include: { birim: true },
                  },
                },
              },
            },
          });

          // Tutanak için malzeme listesi hazırla
          const tutanakMalzemeleri = malzemeBilgileri.map(malzeme => ({
            id: malzeme.id,
            vidaNo: malzeme.vidaNo,
            sabitKodu: malzeme.sabitKodu?.ad,
            marka: malzeme.marka?.ad,
            model: malzeme.model?.ad,
            bademSeriNo: malzeme.bademSeriNo,
            etmysSeriNo: malzeme.etmysSeriNo,
            stokDemirbasNo: malzeme.stokDemirbasNo,
            malzemeTipi: malzeme.malzemeTipi,
            kondisyon: data.malzemeKondisyonu || 'Saglam',
            birim: malzeme.birim?.ad,
            sube: malzeme.sube?.ad,
            // Devir veren personel bilgisini ekle
            devirVerenPersonel: results.find(h => h.malzemeId === malzeme.id)?.kaynakPersonelId,
          }));

          // Toplu tutanak oluştur
          const tutanakData = {
            hareketTuru: 'Devir',
            malzemeIds: successfulMalzemeIds,
            malzemeler: tutanakMalzemeleri,
            personelBilgileri: {
              kaynakPersonel: {
                id: kaynakPersonel.id,
                ad: kaynakPersonel.ad,
                soyad: kaynakPersonel.soyad,
                sicil: kaynakPersonel.sicil,
                avatar: kaynakPersonel.avatar,
                buro: kaynakPersonel.buro?.ad,
                sube: kaynakPersonel.buro?.sube?.ad,
                birim: kaynakPersonel.buro?.sube?.birim?.ad,
              },
              hedefPersonel: {
                id: hedefPersonelBilgileri.id,
                ad: hedefPersonelBilgileri.ad,
                soyad: hedefPersonelBilgileri.soyad,

                sicil: hedefPersonelBilgileri.sicil,
                avatar: hedefPersonelBilgileri.avatar,
                buro: hedefPersonelBilgileri.buro?.ad,
                sube: hedefPersonelBilgileri.buro?.sube?.ad,
                birim: hedefPersonelBilgileri.buro?.sube?.birim?.ad,
              },
            },
            islemBilgileri: {
              tarih: new Date(data.islemTarihi || new Date()),
              hareketTuru: 'Devir',
              aciklama: data.aciklama || `Toplu devir işlemi - ${successfulMalzemeIds.length} malzeme`,
              hareketIds: results.map(h => h.id), // Tüm hareket ID'leri
              kondisyon: data.malzemeKondisyonu || 'Saglam',
            },
            konumBilgileri: null, // Devir işleminde konum bilgisi yok (personel arası transfer)
            islemYapanKullanici: data.islemYapanKullanici,
          };

          const tutanak = await TutanakService.create(tutanakData);
          tutanaklar.push(tutanak);
        } catch (tutanakError) {
          // Tutanak hatası devir işlemlerini etkilemez, sadece log'larız
        }
      }

      // Eğer hiç başarılı işlem yoksa ve sadece hatalar varsa
      if (results.length === 0 && errors.length > 0) {
        throw new Error(`Toplu devir işleminde hiçbir malzeme başarıyla devredilmedi. Hatalar: ${errors.map(e => `${e.malzemeId}: ${e.error}`).join(', ')}`);
      }

      const finalResult = {
        success: results,
        errors: errors,
        tutanaklar: tutanaklar,
        successCount: results.length,
        errorCount: errors.length,
        totalCount: malzemeIdList.length,
        summary: {
          message: `${results.length}/${malzemeIdList.length} malzeme başarıyla devredildi.`,
          hasErrors: errors.length > 0,
          tutanakCount: tutanaklar.length,
        },
      };

      return finalResult;
    } catch (error) {
      throw error;
    }
  },
  //!
  // DEPO TRANSFER SERVISI
  depoTransfer: async data => {
    try {
      await service.checkMalzemeExists(data.malzemeId);
      if (!data.konumId) throw new Error('Depo transferi için hedef konum zorunludur.');
      await service.checkKonumExists(data.konumId);

      const sonKonumluHareket = await service.getKonumluSonHareketByMalzemeId(data.malzemeId);
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

      const createPayload = {
        islemTarihi: new Date(data.islemTarihi || new Date()),
        hareketTuru: 'DepoTransferi',
        malzemeKondisyonu: data.malzemeKondisyonu || 'Saglam',
        malzemeId: data.malzemeId,
        kaynakKonumId: sonKonumluHareket.hedefKonumId || sonKonumluHareket.kaynakKonumId,
        hedefKonumId: data.konumId,
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
      const sonKonumluHareket = await service.getKonumluSonHareketByMalzemeId(data.malzemeId);

      const malzemeDurum = await service.checkMalzemeZimmetDurumu(data.malzemeId);
      if (malzemeDurum.currentKondisyon === data.malzemeKondisyonu) {
        throw new Error('Kondisyon güncelleme: Yeni kondisyon mevcut kondisyon ile aynı.');
      }

      const createPayload = {
        islemTarihi: new Date(data.islemTarihi || new Date()),
        hareketTuru: 'KondisyonGuncelleme',
        malzemeKondisyonu: data.malzemeKondisyonu,
        malzemeId: data.malzemeId,
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

  // KAYIP SERVISI
  kayip: async data => {
    try {
      await service.checkMalzemeExists(data.malzemeId);
      if (!data.aciklama) throw new Error('Kayıp bildirimi için açıklama zorunludur.');
      const sonKonumluHareket = await service.getKonumluSonHareketByMalzemeId(data.malzemeId);

      const malzemeDurum = await service.checkMalzemeZimmetDurumu(data.malzemeId);
      if (malzemeDurum.malzemeYok) {
        throw new Error('Zaten kayıp veya düşüm yapılmış malzemeler için tekrar kayıp bildirimi yapılamaz.');
      }

      const createPayload = {
        islemTarihi: new Date(data.islemTarihi || new Date()),
        hareketTuru: 'Kayip',
        malzemeKondisyonu: data.malzemeKondisyonu || 'Kayip',
        malzemeId: data.malzemeId,
        kaynakPersonelId: null,
        hedefPersonelId: null,
        kaynakKonumId: sonKonumluHareket.hedefKonumId || sonKonumluHareket.kaynakKonumId,
        hedefKonumId: null,
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

      const createPayload = {
        islemTarihi: new Date(data.islemTarihi || new Date()),
        hareketTuru: 'Dusum',
        malzemeKondisyonu: data.malzemeKondisyonu || 'Hurda',
        malzemeId: data.malzemeId,
        kaynakPersonelId: null,
        hedefPersonelId: null,
        kaynakKonumId: null,
        hedefKonumId: null,
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

      const createPayload = {
        islemTarihi: new Date(data.islemTarihi || new Date()),
        hareketTuru: 'Kayit',
        malzemeKondisyonu: data.malzemeKondisyonu || 'Saglam',
        malzemeId: data.malzemeId,
        kaynakKonumId: null,
        hedefKonumId: data.konumId,
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

  // Bulk depo transferi - Güncellendi
  bulkDepoTransfer: async data => {
    try {
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

      if (malzemeIdList.length === 0) {
        throw new Error("Geçerli malzeme ID'si bulunamadı.");
      }

      // Validasyonlar
      await service.checkMultipleMalzemeExists(malzemeIdList);
      await service.checkKonumExists(data.konumId);

      const results = [];
      const errors = [];

      // Her malzeme için transfer kontrolü ve işlemi
      for (const malzemeId of malzemeIdList) {
        try {
          const malzemeDurum = await service.checkMalzemeZimmetDurumu(malzemeId);
          const sonKonumluHareket = await service.getKonumluSonHareketByMalzemeId(malzemeId);

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

          const createPayload = {
            islemTarihi: new Date(data.islemTarihi || new Date()),
            hareketTuru: HareketTuruEnum.DepoTransferi,
            malzemeKondisyonu: data.malzemeKondisyonu || MalzemeKondisyonuEnum.Saglam,
            malzemeId: malzemeId,

            kaynakKonumId: sonKonumluHareket.hedefKonumId || sonKonumluHareket.kaynakKonumId,
            hedefKonumId: data.konumId,
            kaynakPersonelId: null,
            hedefPersonelId: null,
            aciklama: data.aciklama || `Toplu depo transferi - ${malzemeId}`,
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

  // Bulk kondisyon güncelleme - Güncellendi
  bulkKondisyonGuncelleme: async data => {
    try {
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

      if (malzemeIdList.length === 0) {
        throw new Error("Geçerli malzeme ID'si bulunamadı.");
      }

      // Validasyonlar
      await service.checkMultipleMalzemeExists(malzemeIdList);

      const results = [];
      const errors = [];

      // Her malzeme için kondisyon güncelleme
      for (const malzemeId of malzemeIdList) {
        try {
          const malzemeDurum = await service.checkMalzemeZimmetDurumu(malzemeId);

          if (malzemeDurum.currentKondisyon === data.malzemeKondisyonu) {
            errors.push({ malzemeId, error: 'Kondisyon zaten aynı' });
            continue;
          }

          const createPayload = {
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

  // Bulk kayıp bildirimi - Güncellendi
  bulkKayip: async data => {
    try {
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

      if (malzemeIdList.length === 0) {
        throw new Error("Geçerli malzeme ID'si bulunamadı.");
      }

      // Validasyonlar
      await service.checkMultipleMalzemeExists(malzemeIdList);

      const results = [];
      const errors = [];

      // Her malzeme için kayıp bildirimi
      for (const malzemeId of malzemeIdList) {
        try {
          const malzemeDurum = await service.checkMalzemeZimmetDurumu(malzemeId);
          const sonKonumluHareket = await service.getKonumluSonHareketByMalzemeId(malzemeId);

          if (malzemeDurum.malzemeYok) {
            errors.push({ malzemeId, error: 'Zaten kayıp veya düşüm yapılmış' });
            continue;
          }

          const createPayload = {
            islemTarihi: new Date(data.islemTarihi || new Date()),
            hareketTuru: HareketTuruEnum.Kayip,
            malzemeKondisyonu: data.malzemeKondisyonu || MalzemeKondisyonuEnum.Kayip,
            malzemeId: malzemeId,
            kaynakPersonelId: null,
            hedefPersonelId: null,
            kaynakKonumId: sonKonumluHareket.hedefKonumId || sonKonumluHareket.kaynakKonumId,
            hedefKonumId: null,
            aciklama: data.aciklama,
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

  // Bulk düşüm işlemi - Güncellendi
  bulkDusum: async data => {
    try {
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

      if (malzemeIdList.length === 0) {
        throw new Error("Geçerli malzeme ID'si bulunamadı.");
      }

      // Validasyonlar
      await service.checkMultipleMalzemeExists(malzemeIdList);

      const results = [];
      const errors = [];
      const updatedMalzemeler = [];

      // Her malzeme için düşüm işlemi
      for (const malzemeId of malzemeIdList) {
        try {
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

          const createPayload = {
            islemTarihi: new Date(data.islemTarihi || new Date()),
            hareketTuru: HareketTuruEnum.Dusum,
            malzemeKondisyonu: data.malzemeKondisyonu || MalzemeKondisyonuEnum.Hurda,
            malzemeId: malzemeId,
            kaynakPersonelId: null,
            hedefPersonelId: null,
            kaynakKonumId: null,
            hedefKonumId: null,
            aciklama: data.aciklama,
            status: AuditStatusEnum.Aktif,
            createdById: data.islemYapanKullanici,
          };

          const result = await prisma[PrismaName].create({
            data: createPayload,
            include: includeEntity,
          });

          results.push(result);
          updatedMalzemeler.push(malzemeId);
        } catch (innerError) {
          const errorMessage = innerError instanceof Error ? innerError.message : String(innerError);
          errors.push({ malzemeId, error: errorMessage });
        }
      }

      // Başarılı düşüm yapılan malzemeleri pasif yap
      if (updatedMalzemeler.length > 0) {
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

      return finalResult;
    } catch (error) {
      throw error;
    }
  },

  // Bulk kayıt işlemi - Yeni eklendi
  bulkKayit: async data => {
    try {
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

      if (malzemeIdList.length === 0) {
        throw new Error("Geçerli malzeme ID'si bulunamadı.");
      }

      // Validasyonlar
      await service.checkMultipleMalzemeExists(malzemeIdList);
      await service.checkKonumExists(data.konumId);

      const results = [];
      const errors = [];

      // Her malzeme için kayıt işlemi
      for (const malzemeId of malzemeIdList) {
        try {
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

          const createPayload = {
            islemTarihi: new Date(data.islemTarihi || new Date()),
            hareketTuru: HareketTuruEnum.Kayit,
            malzemeKondisyonu: data.malzemeKondisyonu || MalzemeKondisyonuEnum.Saglam,
            malzemeId: malzemeId,

            kaynakKonumId: null,
            hedefKonumId: data.konumId,
            kaynakPersonelId: null,
            hedefPersonelId: null,
            aciklama: data.aciklama || `Toplu kayıt - ${malzemeId}`,
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
      if (data.hedefKonumId) whereClause.hedefKonumId = data.hedefKonumId;
      if (data.kaynakKonumId) whereClause.kaynakKonumId = data.kaynakKonumId;

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
};

export default service;
