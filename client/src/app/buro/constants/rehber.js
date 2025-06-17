// client/src/app/buro/rehber.js

import { Briefcase, Plus, Edit, Trash2, Eye, Search, Filter, Download, Upload, Settings, Users, UserCheck } from 'lucide-react';

export const BuroRehber = {
  // Modül temel bilgileri
  modul: {
    ad: "Büro Yönetimi",
    aciklama: "Şubeler altında yer alan büroların ve amirlik yapısının yönetimi",
    icon: Briefcase,
    kategori: "Organizasyon Yönetimi",
    oncelik: "Yüksek",
    bagimlilık: ["Birim", "Şube", "Personel"]
  },

  // Ana özellikler ve işlemler
  ozellikler: [
    {
      baslik: "Büro Ekleme",
      aciklama: "Sisteme yeni büro kaydı oluşturma",
      icon: Plus,
      yetki: ["Admin", "Superadmin"],
      adimlar: [
        "Ana sayfada 'Yeni Büro Ekle' butonuna tıklayın",
        "Büro adını giriniz (zorunlu)",
        "Bağlı olacağı şubeyi seçiniz (zorunlu)",
        "Büro amirini seçiniz (opsiyonel)",
        "Açıklama ekleyiniz (opsiyonel)",
        "Formu onaylayıp kaydedin"
      ],
      notlar: [
        "Büro adı seçilen şube içinde benzersiz olmalıdır",
        "Maksimum 100 karakter sınırı vardır",
        "Türkçe karakterler desteklenir",
        "Şube seçimi değiştirilemez (sonradan)",
        "Amir ataması sonradan yapılabilir"
      ]
    },
    {
      baslik: "Büro Düzenleme",
      aciklama: "Mevcut büro bilgilerini güncelleme",
      icon: Edit,
      yetki: ["Admin", "Superadmin"],
      adimlar: [
        "Bürolar listesinden düzenlemek istediğiniz büroyu bulun",
        "Satır üzerindeki 'Düzenle' butonuna tıklayın",
        "Büro adını güncelleyiniz",
        "Büro amirini değiştiriniz",
        "Açıklama bilgisini güncelleyiniz",
        "Değişiklikleri kaydedin"
      ],
      notlar: [
        "Büro adı değiştirilirken aynı şube içinde benzersizlik kontrolü yapılır",
        "Şube değiştirilemez (güvenlik nedeniyle)",
        "Amir değişikliği personel hiyerarşisini etkiler",
        "Bu büroya bağlı personeller varsa dikkatli olunmalıdır"
      ]
    },
    {
      baslik: "Büro Silme",
      aciklama: "Sistemden büro kaydını kaldırma",
      icon: Trash2,
      yetki: ["Superadmin"],
      adimlar: [
        "Silinecek büroyu listeden seçin",
        "Silme butonuna tıklayın",
        "Onay mesajını kabul edin"
      ],
      notlar: [
        "Bu büroya bağlı personeller varsa silme işlemi yapılamaz",
        "Amir ataması olan büro silinmeden önce amir ataması kaldırılmalıdır"
      ],
      uyarilar: [
        "UYARI: Bu işlem geri alınamaz!",
        "Önce tüm personel bağlantılarını kontrol edin",
        "Organizasyon yapısını bozabilir"
      ]
    },
    {
      baslik: "Büro Detayları",
      aciklama: "Büro bilgilerini ve personel yapısını görüntüleme",
      icon: Eye,
      yetki: ["Admin", "User", "Personel"],
      adimlar: [
        "Bürolar listesinden görüntülemek istediğiniz büroyu bulun",
        "Detay butonuna tıklayın",
        "Büro bilgilerini ve bağlı kayıtları inceleyin"
      ],
      gosterilen_bilgiler: [
        "Büro adı ve açıklaması",
        "Bağlı olduğu şube ve birim bilgisi",
        "Büro amiri bilgisi (varsa)",
        "Oluşturulma tarihi ve kullanıcısı",
        "Son güncellenme bilgileri",
        "Bu büroya bağlı personeller listesi",
        "Personel sayısı ve dağılımı",
        "Durum bilgisi (Aktif/Pasif)"
      ]
    },
    {
      baslik: "Amir Atama İşlemleri",
      aciklama: "Bürolara amir atama ve değiştirme",
      icon: UserCheck,
      yetki: ["Admin", "Superadmin"],
      adimlar: [
        "Amir atanacak büroyu seçin",
        "Amir Ata/Değiştir butonuna tıklayın",
        "Uygun personeli listeden seçin",
        "Atama tarihini belirleyin",
        "Atama gerekçesini yazın",
        "İşlemi onaylayın"
      ],
      notlar: [
        "Amir sadece aynı bürodaki personellerden seçilebilir",
        "Bir personel aynı anda birden fazla büronun amiri olamaz",
        "Amir ataması log kaydı oluşturur",
        "Eski amir otomatik olarak normal personel statüsüne döner"
      ]
    },
    {
      baslik: "Arama ve Filtreleme",
      aciklama: "Bürolar arasında hızlı arama ve filtreleme",
      icon: Search,
      yetki: ["Admin", "User", "Personel"],
      ozellikler: [
        "Büro adına göre anlık arama",
        "Şube bazında filtreleme",
        "Birim bazında filtreleme",
        "Amir durumu filtreleme (Var/Yok)",
        "Durum bazında filtreleme (Aktif/Pasif)",
        "Personel sayısına göre filtreleme",
        "Oluşturulma tarihine göre sıralama"
      ],
      ipuclari: [
        "Arama kutusu Türkçe karakterleri destekler",
        "Şube filtresi ile sonuçları daraltabilirsiniz",
        "Amir filtreleri ile yönetim analizi yapabilirsiniz",
        "En az 2 karakter yazarak arama yapabilirsiniz"
      ]
    },
    {
      baslik: "Hiyerarşik Görünüm",
      aciklama: "Büroları birim-şube hiyerarşisinde görüntüleme",
      icon: Filter,
      yetki: ["Admin", "User", "Personel"],
      ozellikler: [
        "Birim → Şube → Büro ağaç yapısı",
        "Her seviyede personel sayıları",
        "Amir bilgileri ile birlikte görünüm",
        "Genişletilebilir/daraltılabilir yapı",
        "Organizasyon şeması export özelliği"
      ],
      ipuclari: [
        "Büyük organizasyonlarda hiyerarşi görünümü kullanın",
        "Seviye başlıklarına tıklayarak alt yapıları görün",
        "Amir ataması olmayan büroları kolayca tespit edin"
      ]
    },
    {
      baslik: "Personel Dağılım Analizi",
      aciklama: "Büro bazında personel analizi ve raporlama",
      icon: Users,
      yetki: ["Admin", "User"],
      ozellikler: [
        "Büro bazında personel sayı dağılımı",
        "Amir/personel oranı analizi",
        "Boş büro tespiti",
        "Personel yoğunluk haritası",
        "Rütbe dağılım analizi",
        "Görev bazlı dağılım raporu"
      ],
      rapor_tipleri: [
        "Büro Personel Dağılım Raporu",
        "Amir Atama Durumu Raporu",
        "Boş Pozisyon Analiz Raporu",
        "Organizasyon Yoğunluk Raporu"
      ]
    },
    {
      baslik: "Toplu İşlemler",
      aciklama: "Birden fazla büro üzerinde işlem yapma",
      icon: Settings,
      yetki: ["Superadmin"],
      ozellikler: [
        "Toplu durum güncelleme",
        "Toplu açıklama güncelleme",
        "Toplu amir atama",
        "Toplu şube transferi",
        "Excel'e toplu export",
        "Excel'den toplu import"
      ],
      notlar: [
        "Amir ataması için uygunluk kontrolü yapılır",
        "Toplu işlemler öncesi yedek alın",
        "Hatalı kayıtlar detaylı rapor edilir"
      ]
    }
  ],

  // Veri modeli
  veri_modeli: {
    tablo_adi: "Buro",
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
        aciklama: "Büro adı"
      },
      {
        alan: "aciklama",
        tip: "String",
        zorunlu: false,
        aciklama: "Büro hakkında açıklama"
      },
      {
        alan: "subeId",
        tip: "UUID",
        zorunlu: true,
        aciklama: "Bağlı olduğu şube ID'si"
      },
      {
        alan: "sube",
        tip: "Relation",
        bagli_tablo: "Sube",
        aciklama: "Bağlı olduğu şube bilgisi"
      },
      {
        alan: "amirId",
        tip: "UUID",
        zorunlu: false,
        aciklama: "Büro amiri personel ID'si"
      },
      {
        alan: "amir",
        tip: "Relation",
        bagli_tablo: "Personel",
        aciklama: "Büro amiri bilgisi"
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
        alan: ["ad", "subeId"],
        tip: "Unique",
        aciklama: "Aynı şube içinde büro adı benzersizliği"
      },
      {
        alan: "subeId",
        tip: "Index",
        aciklama: "Şube bazlı sorgular için"
      },
      {
        alan: "amirId",
        tip: "Index",
        aciklama: "Amir bazlı sorgular için"
      }
    ]
  },

  // İlişkiler
  iliskiler: [
    {
      tip: "ManyToOne",
      hedef: "Sube",
      aciklama: "Her büro bir şubeye aittir",
      alan: "sube",
      foreign_key: "subeId",
      cascade: "Restrict",
      ornekler: [
        "Karakol Bürosu → Asayiş Şubesi",
        "Muhasebe Bürosu → Mali Şube"
      ]
    },
    {
      tip: "ManyToOne",
      hedef: "Personel",
      aciklama: "Her büronun bir amiri olabilir",
      alan: "amir",
      foreign_key: "amirId",
      cascade: "Set Null",
      ornekler: [
        "Komiser Ahmet Yılmaz → Karakol Bürosu Amiri",
        "Başkomiser Fatma Demir → Trafik Bürosu Amiri"
      ]
    },
    {
      tip: "OneToMany",
      hedef: "Personel",
      aciklama: "Bir büroya birden fazla personel bağlı olabilir",
      alan: "personeller",
      cascade: "Restrict",
      ornekler: [
        "Karakol Bürosu'nda 15 personel",
        "Mali Büro'da 8 personel"
      ]
    }
  ],

  // API Endpoints
  api_endpoints: [
    {
      method: "GET",
      endpoint: "/api/buro",
      aciklama: "Tüm büroları listele",
      parametreler: ["page", "limit", "search", "status", "subeId", "birimId", "hasAmir"]
    },
    {
      method: "GET",
      endpoint: "/api/buro/:id",
      aciklama: "Belirli bir büroyu getir",
      parametreler: ["id"]
    },
    {
      method: "POST",
      endpoint: "/api/buro/getBySubeId",
      aciklama: "Belirli bir şubeye ait büroları getir",
      gerekli_alanlar: ["subeId"]
    },
    {
      method: "POST",
      endpoint: "/api/buro",
      aciklama: "Yeni büro oluştur",
      gerekli_alanlar: ["ad", "subeId"],
      opsiyonel_alanlar: ["aciklama", "amirId"]
    },
    {
      method: "PUT",
      endpoint: "/api/buro/:id",
      aciklama: "Büro bilgilerini güncelle",
      parametreler: ["id"],
      guncellenebilir_alanlar: ["ad", "aciklama", "amirId"]
    },
    {
      method: "DELETE",
      endpoint: "/api/buro/:id",
      aciklama: "Büroyu sil",
      parametreler: ["id"],
      sartlar: ["İlişkili personeller olmamalı"]
    },
    {
      method: "POST",
      endpoint: "/api/buro/setAmir",
      aciklama: "Büro amiri atama",
      gerekli_alanlar: ["buroId", "personelId"],
      opsiyonel_alanlar: ["gerekce"]
    },
    {
      method: "POST",
      endpoint: "/api/buro/removeAmir",
      aciklama: "Büro amiri görevden alma",
      gerekli_alanlar: ["buroId"],
      opsiyonel_alanlar: ["gerekce"]
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
      amir_atama: true,
      toplu_islem: true
    },
    "Admin": {
      okuma: true,
      ekleme: true,
      guncelleme: true,
      silme: false,
      durum_degistirme: true,
      amir_atama: true,
      toplu_islem: false
    },
    "User": {
      okuma: true,
      ekleme: false,
      guncelleme: false,
      silme: false,
      durum_degistirme: false,
      amir_atama: false,
      toplu_islem: false
    },
    "Personel": {
      okuma: true,
      ekleme: false,
      guncelleme: false,
      silme: false,
      durum_degistirme: false,
      amir_atama: false,
      toplu_islem: false
    }
  },

  // Sık kullanılan örnekler
  ornekler: {
    basarili_senaryolar: [
      {
        senaryo: "Yeni büro ekleme",
        adimlar: "Asayiş Şubesi altına Karakol Bürosu başarıyla eklendi",
        sonuc: "Büro listesinde görünür, personel atama için hazır"
      },
      {
        senaryo: "Amir atama işlemi",
        adimlar: "Komiser Ahmet Yılmaz Karakol Bürosu amiri olarak atandı",
        sonuc: "Amir ataması tamamlandı, hiyerarşi güncellendi"
      },
      {
        senaryo: "Hiyerarşik görüntüleme",
        adimlar: "Organizasyon ağacı açıldı, tüm büro yapısı görüntülendi",
        sonuc: "3 birim, 8 şube, 15 büro hiyerarşik olarak listelendi"
      }
    ],
    hata_senaryolari: [
      {
        hata: "Duplicate office name in branch",
        sebep: "Aynı şube içinde aynı isimde büro zaten mevcut",
        cozum: "Farklı bir büro adı seçin"
      },
      {
        hata: "Cannot delete office",
        sebep: "Bu büroya bağlı personeller var",
        cozum: "Önce personelleri başka büroya taşıyın veya silin"
      },
      {
        hata: "Cannot assign manager",
        sebep: "Seçilen personel başka büronun amiri",
        cozum: "Önce mevcut amir görevini sonlandırın"
      }
    ]
  },

  // İş kuralları
  is_kurallari: [
    {
      kural: "Şube İçi Büro Benzersizliği",
      aciklama: "Aynı şube altında aynı isimde büro olamaz",
      ornek: "Asayiş Şubesi altında iki tane 'Karakol Bürosu' olamaz"
    },
    {
      kural: "Amir Teklik Kuralı",
      aciklama: "Bir personel aynı anda sadece bir büronun amiri olabilir",
      ornek: "Komiser Ahmet hem Karakol hem de Trafik bürosunun amiri olamaz"
    },
    {
      kural: "Amir Büro Bağımlılığı",
      aciklama: "Büro amiri sadece o bürodaki personellerden seçilebilir",
      ornek: "Karakol Bürosu amiri sadece Karakol'da çalışan personellerden seçilir"
    },
    {
      kural: "Şube Bağımlılığı",
      aciklama: "Her büro mutlaka bir şubeye bağlı olmalıdır",
      ornek: "Orphan büro kayıtları oluşturulamaz"
    }
  ],

  // Performans notları
  performans: {
    optimizasyonlar: [
      "Büro adı ve şube ID'si üzerinde composite unique indeks",
      "SubeId üzerinde indeks",
      "AmirId üzerinde indeks",
      "Sayfalama (pagination) desteklenir",
      "Hiyerarşi görünümü için cache",
      "Lazy loading uygulanır"
    ],
    limitler: [
      "Sayfa başına maksimum 50 kayıt",
      "Arama sonuçları maksimum 500 kayıt",
      "API rate limit: dakikada 100 istek",
      "Hiyerarşi cache süresi: 5 dakika"
    ]
  },

  // İpuçları ve öneriler
  ipuclari: [
    "Büro adlarını standart ve tutarlı şekilde yazın",
    "Açıklama alanını büro görevleri için kullanın",
    "Amir atamalarını planlı yapın",
    "Hiyerarşi görünümünü organizasyon analizi için kullanın",
    "Büro silmeden önce mutlaka personel bağlantılarını kontrol edin",
    "Amir değişikliklerini log kayıtlarıyla takip edin"
  ],

  // Sorun giderme
  sorun_giderme: [
    {
      problem: "Büro eklenemiyor",
      cozumler: [
        "Büro adının seçilen şube içinde benzersiz olduğunu kontrol edin",
        "Geçerli bir şube seçtiğinizden emin olun",
        "Gerekli alanların doldurulduğunu kontrol edin",
        "Yetkinizin yeterli olduğunu kontrol edin"
      ]
    },
    {
      problem: "Amir atanamıyor",
      cozumler: [
        "Seçilen personelin aynı büroda çalıştığını kontrol edin",
        "Personelin başka büronun amiri olmadığını kontrol edin",
        "Amir atama yetkisinin olduğunu kontrol edin",
        "Personelin aktif durumda olduğunu kontrol edin"
      ]
    },
    {
      problem: "Büro silinemiyor",
      cozumler: [
        "Bu büroya bağlı personelleri kontrol edin",
        "Personelleri başka büroya taşıyın",
        "Superadmin yetkisinin olduğunu kontrol edin"
      ]
    },
    {
      problem: "Hiyerarşi görünümü yüklenmiyor",
      cozumler: [
        "Cache'i temizleyip tekrar deneyin",
        "Sayfa yenileme işlemi yapın",
        "Ağ bağlantınızı kontrol edin",
        "Tarayıcı geçmişini temizleyin"
      ]
    }
  ],

  // Entegrasyon bilgileri
  entegrasyonlar: [
    {
      modul: "Şube",
      ilişki: "Bürolar şubelerin alt seviyesidir",
      detay: "Her büro mutlaka bir şubeye bağlıdır"
    },
    {
      modul: "Personel",
      ilişki: "Personeller bürolara bağlıdır",
      detay: "Personel ekleme sırasında büro seçimi zorunludur"
    },
    {
      modul: "Birim",
      ilişki: "Bürolar dolaylı olarak birime bağlıdır",
      detay: "Büro → Şube → Birim hiyerarşisi"
    },
    {
      modul: "Raporlama",
      ilişki: "Büro bazlı organizasyon raporları",
      detay: "Personel dağılım ve amir atama raporlarında kullanılır"
    }
  ],

  // Son güncellenme
  versiyon: "1.0.0",
  son_guncelleme: "2025-06-17",
  hazırlayan: "Sistem Yöneticisi"
};