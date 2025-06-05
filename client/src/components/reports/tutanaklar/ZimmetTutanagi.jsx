// client/src/components/reports/tutanaklar/ZimmetTutanagi.jsx
import React from 'react';
import BaseMalzemeHareketTutanagi from '../BaseMalzemeHareketTutanagi';

const ZimmetTutanagi = ({ tutanakData, className = '' }) => {
  const { malzemeler, personelBilgileri, islemBilgileri, tutanakNo, isBulk } = tutanakData;

  // Zimmet için özel malzeme formatı
  const formatZimmetMalzemeler = () => {
    return malzemeler.map(malzeme => ({
      ...malzeme,
      kondisyon: islemBilgileri.kondisyon || malzeme.kondisyon || 'Saglam',
    }));
  };

  // Zimmet için özel içerik
  const ZimmetContent = () => {
    const formattedMalzemeler = formatZimmetMalzemeler();
    const demirbasMalzemeler = formattedMalzemeler.filter(m => m.malzemeTipi === 'Demirbas');
    const sarfMalzemeler = formattedMalzemeler.filter(m => m.malzemeTipi === 'Sarf');
    const hedefPersonel = personelBilgileri.hedefPersonel;

    // Sayıyı yazıya çeviren fonksiyon
    const sayiyiYaziyaCevir = sayi => {
      const sayilar = {
        0: 'Sıfır',
        1: 'Bir',
        2: 'İki',
        3: 'Üç',
        4: 'Dört',
        5: 'Beş',
        6: 'Altı',
        7: 'Yedi',
        8: 'Sekiz',
        9: 'Dokuz',
        10: 'On',
        11: 'On Bir',
        12: 'On İki',
        13: 'On Üç',
        14: 'On Dört',
        15: 'On Beş',
        16: 'On Altı',
        17: 'On Yedi',
        18: 'On Sekiz',
        19: 'On Dokuz',
        20: 'Yirmi',
      };

      if (sayi <= 20) {
        return sayilar[sayi];
      } else if (sayi < 100) {
        const onlar = Math.floor(sayi / 10);
        const birler = sayi % 10;
        const onlarYazi = { 2: 'Yirmi', 3: 'Otuz', 4: 'Kırk', 5: 'Elli', 6: 'Altmış', 7: 'Yetmiş', 8: 'Seksen', 9: 'Doksan' };
        return onlarYazi[onlar] + (birler > 0 ? ' ' + sayilar[birler] : '');
      }
      return sayi.toString();
    };

    return (
      <div className="space-y-8">
        {/* ZİMMET BİLGİLERİ BÖLÜMÜ */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-bold mb-4 text-center text-blue-800">ZİMMET BİLGİLERİ</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold">Teslim Alan Personel:</span>
              <div className="mt-1 p-2 bg-white border rounded">
                <div className="font-medium">{hedefPersonel?.ad || hedefPersonel?.adSoyad || 'Belirtilmemiş'}</div>
                <div className="text-xs text-gray-600">Sicil No: {hedefPersonel?.sicil || 'Belirtilmemiş'}</div>
                {hedefPersonel?.buro?.ad && <div className="text-xs text-gray-600">Büro: {hedefPersonel.buro.ad}</div>}
              </div>
            </div>
            <div>
              <span className="font-semibold">Zimmet Detayları:</span>
              <div className="mt-1 p-2 bg-white border rounded">
                <div className="text-sm">
                  <div>Tarih: {islemBilgileri.tarih}</div>
                  <div>Saat: {islemBilgileri.saat}</div>
                  <div>Kondisyon: {islemBilgileri.kondisyon}</div>
                  {isBulk && <div className="text-blue-600 font-medium">Toplu Zimmet İşlemi</div>}
                </div>
              </div>
            </div>
          </div>

          {islemBilgileri.aciklama && (
            <div className="mt-4">
              <span className="font-semibold">İşlem Açıklaması:</span>
              <div className="mt-1 p-2 bg-white border rounded text-sm">{islemBilgileri.aciklama}</div>
            </div>
          )}
        </div>

        {/* DEMİRBAŞ MALZEMELER TABLOSU */}
        {demirbasMalzemeler.length > 0 && (
          <div>
            <h3 className="text-lg font-bold mb-4 text-center">ZİMMET VERİLEN DEMİRBAŞ MALZEMELER</h3>
            <table className="w-full border-collapse border border-black text-sm">
              <thead>
                <tr className="bg-blue-500 bg-opacity-20">
                  <th className="border border-black p-2 text-center w-12">S.N.</th>
                  <th className="border border-black p-2 text-center">Vida No</th>
                  <th className="border border-black p-2 text-center">Sabit Kodu</th>
                  <th className="border border-black p-2 text-center">Marka</th>
                  <th className="border border-black p-2 text-center">Model</th>
                  <th className="border border-black p-2 text-center">Seri No</th>
                  <th className="border border-black p-2 text-center">Kondisyon</th>
                  <th className="border border-black p-2 text-center">Zimmet Durumu</th>
                </tr>
              </thead>
              <tbody>
                {demirbasMalzemeler.map((malzeme, index) => (
                  <tr key={malzeme.id}>
                    <td className="border border-black p-2 text-center">{index + 1}</td>
                    <td className="border border-black p-2 font-mono text-center">{malzeme.vidaNo}</td>
                    <td className="border border-black p-2 text-center">{malzeme.sabitKodu}</td>
                    <td className="border border-black p-2 text-center">{malzeme.marka}</td>
                    <td className="border border-black p-2 text-center">{malzeme.model}</td>
                    <td className="border border-black p-2 font-mono text-xs text-center">{malzeme.bademSeriNo}</td>
                    <td className="border border-black p-2 text-center">{malzeme.kondisyon}</td>
                    <td className="border border-black p-2 text-center font-medium text-blue-600">ZİMMETLİ</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-3 text-right text-sm font-bold">
              <strong>Toplam Demirbaş:</strong> {sayiyiYaziyaCevir(demirbasMalzemeler.length)} ({demirbasMalzemeler.length}) adet
            </div>
          </div>
        )}

        {/* SARF MALZEMELER TABLOSU */}
        {sarfMalzemeler.length > 0 && (
          <div>
            <h3 className="text-lg font-bold mb-4 text-center">ZİMMET VERİLEN SARF MALZEMELER</h3>
            <table className="w-full border-collapse border border-black text-sm">
              <thead>
                <tr className="bg-blue-500 bg-opacity-20">
                  <th className="border border-black p-2 text-center w-12">S.N.</th>
                  <th className="border border-black p-2 text-center">Vida No</th>
                  <th className="border border-black p-2 text-center">Sabit Kodu</th>
                  <th className="border border-black p-2 text-center">Marka</th>
                  <th className="border border-black p-2 text-center">Model</th>
                  <th className="border border-black p-2 text-center">Seri No</th>
                  <th className="border border-black p-2 text-center">Kondisyon</th>
                  <th className="border border-black p-2 text-center">Zimmet Durumu</th>
                </tr>
              </thead>
              <tbody>
                {sarfMalzemeler.map((malzeme, index) => (
                  <tr key={malzeme.id}>
                    <td className="border border-black p-2 text-center">{index + 1}</td>
                    <td className="border border-black p-2 font-mono text-center">{malzeme.vidaNo}</td>
                    <td className="border border-black p-2 text-center">{malzeme.sabitKodu}</td>
                    <td className="border border-black p-2 text-center">{malzeme.marka}</td>
                    <td className="border border-black p-2 text-center">{malzeme.model}</td>
                    <td className="border border-black p-2 font-mono text-xs text-center">{malzeme.bademSeriNo}</td>
                    <td className="border border-black p-2 text-center">{malzeme.kondisyon}</td>
                    <td className="border border-black p-2 text-center font-medium text-blue-600">ZİMMETLİ</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-3 text-right text-sm font-bold">
              <strong>Toplam Sarf:</strong> {sayiyiYaziyaCevir(sarfMalzemeler.length)} ({sarfMalzemeler.length}) adet
            </div>
          </div>
        )}

        {/* TOPLAM BİLGİLER */}
        <div className="mt-6 p-4 bg-gray-50 border rounded-lg">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>GENEL TOPLAM:</span>
            <span className="text-blue-600">
              {sayiyiYaziyaCevir(formattedMalzemeler.length)} ({formattedMalzemeler.length}) Adet Malzeme
            </span>
          </div>
          {isBulk && <div className="mt-2 text-sm text-gray-600">Bu tutanak {formattedMalzemeler.length} adet malzemenin toplu zimmet işlemini kapsamaktadır.</div>}
        </div>

        {/* ZİMMET SORUMLULUK METNİ */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-bold text-center mb-3 text-yellow-800">ZİMMET SORUMLULUK BİLDİRİMİ</h4>
          <div className="text-sm text-justify leading-relaxed space-y-2">
            <p>
              <strong>1.</strong> Yukarıda belirtilen malzeme(ler) <strong>{hedefPersonel?.ad || 'belirtilen personel'}</strong>
              adına zimmet olarak teslim edilmiştir.
            </p>
            <p>
              <strong>2.</strong> Teslim alan personel, malzeme(lerin) tam sorumluluğunu kabul etmiş olup, herhangi bir kayıp, hasar, yanlış kullanım veya bakım eksikliği durumunda
              <strong> tam sorumluluğu kendisine aittir.</strong>
            </p>
            <p>
              <strong>3.</strong> Zimmetli malzemeler sadece resmi işlerde kullanılacak olup, şahsi kullanım kesinlikle yasaktır.
            </p>
            <p>
              <strong>4.</strong> Malzeme(lerin) görev değişikliği, izin, emeklilik vb. durumlarda iade edilmesi zorunludur.
            </p>
            <p>
              <strong>5.</strong> Bu tutanak {islemBilgileri.tarih} tarihinde düzenlenmiş olup, malzeme teslim işlemi tamamlanmıştır.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <BaseMalzemeHareketTutanagi
      hareketTuru="Zimmet"
      tutanakNo={tutanakNo}
      tarih={islemBilgileri.tarih}
      malzemeler={[]} // Boş array gönder, custom content kullanıyoruz
      className={className}
    >
      <ZimmetContent />
    </BaseMalzemeHareketTutanagi>
  );
};

export default ZimmetTutanagi;
