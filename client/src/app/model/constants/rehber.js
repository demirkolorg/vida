// client/src/app/model/rehber.js

import { Tag, Plus, Edit, Trash2, Eye, Search, Filter, Download, Upload, Settings } from 'lucide-react';

export const ModelRehber = {
  // Modül temel bilgileri
  modul: {
    ad: "Model Yönetimi",
    aciklama: "Markalara bağlı model bilgilerinin tanımlanması ve yönetimi",
    icon: Tag,
    kategori: "Malzeme Yönetimi",
    oncelik: "Yüksek", 
    bagimlilık: ["Marka", "Malzeme"]
  },

  // Ana özellikler ve işlemler
  ozellikler: [
    {
      baslik: "Model Ekleme",
      aciklama: "Sisteme yeni model kaydı oluşturma",
      icon: Plus,
      yetki: ["Admin", "User"],
      adimlar: [
        "Ana sayfada 'Yeni Model Ekle' butonuna tıklayın",
        "Model adını giriniz (zorunlu)",
        "Marka seçimi yapınız (zorunlu)",
        "Açıklama ekleyiniz (opsiyonel)",
        "Formu onaylayıp kaydedin"
      ],
      notlar: [
        "Model adı seçilen marka içinde benzersiz olmalıdır",
        "Aynı marka için aynı isimde birden fazla model olamaz",
        "Maksimum 100 karakter sınırı vardır",
        "Türkçe karakterler desteklenir"
      ]
    },
    {
      baslik: "Model Düzenleme",
      aciklama: "Mevcut model bilgilerini güncelleme",
      icon: Edit,
      yetki: ["Admin", "User"],
      adimlar: [
        "Modeller listesinden düzenlemek istediğiniz modeli bulun",
        "Satır üzerindeki 'Düzenle' butonuna tıklayın",
        "Model adını güncelleyiniz",
        "Marka değiştirebilirsiniz (dikkatli olun)",
        "Açıklama bilgisini güncelleyiniz",
        "Değişiklikleri kaydedin"
      ],
      notlar: [
        "Model adı değiştirilirken yeni marka içinde benzersizlik kontrolü yapılır",
        "Bu modele bağlı malzemeler varsa marka değiştirirken dikkatli olunmalıdır",
        "Sadece değişen alanlar backend'e gönderilir"
      ]
    },
    {
      baslik: "Model Silme",
      aciklama: "Sistemden model kaydını kaldırma",
      icon: Trash2,
      yetki: ["Admin"],
      adimlar: [
        "Silinecek modeli listeden seçin",
        "Silme butonuna tıklayın",
        "Onay mesajını kabul edin"
      ],
      notlar: [
        "Bu modele bağlı malzemeler varsa silme işlemi yapılamaz",
        "Silinen veriler geri getirilemez"
      ],
      uyarilar: [
        "UYARI: Bu işlem geri alınamaz!",
        "Önce ilişkili malzemeleri kontrol edin",
        "Marka-Model hiyerarşisi bozulmamalıdır"
      ]
    },
    {
      baslik: "Model Detayları",
      aciklama: "Model bilgilerini ayrıntılı görüntüleme",
      icon: Eye,
      yetki: ["Admin", "User", "Personel"],
      adimlar: [
        "Modeller listesinden görüntülemek istediğiniz modeli bulun",
        "Detay butonuna tıklayın",
        "Model bilgilerini ve ilişkili malzemeleri inceleyin"
      ],
      gosterilen_bilgiler: [
        "Model adı ve açıklaması",
        "Bağlı olduğu marka bilgisi",
        "Oluşturulma tarihi ve kullanıcısı",
        "Son güncellenme bilgileri",
        "Bu modele ait malzemeler listesi",
        "Bu modele ait toplam malzeme sayısı",
        "Durum bilgisi (Aktif/Pasif)"
      ]
    },
    {
      baslik: "Arama ve Filtreleme",
      aciklama: "Modeller arasında hızlı arama ve filtreleme",
      icon: Search,
      yetki: ["Admin", "User", "Personel"],
      ozellikler: [
        "Model adına göre anlık arama",
        "Markaya göre filtreleme",
        "Durum bazında filtreleme (Aktif/Pasif)",
        "Oluşturulma tarihine göre sıralama",
        "Malzeme sayısına göre filtreleme",
        "Gelişmiş arama kriterleri"
      ],
      ipuclari: [
        "Arama kutusu Türkçe karakterleri destekler",
        "En az 2 karakter yazarak arama yapabilirsiniz",
        "Marka filtresi ile sonuçları daraltabilirsiniz",
        "Filtreler birlikte kullanılabilir"
      ]
    },
    {
      baslik: "Hiyerarşi Görünümü",
      aciklama: "Marka-Model ilişkisini ağaç yapısında görüntüleme",
      icon: Filter,
      yetki: ["Admin", "User", "Personel"],
      ozellikler: [
        "Markalar altında modellerin gruplu görünümü",
        "Her modele ait malzeme sayısı",
        "Genişletilebilir/daraltılabilir ağaç yapısı",
        "Hızlı navigasyon imkanı"
      ],
      ipuclari: [
        "Hiyerarşi görünümü büyük veri setlerinde faydalıdır",
        "Marka başlıklarına tıklayarak grubu genişletebilirsiniz",
        "Model sayısı marka yanında gösterilir"
      ]
    },
    {
      baslik: "Marka Bazında Model Getirme",
      aciklama: "Belirli bir markaya ait modelleri listeleme",
      icon: Settings,
      yetki: ["Admin", "User", "Personel"],
      adimlar: [
        "Marka seçim alanından istediğiniz markayı seçin",
        "Sistem otomatik olarak o markaya ait modelleri getirir",
        "Modeller dropdown'da listelenir"
      ],
      api_bilgisi: "Bu özellik getByMarkaId API endpoint'ini kullanır",
      notlar: [
        "Bu özellik malzeme ekleme ekranlarında kullanılır",
        "Dinamik olarak model listesi güncellenir",
        "Performance optimizasyonu için cache kullanılır"
      ]
    }
  ],

  // Veri modeli
  veri_modeli: {
    tablo_adi: "Model",
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
        aciklama: "Model adı (marka içinde benzersiz)"
      },
      {
        alan: "aciklama",
        tip: "String",
        zorunlu: false,
        aciklama: "Model hakkında açıklama"
      },
      {
        alan: "markaId",
        tip: "UUID",
        zorunlu: true,
        aciklama: "Bağlı olduğu marka ID'si"
      },
      {
        alan: "marka",
        tip: "Relation",
        bagli_tablo: "Marka",
        aciklama: "Bağlı olduğu marka bilgisi"
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
        alan: ["ad", "markaId"],
        tip: "Unique",
        aciklama: "Aynı marka içinde aynı isimde model olamaz"
      },
      {
        alan: "markaId",
        tip: "Index",
        aciklama: "Marka bazında sorgular için"
      }
    ]
  },

  // İlişkiler
  iliskiler: [
    {
      tip: "ManyToOne",
      hedef: "Marka",
      aciklama: "Her model bir markaya aittir",
      alan: "marka",
      foreign_key: "markaId",
      cascade: "Restrict", // Marka silinirse model silinmez, hata verir
      ornekler: [
        "Latitude 5520 modeli Dell markasına ait",
        "LaserJet Pro M404n modeli HP markasına ait"
      ]
    },
    {
      tip: "OneToMany",
      hedef: "Malzeme",
      aciklama: "Bir modele birden fazla malzeme bağlı olabilir",
      alan: "malzemeler",
      cascade: "Restrict", // Model silinirken malzemeler varsa işlem engellenir
      ornekler: [
        "Latitude 5520 modeline 25 adet laptop malzemesi",
        "LaserJet Pro modeline 10 adet yazıcı malzemesi"
      ]
    }
  ],

  // API Endpoints
  api_endpoints: [
    {
      method: "GET",
      endpoint: "/api/model",
      aciklama: "Tüm modelleri listele",
      parametreler: ["page", "limit", "search", "status", "markaId"]
    },
    {
      method: "GET",
      endpoint: "/api/model/:id",
      aciklama: "Belirli bir modeli getir",
      parametreler: ["id"]
    },
    {
      method: "POST",
      endpoint: "/api/model/getByMarkaId",
      aciklama: "Belirli bir markaya ait modelleri getir",
      gerekli_alanlar: ["markaId"],
      cevap_formati: "Model dizisi"
    },
    {
      method: "POST",
      endpoint: "/api/model",
      aciklama: "Yeni model oluştur",
      gerekli_alanlar: ["ad", "markaId"],
      opsiyonel_alanlar: ["aciklama"]
    },
    {
      method: "PUT",
      endpoint: "/api/model/:id",
      aciklama: "Model bilgilerini güncelle",
      parametreler: ["id"],
      guncellenebilir_alanlar: ["ad", "aciklama", "markaId"]
    },
    {
      method: "DELETE",
      endpoint: "/api/model/:id",
      aciklama: "Modeli sil",
      parametreler: ["id"],
      sartlar: ["İlişkili malzemeler olmamalı"]
    },
    {
      method: "POST",
      endpoint: "/api/model/search",
      aciklama: "Model arama",
      gerekli_alanlar: ["query"],
      opsiyonel_alanlar: ["markaId", "status"]
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
      marka_degistirme: true
    },
    "Admin": {
      okuma: true,
      ekleme: true,
      guncelleme: true,
      silme: true,
      durum_degistirme: true,
      marka_degistirme: true
    },
    "User": {
      okuma: true,
      ekleme: true,
      guncelleme: true,
      silme: false,
      durum_degistirme: false,
      marka_degistirme: false
    },
    "Personel": {
      okuma: true,
      ekleme: false,
      guncelleme: false,
      silme: false,
      durum_degistirme: false,
      marka_degistirme: false
    }
  },

  // Sık kullanılan örnekler
  ornekler: {
    basarili_senaryolar: [
      {
        senaryo: "Yeni model ekleme",
        adimlar: "Dell markasına Latitude 5520 modeli başarıyla eklendi",
        sonuc: "Model listesinde Dell markası altında görünür hale geldi"
      },
      {
        senaryo: "Model bazlı malzeme ekleme",
        adimlar: "Malzeme eklerken Dell markası seçildi, Latitude 5520 modeli otomatik yüklendi",
        sonuc: "Model dropdown'ında sadece Dell markasına ait modeller listelendi"
      },
      {
        senaryo: "Hiyerarşi görünümü",
        adimlar: "Marka-Model hiyerarşisi açıldı, Dell markası genişletildi",
        sonuc: "Dell markasına ait tüm modeller ve malzeme sayıları görüntülendi"
      }
    ],
    hata_senaryolari: [
      {
        hata: "Duplicate model name error",
        sebep: "Aynı marka için aynı isimde model zaten mevcut",
        cozum: "Farklı bir model adı seçin veya farklı marka seçin"
      },
      {
        hata: "Foreign key constraint",
        sebep: "Bu modele bağlı malzemeler var",
        cozum: "Önce ilişkili malzemeleri silin veya başka modele taşıyın"
      },
      {
        hata: "Invalid brand selection",
        sebep: "Seçilen marka ID'si geçersiz veya silinmiş",
        cozum: "Mevcut ve aktif bir marka seçin"
      }
    ]
  },

  // Performans notları
  performans: {
    optimizasyonlar: [
      "Model adı ve marka ID'si üzerinde composite unique indeks",
      "MarkaId üzerinde indeks bulunur",
      "Sayfalama (pagination) desteklenir",
      "getByMarkaId için cache mekanizması",
      "Lazy loading uygulanır"
    ],
    limitler: [
      "Sayfa başına maksimum 50 kayıt",
      "Arama sonuçları maksimum 1000 kayıt",
      "API rate limit: dakikada 100 istek",
      "getByMarkaId cache süresi: 5 dakika"
    ]
  },

  // İş kuralları
  is_kurallari: [
    {
      kural: "Marka-Model Benzersizlik",
      aciklama: "Aynı marka altında aynı isimde birden fazla model olamaz",
      ornek: "Dell markası altında iki tane 'Latitude 5520' modeli olamaz"
    },
    {
      kural: "Marka Bağımlılığı",
      aciklama: "Her model mutlaka bir markaya bağlı olmalıdır",
      ornek: "Orphan model kayıtları oluşturulamaz"
    },
    {
      kural: "Cascade Restriction",
      aciklama: "Modele bağlı malzemeler varsa model silinemez",
      ornek: "5 adet malzemesi olan model silinmeden önce malzemeler temizlenmeli"
    },
    {
      kural: "Marka Değiştirme Kontrolü",
      aciklama: "Model markası değiştirilirken yeni markada isim çakışması kontrol edilir",
      ornek: "Dell/Latitude → HP/Latitude geçişinde HP'de Latitude var mı kontrol edilir"
    }
  ],

  // İpuçları ve öneriler
  ipuclari: [
    "Model adlarını standart formatta yazın (örn: 'latitude 5520' yerine 'Latitude 5520')",
    "Açıklama alanını model özellikleri için kullanın (RAM, CPU vb.)",
    "Hiyerarşi görünümünü büyük model listelerinde kullanın",
    "Model silmeden önce mutlaka ilişkili malzemeleri kontrol edin",
    "Benzer modeller için tutarlı isimlendirme kuralları uygulayın",
    "Model ekleme sırasında marka seçimini doğru yapın, sonradan değiştirmek riskli olabilir"
  ],

  // Sorun giderme
  sorun_giderme: [
    {
      problem: "Model eklenemiyor",
      cozumler: [
        "Model adının seçilen marka içinde benzersiz olduğunu kontrol edin",
        "Geçerli bir marka seçtiğinizden emin olun",
        "Gerekli alanların doldurulduğunu kontrol edin",
        "Ağ bağlantınızı kontrol edin"
      ]
    },
    {
      problem: "Model silinemiyor",
      cozumler: [
        "Bu modele bağlı malzemeleri kontrol edin",
        "Malzemeleri önce başka modele taşıyın veya silin",
        "Yetkinizin silme işlemi için yeterli olduğunu kontrol edin"
      ]
    },
    {
      problem: "Marka değiştirme başarısız",
      cozumler: [
        "Yeni markada aynı isimde model olup olmadığını kontrol edin",
        "Marka değiştirme yetkinizin olduğunu kontrol edin",
        "İlişkili malzemelerin yeni marka-model kombinasyonuyla uyumlu olduğunu kontrol edin"
      ]
    },
    {
      problem: "Model listesi yüklenmiyor",
      cozumler: [
        "Marka seçiminin doğru yapıldığını kontrol edin",
        "Cache'i temizleyip tekrar deneyin",
        "Sayfa yenileme işlemi yapın",
        "API servislerinin çalıştığını kontrol edin"
      ]
    }
  ],

  // Entegrasyon bilgileri
  entegrasyonlar: [
    {
      modul: "Malzeme",
      ilişki: "Model seçimi malzeme ekleme için zorunlu",
      detay: "Malzeme ekleme ekranında önce marka, sonra model seçimi yapılır"
    },
    {
      modul: "Marka",
      ilişki: "Her model bir markaya bağlıdır",
      detay: "Marka silinirse modellerin durumu kontrol edilir"
    },
    {
      modul: "Global Search",
      ilişki: "Model adları global aramaya dahildir",
      detay: "Model adı ve marka bilgisiyle arama yapılabilir"
    },
    {
      modul: "Raporlama",
      ilişki: "Model bazlı malzeme raporları oluşturulabilir",
      detay: "Hangi modelden kaç adet malzeme olduğu raporlanabilir"
    }
  ],

  // Son güncellenme
  versiyon: "1.0.0",
  son_guncelleme: "2025-06-17",
  hazırlayan: "Sistem Yöneticisi"
};