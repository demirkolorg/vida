import { HareketTuruEnum as EntityEnum } from '@prisma/client';

// enum HareketTuruEnum {
//   Kayit //malzeme depoda
//   Zimmet //malzeme personel
//   Iade //malzeme depoda
//   Devir //malzeme personel
//   DepoTransferi //malzeme depoda
//   KondisyonGuncelleme //belli değil
//   Kayip //belli değil
//   Dusum //belli değil
// }

export const HareketTuruEnum = EntityEnum;

export const hareketTuruLabels = {
  Kayit: 'Kayıt',
  Zimmet: 'Zimmet',
  Iade: 'İade',
  Devir: 'Devir',
  DepoTransferi: 'Depo Transferi',
  KondisyonGuncelleme: 'Kondisyon Guncelleme',
  Kayip: 'Kayıp',
  Dusum: 'Düşüm',
};

export const hareketTuruOptions = Object.values(HareketTuruEnum).map(val => ({
  label: hareketTuruLabels[val],
  value: val,
}));
