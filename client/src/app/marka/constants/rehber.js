// client/src/app/marka/rehber.js

import { Package, Plus, Edit, Trash2, Eye, Search, Filter, Download, Upload, Settings } from 'lucide-react';

export const MarkaRehber = {
  // Modül temel bilgileri
  modul: {
    ad: "Marka Yönetimi",
    aciklama: "Sistem içerisindeki tüm marka bilgilerinin yönetimi ve organizasyonu",
    icon: Package,
    kategori: "Malzeme Yönetimi",
    oncelik: "Yüksek",
    bagimlilık: ["Model", "Malzeme"]
  },

  // Ana özellikler ve işlemler
  ozellikler: [
    {
      baslik: "Marka Ekleme",
      aciklama: "Sisteme yeni marka kaydı oluşturma",
      icon: Plus,
      yetki: ["Admin", "User"],
      adimlar: [
        "Ana sayfada 'Yeni Marka Ekle' butonuna tıklayın",
        "Marka adını giriniz (zorunlu)",
        "Açıklama ekleyiniz (opsiyonel)",
        "Formu onaylayıp kaydedin"
      ],
      notlar: [
        "Marka adı benzersiz olmalıdır",
        "Maksimum 100 karakter sınırı vardır",
        "Türkçe karakterler desteklenir"
      ]
    },
    {
      baslik: "Marka Düzenleme",
      aciklama: "Mevcut marka bilgilerini güncelleme",
      icon: Edit,
      yetki: ["Admin", "User"],
      adimlar: [
        "Markalar listesinden düzenlemek istediğiniz markayı bulun",
        "Satır üzerindeki 'Düzenle' butonuna tıklayın",
        "Bilgileri güncelleyiniz",
        "Değişiklikleri kaydedin"
      ],
      notlar: [
        "Marka adı değiştirilirken benzersizlik kontrolü yapılır",
        "Bu markaya bağlı modeller varsa dikkatli olunmalıdır"
      ]
    },
    {
      baslik: "Marka Silme",
      aciklama: "Sistemden marka kaydını kaldırma",
      icon: Trash2,
      yetki: ["Admin"],
      adimlar: [
        "Silinecek markayı listeden seçin",
        "Silme butonuna tıklayın",
        "Onay mesajını kabul edin"
      ],
      notlar: [
        "Bu markaya bağlı modeller varsa silme işlemi yapılamaz",
        "Bu markaya bağlı malzemeler varsa silme işlemi yapılamaz",
        "Silinen veriler geri getirilemez"
      ],
      uyarilar: [
        "UYARI: Bu işlem geri alınamaz!",
        "Önce ilişkili kayıtları kontrol edin"
      ]
    },
    {
      baslik: "Marka Detayları",
      aciklama: "Marka bilgilerini ayrıntılı görüntüleme",
      icon: Eye,
      yetki: ["Admin", "User", "Personel"],
      adimlar: [
        "Markalar listesinden görüntülemek istediğiniz markayı bulun",
        "Detay butonuna tıklayın",
        "Marka bilgilerini ve ilişkili modelleri inceleyin"
      ],
      gosterilen_bilgiler: [
        "Marka adı ve açıklaması",
        "Oluşturulma tarihi ve kullanıcısı",
        "Son güncellenme bilgileri",
        "Bu markaya ait modeller listesi",
        "Bu markaya ait toplam malzeme sayısı",
        "Durum bilgisi (Aktif/Pasif)"
      ]
    },
    {
      baslik: "Arama ve Filtreleme",
      aciklama: "Markalar arasında hızlı arama ve filtreleme",
      icon: Search,
      yetki: ["Admin", "User", "Personel"],
      ozellikler: [
        "Marka adına göre anlık arama",
        "Durum bazında filtreleme (Aktif/Pasif)",
        "Oluşturulma tarihine göre sıralama",
        "Model sayısına göre filtreleme",
        "Gelişmiş arama kriterleri"
      ],
      ipuclari: [
        "Arama kutusu Türkçe karakterleri destekler",
        "En az 2 karakter yazarak arama yapabilirsiniz",
        "Filtreler birlikte kullanılabilir"
      ]
    }
  ],

  // Veri modeli
  veri_modeli: {
    tablo_adi: "Marka",
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
        aciklama: "Marka adı (benzersiz)"
      },
      {
        alan: "aciklama",
        tip: "String",
        zorunlu: false,
        aciklama: "Marka hakkında açıklama"
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
    ]
  },

  // İlişkiler
  iliskiler: [
    {
      tip: "OneToMany",
      hedef: "Model",
      aciklama: "Bir markaya birden fazla model bağlı olabilir",
      alan: "modeller",
      cascade: "Restrict", // Marka silinirken modeller varsa işlem engellenir
      ornekler: [
        "Dell markasına Latitude 5520, OptiPlex 7090 modelleri bağlı",
        "HP markasına LaserJet Pro, EliteBook modelleri bağlı"
      ]
    },
    {
      tip: "OneToMany",
      hedef: "Malzeme",
      aciklama: "Bir markaya birden fazla malzeme bağlı olabilir",
      alan: "malzemeler",
      cascade: "Restrict",
      ornekler: [
        "Dell markasına 150 adet laptop malzemesi",
        "HP markasına 75 adet yazıcı malzemesi"
      ]
    }
  ],

  // API Endpoints
  api_endpoints: [
    {
      method: "GET",
      endpoint: "/api/marka",
      aciklama: "Tüm markaları listele",
      parametreler: ["page", "limit", "search", "status"]
    },
    {
      method: "GET",
      endpoint: "/api/marka/:id",
      aciklama: "Belirli bir markayı getir",
      parametreler: ["id"]
    },
    {
      method: "POST",
      endpoint: "/api/marka",
      aciklama: "Yeni marka oluştur",
      gerekli_alanlar: ["ad"],
      opsiyonel_alanlar: ["aciklama"]
    },
    {
      method: "PUT",
      endpoint: "/api/marka/:id",
      aciklama: "Marka bilgilerini güncelle",
      parametreler: ["id"],
      guncellenebilir_alanlar: ["ad", "aciklama"]
    },
    {
      method: "DELETE",
      endpoint: "/api/marka/:id",
      aciklama: "Markayı sil",
      parametreler: ["id"],
      sartlar: ["İlişkili modeller olmamalı", "İlişkili malzemeler olmamalı"]
    }
  ],

  // Yetki matrisi
  yetki_matrisi: {
    "Superadmin": {
      okuma: true,
      ekleme: true,
      guncelleme: true,
      silme: true,
      durum_degistirme: true
    },
    "Admin": {
      okuma: true,
      ekleme: true,
      guncelleme: true,
      silme: true,
      durum_degistirme: true
    },
    "User": {
      okuma: true,
      ekleme: true,
      guncelleme: true,
      silme: false,
      durum_degistirme: false
    },
    "Personel": {
      okuma: true,
      ekleme: false,
      guncelleme: false,
      silme: false,
      durum_degistirme: false
    }
  },

  // Sık kullanılan örnekler
  ornekler: {
    basarili_senaryolar: [
      {
        senaryo: "Yeni marka ekleme",
        adimlar: "Dell markası sisteme başarıyla eklendi",
        sonuc: "Marka listesinde görünür hale geldi"
      },
      {
        senaryo: "Model ekleme",
        adimlar: "Dell markasına Latitude 5520 modeli eklendi",
        sonuc: "Model, Dell markası altında listelendi"
      }
    ],
    hata_senaryolari: [
      {
        hata: "Duplicate entry error",
        sebep: "Aynı isimde marka zaten mevcut",
        cozum: "Farklı bir marka adı seçin"
      },
      {
        hata: "Foreign key constraint",
        sebep: "Bu markaya bağlı modeller var",
        cozum: "Önce ilişkili modelleri silin"
      }
    ]
  },

  // Performans notları
  performans: {
    optimizasyonlar: [
      "Marka adı üzerinde indeks bulunur",
      "Sayfalama (pagination) desteklenir",
      "Lazy loading uygulanır"
    ],
    limitler: [
      "Sayfa başına maksimum 50 kayıt",
      "Arama sonuçları maksimum 1000 kayıt",
      "API rate limit: dakikada 100 istek"
    ]
  },

  // İpuçları ve öneriler
  ipuclari: [
    "Marka adlarını standart formatta yazın (örn: 'DELL' yerine 'Dell')",
    "Açıklama alanını marka hakkında faydalı bilgiler için kullanın",
    "Sık kullanılan markaları favori olarak işaretleyebilirsiniz",
    "Marka silmeden önce mutlaka ilişkili kayıtları kontrol edin"
  ],

  // Sorun giderme
  sorun_giderme: [
    {
      problem: "Marka eklenemiyor",
      cozumler: [
        "Marka adının benzersiz olduğunu kontrol edin",
        "Gerekli alanların doldurulduğunu kontrol edin",
        "Ağ bağlantınızı kontrol edin"
      ]
    },
    {
      problem: "Marka silinemiyor",
      cozumler: [
        "Bu markaya bağlı modelleri kontrol edin",
        "Bu markaya bağlı malzemeleri kontrol edin",
        "Yetkinizin silme işlemi için yeterli olduğunu kontrol edin"
      ]
    }
  ],

  // Son güncellenme
  versiyon: "1.0.0",
  son_guncelleme: "2025-06-17",
  hazırlayan: "Sistem Yöneticisi"
};