import express from 'express';
const router = express.Router();
import c from './controller.js';
import { authToken, authRoles } from '../../middlewares/auth.js';

router.get('/health', c.health);
router.get('/getAll', c.getAllLogs);
router.get('/getById', authToken, authRoles('SuperAdmin'), c.getById);
router.get('/getByUserId', authToken, authRoles('SuperAdmin'), c.getByUserId);
router.get('/info', authToken, authRoles('SuperAdmin'), c.getLogsInfo);
router.get('/error', authToken, authRoles('SuperAdmin'), c.getLogsError);
router.get('/warning', authToken, authRoles('SuperAdmin'), c.getLogsWarning);
router.get('/success', authToken, authRoles('SuperAdmin'), c.getLogsSuccess);
router.get('/getLastRecord', authToken, authRoles('SuperAdmin'), c.getLastRecord);

export default router;
