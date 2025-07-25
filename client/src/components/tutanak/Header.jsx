import baskanliklogo from '@/assets/logo/baskanlik-logo.png';
import illogo from '@/assets/logo/il-logo.png';

export const MalzemeHareketTutanagiHeader = ({ title }) => {
  return (
    <div className="flex items-center justify-between mb-0 border-b-0 border-black pb-4">
      {/* Sol Logo */}
      <img src={baskanliklogo} alt="Logo" className="w-20 h-20 " />

      {/* Orta Başlık */}
      <div className="text-center flex-1 m-0 p-0">
        <div className="text-lg font-bold">İÇİŞLERİ BAKANLIĞI</div>
        {/* <div className="text-lg font-bold">HAVALİMANI BAŞKANLIĞI</div> */}
        <div className="text-lg font-bold">VAN HAVALİMANI ŞUBE MÜDÜRLÜĞÜ</div>
        <div className="text-lg font-bold">{title}</div>
      </div>

      {/* Sağ Logo */}
      <img src={illogo} alt="Logo" className="w-20 h-20 " />
    </div>
  );
};
