// server/app/database/message.js

import BaseMessages from '../../utils/BaseMessages.js';
import { HumanName } from './base.js';

const special = {
  success: {
    switch: `${HumanName} başarıyla değiştirildi`,
    test: `${HumanName} bağlantısı başarılı`,
    current: `Mevcut ${HumanName} bilgisi alındı`,
    status: `${HumanName} durumları alındı`,
  },
  error: {
    switch: `${HumanName} değiştirilemedi`,
    test: `${HumanName} bağlantısı başarısız`,
    current: `Mevcut ${HumanName} bilgisi alınamadı`,
    status: `${HumanName} durumları alınamadı`,
    notFound: `${HumanName} bulunamadı`,
    connectionFailed: `Veritabanı bağlantısı başarısız`,
    invalidConfig: `Geçersiz veritabanı konfigürasyonu`,
  },
  info: {},
  warning: {
    alreadyConnected: `Bu ${HumanName} zaten aktif`,
    fallbackUsed: `Varsayılan ${HumanName} kullanılıyor`,
  },
};

const message = { ...BaseMessages(HumanName), special };
export default message;