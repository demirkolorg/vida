import BaseMessages from '../../utils/BaseMessages.js';
import { HumanName } from './base.js';

const special = {
  success: {},
  error: {
    birimGerekli: "Malzemenin bağlanacağı Birim ID'si zorunludur.",
    subeGerekli: "Malzemenin bağlanacağı Şube ID'si zorunludur.",
    sabitKoduGerekli: "Malzemenin Sabit Kodu ID'si zorunludur.",
    markaGerekli: "Malzemenin Marka ID'si zorunludur.",
    modelGerekli: "Malzemenin Model ID'si zorunludur.",
    malzemeTipiGerekli: "Malzeme tipi (Demirbaş/Sarf) zorunludur.",
    birimBulunamadi: "Belirtilen Birim ID'sine sahip aktif bir Birim bulunamadı.",
    subeBulunamadi: "Belirtilen Şube ID'sine sahip aktif bir Şube bulunamadı.",
    sabitKoduBulunamadi: "Belirtilen Sabit Kodu ID'sine sahip aktif bir Sabit Kodu bulunamadı.",
    markaBulunamadi: "Belirtilen Marka ID'sine sahip aktif bir Marka bulunamadı.",
    modelBulunamadi: "Belirtilen Model ID'sine sahip aktif bir Model bulunamadı.",
    vidaNoMevcut: "Bu Vida No'ya sahip bir malzeme zaten mevcut.",
    stokDemirbasNoMevcut: "Bu Stok/Demirbaş No'ya sahip bir malzeme zaten mevcut.",
  },
  info: {},
  warning: {},
};

const message = { ...BaseMessages(HumanName), special };
export default message;