export const sayiyiYaziyaCevir = sayi => {
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
  return sayi.toString(); // 100'den büyük sayılar için rakamla döndür
};

// Hareket türüne göre başlık ve açıklama metni
export const getTutanakBilgileri = (hareketTuru, mockMalzemeler) => {
  switch (hareketTuru) {
    case 'Zimmet':
      return {
        title: 'MALZEME ZİMMET TUTANAĞI',
        aciklama: `Yukarıdaki tabloda stok kodu, marka, model ve seri numaraları belirtilen ${sayiyiYaziyaCevir(mockMalzemeler.length).toLowerCase()} (${mockMalzemeler.length}) adet malzeme tam ve sağlam olarak teslim edilmiştir. Teslim alan personel, malzemelerin sorumluluğunu kabul etmiş olup, herhangi bir kayıp, hasar veya kullanım hatası durumunda sorumlu tutulacaktır.`,
      };
    case 'Iade':
      return {
        title: 'MALZEME İADE TUTANAĞI',
        aciklama: `Yukarıdaki tabloda stok kodu, marka, model ve seri numaraları belirtilen ${sayiyiYaziyaCevir(mockMalzemeler.length).toLowerCase()} (${mockMalzemeler.length}) adet malzeme zimmetli personel tarafından iade edilmiştir. İade edilen malzemelerin durumu kontrol edilmiş ve kayda alınmıştır.`,
      };
    case 'Devir':
      return {
        title: 'MALZEME DEVİR TUTANAĞI',
        aciklama: `Yukarıdaki tabloda stok kodu, marka, model ve seri numaraları belirtilen ${sayiyiYaziyaCevir(mockMalzemeler.length).toLowerCase()} (${mockMalzemeler.length}) adet malzeme bir personelden diğerine devredilmiştir. Devir işlemi tamamlanmış olup, malzeme sorumluluğu yeni personele geçmiştir.`,
      };
    case 'DepoTransferi':
      return {
        title: 'MALZEME DEPO TRANSFERİ TUTANAĞI',
        aciklama: `Yukarıdaki tabloda stok kodu, marka, model ve seri numaraları belirtilen ${sayiyiYaziyaCevir(mockMalzemeler.length).toLowerCase()} (${mockMalzemeler.length}) adet malzeme depo transferi yapılmıştır. Transfer işlemi tamamlanmış olup, malzemeler yeni konumlarına nakledilmiştir.`,
      };
    case 'KondisyonGuncelleme':
      return {
        title: 'MALZEME KONDİSYON GÜNCELLEME TUTANAĞI',
        aciklama: `Yukarıdaki tabloda stok kodu, marka, model ve seri numaraları belirtilen ${sayiyiYaziyaCevir(mockMalzemeler.length).toLowerCase()} (${mockMalzemeler.length}) adet malzemenin kondisyon bilgileri güncellenmiştir. Kondisyon değişiklikleri kayda alınmış ve gerekli işlemler tamamlanmıştır.`,
      };
    case 'Kayip':
      return {
        title: 'MALZEME KAYIP TUTANAĞI',
        aciklama: `Yukarıdaki tabloda stok kodu, marka, model ve seri numaraları belirtilen ${sayiyiYaziyaCevir(mockMalzemeler.length).toLowerCase()} (${mockMalzemeler.length}) adet malzeme kayıp olarak kayıtlara geçmiştir. Kayıp işlemi tamamlanmış olup, gerekli prosedürler uygulanmıştır.`,
      };
    case 'Dusum':
      return {
        title: 'MALZEME DÜŞÜM TUTANAĞI',
        aciklama: `Yukarıdaki tabloda stok kodu, marka, model ve seri numaraları belirtilen ${sayiyiYaziyaCevir(mockMalzemeler.length).toLowerCase()} (${mockMalzemeler.length}) adet malzeme düşüm işlemi yapılmıştır. Düşüm işlemi tamamlanmış olup, malzemeler kayıtlardan çıkarılmıştır.`,
      };
    case 'Kayit':
      return {
        title: 'MALZEME KAYIT TUTANAĞI',
        aciklama: `Yukarıdaki tabloda stok kodu, marka, model ve seri numaraları belirtilen ${sayiyiYaziyaCevir(mockMalzemeler.length).toLowerCase()} (${mockMalzemeler.length}) adet malzeme sisteme kayıt edilmiştir. Kayıt işlemi tamamlanmış olup, malzemeler envantere eklenmiştir.`,
      };
    case 'ZimmetBilgilendirme':
      return {
        title: 'PERSONEL ZİMMET TEBLİĞ TEBELLÜĞ TUTANAĞI',
        aciklama: `Yukarıdaki tabloda stok kodu, marka, model ve seri numaraları belirtilen ${sayiyiYaziyaCevir(mockMalzemeler.length).toLowerCase()} (${mockMalzemeler.length}) adet malzeme ilgili personelin zimmet ve sorumluluğunda bulunmaktadır. Bu tutanak, personelin zimmetinde olan tüm malzemelerin güncel durumunu göstermek amacıyla düzenlenmiştir. Personel, listede yer alan tüm malzemelerin sorumluluğunu taşımakta olup, herhangi bir kayıp, hasar veya eksiklik durumunda sorumlu tutulacaktır. Bu belge bilgilendirme amaçlı olup, mevcut zimmet durumunun teyidi niteliğindedir.`,
      };
    default:
      return {
        title: 'MALZEME HAREKET TUTANAĞI',
        aciklama: `Yukarıdaki tabloda stok kodu, marka, model ve seri numaraları belirtilen ${sayiyiYaziyaCevir(mockMalzemeler.length).toLowerCase()} (${mockMalzemeler.length}) adet malzeme için hareket işlemi gerçekleştirilmiştir.`,
      };
  }
};

