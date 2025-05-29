// server/app/malzemeHareket/service.js
import { prisma } from '../../config/db.js';
import helper from '../../utils/helper.js';
import { HizmetName, PrismaName, HumanName } from './base.js';
import { AuditStatusEnum, HareketTuruEnum, MalzemeKondisyonuEnum } from '@prisma/client';
import MalzemeService from '../malzeme/service.js';
import PersonelService from '../personel/service.js';
import KonumService from '../konum/service.js';

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

const service = {
  checkExistsById: async id => {
    const result = await prisma[PrismaName].findUnique({ where: { id } });
    if (!result || result.status === AuditStatusEnum.Silindi) {
      throw new Error(`${id} ID'sine sahip aktif ${HumanName} bulunamadı.`);
    }
    return result;
  },

  // Malzemenin son hareket durumunu kontrol et
  getLastHareketByMalzemeId: async malzemeId => {
    try {
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
    } catch (error) {
      throw error;
    }
  },

  checkMalzemeZimmetDurumu: async malzemeId => {
    try {
      const lastHareket = await service.getLastHareketByMalzemeId(malzemeId);

      if (!lastHareket) {
        return {
          isZimmetli: false,
          currentPersonel: null,
          currentKondisyon: 'Saglam',
          lastHareketTuru: null,
        };
      }

      // Zimmet durumu kontrolü
      const zimmetliHareketler = ['Zimmet', 'Devir'];
      const zimmetSonlandiran = ['Iade', 'Kayip', 'Dusum'];

      let isZimmetli = false;
      let currentPersonel = null;

      if (zimmetliHareketler.includes(lastHareket.hareketTuru)) {
        isZimmetli = true;
        currentPersonel = lastHareket.hedefPersonel;
      } else if (zimmetSonlandiran.includes(lastHareket.hareketTuru)) {
        isZimmetli = false;
        currentPersonel = null;
      } else if (lastHareket.hareketTuru === 'KondisyonGuncelleme') {
        // Kondisyon güncelleme zimmet durumunu etkilemez, önceki harekete bak
        const previousHareket = await prisma[PrismaName].findFirst({
          where: {
            malzemeId,
            status: AuditStatusEnum.Aktif,
            id: { not: lastHareket.id },
          },
          orderBy: orderByEntity,
          include: {
            hedefPersonel: { select: { id: true, ad: true, sicil: true } },
          },
        });

        if (previousHareket && zimmetliHareketler.includes(previousHareket.hareketTuru)) {
          isZimmetli = true;
          currentPersonel = previousHareket.hedefPersonel;
        }
      }

      return {
        isZimmetli,
        currentPersonel,
        currentKondisyon: lastHareket.malzemeKondisyonu,
        lastHareketTuru: lastHareket.hareketTuru,
        lastHareket,
      };
    } catch (error) {
      throw error;
    }
  },

  // Hareket türü validasyonu
  validateHareketTuru: async data => {
    // malzemeId boş veya tanımsızsa hata fırlat
    if (!data.malzemeId) {
      throw new Error('Validasyon için Malzeme ID zorunludur.');
    }

    const malzemeDurum = await service.checkMalzemeZimmetDurumu(data.malzemeId);

    // `malzemeDurum` içinde malzemenin daha önce herhangi bir hareketi olup olmadığını
    // belirten bir alan olduğunu varsayalım, örneğin `hasAnyMovement`.
    // Eğer böyle bir alan yoksa, alternatif bir kontrol (örn: ilk hareket kaydı mı?) yapılabilir.
    // Şimdilik, eğer malzeme zaten zimmetliyse (veya herhangi bir hareketi varsa) `Kayit` yapılamaz.

    switch (data.hareketTuru) {
      case 'Kayit':
        // Eğer malzeme daha önce sisteme bir şekilde dahil edilmişse (örn: zimmetli, iadeli, kayıp vb.)
        // yeni bir "Kayit" işlemi mantıksız olabilir. Bu kontrol, `malzemeDurum` objesinin
        // içeriğine göre şekillenecektir.
        // Örneğin, `malzemeDurum.isZimmetli` veya `malzemeDurum.hasAnyMovement` gibi bir alan olabilir.
        // Ya da malzeme hareket geçmişinin boş olup olmadığına bakılabilir.
        // Şimdilik basit bir kontrol: Eğer malzeme zaten "zimmetli" ise veya bir "mevcut konumu" varsa,
        // bu daha önce bir işlem gördüğünü gösterir.
        if (malzemeDurum.isZimmetli || malzemeDurum.currentKonum) { // currentKonum gibi bir alan varsa
          throw new Error('Bu malzeme daha önce işlem görmüş. "Kayıt" işlemi yapılamaz.');
        }
        // Başka bir kontrol: Malzemenin hiç hareket geçmişi olmamalı.
        // Bu, `service.checkMalzemeZimmetDurumu` veya ayrı bir servis çağrısı ile doğrulanabilir.
        // Örnek: const hareketGecmisi = await service.getMalzemeHareketleri(data.malzemeId);
        // if (hareketGecmisi && hareketGecmisi.length > 0) {
        //   throw new Error('Bu malzemenin zaten hareket geçmişi var. "Kayıt" işlemi yapılamaz.');
        // }

        if (!data.konumId) {
          throw new Error('Kayıt işlemi için başlangıç konumu zorunludur.');
        }
        if (!data.malzemeKondisyonu) { // Genellikle varsayılan 'Saglam' olur ama yine de kontrol edelim
          throw new Error('Kayıt işlemi için malzeme kondisyonu zorunludur.');
        }
        break;

      case 'Zimmet':
        if (malzemeDurum.isZimmetli) {
          throw new Error('Bu malzeme zaten zimmetli durumda. Önce iade alınmalı.');
        }
        if (malzemeDurum.currentKondisyon !== 'Saglam') {
          throw new Error('Sadece sağlam durumda olan malzemeler zimmetlenebilir.');
        }
        if (!data.hedefPersonelId) {
          throw new Error('Zimmet işlemi için hedef personel zorunludur.');
        }
        break;

      case 'Iade':
        if (!malzemeDurum.isZimmetli) {
          throw new Error('Bu malzeme zimmetli değil. İade işlemi yapılamaz.');
        }
        if (!data.kaynakPersonelId) {
          throw new Error('İade işlemi için kaynak personel zorunludur.');
        }
        // Kaynak personel kontrolü
        if (malzemeDurum.currentPersonel && data.kaynakPersonelId !== malzemeDurum.currentPersonel.id) {
          throw new Error(`Bu malzeme "${malzemeDurum.currentPersonel.ad}" adlı personelde zimmetli. İade işlemi sadece o personel tarafından yapılabilir.`);
        }
        break;

      case 'Devir':
        if (!malzemeDurum.isZimmetli) {
          throw new Error('Bu malzeme zimmetli değil. Devir işlemi yapılamaz.');
        }
        if (!data.kaynakPersonelId || !data.hedefPersonelId) {
          throw new Error('Devir işlemi için kaynak ve hedef personel zorunludur.');
        }
        if (data.kaynakPersonelId === data.hedefPersonelId) {
          throw new Error('Kaynak ve hedef personel aynı olamaz.');
        }
        // Kaynak personel kontrolü
        if (malzemeDurum.currentPersonel && data.kaynakPersonelId !== malzemeDurum.currentPersonel.id) {
          throw new Error(`Bu malzeme "${malzemeDurum.currentPersonel.ad}" adlı personelde zimmetli. Devir işlemi sadece o personel tarafından yapılabilir.`);
        }
        break;

      case 'Kayip':
        // Kayıp bildirimi için malzemenin zimmetli olması şart mı? Bazen depodayken de kaybolabilir.
        // Bu iş kuralınıza bağlı. Şimdilik zimmetli olma şartını koruyorum.
        if (!malzemeDurum.isZimmetli && !malzemeDurum.currentKonum) { // Ya zimmetli olmalı ya da bir depoda olmalı
             throw new Error('Malzeme ne zimmetli ne de bir depoda kayıtlı. Kayıp bildirimi yapılamaz.');
        }
        if (!data.kaynakPersonelId && malzemeDurum.isZimmetli) { // Eğer zimmetliyse kaynak personel zorunlu
          throw new Error('Zimmetli malzemenin kayıp bildirimi için kaynak personel zorunludur.');
        }
        if (!data.aciklama) {
          throw new Error('Kayıp bildirimi için açıklama zorunludur.');
        }
        break;

      case 'DepoTransferi':
        if (malzemeDurum.isZimmetli) {
          throw new Error('Zimmetli malzemeler depo transferi yapılamaz. Önce iade alınmalı.');
        }
        if (!malzemeDurum.currentKonum) { // Transfer edilecekse bir mevcut konumu olmalı
            throw new Error('Malzemenin transfer edilebilmesi için mevcut bir konumda olması gerekir.');
        }
        if (!data.konumId) {
          throw new Error('Depo transferi için hedef konum zorunludur.');
        }
        if (malzemeDurum.currentKonum?.id === data.konumId) {
            throw new Error('Malzeme zaten bu konumda. Farklı bir hedef konum seçin.');
        }
        break;

      case 'Dusum':
        if (malzemeDurum.isZimmetli) {
          throw new Error('Zimmetli malzemeler düşüm yapılamaz. Önce iade alınmalı.');
        }
        if (!['Arizali', 'Hurda'].includes(malzemeDurum.currentKondisyon)) {
          throw new Error('Sadece arızalı veya hurda durumundaki malzemeler düşüm yapılabilir.');
        }
        if (!data.aciklama) {
          throw new Error('Düşüm işlemi için açıklama zorunludur.');
        }
        break;

      case 'KondisyonGuncelleme':
        if (!data.malzemeKondisyonu) {
          throw new Error('Kondisyon güncelleme için yeni kondisyon zorunludur.');
        }
        // Eğer yeni kondisyon mevcut kondisyonla aynıysa hata verilebilir (opsiyonel)
        if (malzemeDurum.currentKondisyon === data.malzemeKondisyonu) {
            // throw new Error('Yeni kondisyon mevcut kondisyon ile aynı olamaz.');
            // Ya da sadece bir uyarı loglanabilir, işlem devam edebilir.
            console.warn("Kondisyon güncelleme: Yeni kondisyon mevcut kondisyon ile aynı.");
        }
        break;

      default:
        // `data.hareketTuru` tanımsız veya boşsa da buraya düşebilir.
        if (!data.hareketTuru) {
            throw new Error('Hareket türü belirtilmemiş.');
        }
        throw new Error(`Geçersiz hareket türü: ${data.hareketTuru}`);
    }

    return malzemeDurum; // Başarılı validasyon sonrası malzemeDurum'u döndür.
  },
  getAll: async () => {
    try {
      return await prisma[PrismaName].findMany({
        where: { status: AuditStatusEnum.Aktif },
        orderBy: orderByEntity,
        include: includeEntity,
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
      // Temel validasyonlar
      await MalzemeService.checkExistsById(data.malzemeId);
      if (data.kaynakPersonelId) await PersonelService.checkExistsById(data.kaynakPersonelId);
      if (data.hedefPersonelId) await PersonelService.checkExistsById(data.hedefPersonelId);
      if (data.konumId) await KonumService.checkExistsById(data.konumId);

      // Hareket türü özel validasyonları
      const malzemeDurum = await service.validateHareketTuru(data);

      const yeniId = helper.generateId(HizmetName);

      // Kondisyon güncelleme için özel işlem
      let createPayload = {
        id: yeniId,
        islemTarihi: new Date(data.islemTarihi || new Date()),
        hareketTuru: data.hareketTuru,
        malzemeKondisyonu: data.malzemeKondisyonu || malzemeDurum.currentKondisyon,
        malzemeId: data.malzemeId,
        status: AuditStatusEnum.Aktif,
        createdById: data.islemYapanKullanici,
      };

      if (data.hareketTuru === 'KondisyonGuncelleme') {
        // Kondisyon güncelleme: mevcut zimmet bilgilerini koru
        if (malzemeDurum.isZimmetli && malzemeDurum.currentPersonel) {
          createPayload.kaynakPersonelId = malzemeDurum.currentPersonel.id;
          createPayload.hedefPersonelId = malzemeDurum.currentPersonel.id;
        }
        if (malzemeDurum.lastHareket?.konumId) {
          createPayload.konumId = malzemeDurum.lastHareket.konumId;
        }
      } else {
        // Normal işlemler
        if (data.kaynakPersonelId !== undefined) createPayload.kaynakPersonelId = data.kaynakPersonelId;
        if (data.hedefPersonelId !== undefined) createPayload.hedefPersonelId = data.hedefPersonelId;
        if (data.konumId !== undefined) createPayload.konumId = data.konumId;
      }

      if (data.aciklama !== undefined) createPayload.aciklama = data.aciklama;

      const result = await prisma[PrismaName].create({
        data: createPayload,
        include: includeEntity,
      });

      // Özel işlem sonrası güncellemeler
      await service.handlePostHareketActions(data.hareketTuru, result, malzemeDurum);

      return result;
    } catch (error) {
      throw error;
    }
  },

  // Hareket sonrası özel işlemler
  handlePostHareketActions: async (hareketTuru, hareketKaydi, malzemeDurum) => {
    try {
      switch (hareketTuru) {
        case 'Dusum':
          // Düşüm sonrası malzemeyi pasif yap
          await prisma.malzeme.update({
            where: { id: hareketKaydi.malzemeId },
            data: { status: AuditStatusEnum.Pasif },
          });
          break;

        case 'Kayip':
          // Kayıp sonrası özel işlemler (opsiyonel)
          // Örneğin: bildirim gönder, rapor oluştur vb.
          break;

        default:
          // Diğer işlemler için ek eylem yok
          break;
      }
    } catch (error) {
      console.error('Post hareket actions error:', error);
      // Hata olsa bile ana işlemi başarısız yapma
    }
  },

  update: async data => {
    try {
      await service.checkExistsById(data.id);

      const updatePayload = { updatedById: data.islemYapanKullanici };

      if (data.islemTarihi !== undefined) updatePayload.islemTarihi = new Date(data.islemTarihi);
      if (data.hareketTuru !== undefined) updatePayload.hareketTuru = data.hareketTuru;
      if (data.malzemeKondisyonu !== undefined) updatePayload.malzemeKondisyonu = data.malzemeKondisyonu;
      if (data.kaynakPersonelId !== undefined) updatePayload.kaynakPersonelId = data.kaynakPersonelId;
      if (data.hedefPersonelId !== undefined) updatePayload.hedefPersonelId = data.hedefPersonelId;
      if (data.konumId !== undefined) updatePayload.konumId = data.konumId;
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

  updateStatus: async data => {
    try {
      await service.checkExistsById(data.id);

      if (!Object.values(AuditStatusEnum).includes(data.status)) {
        throw new Error(`Girilen '${data.status}' durumu geçerli bir durum değildir.`);
      }

      const updatePayload = { updatedById: data.islemYapanKullanici };
      if (data.status !== undefined) updatePayload.status = data.status;

      return await prisma[PrismaName].update({
        where: { id: data.id },
        data: updatePayload,
        include: {
          malzeme: {
            select: {
              id: true,
              vidaNo: true,
              sabitKodu: { select: { id: true, ad: true } },
            },
          },
          kaynakPersonel: { select: { id: true, ad: true, sicil: true } },
          hedefPersonel: { select: { id: true, ad: true, sicil: true } },
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
      if (data.aciklama) whereClause.aciklama = { contains: data.aciklama, mode: 'insensitive' };

      return await prisma[PrismaName].findMany({
        where: whereClause,
        orderBy: orderByEntity,
        include: {
          malzeme: {
            select: {
              id: true,
              vidaNo: true,
              sabitKodu: { select: { id: true, ad: true } },
            },
          },
          kaynakPersonel: { select: { id: true, ad: true, sicil: true } },
          hedefPersonel: { select: { id: true, ad: true, sicil: true } },
          konum: {
            select: {
              id: true,
              ad: true,
              depo: { select: { id: true, ad: true } },
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
