// server/app/sube/message.js
import BaseMessages from '../../utils/BaseMessages.js';
import { HumanName } from './base.js';

const special = {
  success: {
  },
  error: {
  },
  info: {},
  warning: {},
};

const message = { ...BaseMessages(HumanName), ...special }; // BaseMessages'ı special ile genişletiyoruz
export default message;
