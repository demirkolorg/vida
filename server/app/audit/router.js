import express from 'express';
const r = express.Router();
import c from './controller.js';
import { authToken, authRoles } from '../../middlewares/auth.js';
import { RoleEnum } from '@prisma/client';

r.get('/health', c.health);
r.get('/getAll', c.getAllLogs);
r.post('/getByQuery', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.getByQuery);
r.get('/getById', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.getById);
r.get('/getByUserId', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.getByUserId);
r.get('/info', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.getLogsInfo);
r.get('/error', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.getLogsError);
r.get('/warning', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.getLogsWarning);
r.get('/success', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.getLogsSuccess);
r.get('/getLastRecord', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.getLastRecord);

export default r;