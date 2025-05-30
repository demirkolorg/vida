import { MalzemeKondisyonuEnum  as EntityEnum} from '@prisma/client';

export const MalzemeKondisyonuEnum = EntityEnum;
export const malzemeKondisyonuOptions = Object.values(MalzemeKondisyonuEnum).map(val => ({
  label: val,
  value: val,
}));
