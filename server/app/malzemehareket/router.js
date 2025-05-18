import express from 'express';
const r = express.Router();
import c from './controller.js';
import { authToken, authRoles } from '../../middlewares/auth.js';
import { RoleEnum } from '@prisma/client';

r.get('/health', c.health);
r.get('/getAll', authToken, authRoles(RoleEnum.Superadmin), c.getAll);
r.get('/getAllQuery', authToken, authRoles(RoleEnum.Superadmin), c.getAllQuery);
r.post('/getById', authToken, authRoles(RoleEnum.Superadmin), c.getById);
r.post('/getByMalzemeId', authToken, authRoles(RoleEnum.Superadmin), c.getByMalzemeId);
r.post('/getByKaynakPersonelId', authToken, authRoles(RoleEnum.Superadmin), c.getByKaynakPersonelId);
r.post('/getByHedefPersonelId', authToken, authRoles(RoleEnum.Superadmin), c.getByHedefPersonelId);
r.post('/getByCreatedPersonelId', authToken, authRoles(RoleEnum.Superadmin), c.getByCreatedPersonelId);
r.post('/getByKonumId', authToken, authRoles(RoleEnum.Superadmin), c.getByKonumId);
r.post('/kayitYap', authToken, authRoles(RoleEnum.Superadmin), c.kayitYap);
r.post('/zimmetYap', authToken, authRoles(RoleEnum.Superadmin), c.zimmetYap);
r.post('/iadeAl', authToken, authRoles(RoleEnum.Superadmin), c.iadeAl);
r.post('/devirYap', authToken, authRoles(RoleEnum.Superadmin), c.devirYap);
r.post('/kayipBildir', authToken, authRoles(RoleEnum.Superadmin), c.kayipBildir);
r.post('/kondisyonGuncelle', authToken, authRoles(RoleEnum.Superadmin), c.kondisyonGuncelle);
r.post('/depoTransferiYap', authToken, authRoles(RoleEnum.Superadmin), c.depoTransferiYap);
r.post('/dusumYap', authToken, authRoles(RoleEnum.Superadmin), c.dusumYap);
r.post('/delete', authToken, authRoles(RoleEnum.Superadmin), c.delete);
r.post('/search', authToken, authRoles(RoleEnum.Superadmin), c.search);

export default r;
