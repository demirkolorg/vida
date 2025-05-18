import express from 'express';
const r = express.Router();
import c from './controller.js';
import { authToken, authRoles } from '../../middlewares/auth.js';
import { RoleEnum } from '@prisma/client';

r.get('/health', c.health);
r.get('/getAll', authToken, authRoles(RoleEnum.Superadmin), c.getAll);
r.get('/getById', authToken, authRoles(RoleEnum.Superadmin), c.getById);
r.get('/getByBuroId', authToken, authRoles(RoleEnum.Superadmin), c.getByBuroId);
r.get('/getByRole', authToken, authRoles(RoleEnum.Superadmin), c.getByRole);
r.get('/getByIsUser', authToken, authRoles(RoleEnum.Superadmin), c.getByIsUser);
r.get('/getByIsAmir', authToken, authRoles(RoleEnum.Superadmin), c.getByIsAmir);
r.get('/create', authToken, authRoles(RoleEnum.Superadmin), c.create);
r.get('/update', authToken, authRoles(RoleEnum.Superadmin), c.update);
r.get('/updateStatus', authToken, authRoles(RoleEnum.Superadmin), c.updateStatus);
r.get('/delete', authToken, authRoles(RoleEnum.Superadmin), c.delete);
r.get('/search', authToken, authRoles(RoleEnum.Superadmin), c.search);

export default r;
