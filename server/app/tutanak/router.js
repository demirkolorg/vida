// server/src/services/tutanak/router.js

import express from 'express';
const r = express.Router();
import c from './controller.js';
import { authToken, authRoles } from '../../middlewares/auth.js';
import { RoleEnum } from '@prisma/client';

// Health check
r.get('/health', c.health);

// Temel CRUD işlemleri
r.get('/getAll', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.getAll);
r.post('/getByQuery', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.getByQuery);
r.post('/getById', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.getById);
r.post('/create', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.create);
r.post('/update', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.update);
r.post('/updateStatus', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.updateStatus);
r.post('/delete', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.delete);
r.post('/search', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.search);

// Özel tutanak endpoint'leri
r.post('/generateFromHareketler', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.generateFromHareketler);
r.post('/generateFromMalzemeler', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.generateFromMalzemeler);
r.post('/generateBulkTutanak', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.generateBulkTutanak);
r.post('/getByHareketTuru', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.getByHareketTuru);
r.get('/getIstatistikler', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.getIstatistikler);
// Personel zimmet bilgi fişi oluştur
r.post('/generatePersonelZimmetBilgiFisi/:personelId', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.generatePersonelZimmetBilgiFisi);

// Print ve Export işlemleri
r.post('/getPrintData', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.getPrintData);
r.post('/exportToPDF', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.exportToPDF);

export default r;