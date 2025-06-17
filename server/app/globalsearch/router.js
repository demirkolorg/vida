// server/app/globalSearch/router.js
import express from 'express';
const r = express.Router();
import c from './controller.js';
import { authToken, authRoles } from '../../middlewares/auth.js';
import { RoleEnum } from '@prisma/client';

r.get('/health', c.health);
r.post('/search', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.globalSearch);
r.post('/quick', authToken, authRoles(RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.quickSearch);

export default r;
