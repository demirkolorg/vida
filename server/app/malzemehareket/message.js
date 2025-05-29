// server/app/malzemeHareket/message.js
import BaseMessages from '../../utils/BaseMessages.js';
import { HumanName } from './base.js';

const special = {
  success: {
    kayit: 'Malzeme başarıyla sisteme kaydedildi.',
    zimmet: 'Malzeme başarıyla personele zimmetlendi.',
    iade: 'Malzeme başarıyla depoya iade edildi.',
    devir: 'Malzeme başarıyla personel devrini gerçekleştirildi.',
    depoTransferi: 'Malzeme başarıyla depo transferi yapıldı.',
    kondisyonGuncelleme: 'Malzeme kondisyonu başarıyla güncellendi.',
    kayip: 'Malzeme kayıp kaydı başarıyla oluşturuldu.',
    dusum: 'Malzeme düşüm kaydı başarıyla oluşturuldu.',
  },
  error: {
    malzemeGerekli: "Malzeme ID'si zorunludur.",
    malzemeBulunamadi: "Belirtilen Malzeme ID'sine sahip aktif bir Malzeme bulunamadı.",
    kaynakPersonelBulunamadi: "Belirtilen Kaynak Personel ID'sine sahip aktif bir Personel bulunamadı.",
    hedefPersonelBulunamadi: "Belirtilen Hedef Personel ID'sine sahip aktif bir Personel bulunamadı.",
    konumBulunamadi: "Belirtilen Konum ID'sine sahip aktif bir Konum bulunamadı.",
    hareketTuruGerekli: "Hareket türü zorunludur.",
    malzemeKondisyonuGerekli: "Malzeme kondisyonu zorunludur.",
    
    // İş kuralı hataları
    malzemeZatenPersonelde: "Bu malzeme zaten bir personelde bulunmakta, zimmet verilemez.",
    malzemeDepodaDegil: "Bu malzeme depoda değil, iade alınamaz.",
    malzemePersoneldeDegil: "Bu malzeme personelde değil, devir yapılamaz.",
    zimmetePersonelGerekli: "Zimmet işlemi için hedef personel belirtilmelidir.",
    iadeIcinKonumGerekli: "İade işlemi için konum belirtilmelidir.",
    devirIcinPersonellerGerekli: "Devir işlemi için kaynak ve hedef personel belirtilmelidir.",
    depoTransferiIcinKonumGerekli: "Depo transferi için hedef konum belirtilmelidir.",
  },
  info: {},
  warning: {
    malzemeKayip: "Bu malzeme kayıp olarak işaretlenmiştir.",
    malzemeDusulmus: "Bu malzeme düşüm yapılmıştır.",
  },
};

const message = { ...BaseMessages(HumanName), special };
export default message;