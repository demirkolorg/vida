import express from 'express';
const r = express.Router();
import c from './controller.js';
import { authToken, authRoles } from '../../middlewares/auth.js';
import { RoleEnum } from '@prisma/client';

r.get('/health', c.health);
r.get('/getMySettings', authToken, c.getMySettings);
r.put('/updateMySettings', authToken, c.updateMySettings);
r.post('/getByPersonelId', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.getByPersonelId);
r.get('/getAll', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.getAll);
r.post('/getByQuery', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.getByQuery);
r.post('/getById', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.getById);
r.post('/create', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.create);
r.post('/update', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.update);
r.post('/delete', authToken, authRoles(RoleEnum.Superadmin), c.delete);

export default r;
