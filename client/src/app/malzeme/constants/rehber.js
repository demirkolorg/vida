// client/src/app/malzeme/rehber.js

import { Package, Plus, Edit, Trash2, Eye, Search, Filter, Download, Upload, Settings, History, Move } from 'lucide-react';

export const MalzemeRehber = {
  // Modül temel bilgileri
  modul: {
    ad: "Malzeme Yönetimi",
    aciklama: "Tüm malzeme kayıtlarının takibi, zimmet işlemleri ve hareket yönetimi",
    icon: Package,
    kategori: "Malzeme Yönetimi",
    oncelik: "Kritik",
    bagimlilık: ["Birim", "Şube", "Marka", "Model", "SabitKodu", "Personel", "Depo", "Konum"]
  },

  // Ana özellikler ve işlemler
  ozellikler: [
    {
      baslik: "Malzeme Ekleme",
      aciklama: "Sisteme yeni malzeme kaydı oluşturma",
      icon: Plus,
      yetki: ["Admin", "User"],
      adimlar: [
        "Ana sayfada 'Yeni Malzeme Ekle' butonuna tıklayın",
        "Malzeme tipini seçiniz (Demirbaş/Sarf)",
        "Birim ve şube seçimi yapınız (zorunlu)",
        "Sabit kodu seçiniz (zorunlu)",
        "Marka ve model seçimi yapınız (zorunlu)",
        "Vida numarası, seri numaraları ve diğer bilgileri giriniz",
        "Kayıt tarihini belirleyiniz",
        "Açıklama ekleyiniz (opsiyonel)",
        "Formu onaylayıp kaydedin"
      ],
      notlar: [
        "Vida numarası benzersiz olmalıdır",
        "Stok/Demirbaş numarası varsa benzersiz olmalıdır",
        "Marka seçildikten sonra modeller otomatik yüklenir",
        "Demirbaş malzemeler için seri numarası zorunludur"
      ]
    },
    {
      baslik: "Malzeme Düzenleme", 
      aciklama: "Mevcut malzeme bilgilerini güncelleme",
      icon: Edit,
      yetki: ["Admin", "User"],
      adimlar: [
        "Malzemeler listesinden düzenlemek istediğiniz malzemeyi bulun",
        "Satır üzerindeki 'Düzenle' butonuna tıklayın",
        "Değiştirilebilir alanları güncelleyiniz",
        "Değişiklikleri kaydedin"
      ],
      notlar: [
        "Tip değişikliği (Demirbaş ↔ Sarf) yapılamaz",
        "Vida numarası değiştirilirken benzersizlik kontrolü yapılır",
        "Hareket geçmişi olan malzemelerde dikkatli olunmalıdır"
      ]
    },
    {
      baslik: "Malzeme Silme",
      aciklama: "Sistemden malzeme kaydını kaldırma", 
      icon: Trash2,
      yetki: ["Admin"],
      adimlar: [
        "Silinecek malzemeyi listeden seçin",
        "Silme butonuna tıklayın",
        "Onay mesajını kabul edin"
      ],
      notlar: [
        "Hareket geçmişi olan malzemeler silinemez",
        "Zimmetli malzemeler önce iade edilmelidir"
      ],
      uyarilar: [
        "UYARI: Bu işlem geri alınamaz!",
        "Önce malzeme hareket geçmişini kontrol edin"
      ]
    },
    {
      baslik: "Malzeme Detayları",
      aciklama: "Malzeme bilgilerini ve hareket geçmişini görüntüleme",
      icon: Eye,
      yetki: ["Admin", "User", "Personel"],
      adimlar: [
        "Malzemeler listesinden görüntülemek istediğiniz malzemeyi bulun",
        "Detay butonuna tıklayın",
        "Bilgiler ve Hareketler tabları arasında geçiş yapın"
      ],
      gosterilen_bilgiler: [
        "Tüm malzeme özellikleri",
        "Mevcut zimmet durumu",
        "Güncel konum bilgisi",
        "Hareket geçmişi (kronolojik)",
        "İlişkili tutanak bilgileri",
        "Kondisyon durumu",
        "Oluşturma ve güncelleme bilgileri"
      ]
    },
    {
      baslik: "Zimmet İşlemleri",
      aciklama: "Malzemenin personele zimmetlenmesi",
      icon: Move,
      yetki: ["Admin", "User"],
      adimlar: [
        "Malzeme listesinden zimmetlenecek malzemeyi seçin",
        "Zimmet butonuna tıklayın",
        "Hedef personeli seçin",
        "Zimmet tarihini belirleyin",
        "Açıklama ekleyin",
        "İşlemi onaylayın"
      ],
      notlar: [
        "Malzeme aktif durumda olmalıdır",
        "Zaten zimmetli olan malzeme tekrar zimmetlenemez",
        "Zimmet işlemi otomatik hareket kaydı oluşturur"
      ]
    },
    {
      baslik: "İade İşlemleri",
      aciklama: "Zimmetli malzemenin iade alınması",
      icon: Upload,
      yetki: ["Admin", "User"],
      adimlar: [
        "Zimmetli malzemeyi listeden seçin",
        "İade butonuna tıklayın",
        "İade konumunu belirleyin",
        "Kondisyon kontrolü yapın",
        "İade tarihini belirleyin",
        "İşlemi onaylayın"
      ],
      notlar: [
        "Sadece zimmetli malzemeler iade edilebilir",
        "İade sırasında kondisyon güncellemesi yapılabilir",
        "İade işlemi otomatik hareket kaydı oluşturur"
      ]
    },
    {
      baslik: "Arama ve Filtreleme",
      aciklama: "Malzemeler arasında gelişmiş arama",
      icon: Search,
      yetki: ["Admin", "User", "Personel"],
      ozellikler: [
        "Vida numarası ile hızlı arama",
        "Marka/Model bazlı filtreleme",
        "Malzeme tipi filtreleme (Demirbaş/Sarf)",
        "Zimmet durumu filtreleme",
        "Birim/Şube bazlı filtreleme",
        "Kondisyon durumu filtreleme",
        "Tarih aralığı filtreleme",
        "Çoklu filtre kombinasyonları"
      ],
      ipuclari: [
        "Vida numarası tam veya kısmi arama yapabilir",
        "Filtreler birlikte kullanılabilir",
        "Kayıtlı filtrelerinizi kullanarak hızlı arama yapın"
      ]
    },
    {
      baslik: "Hareket Geçmişi",
      aciklama: "Malzeme hareket kayıtlarını görüntüleme",
      icon: History,
      yetki: ["Admin", "User", "Personel"],
      ozellikler: [
        "Kronolojik hareket listesi",
        "Hareket tipi bazlı filtreleme",
        "Personel bazlı filtreleme",
        "Tarih aralığı seçimi",
        "Detaylı hareket bilgileri",
        "İlgili tutanak bağlantıları"
      ],
      hareket_tipleri: [
        "Kayıt - İlk malzeme kaydı",
        "Zimmet - Personele verilme",
        "İade - Depoya geri dönüş",
        "Devir - Personel değişikliği",
        "Depo Transferi - Konum değişikliği",
        "Kondisyon Güncelleme - Durum değişikliği",
        "Kayıp - Kayıp bildirimi",
        "Düşüm - Sistemden çıkarma"
      ]
    },
    {
      baslik: "Toplu İşlemler",
      aciklama: "Birden fazla malzeme üzerinde işlem yapma",
      icon: Settings,
      yetki: ["Admin"],
      ozellikler: [
        "Toplu zimmet işlemi",
        "Toplu iade işlemi",
        "Toplu durum güncelleme",
        "Toplu kondisyon güncelleme",
        "Toplu depo transferi",
        "Excel'e toplu export",
        "Excel'den toplu import"
      ],
      notlar: [
        "Toplu işlemler önce seçim gerektirir",
        "İşlem öncesi onay ekranı gösterilir",
        "Hatalı kayıtlar rapor edilir"
      ]
    }
  ],

  // Veri modeli
  veri_modeli: {
    tablo_adi: "Malzeme",
    alanlar: [
      {
        alan: "id",
        tip: "UUID",
        zorunlu: true,
        aciklama: "Benzersiz kimlik numarası"
      },
      {
        alan: "vidaNo",
        tip: "String",
        zorunlu: false,
        unique: true,
        aciklama: "Vida numarası (benzersiz)"
      },
      {
        alan: "kayitTarihi",
        tip: "Date",
        zorunlu: false,
        aciklama: "İlk kayıt tarihi"
      },
      {
        alan: "malzemeTipi",
        tip: "Enum",
        zorunlu: true,
        secenekler: ["Demirbas", "Sarf"],
        aciklama: "Malzeme tipi"
      },
      {
        alan: "birimId",
        tip: "UUID",
        zorunlu: true,
        aciklama: "Kuvve birimi ID'si"
      },
      {
        alan: "subeId",
        tip: "UUID",
        zorunlu: true,
        aciklama: "İş karşılığı şube ID'si"
      },
      {
        alan: "sabitKoduId",
        tip: "UUID",
        zorunlu: true,
        aciklama: "Sabit kodu ID'si"
      },
      {
        alan: "markaId",
        tip: "UUID",
        zorunlu: true,
        aciklama: "Marka ID'si"
      },
      {
        alan: "modelId",
        tip: "UUID",
        zorunlu: true,
        aciklama: "Model ID'si"
      },
      {
        alan: "kod",
        tip: "String",
        zorunlu: false,
        aciklama: "Ek kod bilgisi"
      },
      {
        alan: "bademSeriNo",
        tip: "String",
        zorunlu: false,
        aciklama: "BADEM seri numarası"
      },
      {
        alan: "etmysSeriNo",
        tip: "String",
        zorunlu: false,
        aciklama: "ETMYS seri numarası"
      },
      {
        alan: "stokDemirbasNo",
        tip: "String",
        zorunlu: false,
        unique: true,
        aciklama: "Stok/Demirbaş numarası"
      },
      {
        alan: "aciklama",
        tip: "String",
        zorunlu: false,
        aciklama: "Ek açıklama bilgisi"
      }
    ]
  },

  // İlişkiler
  iliskiler: [
    {
      tip: "ManyToOne",
      hedef: "Birim",
      aciklama: "Malzeme bir birime ait",
      alan: "birim",
      cascade: "Restrict"
    },
    {
      tip: "ManyToOne", 
      hedef: "Sube",
      aciklama: "Malzeme bir şubeye ait",
      alan: "sube",
      cascade: "Restrict"
    },
    {
      tip: "ManyToOne",
      hedef: "SabitKodu",
      aciklama: "Malzeme bir sabit koda ait",
      alan: "sabitKodu",
      cascade: "Restrict"
    },
    {
      tip: "ManyToOne",
      hedef: "Marka",
      aciklama: "Malzeme bir markaya ait",
      alan: "marka",
      cascade: "Restrict"
    },
    {
      tip: "ManyToOne",
      hedef: "Model",
      aciklama: "Malzeme bir modele ait",
      alan: "model",
      cascade: "Restrict"
    },
    {
      tip: "OneToMany",
      hedef: "MalzemeHareket",
      aciklama: "Malzemenin hareket geçmişi",
      alan: "malzemeHareketleri",
      cascade: "Cascade"
    }
  ],

  // API Endpoints
  api_endpoints: [
    {
      method: "GET",
      endpoint: "/api/malzeme",
      aciklama: "Tüm malzemeleri listele",
      parametreler: ["page", "limit", "search", "tip", "birim", "sube", "marka", "model"]
    },
    {
      method: "GET",
      endpoint: "/api/malzeme/:id",
      aciklama: "Belirli bir malzemeyi getir",
      parametreler: ["id"]
    },
    {
      method: "POST",
      endpoint: "/api/malzeme",
      aciklama: "Yeni malzeme oluştur",
      gerekli_alanlar: ["malzemeTipi", "birimId", "subeId", "sabitKoduId", "markaId", "modelId"]
    },
    {
      method: "PUT",
      endpoint: "/api/malzeme/:id",
      aciklama: "Malzeme bilgilerini güncelle",
      parametreler: ["id"]
    },
    {
      method: "DELETE",
      endpoint: "/api/malzeme/:id",
      aciklama: "Malzemeyi sil",
      sartlar: ["Hareket geçmişi olmamalı"]
    },
    {
      method: "POST",
      endpoint: "/api/malzeme/zimmet",
      aciklama: "Malzeme zimmet işlemi",
      gerekli_alanlar: ["malzemeId", "personelId"]
    },
    {
      method: "POST",
      endpoint: "/api/malzeme/iade",
      aciklama: "Malzeme iade işlemi",
      gerekli_alanlar: ["malzemeId", "konumId"]
    }
  ],

  // Yetki matrisi
  yetki_matrisi: {
    "Superadmin": {
      okuma: true,
      ekleme: true,
      guncelleme: true,
      silme: true,
      zimmet: true,
      iade: true,
      toplu_islem: true
    },
    "Admin": {
      okuma: true,
      ekleme: true,
      guncelleme: true,
      silme: true,
      zimmet: true,
      iade: true,
      toplu_islem: true
    },
    "User": {
      okuma: true,
      ekleme: true,
      guncelleme: true,
      silme: false,
      zimmet: true,
      iade: true,
      toplu_islem: false
    },
    "Personel": {
      okuma: true,
      ekleme: false,
      guncelleme: false,
      silme: false,
      zimmet: false,
      iade: false,
      toplu_islem: false
    }
  },

  // Sık kullanılan örnekler
  ornekler: {
    basarili_senaryolar: [
      {
        senaryo: "Laptop ekleme",
        adimlar: "Dell Latitude 5520 laptop başarıyla sisteme eklendi",
        sonuc: "Malzeme listesinde görünür, zimmet için hazır"
      },
      {
        senaryo: "Zimmet işlemi",
        adimlar: "Laptop Ahmet Yılmaz'a zimmetlendi",
        sonuc: "Hareket kaydı oluştu, durum 'zimmetli' olarak güncellendi"
      }
    ],
    hata_senaryolari: [
      {
        hata: "Duplicate vida number",
        sebep: "Aynı vida numarası zaten sistemde mevcut",
        cozum: "Farklı bir vida numarası kullanın"
      },
      {
        hata: "Cannot delete malzeme",
        sebep: "Malzemenin hareket geçmişi var",
        cozum: "Hareket kayıtlarını temizleyin veya malzemeyi pasif yapın"
      }
    ]
  },

  // İpuçları ve öneriler
  ipuclari: [
    "Vida numaralarını sistematik olarak verin (ör: VDA2025001)",
    "Demirbaş malzemeler için mutlaka seri numarası girin",
    "Hareket işlemlerinden önce malzeme durumunu kontrol edin",
    "Toplu işlemlerde önce test verisiyle deneme yapın",
    "Düzenli olarak kondisyon kontrolü yapın",
    "Zimmet ve iade işlemlerinde açıklama alanını kullanın"
  ],

  // Sorun giderme
  sorun_giderme: [
    {
      problem: "Malzeme eklenemiyor",
      cozumler: [
        "Tüm zorunlu alanları doldurduğunuzdan emin olun",
        "Vida numarasının benzersiz olduğunu kontrol edin",
        "İlişkili kayıtların (marka, model vb.) aktif olduğunu kontrol edin"
      ]
    },
    {
      problem: "Zimmet işlemi başarısız",
      cozumler: [
        "Malzemenin zaten zimmetli olmadığını kontrol edin",
        "Hedef personelin aktif olduğunu kontrol edin",
        "Zimmet yetkisinin olduğunu kontrol edin"
      ]
    },
    {
      problem: "Hareket geçmişi yüklenmiyor",
      cozumler: [
        "Malzeme ID'sinin doğru olduğunu kontrol edin",
        "Ağ bağlantınızı kontrol edin",
        "Sayfa yenileme işlemi yapın"
      ]
    }
  ],

  // Son güncellenme
  versiyon: "1.0.0",
  son_guncelleme: "2025-06-17",
  hazırlayan: "Sistem Yöneticisi"
};