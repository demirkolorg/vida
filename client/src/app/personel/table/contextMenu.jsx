// client/src/app/personel/table/contextMenu.jsx
import { useCallback } from 'react';
import { ContextMenuItem, ContextMenuSeparator } from '@/components/ui/context-menu';
import { BaseContextMenu } from '@/components/contextMenu/BaseContextMenu';
import { EntityHuman, EntityType } from '../constants/api';
import { Activity,
  Building2Icon, 
  KeyIcon, 
  UserCheckIcon, 
  ShieldIcon, 
  MailIcon, 
  PhoneIcon, 
  HistoryIcon, 
  Package,
  ArrowLeftRight,
  RotateCcw,
  PackageCheck,
  FileTextIcon  // YENİ: Zimmet bilgi fişi ikonu
} from 'lucide-react';
import { MalzemeHareket_Store } from '@/app/malzemehareket/constants/store';
import { usePersonelStore } from '@/stores/usePersonelStore';
import { useMalzemeHareketStore } from '@/stores/useMalzemeHareketStore';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// YENİ: Tutanak store import'u
import { Tutanak_Store } from '@/app/tutanak/constants/store';

export function Personel_ContextMenu({ item }) {
  const navigate = useNavigate();
  
  const GetPersonelZimmetleri = MalzemeHareket_Store(state => state.GetPersonelZimmetleri);
  const openPersonelZimmetSheet = usePersonelStore(state => state.openPersonelZimmetSheet);
  
  // Bulk işlemler için store metodları
  const openBulkIadeSheet = useMalzemeHareketStore(state => state.openBulkIadeSheet);
  const openBulkDevirSheet = useMalzemeHareketStore(state => state.openBulkDevirSheet);
  const GetPersonelHareketleri = MalzemeHareket_Store(state => state.GetPersonelHareketleri);
  const openPersonelHareketleriSheet = usePersonelStore(state => state.openPersonelHareketleriSheet);
  
  // YENİ: Tutanak store metodları
  const GeneratePersonelZimmetBilgiFisi = Tutanak_Store(state => state.GeneratePersonelZimmetBilgiFisi);
  
  // Personel zimmetlerini almak için store
  const personelZimmetleri = MalzemeHareket_Store(state => state.personelZimmetleri);

  const menuTitle = item?.ad ? `${item.ad} ${EntityHuman} Kaydı` : `${EntityHuman} İşlemleri`;

  const handleViewBuro = useCallback(() => {
    if (!item?.buro) return;
    // Bağlı büro detayını göster
    // Örnek: router.push(`/burolar/${item.buro.id}`);
  }, [item]);

  const handleResetPassword = useCallback(() => {
    if (!item) return;
    // Şifre sıfırlama işlemi
    console.log('Şifre sıfırlama:', item.sicil);
  }, [item]);

  const handleToggleUserStatus = useCallback(() => {
    if (!item) return;
    // Sistem kullanıcısı durumunu değiştir
    console.log('Kullanıcı durumu değiştir:', item.sicil);
  }, [item]);

  const handleManagePermissions = useCallback(() => {
    if (!item) return;
    // Yetki yönetimi ekranını aç
    console.log('Yetki yönetimi:', item.sicil);
  }, [item]);

  const handleSendEmail = useCallback(() => {
    if (!item) return;
    // Email gönderme ekranını aç
    console.log('Email gönder:', item.sicil);
  }, [item]);

  const handleCallPhone = useCallback(() => {
    if (!item) return;
    // Telefon arama işlemi
    console.log('Telefon ara:', item.sicil);
  }, [item]);

  const handleViewLoginHistory = useCallback(() => {
    if (!item) return;
    // Giriş geçmişini göster
    console.log('Giriş geçmişi:', item.sicil);
  }, [item]);

  const handleShowPersonelZimmetleri = useCallback(async () => {
    if (!item?.id) return;
    
    try {
      console.log('Personel zimmetleri getiriliyor, personel ID:', item.id);
      
      // Önce personelin zimmetlerini getir
      const result = await GetPersonelZimmetleri(item.id, { showToast: true });
      console.log('Backend\'den gelen zimmet verileri:', result);
      
      // Sonra sheet'i aç
      openPersonelZimmetSheet(item);
    } catch (error) {
      console.error('Personel zimmetleri getirilemedi:', error);
    }
  }, [item, GetPersonelZimmetleri, openPersonelZimmetSheet]);

  // YENİ: Zimmet bilgi fişi oluştur ve yazdır
  const handleGenerateZimmetBilgiFisi = useCallback(async () => {
    if (!item?.id) return;
    
    try {
      console.log('Personel zimmet bilgi fişi oluşturuluyor:', item.id);
      
      const result = await GeneratePersonelZimmetBilgiFisi(item.id);
      
      if (result && result.tutanak) {
        toast.success(`${item.ad} ${item.soyad} personelinin zimmet bilgi fişi oluşturuldu.`);
        
        // Tutanak sayfasına yönlendir ve yazdırma işlemi için flag gönder
        navigate('/tutanak', { 
          state: { 
            showPrint: true,
            selectedTutanakId: result.tutanak.id 
          } 
        });
      }
    } catch (error) {
      console.error('Zimmet bilgi fişi oluşturma hatası:', error);
      toast.error('Zimmet bilgi fişi oluşturulurken hata oluştu.');
    }
  }, [item, GeneratePersonelZimmetBilgiFisi, navigate]);

  // Bulk iade işlemi
  const handleBulkIade = useCallback(async () => {
    if (!item?.id) return;
    
    try {
      // Eğer personel zimmetleri daha önce yüklenmemişse, yükle
      if (!personelZimmetleri || personelZimmetleri.length === 0) {
        console.log('Personel zimmetleri yükleniyor...');
        const result = await GetPersonelZimmetleri(item.id, { showToast: false });
        
        // Zimmetleri store'dan al
        const zimmetler = MalzemeHareket_Store.getState().personelZimmetleri;
        
        if (!zimmetler || zimmetler.length === 0) {
          toast.warning(`${item.ad} ${item.soyad} adlı personelin zimmetinde malzeme bulunmamaktadır.`);
          return;
        }
        
        // Her malzeme için kaynak personel bilgisini ekle (bulk iade için gerekli)
        const malzemelerForBulkIade = zimmetler.map(malzeme => ({
          ...malzeme,
          kaynakPersonelId: item.id // Mevcut personel kaynak olacak (iade eden)
        }));
        
        // Bulk iade sheet'i aç
        openBulkIadeSheet(malzemelerForBulkIade);
      } else {
        // Zaten yüklenmiş zimmetleri kullan
        if (personelZimmetleri.length === 0) {
          toast.warning(`${item.ad} ${item.soyad} adlı personelin zimmetinde malzeme bulunmamaktadır.`);
          return;
        }
        
        // Her malzeme için kaynak personel bilgisini ekle (bulk iade için gerekli)
        const malzemelerForBulkIade = personelZimmetleri.map(malzeme => ({
          ...malzeme,
          kaynakPersonelId: item.id // Mevcut personel kaynak olacak (iade eden)
        }));
        
        openBulkIadeSheet(malzemelerForBulkIade);
      }
      
      console.log(`${item.ad} için bulk iade işlemi başlatıldı`);
    } catch (error) {
      console.error('Bulk iade işlemi başlatılamadı:', error);
      toast.error('Zimmetli malzemeler yüklenirken hata oluştu.');
    }
  }, [item, personelZimmetleri, GetPersonelZimmetleri, openBulkIadeSheet]);

  // Bulk devir işlemi
  const handleBulkDevir = useCallback(async () => {
    if (!item?.id) return;
    
    try {
      // Eğer personel zimmetleri daha önce yüklenmemişse, yükle
      if (!personelZimmetleri || personelZimmetleri.length === 0) {
        console.log('Personel zimmetleri yükleniyor...');
        const result = await GetPersonelZimmetleri(item.id, { showToast: false });
        
        // Zimmetleri store'dan al
        const zimmetler = MalzemeHareket_Store.getState().personelZimmetleri;
        
        if (!zimmetler || zimmetler.length === 0) {
          toast.warning(`${item.ad} ${item.soyad} adlı personelin zimmetinde malzeme bulunmamaktadır.`);
          return;
        }
        
        // Bulk devir sheet'i aç - her malzeme için kaynak personeli belirle
        const malzemelerWithSource = zimmetler.map(malzeme => ({
          ...malzeme,
          kaynakPersonelId: item.id // Mevcut personel kaynak olacak
        }));
        
        openBulkDevirSheet(malzemelerWithSource);
      } else {
        // Zaten yüklenmiş zimmetleri kullan
        if (personelZimmetleri.length === 0) {
          toast.warning(`${item.ad} ${item.soyad} adlı personelin zimmetinde malzeme bulunmamaktadır.`);
          return;
        }
        
        // Bulk devir sheet'i aç - her malzeme için kaynak personeli belirle
        const malzemelerWithSource = personelZimmetleri.map(malzeme => ({
          ...malzeme,
          kaynakPersonelId: item.id // Mevcut personel kaynak olacak
        }));
        
        openBulkDevirSheet(malzemelerWithSource);
      }
      
      console.log(`${item.ad} için bulk devir işlemi başlatıldı`);
    } catch (error) {
      console.error('Bulk devir işlemi başlatılamadı:', error);
      toast.error('Zimmetli malzemeler yüklenirken hata oluştu.');
    }
  }, [item, personelZimmetleri, GetPersonelZimmetleri, openBulkDevirSheet]);

  const handleShowPersonelHareketleri = useCallback(async () => {
    if (!item?.id) {
      toast.error('Personel bilgisi bulunamadı.');
      return;
    }

    try {
      console.log('Personel hareketleri getiriliyor:', item.id);
      
      // Store'dan personel hareketlerini getir
      await GetPersonelHareketleri(item.id, {
        page: 1,
        limit: 50,
        sortBy: 'islemTarihi',
        sortOrder: 'desc'
      });
      
      // Sheet'i aç
      openPersonelHareketleriSheet(item);
      
      toast.success(`${item.ad} personelinin malzeme hareketleri getiriliyor...`);
    } catch (error) {
      console.error('Personel hareketleri getirme hatası:', error);
      toast.error('Personel hareketleri getirilirken bir hata oluştu.');
    }
  }, [item, GetPersonelHareketleri, openPersonelHareketleriSheet]);

  return (
    <BaseContextMenu item={item} entityType={EntityType} entityHuman={EntityHuman} menuTitle={menuTitle}>
      {/* Personel Zimmetleri Göster */}
      <ContextMenuItem className="" onSelect={handleShowPersonelZimmetleri}>
        <Package className="mr-2 h-4 w-4 text-orange-500" />
        <span>Zimmetli Malzemeleri Göster</span>
      </ContextMenuItem>

      <ContextMenuItem className="" onSelect={handleShowPersonelHareketleri}>
        <Activity className="mr-2 h-4 w-4 text-green-500" />
        <span>Malzeme Hareketlerini Göster</span>
      </ContextMenuItem>

      {/* YENİ: Zimmet Bilgi Fişi Yazdır */}
      <ContextMenuItem className="" onSelect={handleGenerateZimmetBilgiFisi}>
        <FileTextIcon className="mr-2 h-4 w-4 text-indigo-500" />
        <span>Zimmet Bilgi Fişi Yazdır</span>
      </ContextMenuItem>

      {/* Bulk İşlemler */}
      <ContextMenuSeparator />
      
      <ContextMenuItem className="" onSelect={handleBulkIade}>
        <RotateCcw className="mr-2 h-4 w-4 text-blue-500" />
        <span>Tüm Zimmetleri İade Al</span>
      </ContextMenuItem>

      <ContextMenuItem className="" onSelect={handleBulkDevir}>
        <ArrowLeftRight className="mr-2 h-4 w-4 text-purple-500" />
        <span>Tüm Zimmetleri Devret</span>
      </ContextMenuItem>

      <ContextMenuSeparator />

      {/* Bağlı Büro Görüntüleme */}
      {item?.buro && (
        <ContextMenuItem className="" onSelect={handleViewBuro}>
          <Building2Icon className="mr-2 h-4 w-4 text-blue-500" />
          <span>Bağlı Büroyu Görüntüle ({item.buro.ad})</span>
        </ContextMenuItem>
      )}

      {/* Şifre Sıfırlama */}
      {item?.isUser && (
        <ContextMenuItem className="" onSelect={handleResetPassword}>
          <KeyIcon className="mr-2 h-4 w-4 text-orange-500" />
          <span>Şifre Sıfırla</span>
        </ContextMenuItem>
      )}

      {/* Sistem Kullanıcısı Durumunu Değiştir */}
      <ContextMenuItem className="" onSelect={handleToggleUserStatus}>
        <UserCheckIcon className="mr-2 h-4 w-4 text-green-500" />
        <span>
          {item?.isUser ? 'Sistem Kullanıcılığını Kaldır' : 'Sistem Kullanıcısı Yap'}
        </span>
      </ContextMenuItem>

      {/* Yetki Yönetimi */}
      {item?.isUser && (
        <ContextMenuItem className="" onSelect={handleManagePermissions}>
          <ShieldIcon className="mr-2 h-4 w-4 text-purple-500" />
          <span>Yetkileri Yönet</span>
        </ContextMenuItem>
      )}

      {/* Email Gönder */}
      {item?.email && (
        <ContextMenuItem className="" onSelect={handleSendEmail}>
          <MailIcon className="mr-2 h-4 w-4 text-blue-500" />
          <span>Email Gönder</span>
        </ContextMenuItem>
      )}

      {/* Telefon Ara */}
      {item?.telefon && (
        <ContextMenuItem className="" onSelect={handleCallPhone}>
          <PhoneIcon className="mr-2 h-4 w-4 text-green-500" />
          <span>Telefon Ara</span>
        </ContextMenuItem>
      )}

      {/* Giriş Geçmişi */}
      {item?.isUser && (
        <ContextMenuItem className="" onSelect={handleViewLoginHistory}>
          <HistoryIcon className="mr-2 h-4 w-4 text-gray-500" />
          <span>Giriş Geçmişini Görüntüle</span>
        </ContextMenuItem>
      )}
    </BaseContextMenu>
  );
}