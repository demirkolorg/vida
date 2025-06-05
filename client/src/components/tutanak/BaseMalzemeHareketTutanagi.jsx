import { getTutanakBilgileri, getImzaAlanlari } from './Functions';
import { MalzemeHareketTutanagiHeader } from './Header';
import { MalzemeHareketTutanagiInfo } from './Info';
import { AciklamaMetni } from './AciklamaMetni';
import { Tablolar } from './Tablolar';
import { Imza } from './Imza';

const BaseMalzemeHareketTutanagi = ({ selectedTutanak = null, className = '',  }) => {
  const hareketTuru = selectedTutanak?.hareketTuru || 'Zimmet';
  const tutanakNo = selectedTutanak?.id || '';
  const tarih = selectedTutanak?.islemTarihi ? new Date(selectedTutanak.islemTarihi).toLocaleDateString('tr-TR') : new Date().toLocaleDateString('tr-TR');
  const kaynakPersonel = selectedTutanak?.personelBilgileri?.kaynakPersonel || '';
  const hedefPersonel = selectedTutanak?.personelBilgileri?.hedefPersonel || '';
  // const konum = selectedTutanak?.konumBilgileri || '';
  const islemYapan = selectedTutanak?.createdBy || '';
  const malzemeler = selectedTutanak?.malzemeler || [];
  const tutanakBilgileri = getTutanakBilgileri(hareketTuru, malzemeler);
  const imzaAlanlari = getImzaAlanlari(hareketTuru, hedefPersonel, kaynakPersonel, islemYapan);
  const demirbasMalzemeler = malzemeler.filter(m => m.malzemeTipi === 'Demirbas');
  const sarfMalzemeler = malzemeler.filter(m => m.malzemeTipi === 'Sarf');

  const handlePrint = () => {
    // Mevcut sayfayı yazdır - BaseMalzemeHareketTutanagi zaten print CSS'leri içeriyor
    window.print();
  };



  return (
    <div className={`bg-white text-black h-[297mm] w-[210mm] mx-auto p-8 font-sans text-sm leading-relaxed print:m-0 print:p-6 ${className}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
      <MalzemeHareketTutanagiHeader title={tutanakBilgileri.title} />
      <MalzemeHareketTutanagiInfo tutanakNo={tutanakNo} tarih={tarih} />
      <Tablolar malzemeler={malzemeler} demirbasMalzemeler={demirbasMalzemeler} sarfMalzemeler={sarfMalzemeler} />
      <AciklamaMetni aciklama={tutanakBilgileri.aciklama} />
      <Imza imzaAlanlari={imzaAlanlari} />

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .print\\:m-0 {
            margin: 0 !important;
          }
          .print\\:p-6 {
            padding: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BaseMalzemeHareketTutanagi;
