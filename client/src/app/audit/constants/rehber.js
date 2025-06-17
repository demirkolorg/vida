// client/src/app/audit/rehber.js

import { Shield, Plus, Edit, Trash2, Eye, Search, Filter, Download, Upload, Settings, History, Activity, AlertTriangle, Info } from 'lucide-react';

export const AuditRehber = {
  // Modül temel bilgileri
  modul: {
    ad: "Audit Log Yönetimi",
    aciklama: "Sistem güvenliği ve izlenebilirlik için tüm işlemlerin kayıt altına alınması",
    icon: Shield,
    kategori: "Güvenlik & İzleme",
    oncelik: "Kritik",
    bagimlilık: ["Tüm Modüller"]
  },

  // Ana özellikler ve işlemler
  ozellikler: [
    {
      baslik: "Otomatik Log Kaydı",
      aciklama: "Sistem işlemlerinin otomatik olarak kayıt altına alınması",
      icon: Activity,
      yetki: ["Sistem"],
      otomatik_kayit_alanlari: [
        "Kullanıcı giriş/çıkış işlemleri",
        "CRUD işlemleri (Create, Read, Update, Delete)",
        "Rol ve yetki değişiklikleri",
        "Malzeme hareket işlemleri",
        "Tutanak oluşturma ve onay işlemleri",
        "Sistem ayarları değişiklikleri",
        "Hata ve exception durumları",
        "API endpoint erişimleri"
      ],
      log_seviyeleri: [
        "INFO - Bilgilendirme logları",
        "WARNING - Uyarı logları",
        "ERROR - Hata logları",
        "DEBUG - Geliştirici logları",
        "CRITICAL - Kritik sistem hataları"
      ]
    },
    {
      baslik: "Log Görüntüleme",
      aciklama: "Audit log kayıtlarının görüntülenmesi ve analizi",
      icon: Eye,
      yetki: ["Admin", "Superadmin"],
      adimlar: [
        "Audit log sayfasına gidin",
        "Filtreler ile arama yapın",
        "Log detaylarını inceleyin",
        "İlgili kayıtları analiz edin"
      ],
      gosterilen_bilgiler: [
        "Log seviyesi ve türü",
        "İşlem yapan kullanıcı",
        "İşlem tarihi ve saati",
        "Rota ve servis bilgisi",
        "Detaylı log içeriği",
        "IP adresi ve tarayıcı bilgisi",
        "İşlem sonucu (başarılı/başarısız)",
        "İlgili veri değişiklikleri"
      ]
    },
    {
      baslik: "Gelişmiş Arama",
      aciklama: "Log kayıtları arasında detaylı arama",
      icon: Search,
      yetki: ["Admin", "Superadmin"],
      arama_kriterleri: [
        "Kullanıcı adı/ID",
        "Log seviyesi",
        "Servis/Rota adı",
        "Tarih aralığı",
        "IP adresi",
        "İşlem türü",
        "Başarı durumu",
        "Log içeriği (metin arama)"
      ],
      filtre_secenekleri: [
        "Son 1 saat",
        "Son 24 saat",
        "Son 7 gün",
        "Son 30 gün",
        "Özel tarih aralığı",
        "Kritik seviye loglar",
        "Hata logları",
        "Belirli kullanıcı işlemleri"
      ]
    },
    {
      baslik: "Güvenlik İzleme",
      aciklama: "Güvenlik olaylarının tespit ve izlenmesi",
      icon: AlertTriangle,
      yetki: ["Admin", "Superadmin"],
      izlenen_olaylar: [
        "Başarısız giriş denemeleri",
        "Yetkisiz erişim girişimleri",
        "Şüpheli API çağrıları",
        "Çoklu oturum açma",
        "Rol escalation girişimleri",
        "Veri değişiklik anomalileri",
        "Toplu işlem girişimleri",
        "Sistem ayarları değişiklikleri"
      ],
      alarm_kriterleri: [
        "5 dk içinde 5+ başarısız giriş",
        "Yetkisiz endpoint erişimi",
        "Kritik veri silme işlemi",
        "Gece saatlerinde toplu işlem",
        "Bilinmeyen IP'den erişim"
      ]
    },
    {
      baslik: "Performans İzleme",
      aciklama: "Sistem performansının log analizi ile izlenmesi",
      icon: Activity,
      yetki: ["Admin", "Superadmin"],
      metrikler: [
        "API response süreleri",
        "En çok kullanılan endpointler",
        "Hata oranları",
        "Kullanıcı aktivite dağılımı",
        "Peak usage zamanları",
        "Resource kullanım istatistikleri"
      ],
      analiz_raporlari: [
        "Günlük performans raporu",
        "Haftalık trend analizi",
        "Kullanıcı davranış analizi",
        "Sistem sağlık raporu",
        "Kapasite planlama raporu"
      ]
    },
    {
      baslik: "Compliance Raporlama",
      aciklama: "Uyumluluk ve yasal gereksinimler için raporlama",
      icon: Download,
      yetki: ["Superadmin"],
      rapor_tipleri: [
        "Veri erişim raporu",
        "Kullanıcı aktivite raporu",
        "Veri değişiklik raporu",
        "Güvenlik olay raporu",
        "Sistem kullanım raporu",
        "GDPR uyumluluk raporu"
      ],
      export_formatlari: [
        "PDF - Resmi raporlar",
        "Excel - Detaylı analizler",
        "CSV - Raw data",
        "JSON - API entegrasyonu"
      ]
    },
    {
      baslik: "Log Arşivleme",
      aciklama: "Eski log kayıtlarının arşivlenmesi",
      icon: Upload,
      yetki: ["Superadmin"],
      arsivleme_politikalari: [
        "30 günden eski INFO loglar",
        "90 günden eski WARNING loglar",
        "1 yıldan eski ERROR loglar",
        "Kritik loglar hiç arşivlenmez",
        "Compliance loglar 7 yıl saklanır"
      ],
      arsiv_ozellikleri: [
        "Otomatik arşivleme",
        "Sıkıştırılmış saklama",
        "Arama yapılabilir indeks",
        "Geri yükleme özelliği",
        "Güvenli silme"
      ]
    },
    {
      baslik: "Real-time Monitoring",
      aciklama: "Gerçek zamanlı sistem izleme",
      icon: Activity,
      yetki: ["Admin", "Superadmin"],
      gercek_zamanli_ozellikler: [
        "Canlı log akışı",
        "Anlık uyarılar",
        "Dashboard görünümü",
        "Kritik olay bildirimleri",
        "Sistem durumu göstergeleri"
      ],
      alarm_kanallari: [
        "E-posta bildirimleri",
        "SMS uyarıları",
        "Dashboard pop-up'ları",
        "Slack entegrasyonu",
        "Webhook bildirimleri"
      ]
    }
  ],

  // Veri modeli
  veri_modeli: {
    tablo_adi: "AuditLog",
    alanlar: [
      {
        alan: "id",
        tip: "UUID",
        zorunlu: true,
        aciklama: "Benzersiz log kimlik numarası"
      },
      {
        alan: "level",
        tip: "String",
        zorunlu: true,
        secenekler: ["INFO", "WARNING", "ERROR", "DEBUG", "CRITICAL"],
        aciklama: "Log seviyesi"
      },
      {
        alan: "rota",
        tip: "String",
        zorunlu: true,
        aciklama: "API endpoint veya işlem rotası"
      },
      {
        alan: "hizmet",
        tip: "String",
        zorunlu: true,
        aciklama: "İşlemi gerçekleştiren servis"
      },
      {
        alan: "log",
        tip: "Json",
        zorunlu: true,
        aciklama: "Detaylı log içeriği ve metadata"
      },
      {
        alan: "createdAt",
        tip: "DateTime",
        zorunlu: true,
        otomatik: true,
        aciklama: "Log oluşturulma zamanı"
      },
      {
        alan: "createdById",
        tip: "UUID",
        zorunlu: false,
        aciklama: "İşlemi yapan kullanıcı ID'si"
      },
      {
        alan: "createdBy",
        tip: "Relation",
        bagli_tablo: "Personel",
        aciklama: "İşlemi yapan kullanıcı bilgisi"
      }
    ],
    indeksler: [
      {
        alan: "level",
        tip: "Index",
        aciklama: "Log seviyesi bazlı sorgular için"
      },
      {
        alan: "createdAt",
        tip: "Index",
        aciklama: "Tarih bazlı sorgular için"
      },
      {
        alan: "createdById",
        tip: "Index",
        aciklama: "Kullanıcı bazlı sorgular için"
      },
      {
        alan: "rota",
        tip: "Index",
        aciklama: "Endpoint bazlı sorgular için"
      }
    ]
  },

  // Log içerik yapısı
  log_icerik_yapisi: {
    standart_alanlar: [
      {
        alan: "user",
        aciklama: "İşlemi yapan kullanıcı bilgisi",
        ornek: "{ id: 'uuid', ad: 'Ahmet Yılmaz', sicil: '12345' }"
      },
      {
        alan: "action",
        aciklama: "Gerçekleştirilen işlem",
        ornek: "CREATE, UPDATE, DELETE, LOGIN, LOGOUT"
      },
      {
        alan: "resource",
        aciklama: "İşlem yapılan kaynak",
        ornek: "{ type: 'malzeme', id: 'uuid', data: {...} }"
      },
      {
        alan: "timestamp",
        aciklama: "İşlem zamanı",
        ornek: "2025-06-17T10:30:00Z"
      },
      {
        alan: "ip",
        aciklama: "Kullanıcı IP adresi",
        ornek: "192.168.1.100"
      },
      {
        alan: "userAgent",
        aciklama: "Tarayıcı bilgisi",
        ornek: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      },
      {
        alan: "result",
        aciklama: "İşlem sonucu",
        ornek: "{ success: true, message: 'İşlem başarılı' }"
      }
    ],
    hata_alanlari: [
      {
        alan: "error",
        aciklama: "Hata detayları",
        ornek: "{ code: 500, message: 'Internal Server Error', stack: '...' }"
      },
      {
        alan: "context",
        aciklama: "Hata bağlamı",
        ornek: "{ function: 'updateMalzeme', params: {...} }"
      }
    ]
  },

  // API Endpoints
  api_endpoints: [
    {
      method: "GET",
      endpoint: "/api/audit",
      aciklama: "Audit log kayıtlarını listele",
      parametreler: ["page", "limit", "level", "user", "startDate", "endDate", "service", "route"]
    },
    {
      method: "GET",
      endpoint: "/api/audit/:id",
      aciklama: "Belirli bir audit log kaydını getir",
      parametreler: ["id"]
    },
    {
      method: "POST",
      endpoint: "/api/audit/search",
      aciklama: "Gelişmiş audit log arama",
      gerekli_alanlar: ["query"],
      opsiyonel_alanlar: ["filters", "dateRange", "level"]
    },
    {
      method: "GET",
      endpoint: "/api/audit/dashboard",
      aciklama: "Audit dashboard verileri",
      cevap_formati: "İstatistikler ve grafikler"
    },
    {
      method: "POST",
      endpoint: "/api/audit/report",
      aciklama: "Audit raporu oluştur",
      gerekli_alanlar: ["reportType", "dateRange"],
      opsiyonel_alanlar: ["filters", "format"]
    },
    {
      method: "POST",
      endpoint: "/api/audit/archive",
      aciklama: "Log arşivleme işlemi",
      gerekli_alanlar: ["criteria"],
      yetki: ["Superadmin"]
    }
  ],

  // Yetki matrisi
  yetki_matrisi: {
    "Superadmin": {
      okuma: true,
      arama: true,
      raporlama: true,
      arsivleme: true,
      silme: true,
      sistem_ayarlari: true,
      compliance_raporlar: true
    },
    "Admin": {
      okuma: true,
      arama: true,
      raporlama: true,
      arsivleme: false,
      silme: false,
      sistem_ayarlari: false,
      compliance_raporlar: false
    },
    "User": {
      okuma: false,
      arama: false,
      raporlama: false,
      arsivleme: false,
      silme: false,
      sistem_ayarlari: false,
      compliance_raporlar: false
    },
    "Personel": {
      okuma: false,
      arama: false,
      raporlama: false,
      arsivleme: false,
      silme: false,
      sistem_ayarlari: false,
      compliance_raporlar: false
    }
  },

  // Sık kullanılan örnekler
  ornekler: {
    basarili_senaryolar: [
      {
        senaryo: "Kullanıcı giriş izleme",
        adimlar: "Ahmet Yılmaz sisteme giriş yaptı",
        log_icerik: "{ action: 'LOGIN', user: {...}, ip: '192.168.1.100', timestamp: '...' }"
      },
      {
        senaryo: "Malzeme güncelleme izleme",
        adimlar: "Dell laptop bilgileri güncellendi",
        log_icerik: "{ action: 'UPDATE', resource: 'malzeme', oldData: {...}, newData: {...} }"
      },
      {
        senaryo: "Güvenlik olayı tespiti",
        adimlar: "5 başarısız giriş denemesi tespit edildi",
        log_icerik: "{ level: 'WARNING', event: 'MULTIPLE_FAILED_LOGIN', count: 5 }"
      }
    ],
    hata_senaryolari: [
      {
        hata: "Database connection error",
        log_icerik: "{ level: 'ERROR', error: 'Connection timeout', service: 'malzeme' }",
        cozum: "Veritabanı bağlantısı kontrol edildi"
      },
      {
        hata: "Unauthorized access attempt",
        log_icerik: "{ level: 'WARNING', event: 'UNAUTHORIZED_ACCESS', endpoint: '/admin' }",
        cozum: "Güvenlik protokolleri gözden geçirildi"
      }
    ]
  },

  // İş kuralları
  is_kurallari: [
    {
      kural: "Log Değiştirilemezlik",
      aciklama: "Audit log kayıtları oluşturulduktan sonra değiştirilemez",
      ornek: "Hiçbir kullanıcı log içeriğini düzenleyemez"
    },
    {
      kural: "Otomatik Log Oluşturma",
      aciklama: "Tüm CRUD işlemleri otomatik log oluşturur",
      ornek: "Malzeme ekleme işlemi otomatik olarak log kaydı oluşturur"
    },
    {
      kural: "Retention Policy",
      aciklama: "Log kayıtları belirli sürelerle saklanır",
      ornek: "INFO loglar 30 gün, ERROR loglar 1 yıl saklanır"
    },
    {
      kural: "Privacy Protection",
      aciklama: "Hassas veriler log'da şifrelenir veya maskelenir",
      ornek: "Şifre bilgileri hiçbir zaman log'a yazılmaz"
    }
  ],

  // Log kategorileri
  log_kategorileri: {
    authentication: {
      aciklama: "Kimlik doğrulama işlemleri",
      ornekler: ["LOGIN", "LOGOUT", "PASSWORD_CHANGE", "ROLE_CHANGE"]
    },
    crud_operations: {
      aciklama: "Veri işlem operasyonları",
      ornekler: ["CREATE", "READ", "UPDATE", "DELETE"]
    },
    security_events: {
      aciklama: "Güvenlik olayları",
      ornekler: ["UNAUTHORIZED_ACCESS", "FAILED_LOGIN", "PRIVILEGE_ESCALATION"]
    },
    system_events: {
      aciklama: "Sistem olayları",
      ornekler: ["SYSTEM_START", "SYSTEM_STOP", "BACKUP", "MAINTENANCE"]
    },
    business_logic: {
      aciklama: "İş mantığı işlemleri",
      ornekler: ["MALZEME_ZIMMET", "TUTANAK_OLUSTUR", "TRANSFER"]
    }
  },

  // Performans notları
  performans: {
    optimizasyonlar: [
      "Tarih bazlı indeksleme",
      "Log seviyesi indeksleme",
      "Kullanıcı ID indeksleme",
      "Async log yazma",
      "Batch log processing",
      "Log rotation sistemi"
    ],
    limitler: [
      "Sayfa başına maksimum 100 log",
      "Arama sonuçları maksimum 5000 kayıt",
      "Log retention maksimum 7 yıl",
      "Real-time monitoring 1000 kayıt/saniye"
    ]
  },

  // İpuçları ve öneriler
  ipuclari: [
    "Log seviyelerini doğru kullanarak performansı optimize edin",
    "Kritik işlemler için her zaman detaylı log tutun",
    "Düzenli olarak güvenlik loglarını inceleyin",
    "Arşivleme politikalarını düzenli gözden geçirin",
    "Real-time monitoring ile anormal aktiviteleri takip edin",
    "Compliance gereksinimleri için log retention sürelerini ayarlayın"
  ],

  // Sorun giderme
  sorun_giderme: [
    {
      problem: "Log kayıtları görünmüyor",
      cozumler: [
        "Yetki seviyenizi kontrol edin",
        "Tarih filtrelerini kontrol edin",
        "Log seviyesi filtrelerini kontrol edin",
        "Sistem yöneticisine başvurun"
      ]
    },
    {
      problem: "Arama sonuç vermiyor",
      cozumler: [
        "Arama kriterlerinizi genişletin",
        "Tarih aralığını kontrol edin",
        "Log indekslerinin çalıştığını kontrol edin",
        "Cache'i temizleyip tekrar deneyin"
      ]
    },
    {
      problem: "Rapor oluşturulamıyor",
      cozumler: [
        "Rapor yetkisinin olduğunu kontrol edin",
        "Veri miktarını azaltın",
        "Farklı format deneyin",
        "Sistem kaynaklarını kontrol edin"
      ]
    }
  ],

  // Entegrasyon bilgileri
  entegrasyonlar: [
    {
      modul: "Tüm Modüller",
      ilişki: "Audit sistemi tüm modülleri izler",
      detay: "Her modüldeki işlemler otomatik olarak log kaydı oluşturur"
    },
    {
      modul: "Authentication",
      ilişki: "Giriş/çıkış işlemleri izlenir",
      detay: "Kimlik doğrulama işlemleri detaylı olarak log'lanır"
    },
    {
      modul: "Security",
      ilişki: "Güvenlik olayları izlenir",
      detay: "Şüpheli aktiviteler otomatik tespit edilir ve log'lanır"
    },
    {
      modul: "External APIs",
      ilişki: "Dış sistem entegrasyonları için",
      detay: "SIEM sistemleri ile entegrasyon için API desteği"
    }
  ],

  // Son güncellenme
  versiyon: "1.0.0",
  son_guncelleme: "2025-06-17",
  hazırlayan: "Sistem Yöneticisi"
};