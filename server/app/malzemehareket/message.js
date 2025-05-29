// server/app/malzemeHareket/message.js
import BaseMessages from '../../utils/BaseMessages.js';
import { HumanName } from './base.js';

const special = {
  success: {
    zimmet: "Malzeme zimmet işlemi başarıyla tamamlandı.",
    iade: "Malzeme iade işlemi başarıyla tamamlandı.",
    devir: "Malzeme devir işlemi başarıyla tamamlandı.",
    depoTransfer: "Depo transfer işlemi başarıyla tamamlandı.",
    kayip: "Kayıp bildirimi başarıyla kaydedildi.",
    kondisyon: "Malzeme kondisyon güncelleme işlemi başarıyla tamamlandı.",
    malzemeGecmisi: "Malzeme geçmişi başarıyla getirildi.",
    personelZimmet: "Personel zimmet listesi başarıyla getirildi.",
    istatistik: "Hareket istatistikleri başarıyla getirildi.",
  },
  error: {
    zimmet: "Malzeme zimmet işlemi başarısız.",
    iade: "Malzeme iade işlemi başarısız.",
    devir: "Malzeme devir işlemi başarısız.",
    depoTransfer: "Depo transfer işlemi başarısız.",
    kayip: "Kayıp bildirimi kaydedilemedi.",
    kondisyon: "Malzeme kondisyon güncelleme işlemi başarısız.",
    malzemeGecmisi: "Malzeme geçmişi getirilemedi.",
    personelZimmet: "Personel zimmet listesi getirilemedi.",
    istatistik: "Hareket istatistikleri getirilemedi.",
    malzemeGerekli: "Malzeme ID'si zorunludur.",
    hareketTuruGerekli: "Hareket türü zorunludur.",
    kondisyonGerekli: "Malzeme kondisyonu zorunludur.",
    kaynakPersonelGerekli: "Kaynak personel ID'si zorunludur.",
    hedefPersonelGerekli: "Hedef personel ID'si zorunludur.",
    konumGerekli: "Konum ID'si zorunludur.",
  },
  info: {
    zimmetAciklama: "Malzeme zimmet işlemi için hedef personel belirtiniz.",
    iadeAciklama: "İade işlemi için kaynak personel bilgisi opsiyoneldir.",
    devirAciklama: "Devir işlemi için hem kaynak hem hedef personel gereklidir.",
    transferAciklama: "Transfer işlemi için hedef konum bilgisi gereklidir.",
    kayipAciklama: "Kayıp malzemeler otomatik olarak 'Hurda' kondisyonunda işaretlenir.",
  },
  warning: {
    kondisyonDegisimi: "Malzeme kondisyonu değiştirilmek üzere.",
    geriAlınamaz: "Bu işlem geri alınamaz. Devam etmek istediğinizden emin misiniz?",
    malzemeZimmetli: "Bu malzeme zaten başka bir personele zimmetli olabilir.",
  },
};

const message = { ...BaseMessages(HumanName), special };
export default message;