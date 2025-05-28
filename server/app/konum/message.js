import BaseMessages from '../../utils/BaseMessages.js';
import { HumanName } from './base.js';

const special = {
  success: {},
  error: {
    depoGerekli: "Konumun bağlanacağı Depo ID'si zorunludur.",
    depoBulunamadi: "Belirtilen Depo ID'sine sahip aktif bir Depo bulunamadı.",
  },
  info: {},
  warning: {},
};

const message = { ...BaseMessages(HumanName), special };
export default message;