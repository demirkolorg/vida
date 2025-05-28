import BaseMessages from '../../utils/BaseMessages.js';
import { HumanName } from './base.js';

const special = {
  success: {},
  error: {
    markaGerekli: "Modelin bağlanacağı Marka ID'si zorunludur.",
    markaBulunamadi: "Belirtilen Marka ID'sine sahip aktif bir Marka bulunamadı.",
    modelMarkaZatenVar: "Bu marka için aynı isimde bir model zaten mevcut.",
  },
  info: {},
  warning: {},
};

const message = { ...BaseMessages(HumanName), special };
export default message;