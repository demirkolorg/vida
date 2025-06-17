// client/src/app/konum/rehber.js

import { MapPin, Plus, Edit, Trash2, Eye, Search, Filter, Download, Upload, Settings, Package, Navigation } from 'lucide-react';

export const KonumRehber = {
  // Modül temel bilgileri
  modul: {
    ad: "Konum Yönetimi",
    aciklama: "Depo içi detaylı konum tanımlamaları ve malzeme yerleşim yönetimi",
    icon: MapPin,
    kategori: "Malzeme Yönetimi",
    oncelik: "Yüksek",
    bagimlilık: ["Depo", "Malzeme", "MalzemeHareket"]
  },

  // Ana özellikler ve işlemler
  ozellikler: [
    {
      baslik: "Konum Ekleme",
      aciklama: "Sisteme yeni konum kaydı oluşturma",
      icon: Plus,
      yetki: ["Admin", "User"],
      adimlar: [
        "Ana sayfada 'Yeni Konum Ekle' butonuna tıklayın",
        "Konum adını giriniz (zorunlu)",
        "Bağlı olacağı depoyu seçiniz (zorunlu)",
        "Açıklama ekleyiniz (opsiyonel)",
        "Formu onaylayıp kaydedin"
      ],
      notlar: [
        "Konum adı seçilen depo içinde benzersiz olmalıdır",
        "Maksimum 100 karakter sınırı vardır",
        "Türkçe karakterler desteklenir",
        "Depo seçimi değiştirilemez (sonradan)",
        "Konum hiyerarşisi için standart isimlendirme kullanın"
      ]
    },
    {
      baslik: "Konum Düzenleme",
      aciklama: "Mevcut konum bilgilerini güncelleme",
      icon: Edit,
      yetki: ["Admin", "User"],
      adimlar: [
        "Konumlar listesinden düzenlemek istediğiniz konumu bulun",
        "Satır üzerindeki 'Düzenle' butonuna tıklayın",
        "Konum adını güncelleyiniz",
        "Açıklama bilgisini güncelleyiniz",
        "Değişiklikleri kaydedin"
      ],
      notlar: [
        "Konum adı değiştirilirken aynı depo içinde benzersizlik kontrolü yapılır",
        "Depo değiştirilemez (güvenlik nedeniyle)",
        "Bu konumdaki malzemeler etkilenmez",
        "Hareket geçmişi korunur"
      ]
    },
    {
      baslik: "Konum Silme",
      aciklama: "Sistemden konum kaydını kaldırma",
      icon: Trash2,
      yetki: ["Admin"],
      adimlar: [
        "Silinecek konumu listeden seçin",
        "Silme butonuna tıklayın",
        "Onay mesajını kabul edin"
      ],
      notlar: [
        "Bu konumdaki malzemeler varsa silme işlemi yapılamaz",
        "Bu konuma yönelik hareket kayıtları varsa silme işlemi yapılamaz"
      ],
      uyarilar: [
        "UYARI: Bu işlem geri alınamaz!",
        "Önce tüm malzemeleri başka konuma taşıyın",
        "Hareket geçmişi kontrolü yapın"
      ]
    },
    {
      baslik: "Konum Detayları",
      aciklama: "Konum bilgilerini ve içeriğini görüntüleme",
      icon: Eye,
      yetki: ["Admin", "User", "Personel"],
      adimlar: [
        "Konumlar listesinden görüntülemek istediğiniz konumu bulun",
        "Detay butonuna tıklayın",
        "Konum bilgilerini ve içeriğini inceleyin"
      ],
      gosterilen_bilgiler: [
        "Konum adı ve açıklaması",
        "Bağlı olduğu depo bilgisi",
        "Oluşturulma tarihi ve kullanıcısı",
        "Son güncellenme bilgileri",
        "Bu konumdaki malzemeler listesi",
        "Toplam malzeme sayısı",
        "Malzeme tipi dağılımı (Demirbaş/Sarf)",
        "Son hareket tarihi",
        "Durum bilgisi (Aktif/Pasif)"
      ]
    },
    {
      baslik: "Malzeme Yerleşimi",
      aciklama: "Konumdaki malzeme düzenlemesi ve takibi",
      icon: Package,
      yetki: ["Admin", "User"],
      ozellikler: [
        "Konuma malzeme yerleştirme",
        "Konumdan malzeme çıkarma",
        "Malzeme konumu değiştirme",
        "Konum bazlı malzeme listesi",
        "Malzeme arama ve bulma",
        "Konum kapasitesi yönetimi"
      ],
      adimlar: [
        "Konum detay sayfasına gidin",
        "Malzemeler tabına geçin",
        "Malzeme ekle/çıkar butonlarını kullanın",
        "İşlem gerekçesini yazın",
        "İşlemi onaylayın"
      ]
    },
    {
      baslik: "Arama ve Filtreleme",
      aciklama: "Konumlar arasında hızlı arama ve filtreleme",
      icon: Search,
      yetki: ["Admin", "User", "Personel"],
      ozellikler: [
        "Konum adına göre anlık arama",
        "Depo bazında filtreleme",
        "Durum bazında filtreleme (Aktif/Pasif)",
        "Malzeme sayısına göre filtreleme",
        "Boş konum filtreleme",
        "Oluşturulma tarihine göre sıralama"
      ],
      ipuclari: [
        "Arama kutusu Türkçe karakterleri destekler",
        "Depo filtresi ile sonuçları daraltabilirsiniz",
        "Boş konumları tespit etmek için özel filtre kullanın",
        "En az 2 karakter yazarak arama yapabilirsiniz"
      ]
    },
    {
      baslik: "Depo Bazlı Görünüm",
      aciklama: "Konumları depolarına göre gruplu görüntüleme",
      icon: Filter,
      yetki: ["Admin", "User", "Personel"],
      ozellikler: [
        "Depolar altında konumların gruplu görünümü",
        "Her konuma ait malzeme sayısı",
        "Genişletilebilir/daraltılabilir yapı",
        "Hızlı depo değiştirme",
        "Depo bazlı istatistikler"
      ],
      ipuclari: [
        "Büyük depolarda grup görünümü kullanın",
        "Depo başlıklarına tıklayarak grubu genişletin",
        "İstatistikler gerçek zamanlı güncellenir"
      ]
    },
    {
      baslik: "Konum Haritalama",
      aciklama: "Depo içi konum haritası ve navigasyon",
      icon: Navigation,
      yetki: ["Admin", "User", "Personel"],
      ozellikler: [
        "Görsel konum haritası",
        "Malzeme yerlerini işaretleme",
        "Konum bağlantıları",
        "Rota planlama",
        "QR kod entegrasyonu",
        "Mobil navigasyon desteği"
      ],
      kullanim_alanlari: [
        "Malzeme arama ve bulma",
        "Yeni personel eğitimi",
        "Envanter kontrol süreçleri",
        "Optimum yerleşim planlaması"
      ]
    },
    {
      baslik: "Transfer Yönetimi",
      aciklama: "Konumlar arası malzeme transfer işlemleri",
      icon: Upload,
      yetki: ["Admin", "User"],
      adimlar: [
        "Transfer edilecek malzemeyi seçin",
        "Kaynak konumu kontrol edin",
        "Hedef konumu seçin",
        "Transfer gerekçesini yazın",
        "İşlemi onaylayın"
      ],
      notlar: [
        "Transfer işlemi hareket kaydı oluşturur",
        "Malzeme durumu otomatik güncellenir",
        "Transfer geçmişi takip edilir",
        "Aynı konuma transfer yapılamaz"
      ]
    },
    {
      baslik: "Toplu İşlemler",
      aciklama: "Birden fazla konum üzerinde işlem yapma",
      icon: Settings,
      yetki: ["Admin"],
      ozellikler: [
        "Toplu durum güncelleme",
        "Toplu açıklama güncelleme",
        "Toplu malzeme transferi",
        "Excel'e toplu export",
        "Excel'den toplu import",
        "Konum etiketleri yazdırma"
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
    tablo_adi: "Konum",
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
        aciklama: "Konum adı"
      },
      {
        alan: "aciklama",
        tip: "String",
        zorunlu: false,
        aciklama: "Konum hakkında açıklama"
      },
      {
        alan: "depoId",
        tip: "UUID",
        zorunlu: true,
        aciklama: "Bağlı olduğu depo ID'si"
      },
      {
        alan: "depo",
        tip: "Relation",
        bagli_tablo: "Depo",
        aciklama: "Bağlı olduğu depo bilgisi"
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
        alan: ["ad", "depoId"],
        tip: "Unique",
        aciklama: "Aynı depo içinde konum adı benzersizliği"
      },
      {
        alan: "depoId",
        tip: "Index",
        aciklama: "Depo bazlı sorgular için"
      }
    ]
  },

  // İlişkiler
  iliskiler: [
    {
      tip: "ManyToOne",
      hedef: "Depo",
      aciklama: "Her konum bir depoya aittir",
      alan: "depo",
      foreign_key: "depoId",
      cascade: "Restrict",
      ornekler: [
        "Raf A1 → Ana Depo",
        "Zemin Kat → Arşiv Depo"
      ]
    },
    {
      tip: "OneToMany",
      hedef: "MalzemeHareket",
      aciklama: "Konuma yönelik hareket kayıtları (kaynak ve hedef)",
      alan: "malzemeHareketleri",
      cascade: "Restrict",
      ornekler: [
        "Raf A1'den çıkan hareketler",
        "Raf A1'e gelen hareketler"
      ]
    }
  ],

  // API Endpoints
  api_endpoints: [
    {
      method: "GET",
      endpoint: "/api/konum",
      aciklama: "Tüm konumları listele",
      parametreler: ["page", "limit", "search", "status", "depoId", "isEmpty"]
    },
    {
      method: "GET",
      endpoint: "/api/konum/:id",
      aciklama: "Belirli bir konumu getir",
      parametreler: ["id"]
    },
    {
      method: "POST",
      endpoint: "/api/konum/getByDepoId",
      aciklama: "Belirli bir depoya ait konumları getir",
      gerekli_alanlar: ["depoId"]
    },
    {
      method: "POST",
      endpoint: "/api/konum",
      aciklama: "Yeni konum oluştur",
      gerekli_alanlar: ["ad", "depoId"],
      opsiyonel_alanlar: ["aciklama"]
    },
    {
      method: "PUT",
      endpoint: "/api/konum/:id",
      aciklama: "Konum bilgilerini güncelle",
      parametreler: ["id"],
      guncellenebilir_alanlar: ["ad", "aciklama"]
    },
    {
      method: "DELETE",
      endpoint: "/api/konum/:id",
      aciklama: "Konumu sil",
      parametreler: ["id"],
      sartlar: ["Konumda malzeme olmamalı", "Hareket kaydı olmamalı"]
    },
    {
      method: "GET",
      endpoint: "/api/konum/:id/malzemeler",
      aciklama: "Konumdaki malzemeler",
      parametreler: ["id"],
      cevap_formati: "Malzeme listesi"
    },
    {
      method: "POST",
      endpoint: "/api/konum/transfer",
      aciklama: "Konumlar arası malzeme transferi",
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
      malzeme_yerlestirme: true,
      transfer_islemi: true,
      toplu_islem: true
    },
    "Admin": {
      okuma: true,
      ekleme: true,
      guncelleme: true,
      silme: true,
      durum_degistirme: true,
      malzeme_yerlestirme: true,
      transfer_islemi: true,
      toplu_islem: false
    },
    "User": {
      okuma: true,
      ekleme: true,
      guncelleme: true,
      silme: false,
      durum_degistirme: false,
      malzeme_yerlestirme: true,
      transfer_islemi: true,
      toplu_islem: false
    },
    "Personel": {
      okuma: true,
      ekleme: false,
      guncelleme: false,
      silme: false,
      durum_degistirme: false,
      malzeme_yerlestirme: false,
      transfer_islemi: false,
      toplu_islem: false
    }
  },

  // Sık kullanılan örnekler
  ornekler: {
    basarili_senaryolar: [
      {
        senaryo: "Yeni konum ekleme",
        adimlar: "Ana Depo altına Raf A1 konumu başarıyla eklendi",
        sonuc: "Konum aktif, malzeme yerleştirme için hazır"
      },
      {
        senaryo: "Malzeme yerleştirme",
        adimlar: "Laptop Raf A1 konumuna yerleştirildi",
        sonuc: "Malzeme konumu güncellendi, hareket kaydı oluşturuldu"
      },
      {
        senaryo: "Konum transfer işlemi",
        adimlar: "Yazıcı Raf A1'den Raf B2'ye transfer edildi",
        sonuc: "Transfer tamamlandı, hareket geçmişi güncellendi"
      }
    ],
    hata_senaryolari: [
      {
        hata: "Duplicate location name in warehouse",
        sebep: "Aynı depo içinde aynı isimde konum zaten mevcut",
        cozum: "Farklı bir konum adı seçin"
      },
      {
        hata: "Cannot delete location",
        sebep: "Bu konumda malzemeler var",
        cozum: "Önce tüm malzemeleri başka konuma taşıyın"
      },
      {
        hata: "Transfer to same location",
        sebep: "Kaynak ve hedef konum aynı",
        cozum: "Farklı bir hedef konum seçin"
      }
    ]
  },

  // İş kuralları
  is_kurallari: [
    {
      kural: "Depo İçi Konum Benzersizliği",
      aciklama: "Aynı depo altında aynı isimde konum olamaz",
      ornek: "Ana Depo altında iki tane 'Raf A1' olamaz"
    },
    {
      kural: "Depo Bağımlılığı",
      aciklama: "Her konum mutlaka bir depoya bağlı olmalıdır",
      ornek: "Orphan konum kayıtları oluşturulamaz"
    },
    {
      kural: "Malzeme Kontrol Kuralı",
      aciklama: "Konum silinirken malzeme kontrolü yapılır",
      ornek: "Malzemesi olan konum silinmeden önce malzemeler taşınmalı"
    },
    {
      kural: "Transfer Mantık Kontrolü",
      aciklama: "Aynı konuma transfer yapılamaz",
      ornek: "Raf A1'den Raf A1'e transfer geçersizdir"
    }
  ],

  // Performans notları
  performans: {
    optimizasyonlar: [
      "Konum adı ve depo ID'si üzerinde composite unique indeks",
      "DepoId üzerinde indeks",
      "Sayfalama (pagination) desteklenir",
      "Depo bazlı görünüm için cache",
      "Malzeme listesi için lazy loading"
    ],
    limitler: [
      "Sayfa başına maksimum 50 kayıt",
      "Arama sonuçları maksimum 500 kayıt",
      "API rate limit: dakikada 100 istek",
      "Konum malzeme listesi cache süresi: 5 dakika"
    ]
  },

  // İpuçları ve öneriler
  ipuclari: [
    "Konum adlarını sistematik olarak verin (Raf A1, Raf A2, vs.)",
    "Açıklama alanını konum özelliklerini belirtmek için kullanın",
    "QR kod sistemini konum takibi için implementasyon yapın",
    "Düzenli konum envanteri yaparak malzeme takibini optimize edin",
    "Transfer işlemlerini log kayıtlarıyla takip edin",
    "Boş konumları düzenli kontrol ederek optimizasyon yapın"
  ],

  // Sorun giderme
  sorun_giderme: [
    {
      problem: "Konum eklenemiyor",
      cozumler: [
        "Konum adının seçilen depo içinde benzersiz olduğunu kontrol edin",
        "Geçerli bir depo seçtiğinizden emin olun",
        "Gerekli alanların doldurulduğunu kontrol edin",
        "Yetkinizin yeterli olduğunu kontrol edin"
      ]
    },
    {
      problem: "Konum silinemiyor",
      cozumler: [
        "Bu konumdaki malzemeleri kontrol edin",
        "Bu konuma yönelik hareket kayıtlarını kontrol edin",
        "Malzemeleri başka konuma taşıyın",
        "Admin yetkisinin olduğunu kontrol edin"
      ]
    },
    {
      problem: "Transfer işlemi başarısız",
      cozumler: [
        "Kaynak ve hedef konumların farklı olduğunu kontrol edin",
        "Malzemenin transfer edilebilir durumda olduğunu kontrol edin",
        "Transfer yetkisinin olduğunu kontrol edin",
        "Hedef konumun aktif olduğunu kontrol edin"
      ]
    },
    {
      problem: "Malzeme listesi yüklenmiyor",
      cozumler: [
        "Konum ID'sinin doğru olduğunu kontrol edin",
        "Cache'i temizleyip tekrar deneyin",
        "Sayfa yenileme işlemi yapın",
        "Ağ bağlantınızı kontrol edin"
      ]
    }
  ],

  // Entegrasyon bilgileri
  entegrasyonlar: [
    {
      modul: "Depo",
      ilişki: "Konumlar depoların alt seviyesidir",
      detay: "Her konum mutlaka bir depoya bağlıdır"
    },
    {
      modul: "Malzeme",
      ilişki: "Malzemeler hareket kayıtları ile konumlara bağlıdır",
      detay: "Malzeme konumu hareket tablosu üzerinden takip edilir"
    },
    {
      modul: "MalzemeHareket",
      ilişki: "Konum değişiklikleri hareket kaydı oluşturur",
      detay: "Kaynak ve hedef konum bilgileri hareket tablosunda tutulur"
    },
    {
      modul: "Raporlama",
      ilişki: "Konum bazlı envanter raporları",
      detay: "Malzeme dağılım ve konum kullanım raporlarında kullanılır"
    }
  ],

  // Son güncellenme
  versiyon: "1.0.0",
  son_guncelleme: "2025-06-17",
  hazırlayan: "Sistem Yöneticisi"
};