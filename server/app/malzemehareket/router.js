// server/app/malzemeHareket/router.js
import express from 'express';
const r = express.Router();
import c from './controller.js';
import { authToken, authRoles } from '../../middlewares/auth.js';
import { RoleEnum } from '@prisma/client';

r.get('/health', c.health);

// Temel CRUD işlemleri
r.get('/getAll', authToken, authRoles(RoleEnum.Superadmin), c.getAll);
r.post('/getByQuery', authToken, authRoles(RoleEnum.Superadmin), c.getByQuery);
r.post('/getById', authToken, authRoles(RoleEnum.Superadmin), c.getById);
r.post('/create', authToken, authRoles(RoleEnum.Superadmin), c.create);
r.post('/update', authToken, authRoles(RoleEnum.Superadmin), c.update);
r.post('/updateStatus', authToken, authRoles(RoleEnum.Superadmin), c.updateStatus);
r.post('/delete', authToken, authRoles(RoleEnum.Superadmin), c.delete);
r.post('/search', authToken, authRoles(RoleEnum.Superadmin), c.search);

// İş süreçlerine özel endpoint'ler
r.post('/zimmetVer', authToken, authRoles(RoleEnum.Superadmin), c.zimmetVer);
r.post('/iadeAl', authToken, authRoles(RoleEnum.Superadmin), c.iadeAl);
r.post('/devirYap', authToken, authRoles(RoleEnum.Superadmin), c.devirYap);
r.post('/depoTransferi', authToken, authRoles(RoleEnum.Superadmin), c.depoTransferi);
r.post('/kayipBildir', authToken, authRoles(RoleEnum.Superadmin), c.kayipBildir);
r.post('/kondisyonGuncelle', authToken, authRoles(RoleEnum.Superadmin), c.kondisyonGuncelle);

// Raporlama endpoint'leri
r.post('/getMalzemeGecmisi', authToken, authRoles(RoleEnum.Superadmin), c.getMalzemeGecmisi);
r.post('/getPersonelZimmetleri', authToken, authRoles(RoleEnum.Superadmin), c.getPersonelZimmetleri);
r.post('/getHareketIstatistikleri', authToken, authRoles(RoleEnum.Superadmin), c.getHareketIstatistikleri);

export default r;