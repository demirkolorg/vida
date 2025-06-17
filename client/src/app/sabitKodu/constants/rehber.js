// client/src/app/sabitKodu/rehber.js

import { Construction, Plus, Edit, Trash2, Eye, Search, Filter, Download, Upload, Settings, Hash, Package } from 'lucide-react';

export const SabitKoduRehber = {
  // Modül temel bilgileri
  modul: {
    ad: "Sabit Kodu Yönetimi",
    aciklama: "Malzeme kategorilerinin standart kodlarla tanımlanması ve yönetimi",
    icon: Construction,
    kategori: "Malzeme Yönetimi",
    oncelik: "Yüksek",
    bagimlilık: ["Malzeme"]
  },

  // Ana özellikler ve işlemler
  ozellikler: [
    {
      baslik: "Sabit Kodu Ekleme",
      aciklama: "Sisteme yeni sabit kodu kaydı oluşturma",
      icon: Plus,
      yetki: ["Admin", "Superadmin"],
      adimlar: [
        "Ana sayfada 'Yeni Sabit Kodu Ekle' butonuna tıklayın",
        "Sabit kodu adını giriniz (zorunlu)",
        "Kod numarasını giriniz (opsiyonel)",
        "Açıklama ekleyiniz (opsiyonel)",
        "Formu onaylayıp kaydedin"
      ],
      notlar: [
        "Sabit kodu adı benzersiz olmalıdır",
        "Maksimum 100 karakter sınırı vardır",
        "Türkçe karakterler desteklenir",
        "Kod numarası varsa benzersiz olmalıdır",
        "Standart isimlendirme kurallarını takip edin"
      ]
    },
    {
      baslik: "Sabit Kodu Düzenleme",
      aciklama: "Mevcut sabit kodu bilgilerini güncelleme",
      icon: Edit,
      yetki: ["Admin", "Superadmin"],
      adimlar: [
        "Sabit kodları listesinden düzenlemek istediğinizi bulun",
        "Satır üzerindeki 'Düzenle' butonuna tıklayın",
        "Sabit kodu adını güncelleyiniz",
        "Kod numarasını güncelleyiniz",
        "Açıklama bilgisini güncelleyiniz",
        "Değişiklikleri kaydedin"
      ],
      notlar: [
        "Sabit kodu adı değiştirilirken benzersizlik kontrolü yapılır",
        "Bu sabit koda bağlı malzemeler varsa dikkatli olunmalıdır",
        "Kod numarası değişikliği malzeme raporlarını etkileyebilir"
      ]
    },
    {
      baslik: "Sabit Kodu Silme",
      aciklama: "Sistemden sabit kodu kaydını kaldırma",
      icon: Trash2,
      yetki: ["Superadmin"],
      adimlar: [
        "Silinecek sabit kodunu listeden seçin",
        "Silme butonuna tıklayın",
        "Onay mesajını kabul edin"
      ],
      notlar: [
        "Bu sabit koda bağlı malzemeler varsa silme işlemi yapılamaz",
        "Silinen veriler geri getirilemez"
      ],
      uyarilar: [
        "UYARI: Bu işlem geri alınamaz!",
        "Önce ilişkili malzemeleri kontrol edin",
        "Raporlama sistemini etkileyebilir"
      ]
    },
    {
      baslik: "Sabit Kodu Detayları",
      aciklama: "Sabit kodu bilgilerini ve kullanımını görüntüleme",
      icon: Eye,
      yetki: ["Admin", "User", "Personel"],
      adimlar: [
        "Sabit kodları listesinden görüntülemek istediğinizi bulun",
        "Detay butonuna tıklayın",
        "Sabit kodu bilgilerini ve bağlı kayıtları inceleyin"
      ],
      gosterilen_bilgiler: [
        "Sabit kodu adı ve açıklaması",
        "Kod numarası (varsa)",
        "Oluşturulma tarihi ve kullanıcısı",
        "Son güncellenme bilgileri",
        "Bu sabit koda bağlı malzemeler listesi",
        "Toplam malzeme sayısı",
        "Malzeme tipi dağılımı (Demirbaş/Sarf)",
        "Kullanım istatistikleri",
        "Durum bilgisi (Aktif/Pasif)"
      ]
    },
    {
      baslik: "Kod Standardizasyonu",
      aciklama: "Sabit kod sisteminin standardizasyonu",
      icon: Hash,
      yetki: ["Admin", "Superadmin"],
      ozellikler: [
        "Kategori bazlı kod yapısı",
        "Hiyerarşik kod sistemi",
        "Otomatik kod oluşturma",
        "Kod format kontrolü",
        "Duplicate kod kontrolü",
        "Kod migration işlemleri"
      ],
      kod_yapisi: [
        "Ana Kategori (örn: BT-001)",
        "Alt Kategori (örn: BT-001-001)",
        "Özel Kod (örn: LAPTOP-DELL-001)",
        "Serbest Format (kullanıcı tanımlı)"
      ]
    },
    {
      baslik: "Arama ve Filtreleme",
      aciklama: "Sabit kodları arasında hızlı arama ve filtreleme",
      icon: Search,
      yetki: ["Admin", "User", "Personel"],
      ozellikler: [
        "Sabit kodu adına göre anlık arama",
        "Kod numarasına göre arama",
        "Durum bazında filtreleme (Aktif/Pasif)",
        "Malzeme sayısına göre filtreleme",
        "Kullanılmayan kodlar filtreleme",
        "Oluşturulma tarihine göre sıralama"
      ],
      ipuclari: [
        "Arama kutusu Türkçe karakterleri destekler",
        "Kod numarası ile hızlı arama yapabilirsiniz",
        "Kullanılmayan kodları tespit etmek için filtre kullanın",
        "En az 2 karakter yazarak arama yapabilirsiniz"
      ]
    },
    {
      baslik: "Kategori Yönetimi",
      aciklama: "Malzeme kategorilerinin yönetimi",
      icon: Package,
      yetki: ["Admin", "User"],
      kategoriler: [
        "Bilgisayar ve Donanımları",
        "Araç ve Gereçler",
        "Mobilya ve Demirbaşlar",
        "Elektronik Cihazlar",
        "Yazı ve Büro Malzemeleri",
        "Temizlik Malzemeleri",
        "Güvenlik Ekipmanları",
        "Medikal Malzemeler"
      ],
      yonetim_ozellikleri: [
        "Kategori ekleme/çıkarma",
        "Alt kategori tanımlama",
        "Kategori bazlı raporlama",
        "Malzeme dağılım analizi"
      ]
    },
    {
      baslik: "Malzeme İlişkilendirme",
      aciklama: "Sabit kodların malzemelerle ilişkilendirilmesi",
      icon: Settings,
      yetki: ["Admin", "User"],
      ozellikler: [
        "Malzeme ekleme sırasında kod seçimi",
        "Mevcut malzemelerin kod değişikliği",
        "Toplu kod atama işlemleri",
        "Kod bazlı malzeme filtreleme",
        "İlişki geçmişi takibi"
      ],
      adimlar: [
        "Malzeme ekleme/düzenleme sayfasına gidin",
        "Sabit kodu seçim alanını kullanın",
        "Uygun sabit kodunu seçin",
        "İlişkilendirmeyi kaydedin"
      ]
    },
    {
      baslik: "Toplu İşlemler",
      aciklama: "Birden fazla sabit kodu üzerinde işlem yapma",
      icon: Upload,
      yetki: ["Superadmin"],
      ozellikler: [
        "Toplu durum güncelleme",
        "Toplu açıklama güncelleme",
        "Excel'e toplu export",
        "Excel'den toplu import",
        "Kod migration işlemleri",
        "Backup ve restore"
      ],
      notlar: [
        "Toplu işlemler öncesi yedek alın",
        "İşlem öncesi onay ekranı gösterilir",
        "Hatalı kayıtlar detaylı rapor edilir",
        "İlişkili malzemeler etkilenebilir"
      ]
    }
  ],

  // Veri modeli
  veri_modeli: {
    tablo_adi: "SabitKodu",
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
        unique: true,
        aciklama: "Sabit kodu adı (benzersiz)"
      },
      {
        alan: "kod",
        tip: "String",
        zorunlu: false,
        unique: true,
        aciklama: "Kod numarası (varsa benzersiz)"
      },
      {
        alan: "aciklama",
        tip: "String",
        zorunlu: false,
        aciklama: "Sabit kodu hakkında açıklama"
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
        alan: "ad",
        tip: "Unique",
        aciklama: "Sabit kodu adı benzersizliği için"
      },
      {
        alan: "kod",
        tip: "Unique",
        aciklama: "Kod numarası benzersizliği için (varsa)"
      }
    ]
  },

  // İlişkiler
  iliskiler: [
    {
      tip: "OneToMany",
      hedef: "Malzeme",
      aciklama: "Bir sabit koda birden fazla malzeme bağlı olabilir",
      alan: "malzemeler",
      cascade: "Restrict",
      ornekler: [
        "BT-001 koduna 50 adet laptop",
        "MOB-001 koduna 25 adet masa"
      ]
    }
  ],

  // API Endpoints
  api_endpoints: [
    {
      method: "GET",
      endpoint: "/api/sabitKodu",
      aciklama: "Tüm sabit kodları listele",
      parametreler: ["page", "limit", "search", "status", "hasCode", "unused"]
    },
    {
      method: "GET",
      endpoint: "/api/sabitKodu/:id",
      aciklama: "Belirli bir sabit kodunu getir",
      parametreler: ["id"]
    },
    {
      method: "POST",
      endpoint: "/api/sabitKodu",
      aciklama: "Yeni sabit kodu oluştur",
      gerekli_alanlar: ["ad"],
      opsiyonel_alanlar: ["kod", "aciklama"]
    },
    {
      method: "PUT",
      endpoint: "/api/sabitKodu/:id",
      aciklama: "Sabit kodu bilgilerini güncelle",
      parametreler: ["id"],
      guncellenebilir_alanlar: ["ad", "kod", "aciklama"]
    },
    {
      method: "DELETE",
      endpoint: "/api/sabitKodu/:id",
      aciklama: "Sabit kodunu sil",
      parametreler: ["id"],
      sartlar: ["İlişkili malzemeler olmamalı"]
    },
    {
      method: "GET",
      endpoint: "/api/sabitKodu/:id/malzemeler",
      aciklama: "Sabit koduna bağlı malzemeler",
      parametreler: ["id"],
      cevap_formati: "Malzeme listesi ve istatistikler"
    },
    {
      method: "POST",
      endpoint: "/api/sabitKodu/search",
      aciklama: "Sabit kodu arama",
      gerekli_alanlar: ["query"],
      opsiyonel_alanlar: ["status", "kategori"]
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
      toplu_islem: true,
      kod_migration: true
    },
    "Admin": {
      okuma: true,
      ekleme: true,
      guncelleme: true,
      silme: false,
      durum_degistirme: true,
      toplu_islem: false,
      kod_migration: false
    },
    "User": {
      okuma: true,
      ekleme: false,
      guncelleme: false,
      silme: false,
      durum_degistirme: false,
      toplu_islem: false,
      kod_migration: false
    },
    "Personel": {
      okuma: true,
      ekleme: false,
      guncelleme: false,
      silme: false,
      durum_degistirme: false,
      toplu_islem: false,
      kod_migration: false
    }
  },

  // Sık kullanılan örnekler
  ornekler: {
    basarili_senaryolar: [
      {
        senaryo: "Yeni sabit kodu ekleme",
        adimlar: "BT-001 Bilgisayar ve Donanımları kodu başarıyla eklendi",
        sonuc: "Kod aktif, malzeme ekleme için kullanılabilir"
      },
      {
        senaryo: "Malzeme kod ilişkilendirme",
        adimlar: "Dell laptop BT-001 koduna bağlandı",
        sonuc: "Malzeme kategorisi belirlendi, raporlamada kullanılacak"
      },
      {
        senaryo: "Kod bazlı raporlama",
        adimlar: "BT-001 kodu için malzeme raporu oluşturuldu",
        sonuc: "50 malzeme listelendi, kategori analizi yapıldı"
      }
    ],
    hata_senaryolari: [
      {
        hata: "Duplicate code name",
        sebep: "Aynı isimde sabit kodu zaten mevcut",
        cozum: "Farklı bir kod adı seçin"
      },
      {
        hata: "Duplicate code number",
        sebep: "Aynı kod numarası zaten kullanılıyor",
        cozum: "Farklı bir kod numarası kullanın"
      },
      {
        hata: "Cannot delete code",
        sebep: "Bu koda bağlı malzemeler var",
        cozum: "Önce malzemelerin kodunu değiştirin"
      }
    ]
  },

  // İş kuralları
  is_kurallari: [
    {
      kural: "Sabit Kodu Adı Benzersizliği",
      aciklama: "Sistemde aynı isimde birden fazla sabit kodu olamaz",
      ornek: "İki tane 'Bilgisayar ve Donanımları' kodu oluşturulamaz"
    },
    {
      kural: "Kod Numarası Benzersizliği",
      aciklama: "Kod numarası varsa benzersiz olmalıdır",
      ornek: "İki sabit kodunun aynı kod numarası olamaz"
    },
    {
      kural: "Malzeme Bağımlılığı",
      aciklama: "Malzemesi olan sabit kodu silinemez",
      ornek: "50 malzemesi olan kod silinmeden önce malzemeler değiştirilmeli"
    },
    {
      kural: "Standardizasyon Kuralı",
      aciklama: "Kod isimleri standart formatta olmalıdır",
      ornek: "Kategori - Alt Kategori formatında isimlendirme"
    }
  ],

  // Kod örnekleri
  kod_ornekleri: {
    bilgi_teknolojileri: [
      "BT-001 - Masaüstü Bilgisayarlar",
      "BT-002 - Dizüstü Bilgisayarlar", 
      "BT-003 - Sunucu Sistemleri",
      "BT-004 - Ağ Ekipmanları",
      "BT-005 - Yazıcı ve Tarayıcılar"
    ],
    mobilya: [
      "MOB-001 - Çalışma Masaları",
      "MOB-002 - Sandalyeler",
      "MOB-003 - Dolaplar",
      "MOB-004 - Toplantı Masaları",
      "MOB-005 - Arşiv Dolapları"
    ],
    arac_gerec: [
      "AG-001 - Hizmet Araçları",
      "AG-002 - Özel Amaçlı Araçlar",
      "AG-003 - İş Makineleri",
      "AG-004 - El Aletleri",
      "AG-005 - Ölçüm Cihazları"
    ]
  },

  // Performans notları
  performans: {
    optimizasyonlar: [
      "Sabit kodu adı üzerinde unique indeks",
      "Kod numarası üzerinde unique indeks",
      "Sayfalama (pagination) desteklenir",
      "Malzeme sayıları için cache",
      "Lazy loading uygulanır"
    ],
    limitler: [
      "Sayfa başına maksimum 50 kayıt",
      "Arama sonuçları maksimum 500 kayıt",
      "API rate limit: dakikada 100 istek",
      "Malzeme istatistikleri cache süresi: 10 dakika"
    ]
  },

  // İpuçları ve öneriler
  ipuclari: [
    "Kod adlarını kategori bazlı standardize edin",
    "Kod numaralarını hiyerarşik sistemde verin",
    "Açıklama alanını detaylı bilgi için kullanın",
    "Düzenli olarak kullanılmayan kodları kontrol edin",
    "Malzeme ekleme öncesi uygun kod var mı kontrol edin",
    "Kod değişikliklerini raporlama sistemini etkileyebileceğini unutmayın"
  ],

  // Sorun giderme
  sorun_giderme: [
    {
      problem: "Sabit kodu eklenemiyor",
      cozumler: [
        "Kod adının benzersiz olduğunu kontrol edin",
        "Kod numarasının benzersiz olduğunu kontrol edin",
        "Gerekli alanların doldurulduğunu kontrol edin",
        "Yetkinizin yeterli olduğunu kontrol edin"
      ]
    },
    {
      problem: "Sabit kodu silinemiyor",
      cozumler: [
        "Bu koda bağlı malzemeleri kontrol edin",
        "Malzemelerin kodunu başka koda değiştirin",
        "Superadmin yetkisinin olduğunu kontrol edin"
      ]
    },
    {
      problem: "Malzeme listesi yüklenmiyor",
      cozumler: [
        "Sabit kodu ID'sinin doğru olduğunu kontrol edin",
        "Cache'i temizleyip tekrar deneyin",
        "Sayfa yenileme işlemi yapın",
        "Ağ bağlantınızı kontrol edin"
      ]
    },
    {
      problem: "Arama sonuç vermiyor",
      cozumler: [
        "Arama kriterlerinizi kontrol edin",
        "Filtre ayarlarını sıfırlayın",
        "En az 2 karakter girdiğinizden emin olun",
        "Kod numarası ile deneyerek test edin"
      ]
    }
  ],

  // Entegrasyon bilgileri
  entegrasyonlar: [
    {
      modul: "Malzeme",
      ilişki: "Malzemeler sabit kodlarla kategorize edilir",
      detay: "Malzeme ekleme sırasında sabit kodu seçimi zorunludur"
    },
    {
      modul: "Raporlama",
      ilişki: "Sabit kod bazlı kategori raporları",
      detay: "Malzeme dağılım ve kategori analizlerinde kullanılır"
    },
    {
      modul: "Global Search",
      ilişki: "Sabit kod adları global aramaya dahildir",
      detay: "Kod adı ve numarası ile arama yapılabilir"
    },
    {
      modul: "Envanter",
      ilişki: "Envanter süreçlerinde kategorizasyon için kullanılır",
      detay: "Kod bazlı envanter sayımları ve kontrolü yapılabilir"
    }
  ],

  // Son güncellenme
  versiyon: "1.0.0",
  son_guncelleme: "2025-06-17",
  hazırlayan: "Sistem Yöneticisi"
};