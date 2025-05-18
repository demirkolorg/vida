// server/app/malzeme/message.js
import BaseMessages from '../../utils/BaseMessages.js';
import { HumanName } from './base.js';

const special = {
  error: {
    birimGerekli: "Malzemenin bağlanacağı Birim (Kuvve) ID'si zorunludur.",
    birimBulunamadi: "Belirtilen Birim (Kuvve) ID'sine sahip aktif bir Birim bulunamadı.",
    subeGerekli: "Malzemenin bağlanacağı Şube ID'si zorunludur.",
    subeBulunamadi: "Belirtilen Şube ID'sine sahip aktif bir Şube bulunamadı.",
    sabitKoduGerekli: "Malzemenin Sabit Kodu (Kategorisi) ID'si zorunludur.",
    sabitKoduBulunamadi: "Belirtilen Sabit Kod ID'sine sahip aktif bir Sabit Kod bulunamadı.",
    markaGerekli: "Malzemenin Marka ID'si zorunludur.",
    markaBulunamadi: "Belirtilen Marka ID'sine sahip aktif bir Marka bulunamadı.",
    modelGerekli: "Malzemenin Model ID'si zorunludur.",
    modelBulunamadi: "Belirtilen Model ID'sine sahip aktif bir Model bulunamadı.",
    malzemeTipiGerekli: "Malzeme Tipi (Demirbaş/Sarf) belirtilmelidir.",
    gecersizMalzemeTipi: "Geçersiz Malzeme Tipi değeri.",
    aktifHareketVar: `Bu ${HumanName} silinemez çünkü ilişkili aktif Malzeme Hareketi bulunmaktadır.`,
    stokNoBenzersizDegil: "Bu Stok Demirbaş Numarası zaten kullanımda.",
    vidaNoBenzersizDegil: "Bu Vida Numarası zaten kullanımda.",
    // Malzeme'ye özel hata mesajları
  }
};
const message = { ...BaseMessages(HumanName), ...special };
export default message;
