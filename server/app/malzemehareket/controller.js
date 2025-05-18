import service from './service.js';
import message from './message.js';
import response from '../../utils/response.js';
import { HizmetName, HumanName } from './base.js';
import { MalzemeKondisyonuEnum } from '@prisma/client';

const controller = {
  getAll: async (req, res) => {
    try {
      const rota = 'getAll';
      const result = await service[rota]();
      response.success(req, res, HizmetName, rota, message.list.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.list.error, error.message);
    }
  },
  getAllQuery: async (req, res) => {
    try {
      const rota = 'getAllQuery';
      const data = req.body;

      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.list.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.list.error, error.message);
    }
  },

  getById: async (req, res) => {
    try {
      const rota = 'getById';
      const data = req.body;

      if (!data.id) return response.error(req, res, HizmetName, rota, message.get.error, message.required.id);

      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.get.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.get.error, error.message);
    }
  },

  getByMalzemeId: async (req, res) => {
    try {
      const rota = 'getByMalzemeId';
      const data = req.body;

      if (!data.malzemeId) return response.error(req, res, HizmetName, rota, message.get.error, message.required.malzemeId);

      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.get.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.get.error, error.message);
    }
  },

  getByKaynakPersonelId: async (req, res) => {
    try {
      const rota = 'getByKaynakPersonelId';
      const data = req.body;

      if (!data.kaynakPersonelId) return response.error(req, res, HizmetName, rota, message.get.error, message.required.kaynakPersonelId);

      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.get.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.get.error, error.message);
    }
  },

  getByHedefPersonelId: async (req, res) => {
    try {
      const rota = 'getByHedefPersonelId';
      const data = req.body;

      if (!data.hedefPersonelId) return response.error(req, res, HizmetName, rota, message.get.error, message.required.hedefPersonelId);

      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.get.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.get.error, error.message);
    }
  },

  getByCreatedPersonelId: async (req, res) => {
    try {
      const rota = 'getByCreatedPersonelId';
      const data = req.body;

      if (!data.createdById) return response.error(req, res, HizmetName, rota, message.get.error, message.required.islemYapanKullanici);

      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.get.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.get.error, error.message);
    }
  },

  getByKonumId: async (req, res) => {
    try {
      const rota = 'getByKonumId';
      const data = req.body;

      if (!data.konumId) return response.error(req, res, HizmetName, rota, message.get.error, message.required.konumId);

      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.get.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.get.error, error.message);
    }
  },

  kayitYap: async (req, res) => {
    try {
      const rota = 'kayitYap';
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.get.error, message.required.islemYapanKullanici);
      if (!data.islemTarihi) return response.error(req, res, HizmetName, rota, message.get.error, message.required.islemTarihi);
      if (!data.malzemeId) return response.error(req, res, HizmetName, rota, message.add.error, message.required.malzemeId);
      if (!data.konumId) return response.error(req, res, HizmetName, rota, message.add.error, message.required.konumId);
      if (!data.aciklama) return response.error(req, res, HizmetName, rota, message.add.error, message.required.aciklama);
      if (!data.malzemeKondisyonu) return response.error(req, res, HizmetName, rota, message.add.error, message.required.malzemeKondisyonu);
      if (!Object.values(MalzemeKondisyonuEnum).includes(data.malzemeKondisyonu)) throw new Error(`Girilen '${data.malzemeKondisyonu}' kondisyonu geçerli bir kondisyon değildir.`);
      
      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.add.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.add.error, error.message);
    }
  },

  zimmetYap: async (req, res) => {
    try {
      const rota = 'zimmetYap';
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.get.error, message.required.islemYapanKullanici);
      if (!data.islemTarihi) return response.error(req, res, HizmetName, rota, message.get.error, message.required.islemTarihi);
      if (!data.malzemeId) return response.error(req, res, HizmetName, rota, message.add.error, message.required.malzemeId);
      if (!data.hedefPersonelId) return response.error(req, res, HizmetName, rota, message.add.error, message.required.hedefPersonelId);
      if (!data.aciklama) return response.error(req, res, HizmetName, rota, message.add.error, message.required.aciklama);
      if (!data.malzemeKondisyonu) return response.error(req, res, HizmetName, rota, message.add.error, message.required.malzemeKondisyonu);
      if (!Object.values(MalzemeKondisyonuEnum).includes(data.malzemeKondisyonu)) throw new Error(`Girilen '${data.malzemeKondisyonu}' kondisyonu geçerli bir kondisyon değildir.`);
      
      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.add.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.add.error, error.message);
    }
  },

  iadeAl: async (req, res) => {
    try {
      const rota = 'iadeAl';
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.get.error, message.required.islemYapanKullanici);
      if (!data.islemTarihi) return response.error(req, res, HizmetName, rota, message.get.error, message.required.islemTarihi);
      if (!data.malzemeId) return response.error(req, res, HizmetName, rota, message.add.error, message.required.malzemeId);
      if (!data.kaynakPersonelId) return response.error(req, res, HizmetName, rota, message.add.error, message.required.kaynakPersonelId);
      if (!data.konumId) return response.error(req, res, HizmetName, rota, message.add.error, message.required.konumId);
      if (!data.aciklama) return response.error(req, res, HizmetName, rota, message.add.error, message.required.aciklama);
      if (!data.malzemeKondisyonu) return response.error(req, res, HizmetName, rota, message.add.error, message.required.malzemeKondisyonu);
      if (!Object.values(MalzemeKondisyonuEnum).includes(data.malzemeKondisyonu)) throw new Error(`Girilen '${data.malzemeKondisyonu}' kondisyonu geçerli bir kondisyon değildir.`);
      
      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.add.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.add.error, error.message);
    }
  },

  devirYap: async (req, res) => {
    try {
      const rota = 'devirYap';
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.get.error, message.required.islemYapanKullanici);
      if (!data.islemTarihi) return response.error(req, res, HizmetName, rota, message.get.error, message.required.islemTarihi);
      if (!data.malzemeId) return response.error(req, res, HizmetName, rota, message.add.error, message.required.malzemeId);
      if (!data.kaynakPersonelId) return response.error(req, res, HizmetName, rota, message.add.error, message.required.kaynakPersonelId);
      if (!data.kaynakPersonelId) return response.error(req, res, HizmetName, rota, message.add.error, message.required.kaynakPersonelId);
      if (!data.aciklama) return response.error(req, res, HizmetName, rota, message.add.error, message.required.aciklama);
      if (!data.malzemeKondisyonu) return response.error(req, res, HizmetName, rota, message.add.error, message.required.malzemeKondisyonu);
      if (!Object.values(MalzemeKondisyonuEnum).includes(data.malzemeKondisyonu)) throw new Error(`Girilen '${data.malzemeKondisyonu}' kondisyonu geçerli bir kondisyon değildir.`);
      
      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.add.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.add.error, error.message);
    }
  },

  kayipBildir: async (req, res) => {
    try {
      const rota = 'kayipBildir';
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.get.error, message.required.islemYapanKullanici);
      if (!data.islemTarihi) return response.error(req, res, HizmetName, rota, message.get.error, message.required.islemTarihi);
      if (!data.malzemeId) return response.error(req, res, HizmetName, rota, message.add.error, message.required.malzemeId);
      if (!data.aciklama) return response.error(req, res, HizmetName, rota, message.add.error, message.required.aciklama);
      if (!data.malzemeKondisyonu) return response.error(req, res, HizmetName, rota, message.add.error, message.required.malzemeKondisyonu);
      if (!Object.values(MalzemeKondisyonuEnum).includes(data.malzemeKondisyonu)) throw new Error(`Girilen '${data.malzemeKondisyonu}' kondisyonu geçerli bir kondisyon değildir.`);
      
      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.add.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.add.error, error.message);
    }
  },

  kondisyonGuncelle: async (req, res) => {
    try {
      const rota = 'kondisyonGuncelle';
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.get.error, message.required.islemYapanKullanici);
      if (!data.islemTarihi) return response.error(req, res, HizmetName, rota, message.get.error, message.required.islemTarihi);
      if (!data.malzemeId) return response.error(req, res, HizmetName, rota, message.add.error, message.required.malzemeId);
      if (!data.aciklama) return response.error(req, res, HizmetName, rota, message.add.error, message.required.aciklama);
      if (!data.malzemeKondisyonu) return response.error(req, res, HizmetName, rota, message.add.error, message.required.malzemeKondisyonu);
      if (!Object.values(MalzemeKondisyonuEnum).includes(data.malzemeKondisyonu)) throw new Error(`Girilen '${data.malzemeKondisyonu}' kondisyonu geçerli bir kondisyon değildir.`);
      
      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.add.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.add.error, error.message);
    }
  },

  depoTransferiYap: async (req, res) => {
    try {
      const rota = 'depoTransferiYap';
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.get.error, message.required.islemYapanKullanici);
      if (!data.islemTarihi) return response.error(req, res, HizmetName, rota, message.get.error, message.required.islemTarihi);
      if (!data.malzemeId) return response.error(req, res, HizmetName, rota, message.add.error, message.required.malzemeId);
      if (!data.konumId) return response.error(req, res, HizmetName, rota, message.add.error, message.required.konumId);
      if (!data.aciklama) return response.error(req, res, HizmetName, rota, message.add.error, message.required.aciklama);
      if (!data.malzemeKondisyonu) return response.error(req, res, HizmetName, rota, message.add.error, message.required.malzemeKondisyonu);
      if (!Object.values(MalzemeKondisyonuEnum).includes(data.malzemeKondisyonu)) throw new Error(`Girilen '${data.malzemeKondisyonu}' kondisyonu geçerli bir kondisyon değildir.`);
      
      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.add.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.add.error, error.message);
    }
  },

  dusumYap: async (req, res) => {
    try {
      const rota = 'dusumYap';
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.get.error, message.required.islemYapanKullanici);
      if (!data.islemTarihi) return response.error(req, res, HizmetName, rota, message.get.error, message.required.islemTarihi);
      if (!data.malzemeId) return response.error(req, res, HizmetName, rota, message.add.error, message.required.malzemeId);
      if (!data.konumId) return response.error(req, res, HizmetName, rota, message.add.error, message.required.konumId);
      if (!data.aciklama) return response.error(req, res, HizmetName, rota, message.add.error, message.required.aciklama);
      if (!data.malzemeKondisyonu) return response.error(req, res, HizmetName, rota, message.add.error, message.required.malzemeKondisyonu);
      if (!Object.values(MalzemeKondisyonuEnum).includes(data.malzemeKondisyonu)) throw new Error(`Girilen '${data.malzemeKondisyonu}' kondisyonu geçerli bir kondisyon değildir.`);
      
      const result = await service[rota](data);
      response.success(req, res, HizmetName, rota, message.add.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.add.error, error.message);
    }
  },


  delete: async (req, res) => {
    try {
      const rota = 'delete';
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.get.error, message.required.islemYapanKullanici);
      if (!data.id) return response.error(req, res, HizmetName, rota, message.delete.error, message.required.id);

      const result = await service[rota](data);

      response.success(req, res, HizmetName, rota, message.delete.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.delete.error, error.message);
    }
  },

  health: async (req, res) => {
    try {
      const rota = 'health';
      const result = { status: `${HumanName} Servisi Aktif`, timestamp: new Date().toISOString() };
      response.success(req, res, HizmetName, rota, message.health.ok, result);
    } catch (error) {
      return response.error(req, res, HizmetName, rota, message.health.error, error.message);
    }
  },

  search: async (req, res) => {
    try {
      const rota = 'search';
      const data = req.body;
      data.islemYapanKullanici = req.user.id;

      if (!data.islemYapanKullanici) return response.error(req, res, HizmetName, rota, message.get.error, message.required.islemYapanKullanici);
      if (!data || Object.keys(data).length === 0) return response.error(req, res, HizmetName, rota, message.search.error, message.required.bosAramaKriteri);

      const result = await service[rota](data);

      response.success(req, res, HizmetName, rota, message.search.ok, result);
    } catch (error) {
      response.error(req, res, HizmetName, rota, message.search.error, error.message);
    }
  },
};

export default controller;
