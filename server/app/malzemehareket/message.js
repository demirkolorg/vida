// server/app/malzemeHareket/message.js
import BaseMessages from '../../utils/BaseMessages.js';
import { HumanName } from './base.js';

const special = {
  error: {
    malzemeGerekli: "Hareket için Malzeme ID'si zorunludur.",
    malzemeBulunamadi: "Belirtilen Malzeme ID'sine sahip aktif bir Malzeme bulunamadı.",
    personelBulunamadi: "Belirtilen Personel ID'sine sahip aktif bir Personel bulunamadı.", // Kaynak veya Hedef için
    konumBulunamadi: "Belirtilen Konum ID'sine sahip aktif bir Konum bulunamadı.",
    hareketTuruGerekli: "Hareket Türü belirtilmelidir.",
    gecersizHareketTuru: "Geçersiz Hareket Türü değeri.",
    kondisyonGerekli: "Malzeme Kondisyonu belirtilmelidir.",
    gecersizKondisyon: "Geçersiz Malzeme Kondisyonu değeri.",
    islemTarihiGerekli: "İşlem Tarihi zorunludur.",
    // MalzemeHareket'e özel hata mesajları
  }
};
const message = { ...BaseMessages(HumanName), ...special };
export default message;
