// server/app/database/router.js
import express from 'express';
const router = express.Router();
import * as controller from './controller.js';
import { authToken, authRoles } from '../../middlewares/auth.js';
import { RoleEnum } from '@prisma/client';

// Public endpoints (auth gerektirmez)
router.get('/health', controller.health);

// Authentication gerekli endpoints
router.get('/currentDb', authToken, controller.currentDb);
router.get('/current', authToken, controller.getCurrentDatabase);
router.get('/status', authToken, controller.getDatabaseStatuses);
router.get('/list', authToken, authRoles(RoleEnum.Admin, RoleEnum.Superadmin), controller.getDatabaseList);

// POST endpoints (Admin/Superadmin yetkisi gerekli)
router.post('/test', authToken, authRoles(RoleEnum.Admin, RoleEnum.Superadmin), controller.testConnection);
router.post('/switch', authToken, authRoles(RoleEnum.Admin, RoleEnum.Superadmin), controller.switchDatabase);
router.post('/refresh', authToken, authRoles(RoleEnum.Admin, RoleEnum.Superadmin), controller.refreshAllConnections);

export default router;