// server/src/services/tutanak/router.js

import express from 'express';
const r = express.Router();
import c from './controller.js';
import { authToken, authRoles } from '../../middlewares/auth.js';
import { RoleEnum } from '@prisma/client';

// Health check
r.get('/health', c.health);

// Temel CRUD işlemleri
r.get('/getAll', authToken, authRoles(RoleEnum.User), c.getAll);
r.post('/getByQuery', authToken, authRoles(RoleEnum.User), c.getByQuery);
r.post('/getById', authToken, authRoles(RoleEnum.User), c.getById);
r.post('/create', authToken, authRoles(RoleEnum.User), c.create);
r.post('/update', authToken, authRoles(RoleEnum.User), c.update);
r.post('/updateStatus', authToken, authRoles(RoleEnum.Admin), c.updateStatus);
r.post('/delete', authToken, authRoles(RoleEnum.Admin), c.delete);
r.post('/search', authToken, authRoles(RoleEnum.User), c.search);

// Özel tutanak endpoint'leri
r.post('/generateFromHareketler', authToken, authRoles(RoleEnum.User), c.generateFromHareketler);
r.post('/generateFromMalzemeler', authToken, authRoles(RoleEnum.User), c.generateFromMalzemeler);
r.post('/generateBulkTutanak', authToken, authRoles(RoleEnum.User), c.generateBulkTutanak);
r.post('/getByHareketTuru', authToken, authRoles(RoleEnum.User), c.getByHareketTuru);
r.get('/getIstatistikler', authToken, authRoles(RoleEnum.User), c.getIstatistikler);

// Print ve Export işlemleri
r.post('/getPrintData', authToken, authRoles(RoleEnum.User), c.getPrintData);
r.post('/exportToPDF', authToken, authRoles(RoleEnum.User), c.exportToPDF);

export default r;