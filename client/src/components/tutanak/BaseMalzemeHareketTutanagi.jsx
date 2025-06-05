import { getTutanakBilgileri, getImzaAlanlari } from './Functions';
import { MalzemeHareketTutanagiHeader } from './Header';
import { MalzemeHareketTutanagiInfo } from './Info';
import { AciklamaMetni } from './AciklamaMetni';
import { Tablolar } from './Tablolar';
import { Imza } from './Imza';
import { forwardRef } from 'react';
// import { Altbilgi } from './Altbilgi';

const BaseMalzemeHareketTutanagi = forwardRef(({ selectedTutanak = null, className = '' }, ref) => {
  const hareketTuru = selectedTutanak?.hareketTuru || 'Zimmet';
  const tutanakNo = selectedTutanak?.id || '';
  const tarih = selectedTutanak?.islemTarihi ? new Date(selectedTutanak.islemTarihi).toLocaleDateString('tr-TR') : new Date().toLocaleDateString('tr-TR');
  const kaynakPersonel = selectedTutanak?.personelBilgileri?.kaynakPersonel || '';
  const hedefPersonel = selectedTutanak?.personelBilgileri?.hedefPersonel || '';
  const islemYapan = selectedTutanak?.createdBy || '';
  const malzemeler = selectedTutanak?.malzemeler || [];
  const tutanakBilgileri = getTutanakBilgileri(hareketTuru, malzemeler);
  const imzaAlanlari = getImzaAlanlari(hareketTuru, hedefPersonel, kaynakPersonel, islemYapan);
  const demirbasMalzemeler = malzemeler.filter(m => m.malzemeTipi === 'Demirbas');
  const sarfMalzemeler = malzemeler.filter(m => m.malzemeTipi === 'Sarf');

  return (
    <div style={{ position: 'relative', paddingBottom: '60px' }}>
      <div ref={ref} data-print-container className={`relative bg-white text-black h-[297mm] w-[210mm] mx-auto p-8 font-sans text-sm print:m-0 print:p-10 ${className}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
        <MalzemeHareketTutanagiHeader title={tutanakBilgileri.title} />
        <MalzemeHareketTutanagiInfo tutanakNo={tutanakNo} tarih={tarih} />
        <Tablolar malzemeler={malzemeler} demirbasMalzemeler={demirbasMalzemeler} sarfMalzemeler={sarfMalzemeler} />
        <AciklamaMetni aciklama={tutanakBilgileri.aciklama} />
        <Imza imzaAlanlari={imzaAlanlari} />
      </div>
    </div>
  );
});

export default BaseMalzemeHareketTutanagi;
