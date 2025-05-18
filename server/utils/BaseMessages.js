export default function getMessages(name) {
  const createMessages = (name, actionName) => {
    const messages = {};
    const states = ['ok', 'error', 'pending', 'in_progress', 'completed', 'failed', 'cancelled', 'not_found', 'unauthorized', 'forbidden', 'timeout'];
    states.forEach(state => {
      switch (state) {
        case 'ok':
          messages[state] = `${name ? name + ' ' : ''}${actionName} işlemi başarılı.`;
          break;
        case 'error':
          messages[state] = `${name ? name + ' ' : ''}${actionName} işlemi hatalı.`;
          break;
        case 'failed':
          messages[state] = `${name ? name + ' ' : ''}${actionName} işlemi başarısız.`;
          break;
        case 'pending':
          messages[state] = `${name ? name + ' ' : ''}${actionName} işlemi beklemede.`;
          break;
        case 'in_progress':
          messages[state] = `${name ? name + ' ' : ''}${actionName} işlemi devam ediyor.`;
          break;
        case 'completed':
          messages[state] = `${name ? name + ' ' : ''}${actionName} işlemi tamamlandı.`;
          break;
        case 'cancelled':
          messages[state] = `${name ? name + ' ' : ''}${actionName} işlemi iptal edildi.`;
          break;
        case 'not_found':
          messages[state] = `${name ? name + ' ' : ''}${actionName} işlemi bulunamadı.`;
          break;
        case 'unauthorized':
          messages[state] = `${name ? name + ' ' : ''}${actionName} işlemi yetkisiz.`;
          break;
        case 'forbidden':
          messages[state] = `${name ? name + ' ' : ''}${actionName} işlemi yasak.`;
          break;
        case 'timeout':
          messages[state] = `${name ? name + ' ' : ''}${actionName} işlemi zaman aşımına uğradı.`;
          break;
        default:
          messages[state] = `${name ? name + ' ' : ''}${actionName} işlemi bilinmeyen bir durumda.`;
      }
    });
    return messages;
  };

  return {
    general: {
      ok: `İşlem başarılı.`,
      error: `İşlem başarısız.`,
      pending: `İşlem beklemede.`,
      in_progress: `İşlem devam ediyor.`,
      completed: `İşlem tamamlandı.`,
      failed: `İşlem başarısız.`,
      cancelled: `İşlem iptal edildi.`,
      not_found: `İşlem bulunamadı.`,
      file_notfound: `Dosya bulunamadı.`,
      unauthorized: `işlem yetkisiz.`,
      forbidden: `İşlem yasak.`,
      timeout: `İşlem zaman aşımına uğradı.`,
    },
    error: {
      unexpected: 'Beklenmedik bir hata meydana geldi, lütfen daha sonra tekrar deneyiniz.',
      data: 'Veri Hatası',
    },
    warning: {
      not_found: id => `ID'si ${id} olan ${name} bulunamadı.`,
      name_already: kolonAdi => `Bu isimde (${kolonAdi}) bir ${name} zaten mevcut, lütfen başka bir isim kullanın.`,
      sicil_already: kolonAdi => `Bu sicilde (${kolonAdi}) bir ${name} zaten mevcut, lütfen sicil bilginizi kontrol ediniz, ya da sistem yöneticinize başvurunuz.`,
    },
    info: {},
    required: {
      id: 'ID gerekli',
      name: 'İsim gerekli',
      email: 'E-posta gerekli',
      password: 'Şifre gerekli',
      first_name: 'Ad gerekli',
      last_name: 'Soyad gerekli',
      avatar: 'Avatar gerekli',
      currentPassword: 'Mevcut şifre gerekli',
      currentPassword_confirmation: 'Mevcut şifre tekrarı gerekli',
      newPassword: 'Yeni şifre gerekli',
      username: 'Kullanıcı adı gerekli',
      role: 'Rol gerekli',
      roleId: 'Rol ID gerekli',
      roles: 'Roller gerekli',
      roles_empty: 'Roller boş olamaz',
      userId: 'User ID gerekli',
      user: 'Kullanıcı gerekli',
      users: 'Kullanıcılar gerekli',
      users_empty: 'Kullanıcılar boş olamaz',
      permission: 'İzin gerekli',
      permissions: 'İzinler gerekli',
      permissions_empty: 'İzinler boş olamaz',
      refreshToken: 'Yenileme tokeni gerekli',
      searchTerm: 'Arama terimi gerekli',
      title: 'Başlık gerekli',
      lessonId: 'Ders ID gerekli',
      topicId: 'Konu ID gerekli',
      order: 'Sıra gerekli',
      content: 'İçerik gerekli',
      wordId: 'Kelime ID gerekli',
      form: 'Form gerekli',
      translation: 'Çeviri gerekli',
      plaka: 'Plaka gerekli',
      ad: 'Ad gerekli',
      ad2: 'Ad2 gerekli',
      ad3: 'Ad3 gerekli',
      donem: 'Dönem Gerekli',
      tur: 'Tür gerekli',
      il: 'İl gerekli',
      photo: 'Fotoğraf gerekli',
      cKey: 'Ckey gerekli',
      IlId: 'İl ID gerekli',
      IlceId: 'İlçe ID gerekli',
      MiaId: 'Mia ID gerekli',
      Nufus: 'Nufus gerekli',
      BelediyeSayisi: 'Belediye Sayisi gerekli',
      beldeSayisi: 'Belde Sayisi gerekli',
      KoySayisi: 'Köy Sayisi gerekli',
      Enlem: 'Enlem gerekli',
      Boylam: 'Boylam gerekli',
      keyword: 'Kelime gerekli',
      islemYapanKullanici: 'İşlem yapan kullanıcı gerekli',
      birimId: 'Birim ID gerekli',
      subeId: 'Şube ID gerekli',
      buroId: 'Buro ID gerekli',
      bosAramaKriteri: 'Arama kriterleri boş gönderilemez.',
      markaId: 'Marka ID gerekli',
      modelId: 'modelId gerekli',
      getByModelId: 'Model ID gerekli',
      depoId: 'Depo ID gerekli',
      status: 'Durum gerekli',
      isUser: 'IS USER gerekli',
      isAmir: 'IS AMIR gerekli',
      sabitKoduId: 'Sabit Kodu ID gerekli',
      vidaNo: 'vidaNo gerekli',
      kayitTarihi: 'kayitTarihi gerekli',
      malzemeTipi: 'malzemeTipi gerekli',
      kod: 'kod gerekli',
      bademSeriNo: 'bademSeriNo gerekli',
      etmysSeriNo: 'etmysSeriNo gerekli',
      stokDemirbasNo: 'stokDemirbasNo gerekli',
      malzemeId: 'malzemeId gerekli',
      kaynakPersonelId: 'kaynakPersonelId gerekli',
      hedefPersonelId: 'hedefPersonelId',
      createdById: 'createdById gerekli',
      konumId: 'konumId gerekli',
      islemTarihi: 'islemTarihi gerekli',
      malzemeKondisyonu: 'malzemeKondisyonu geerekli',
      aciklama: 'aciklama gerekli',
      sicil: 'sicil gerekli',
      parola: 'parola gerekli',
    },

    //!İSİMSİZ
    imageUpload: createMessages(null, 'Resim yükleme'),
    documentUpload: createMessages(null, 'Döküman yükleme'),
    otherUpload: createMessages(null, 'Dosya yükleme'),
    validation: createMessages(null, 'Doğrulama'),
    login: createMessages(null, 'Giriş'),
    logout: createMessages(null, 'Çıkış'),
    register: createMessages(null, 'Kayıt'),
    refreshAccessToken: createMessages(null, 'Token yenileme'),

    //*İSİMLİ
    get: createMessages(name, 'getirme'),
    list: createMessages(name, 'listeleme'),
    add: createMessages(name, 'ekleme'),
    update: createMessages(name, 'güncelleme'),
    delete: createMessages(name, 'silme'),
    softdelete: createMessages(name, 'silme'),
    harddelete: createMessages(name, 'kalıcı silme'),
    restore: createMessages(name, 'geri yükleme'),
    active: createMessages(name, 'durumu aktif etme'),
    passive: createMessages(name, 'durumu pasif etme'),
    archive: createMessages(name, 'arşivleme'),
    unarchive: createMessages(name, 'arşivden çıkarma'),
    report: createMessages(name, 'raporlama'),
    statistic: createMessages(name, 'istatistik'),
    print: createMessages(name, 'yazdırma'),
    import: createMessages(name, 'içe aktarma'),
    export: createMessages(name, 'dışa aktarma'),
    approve: createMessages(name, 'onaylama'),
    reject: createMessages(name, 'reddetme'),
    publish: createMessages(name, 'yayınlama'),
    draft: createMessages(name, 'taslak'),
    clone: createMessages(name, 'klonlama'),
    share: createMessages(name, 'paylaşma'),
    transfer: createMessages(name, 'transfer'),
    mail: createMessages(name, 'mail'),
    audit: createMessages(name, 'denetleme'),
    monitor: createMessages(name, 'izleme'),
    validate: createMessages(name, 'doğrulama'),
    sync: createMessages(name, 'senkronizasyon'),
    schedule: createMessages(name, 'zamanlama'),
    health: createMessages(name, 'servis sağlığı'),
    search: createMessages(name, 'arama'),
  };
}