// Personel bilgilerini formatla
export const formatPersonel = personel => {
  if (!personel) return '';
  const ad = personel.ad;
  const soyad = personel.soyad;
  const adSoyad = `${ad} ${soyad}`;
  const sicil = personel.sicil || '';

  return (
    <div>
      <p>{adSoyad}</p>
      <p>{sicil}</p>
    </div>
  );
};

// Hareket türüne göre imza alanları ve personel bilgileri
export const getImzaAlanlari = (hareketTuru, hedefPersonel, kaynakPersonel, islemYapan) => {
  switch (hareketTuru) {
     case 'ZimmetBilgilendirme':
      return [
        {
          label: 'TEBELLÜĞ EDEN',
          field: 'Ad Soyad / Sicil No',
          personel: hedefPersonel, // Zimmet alan personel
          name: formatPersonel(hedefPersonel),
        },
        {
          label: '',
          field: '',
          hidden: true,
        },
        {
          label: 'TEBLİĞ EDEN',
          field: 'Ad Soyad / Sicil No',
          personel: islemYapan, // İşlemi onaylayan
          name: formatPersonel(islemYapan),
        },
      ];
    case 'Zimmet':
      return [
        {
          label: 'TESLİM ALAN',
          field: 'Ad Soyad / Sicil No',
          personel: hedefPersonel, // Zimmet alan personel
          name: formatPersonel(hedefPersonel),
        },
        {
          label: '',
          field: '',
          hidden: true,
        },
        {
          label: 'ONAYLAYAN',
          field: 'Ad Soyad / Sicil No',
          personel: islemYapan, // İşlemi onaylayan
          name: formatPersonel(islemYapan),
        },
      ];
    case 'Iade':
      return [
        {
          label: 'TESLİM EDEN',
          field: 'Ad Soyad / Sicil No',
          personel: kaynakPersonel, // İade eden personel
          name: formatPersonel(kaynakPersonel),
        },
        {
          label: '',
          field: '',
          hidden: true,
        },
        {
          label: 'ONAYLAYAN',
          field: 'Ad Soyad / Sicil No',
          personel: islemYapan, // İşlemi onaylayan
          name: formatPersonel(islemYapan),
        },
      ];
    case 'Devir':
      return [
        {
          label: 'TESLİM EDEN',
          field: 'Ad Soyad / Sicil No',
          personel: kaynakPersonel, // Devir eden personel
          name: formatPersonel(kaynakPersonel),
        },
        {
          label: 'TESLİM ALAN',
          field: 'Ad Soyad / Sicil No',
          personel: hedefPersonel, // Devir alan personel
          name: formatPersonel(hedefPersonel),
        },
        {
          label: 'ONAYLAYAN',
          field: 'Ad Soyad / Sicil No',
          personel: islemYapan, // İşlemi onaylayan
          name: formatPersonel(islemYapan),
        },
      ];
    case 'DepoTransferi':
      return [
        {
          label: 'HAZIRLAYAN',
          field: 'Ad Soyad / Sicil No',
          personel: islemYapan, // Transfer hazırlayan
          name: formatPersonel(islemYapan),
        },
        {
          label: 'KONTROL EDEN',
          field: 'Ad Soyad / Sicil No',
          personel: null, // Bu bilgi selectedTutanak'ta yok, boş bırakılabilir
          name: '',
        },
        {
          label: 'ONAYLAYAN',
          field: 'Ad Soyad / Sicil No',
          personel: islemYapan?.amir || null, // Amiri veya yetkili kişi
          name: formatPersonel(islemYapan?.amir),
        },
      ];
    case 'KondisyonGuncelleme':
      return [
        {
          label: 'KONTROL EDEN',
          field: 'Ad Soyad / Sicil No',
          personel: islemYapan, // Kondisyon kontrol eden
          name: formatPersonel(islemYapan),
        },
        {
          label: '',
          field: '',
          hidden: true,
        },
        {
          label: 'ONAYLAYAN',
          field: 'Ad Soyad / Sicil No',
          personel: islemYapan?.amir || null, // Amiri veya yetkili kişi
          name: formatPersonel(islemYapan?.amir),
        },
      ];
    case 'Kayip':
    case 'Dusum':
      return [
        {
          label: 'HAZIRLAYAN',
          field: 'Ad Soyad / Sicil No',
          personel: islemYapan, // İşlemi hazırlayan
          name: formatPersonel(islemYapan),
        },
        {
          label: 'KONTROL EDEN',
          field: 'Ad Soyad / Sicil No',
          personel: null, // Bu bilgi selectedTutanak'ta yok
          name: '',
        },
        {
          label: 'ONAYLAYAN',
          field: 'Ad Soyad / Sicil No',
          personel: islemYapan?.amir || null, // Amiri veya yetkili kişi
          name: formatPersonel(islemYapan?.amir),
        },
      ];
    case 'Kayit':
      return [
        {
          label: 'KAYIT EDEN',
          field: 'Ad Soyad / Sicil No',
          personel: islemYapan, // Kaydı yapan
          name: formatPersonel(islemYapan),
        },
        {
          label: 'KONTROL EDEN',
          field: 'Ad Soyad / Sicil No',
          personel: null, // Bu bilgi selectedTutanak'ta yok
          name: '',
        },
        {
          label: 'ONAYLAYAN',
          field: 'Ad Soyad / Sicil No',
          personel: islemYapan?.amir || null, // Amiri veya yetkili kişi
          name: formatPersonel(islemYapan?.amir),
        },
      ];
    default:
      return [
        {
          label: 'HAZIRLAYAN',
          field: 'Ad Soyad',
          personel: islemYapan,
          name: formatPersonel(islemYapan),
        },
        {
          label: 'ONAYLAYAN',
          field: 'Ad Soyad / Sicil No',
          personel: islemYapan?.amir || null,
          name: formatPersonel(islemYapan?.amir),
        },
        {
          label: 'SORUMLU AMİR',
          field: 'Ad Soyad',
          personel: islemYapan?.amir || null,
          name: formatPersonel(islemYapan?.amir),
        },
      ];
  }
};

// Malzeme bilgilerini güvenli şekilde al
export const getMalzemeBilgi = (malzeme, field) => {
  switch (field) {
    case 'sabitKodu':
      return malzeme?.sabitKodu?.ad || malzeme?.sabitKodu || '-';
    case 'marka':
      return malzeme?.marka?.ad || malzeme?.marka || '-';
    case 'model':
      return malzeme?.model?.ad || malzeme?.model || '-';
    case 'kondisyon':
      // Eğer selectedTutanak'tan geliyorsa malzemeKondisyonu kullan
      return malzeme?.malzemeKondisyonu || malzeme?.kondisyon || '-';
    default:
      return malzeme?.[field] || '-';
  }
};
