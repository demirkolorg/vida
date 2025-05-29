// server/app/malzemeHareket/router.js
import express from 'express';
const r = express.Router();
import c from './controller.js';
import { authToken, authRoles } from '../../middlewares/auth.js';
import { RoleEnum } from '@prisma/client';

r.get('/health', c.health);
r.get('/getAll', authToken, authRoles(RoleEnum.Superadmin), c.getAll);
r.post('/getByQuery', authToken, authRoles(RoleEnum.Superadmin), c.getByQuery);
r.post('/getById', authToken, authRoles(RoleEnum.Superadmin), c.getById);
r.post('/create', authToken, authRoles(RoleEnum.Superadmin), c.create);
r.post('/update', authToken, authRoles(RoleEnum.Superadmin), c.update);
r.post('/delete', authToken, authRoles(RoleEnum.Superadmin), c.delete);
r.post('/search', authToken, authRoles(RoleEnum.Superadmin), c.search);

// Özel endpointler
r.post('/getMalzemeGecmisi', authToken, authRoles(RoleEnum.Superadmin), c.getMalzemeGecmisi);
r.post('/getPersonelZimmetleri', authToken, authRoles(RoleEnum.Superadmin), c.getPersonelZimmetleri);

export default r;
