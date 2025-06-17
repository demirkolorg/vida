// client/src/app/depo/rehber.js

import { Warehouse, Plus, Edit, Trash2, Eye, Search, Filter, Download, Upload, Settings, MapPin, Package } from 'lucide-react';

export const DepoRehber = {
  // Modül temel bilgileri
  modul: {
    ad: "Depo Yönetimi",
    aciklama: "Malzeme depolama alanlarının tanımlanması ve yönetimi",
    icon: Warehouse,
    kategori: "Malzeme Yönetimi",
    oncelik: "Yüksek",
    bagimlilık: ["Konum", "Malzeme", "MalzemeHareket"]
  },

  // Ana özellikler ve işlemler
  ozellikler: [
    {
      baslik: "Depo Ekleme",
      aciklama: "Sisteme yeni depo kaydı oluşturma",
      icon: Plus,
      yetki: ["Admin", "Superadmin"],
      adimlar: [
        "Ana sayfada 'Yeni Depo Ekle' butonuna tıklayın",
        "Depo adını giriniz (zorunlu)",
        "Açıklama ekleyiniz (opsiyonel)",
        "Formu onaylayıp kaydedin"
      ],
      notlar: [
        "Depo adı benzersiz olmalıdır",
        "Maksimum 100 karakter sınırı vardır",
        "Türkçe karakterler desteklenir",
        "Depo oluşturulduktan sonra konum tanımlamaları yapılabilir"
      ]
    },
    {
      baslik: "Depo Düzenleme",
      aciklama: "Mevcut depo bilgilerini güncelleme",
      icon: Edit,
      yetki: ["Admin", "Superadmin"],
      adimlar: [
        "Depolar listesinden düzenlemek istediğiniz depoyu bulun",
        "Satır üzerindeki 'Düzenle' butonuna tıklayın",
        "Depo adını güncelleyiniz",
        "Açıklama bilgisini güncelleyiniz",
        "Değişiklikleri kaydedin"
      ],
      notlar: [
        "Depo adı değiştirilirken benzersizlik kontrolü yapılır",
        "Bu depoya bağlı konumlar varsa dikkatli olunmalıdır",
        "Bu depodaki malzemeler etkilenmez"
      ]
    },
    {
      baslik: "Depo Silme",
      aciklama: "Sistemden depo kaydını kaldırma",
      icon: Trash2,
      yetki: ["Superadmin"],
      adimlar: [
        "Silinecek depoyu listeden seçin",
        "Silme butonuna tıklayın",
        "Onay mesajını kabul edin"
      ],
      notlar: [
        "Bu depoya bağlı konumlar varsa silme işlemi yapılamaz",
        "Bu depodaki malzemeler varsa silme işlemi yapılamaz"
      ],
      uyarilar: [
        "UYARI: Bu işlem geri alınamaz!",
        "Önce tüm konumları ve malzemeleri kontrol edin",
        "Depo geçmişi tamamen silinir"
      ]
    },
    {
      baslik: "Depo Detayları",
      aciklama: "Depo bilgilerini ve içeriğini görüntüleme",
      icon: Eye,
      yetki: ["Admin", "User", "Personel"],
      adimlar: [
        "Depolar listesinden görüntülemek istediğiniz depoyu bulun",
        "Detay butonuna tıklayın",
        "Depo bilgilerini ve içeriğini inceleyin"
      ],
      gosterilen_bilgiler: [
        "Depo adı ve açıklaması",
        "Oluşturulma tarihi ve kullanıcısı",
        "Son güncellenme bilgileri",
        "Bu depoya bağlı konumlar listesi",
        "Konum sayısı ve dağılımı",
        "Toplam malzeme sayısı",
        "Malzeme tipi dağılımı (Demirbaş/Sarf)",
        "Durum bilgisi (Aktif/Pasif)"
      ]
    },
    {
      baslik: "Konum Yönetimi",
      aciklama: "Depo içi konum tanımlamaları",
      icon: MapPin,
      yetki: ["Admin", "User"],
      ozellikler: [
        "Depo içi konum ekleme",
        "Konum düzenleme",
        "Konum silme",
        "Konum detayları görüntüleme",
        "Konum bazlı malzeme listesi",
        "Konum kapasitesi yönetimi"
      ],
      adimlar: [
        "Depo detay sayfasına gidin",
        "Konumlar tabına geçin",
        "Yeni konum ekle butonuna tıklayın",
        "Konum bilgilerini girin",
        "Kaydet butonuna tıklayın"
      ]
    },
    {
      baslik: "Arama ve Filtreleme",
      aciklama: "Depolar arasında hızlı arama ve filtreleme",
      icon: Search,
      yetki: ["Admin", "User", "Personel"],
      ozellikler: [
        "Depo adına göre anlık arama",
        "Durum bazında filtreleme (Aktif/Pasif)",
        "Konum sayısına göre filtreleme",
        "Malzeme sayısına göre filtreleme",
        "Oluşturulma tarihine göre sıralama",
        "Kapasite durumu filtreleme"
      ],
      ipuclari: [
        "Arama kutusu Türkçe karakterleri destekler",
        "En az 2 karakter yazarak arama yapabilirsiniz",
        "Filtreler birlikte kullanılabilir",
        "Boş depolar için özel filtre kullanın"
      ]
    },
    {
      baslik: "Envanter Yönetimi",
      aciklama: "Depo bazında envanter takibi",
      icon: Package,
      yetki: ["Admin", "User"],
      ozellikler: [
        "Depo bazında malzeme envanteri",
        "Konum bazında malzeme dağılımı",
        "Malzeme tipi analizi",
        "Kondisyon durumu raporu",
        "Giriş/çıkış hareketleri",
        "Stok seviyeleri takibi"
      ],
      rapor_tipleri: [
        "Depo Envanter Raporu",
        "Konum Bazlı Malzeme Raporu",
        "Malzeme Hareket Raporu",
        "Kapasite Kullanım Raporu"
      ]
    },
    {
      baslik: "Transfer İşlemleri",
      aciklama: "Depolar arası malzeme transferi",
      icon: Upload,
      yetki: ["Admin", "User"],
      adimlar: [
        "Transfer edilecek malzemeyi seçin",
        "Transfer butonuna tıklayın",
        "Kaynak ve hedef konumları seçin",
        "Transfer gerekçesini yazın",
        "İşlemi onaylayın"
      ],
      notlar: [
        "Transfer işlemi hareket kaydı oluşturur",
        "Malzeme durumu otomatik güncellenir",
        "Transfer log sistemi ile takip edilir"
      ]
    },
    {
      baslik: "Toplu İşlemler",
      aciklama: "Birden fazla depo üzerinde işlem yapma",
      icon: Settings,
      yetki: ["Superadmin"],
      ozellikler: [
        "Toplu durum güncelleme",
        "Toplu açıklama güncelleme",
        "Toplu envanter raporu",
        "Excel'e toplu export",
        "Excel'den toplu import"
      ],
      notlar: [
        "Toplu işlemler öncesi yedek alın",
        "İşlem öncesi onay ekranı gösterilir",
        "Hatalı kayıtlar detaylı rapor edilir"
      ]
    }
  ],

  // Veri modeli
  veri_modeli: {
    tablo_adi: "Depo",
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
        aciklama: "Depo adı (benzersiz)"
      },
      {
        alan: "aciklama",
        tip: "String",
        zorunlu: false,
        aciklama: "Depo hakkında açıklama"
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
        aciklama: "Depo adı benzersizliği için"
      },
      {
        alan: "status",
        tip: "Index",
        aciklama: "Durum bazlı sorgular için"
      }
    ]
  },

  // İlişkiler
  iliskiler: [
    {
      tip: "OneToMany",
      hedef: "Konum",
      aciklama: "Bir depoya birden fazla konum bağlı olabilir",
      alan: "konumlar",
      cascade: "Restrict",
      ornekler: [
        "Ana Depo altında Raf A1, Raf A2, Raf B1",
        "Arşiv Depo altında Zemin Kat, 1. Kat"
      ]
    }
  ],

  // API Endpoints
  api_endpoints: [
    {
      method: "GET",
      endpoint: "/api/depo",
      aciklama: "Tüm depoları listele",
      parametreler: ["page", "limit", "search", "status"]
    },
    {
      method: "GET",
      endpoint: "/api/depo/:id",
      aciklama: "Belirli bir depoyu getir",
      parametreler: ["id"]
    },
    {
      method: "POST",
      endpoint: "/api/depo",
      aciklama: "Yeni depo oluştur",
      gerekli_alanlar: ["ad"],
      opsiyonel_alanlar: ["aciklama"]
    },
    {
      method: "PUT",
      endpoint: "/api/depo/:id",
      aciklama: "Depo bilgilerini güncelle",
      parametreler: ["id"],
      guncellenebilir_alanlar: ["ad", "aciklama"]
    },
    {
      method: "DELETE",
      endpoint: "/api/depo/:id",
      aciklama: "Depoyu sil",
      parametreler: ["id"],
      sartlar: ["İlişkili konumlar olmamalı"]
    },
    {
      method: "GET",
      endpoint: "/api/depo/:id/envanter",
      aciklama: "Depo envanter raporu",
      parametreler: ["id"],
      cevap_formati: "Malzeme listesi ve istatistikler"
    },
    {
      method: "POST",
      endpoint: "/api/depo/transfer",
      aciklama: "Depo transfer işlemi",
      gerekli_alanlar: ["malzemeId", "kaynakKonumId", "hedefKonumId", "gerekce"]
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
      envanter_yonetimi: true,
      transfer_islemi: true,
      toplu_islem: true
    },
    "Admin": {
      okuma: true,
      ekleme: true,
      guncelleme: true,
      silme: false,
      durum_degistirme: true,
      envanter_yonetimi: true,
      transfer_islemi: true,
      toplu_islem: false
    },
    "User": {
      okuma: true,
      ekleme: false,
      guncelleme: false,
      silme: false,
      durum_degistirme: false,
      envanter_yonetimi: true,
      transfer_islemi: true,
      toplu_islem: false
    },
    "Personel": {
      okuma: true,
      ekleme: false,
      guncelleme: false,
      silme: false,
      durum_degistirme: false,
      envanter_yonetimi: false,
      transfer_islemi: false,
      toplu_islem: false
    }
  },

  // Sık kullanılan örnekler
  ornekler: {
    basarili_senaryolar: [
      {
        senaryo: "Yeni depo ekleme",
        adimlar: "Ana Depo başarıyla sisteme eklendi",
        sonuc: "Depo aktif, konum tanımlamaları için hazır"
      },
      {
        senaryo: "Depo envanter raporu",
        adimlar: "Ana Depo için envanter raporu oluşturuldu",
        sonuc: "150 malzeme, 12 konum, 3 malzeme tipi raporu alındı"
      },
      {
        senaryo: "Malzeme transfer işlemi",
        adimlar: "Laptop Ana Depo'dan Şube Depo'ya transfer edildi",
        sonuc: "Transfer tamamlandı, hareket kaydı oluşturuldu"
      }
    ],
    hata_senaryolari: [
      {
        hata: "Duplicate warehouse name",
        sebep: "Aynı isimde depo zaten mevcut",
        cozum: "Farklı bir depo adı seçin"
      },
      {
        hata: "Cannot delete warehouse",
        sebep: "Bu depoya bağlı konumlar var",
        cozum: "Önce tüm konumları silin"
      },
      {
        hata: "Transfer failed",
        sebep: "Hedef konum kapasitesi dolu",
        cozum: "Farklı konum seçin veya kapasiteyi artırın"
      }
    ]
  },

  // İş kuralları
  is_kurallari: [
    {
      kural: "Depo Adı Benzersizliği",
      aciklama: "Sistemde aynı isimde birden fazla depo olamaz",
      ornek: "İki tane 'Ana Depo' oluşturulamaz"
    },
    {
      kural: "Konum Bağımlılığı",
      aciklama: "Depo silinirken konum kontrolü yapılır",
      ornek: "Konumu olan depo silinmeden önce konumlar temizlenmeli"
    },
    {
      kural: "Transfer Kontrolü",
      aciklama: "Transfer işlemlerinde kaynak ve hedef kontrol edilir",
      ornek: "Aynı konuma transfer yapılamaz"
    },
    {
      kural: "Aktif Depo Kuralı",
      aciklama: "Pasif depoya yeni konum eklenemez",
      ornek: "Kapatılmış depoya yeni alan tanımlanamaz"
    }
  ],

  // Performans notları
  performans: {
    optimizasyonlar: [
      "Depo adı üzerinde unique indeks",
      "Durum alanı üzerinde indeks",
      "Sayfalama (pagination) desteklenir",
      "Envanter sorguları için cache",
      "Lazy loading uygulanır"
    ],
    limitler: [
      "Sayfa başına maksimum 50 kayıt",
      "Arama sonuçları maksimum 500 kayıt",
      "API rate limit: dakikada 100 istek",
      "Envanter cache süresi: 15 dakika"
    ]
  },

  // İpuçları ve öneriler
  ipuclari: [
    "Depo adlarını lokasyon bazlı standardize edin",
    "Açıklama alanını depo özellikleri için kullanın",
    "Düzenli envanter kontrolleri yapın",
    "Transfer işlemlerini log kayıtlarıyla takip edin",
    "Kapasite planlaması yaparak depo yönetimi optimizasyonu sağlayın",
    "Depo silmeden önce mutlaka konum ve malzeme kontrolü yapın"
  ],

  // Sorun giderme
  sorun_giderme: [
    {
      problem: "Depo eklenemiyor",
      cozumler: [
        "Depo adının benzersiz olduğunu kontrol edin",
        "Gerekli alanların doldurulduğunu kontrol edin",
        "Yetkinizin yeterli olduğunu kontrol edin",
        "Ağ bağlantınızı kontrol edin"
      ]
    },
    {
      problem: "Depo silinemiyor",
      cozumler: [
        "Bu depoya bağlı konumları kontrol edin",
        "Bu depodaki malzemeleri kontrol edin",
        "Superadmin yetkisinin olduğunu kontrol edin",
        "Aktif transfer işlemlerini kontrol edin"
      ]
    },
    {
      problem: "Envanter raporu oluşturulamıyor",
      cozumler: [
        "Depo ID'sinin doğru olduğunu kontrol edin",
        "Rapor yetkisinin olduğunu kontrol edin",
        "Cache'i temizleyip tekrar deneyin",
        "Sistem yükünü kontrol edin"
      ]
    },
    {
      problem: "Transfer işlemi başarısız",
      cozumler: [
        "Kaynak ve hedef konumların farklı olduğunu kontrol edin",
        "Malzemenin transfer edilebilir durumda olduğunu kontrol edin",
        "Transfer yetkisinin olduğunu kontrol edin",
        "Hedef konum kapasitesini kontrol edin"
      ]
    }
  ],

  // Entegrasyon bilgileri
  entegrasyonlar: [
    {
      modul: "Konum",
      ilişki: "Depolar konumların üst seviyesidir",
      detay: "Konum ekleme sırasında depo seçimi zorunludur"
    },
    {
      modul: "Malzeme",
      ilişki: "Malzemeler konumlar aracılığıyla depolarla ilişkilidir",
      detay: "Malzeme hareket işlemlerinde depo bilgisi kullanılır"
    },
    {
      modul: "MalzemeHareket",
      ilişki: "Transfer işlemleri hareket kaydı oluşturur",
      detay: "Depo transferleri hareket tablosunda takip edilir"
    },
    {
      modul: "Raporlama",
      ilişki: "Depo bazlı envanter raporları",
      detay: "Malzeme dağılım ve kapasite raporlarında kullanılır"
    }
  ],

  // Son güncellenme
  versiyon: "1.0.0",
  son_guncelleme: "2025-06-17",
  hazırlayan: "Sistem Yöneticisi"
};