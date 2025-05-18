// server/app/buro/message.js
import BaseMessages from '../../utils/BaseMessages.js';
import { HumanName } from './base.js';

const special = {
  success: {
    // Büro'ya özel başarılı işlem mesajları buraya eklenebilir
  },
  error: {
    subeGerekli: "Büronun bağlanacağı Şube ID'si zorunludur.",
    subeBulunamadi: "Belirtilen Şube ID'sine sahip aktif bir Şube bulunamadı.",
    amirBulunamadi: "Belirtilen Amir ID'sine sahip aktif bir Personel bulunamadı.",
    // Büro'ya özel hata mesajları buraya eklenebilir
  },
  info: {},
  warning: {},
};

const message = { ...BaseMessages(HumanName), ...special }; // BaseMessages'ı special ile genişletiyoruz
export default message;
