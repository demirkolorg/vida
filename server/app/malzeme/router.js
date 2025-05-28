import express from 'express';
const r = express.Router();
import c from './controller.js';
import { authToken, authRoles } from '../../middlewares/auth.js';
import { RoleEnum } from '@prisma/client';

r.get('/health', c.health);
r.get('/getAll', authToken, authRoles(RoleEnum.Superadmin), c.getAll);
r.post('/getByQuery', authToken, authRoles(RoleEnum.Personel, RoleEnum.Admin, RoleEnum.Superadmin), c.getByQuery);
r.post('/getById', authToken, authRoles(RoleEnum.Personel), c.getById);
r.post('/getByBirimId', authToken, authRoles(RoleEnum.Personel), c.getByBirimId);
r.post('/getBySubeId', authToken, authRoles(RoleEnum.Personel), c.getBySubeId);
r.post('/create', authToken, authRoles(RoleEnum.Admin), c.create);
r.post('/update', authToken, authRoles(RoleEnum.Admin), c.update);
r.post('/updateStatus', authToken, authRoles(RoleEnum.Admin), c.updateStatus);
r.post('/delete', authToken, authRoles(RoleEnum.Superadmin), c.delete);
r.post('/search', authToken, authRoles(RoleEnum.Personel), c.search);

export default r;