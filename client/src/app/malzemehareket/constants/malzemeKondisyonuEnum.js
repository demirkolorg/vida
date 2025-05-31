import { MalzemeKondisyonuEnum as EntityEnum } from '@prisma/client';

export const MalzemeKondisyonuEnum = EntityEnum;

export const malzemeKondisyonuLabels = {
  Saglam: 'Sağlam',
  Arizali: 'Arızalı',
  Hurda: 'Hurda',
  Kayip: 'Kayıp',
  Dusum: 'Düşüm',
};

export const malzemeKondisyonuOptions = Object.values(MalzemeKondisyonuEnum).map(val => ({
  label: malzemeKondisyonuLabels[val],
  value: val,
}));
