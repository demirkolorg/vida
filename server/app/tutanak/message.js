// server/src/services/tutanak/message.js

import BaseMessages from '../../utils/BaseMessages.js';
import { HumanName } from './base.js';

const special = {
  success: {
    generated: `${HumanName} başarıyla oluşturuldu.`,
    printed: `${HumanName} yazdırma işlemi tamamlandı.`,
    exported: `${HumanName} dışa aktarma işlemi tamamlandı.`,
  },
  error: {
    noMalzeme: 'Tutanak için malzeme bulunamadı.',
    noPersonel: 'Tutanak için personel bilgisi bulunamadı.',
    invalidHareketTuru: 'Geçersiz hareket türü.',
    generateFailed: `${HumanName} oluşturma işlemi başarısız.`,
    printFailed: `${HumanName} yazdırma işlemi başarısız.`,
    exportFailed: `${HumanName} dışa aktarma işlemi başarısız.`,
  },
  info: {
    processing: `${HumanName} işleniyor...`,
    ready: `${HumanName} hazır.`,
  },
  warning: {
    largeMalzemeList: 'Çok sayıda malzeme içeren tutanak sayfaları aşabilir.',
    missingInfo: 'Bazı bilgiler eksik, tutanak tamamlanmayabilir.',
  },
};

const message = { ...BaseMessages(HumanName), special };
export default message;