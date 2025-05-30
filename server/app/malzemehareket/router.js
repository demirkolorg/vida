// server/app/malzemeHareket/router.js - Güncellenmiş
import express from 'express';
const r = express.Router();
import c from './controller.js';
import { authToken, authRoles } from '../../middlewares/auth.js';
import { RoleEnum } from '@prisma/client';

// Sağlık kontrolü
r.get('/health', c.health);

// Genel CRUD işlemleri
r.get('/getAll', authToken, authRoles(RoleEnum.Superadmin), c.getAll);
r.post('/getByQuery', authToken, authRoles(RoleEnum.Superadmin), c.getByQuery);
r.post('/getById', authToken, authRoles(RoleEnum.Superadmin), c.getById);
r.post('/create', authToken, authRoles(RoleEnum.Superadmin), c.create);
r.post('/update', authToken, authRoles(RoleEnum.Superadmin), c.update);
r.post('/delete', authToken, authRoles(RoleEnum.Superadmin), c.delete);
r.post('/search', authToken, authRoles(RoleEnum.Superadmin), c.search);

// İş Süreçleri - Hareket türü spesifik endpointler
r.post('/zimmet', authToken, authRoles(RoleEnum.Personel, RoleEnum.Admin, RoleEnum.Superadmin), c.zimmet);
r.post('/iade', authToken, authRoles(RoleEnum.Personel, RoleEnum.Admin, RoleEnum.Superadmin), c.iade);
r.post('/devir', authToken, authRoles(RoleEnum.Personel, RoleEnum.Admin, RoleEnum.Superadmin), c.devir);
r.post('/depoTransfer', authToken, authRoles(RoleEnum.Personel, RoleEnum.Admin, RoleEnum.Superadmin), c.depoTransfer);
r.post('/kondisyon', authToken, authRoles(RoleEnum.Personel, RoleEnum.Admin, RoleEnum.Superadmin), c.kondisyon);
r.post('/kayip', authToken, authRoles(RoleEnum.Personel, RoleEnum.Admin, RoleEnum.Superadmin), c.kayip);
r.post('/dusum', authToken, authRoles(RoleEnum.Personel, RoleEnum.Admin, RoleEnum.Superadmin), c.dusum);
r.post('/kayit', authToken, authRoles(RoleEnum.Personel, RoleEnum.Admin, RoleEnum.Superadmin), c.kayit);

// Özel endpointler
r.post('/getMalzemeGecmisi', authToken, authRoles(RoleEnum.Superadmin), c.getMalzemeGecmisi);
r.post('/getPersonelZimmetleri', authToken, authRoles(RoleEnum.Superadmin), c.getPersonelZimmetleri);

export default r;