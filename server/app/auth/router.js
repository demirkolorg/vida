import express from 'express';
const r = express.Router();
import c from './controller.js';
import { authToken, authRoles } from '../../middlewares/auth.js';
import { RoleEnum } from '@prisma/client';

r.post('/login', c.login);
r.post('/register', c.register);
r.post('/refreshAccessToken', c.refreshAccessToken);
r.post('/logout',authToken, c.logout);

export default r;
