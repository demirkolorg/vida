// client/src/app/birim/rehber.js

import { Building2, Plus, Edit, Trash2, Eye, Search, Filter, Download, Upload, Settings, Users } from 'lucide-react';

export const BirimRehber = {
  // Modül temel bilgileri
  modul: {
    ad: "Birim Yönetimi",
    aciklama: "Organizasyonel yapının en üst seviyesi olan birimlerin yönetimi",
    icon: Building2,
    kategori: "Organizasyon Yönetimi",
    oncelik: "Yüksek",
    bagimlilık: ["Şube", "Personel", "Malzeme"]
  },

  // Ana özellikler ve işlemler
  ozellikler: [
    {
      baslik: "Birim Ekleme",
      aciklama: "Sisteme yeni birim kaydı oluşturma",
      icon: Plus,
      yetki: ["Admin", "Superadmin"],
      adimlar: [
        "Ana sayfada 'Yeni Birim Ekle' butonuna tıklayın",
        "Birim adını giriniz (zorunlu)",
        "Açıklama ekleyiniz (opsiyonel)",
        "Formu onaylayıp kaydedin"
      ],
      notlar: [
        "Birim adı benzersiz olmalıdır",
        "Maksimum 100 karakter sınırı vardır",
        "Türkçe karakterler desteklenir",
        "Birim adı organizasyon şemasında görünecektir"
      ]
    },
    {
      baslik: "Birim Düzenleme",
      aciklama: "Mevcut birim bilgilerini güncelleme",
      icon: Edit,
      yetki: ["Admin", "Superadmin"],
      adimlar: [
        "Birimler listesinden düzenlemek istediğiniz birimi bulun",
        "Satır üzerindeki 'Düzenle' butonuna tıklayın",
        "Birim adını güncelleyiniz",
        "Açıklama bilgisini güncelleyiniz",
        "Değişiklikleri kaydedin"
      ],
      notlar: [
        "Birim adı değiştirilirken benzersizlik kontrolü yapılır",
        "Bu birime bağlı şubeler varsa dikkatli olunmalıdır",
        "Alt yapı değişiklikleri personel ve malzeme kayıtlarını etkileyebilir"
      ]
    },
    {
      baslik: "Birim Silme",
      aciklama: "Sistemden birim kaydını kaldırma",
      icon: Trash2,
      yetki: ["Superadmin"],
      adimlar: [
        "Silinecek birimi listeden seçin",
        "Silme butonuna tıklayın",
        "Onay mesajını kabul edin"
      ],
      notlar: [
        "Bu birime bağlı şubeler varsa silme işlemi yapılamaz",
        "Bu birime ait personeller varsa silme işlemi yapılamaz",
        "Bu birime ait malzemeler varsa silme işlemi yapılamaz"
      ],
      uyarilar: [
        "UYARI: Bu işlem geri alınamaz!",
        "Önce tüm alt bağlantıları kontrol edin",
        "Organizasyon yapısını bozabilir"
      ]
    },
    {
      baslik: "Birim Detayları",
      aciklama: "Birim bilgilerini ve alt yapıları görüntüleme",
      icon: Eye,
      yetki: ["Admin", "User", "Personel"],
      adimlar: [
        "Birimler listesinden görüntülemek istediğiniz birimi bulun",
        "Detay butonuna tıklayın",
        "Birim bilgilerini ve bağlı kayıtları inceleyin"
      ],
      gosterilen_bilgiler: [
        "Birim adı ve açıklaması",
        "Oluşturulma tarihi ve kullanıcısı",
        "Son güncellenme bilgileri",
        "Bu birime bağlı şubeler listesi",
        "Bu birime ait personel sayısı",
        "Bu birime ait malzeme sayısı",
        "Durum bilgisi (Aktif/Pasif)",
        "Organizasyon hiyerarşisindeki konumu"
      ]
    },
    {
      baslik: "Arama ve Filtreleme",
      aciklama: "Birimler arasında hızlı arama ve filtreleme",
      icon: Search,
      yetki: ["Admin", "User", "Personel"],
      ozellikler: [
        "Birim adına göre anlık arama",
        "Durum bazında filtreleme (Aktif/Pasif)",
        "Oluşturulma tarihine göre sıralama",
        "Şube sayısına göre filtreleme",
        "Personel sayısına göre filtreleme",
        "Malzeme sayısına göre filtreleme"
      ],
      ipuclari: [
        "Arama kutusu Türkçe karakterleri destekler",
        "En az 2 karakter yazarak arama yapabilirsiniz",
        "Filtreler birlikte kullanılabilir",
        "Hızlı erişim için sık kullanılan birimleri favori yapın"
      ]
    },
    {
      baslik: "Organizasyon Hiyerarşisi",
      aciklama: "Birim-Şube-Büro yapısını görüntüleme",
      icon: Filter,
      yetki: ["Admin", "User", "Personel"],
      ozellikler: [
        "Ağaç yapısında organizasyon görünümü",
        "Her seviyede personel ve malzeme sayıları",
        "Genişletilebilir/daraltılabilir yapı",
        "Hızlı navigasyon ve erişim",
        "Organizasyon şeması export özelliği"
      ],
      ipuclari: [
        "Hiyerarşi görünümü büyük organizasyonlarda faydalıdır",
        "Birim başlıklarına tıklayarak alt yapıları görün",
        "İstatistikler gerçek zamanlı güncellenir"
      ]
    },
    {
      baslik: "Toplu İşlemler",
      aciklama: "Birden fazla birim üzerinde işlem yapma",
      icon: Settings,
      yetki: ["Superadmin"],
      ozellikler: [
        "Toplu durum güncelleme",
        "Toplu açıklama güncelleme",
        "Excel'e toplu export",
        "Excel'den toplu import",
        "Organizasyon şeması export"
      ],
      notlar: [
        "Toplu işlemler öncesi yedek alın",
        "İşlem öncesi onay ekranı gösterilir",
        "Hatalı kayıtlar detaylı rapor edilir"
      ]
    },
    {
      baslik: "İstatistikler ve Raporlama",
      aciklama: "Birim bazında istatistik ve raporlar",
      icon: Download,
      yetki: ["Admin", "User"],
      ozellikler: [
        "Birim bazında personel dağılım raporu",
        "Birim bazında malzeme envanter raporu",
        "Organizasyon yapısı raporu",
        "Boş pozisyon analizi",
        "Maliyet merkezi raporları",
        "Performans göstergeleri"
      ],
      rapor_formatlari: ["PDF", "Excel", "CSV"],
      ipuclari: [
        "Raporlar gerçek zamanlı veriler içerir",
        "Tarih aralığı seçerek geçmiş analizler yapın",
        "Karşılaştırmalı raporlar için filtreler kullanın"
      ]
    }
  ],

  // Veri modeli
  veri_modeli: {
    tablo_adi: "Birim",
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
        aciklama: "Birim adı (benzersiz)"
      },
      {
        alan: "aciklama",
        tip: "String",
        zorunlu: false,
        aciklama: "Birim hakkında açıklama"
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
        aciklama: "Birim adı benzersizliği için"
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
      hedef: "Sube",
      aciklama: "Bir birime birden fazla şube bağlı olabilir",
      alan: "subeler",
      cascade: "Restrict",
      ornekler: [
        "Emniyet Genel Müdürlüğü altında İl Emniyet Müdürlükleri",
        "Merkez Birim altında İdari Şubeler"
      ]
    },
    {
      tip: "OneToMany",
      hedef: "Malzeme",
      aciklama: "Bir birime birden fazla malzeme bağlı olabilir (kuvve birimi)",
      alan: "malzemeler",
      cascade: "Restrict",
      ornekler: [
        "Asayiş Birimi'ne ait 150 adet araç",
        "Bilgi İşlem Birimi'ne ait 75 adet bilgisayar"
      ]
    }
  ],

  // API Endpoints
  api_endpoints: [
    {
      method: "GET",
      endpoint: "/api/birim",
      aciklama: "Tüm birimleri listele",
      parametreler: ["page", "limit", "search", "status"]
    },
    {
      method: "GET",
      endpoint: "/api/birim/:id",
      aciklama: "Belirli bir birimi getir",
      parametreler: ["id"]
    },
    {
      method: "POST",
      endpoint: "/api/birim",
      aciklama: "Yeni birim oluştur",
      gerekli_alanlar: ["ad"],
      opsiyonel_alanlar: ["aciklama"]
    },
    {
      method: "PUT",
      endpoint: "/api/birim/:id",
      aciklama: "Birim bilgilerini güncelle",
      parametreler: ["id"],
      guncellenebilir_alanlar: ["ad", "aciklama"]
    },
    {
      method: "DELETE",
      endpoint: "/api/birim/:id",
      aciklama: "Birimi sil",
      parametreler: ["id"],
      sartlar: ["İlişkili şubeler olmamalı", "İlişkili personeller olmamalı", "İlişkili malzemeler olmamalı"]
    },
    {
      method: "POST",
      endpoint: "/api/birim/search",
      aciklama: "Birim arama",
      gerekli_alanlar: ["query"],
      opsiyonel_alanlar: ["status"]
    },
    {
      method: "GET",
      endpoint: "/api/birim/:id/hierarchy",
      aciklama: "Birim hiyerarşisini getir",
      parametreler: ["id"],
      cevap_formati: "Ağaç yapısında organizasyon"
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
      hiyerarsi_yonetimi: true
    },
    "Admin": {
      okuma: true,
      ekleme: true,
      guncelleme: true,
      silme: false,
      durum_degistirme: true,
      toplu_islem: false,
      hiyerarsi_yonetimi: true
    },
    "User": {
      okuma: true,
      ekleme: false,
      guncelleme: false,
      silme: false,
      durum_degistirme: false,
      toplu_islem: false,
      hiyerarsi_yonetimi: false
    },
    "Personel": {
      okuma: true,
      ekleme: false,
      guncelleme: false,
      silme: false,
      durum_degistirme: false,
      toplu_islem: false,
      hiyerarsi_yonetimi: false
    }
  },

  // Sık kullanılan örnekler
  ornekler: {
    basarili_senaryolar: [
      {
        senaryo: "Yeni birim ekleme",
        adimlar: "Emniyet Genel Müdürlüğü birimi başarıyla eklendi",
        sonuc: "Birim listesinde görünür, şube ekleme için hazır"
      },
      {
        senaryo: "Organizasyon yapısı görüntüleme",
        adimlar: "Hiyerarşi görünümü açıldı, tüm birimler listelendi",
        sonuc: "Organizasyon şeması ağaç yapısında görüntülendi"
      },
      {
        senaryo: "Birim bazlı raporlama",
        adimlar: "Emniyet GM için personel raporu oluşturuldu",
        sonuc: "Birime ait 450 personel ve alt birimlerin raporu alındı"
      }
    ],
    hata_senaryolari: [
      {
        hata: "Duplicate unit name error",
        sebep: "Aynı isimde birim zaten mevcut",
        cozum: "Farklı bir birim adı seçin"
      },
      {
        hata: "Cannot delete unit",
        sebep: "Bu birime bağlı şubeler var",
        cozum: "Önce alt şubeleri silin veya başka birime taşıyın"
      },
      {
        hata: "Hierarchy loading failed",
        sebep: "Organizasyon yapısı yüklenirken hata",
        cozum: "Sayfa yenileme yapın veya sistem yöneticisine başvurun"
      }
    ]
  },

  // İş kuralları
  is_kurallari: [
    {
      kural: "Birim Adı Benzersizliği",
      aciklama: "Sistemde aynı isimde birden fazla birim olamaz",
      ornek: "İki tane 'Emniyet Genel Müdürlüğü' birimi oluşturulamaz"
    },
    {
      kural: "Hiyerarşik Bütünlük",
      aciklama: "Birim silinirken alt yapı kontrolü yapılır",
      ornek: "Şubesi olan birim silinmeden önce şubeler temizlenmeli"
    },
    {
      kural: "Durum Tutarlılığı",
      aciklama: "Pasif birime yeni şube eklenemez",
      ornek: "Kapatılmış birime yeni alt yapı oluşturulamaz"
    },
    {
      kural: "Yetki Kontrolü",
      aciklama: "Birim işlemleri yetki seviyesine göre sınırlanır",
      ornek: "Normal kullanıcı birim silemez, sadece Superadmin silebilir"
    }
  ],

  // Performans notları
  performans: {
    optimizasyonlar: [
      "Birim adı üzerinde unique indeks",
      "Durum alanı üzerinde indeks",
      "Sayfalama (pagination) desteklenir",
      "Hiyerarşi görünümü için cache",
      "Lazy loading uygulanır"
    ],
    limitler: [
      "Sayfa başına maksimum 50 kayıt",
      "Arama sonuçları maksimum 500 kayıt",
      "API rate limit: dakikada 100 istek",
      "Hiyerarşi cache süresi: 10 dakika"
    ]
  },

  // İpuçları ve öneriler
  ipuclari: [
    "Birim adlarını standart ve anlaşılır şekilde yazın",
    "Açıklama alanını birim görevleri için kullanın",
    "Organizasyon değişikliklerinden önce yedek alın",
    "Hiyerarşi görünümünü düzenli kontrol edin",
    "Birim silmeden önce mutlaka alt bağlantıları kontrol edin",
    "Yeni birim eklerken gelecekteki genişleme planlarını göz önünde bulundurun"
  ],

  // Sorun giderme
  sorun_giderme: [
    {
      problem: "Birim eklenemiyor",
      cozumler: [
        "Birim adının benzersiz olduğunu kontrol edin",
        "Gerekli alanların doldurulduğunu kontrol edin",
        "Yetkinizin yeterli olduğunu kontrol edin",
        "Ağ bağlantınızı kontrol edin"
      ]
    },
    {
      problem: "Birim silinemiyor",
      cozumler: [
        "Bu birime bağlı şubeleri kontrol edin",
        "Bu birime ait personelleri kontrol edin",
        "Bu birime ait malzemeleri kontrol edin",
        "Superadmin yetkisinin olduğunu kontrol edin"
      ]
    },
    {
      problem: "Hiyerarşi görünümü yüklenmiyor",
      cozumler: [
        "Cache'i temizleyip tekrar deneyin",
        "Sayfa yenileme işlemi yapın",
        "Tarayıcı geçmişini temizleyin",
        "Sistem yöneticisine başvurun"
      ]
    },
    {
      problem: "Arama sonuç vermiyor",
      cozumler: [
        "Arama kriterlerinizi kontrol edin",
        "Filtre ayarlarını sıfırlayın",
        "En az 2 karakter girdiğinizden emin olun",
        "Türkçe karakter kullanımına dikkat edin"
      ]
    }
  ],

  // Entegrasyon bilgileri
  entegrasyonlar: [
    {
      modul: "Şube",
      ilişki: "Birimler şubelerin üst seviyesidir",
      detay: "Şube ekleme sırasında birim seçimi zorunludur"
    },
    {
      modul: "Personel",
      ilişki: "Personeller dolaylı olarak birime bağlıdır",
      detay: "Personel → Büro → Şube → Birim hiyerarşisi"
    },
    {
      modul: "Malzeme",
      ilişki: "Malzemeler kuvve birimi olarak birime bağlıdır",
      detay: "Malzeme ekleme sırasında kuvve birimi seçimi zorunlu"
    },
    {
      modul: "Raporlama",
      ilişki: "Birim bazlı raporlar oluşturulabilir",
      detay: "Personel, malzeme ve organizasyon raporlarında kullanılır"
    }
  ],

  // Son güncellenme
  versiyon: "1.0.0",
  son_guncelleme: "2025-06-17",
  hazırlayan: "Sistem Yöneticisi"
};