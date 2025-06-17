// client/src/app/globalSearch/rehber.js

import { Search, Plus, Edit, Trash2, Eye, Filter, Download, Upload, Settings, Zap, Target, Database, Clock } from 'lucide-react';

export const GlobalSearchRehber = {
  // Modül temel bilgileri
  modul: {
    ad: "Global Search (Küresel Arama)",
    aciklama: "Tüm sistem modüllerinde birleşik arama ve hızlı erişim sistemi",
    icon: Search,
    kategori: "Arama & Navigasyon",
    oncelik: "Yüksek",
    bagimlilık: ["Tüm Modüller"]
  },

  // Ana özellikler ve işlemler
  ozellikler: [
    {
      baslik: "Unified Search (Birleşik Arama)",
      aciklama: "Tek arama ile tüm modüllerde sonuç bulma",
      icon: Search,
      yetki: ["Admin", "User", "Personel"],
      arama_kapsami: [
        "Birim, Şube, Büro kayıtları",
        "Personel bilgileri",
        "Malzeme kayıtları",
        "Malzeme hareketleri",
        "Marka ve model bilgileri",
        "Depo ve konum kayıtları",
        "Sabit kod tanımları",
        "Tutanak kayıtları"
      ],
      adimlar: [
        "Ana sayfada global arama kutusuna gidin",
        "Arama teriminizi yazın (min 2 karakter)",
        "Enter tuşuna basın veya arama butonuna tıklayın",
        "Kategori bazlı sonuçları inceleyin",
        "İlgili kaydın detayına gidin"
      ],
      notlar: [
        "Arama Türkçe karakterleri destekler",
        "Kısmi kelime araması yapılabilir",
        "Sonuçlar yetki seviyesine göre filtrelenir",
        "Real-time arama önerileri gösterilir"
      ]
    },
    {
      baslik: "Quick Search (Hızlı Arama)",
      aciklama: "Anlık arama önerileri ve hızlı erişim",
      icon: Zap,
      yetki: ["Admin", "User", "Personel"],
      ozellikler: [
        "Yazarken anlık öneriler",
        "Son aramalar geçmişi",
        "Popüler arama terimleri",
        "Kategori bazlı filtreleme",
        "Klavye kısayolları desteği",
        "Mobil dokunmatik optimizasyon"
      ],
      klavye_kisayollari: [
        "Ctrl+K - Global arama açma",
        "Esc - Arama kapatma",
        "Enter - Arama yapma",
        "↑↓ - Öneriler arasında gezinme",
        "Tab - Kategori değiştirme"
      ]
    },
    {
      baslik: "Advanced Search (Gelişmiş Arama)",
      aciklama: "Detaylı filtreler ile gelişmiş arama",
      icon: Filter,
      yetki: ["Admin", "User"],
      gelismis_filtreler: [
        "Varlık türü seçimi",
        "Tarih aralığı filtreleme",
        "Durum filtreleme (Aktif/Pasif)",
        "Kullanıcı bazlı filtreleme",
        "Birim/Şube/Büro filtreleme",
        "Malzeme tipi filtreleme",
        "Kondisyon durumu filtreleme"
      ],
      arama_operatorleri: [
        "\"exact phrase\" - Tam kelime arama",
        "word1 AND word2 - Her iki kelime",
        "word1 OR word2 - Herhangi bir kelime",
        "NOT word - Kelimeyi hariç tut",
        "word* - Wildcard arama"
      ]
    },
    {
      baslik: "Smart Suggestions (Akıllı Öneriler)",
      aciklama: "AI destekli arama önerileri",
      icon: Target,
      yetki: ["Admin", "User", "Personel"],
      oneri_tipleri: [
        "Benzer kayıt önerileri",
        "İlişkili veri önerileri",
        "Popüler aramalar",
        "Son kullanılan kayıtlar",
        "Favori kayıtlar",
        "Sık erişilen modüller"
      ],
      oneri_algoritmalari: [
        "Kullanıcı arama geçmişi analizi",
        "Benzerlik skorlaması",
        "Popülerlik bazlı sıralama",
        "Contextual awareness",
        "Role-based filtering"
      ]
    },
    {
      baslik: "Search Analytics (Arama Analitiği)",
      aciklama: "Arama davranışları ve performans analizi",
      icon: Database,
      yetki: ["Admin", "Superadmin"],
      analiz_metrikleri: [
        "En çok aranan terimler",
        "Sonuç bulunmayan aramalar",
        "Kullanıcı arama davranışları",
        "Modül bazlı arama dağılımı",
        "Arama performans istatistikleri",
        "Peak usage zamanları"
      ],
      raporlar: [
        "Günlük arama raporu",
        "Kullanıcı davranış analizi",
        "Search performance raporu",
        "Başarısız arama analizi",
        "Trend analizi raporu"
      ]
    },
    {
      baslik: "Saved Searches (Kayıtlı Aramalar)",
      aciklama: "Sık kullanılan aramaları kaydetme",
      icon: Clock,
      yetki: ["Admin", "User"],
      ozellikler: [
        "Arama kriterlerini kaydetme",
        "Özel isim verme",
        "Hızlı erişim için shortcut",
        "Paylaşım özelliği",
        "Otomatik güncellenme",
        "Favori arama listesi"
      ],
      adimlar: [
        "Gelişmiş arama yapın",
        "Filtrelerinizi ayarlayın",
        "\"Aramayı Kaydet\" butonuna tıklayın",
        "Arama için isim verin",
        "Kaydetme işlemini onaylayın",
        "Hızlı erişim menüsünden kullanın"
      ]
    },
    {
      baslik: "Export & Sharing (Dışa Aktarma)",
      aciklama: "Arama sonuçlarını paylaşma ve dışa aktarma",
      icon: Download,
      yetki: ["Admin", "User"],
      export_formatlari: [
        "Excel - Detaylı tablolar",
        "PDF - Rapor formatı",
        "CSV - Raw data",
        "JSON - API formatı"
      ],
      paylasim_secenekleri: [
        "Arama linkini paylaşma",
        "Sonuçları e-posta ile gönderme",
        "Takım üyeleriyle paylaşma",
        "Genel erişim linki oluşturma"
      ]
    },
    {
      baslik: "Search API",
      aciklama: "Programatik arama erişimi",
      icon: Settings,
      yetki: ["Admin", "Superadmin"],
      api_ozellikleri: [
        "RESTful API endpoints",
        "Batch search desteği",
        "Rate limiting",
        "Authentication token",
        "Response caching",
        "Webhook entegrasyonu"
      ],
      kullanim_alanlari: [
        "Mobil uygulama entegrasyonu",
        "Third-party sistem entegrasyonu",
        "Automated reporting",
        "Data migration",
        "External dashboard feeds"
      ]
    }
  ],

  // Arama varlıkları
  arama_varliklari: {
    birim: {
      aranabilir_alanlar: ["ad", "aciklama"],
      ornek_sonuc: "Emniyet Genel Müdürlüğü",
      donus_bilgileri: ["id", "ad", "aciklama", "subeSayisi"]
    },
    sube: {
      aranabilir_alanlar: ["ad", "aciklama"],
      ornek_sonuc: "Asayiş Şubesi",
      donus_bilgileri: ["id", "ad", "birim.ad", "buroSayisi"]
    },
    buro: {
      aranabilir_alanlar: ["ad", "aciklama"],
      ornek_sonuc: "Karakol Bürosu",
      donus_bilgileri: ["id", "ad", "sube.ad", "amir.ad"]
    },
    personel: {
      aranabilir_alanlar: ["ad", "soyad", "sicil", "email"],
      ornek_sonuc: "Ahmet Yılmaz",
      donus_bilgileri: ["id", "ad", "soyad", "sicil", "buro.ad", "avatar"]
    },
    malzeme: {
      aranabilir_alanlar: ["vidaNo", "aciklama", "kod", "bademSeriNo", "etmysSeriNo"],
      ornek_sonuc: "Dell Latitude 5520",
      donus_bilgileri: ["id", "vidaNo", "marka.ad", "model.ad", "malzemeTipi"]
    },
    malzemeHareket: {
      aranabilir_alanlar: ["aciklama"],
      ornek_sonuc: "Laptop zimmet işlemi",
      donus_bilgileri: ["id", "hareketTuru", "malzeme.vidaNo", "islemTarihi"]
    },
    marka: {
      aranabilir_alanlar: ["ad", "aciklama"],
      ornek_sonuc: "Dell",
      donus_bilgileri: ["id", "ad", "aciklama", "modelSayisi"]
    },
    model: {
      aranabilir_alanlar: ["ad", "aciklama"],
      ornek_sonuc: "Latitude 5520",
      donus_bilgileri: ["id", "ad", "marka.ad", "malzemeSayisi"]
    },
    depo: {
      aranabilir_alanlar: ["ad", "aciklama"],
      ornek_sonuc: "Ana Depo",
      donus_bilgileri: ["id", "ad", "aciklama", "konumSayisi"]
    },
    konum: {
      aranabilir_alanlar: ["ad", "aciklama"],
      ornek_sonuc: "Raf A1",
      donus_bilgileri: ["id", "ad", "depo.ad", "malzemeSayisi"]
    },
    sabitKodu: {
      aranabilir_alanlar: ["ad", "kod", "aciklama"],
      ornek_sonuc: "BT-001",
      donus_bilgileri: ["id", "ad", "kod", "malzemeSayisi"]
    }
  },

  // API Endpoints
  api_endpoints: [
    {
      method: "POST",
      endpoint: "/api/globalSearch",
      aciklama: "Ana global arama endpoint'i",
      gerekli_alanlar: ["query"],
      opsiyonel_alanlar: ["entityTypes", "filters", "limit", "page"]
    },
    {
      method: "POST",
      endpoint: "/api/globalSearch/quick",
      aciklama: "Hızlı arama önerileri",
      gerekli_alanlar: ["query"],
      opsiyonel_alanlar: ["limit"]
    },
    {
      method: "GET",
      endpoint: "/api/globalSearch/recent",
      aciklama: "Son aramalar geçmişi",
      parametreler: ["limit"]
    },
    {
      method: "POST",
      endpoint: "/api/globalSearch/save",
      aciklama: "Arama kriterlerini kaydetme",
      gerekli_alanlar: ["name", "criteria"],
      opsiyonel_alanlar: ["description", "isPublic"]
    },
    {
      method: "GET",
      endpoint: "/api/globalSearch/saved",
      aciklama: "Kayıtlı aramaları getirme",
      parametreler: ["userId"]
    },
    {
      method: "GET",
      endpoint: "/api/globalSearch/analytics",
      aciklama: "Arama analitiği verileri",
      parametreler: ["startDate", "endDate", "metricType"]
    }
  ],

  // Yetki matrisi
  yetki_matrisi: {
    "Superadmin": {
      global_arama: true,
      gelismis_arama: true,
      kayitli_aramalar: true,
      arama_analitiği: true,
      export_islemi: true,
      api_erisimi: true,
      admin_ayarlari: true
    },
    "Admin": {
      global_arama: true,
      gelismis_arama: true,
      kayitli_aramalar: true,
      arama_analitiği: true,
      export_islemi: true,
      api_erisimi: false,
      admin_ayarlari: false
    },
    "User": {
      global_arama: true,
      gelismis_arama: true,
      kayitli_aramalar: true,
      arama_analitiği: false,
      export_islemi: true,
      api_erisimi: false,
      admin_ayarlari: false
    },
    "Personel": {
      global_arama: true,
      gelismis_arama: false,
      kayitli_aramalar: false,
      arama_analitiği: false,
      export_islemi: false,
      api_erisimi: false,
      admin_ayarlari: false
    }
  },

  // Sık kullanılan örnekler
  ornekler: {
    basarili_senaryolar: [
      {
        senaryo: "Personel arama",
        arama_terimi: "Ahmet Yılmaz",
        sonuc: "Personel modülünde 1 sonuç bulundu",
        detay: "Sicil: 12345, Büro: Karakol Bürosu"
      },
      {
        senaryo: "Malzeme arama",
        arama_terimi: "Dell laptop",
        sonuc: "Malzeme modülünde 5 sonuç bulundu",
        detay: "Vida No: V001-V005, Marka: Dell, Model: Latitude serisi"
      },
      {
        senaryo: "Sicil numarası arama",
        arama_terimi: "12345",
        sonuc: "Personel modülünde tam eşleşme",
        detay: "Ahmet Yılmaz - Karakol Bürosu"
      },
      {
        senaryo: "Vida numarası arama",
        arama_terimi: "V001",
        sonuc: "Malzeme modülünde tam eşleşme",
        detay: "Dell Latitude 5520 - Zimmetli: Ahmet Yılmaz"
      }
    ],
    gelismis_arama_ornekleri: [
      {
        senaryo: "Aktif personel arama",
        filtreler: "Varlık Türü: Personel, Durum: Aktif",
        sonuc: "150 aktif personel listelendi"
      },
      {
        senaryo: "Son 30 günde eklenen malzemeler",
        filtreler: "Varlık Türü: Malzeme, Tarih: Son 30 gün",
        sonuc: "25 yeni malzeme kaydı bulundu"
      },
      {
        senaryo: "Demirbaş tipindeki arızalı malzemeler",
        filtreler: "Varlık Türü: Malzeme, Tip: Demirbaş, Kondisyon: Arızalı",
        sonuc: "8 arızalı demirbaş bulundu"
      }
    ]
  },

  // Arama algoritması
  arama_algoritmasi: {
    skorlama_kriterleri: [
      {
        kriter: "Exact Match",
        skor: 100,
        aciklama: "Tam kelime eşleşmesi"
      },
      {
        kriter: "Prefix Match",
        skor: 80,
        aciklama: "Başlangıç eşleşmesi"
      },
      {
        kriter: "Contains Match",
        skor: 60,
        aciklama: "İçerik eşleşmesi"
      },
      {
        kriter: "Fuzzy Match",
        skor: 40,
        aciklama: "Benzerlik eşleşmesi"
      },
      {
        kriter: "Related Match",
        skor: 20,
        aciklama: "İlişkili veri eşleşmesi"
      }
    ],
    siralama_faktoru: [
      "Skor (en yüksek önce)",
      "Son güncelleme tarihi",
      "Popülerlik skoru",
      "Kullanıcı yetki seviyesi",
      "Varlık türü önceliği"
    ]
  },

  // Performans notları
  performans: {
    optimizasyonlar: [
      "Full-text search indeksleri",
      "Redis caching katmanı",
      "Async search processing",
      "Result pagination",
      "Search query optimization",
      "Database query batching"
    ],
    limitler: [
      "Minimum 2 karakter arama",
      "Maksimum 1000 sonuç",
      "API rate limit: 100 istek/dakika",
      "Cache TTL: 5 dakika",
      "Timeout: 10 saniye"
    ],
    metrikleri: [
      "Ortalama arama süresi: <200ms",
      "Cache hit oranı: >80%",
      "Başarılı arama oranı: >95%",
      "Eşzamanlı kullanıcı: 100+"
    ]
  },

  // İpuçları ve öneriler
  ipuclari: [
    "En az 2 karakter yazarak arama yapın",
    "Türkçe karakterleri doğal olarak kullanabilirsiniz",
    "Tırnak işareti ile tam kelime arama yapın",
    "Sık kullandığınız aramaları kaydedin",
    "Filtreler ile sonuçları daraltın",
    "Klavye kısayollarını kullanarak hızlı arama yapın",
    "Gelişmiş arama için operatörleri kullanın"
  ],

  // Sorun giderme
  sorun_giderme: [
    {
      problem: "Arama sonuç vermiyor",
      cozumler: [
        "Arama terimini kontrol edin (min 2 karakter)",
        "Filtrelerinizi kontrol edin",
        "Yetki seviyenizi kontrol edin",
        "Farklı arama terimleri deneyin",
        "Cache'i temizleyip tekrar deneyin"
      ]
    },
    {
      problem: "Çok fazla sonuç geliyor",
      cozumler: [
        "Daha spesifik arama terimleri kullanın",
        "Gelişmiş filtreler uygulayın",
        "Varlık türü seçimi yapın",
        "Tarih aralığı daraltın",
        "Tam kelime arama yapın (tırnak kullanın)"
      ]
    },
    {
      problem: "Beklenen sonuç çıkmıyor",
      cozumler: [
        "Farklı kelime varyasyonları deneyin",
        "Kısmi kelime araması yapın",
        "Fuzzy search kullanın",
        "İlişkili terimlerle arama yapın",
        "Veri güncelliğini kontrol edin"
      ]
    },
    {
      problem: "Arama çok yavaş",
      cozumler: [
        "Daha spesifik terimler kullanın",
        "Filtre sayısını azaltın",
        "Sayfa boyutunu küçültün",
        "Ağ bağlantınızı kontrol edin",
        "Sistem yöneticisine başvurun"
      ]
    }
  ],

  // Entegrasyon bilgileri
  entegrasyonlar: [
    {
      modul: "Tüm Modüller",
      ilişki: "Global arama tüm modülleri kapsar",
      detay: "Her modülün verileri unified search'e dahil edilir"
    },
    {
      modul: "Authentication",
      ilişki: "Yetki bazlı sonuç filtreleme",
      detay: "Kullanıcı yetkilerine göre sonuçlar filtrelenir"
    },
    {
      modul: "Audit",
      ilişki: "Arama işlemleri log'lanır",
      detay: "Tüm arama aktiviteleri audit sisteminde takip edilir"
    },
    {
      modul: "Analytics",
      ilişki: "Arama davranışları analiz edilir",
      detay: "Kullanıcı arama patternleri ve performans metrikleri"
    }
  ],

  // Gelecek özellikler
  gelecek_ozellikler: [
    "Voice search desteği",
    "AI-powered semantic search",
    "Natural language queries",
    "Visual search (QR/Barcode)",
    "Machine learning recommendations",
    "Real-time collaborative search",
    "Advanced analytics dashboard",
    "Custom search widgets"
  ],

  // Son güncellenme
  versiyon: "1.0.0",
  son_guncelleme: "2025-06-17",
  hazırlayan: "Sistem Yöneticisi"
};