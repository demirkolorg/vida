import AuditLogService from '../app/audit/service.js';

const success = (req, res, HizmetName, rota, message, data = {}) => {
  let createdById = req.user?.id === undefined ? null : req.user?.id;
  if (rota?.rota === 'login'){

    createdById = rota.userId;
    rota=rota.rota
  } 
  AuditLogService.success(createdById, HizmetName, rota, message);
  const count = Array.isArray(data) ? data.length : data ? 1 : 0;
  return res.status(200).json({ success: true, message, count, data });
};

const error = (req, res, HizmetName, rota, message, errors = {}, code = 500) => {
  let createdById = req.user?.id === undefined ? null : req.user?.id;
  AuditLogService.error(createdById, HizmetName, rota, errors);
  return res.status(code).json({ success: false, message, code, errors });
};
const response = { error, success };
export default response;
