// server/app/globalSearch/router.js
import express from 'express';
const r = express.Router();
import c from './controller.js';
import { authToken, authRoles } from '../../middlewares/auth.js';
import { RoleEnum } from '@prisma/client';

// Health check - auth gerekmez
r.get('/health', c.health);

// Ana global search - tüm kullanıcılar erişebilir
r.post('/search', authToken, authRoles(RoleEnum.Personel, RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.globalSearch);

// Hızlı arama - tüm kullanıcılar erişebilir
r.post('/quick', authToken, authRoles(RoleEnum.Personel, RoleEnum.User, RoleEnum.Admin, RoleEnum.Superadmin), c.quickSearch);

export default r;