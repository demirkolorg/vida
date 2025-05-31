import { HareketTuruEnum } from '@/app/malzemehareket/constants/hareketTuruEnum';


const tanimlar = anlamliSonHareket => {
  const hareketTuru = anlamliSonHareket?.hareketTuru || '';
  const malzemePersonelde = ['Zimmet', 'Devir'].includes(hareketTuru);
  const malzemeDepoda = ['Kayit', 'Iade', 'DepoTransferi'].includes(hareketTuru);
  const malzemeYok = ['Kayip', 'Dusum'].includes(hareketTuru);
  const malzemeKonumsuz = ['KondisyonGuncelleme'].includes(hareketTuru);
  return {
    malzemePersonelde,
    malzemeDepoda,
    malzemeYok,
    malzemeKonumsuz,
  };
};

const getAnlamliSonHareket = malzemeHareketleri => {
  if (!malzemeHareketleri || malzemeHareketleri.length === 0) return undefined;
  for (const hareket of malzemeHareketleri) {
    if (hareket.hareketTuru !== 'KondisyonGuncelleme') {
      return hareket;
    }
  }
  return undefined;
};

export const kayitUygun = item => {
  return !item?.malzemeHareketleri || item.malzemeHareketleri.length === 0 || item.malzemeHareketleri[0].hareketTuru === HareketTuruEnum.Kayip;
};

export const zimmetUygun = item => {
  const anlamliSonHareket = getAnlamliSonHareket(item?.malzemeHareketleri);
  if (!anlamliSonHareket) return false;
  const { malzemePersonelde, malzemeDepoda, malzemeYok } = tanimlar(anlamliSonHareket);
  if (malzemeDepoda) return true; // Sadece depodaysa zimmetlenebilir.
  if (malzemePersonelde || malzemeYok) return false;
  return false;
};

export const iadeUygun = item => {
  const anlamliSonHareket = getAnlamliSonHareket(item?.malzemeHareketleri);
  if (!anlamliSonHareket) return false;
  const { malzemePersonelde, malzemeDepoda, malzemeYok } = tanimlar(anlamliSonHareket);
  if (malzemePersonelde) return true;
  if (malzemeDepoda || malzemeYok) return false;
  return false;
};

export const devirUygun = item => {
  const anlamliSonHareket = getAnlamliSonHareket(item?.malzemeHareketleri);
  if (!anlamliSonHareket) return false;
  const { malzemePersonelde, malzemeDepoda, malzemeYok } = tanimlar(anlamliSonHareket);
  if (malzemePersonelde) return true;
  if (malzemeDepoda || malzemeYok) return false;
  return false;
};

export const depoTransferiUygun = item => {
  const anlamliSonHareket = getAnlamliSonHareket(item?.malzemeHareketleri);
  if (!anlamliSonHareket) return false;
  const { malzemePersonelde, malzemeDepoda, malzemeYok } = tanimlar(anlamliSonHareket);
  if (malzemeDepoda) return true;
  if (malzemePersonelde || malzemeYok || malzemeKonumsuz) return false;
  return false;
};

const genelIslemUygun = item => {
  if (!item?.malzemeHareketleri || item.malzemeHareketleri.length === 0) return false;
  const anlamliSonHareket = getAnlamliSonHareket(item.malzemeHareketleri);
  if (!anlamliSonHareket) return true;
  const { malzemeYok } = tanimlar(anlamliSonHareket);
  return !malzemeYok;
};

export const kondisyonGuncellemeUygun = item => {
  return genelIslemUygun(item);
};

export const kayipUygun = item => {
  return genelIslemUygun(item);
};

export const dusumUygun = item => {
  return genelIslemUygun(item);
};

export const sonHareketi = item => {
  // item'ın, item.malzemeHareketleri'nin var olduğundan
  // ve item.malzemeHareketleri'nin bir dizi olup boş olmadığından emin olun.
  if (item && item.malzemeHareketleri && Array.isArray(item.malzemeHareketleri) && item.malzemeHareketleri.length > 0) {
    return item.malzemeHareketleri[0];
  }
  return undefined; // Koşullar sağlanmıyorsa undefined dön, böylece çağıran kod bunu ele alabilir.
};

export const anlamliSonHareketi = item => {
  return getAnlamliSonHareket(item.malzemeHareketleri);
};

export const malzemePersonelde = item => {
  const anlamliSonHareket = getAnlamliSonHareket(item?.malzemeHareketleri);
  if (!anlamliSonHareket) return false;
  const { malzemePersonelde } = tanimlar(anlamliSonHareket);
  return malzemePersonelde;
};

export const malzemeDepoda = item => {
  const anlamliSonHareket = getAnlamliSonHareket(item?.malzemeHareketleri);
  if (!anlamliSonHareket) return false;
  const { malzemeDepoda } = tanimlar(anlamliSonHareket);
  return malzemeDepoda;
};

export const malzemeYok = item => {
  const anlamliSonHareket = getAnlamliSonHareket(item?.malzemeHareketleri);
  if (!anlamliSonHareket) return false;
  const { malzemeYok } = tanimlar(anlamliSonHareket);
  return malzemeYok;
};
