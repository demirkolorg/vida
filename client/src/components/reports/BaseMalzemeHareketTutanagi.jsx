import React from 'react';

const BaseMalzemeHareketTutanagi = ({ 
  children,
  hareketTuru = "Zimmet", // Zimmet, Iade, Devir
  tutanakNo = "",
  tarih = new Date().toLocaleDateString('tr-TR'),
  malzemeler = [], // Mock data için
  className = ""
}) => {
  
  // Mock data örneği
  const mockMalzemeler = malzemeler.length > 0 ? malzemeler : [
    {
      id: "1",
      vidaNo: "V2024-001",
      sabitKodu: "LAPTOP-DEL",
      marka: "DELL",
      model: "Latitude 7520",
      bademSeriNo: "DL123456789",
      malzemeTipi: "Demirbas",
      kondisyon: "Saglam"
    },
    {
      id: "2", 
      vidaNo: "V2024-002",
      sabitKodu: "MON-SAM",
      marka: "Samsung",
      model: "24 inch LED",
      bademSeriNo: "SM987654321",
      malzemeTipi: "Demirbas",
      kondisyon: "Saglam"
    },
    {
      id: "3",
      vidaNo: "V2024-003", 
      sabitKodu: "KEY-LOG",
      marka: "Logitech",
      model: "MX Keys",
      bademSeriNo: "LG456789123",
      malzemeTipi: "Sarf",
      kondisyon: "Saglam"
    },
    {
      id: "4",
      vidaNo: "V2024-004", 
      sabitKodu: "MSE-LOG",
      marka: "Logitech",
      model: "MX Master 3",
      bademSeriNo: "LG987654321",
      malzemeTipi: "Sarf",
      kondisyon: "Saglam"
    }
  ];

  // Hareket türüne göre başlık ve açıklama metni
  const getTutanakBilgileri = () => {
    switch (hareketTuru) {
      case "Zimmet":
        return {
          title: "MALZEME ZİMMET TUTANAĞI",
          aciklama: "Yukarıda belirtilen malzeme(ler) zimmet olarak teslim edilmiştir. Teslim alan personel, malzeme(lerin) sorumluluğunu kabul etmiş olup, herhangi bir kayıp, hasar veya kullanım hatası durumunda sorumlu tutulacaktır."
        };
      case "Iade":
        return {
          title: "MALZEME İADE TUTANAĞI",
          aciklama: "Yukarıda belirtilen malzeme(ler) zimmetli personel tarafından iade edilmiştir. İade edilen malzeme(lerin) durumu kontrol edilmiş ve kayda alınmıştır."
        };
      case "Devir":
        return {
          title: "MALZEME DEVİR TUTANAĞI",
          aciklama: "Yukarıda belirtilen malzeme(ler) bir personelden diğerine devredilmiştir. Devir işlemi tamamlanmış olup, malzeme sorumluluğu yeni personele geçmiştir."
        };
      default:
        return {
          title: "MALZEME HAREKET TUTANAĞI",
          aciklama: "Malzeme hareket işlemi gerçekleştirilmiştir."
        };
    }
  };

  // Hareket türüne göre imza alanları
  const getImzaAlanlari = () => {
    switch (hareketTuru) {
      case "Zimmet":
        return [
          { label: "TESLİM ALAN", field: "Ad Soyad / Sicil No" },
          { label: "", field: "", hidden: true },
          { label: "ONAYLAYAN", field: "Ad Soyad / Sicil No" }
        ];
      case "Iade":
        return [
          { label: "TESLİM EDEN", field: "Ad Soyad / Sicil No" },
          { label: "", field: "", hidden: true },
          { label: "ONAYLAYAN", field: "Ad Soyad / Sicil No" }
        ];
      case "Devir":
        return [
          { label: "TESLİM EDEN", field: "Ad Soyad / Sicil No" },
          { label: "TESLİM ALAN", field: "Ad Soyad / Sicil No" },
          { label: "ONAYLAYAN", field: "Ad Soyad / Sicil No" }
        ];
      default:
        return [
          { label: "HAZIRLAYAN", field: "Ad Soyad" },
          { label: "ONAYLAYAN", field: "Ad Soyad / Sicil No" },
          { label: "SORUMLU AMİR", field: "Ad Soyad" }
        ];
    }
  };

  const tutanakBilgileri = getTutanakBilgileri();
  const imzaAlanlari = getImzaAlanlari();

  // Sayıyı yazıya çeviren fonksiyon
  const sayiyiYaziyaCevir = (sayi) => {
    const sayilar = {
      0: "Sıfır", 1: "Bir", 2: "İki", 3: "Üç", 4: "Dört", 5: "Beş", 
      6: "Altı", 7: "Yedi", 8: "Sekiz", 9: "Dokuz", 10: "On",
      11: "On Bir", 12: "On İki", 13: "On Üç", 14: "On Dört", 15: "On Beş",
      16: "On Altı", 17: "On Yedi", 18: "On Sekiz", 19: "On Dokuz", 20: "Yirmi"
    };
    
    if (sayi <= 20) {
      return sayilar[sayi];
    } else if (sayi < 100) {
      const onlar = Math.floor(sayi / 10);
      const birler = sayi % 10;
      const onlarYazi = { 2: "Yirmi", 3: "Otuz", 4: "Kırk", 5: "Elli", 6: "Altmış", 7: "Yetmiş", 8: "Seksen", 9: "Doksan" };
      return onlarYazi[onlar] + (birler > 0 ? " " + sayilar[birler] : "");
    }
    return sayi.toString(); // 100'den büyük sayılar için rakamla döndür
  };

  // Malzemeleri tipine göre ayır
  const demirbasMalzemeler = mockMalzemeler.filter(m => m.malzemeTipi === 'Demirbas');
  const sarfMalzemeler = mockMalzemeler.filter(m => m.malzemeTipi === 'Sarf');

  return (
    <div className={`bg-white text-black min-h-[297mm] w-[210mm] mx-auto p-8 font-sans text-sm leading-relaxed print:m-0 print:p-6 ${className}`} style={{fontFamily: 'Poppins, sans-serif'}}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b-2 border-black pb-4">
        {/* Sol Logo */}
        <div className="w-20 h-20 bg-gray-200 border border-gray-400 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-16 h-16 text-gray-600">
            <circle cx="50" cy="50" r="40" fill="currentColor"/>
            <text x="50" y="55" textAnchor="middle" className="text-white text-xs font-bold">TC</text>
          </svg>
        </div>
        
        {/* Orta Başlık */}
        <div className="text-center flex-1 mx-8">
          <div className="text-lg font-bold mb-2">T.C.</div>
          <div className="text-lg font-bold mb-2">ULAŞTIRMA VE ALTYAPI BAKANLIĞI</div>
          <div className="text-base font-semibold mb-4">DEVLET HAVA MEYDANLARI İŞLETMESİ GENEL MÜDÜRLÜĞÜ</div>
          <div className="text-xl font-bold underline">{tutanakBilgileri.title}</div>
        </div>
        
        {/* Sağ Logo */}
        <div className="w-20 h-20 bg-gray-200 border border-gray-400 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-16 h-16 text-gray-600">
            <path d="M50 10 L90 90 L10 90 Z" fill="currentColor"/>
            <text x="50" y="75" textAnchor="middle" className="text-white text-xs font-bold">DHMİ</text>
          </svg>
        </div>
      </div>

      {/* Tutanak Bilgileri */}
      <div className="flex justify-between mb-6">
        <div className="flex items-center">
          <span className="font-semibold">Tutanak No:</span>
          <span className="ml-2 border-b border-black px-2 min-w-[120px] text-center">{tutanakNo}</span>
        </div>
        <div className="flex items-center">
          <span className="font-semibold">Tarih:</span>
          <span className="ml-2 border-b border-black px-2 min-w-[120px] text-center">{tarih}</span>
        </div>
      </div>

      {/* İçerik Alanı */}
      <div className="mb-8">
        {children ? children : (
          <div className="space-y-8">
            {/* DEMİRBAŞ MALZEMELER TABLOSU */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-center">DEMİRBAŞ MALZEMELER</h3>
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
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-3 text-right text-sm font-bold">
                <strong>Toplam Demirbaş:</strong> {sayiyiYaziyaCevir(demirbasMalzemeler.length)} ({demirbasMalzemeler.length}) adet
              </div>
            </div>

            {/* SARF MALZEMELER TABLOSU */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-center">SARF MALZEMELER</h3>
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
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-3 text-right text-sm font-bold">
                <strong>Toplam Sarf:</strong> {sayiyiYaziyaCevir(sarfMalzemeler.length)} ({sarfMalzemeler.length}) adet
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Açıklama Metni */}
      <div className="mb-6 text-justify">
        <p className="text-sm leading-relaxed">{tutanakBilgileri.aciklama}</p>
      </div>

      {/* Footer - İmza Alanları */}
      <div className="mt-auto pt-8">
        <div className="grid grid-cols-3 gap-8 text-center">
          {imzaAlanlari.map((alan, index) => (
            <div key={index} className={`space-y-2 ${alan.hidden ? 'invisible' : ''}`}>
              <div className="font-semibold">{alan.label}</div>
              <div className="h-16 border-b border-black"></div>
              <div className="text-xs">{alan.field}</div>
              <div className="text-xs">İmza</div>
            </div>
          ))}
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
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