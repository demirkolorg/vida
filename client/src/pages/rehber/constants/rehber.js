// client/src/pages/rehber/constants/rehber.js

// Bu dosyayı şuraya koyun: client/src/pages/rehber/constants/rehber.js

import { 
  BookOpen, 
  Layers, 
  Database, 
  Shield, 
  Users, 
  Package, 
  Settings, 
  BarChart3, 
  Globe, 
  Key, 
  Code, 
  GitBranch,
  Server,
  Monitor,
  Zap,
  FileText,
  CheckCircle,
  Info,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

export const ProjeRehber = {
  // Proje temel bilgileri
  modul: {
    ad: "VIDA - Malzeme Takip Sistemi",
    aciklama: "Emniyet Teşkilatı için geliştirilmiş kapsamlı malzeme ve zimmet takip sistemi",
    icon: BookOpen,
    kategori: "Ana Sistem",
    oncelik: "Kritik",
    versiyon: "2.0.0",
    tip: "Proje Genel Rehberi"
  },

  // Proje genel açıklama
  genel_aciklama: {
    amac: "Emniyet Teşkilatı'nın tüm malzeme, zimmet ve personel takip işlemlerini dijitalleştirmek ve merkezi bir sistemde yönetmek",
    hedef_kullanici: "Emniyet personeli, sistem yöneticileri, malzeme sorumlular",
    kapsam: "Malzeme kaydı, zimmet takibi, hareket izleme, raporlama, tutanak oluşturma ve sistem yönetimi",
    avantajlar: [
      "Merkezi malzeme takip sistemi",
      "Gerçek zamanlı zimmet durumu",
      "Otomatik tutanak oluşturma",
      "Kapsamlı raporlama sistemi",
      "Kullanıcı dostu arayüz",
      "Mobil uyumlu tasarım",
      "Güvenli veri saklama",
      "Audit log ile izlenebilirlik"
    ]
  },

  // Teknoloji Stack
  teknoloji_stack: {
    frontend: {
      framework: "React 19.0.0",
      ui_kutuphanesi: "Radix UI + Tailwind CSS",
      state_yonetimi: "Zustand",
      routing: "React Router DOM",
      form_yonetimi: "React Hook Form + Zod",
      tarih_islemleri: "date-fns",
      ikonlar: "Lucide React",
      tema: "next-themes (Dark/Light mode)",
      grafik: "Recharts",
      pdf: "jsPDF, react-to-print",
      excel: "XLSX",
      build_tool: "Vite"
    },
    backend: {
      runtime: "Node.js",
      framework: "Express.js",
      veritabani: "PostgreSQL + Prisma ORM",
      kimlik_dogrulama: "JWT (JSON Web Tokens)",
      guvenlik: "Helmet, CORS, Rate Limiting",
      loglama: "Morgan, Custom Error Handler",
      api_dokumantasyon: "Swagger",
      sifreleme: "bcrypt",
      test: "Jest, Supertest"
    },
    gelistirme_araclari: {
      linter: "ESLint",
      formatter: "Prettier",
      type_checking: "TypeScript",
      package_manager: "npm",
      version_control: "Git",
      database_tool: "Prisma Studio"
    }
  },

  // Sistem Mimarisi
  sistem_mimarisi: {
    katmanlar: [
      {
        katman: "Sunum Katmanı (Frontend)",
        teknoloji: "React + Vite",
        sorumluluk: "Kullanıcı arayüzü, etkileşimler, görsel sunumlama",
        bilesenler: ["Sayfalar", "Bileşenler", "Store yönetimi", "Routing"]
      },
      {
        katman: "API Katmanı (Backend)",
        teknoloji: "Express.js",
        sorumluluk: "İş mantığı, API endpoint'leri, kimlik doğrulama",
        bilesenler: ["Route'lar", "Controller'lar", "Middleware'ler", "Services"]
      },
      {
        katman: "Veri Katmanı (Database)",
        teknoloji: "PostgreSQL + Prisma",
        sorumluluk: "Veri saklama, sorgulama, ilişki yönetimi",
        bilesenler: ["Tablolar", "İlişkiler", "İndeksler", "Constraint'ler"]
      }
    ],
    iletisim: "RESTful API ile JSON formatında veri alışverişi",
    guvenlik: "JWT tabanlı kimlik doğrulama ve yetkilendirme sistemi"
  },

  // Ana Modüller
  ana_moduller: [
    {
      modul: "Personel Yönetimi",
      aciklama: "Emniyet personellerinin kayıt, düzenleme ve takip işlemleri",
      ozellikler: ["Personel CRUD", "Sicil takibi", "Organizasyonel hiyerarşi", "Yetki yönetimi"],
      bagimlilık: ["Birim", "Şube", "Büro"]
    },
    {
      modul: "Malzeme Yönetimi",
      aciklama: "Tüm malzemelerin kayıt, takip ve yönetim işlemleri",
      ozellikler: ["Malzeme CRUD", "Kategorizasyon", "Kondisyon takibi", "Seri no yönetimi"],
      bagimlilık: ["Marka", "Model", "Sabit Kod", "Birim"]
    },
    {
      modul: "Zimmet Takibi",
      aciklama: "Malzemelerin personellere zimmetlenmesi ve takibi",
      ozellikler: ["Zimmet atama", "İade işlemleri", "Geçmiş takibi", "Durum kontrolü"],
      bagimlilık: ["Malzeme", "Personel", "Konum"]
    },
    {
      modul: "Hareket İzleme",
      aciklama: "Tüm malzeme hareketlerinin detaylı takibi",
      ozellikler: ["Hareket kayıtları", "Timeline görünümü", "Filtreleme", "Raporlama"],
      bagimlilık: ["Malzeme", "Personel", "Depo", "Konum"]
    },
    {
      modul: "Tutanak Sistemi",
      aciklama: "Otomatik tutanak oluşturma ve yönetimi",
      ozellikler: ["Template sistemi", "PDF oluşturma", "İmza takibi", "Arşivleme"],
      bagimlilık: ["Malzeme", "Personel", "Hareket"]
    },
    {
      modul: "Raporlama",
      aciklama: "Kapsamlı rapor oluşturma ve analiz araçları",
      ozellikler: ["Dinamik raporlar", "Export (PDF/Excel)", "Grafik analiz", "Özel filtreler"],
      bagimlilık: ["Tüm modüller"]
    },
    {
      modul: "Sistem Yönetimi",
      aciklama: "Kullanıcı yönetimi, ayarlar ve sistem konfigürasyonu",
      ozellikler: ["Kullanıcı rolleri", "Sistem ayarları", "Backup", "Audit logs"],
      bagimlilık: ["Auth", "Database"]
    }
  ],

  // Destekleyici Modüller
  destekleyici_moduller: [
    {
      modul: "Organizasyon Yapısı",
      bilesenler: ["Birim", "Şube", "Büro"],
      aciklama: "Emniyet Teşkilatı'nın hiyerarşik yapısının dijital reprezentasyonu"
    },
    {
      modul: "Kategorizasyon",
      bilesenler: ["Marka", "Model", "Sabit Kod"],
      aciklama: "Malzemelerin sistematik sınıflandırılması"
    },
    {
      modul: "Lokasyon Yönetimi",
      bilesenler: ["Depo", "Konum"],
      aciklama: "Fiziksel mekan ve lokasyon takibi"
    },
    {
      modul: "Arama ve Navigasyon",
      bilesenler: ["Global Search", "Filtreler"],
      aciklama: "Sistemde hızlı arama ve navigasyon imkanları"
    }
  ],

  // Kullanıcı Rolleri ve Yetkiler
  kullanici_rolleri: {
    "Superadmin": {
      aciklama: "Sistem genelinde tam yetki",
      yetkiler: ["Tüm CRUD işlemleri", "Sistem ayarları", "Kullanıcı yönetimi", "Backup/Restore", "Audit log erişimi"],
      kisitlamalar: ["Yok"]
    },
    "Admin": {
      aciklama: "Modül bazında yönetici yetkisi",
      yetkiler: ["Çoğu CRUD işlemleri", "Raporlama", "Tutanak oluşturma", "Malzeme yönetimi"],
      kisitlamalar: ["Sistem ayarları", "Kullanıcı silme", "Kritik sistem işlemleri"]
    },
    "User": {
      aciklama: "Standart kullanıcı yetkisi",
      yetkiler: ["Okuma", "Sınırlı ekleme/düzenleme", "Raporlama", "Tutanak görüntüleme"],
      kisitlamalar: ["Silme işlemleri", "Kritik ayarlar", "Sistem yönetimi"]
    },
    "Personel": {
      aciklama: "Temel kullanıcı yetkisi",
      yetkiler: ["Okuma", "Kendi zimmetlerini görüntüleme", "Sınırlı raporlama"],
      kisitlamalar: ["Düzenleme", "Silme", "Sistem ayarları", "Diğer kullanıcı bilgileri"]
    }
  },

  // Güvenlik Özellikleri
  guvenlik_ozellikleri: [
    {
      ozellik: "Kimlik Doğrulama",
      aciklama: "JWT tabanlı güvenli giriş sistemi",
      uygulama: "Access token (15 dk) + Refresh token sistemi",
      koruma: "Brute force, session hijacking"
    },
    {
      ozellik: "Yetkilendirme",
      aciklama: "Rol tabanlı erişim kontrolü (RBAC)",
      uygulama: "Route ve API seviyesinde yetki kontrolü",
      koruma: "Yetkisiz erişim, privilege escalation"
    },
    {
      ozellik: "Veri Güvenliği",
      aciklama: "Şifreleme ve güvenli veri saklama",
      uygulama: "bcrypt ile şifre hash'leme, HTTPS zorunluluğu",
      koruma: "Veri sızıntısı, man-in-the-middle saldırıları"
    },
    {
      ozellik: "API Güvenliği",
      aciklama: "Rate limiting ve güvenlik başlıkları",
      uygulama: "Helmet.js, CORS, Rate limiting middleware",
      koruma: "DoS saldırıları, XSS, CSRF"
    },
    {
      ozellik: "Audit Trail",
      aciklama: "Tüm sistem işlemlerinin kayıt altına alınması",
      uygulama: "Detaylı log sistemi, user action tracking",
      koruma: "İzlenebilirlik, sorumluluk takibi"
    }
  ],

  // Performans ve Optimizasyon
  performans_ozellikleri: [
    {
      alan: "Frontend Optimizasyonu",
      teknikler: ["Code splitting", "Lazy loading", "Virtual scrolling", "Memoization"],
      hedef: "Hızlı sayfa yükleme ve smooth UX"
    },
    {
      alan: "Backend Optimizasyonu",
      teknikler: ["Database indexing", "Query optimization", "Caching", "Connection pooling"],
      hedef: "Hızlı API response time"
    },
    {
      alan: "Database Optimizasyonu",
      teknikler: ["İndeks stratejisi", "Query optimization", "Normalizasyon", "Pagination"],
      hedef: "Verimli veri erişimi"
    },
    {
      alan: "Network Optimizasyonu",
      teknikler: ["Gzip compression", "CDN kullanımı", "Asset minification", "HTTP/2"],
      hedef: "Düşük bandwidth kullanımı"
    }
  ],

  // Kurulum ve Başlangıç
  kurulum_rehberi: {
    on_gereksinimler: [
      "Node.js (v18 veya üzeri)",
      "PostgreSQL (v12 veya üzeri)",
      "Git",
      "npm veya yarn"
    ],
    kurulum_adimlari: [
      "Repository'yi klonlayın: git clone [repo-url]",
      "Dependencies'leri yükleyin: npm install",
      "Environment variables'ları ayarlayın (.env dosyası)",
      "Database'i setup edin: npm run prisma:migrate",
      "Seed data'yı yükleyin: npm run db:seed",
      "Development server'ı başlatın: npm run dev"
    ],
    onemli_dosyalar: [
      ".env - Environment variables",
      "server/prisma/schema.prisma - Database schema",
      "package.json - Dependencies ve scriptler",
      "client/src/stores/ - Global state management",
      "server/routes/ - API endpoints"
    ]
  },

  // Geliştirilme Süreci
  gelistirme_sureci: {
    metodoloji: "Agile/Scrum",
    kod_standartlari: [
      "ESLint ve Prettier kullanımı",
      "TypeScript type checking",
      "Component-based architecture",
      "RESTful API design",
      "Git commit conventions"
    ],
    test_stratejisi: [
      "Unit tests (Jest)",
      "Integration tests",
      "API endpoint tests",
      "Manual UI testing",
      "Performance testing"
    ],
    deployment: [
      "Production build creation",
      "Database migration",
      "Environment configuration",
      "Security hardening",
      "Performance monitoring"
    ]
  },

  // Sistem Limitleri
  sistem_limitleri: {
    kullanici_limitleri: [
      "Maksimum eşzamanlı kullanıcı: 100",
      "Session timeout: 8 saat",
      "API rate limit: dakikada 100 istek",
      "File upload limit: 10MB"
    ],
    veri_limitleri: [
      "Sayfa başına maksimum kayıt: 50",
      "Arama sonuçları: maksimum 1000 kayıt",
      "Export limit: 10,000 kayıt",
      "Bulk operation: maksimum 500 kayıt"
    ],
    performans_hedefleri: [
      "Sayfa yükleme süresi: < 2 saniye",
      "API response time: < 500ms",
      "Database query time: < 100ms",
      "File upload time: < 30 saniye"
    ]
  },

  // Sorun Giderme
  sorun_giderme: [
    {
      problem: "Sistem yavaş çalışıyor",
      muhtemel_sebepler: ["Database indexing", "Network latency", "Heavy queries", "Memory leak"],
      cozumler: ["Query optimization", "Index ekleme", "Cache kullanımı", "Performance monitoring"]
    },
    {
      problem: "Login olmuyor",
      muhtemel_sebepler: ["JWT expire", "Network error", "Database connection", "Wrong credentials"],
      cozumler: ["Token refresh", "Network check", "Database restart", "Password reset"]
    },
    {
      problem: "Veri kaybı",
      muhtemel_sebepler: ["Database crash", "Network interruption", "User error", "System bug"],
      cozumler: ["Backup restore", "Transaction rollback", "Data recovery", "Bug fix"]
    },
    {
      problem: "Yetki hatası",
      muhtemel_sebepler: ["Role misconfiguration", "JWT decode error", "Session expire", "Database sync"],
      cozumler: ["Role check", "Token validation", "Re-login", "Database sync"]
    }
  ],

  // Gelecek Planları
  gelecek_planlari: [
    {
      versiyon: "v2.1",
      ozellikler: ["Mobil uygulama", "Offline sync", "Advanced analytics", "Auto backup"],
      timeline: "Q2 2025"
    },
    {
      versiyon: "v2.2",
      ozellikler: ["AI-powered predictions", "Advanced automation", "Third-party integrations", "Enhanced security"],
      timeline: "Q3 2025"
    },
    {
      versiyon: "v3.0",
      ozellikler: ["Microservices architecture", "Cloud deployment", "Multi-tenancy", "Real-time collaboration"],
      timeline: "Q4 2025"
    }
  ],

  // İletişim ve Destek
  destek_bilgileri: {
    teknik_destek: "Sistem Yöneticisi",
    dokumantasyon: "README.md ve API documentation",
    bug_raporlama: "GitHub Issues veya internal bug tracking",
    feature_request: "Product Owner ile iletişim",
    acil_durum: "7/24 teknik destek hattı"
  },

  // İpuçları
  ipuclari: [
    "Düzenli olarak sistem yedeklerini alın",
    "Kullanıcı eğitimlerini eksik bırakmayın",
    "Performance metrikleri takip edin",
    "Security update'lerini kaçırmayın",
    "Database maintenance'ı düzenli yapın",
    "Log dosyalarını düzenli kontrol edin",
    "User feedback'lerini ciddiye alın",
    "Sistemin kapasitesini sürekli izleyin"
  ],

  // Son güncellenme
  versiyon: "2.0.0",
  son_guncelleme: "2025-06-17",
  hazırlayan: "VIDA Geliştirme Ekibi"
};