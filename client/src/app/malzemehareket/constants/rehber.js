// client/src/app/malzemeHareket/rehber.js

import { Route, Plus, Edit, Trash2, Eye, Search, Filter, Download, Upload, Settings, History, Move, Package, Users } from 'lucide-react';

export const MalzemeHareketRehber = {
  // Modül temel bilgileri
  modul: {
    ad: "Malzeme Hareket Yönetimi",
    aciklama: "Tüm malzeme hareket işlemlerinin takibi, geçmişi ve analizi",
    icon: Route,
    kategori: "Malzeme Yönetimi",
    oncelik: "Kritik",
    bagimlilık: ["Malzeme", "Personel", "Konum", "Tutanak"]
  },

  // Ana özellikler ve işlemler
  ozellikler: [
    {
      baslik: "Hareket Takibi",
      aciklama: "Malzeme hareketlerinin gerçek zamanlı takibi",
      icon: Route,
      yetki: ["Admin", "User", "Personel"],
      hareket_tipleri: [
        "Kayıt - İlk malzeme kaydı",
        "Zimmet - Personele verilme",
        "İade - Depoya geri dönüş",
        "Devir - Personel değişikliği",
        "Depo Transferi - Konum değişikliği",
        "Kondisyon Güncelleme - Durum değişikliği",
        "Kayıp - Kayıp bildirimi",
        "Düşüm - Sistemden çıkarma",
        "Bilgi - Bilgilendirme kaydı"
      ],
      adimlar: [
        "Malzeme hareket listesine gidin",
        "Filtreler ile aradığınız hareketi bulun",
        "Hareket detaylarını görüntüleyin",
        "Geçmiş hareketlerle karşılaştırın"
      ]
    },
    {
      baslik: "Zimmet İşlemleri",
      aciklama: "Malzemenin personele zimmetlenmesi",
      icon: Users,
      yetki: ["Admin", "User"],
      adimlar: [
        "Zimmetlenecek malzemeyi seçin",
        "Zimmet alacak personeli seçin",
        "Zimmet tarihini belirleyin",
        "Zimmet gerekçesini yazın",
        "Teslim alan personelin onayını alın",
        "İşlemi tamamlayın"
      ],
      notlar: [
        "Malzeme aktif durumda olmalıdır",
        "Zaten zimmetli olan malzeme tekrar zimmetlenemez",
        "Zimmet işlemi otomatik hareket kaydı oluşturur",
        "Personel bilgileri hareket kaydında saklanır"
      ],
      gerekli_bilgiler: [
        "Malzeme ID'si",
        "Hedef personel ID'si",
        "İşlem tarihi",
        "Açıklama (opsiyonel)"
      ]
    },
    {
      baslik: "İade İşlemleri",
      aciklama: "Zimmetli malzemenin iade alınması",
      icon: Upload,
      yetki: ["Admin", "User"],
      adimlar: [
        "İade edilecek malzemeyi seçin",
        "Mevcut zimmet durumunu kontrol edin",
        "İade alacak konumu belirleyin",
        "Malzeme kondisyonunu kontrol edin",
        "İade tarihini belirleyin",
        "İade gerekçesini yazın",
        "İşlemi tamamlayın"
      ],
      notlar: [
        "Sadece zimmetli malzemeler iade edilebilir",
        "İade sırasında kondisyon güncellemesi yapılabilir",
        "İade konumu belirlenmesi zorunludur",
        "İade işlemi otomatik hareket kaydı oluşturur"
      ]
    },
    {
      baslik: "Devir İşlemleri",
      aciklama: "Malzemenin personelden personele devredilmesi",
      icon: Move,
      yetki: ["Admin", "User"],
      adimlar: [
        "Devredilecek malzemeyi seçin",
        "Mevcut zimmet sahibini kontrol edin",
        "Yeni zimmet alacak personeli seçin",
        "Devir tarihini belirleyin",
        "Devir gerekçesini yazın",
        "Her iki personelin onayını alın",
        "İşlemi tamamlayın"
      ],
      notlar: [
        "Malzeme zimmetli durumda olmalıdır",
        "Devir işlemi iki ayrı hareket kaydı oluşturur (İade + Zimmet)",
        "Eski ve yeni zimmet sahibi bilgileri saklanır",
        "Malzeme konumu değişmez"
      ]
    },
    {
      baslik: "Depo Transfer İşlemleri",
      aciklama: "Malzemenin konumlar arası transferi",
      icon: Package,
      yetki: ["Admin", "User"],
      adimlar: [
        "Transfer edilecek malzemeyi seçin",
        "Mevcut konumunu kontrol edin",
        "Hedef konumu seçin",
        "Transfer tarihini belirleyin",
        "Transfer gerekçesini yazın",
        "İşlemi tamamlayın"
      ],
      notlar: [
        "Malzeme depoda (zimmetli değil) olmalıdır",
        "Kaynak ve hedef konum farklı olmalıdır",
        "Transfer işlemi hareket kaydı oluşturur",
        "Malzeme durumu değişmez"
      ]
    },
    {
      baslik: "Kondisyon Güncelleme",
      aciklama: "Malzeme durumunun güncellenmesi",
      icon: Settings,
      yetki: ["Admin", "User"],
      kondisyon_durumlari: [
        "Sağlam - Normal kullanılabilir",
        "Arızalı - Tamire ihtiyaçlı",
        "Hurda - Kullanılamaz durumda",
        "Kayıp - Bulunmayan",
        "Düşüm - Sistemden çıkarılan"
      ],
      adimlar: [
        "Kondisyonu güncellenecek malzemeyi seçin",
        "Mevcut kondisyonu kontrol edin",
        "Yeni kondisyonu seçin",
        "Güncelleme tarihini belirleyin",
        "Güncelleme gerekçesini yazın",
        "İşlemi tamamlayın"
      ]
    },
    {
      baslik: "Hareket Geçmişi",
      aciklama: "Malzeme hareket geçmişinin görüntülenmesi",
      icon: History,
      yetki: ["Admin", "User", "Personel"],
      ozellikler: [
        "Kronolojik hareket listesi",
        "Hareket tipi bazlı filtreleme",
        "Personel bazlı filtreleme",
        "Tarih aralığı seçimi",
        "Detaylı hareket bilgileri",
        "İlgili tutanak bağlantıları",
        "Export özelliği"
      ],
      adimlar: [
        "Malzeme detay sayfasına gidin",
        "Hareketler tabına geçin",
        "Filtreler ile arama yapın",
        "Hareket detaylarını inceleyin"
      ]
    },
    {
      baslik: "Arama ve Filtreleme",
      aciklama: "Hareket kayıtları arasında gelişmiş arama",
      icon: Search,
      yetki: ["Admin", "User", "Personel"],
      arama_kriterleri: [
        "Malzeme vida numarası",
        "Personel adı/sicil",
        "Hareket tipi",
        "Tarih aralığı",
        "Konum bilgisi",
        "İşlem yapan kullanıcı",
        "Tutanak numarası"
      ],
      filtre_secenekleri: [
        "Hareket türü (Zimmet, İade, Devir, vb.)",
        "Tarih aralığı",
        "İşlem yapan personel",
        "Malzeme tipi (Demirbaş/Sarf)",
        "Kondisyon durumu",
        "Tutanak durumu"
      ]
    },
    {
      baslik: "Raporlama",
      aciklama: "Hareket bazlı raporlar ve analizler",
      icon: Download,
      yetki: ["Admin", "User"],
      rapor_tipleri: [
        "Günlük Hareket Raporu",
        "Personel Zimmet Raporu",
        "Malzeme Geçmiş Raporu",
        "Depo Transfer Raporu",
        "Kondisyon Değişim Raporu",
        "İstatistiksel Analiz Raporu"
      ],
      export_formatlari: ["PDF", "Excel", "CSV"],
      adimlar: [
        "Raporlar bölümüne gidin",
        "Rapor tipini seçin",
        "Filtre kriterlerini belirleyin",
        "Raporu oluşturun",
        "İstediğiniz formatta indirin"
      ]
    }
  ],

  // Veri modeli
  veri_modeli: {
    tablo_adi: "MalzemeHareket",
    alanlar: [
      {
        alan: "id",
        tip: "UUID",
        zorunlu: true,
        aciklama: "Benzersiz kimlik numarası"
      },
      {
        alan: "hareketTuru",
        tip: "Enum",
        zorunlu: true,
        secenekler: ["Kayit", "Zimmet", "Iade", "Devir", "DepoTransferi", "KondisyonGuncelleme", "Kayip", "Dusum", "Bilgi"],
        aciklama: "Hareket türü"
      },
      {
        alan: "malzemeId",
        tip: "UUID",
        zorunlu: true,
        aciklama: "İlgili malzeme ID'si"
      },
      {
        alan: "kaynakPersonelId",
        tip: "UUID",
        zorunlu: false,
        aciklama: "Kaynak personel ID'si (varsa)"
      },
      {
        alan: "hedefPersonelId",
        tip: "UUID",
        zorunlu: false,
        aciklama: "Hedef personel ID'si (varsa)"
      },
      {
        alan: "kaynakKonumId",
        tip: "UUID",
        zorunlu: false,
        aciklama: "Kaynak konum ID'si (varsa)"
      },
      {
        alan: "hedefKonumId",
        tip: "UUID",
        zorunlu: false,
        aciklama: "Hedef konum ID'si (varsa)"
      },
      {
        alan: "eskiKondisyon",
        tip: "Enum",
        zorunlu: false,
        secenekler: ["Saglam", "Arizali", "Hurda", "Kayip", "Dusum"],
        aciklama: "Önceki kondisyon durumu"
      },
      {
        alan: "yeniKondisyon",
        tip: "Enum",
        zorunlu: false,
        secenekler: ["Saglam", "Arizali", "Hurda", "Kayip", "Dusum"],
        aciklama: "Yeni kondisyon durumu"
      },
      {
        alan: "islemTarihi",
        tip: "DateTime",
        zorunlu: true,
        aciklama: "İşlem gerçekleştirme tarihi"
      },
      {
        alan: "aciklama",
        tip: "String",
        zorunlu: false,
        aciklama: "İşlem açıklaması"
      },
      {
        alan: "tutanakId",
        tip: "UUID",
        zorunlu: false,
        aciklama: "İlgili tutanak ID'si (varsa)"
      }
    ]
  },

  // İlişkiler
  iliskiler: [
    {
      tip: "ManyToOne",
      hedef: "Malzeme",
      aciklama: "Her hareket bir malzemeye aittir",
      alan: "malzeme",
      foreign_key: "malzemeId",
      cascade: "Restrict",
      ornekler: [
        "Laptop zimmet hareketi → Dell Latitude 5520",
        "Araç iade hareketi → Hizmet Aracı"
      ]
    },
    {
      tip: "ManyToOne",
      hedef: "Personel",
      aciklama: "Hareket kaynak personele ait olabilir",
      alan: "kaynakPersonel",
      foreign_key: "kaynakPersonelId",
      cascade: "Set Null",
      ornekler: [
        "İade hareketi → Ahmet Yılmaz (iade eden)",
        "Devir hareketi → Fatma Demir (devreden)"
      ]
    },
    {
      tip: "ManyToOne",
      hedef: "Personel",
      aciklama: "Hareket hedef personele ait olabilir",
      alan: "hedefPersonel",
      foreign_key: "hedefPersonelId",
      cascade: "Set Null",
      ornekler: [
        "Zimmet hareketi → Mehmet Kaya (zimmet alan)",
        "Devir hareketi → Ali Özkan (devralan)"
      ]
    },
    {
      tip: "ManyToOne",
      hedef: "Konum",
      aciklama: "Hareket kaynak konumdan olabilir",
      alan: "kaynakKonum",
      foreign_key: "kaynakKonumId",
      cascade: "Set Null"
    },
    {
      tip: "ManyToOne",
      hedef: "Konum",
      aciklama: "Hareket hedef konuma olabilir",
      alan: "hedefKonum",
      foreign_key: "hedefKonumId",
      cascade: "Set Null"
    }
  ],

  // API Endpoints
  api_endpoints: [
    {
      method: "GET",
      endpoint: "/api/malzemeHareket",
      aciklama: "Tüm hareket kayıtlarını listele",
      parametreler: ["page", "limit", "search", "hareketTuru", "malzemeId", "personelId", "startDate", "endDate"]
    },
    {
      method: "GET",
      endpoint: "/api/malzemeHareket/:id",
      aciklama: "Belirli bir hareket kaydını getir",
      parametreler: ["id"]
    },
    {
      method: "POST",
      endpoint: "/api/malzemeHareket/zimmet",
      aciklama: "Zimmet işlemi",
      gerekli_alanlar: ["malzemeId", "hedefPersonelId", "islemTarihi"],
      opsiyonel_alanlar: ["aciklama"]
    },
    {
      method: "POST",
      endpoint: "/api/malzemeHareket/iade",
      aciklama: "İade işlemi",
      gerekli_alanlar: ["malzemeId", "hedefKonumId", "islemTarihi"],
      opsiyonel_alanlar: ["aciklama", "yeniKondisyon"]
    },
    {
      method: "POST",
      endpoint: "/api/malzemeHareket/devir",
      aciklama: "Devir işlemi",
      gerekli_alanlar: ["malzemeId", "kaynakPersonelId", "hedefPersonelId", "islemTarihi"],
      opsiyonel_alanlar: ["aciklama"]
    },
    {
      method: "POST",
      endpoint: "/api/malzemeHareket/transfer",
      aciklama: "Depo transfer işlemi",
      gerekli_alanlar: ["malzemeId", "kaynakKonumId", "hedefKonumId", "islemTarihi"],
      opsiyonel_alanlar: ["aciklama"]
    },
    {
      method: "GET",
      endpoint: "/api/malzemeHareket/malzeme/:malzemeId",
      aciklama: "Belirli malzemenin hareket geçmişi",
      parametreler: ["malzemeId"]
    }
  ],

  // Yetki matrisi
  yetki_matrisi: {
    "Superadmin": {
      okuma: true,
      zimmet: true,
      iade: true,
      devir: true,
      transfer: true,
      kondisyon_guncelleme: true,
      silme: true,
      raporlama: true
    },
    "Admin": {
      okuma: true,
      zimmet: true,
      iade: true,
      devir: true,
      transfer: true,
      kondisyon_guncelleme: true,
      silme: false,
      raporlama: true
    },
    "User": {
      okuma: true,
      zimmet: true,
      iade: true,
      devir: true,
      transfer: true,
      kondisyon_guncelleme: false,
      silme: false,
      raporlama: true
    },
    "Personel": {
      okuma: true,
      zimmet: false,
      iade: false,
      devir: false,
      transfer: false,
      kondisyon_guncelleme: false,
      silme: false,
      raporlama: false
    }
  },

  // Sık kullanılan örnekler
  ornekler: {
    basarili_senaryolar: [
      {
        senaryo: "Laptop zimmet işlemi",
        adimlar: "Dell Latitude 5520 Ahmet Yılmaz'a zimmetlendi",
        sonuc: "Zimmet kaydı oluştu, malzeme durumu güncellendi"
      },
      {
        senaryo: "Araç iade işlemi",
        adimlar: "Hizmet aracı Fatma Demir'den iade alındı",
        sonuc: "İade kaydı oluştu, araç depoya geri döndü"
      },
      {
        senaryo: "Malzeme devir işlemi",
        adimlar: "Tablet Mehmet Kaya'dan Ali Özkan'a devredildi",
        sonuc: "Devir tamamlandı, yeni zimmet sahibi Ali Özkan"
      }
    ],
    hata_senaryolari: [
      {
        hata: "Already assigned to personnel",
        sebep: "Malzeme zaten başka personele zimmetli",
        cozum: "Önce iade işlemi yapın"
      },
      {
        hata: "Personnel not found",
        sebep: "Seçilen personel bulunamadı",
        cozum: "Geçerli bir personel seçin"
      },
      {
        hata: "Location not available",
        sebep: "Hedef konum aktif değil",
        cozum: "Aktif bir konum seçin"
      }
    ]
  },

  // İş kuralları
  is_kurallari: [
    {
      kural: "Zimmet Kontrol Kuralı",
      aciklama: "Zaten zimmetli olan malzeme tekrar zimmetlenemez",
      ornek: "Ahmet Yılmaz'da olan laptop başkasına zimmetlenemez"
    },
    {
      kural: "İade Kontrol Kuralı",
      aciklama: "Sadece zimmetli malzemeler iade edilebilir",
      ornek: "Depodaki malzeme iade işlemine tabi tutulamaz"
    },
    {
      kural: "Transfer Kontrol Kuralı",
      aciklama: "Sadece depodaki malzemeler transfer edilebilir",
      ornek: "Zimmetli malzeme önce iade edilmeli"
    },
    {
      kural: "Kondisyon Geçmişi",
      aciklama: "Kondisyon değişiklikleri kayıt altına alınır",
      ornek: "Sağlam → Arızalı değişimi hareket kaydı oluşturur"
    }
  ],

  // Performans notları
  performans: {
    optimizasyonlar: [
      "MalzemeId üzerinde indeks",
      "HareketTuru üzerinde indeks",
      "İslemTarihi üzerinde indeks",
      "Sayfalama (pagination) desteklenir",
      "Malzeme geçmişi için cache",
      "Tarih bazlı partitioning"
    ],
    limitler: [
      "Sayfa başına maksimum 100 kayıt",
      "Arama sonuçları maksimum 1000 kayıt",
      "API rate limit: dakikada 200 istek",
      "Rapor generation maksimum 10000 kayıt"
    ]
  },

  // İpuçları ve öneriler
  ipuclari: [
    "Hareket açıklamalarını detaylı yazın",
    "İşlem tarihlerini doğru girdiğinizden emin olun",
    "Zimmet işlemlerinde personel onayını almayı unutmayın",
    "Kondisyon değişikliklerini düzenli takip edin",
    "Raporları periyodik olarak alarak analiz yapın",
    "Transfer işlemlerinde malzeme durumunu kontrol edin"
  ],

  // Sorun giderme
  sorun_giderme: [
    {
      problem: "Zimmet işlemi başarısız",
      cozumler: [
        "Malzemenin zaten zimmetli olmadığını kontrol edin",
        "Personelin aktif durumda olduğunu kontrol edin",
        "Zimmet yetkisinin olduğunu kontrol edin",
        "Malzemenin aktif durumda olduğunu kontrol edin"
      ]
    },
    {
      problem: "Hareket geçmişi yüklenmiyor",
      cozumler: [
        "Malzeme ID'sinin doğru olduğunu kontrol edin",
        "Cache'i temizleyip tekrar deneyin",
        "Sayfa yenileme işlemi yapın",
        "Ağ bağlantınızı kontrol edin"
      ]
    },
    {
      problem: "Rapor oluşturulamıyor",
      cozumler: [
        "Filtre kriterlerini kontrol edin",
        "Tarih aralığının geçerli olduğunu kontrol edin",
        "Rapor yetkisinin olduğunu kontrol edin",
        "Sistem yükünü kontrol edin"
      ]
    }
  ],

  // Entegrasyon bilgileri
  entegrasyonlar: [
    {
      modul: "Malzeme",
      ilişki: "Her hareket bir malzemeye aittir",
      detay: "Malzeme durumu hareket kayıtları ile takip edilir"
    },
    {
      modul: "Personel",
      ilişki: "Zimmet işlemlerinde personel bilgisi gerekli",
      detay: "Kaynak ve hedef personel bilgileri hareket kaydında tutulur"
    },
    {
      modul: "Konum",
      ilişki: "Transfer işlemlerinde konum bilgisi gerekli",
      detay: "Kaynak ve hedef konum bilgileri hareket kaydında tutulur"
    },
    {
      modul: "Tutanak",
      ilişki: "Tutanak işlemlerinde hareket kayıtları oluşur",
      detay: "Tutanak numarası hareket kaydına bağlanır"
    }
  ],

  // Son güncellenme
  versiyon: "1.0.0",
  son_guncelleme: "2025-06-17",
  hazırlayan: "Sistem Yöneticisi"
};