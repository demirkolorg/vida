// client/src/app/personel/rehber.js

import { Package ,Users, Plus, Edit, Trash2, Eye, Search, Filter, Download, Upload, Settings, UserCheck, Shield, Key } from 'lucide-react';

export const PersonelRehber = {
  // Modül temel bilgileri
  modul: {
    ad: "Personel Yönetimi",
    aciklama: "Tüm personel bilgilerinin yönetimi, yetkilendirme ve organizasyonel atamalar",
    icon: Users,
    kategori: "İnsan Kaynakları",
    oncelik: "Kritik",
    bagimlilık: ["Birim", "Şube", "Büro", "Malzeme", "Authentication"]
  },

  // Ana özellikler ve işlemler
  ozellikler: [
    {
      baslik: "Personel Ekleme",
      aciklama: "Sisteme yeni personel kaydı oluşturma",
      icon: Plus,
      yetki: ["Admin", "Superadmin"],
      adimlar: [
        "Ana sayfada 'Yeni Personel Ekle' butonuna tıklayın",
        "Ad ve soyad bilgilerini giriniz (zorunlu)",
        "Sicil numarasını giriniz (zorunlu, benzersiz)",
        "E-posta adresini giriniz (opsiyonel)",
        "Telefon numarasını giriniz (opsiyonel)",
        "Rütbe seçimi yapınız (zorunlu)",
        "Görev seçimi yapınız (zorunlu)",
        "Büro ataması yapınız (zorunlu)",
        "Sistem rolü seçiniz (zorunlu)",
        "Avatar fotoğrafı yükleyiniz (opsiyonel)",
        "Formu onaylayıp kaydedin"
      ],
      notlar: [
        "Sicil numarası sistemde benzersiz olmalıdır",
        "E-posta adresi varsa benzersiz olmalıdır",
        "Rütbe ve görev uyumlu olmalıdır",
        "Büro seçimi organizasyon hiyerarşisini belirler",
        "Sistem rolü erişim yetkilerini belirler"
      ]
    },
    {
      baslik: "Personel Düzenleme",
      aciklama: "Mevcut personel bilgilerini güncelleme",
      icon: Edit,
      yetki: ["Admin", "Superadmin"],
      adimlar: [
        "Personeller listesinden düzenlemek istediğiniz personeli bulun",
        "Satır üzerindeki 'Düzenle' butonuna tıklayın",
        "Kişisel bilgileri güncelleyiniz",
        "Organizasyonel atamaları değiştiriniz",
        "Rütbe ve görev güncellemesi yapınız",
        "Sistem rolünü güncelleyiniz",
        "Değişiklikleri kaydedin"
      ],
      notlar: [
        "Sicil numarası değiştirilirken benzersizlik kontrolü yapılır",
        "Büro değişikliği önceki zimmetleri etkileyebilir",
        "Rol değişikliği erişim yetkilerini anında etkiler",
        "Rütbe değişikliği hiyerarşiyi etkileyebilir"
      ]
    },
    {
      baslik: "Personel Silme",
      aciklama: "Sistemden personel kaydını kaldırma",
      icon: Trash2,
      yetki: ["Superadmin"],
      adimlar: [
        "Silinecek personeli listeden seçin",
        "Silme butonuna tıklayın",
        "Onay mesajını kabul edin"
      ],
      notlar: [
        "Zimmetli malzemeleri olan personel silinemez",
        "Büro amiri olan personel silinemez",
        "İşlem log kayıtları olan personel silinemez"
      ],
      uyarilar: [
        "UYARI: Bu işlem geri alınamaz!",
        "Önce tüm zimmet ve görev bağlantılarını kontrol edin",
        "Personel geçmişi sistemden tamamen silinir"
      ]
    },
    {
      baslik: "Personel Detayları",
      aciklama: "Personel bilgilerini ve ilişkilerini görüntüleme",
      icon: Eye,
      yetki: ["Admin", "User", "Personel"],
      adimlar: [
        "Personeller listesinden görüntülemek istediğiniz personeli bulun",
        "Detay butonuna tıklayın",
        "Personel bilgilerini ve bağlı kayıtları inceleyin"
      ],
      gosterilen_bilgiler: [
        "Kişisel bilgiler (Ad, Soyad, Sicil)",
        "İletişim bilgileri (E-posta, Telefon)",
        "Organizasyonel bilgiler (Büro, Şube, Birim)",
        "Rütbe ve görev bilgileri",
        "Sistem rol ve yetkileri",
        "Zimmetli malzemeler listesi",
        "Amir olduğu bürolar (varsa)",
        "Son giriş tarihi ve aktivite bilgisi",
        "Oluşturulma ve güncellenme bilgileri"
      ]
    },
    {
      baslik: "Zimmet Yönetimi",
      aciklama: "Personel zimmet işlemlerinin yönetimi",
      icon: Package,
      yetki: ["Admin", "User"],
      ozellikler: [
        "Personele zimmet atama",
        "Zimmet iade alma",
        "Zimmet geçmişi görüntüleme",
        "Zimmet durumu sorgulama",
        "Toplu zimmet işlemleri",
        "Zimmet raporları"
      ],
      adimlar: [
        "Personel detay sayfasına gidin",
        "Zimmetler tabına geçin",
        "Yeni zimmet ekle butonuna tıklayın",
        "Malzeme seçimi yapın",
        "Zimmet tarihini belirleyin",
        "İşlemi onaylayın"
      ]
    },
    {
      baslik: "Rol ve Yetki Yönetimi",
      aciklama: "Personel sistem erişim yetkilerinin yönetimi",
      icon: Shield,
      yetki: ["Superadmin"],
      roller: [
        "Superadmin - Tam yetki",
        "Admin - Yönetici yetkileri",
        "User - Kullanıcı yetkileri",
        "Personel - Sınırlı okuma yetkileri"
      ],
      adimlar: [
        "Personel düzenleme sayfasına gidin",
        "Rol seçimi yapın",
        "Değişikliği kaydedin",
        "Personele bilgilendirme yapın"
      ],
      notlar: [
        "Rol değişikliği anında etkili olur",
        "Superadmin rolü çok dikkatli verilmelidir",
        "Rol değişiklikleri log kaydı oluşturur"
      ]
    },
    {
      baslik: "Arama ve Filtreleme",
      aciklama: "Personeller arasında gelişmiş arama",
      icon: Search,
      yetki: ["Admin", "User", "Personel"],
      ozellikler: [
        "Ad/soyad ile arama",
        "Sicil numarası ile arama",
        "Birim/Şube/Büro bazlı filtreleme",
        "Rütbe bazlı filtreleme",
        "Görev bazlı filtreleme",
        "Rol bazlı filtreleme",
        "Durum bazlı filtreleme (Aktif/Pasif)",
        "Zimmet durumu filtreleme"
      ],
      ipuclari: [
        "Global arama tüm alanlarda çalışır",
        "Filtreler birlikte kullanılabilir",
        "Kayıtlı filtreler ile hızlı arama",
        "Export özelliği ile sonuçları dışa aktarın"
      ]
    },
    {
      baslik: "Organizasyon Yönetimi",
      aciklama: "Personel organizasyonel atama ve transfer işlemleri",
      icon: Settings,
      yetki: ["Admin", "Superadmin"],
      ozellikler: [
        "Büro transfer işlemleri",
        "Toplu transfer işlemleri",
        "Amir atama/değiştirme",
        "Organizasyon şeması görüntüleme",
        "Hiyerarşi analizi",
        "Pozisyon boşluk analizi"
      ],
      adimlar: [
        "Transfer edilecek personeli seçin",
        "Transfer butonuna tıklayın",
        "Hedef büroyu seçin",
        "Transfer gerekçesini yazın",
        "İşlemi onaylayın"
      ]
    }
  ],

  // Veri modeli
  veri_modeli: {
    tablo_adi: "Personel",
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
        max_uzunluk: 50,
        aciklama: "Personel adı"
      },
      {
        alan: "soyad",
        tip: "String",
        zorunlu: true,
        max_uzunluk: 50,
        aciklama: "Personel soyadı"
      },
      {
        alan: "sicil",
        tip: "String",
        zorunlu: true,
        unique: true,
        aciklama: "Sicil numarası (benzersiz)"
      },
      {
        alan: "email",
        tip: "String",
        zorunlu: false,
        unique: true,
        aciklama: "E-posta adresi"
      },
      {
        alan: "telefon",
        tip: "String",
        zorunlu: false,
        aciklama: "Telefon numarası"
      },
      {
        alan: "rutbe",
        tip: "Enum",
        zorunlu: true,
        secenekler: ["EmniyetGenelMuduru", "BirinciSinifEmniyetMuduru", "IkinciSinifEmniyetMuduru", "UcuncuSinifEmniyetMuduru", "DorduncuSinifEmniyetMuduru", "EmniyetAmiri", "Baskomiser", "Komiser", "KomiserYardimcisi", "KidemliBaspolisMemuru", "BaspolisMemuru", "PolisMemuru", "CarsiVeMahalleBekcisi"],
        aciklama: "Personel rütbesi"
      },
      {
        alan: "gorev",
        tip: "Enum",
        zorunlu: true,
        secenekler: ["IlEmniyetMuduru", "IlEmniyetMudurYardimcisi", "SubeMuduru", "SubeMudurVekili", "SubeMudurYardimcisi", "BuroAmiri", "BuroAmirVekili", "BuroAmirYardimcisi", "MasaAmiri", "GrupAmiri", "EkipAmiri", "BuroSefi", "BuroMemuru", "EkipMemuru"],
        aciklama: "Personel görevi"
      },
      {
        alan: "buroId",
        tip: "UUID",
        zorunlu: true,
        aciklama: "Çalıştığı büro ID'si"
      },
      {
        alan: "role",
        tip: "Enum",
        zorunlu: true,
        varsayilan: "Personel",
        secenekler: ["Superadmin", "Admin", "User", "Personel"],
        aciklama: "Sistem erişim rolü"
      },
      {
        alan: "avatar",
        tip: "String",
        zorunlu: false,
        aciklama: "Profil fotoğrafı URL'si"
      },
      {
        alan: "lastLoginAt",
        tip: "DateTime",
        zorunlu: false,
        aciklama: "Son giriş tarihi"
      }
    ]
  },

  // İlişkiler
  iliskiler: [
    {
      tip: "ManyToOne",
      hedef: "Buro",
      aciklama: "Her personel bir büroya aittir",
      alan: "buro",
      foreign_key: "buroId",
      cascade: "Restrict",
      ornekler: [
        "Komiser Ahmet Yılmaz → Karakol Bürosu",
        "Memur Fatma Demir → Muhasebe Bürosu"
      ]
    },
    {
      tip: "OneToMany",
      hedef: "Buro",
      aciklama: "Bir personel birden fazla büronun amiri olabilir (teorik)",
      alan: "amirOlduguBurolar",
      cascade: "Set Null",
      ornekler: [
        "Komiser → Karakol Bürosu Amiri",
        "Başkomiser → Trafik Bürosu Amiri"
      ]
    },
    {
      tip: "OneToMany",
      hedef: "MalzemeHareket",
      aciklama: "Personelin zimmet işlemleri",
      alan: "malzemeHareketleri",
      cascade: "Restrict",
      ornekler: [
        "Ahmet Yılmaz'ın 5 zimmet işlemi",
        "Fatma Demir'in 3 iade işlemi"
      ]
    }
  ],

  // API Endpoints
  api_endpoints: [
    {
      method: "GET",
      endpoint: "/api/personel",
      aciklama: "Tüm personelleri listele",
      parametreler: ["page", "limit", "search", "status", "buroId", "subeId", "birimId", "rutbe", "gorev", "role"]
    },
    {
      method: "GET",
      endpoint: "/api/personel/:id",
      aciklama: "Belirli bir personeli getir",
      parametreler: ["id"]
    },
    {
      method: "POST",
      endpoint: "/api/personel",
      aciklama: "Yeni personel oluştur",
      gerekli_alanlar: ["ad", "soyad", "sicil", "rutbe", "gorev", "buroId", "role"]
    },
    {
      method: "PUT",
      endpoint: "/api/personel/:id",
      aciklama: "Personel bilgilerini güncelle",
      parametreler: ["id"]
    },
    {
      method: "DELETE",
      endpoint: "/api/personel/:id",
      aciklama: "Personeli sil",
      sartlar: ["Zimmetli malzemeler olmamalı", "Amir olduğu bürolar olmamalı"]
    },
    {
      method: "POST",
      endpoint: "/api/personel/transfer",
      aciklama: "Personel büro transferi",
      gerekli_alanlar: ["personelId", "yeniBuroId", "gerekce"]
    },
    {
      method: "POST",
      endpoint: "/api/personel/updateRole",
      aciklama: "Personel rol güncelleme",
      gerekli_alanlar: ["personelId", "yeniRole"]
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
      rol_degistirme: true,
      transfer: true,
      zimmet_yonetimi: true,
      toplu_islem: true
    },
    "Admin": {
      okuma: true,
      ekleme: true,
      guncelleme: true,
      silme: false,
      durum_degistirme: true,
      rol_degistirme: false,
      transfer: true,
      zimmet_yonetimi: true,
      toplu_islem: false
    },
    "User": {
      okuma: true,
      ekleme: false,
      guncelleme: false,
      silme: false,
      durum_degistirme: false,
      rol_degistirme: false,
      transfer: false,
      zimmet_yonetimi: true,
      toplu_islem: false
    },
    "Personel": {
      okuma: true,
      ekleme: false,
      guncelleme: false,
      silme: false,
      durum_degistirme: false,
      rol_degistirme: false,
      transfer: false,
      zimmet_yonetimi: false,
      toplu_islem: false
    }
  },

  // Sık kullanılan örnekler
  ornekler: {
    basarili_senaryolar: [
      {
        senaryo: "Yeni personel ekleme",
        adimlar: "Komiser Ahmet Yılmaz sisteme başarıyla eklendi",
        sonuc: "Personel aktif, Karakol Bürosu'na atandı, User rolü verildi"
      },
      {
        senaryo: "Zimmet atama",
        adimlar: "Ahmet Yılmaz'a hizmet aracı zimmetlendi",
        sonuc: "Zimmet kaydı oluştu, malzeme durumu güncellendi"
      },
      {
        senaryo: "Büro transfer",
        adimlar: "Fatma Demir Trafik Bürosu'ndan Mali Büro'ya transfer edildi",
        sonuc: "Transfer tamamlandı, zimmetler korundu"
      }
    ],
    hata_senaryolari: [
      {
        hata: "Duplicate sicil number",
        sebep: "Aynı sicil numarası zaten sistemde mevcut",
        cozum: "Farklı bir sicil numarası kullanın"
      },
      {
        hata: "Cannot delete personnel",
        sebep: "Personelin zimmetli malzemeleri var",
        cozum: "Önce tüm zimmetleri iade edin"
      },
      {
        hata: "Invalid role assignment",
        sebep: "Rol değiştirme yetkisi yok",
        cozum: "Superadmin ile iletişime geçin"
      }
    ]
  },

  // İş kuralları
  is_kurallari: [
    {
      kural: "Sicil Benzersizliği",
      aciklama: "Her personelin sicil numarası benzersiz olmalıdır",
      ornek: "İki personelin aynı sicil numarası olamaz"
    },
    {
      kural: "E-posta Benzersizliği",
      aciklama: "E-posta adresi varsa benzersiz olmalıdır",
      ornek: "Aynı e-posta adresi birden fazla personele atanamaz"
    },
    {
      kural: "Büro Bağımlılığı",
      aciklama: "Her personel mutlaka bir büroya bağlı olmalıdır",
      ornek: "Bürosuz personel kaydı oluşturulamaz"
    },
    {
      kural: "Amir Teklik Kuralı",
      aciklama: "Bir personel aynı anda sadece bir büronun amiri olabilir",
      ornek: "Amir birden fazla büroyu yönetemez"
    },
    {
      kural: "Zimmet Kontrolü",
      aciklama: "Zimmetli malzemesi olan personel silinemez",
      ornek: "Önce tüm zimmetler iade edilmelidir"
    }
  ],

  // Performans notları
  performans: {
    optimizasyonlar: [
      "Sicil numarası üzerinde unique indeks",
      "E-posta üzerinde unique indeks",
      "BuroId üzerinde indeks",
      "Role üzerinde indeks",
      "Sayfalama (pagination) desteklenir",
      "Lazy loading uygulanır"
    ],
    limitler: [
      "Sayfa başına maksimum 50 kayıt",
      "Arama sonuçları maksimum 1000 kayıt",
      "API rate limit: dakikada 100 istek",
      "Avatar upload maksimum 2MB"
    ]
  },

  // İpuçları ve öneriler
  ipuclari: [
    "Sicil numaralarını sistematik olarak verin",
    "E-posta adreslerini standart formatta yazın",
    "Rütbe ve görev uyumunu kontrol edin",
    "Rol atamalarını dikkatli yapın",
    "Transfer işlemlerini planlı yapın",
    "Avatar fotoğraflarını güncel tutun",
    "Düzenli olarak personel bilgilerini güncelleyin"
  ],

  // Sorun giderme
  sorun_giderme: [
    {
      problem: "Personel eklenemiyor",
      cozumler: [
        "Sicil numarasının benzersiz olduğunu kontrol edin",
        "Tüm zorunlu alanları doldurduğunuzdan emin olun",
        "Büro seçiminin doğru yapıldığını kontrol edin",
        "Yetkinizin yeterli olduğunu kontrol edin"
      ]
    },
    {
      problem: "Giriş yapamıyor",
      cozumler: [
        "Personelin aktif durumda olduğunu kontrol edin",
        "Rol atamasının yapıldığını kontrol edin",
        "E-posta ve şifre bilgilerini kontrol edin",
        "Hesap kilitleme durumunu kontrol edin"
      ]
    },
    {
      problem: "Transfer işlemi başarısız",
      cozumler: [
        "Hedef büronun aktif olduğunu kontrol edin",
        "Transfer yetkisinin olduğunu kontrol edin",
        "Zimmet durumunu kontrol edin",
        "Amir durumunu kontrol edin"
      ]
    }
  ],

  // Entegrasyon bilgileri
  entegrasyonlar: [
    {
      modul: "Authentication",
      ilişki: "Personel girişi için kullanılır",
      detay: "Sicil numarası ve rol bilgisi giriş kontrolünde kullanılır"
    },
    {
      modul: "Malzeme",
      ilişki: "Zimmet işlemleri için gerekli",
      detay: "Malzeme zimmet ve iade işlemlerinde personel bilgisi kullanılır"
    },
    {
      modul: "Büro",
      ilişki: "Organizasyonel yapı için gerekli",
      detay: "Her personel bir büroya bağlıdır"
    },
    {
      modul: "Audit",
      ilişki: "Tüm işlemler log kaydı oluşturur",
      detay: "Personel işlemleri audit sisteminde takip edilir"
    }
  ],

  // Son güncellenme
  versiyon: "1.0.0",
  son_guncelleme: "2025-06-17",
  hazırlayan: "Sistem Yöneticisi"
};