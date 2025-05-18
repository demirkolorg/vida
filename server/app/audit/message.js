// server/app/auditLog/message.js
import BaseMessages from '../../utils/BaseMessages.js';
import { HumanName } from './base.js';

const special = {
  error: {
    levelGerekli: "Log seviyesi (level) zorunludur.",
    logIcerikGerekli: "Log içeriği (log) zorunludur.",
    // AuditLog'a özel hata mesajları
  },
  info: {
    kayitBasarili: `${HumanName} başarıyla oluşturuldu.`
  }
};
const message = { ...BaseMessages(HumanName), ...special };
export default message;
