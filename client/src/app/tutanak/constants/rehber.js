// client/src/app/tutanak/rehber.js

import { FileText, Plus, Edit, Trash2, Eye, Search, Filter, Download, Upload, Settings, Users, Package, CheckSquare, Printer } from 'lucide-react';

export const TutanakRehber = {
  // Modül temel bilgileri
  modul: {
    ad: 'Tutanak Yönetimi',
    aciklama: 'Malzeme hareket işlemlerinin resmi belgelerle dokümantasyonu',
    icon: FileText,
    kategori: 'Belge Yönetimi',
    oncelik: 'Kritik',
    bagimlilık: ['Malzeme', 'Personel', 'MalzemeHareket'],
  },

  // Ana özellikler ve işlemler
  ozellikler: [
    {
      baslik: 'Tutanak Oluşturma',
      aciklama: 'Yeni tutanak belgesi oluşturma',
      icon: Plus,
      yetki: ['Admin', 'User'],
      tutanak_tipleri: ['Zimmet Tutanağı', 'İade Tutanağı', 'Devir Tutanağı', 'Depo Transfer Tutanağı', 'Kondisyon Güncelleme Tutanağı', 'Kayıp Bildirimi Tutanağı', 'Düşüm Tutanağı', 'Bilgi Tutanağı'],
      adimlar: ['Tutanak Builder sayfasına gidin', 'Hareket türünü seçin', 'İlgili malzemeleri seçin', 'Personel bilgilerini girin', 'Konum bilgilerini belirleyin', 'İşlem detaylarını yazın', 'Tutanağı oluşturun ve kaydedin'],
      notlar: ['Her tutanak benzersiz ID alır', 'Tutanak oluşturulduktan sonra düzenlenemez', 'Tüm ilgili malzemeler için hareket kaydı oluşur', 'Dijital imza ve onay sistemi entegre edilebilir'],
    },
    {
      baslik: 'Tutanak Görüntüleme',
      aciklama: 'Mevcut tutanak belgelerini görüntüleme',
      icon: Eye,
      yetki: ['Admin', 'User', 'Personel'],
      adimlar: ['Tutanaklar listesine gidin', 'Görüntülemek istediğiniz tutanağı bulun', 'Tutanak detaylarına tıklayın', 'Belge içeriğini inceleyin'],
      gosterilen_bilgiler: ['Tutanak numarası ve türü', 'Oluşturulma tarihi ve kullanıcısı', 'İlgili malzemeler listesi', 'Personel bilgileri (kaynak/hedef)', 'Konum bilgileri (kaynak/hedef)', 'İşlem detayları ve açıklamaları', 'Ek dosyalar (varsa)', 'İstatistiksel bilgiler'],
    },
    {
      baslik: 'Tutanak Yazdırma',
      aciklama: 'Tutanak belgelerinin basılı çıktısını alma',
      icon: Printer,
      yetki: ['Admin', 'User'],
      ozellikler: ['PDF format çıktı', 'Resmi belge formatı', 'Dijital imza alanları', 'Barkod/QR kod entegrasyonu', 'Toplu yazdırma özelliği', 'Farklı şablon seçenekleri'],
      adimlar: ['Tutanak detay sayfasına gidin', 'Yazdır butonuna tıklayın', 'Şablon seçimi yapın', 'PDF önizlemesini kontrol edin', 'Yazdırma ayarlarını yapın', 'Belgeyi yazdırın veya kaydedin'],
    },
    {
      baslik: 'Toplu Tutanak İşlemleri',
      aciklama: 'Birden fazla malzeme için tek tutanak',
      icon: Package,
      yetki: ['Admin', 'User'],
      kullanim_alanlari: ['Toplu zimmet işlemleri', 'Toplu iade işlemleri', 'Departman değişikliği', 'Yıllık envanter işlemleri', 'Toplu malzeme transferi'],
      adimlar: ["Tutanak Builder'da Toplu İşlem seçin", 'Hareket türünü belirleyin', 'Malzemeleri listeden seçin veya filtreleyin', 'Ortak personel/konum bilgilerini girin', 'Her malzeme için özel notlar ekleyin', 'Toplu tutanağı oluşturun'],
    },
    {
      baslik: 'Tutanak Onay Sistemi',
      aciklama: 'Tutanak onay süreçlerinin yönetimi',
      icon: CheckSquare,
      yetki: ['Admin', 'User'],
      onay_seviyeleri: ['Oluşturan Kullanıcı', 'Malzeme Sorumlusu', 'Birim Amiri', 'Üst Düzey Yönetici'],
      onay_durumlari: ['Bekliyor - Onay bekleme durumunda', 'Onaylandı - Tüm onaylar tamamlandı', 'Reddedildi - Onay reddedildi', 'İptal Edildi - İşlem iptal edildi'],
      workflow: ['Tutanak oluşturulur', 'İlgili kişilere bildirim gönderilir', 'Onay sahipleri tutanağı inceler', 'Onay veya red kararı verilir', 'Nihai durum güncellenir'],
    },
    {
      baslik: 'Arama ve Filtreleme',
      aciklama: 'Tutanaklar arasında gelişmiş arama',
      icon: Search,
      yetki: ['Admin', 'User', 'Personel'],
      arama_kriterleri: ['Tutanak numarası', 'Hareket türü', 'Malzeme vida numarası', 'Personel adı/sicil', 'Oluşturulma tarihi', 'Onay durumu', 'İşlem yapan kullanıcı'],
      filtre_secenekleri: ['Hareket türü bazında', 'Tarih aralığı', 'Personel bazında', 'Onay durumu', 'Malzeme sayısı', 'Oluşturan kullanıcı'],
    },
    {
      baslik: 'Tutanak Raporlama',
      aciklama: 'Tutanak bazlı raporlar ve analizler',
      icon: Download,
      yetki: ['Admin', 'User'],
      rapor_tipleri: ['Günlük Tutanak Raporu', 'Personel Bazlı Tutanak Raporu', 'Hareket Türü Analizi', 'Onay Durumu Raporu', 'İstatistiksel Özet Raporu', 'Aylık/Yıllık Faaliyet Raporu'],
      analiz_metrikleri: ['Toplam tutanak sayısı', 'Hareket türü dağılımı', 'Ortalama işlem süresi', 'En aktif personeller', 'En sık kullanılan malzemeler'],
    },
    {
      baslik: 'Ek Dosya Yönetimi',
      aciklama: 'Tutanaklara ek belge ekleme',
      icon: Upload,
      yetki: ['Admin', 'User'],
      desteklenen_formatlar: ['PDF - Resmi belgeler', 'DOCX - Word belgeleri', 'XLSX - Excel dosyaları', 'JPG/PNG - Fotoğraflar', 'ZIP - Sıkıştırılmış dosyalar'],
      kullanim_alanlari: ['İmzalı onay belgeleri', 'Malzeme fotoğrafları', 'Teknik dokümantasyon', 'Hasar tespit raporları', 'Garanti belgeleri'],
    },
  ],

  // Veri modeli
  veri_modeli: {
    tablo_adi: 'Tutanak',
    alanlar: [
      {
        alan: 'id',
        tip: 'UUID',
        zorunlu: true,
        aciklama: 'Benzersiz tutanak kimlik numarası',
      },
      {
        alan: 'hareketTuru',
        tip: 'Enum',
        zorunlu: true,
        secenekler: ['Zimmet', 'Iade', 'Devir', 'DepoTransferi', 'KondisyonGuncelleme', 'Kayip', 'Dusum', 'Bilgi'],
        aciklama: 'Tutanak hareket türü',
      },
      {
        alan: 'malzemeIds',
        tip: 'String[]',
        zorunlu: true,
        aciklama: "İşleme dahil malzeme ID'leri",
      },
      {
        alan: 'malzemeler',
        tip: 'Json',
        zorunlu: true,
        aciklama: "Malzeme detaylarının snapshot'ı",
      },
      {
        alan: 'personelBilgileri',
        tip: 'Json',
        zorunlu: true,
        aciklama: 'İlgili personel bilgileri',
      },
      {
        alan: 'islemBilgileri',
        tip: 'Json',
        zorunlu: true,
        aciklama: 'İşlem detayları ve açıklamaları',
      },
      {
        alan: 'konumBilgileri',
        tip: 'Json',
        zorunlu: false,
        aciklama: 'Konum bilgileri (varsa)',
      },
      {
        alan: 'toplamMalzeme',
        tip: 'Integer',
        varsayilan: 0,
        aciklama: 'Toplam malzeme sayısı',
      },
      {
        alan: 'demirbasSayisi',
        tip: 'Integer',
        varsayilan: 0,
        aciklama: 'Demirbaş malzeme sayısı',
      },
      {
        alan: 'sarfSayisi',
        tip: 'Integer',
        varsayilan: 0,
        aciklama: 'Sarf malzeme sayısı',
      },
      {
        alan: 'ekDosyalar',
        tip: 'Json',
        zorunlu: false,
        aciklama: 'Ek dosya bilgileri',
      },
    ],
  },

  // İlişkiler
  iliskiler: [
    {
      tip: 'OneToMany',
      hedef: 'MalzemeHareket',
      aciklama: 'Tutanak birden fazla hareket kaydı oluşturur',
      alan: 'malzemeHareketleri',
      cascade: 'Cascade',
      ornekler: ['Zimmet tutanağı → 5 adet zimmet hareketi', 'Toplu transfer tutanağı → 10 adet transfer hareketi'],
    },
  ],

  // API Endpoints
  api_endpoints: [
    {
      method: 'GET',
      endpoint: '/api/tutanak',
      aciklama: 'Tüm tutanakları listele',
      parametreler: ['page', 'limit', 'search', 'hareketTuru', 'startDate', 'endDate', 'onayDurumu'],
    },
    {
      method: 'GET',
      endpoint: '/api/tutanak/:id',
      aciklama: 'Belirli bir tutanağı getir',
      parametreler: ['id'],
    },
    {
      method: 'POST',
      endpoint: '/api/tutanak',
      aciklama: 'Yeni tutanak oluştur',
      gerekli_alanlar: ['hareketTuru', 'malzemeIds', 'personelBilgileri', 'islemBilgileri'],
    },
    {
      method: 'GET',
      endpoint: '/api/tutanak/:id/pdf',
      aciklama: 'Tutanak PDF çıktısı',
      parametreler: ['id', 'template'],
      cevap_formati: 'PDF dosyası',
    },
    {
      method: 'POST',
      endpoint: '/api/tutanak/:id/approve',
      aciklama: 'Tutanak onaylama',
      gerekli_alanlar: ['onayDurumu', 'onayNotu'],
    },
    {
      method: 'POST',
      endpoint: '/api/tutanak/bulk',
      aciklama: 'Toplu tutanak oluşturma',
      gerekli_alanlar: ['hareketTuru', 'malzemeList', 'ortakBilgiler'],
    },
  ],

  // Yetki matrisi
  yetki_matrisi: {
    Superadmin: {
      okuma: true,
      olusturma: true,
      duzenleme: true,
      silme: true,
      onaylama: true,
      yazdirma: true,
      toplu_islem: true,
      ek_dosya: true,
    },
    Admin: {
      okuma: true,
      olusturma: true,
      duzenleme: false,
      silme: false,
      onaylama: true,
      yazdirma: true,
      toplu_islem: true,
      ek_dosya: true,
    },
    User: {
      okuma: true,
      olusturma: true,
      duzenleme: false,
      silme: false,
      onaylama: false,
      yazdirma: true,
      toplu_islem: false,
      ek_dosya: true,
    },
    Personel: {
      okuma: true,
      olusturma: false,
      duzenleme: false,
      silme: false,
      onaylama: false,
      yazdirma: false,
      toplu_islem: false,
      ek_dosya: false,
    },
  },

  // Sık kullanılan örnekler
  ornekler: {
    basarili_senaryolar: [
      {
        senaryo: 'Laptop zimmet tutanağı',
        adimlar: '5 adet laptop için zimmet tutanağı oluşturuldu',
        sonuc: 'Tutanak kaydedildi, hareket kayıtları oluşturuldu, PDF çıktısı alındı',
      },
      {
        senaryo: 'Toplu iade tutanağı',
        adimlar: 'Departman değişikliği nedeniyle 15 malzeme iade tutanağı',
        sonuc: 'Toplu iade işlemi tamamlandı, tutanak onaylandı',
      },
      {
        senaryo: 'Kayıp bildirimi tutanağı',
        adimlar: 'Tablet kayıp bildirimi tutanağı oluşturuldu',
        sonuc: 'Kayıp kaydı oluşturuldu, ilgili birimler bilgilendirildi',
      },
    ],
    hata_senaryolari: [
      {
        hata: 'No materials selected',
        sebep: 'Tutanak için malzeme seçilmedi',
        cozum: 'En az bir malzeme seçin',
      },
      {
        hata: 'Invalid personnel information',
        sebep: 'Personel bilgileri eksik veya hatalı',
        cozum: 'Tüm gerekli personel bilgilerini kontrol edin',
      },
      {
        hata: 'Document generation failed',
        sebep: 'PDF oluşturma sırasında hata',
        cozum: 'Şablon seçimini kontrol edin ve tekrar deneyin',
      },
    ],
  },

  // İş kuralları
  is_kurallari: [
    {
      kural: 'Tutanak Değiştirilemezlik',
      aciklama: 'Oluşturulan tutanaklar değiştirilemez',
      ornek: 'Onaylanan tutanak içeriği sonradan değiştirilemez',
    },
    {
      kural: 'Malzeme Zorunluluğu',
      aciklama: 'Her tutanak en az bir malzeme içermelidir',
      ornek: 'Boş tutanak oluşturulamaz',
    },
    {
      kural: 'Hareket Türü Uyumu',
      aciklama: 'Tutanak türü ile malzeme durumu uyumlu olmalıdır',
      ornek: 'Zimmetli malzeme için zimmet tutanağı oluşturulamaz',
    },
    {
      kural: 'Onay Sırası',
      aciklama: 'Onay işlemleri belirlenen sırada yapılmalıdır',
      ornek: 'Alt seviye onayı olmadan üst seviye onay verilemez',
    },
  ],

  // Tutanak şablonları
  sablonlar: {
    zimmet_tutanagi: {
      baslik: 'MALZEME ZİMMET TUTANAĞI',
      icerik_bolumleri: ['Tutanak Başlık Bilgileri', 'Zimmet Alan Personel Bilgileri', 'Malzeme Listesi ve Detayları', 'Zimmet Şartları ve Sorumluluklar', 'İmza Alanları'],
    },
    iade_tutanagi: {
      baslik: 'MALZEME İADE TUTANAĞI',
      icerik_bolumleri: ['Tutanak Başlık Bilgileri', 'İade Eden Personel Bilgileri', 'İade Edilen Malzeme Listesi', 'Malzeme Kondisyon Durumu', 'İmza Alanları'],
    },
    transfer_tutanagi: {
      baslik: 'MALZEME TRANSFER TUTANAĞI',
      icerik_bolumleri: ['Tutanak Başlık Bilgileri', 'Kaynak ve Hedef Konum Bilgileri', 'Transfer Edilen Malzeme Listesi', 'Transfer Gerekçesi', 'İmza Alanları'],
    },
  },

  // Performans notları
  performans: {
    optimizasyonlar: ['HareketTuru üzerinde indeks', 'CreatedAt üzerinde indeks', 'CreatedById üzerinde indeks', 'PDF generation cache', 'Malzeme snapshot optimizasyonu'],
    limitler: ['Sayfa başına maksimum 50 tutanak', 'Toplu işlemde maksimum 100 malzeme', 'Ek dosya maksimum 10MB', 'PDF generation timeout 30 saniye'],
  },

  // İpuçları ve öneriler
  ipuclari: ['Tutanak açıklamalarını detaylı ve anlaşılır yazın', 'Ek dosyaları anlamlı isimlerle yükleyin', 'Toplu işlemlerde malzeme listesini önceden hazırlayın', 'PDF çıktısını almadan önce önizlemeyi kontrol edin', 'Onay süreçlerini takip ederek gecikmeleri önleyin', 'Düzenli olarak tutanak arşivlemesi yapın'],

  // Sorun giderme
  sorun_giderme: [
    {
      problem: 'Tutanak oluşturulamıyor',
      cozumler: ['Tüm gerekli alanları doldurduğunuzdan emin olun', 'Seçilen malzemelerin uygun durumda olduğunu kontrol edin', 'Personel bilgilerinin doğru olduğunu kontrol edin', 'Ağ bağlantınızı kontrol edin'],
    },
    {
      problem: 'PDF oluşturulamıyor',
      cozumler: ['Şablon seçiminin doğru olduğunu kontrol edin', 'Tutanak içeriğinin tam olduğunu kontrol edin', 'Tarayıcı ayarlarınızı kontrol edin', 'Popup engelleyicisini devre dışı bırakın'],
    },
    {
      problem: 'Onay işlemi başarısız',
      cozumler: ['Onay yetkisinin olduğunu kontrol edin', 'Tutanak durumunun uygun olduğunu kontrol edin', 'Onay notunu yazdığınızdan emin olun', 'Sistem yöneticisine başvurun'],
    },
  ],

  // Entegrasyon bilgileri
  entegrasyonlar: [
    {
      modul: 'MalzemeHareket',
      ilişki: 'Tutanak hareket kayıtları oluşturur',
      detay: 'Her tutanak ilgili malzemeler için hareket kaydı oluşturur',
    },
    {
      modul: 'Malzeme',
      ilişki: 'Tutanak malzeme durumlarını günceller',
      detay: 'Tutanak onaylandığında malzeme durumları otomatik güncellenir',
    },
    {
      modul: 'Personel',
      ilişki: 'Tutanak personel bilgilerini kullanır',
      detay: 'Zimmet, iade ve devir işlemlerinde personel bilgileri kullanılır',
    },
    {
      modul: 'Audit',
      ilişki: 'Tüm tutanak işlemleri log kaydı oluşturur',
      detay: 'Tutanak oluşturma, onaylama işlemleri audit sisteminde takip edilir',
    },
  ],

  // Son güncellenme
  versiyon: '1.0.0',
  son_guncelleme: '2025-06-17',
  hazırlayan: 'Sistem Yöneticisi',
};
