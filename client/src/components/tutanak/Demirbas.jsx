import { sayiyiYaziyaCevir, getMalzemeBilgi } from './Functions';

export const DemirbasMalzemeTablo = ({ demirbasMalzemeler }) => {
  return (
    demirbasMalzemeler.length > 0 && (
      <div>
        <h3 className="text-lg font-bold mb-4 text-center">DEMİRBAŞ MALZEME LİSTESİ</h3>
        <table className="w-full border-collapse border border-black text-sm">
          <thead>
            <tr className="bg-primary/20">
              <th className="border border-black p-2 text-center w-12">S.N.</th>
              <th className="border border-black p-2 text-center">Vida No</th>
              <th className="border border-black p-2 text-center">Sabit Kodu</th>
              <th className="border border-black p-2 text-center">Marka</th>
              <th className="border border-black p-2 text-center">Model</th>
              <th className="border border-black p-2 text-center">Seri No</th>
              <th className="border border-black p-2 text-center">Kondisyon</th>
            </tr>
          </thead>
          <tbody>
            {demirbasMalzemeler.map((malzeme, index) => (
              <tr key={malzeme.id}>
                <td className="border border-black p-2 text-center">{index + 1}</td>
                <td className="border border-black p-2 font-mono text-center">{getMalzemeBilgi(malzeme, 'vidaNo')}</td>
                <td className="border border-black p-2 text-center">{getMalzemeBilgi(malzeme, 'sabitKodu')}</td>
                <td className="border border-black p-2 text-center">{getMalzemeBilgi(malzeme, 'marka')}</td>
                <td className="border border-black p-2 text-center">{getMalzemeBilgi(malzeme, 'model')}</td>
                <td className="border border-black p-2 font-mono text-xs text-center">{getMalzemeBilgi(malzeme, 'bademSeriNo')}</td>
                <td className="border border-black p-2 text-center">{getMalzemeBilgi(malzeme, 'kondisyon')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3 text-right text-sm">
          Toplam {sayiyiYaziyaCevir(demirbasMalzemeler.length).toLowerCase()} ({demirbasMalzemeler.length}) kalem demirbaş malzemedir.
        </div>
      </div>
    )
  );
};
