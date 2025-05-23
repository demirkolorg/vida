// server/app/savedfilter/service.js (Yeni dosya)

import { prisma } from '../../config/db.js'; // Veritabanı bağlantısı
import helper from '../../utils/helper.js'; // ID üretimi gibi yardımcı fonksiyonlar
import { HizmetName, PrismaName, HumanName } from './base.js'; // savedfilter için base.js'den gelecek
import { AuditStatusEnum } from '@prisma/client'; // Prisma'dan AuditStatusEnum

const service = {

  checkExistsById: async id => {
    const result = await prisma[PrismaName].findUnique({ where: { id } });
    if (!result || result.status === AuditStatusEnum.Silindi) {
      throw new Error(`${id} ID'sine sahip aktif ${HumanName} bulunamadı.`);
    }
    return result;
  },

  getAllByEntityType: async (data = {}) => {
    const { entityType } = data; // userRole yetkilendirme için kullanılabilir

    if (!entityType) {
      throw new Error('Filtreleri listelemek için entityType zorunludur.');
    }

    try {
      const whereClause = {
        entityType
      };


      return await prisma[PrismaName].findMany({
        where: whereClause,
        orderBy: { filterName: 'asc' },
        include: {
          createdBy: { select: { id: true, ad: true} }, // Personel modelindeki ad/soyad alanlarına göre
          updatedBy: { select: { id: true, ad: true} },
        },
      });
    } catch (error) {
      console.error(`${HumanName} listelenirken hata: `, error);
      throw error;
    }
  },

  getById: async data => {
    const { id } = data;
    try {
      await service.checkExistsById(id); // Aktiflik kontrolü

      return await prisma[PrismaName].findFirst({
        where: { id, status: AuditStatusEnum.Aktif },
        include: {
          createdBy: { select: { id: true, ad: true} },
          updatedBy: { select: { id: true, ad: true} },
        },
      });
    } catch (error) {
      console.error(`${HumanName} getirilirken hata (ID: ${id}): `, error);
      throw error;
    }
  },


  create: async data => {
    const { filterName, entityType, filterState, description, islemYapanKullanici } = data;

    if (!filterName || !entityType || !filterState || !islemYapanKullanici) {
      throw new Error('filterName, entityType, filterState ve islemYapanKullanici alanları zorunludur.');
    }

    try {
            const yeniId = helper.generateId(HizmetName);

      const createPayload = {
        id: yeniId,
        filterName,
        entityType,
        filterState, // JSON olarak saklanacak
        description,
        status: AuditStatusEnum.Aktif,
        createdById: islemYapanKullanici,
      };

      return await prisma[PrismaName].create({
        data: createPayload,
        include: {
          createdBy: { select: { id: true, ad: true} },
        },
      });
    } catch (error) {
      // Prisma unique constraint hatasını yakalama (örn: aynı isimde filtre)
      if (error.code === 'P2002') { // Prisma unique constraint violation kodu
        // Hangi alanların çakıştığını error.meta.target içinde bulabilirsiniz
        const target = error.meta?.target || ['bilinmeyen alan'];
        throw new Error(`${HumanName} oluşturulurken benzersizlik kısıtlaması ihlal edildi (${target.join(', ')}). Lütfen farklı bir filtre adı deneyin.`);
      }
      console.error(`${HumanName} oluşturulurken hata: `, error);
      throw error;
    }
  },


  update: async data => {
    const { id, filterName, entityType, filterState, description, islemYapanKullanici } = data;

    if (!id || !islemYapanKullanici) {
      throw new Error('ID ve islemYapanKullanici alanları zorunludur.');
    }

    try {
      const existingFilter = await service.checkExistsById(id); // Aktiflik ve varlık kontrolü

      // Yetkilendirme: Sadece oluşturan kişi güncelleyebilsin (veya admin)
      // Bu kontrol controller katmanında yapılabilir veya burada da eklenebilir.
      // if (userRole !== 'ADMIN' && existingFilter.createdById !== islemYapanKullanici) {
      //   throw new Error(`Bu ${HumanName} üzerinde değişiklik yapma yetkiniz yok.`);
      // }

      const updatePayload = {
        updatedById: islemYapanKullanici,
      };
      if (filterName !== undefined) updatePayload.filterName = filterName;
      if (entityType !== undefined) updatePayload.entityType = entityType; // Genellikle entityType değişmez
      if (filterState !== undefined) updatePayload.filterState = filterState;
      if (description !== undefined) updatePayload.description = description;

      return await prisma[PrismaName].update({
        where: { id },
        data: updatePayload,
        include: {
          createdBy: { select: { id: true, ad: true} },
          updatedBy: { select: { id: true, ad: true} },
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        const target = error.meta?.target || ['bilinmeyen alan'];
        throw new Error(`${HumanName} güncellenirken benzersizlik kısıtlaması ihlal edildi (${target.join(', ')}).`);
      }
      console.error(`${HumanName} güncellenirken hata (ID: ${id}): `, error);
      throw error;
    }
  },


  updateStatus: async data => {
    const { id, status, islemYapanKullanici } = data;

    if (!id || !status || !islemYapanKullanici) {
      throw new Error('ID, status ve islemYapanKullanici alanları zorunludur.');
    }
    if (!Object.values(AuditStatusEnum).includes(status)) {
      throw new Error(`Girilen '${status}' durumu geçerli bir durum değildir.`);
    }

    try {
      await service.checkExistsById(id); // Aktiflik ve varlık kontrolü (silinmişi tekrar silmeye gerek yok)
      // Yetkilendirme kontrolü controller'da yapılmalı.

      return await prisma[PrismaName].update({
        where: { id },
        data: {
          status,
          updatedById: islemYapanKullanici,
        },
        include: {
          createdBy: { select: { id: true, ad: true} },
          updatedBy: { select: { id: true, ad: true} },
        },
      });
    } catch (error) {
      console.error(`${HumanName} durumu güncellenirken hata (ID: ${id}): `, error);
      throw error;
    }
  },


  delete: async data => { // Fonksiyon adını delete'ten deleteSoft'a değiştirdim.
    const { id, islemYapanKullanici } = data;

    if (!id || !islemYapanKullanici) {
      throw new Error('ID ve islemYapanKullanici alanları zorunludur.');
    }
    try {
      await service.checkExistsById(id); // Aktiflik ve varlık kontrolü

      return await prisma[PrismaName].update({
        where: { id },
        data: {
          status: AuditStatusEnum.Silindi,
          updatedById: islemYapanKullanici,
        },
      }); // Silme işleminde genellikle tüm detayları geri dönmeye gerek yok.
    } catch (error) {
      console.error(`${HumanName} silinirken hata (ID: ${id}): `, error);
      throw error;
    }
  },

  search: async (data = {}) => {
    const { searchTerm, entityType, currentUserId, userRole } = data;
    try {
      const whereClause = {
        status: AuditStatusEnum.Aktif,
      };

      if (entityType) {
        whereClause.entityType = entityType;
      }

      if (searchTerm) {
        whereClause.OR = [
          { filterName: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
        ];
      }
      
      // Yetkilendirme (Örnek - getAllByEntityType'daki gibi detaylandırılabilir)
      // if (userRole !== 'ADMIN' && currentUserId) {
      //   whereClause.createdById = currentUserId;
      // }

      return await prisma[PrismaName].findMany({
        where: whereClause,
        orderBy: { filterName: 'asc' },
        include: {
          createdBy: { select: { id: true, ad: true} },
          updatedBy: { select: { id: true, ad: true} },
        },
      });
    } catch (error) {
      console.error(`${HumanName} aranırken hata: `, error);
      throw error;
    }
  },
};

export default service;