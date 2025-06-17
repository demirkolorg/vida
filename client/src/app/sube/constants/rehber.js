// client/src/app/sube/rehber.js

import { ShieldCheck, Plus, Edit, Trash2, Eye, Search, Filter, Download, Upload, Settings, Users } from 'lucide-react';

export const SubeRehber = {
  // Modül temel bilgileri
  modul: {
    ad: "Şube Yönetimi",
    aciklama: "Birimler altında yer alan şubelerin yönetimi ve organizasyonu",
    icon: ShieldCheck,
    kategori: "Organizasyon Yönetimi",
    oncelik: "Yüksek",
    bagimlilık: ["Birim", "Büro", "Personel", "Malzeme"]
  },

  // Ana özellikler ve işlemler
  ozellikler: [
    {
      baslik: "Şube Ekleme",
      aciklama: "Sisteme yeni şube kaydı oluşturma",
      icon: Plus,
      yetki: ["Admin", "Superadmin"],
      adimlar: [
        "Ana sayfada 'Yeni Şube Ekle' butonuna tıklayın",
        "Şube adını giriniz (zorunlu)",
        "Bağlı olacağı birimi seçiniz (zorunlu)",
        "Açıklama ekleyiniz (opsiyonel)",
        "Formu onaylayıp kaydedin"
      ],
      notlar: [
        "Şube adı seçilen birim içinde benzersiz olmalıdır",
        "Maksimum 100 karakter sınırı vardır",
        "Türkçe karakterler desteklenir",
        "Birim seçimi değiştirilemez (sonradan)"
      ]
    },
    {
      baslik: "Şube Düzenleme",
      aciklama: "Mevcut şube bilgilerini güncelleme",
      icon: Edit,
      yetki: ["Admin", "Superadmin"],
      adimlar: [
        "Şubeler listesinden düzenlemek istediğiniz şubeyi bulun",
        "Satır üzerindeki 'Düzenle' butonuna tıklayın",
        "Şube adını güncelleyiniz",
        "Açıklama bilgisini güncelleyiniz",
        "Değişiklikleri kaydedin"
      ],
      notlar: [
        "Şube adı değiştirilirken aynı birim içinde benzersizlik kontrolü yapılır",
        "Birim değiştirilemez (güvenlik nedeniyle)",
        "Bu şubeye bağlı bürolar varsa dikkatli olunmalıdır"
      ]
    },
    {
      baslik: "Şube Silme",
      aciklama: "Sistemden şube kaydını kaldırma",
      icon: Trash2,
      yetki: ["Superadmin"],
      adimlar: [
        "Silinecek şubeyi listeden seçin",
        "Silme butonuna tıklayın",
        "Onay mesajını kabul edin"
      ],
      notlar: [
        "Bu şubeye bağlı bürolar varsa silme işlemi yapılamaz",
        "Bu şubeye ait personeller varsa silme işlemi yapılamaz",
        "Bu şubeye ait malzemeler varsa silme işlemi yapılamaz"
      ],
      uyarilar: [
        "UYARI: Bu işlem geri alınamaz!",
        "Önce tüm alt bağlantıları kontrol edin",
        "Organizasyon yapısını bozabilir"
      ]
    },
    {
      baslik: "Şube Detayları",
      aciklama: "Şube bilgilerini ve alt yapıları görüntüleme",
      icon: Eye,
      yetki: ["Admin", "User", "Personel"],
      adimlar: [
        "Şubeler listesinden görüntülemek istediğiniz şubeyi bulun",
        "Detay butonuna tıklayın",
        "Şube bilgilerini ve bağlı kayıtları inceleyin"
      ],
      gosterilen_bilgiler: [
        "Şube adı ve açıklaması",
        "Bağlı olduğu birim bilgisi",
        "Oluşturulma tarihi ve kullanıcısı",
        "Son güncellenme bilgileri",
        "Bu şubeye bağlı bürolar listesi",
        "Bu şubeye ait personel sayısı",
        "Bu şubeye ait malzeme sayısı (iş karşılığı)",
        "Durum bilgisi (Aktif/Pasif)"
      ]
    },
    {
      baslik: "Arama ve Filtreleme",
      aciklama: "Şubeler arasında hızlı arama ve filtreleme",
      icon: Search,
      yetki: ["Admin", "User", "Personel"],
      ozellikler: [
        "Şube adına göre anlık arama",
        "Birim bazında filtreleme",
        "Durum bazında filtreleme (Aktif/Pasif)",
        "Oluşturulma tarihine göre sıralama",
        "Büro sayısına göre filtreleme",
        "Personel sayısına göre filtreleme"
      ],
      ipuclari: [
        "Arama kutusu Türkçe karakterleri destekler",
        "Birim filtresi ile sonuçları daraltabilirsiniz",
        "En az 2 karakter yazarak arama yapabilirsiniz",
        "Filtreler birlikte kullanılabilir"
      ]
    },
    {
      baslik: "Birim Bazlı Görünüm",
      aciklama: "Şubeleri birimlerine göre gruplu görüntüleme",
      icon: Filter,
      yetki: ["Admin", "User", "Personel"],
      ozellikler: [
        "Birimler altında şubelerin gruplu görünümü",
        "Her şubeye ait büro ve personel sayısı",
        "Genişletilebilir/daraltılabilir yapı",
        "Hızlı birim değiştirme",
        "Birim bazlı istatistikler"
      ],
      ipuclari: [
        "Büyük organizasyonlarda birim filtresi kullanın",
        "Birim başlıklarına tıklayarak grubu genişletin",
        "İstatistikler gerçek zamanlı güncellenir"
      ]
    },
    {
      baslik: "Şube Transfer İşlemleri",
      aciklama: "Şubelerin birimler arası transferi",
      icon: Settings,
      yetki: ["Superadmin"],
      adimlar: [
        "Transfer edilecek şubeyi seçin",
        "Transfer butonuna tıklayın",
        "Hedef birimi seçin",
        "Transfer gerekçesini yazın",
        "İşlemi onaylayın"
      ],
      notlar: [
        "Transfer işlemi log kaydı oluşturur",
        "Alt yapılar (büro, personel) otomatik taşınır",
        "Malzeme transferi ayrı işlem gerektirir"
      ],
      uyarilar: [
        "Transfer işlemi geri alınamaz",
        "Tüm alt yapı etkilenir",
        "Raporlama sistemini etkileyebilir"
      ]
    },
    {
      baslik: "Toplu İşlemler",
      aciklama: "Birden fazla şube üzerinde işlem yapma",
      icon: Upload,
      yetki: ["Superadmin"],
      ozellikler: [
        "Toplu durum güncelleme",
        "Toplu açıklama güncelleme",
        "Toplu birim transferi",
        "Excel'e toplu export",
        "Excel'den toplu import"
      ],
      notlar: [
        "Toplu işlemler öncesi yedek alın",
        "İşlem öncesi onay ekranı gösterilir",
        "Hatalı kayıtlar detaylı rapor edilir",
        "Birim transferleri dikkatli yapılmalıdır"
      ]
    }
  ],

  // Veri modeli
  veri_modeli: {
    tablo_adi: "Sube",
    alanlar: [
      {
        alan: "id",
        tip: "UUID",
        zorunlu: true,
        aciklama: "Benzersiz kimlik numarası"
      },
      {
        alan: "ad",
        tip: "String",
        zorunlu: true,
        max_uzunluk: 100,
        aciklama: "Şube adı"
      },
      {
        alan: "aciklama",
        tip: "String",
        zorunlu: false,
        aciklama: "Şube hakkında açıklama"
      },
      {
        alan: "birimId",
        tip: "UUID",
        zorunlu: true,
        aciklama: "Bağlı olduğu birim ID'si"
      },
      {
        alan: "birim",
        tip: "Relation",
        bagli_tablo: "Birim",
        aciklama: "Bağlı olduğu birim bilgisi"
      },
      {
        alan: "status",
        tip: "Enum",
        varsayilan: "Aktif",
        secenekler: ["Aktif", "Pasif", "Silindi"],
        aciklama: "Kaydın durumu"
      },
      {
        alan: "createdAt",
        tip: "DateTime",
        otomatik: true,
        aciklama: "Oluşturulma tarihi"
      },
      {
        alan: "createdBy",
        tip: "Relation",
        bagli_tablo: "Personel",
        aciklama: "Kaydı oluşturan kullanıcı"
      },
      {
        alan: "updatedAt",
        tip: "DateTime",
        otomatik: true,
        aciklama: "Son güncellenme tarihi"
      },
      {
        alan: "updatedBy",
        tip: "Relation",
        bagli_tablo: "Personel",
        aciklama: "Son güncelleyen kullanıcı"
      }
    ],
    indeksler: [
      {
        alan: ["ad", "birimId"],
        tip: "Unique",
        aciklama: "Aynı birim içinde şube adı benzersizliği"
      },
      {
        alan: "birimId",
        tip: "Index",
        aciklama: "Birim bazlı sorgular için"
      }
    ]
  },

  // İlişkiler
  iliskiler: [
    {
      tip: "ManyToOne",
      hedef: "Birim",
      aciklama: "Her şube bir birime aittir",
      alan: "birim",
      foreign_key: "birimId",
      cascade: "Restrict",
      ornekler: [
        "Asayiş Şubesi → Teşkilat GM",
        "Mali Şube → İdari ve Mali İşler GM"
      ]
    },
    {
      tip: "OneToMany",
      hedef: "Buro",
      aciklama: "Bir şubeye birden fazla büro bağlı olabilir",
      alan: "burolar",
      cascade: "Restrict",
      ornekler: [
        "Asayiş Şubesi altında Karakol Büroları",
        "Mali Şube altında Muhasebe ve Bütçe Büroları"
      ]
    },
    {
      tip: "OneToMany",
      hedef: "Malzeme",
      aciklama: "Bir şubeye birden fazla malzeme bağlı olabilir (iş karşılığı şube)",
      alan: "malzemeler",
      cascade: "Restrict",
      ornekler: [
        "Asayiş Şubesi'ne ait devriye araçları",
        "Bilgi İşlem Şubesi'ne ait bilgisayarlar"
      ]
    }
  ],

  // API Endpoints
  api_endpoints: [
    {
      method: "GET",
      endpoint: "/api/sube",
      aciklama: "Tüm şubeleri listele",
      parametreler: ["page", "limit", "search", "status", "birimId"]
    },
    {
      method: "GET",
      endpoint: "/api/sube/:id",
      aciklama: "Belirli bir şubeyi getir",
      parametreler: ["id"]
    },
    {
      method: "POST",
      endpoint: "/api/sube/getByBirimId",
      aciklama: "Belirli bir birime ait şubeleri getir",
      gerekli_alanlar: ["birimId"]
    },
    {
      method: "POST",
      endpoint: "/api/sube",
      aciklama: "Yeni şube oluştur",
      gerekli_alanlar: ["ad", "birimId"],
      opsiyonel_alanlar: ["aciklama"]
    },
    {
      method: "PUT",
      endpoint: "/api/sube/:id",
      aciklama: "Şube bilgilerini güncelle",
      parametreler: ["id"],
      guncellenebilir_alanlar: ["ad", "aciklama"]
    },
    {
      method: "DELETE",
      endpoint: "/api/sube/:id",
      aciklama: "Şubeyi sil",
      parametreler: ["id"],
      sartlar: ["İlişkili bürolar olmamalı", "İlişkili personeller olmamalı", "İlişkili malzemeler olmamalı"]
    },
    {
      method: "POST",
      endpoint: "/api/sube/transfer",
      aciklama: "Şube transfer işlemi",
      gerekli_alanlar: ["subeId", "yeniBirimId", "gerekce"]
    }
  ],

  // Yetki matrisi
  yetki_matrisi: {
    "Superadmin": {
      okuma: true,
      ekleme: true,
      guncelleme: true,
      silme: true,
      durum_degistirme: true,
      transfer: true,
      toplu_islem: true
    },
    "Admin": {
      okuma: true,
      ekleme: true,
      guncelleme: true,
      silme: false,
      durum_degistirme: true,
      transfer: false,
      toplu_islem: false
    },
    "User": {
      okuma: true,
      ekleme: false,
      guncelleme: false,
      silme: false,
      durum_degistirme: false,
      transfer: false,
      toplu_islem: false
    },
    "Personel": {
      okuma: true,
      ekleme: false,
      guncelleme: false,
      silme: false,
      durum_degistirme: false,
      transfer: false,
      toplu_islem: false
    }
  },

  // Sık kullanılan örnekler
  ornekler: {
    basarili_senaryolar: [
      {
        senaryo: "Yeni şube ekleme",
        adimlar: "Teşkilat GM altına Asayiş Şubesi başarıyla eklendi",
        sonuc: "Şube listesinde görünür, büro ekleme için hazır"
      },
      {
        senaryo: "Birim bazlı şube görüntüleme",
        adimlar: "Teşkilat GM seçildi, altındaki tüm şubeler listelendi",
        sonuc: "5 şube ve toplam 12 büro görüntülendi"
      },
      {
        senaryo: "Şube transfer işlemi",
        adimlar: "Bilgi İşlem Şubesi İdari GM'den Teknik GM'ye transfer edildi",
        sonuc: "Transfer tamamlandı, alt yapılar yeni birime bağlandı"
      }
    ],
    hata_senaryolari: [
      {
        hata: "Duplicate branch name in unit",
        sebep: "Aynı birim içinde aynı isimde şube zaten mevcut",
        cozum: "Farklı bir şube adı seçin veya farklı birim seçin"
      },
      {
        hata: "Cannot delete branch",
        sebep: "Bu şubeye bağlı bürolar var",
        cozum: "Önce alt büroları silin veya başka şubeye taşıyın"
      },
      {
        hata: "Transfer failed",
        sebep: "Hedef birimde aynı isimde şube var",
        cozum: "Şube adını değiştirin veya farklı hedef birim seçin"
      }
    ]
  },

  // İş kuralları
  is_kurallari: [
    {
      kural: "Birim İçi Şube Benzersizliği",
      aciklama: "Aynı birim altında aynı isimde şube olamaz",
      ornek: "Teşkilat GM altında iki tane 'Asayiş Şubesi' olamaz"
    },
    {
      kural: "Birim Bağımlılığı",
      aciklama: "Her şube mutlaka bir birime bağlı olmalıdır",
      ornek: "Orphan şube kayıtları oluşturulamaz"
    },
    {
      kural: "Hiyerarşik Cascade Kontrolü",
      aciklama: "Şube silinirken alt yapı kontrolü yapılır",
      ornek: "Bürosu olan şube silinmeden önce bürolar temizlenmeli"
    },
    {
      kural: "Transfer Benzersizlik Kontrolü",
      aciklama: "Şube transfer edilirken hedef birimde isim çakışması kontrol edilir",
      ornek: "Mali Şube → İdari GM transfer edilirken İdari GM'de Mali Şube var mı kontrol edilir"
    }
  ],

  // Performans notları
  performans: {
    optimizasyonlar: [
      "Şube adı ve birim ID'si üzerinde composite unique indeks",
      "BirimId üzerinde indeks",
      "Sayfalama (pagination) desteklenir",
      "Birim bazlı görünüm için cache",
      "Lazy loading uygulanır"
    ],
    limitler: [
      "Sayfa başına maksimum 50 kayıt",
      "Arama sonuçları maksimum 500 kayıt",
      "API rate limit: dakikada 100 istek",
      "Birim bazlı cache süresi: 5 dakika"
    ]
  },

  // İpuçları ve öneriler
  ipuclari: [
    "Şube adlarını standart ve tutarlı şekilde yazın",
    "Açıklama alanını şube görevleri için kullanın",
    "Birim seçimini dikkatli yapın, sonradan değiştirilemez",
    "Transfer işlemlerini planlı yapın",
    "Şube silmeden önce mutlaka alt bağlantıları kontrol edin",
    "Birim bazlı görünümü büyük organizasyonlarda kullanın"
  ],

  // Sorun giderme
  sorun_giderme: [
    {
      problem: "Şube eklenemiyor",
      cozumler: [
        "Şube adının seçilen birim içinde benzersiz olduğunu kontrol edin",
        "Geçerli bir birim seçtiğinizden emin olun",
        "Gerekli alanların doldurulduğunu kontrol edin",
        "Yetkinizin yeterli olduğunu kontrol edin"
      ]
    },
    {
      problem: "Şube silinemiyor",
      cozumler: [
        "Bu şubeye bağlı büroları kontrol edin",
        "Bu şubeye ait personelleri kontrol edin",
        "Bu şubeye ait malzemeleri kontrol edin",
        "Superadmin yetkisinin olduğunu kontrol edin"
      ]
    },
    {
      problem: "Transfer işlemi başarısız",
      cozumler: [
        "Hedef birimde aynı isimde şube olmadığını kontrol edin",
        "Transfer yetkisinin olduğunu kontrol edin",
        "Gerekçe alanını doldurduğunuzdan emin olun",
        "Hedef birimin aktif olduğunu kontrol edin"
      ]
    },
    {
      problem: "Birim bazlı görünüm yüklenmiyor",
      cozumler: [
        "Birim seçiminin doğru yapıldığını kontrol edin",
        "Cache'i temizleyip tekrar deneyin",
        "Sayfa yenileme işlemi yapın",
        "Ağ bağlantınızı kontrol edin"
      ]
    }
  ],

  // Entegrasyon bilgileri
  entegrasyonlar: [
    {
      modul: "Birim",
      ilişki: "Şubeler birimlerin alt seviyesidir",
      detay: "Her şube mutlaka bir birime bağlıdır"
    },
    {
      modul: "Büro",
      ilişki: "Bürolar şubelerin alt seviyesidir",
      detay: "Büro ekleme sırasında şube seçimi zorunludur"
    },
    {
      modul: "Personel",
      ilişki: "Personeller dolaylı olarak şubeye bağlıdır",
      detay: "Personel → Büro → Şube hiyerarşisi"
    },
    {
      modul: "Malzeme",
      ilişki: "Malzemeler iş karşılığı şube olarak şubeye bağlıdır",
      detay: "Malzeme ekleme sırasında iş karşılığı şube seçimi zorunlu"
    }
  ],

  // Son güncellenme
  versiyon: "1.0.0",
  son_guncelleme: "2025-06-17",
  hazırlayan: "Sistem Yöneticisi"
};