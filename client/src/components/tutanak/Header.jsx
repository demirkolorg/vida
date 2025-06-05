import baskanliklogo from '@/assets/logo/baskanlik-logo.png';
import illogo from '@/assets/logo/il-logo.png';

export const MalzemeHareketTutanagiHeader = ({title}) => {
  return (
    <div className="flex items-center justify-between mb-8 border-b-1 border-black pb-4">
      {/* Sol Logo */}
      <img src={baskanliklogo} alt="Logo" className="w-20 h-20 " />

      {/* Orta Başlık */}
      <div className="text-center flex-1">
        <div className="text-lg font-bold">T.C.</div>
        <div className="text-lg font-bold">ULAŞTIRMA VE ALTYAPI BAKANLIĞI</div>
        <div className="text-lg font-bold">HAVA MEYDANLARI İŞLETMESİ GENEL MÜDÜRLÜĞÜ</div>
        <div className="text-xl font-bold underline">{title}</div>
      </div>

      {/* Sağ Logo */}
      <img src={illogo} alt="Logo" className="w-20 h-20 " />
    </div>
  );
};
