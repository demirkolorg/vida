
export function validateBulkIadeMalzemeler(malzemeler) {
  if (!malzemeler || malzemeler.length === 0) {
    return {
      isValid: false,
      errorType: 'EMPTY_LIST',
      errorMessage: 'İade edilecek malzeme listesi boş.',
      validPersonel: null,
      invalidPersoneller: [],
      validMalzemeler: [],
      invalidMalzemeler: []
    };
  }

  // Her malzeme için zimmetli personel bilgisini topla
  const personelMalzemeMap = new Map();
  const malzemelerWithoutPersonel = [];

  malzemeler.forEach(malzeme => {
    // Son hareket kaydından zimmetli personeli bul
    const sonHareket = malzeme.malzemeHareketleri?.[0];
    const zimmetliPersonel = sonHareket?.hedefPersonel;

    if (!zimmetliPersonel || !zimmetliPersonel.id) {
      malzemelerWithoutPersonel.push(malzeme);
      return;
    }

    if (!personelMalzemeMap.has(zimmetliPersonel.id)) {
      personelMalzemeMap.set(zimmetliPersonel.id, {
        personel: {
          id: zimmetliPersonel.id,
          ad: zimmetliPersonel.ad,
          sicil: zimmetliPersonel.sicil
        },
        malzemeler: []
      });
    }

    personelMalzemeMap.get(zimmetliPersonel.id).malzemeler.push(malzeme);
  });

  // Personel bilgisi olmayan malzemeler varsa hata
  if (malzemelerWithoutPersonel.length > 0) {
    return {
      isValid: false,
      errorType: 'MISSING_PERSONEL_INFO',
      errorMessage: `${malzemelerWithoutPersonel.length} malzemenin zimmetli personel bilgisi bulunamadı. Bu malzemeler iade edilemez.`,
      validPersonel: null,
      invalidPersoneller: [],
      validMalzemeler: [],
      invalidMalzemeler: malzemelerWithoutPersonel
    };
  }

  const personelDataArray = Array.from(personelMalzemeMap.values());

  // Tek personel kontrolü
  if (personelDataArray.length === 1) {
    const validData = personelDataArray[0];
    return {
      isValid: true,
      errorType: null,
      errorMessage: null,
      validPersonel: validData.personel,
      invalidPersoneller: [],
      validMalzemeler: validData.malzemeler,
      invalidMalzemeler: []
    };
  }

  // Birden fazla personel varsa hata
  if (personelDataArray.length > 1) {
    // En çok malzemesi olan personeli "geçerli" olarak işaretle
    const sortedPersonelData = personelDataArray.sort((a, b) => b.malzemeler.length - a.malzemeler.length);
    const validData = sortedPersonelData[0];
    const invalidData = sortedPersonelData.slice(1);

    return {
      isValid: false,
      errorType: 'MULTIPLE_PERSONEL',
      errorMessage: `Seçilen malzemeler ${personelDataArray.length} farklı personelde zimmetli. Toplu iade işlemi için tüm malzemeler aynı personelde olmalıdır.`,
      validPersonel: validData.personel,
      invalidPersoneller: invalidData,
      validMalzemeler: validData.malzemeler,
      invalidMalzemeler: invalidData.flatMap(d => d.malzemeler)
    };
  }

  // Hiç personel yoksa (teorik olarak ulaşılmaması gereken durum)
  return {
    isValid: false,
    errorType: 'NO_PERSONEL',
    errorMessage: 'Hiçbir malzeme için zimmetli personel bulunamadı.',
    validPersonel: null,
    invalidPersoneller: [],
    validMalzemeler: [],
    invalidMalzemeler: malzemeler
  };
}