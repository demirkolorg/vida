// server/app/sube/message.js
import BaseMessages from '../../utils/BaseMessages.js';
import { HumanName } from './base.js';

const special = {
  success: {
    // Şube'ye özel başarılı işlem mesajları buraya eklenebilir
  },
  error: {
    birimGerekli: "Şubenin bağlanacağı Birim ID'si zorunludur.",
    birimBulunamadi: "Belirtilen Birim ID'sine sahip aktif bir Birim bulunamadı.",
    // Şube'ye özel hata mesajları buraya eklenebilir
  },
  info: {},
  warning: {},
};

const message = { ...BaseMessages(HumanName), ...special }; // BaseMessages'ı special ile genişletiyoruz
export default message;
