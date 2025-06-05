import { sayiyiYaziyaCevir, getMalzemeBilgi } from './Functions';

export const SarfMalzemeTablo = ({ sarfMalzemeler }) => {
  return (
    sarfMalzemeler.length > 0 && (
      <div>
        <h3 className="text-lg font-bold mb-2 text-center">SARF MALZEME LİSTESİ</h3>
        <table className="w-full border-collapse border border-black text-sm">
          <thead>
            <tr className="bg-primary/20">
              <th className="border border-black p-2 text-center w-12">S.N.</th>
              <th className="border border-black p-2 text-center">Vida No</th>
              <th className="border border-black p-2 text-center">Sabit Kodu</th>
              <th className="border border-black p-2 text-center">Marka</th>
              <th className="border border-black p-2 text-center">Model</th>
              <th className="border border-black p-2 text-center">Seri No</th>
            </tr>
          </thead>
          <tbody>
            {sarfMalzemeler.map((malzeme, index) => (
              <tr key={malzeme.id}>
                <td className="border border-black  text-center">{index + 1}</td>
                <td className="border border-black  font-mono text-center">{getMalzemeBilgi(malzeme, 'vidaNo')}</td>
                <td className="border border-black  text-center">{getMalzemeBilgi(malzeme, 'sabitKodu')}</td>
                <td className="border border-black  text-center">{getMalzemeBilgi(malzeme, 'marka')}</td>
                <td className="border border-black  text-center">{getMalzemeBilgi(malzeme, 'model')}</td>
                <td className="border border-black  font-mono text-xs text-center">{getMalzemeBilgi(malzeme, 'bademSeriNo')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-3 text-right text-sm">
          Toplam {sayiyiYaziyaCevir(sarfMalzemeler.length).toLowerCase()} ({sarfMalzemeler.length}) kalem demirbaş malzemedir.
        </div>
      </div>
    )
  );
};
