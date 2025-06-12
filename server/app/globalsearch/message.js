// server/app/globalSearch/message.js
import BaseMessages from '../../utils/BaseMessages.js';
import { HumanName } from './base.js';

const special = {
  success: {
    searchCompleted: 'Arama başarıyla tamamlandı.',
    entitiesFound: (count, entities) => `${count} farklı kategoride toplam ${entities} sonuç bulundu.`,
    noResults: 'Arama kriteri için sonuç bulunamadı.',
  },
  error: {
    invalidQuery: 'Arama terimi en az 2 karakter olmalıdır.',
    queryRequired: 'Arama terimi zorunludur.',
    entityTypeInvalid: 'Geçersiz entity tipi belirtildi.',
    searchFailed: 'Arama işlemi sırasında bir hata oluştu.',
  },
  info: {
    searchStarted: 'Arama işlemi başlatıldı.',
    limitApplied: (limit) => `Sonuçlar ${limit} ile sınırlandırıldı.`,
  },
  warning: {
    partialResults: 'Bazı kategorilerde arama yapılamadı.',
    slowQuery: 'Arama işlemi beklenenden uzun sürdü.',
  },
};

const message = { ...BaseMessages(HumanName), special };
export default message;