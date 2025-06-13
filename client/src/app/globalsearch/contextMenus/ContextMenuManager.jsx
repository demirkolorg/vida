// client/src/app/globalSearch/components/contextMenus/ContextMenuManager.jsx
import React from 'react';
import { toast } from 'sonner';
import {
  MalzemeContextMenu,
  PersonelContextMenu,
  BirimContextMenu,
  SubeContextMenu,
  BuroContextMenu,
  MarkaContextMenu,
  ModelContextMenu,
  DepoContextMenu,
  KonumContextMenu,
  MalzemeHareketContextMenu,
  SabitKoduContextMenu
} from './index';

export const ContextMenuManager = ({ entityType, item, onNavigate }) => {
  
  const handleAction = (action, item) => {
    console.log(`Context menu action: ${action}`, item);
    
    switch (action) {
      // Genel işlemler
      case 'view':
        handleView(item, entityType);
        break;
      case 'edit':
        handleEdit(item, entityType);
        break;
      case 'report':
        handleReport(item, entityType);
        break;
        
      // Malzeme özel işlemleri
      case 'zimmet':
        handleZimmet(item);
        break;
      case 'iade':
        handleIade(item);
        break;
      case 'devir':
        handleDevir(item);
        break;
      case 'transfer':
        handleTransfer(item);
        break;
      case 'location':
        handleLocation(item);
        break;
      case 'history':
        handleHistory(item, entityType);
        break;
        
      // Personel özel işlemleri
      case 'assignments':
        handleAssignments(item);
        break;
      case 'new-assignment':
        handleNewAssignment(item);
        break;
      case 'bulk-assignment':
        handleBulkAssignment(item);
        break;
        
      // Organizasyon işlemleri
      case 'personnel':
        handlePersonnel(item, entityType);
        break;
      case 'materials':
        handleMaterials(item, entityType);
        break;
      case 'branches':
        handleBranches(item);
        break;
      case 'offices':
        handleOffices(item);
        break;
      case 'parent-unit':
        handleParentUnit(item);
        break;
      case 'parent-branch':
        handleParentBranch(item);
        break;
        
      // Depo işlemleri
      case 'locations':
        handleLocations(item);
        break;
      case 'inventory':
        handleInventory(item);
        break;
      case 'stock-in':
        handleStockIn(item);
        break;
      case 'stock-out':
        handleStockOut(item);
        break;
        
      // Marka/Model işlemleri
      case 'models':
        handleModels(item);
        break;
      case 'brand':
        handleBrand(item);
        break;
        
      // Malzeme Hareket işlemleri
      case 'material':
        handleMaterial(item);
        break;
      case 'reverse':
        handleReverse(item);
        break;
      case 'document':
        handleDocument(item);
        break;
        
      // Sabit Kod işlemleri
      case 'subcategories':
        handleSubcategories(item);
        break;
        
      default:
        toast.info(`${action} işlemi henüz hazır değil`);
    }
  };

  // İşlem fonksiyonları
  const handleView = (item, entityType) => {
    onNavigate?.(item, entityType, 'view');
    toast.success(`${item.ad || item.vidaNo || item.sicil} detayları görüntüleniyor`);
  };

  const handleEdit = (item, entityType) => {
    onNavigate?.(item, entityType, 'edit');
    toast.success(`${item.ad || item.vidaNo || item.sicil} düzenleme sayfası açılıyor`);
  };

  const handleReport = (item, entityType) => {
    toast.info(`${entityType} raporu hazırlanıyor...`);
    // Rapor oluşturma işlemi
  };

  const handleZimmet = (item) => {
    toast.info(`${item.vidaNo} için zimmet işlemi başlatılıyor`);
    // Zimmet modal'ı açılacak
  };

  const handleIade = (item) => {
    toast.info(`${item.vidaNo} için iade işlemi başlatılıyor`);
    // İade modal'ı açılacak
  };

  const handleDevir = (item) => {
    toast.info(`${item.vidaNo} için devir işlemi başlatılıyor`);
    // Devir modal'ı açılacak
  };

  const handleTransfer = (item) => {
    toast.info(`${item.vidaNo} için transfer işlemi başlatılıyor`);
    // Transfer modal'ı açılacak
  };

  const handleLocation = (item) => {
    toast.info(`${item.vidaNo} konumu gösteriliyor`);
    // Konum bilgisi modal'ı açılacak
  };

  const handleHistory = (item, entityType) => {
    toast.info(`${entityType} geçmişi gösteriliyor`);
    // Geçmiş modal'ı açılacak
  };

  const handleAssignments = (item) => {
    toast.info(`${item.ad} ${item.soyad} zimmetli malzemeleri gösteriliyor`);
    // Zimmetli malzemeler listesi açılacak
  };

  const handleNewAssignment = (item) => {
    toast.info(`${item.ad} ${item.soyad} için yeni zimmet başlatılıyor`);
    // Yeni zimmet modal'ı açılacak
  };

  const handleBulkAssignment = (item) => {
    toast.info(`${item.ad} ${item.soyad} için toplu zimmet başlatılıyor`);
    // Toplu zimmet modal'ı açılacak
  };

  const handlePersonnel = (item, entityType) => {
    toast.info(`${item.ad} personel listesi gösteriliyor`);
    // Personel listesi açılacak
  };

  const handleMaterials = (item, entityType) => {
    toast.info(`${item.ad} malzeme listesi gösteriliyor`);
    // Malzeme listesi açılacak
  };

  const handleBranches = (item) => {
    toast.info(`${item.ad} şube listesi gösteriliyor`);
    // Şube listesi açılacak
  };

  const handleOffices = (item) => {
    toast.info(`${item.ad} büro listesi gösteriliyor`);
    // Büro listesi açılacak
  };

  const handleParentUnit = (item) => {
    toast.info(`${item.ad} bağlı birimi gösteriliyor`);
    // Bağlı birim gösterilecek
  };

  const handleParentBranch = (item) => {
    toast.info(`${item.ad} bağlı şubesi gösteriliyor`);
    // Bağlı şube gösterilecek
  };

  const handleLocations = (item) => {
    toast.info(`${item.ad} depo konumları gösteriliyor`);
    // Depo konumları açılacak
  };

  const handleInventory = (item) => {
    toast.info(`${item.ad} envanter raporu hazırlanıyor`);
    // Envanter raporu açılacak
  };

  const handleStockIn = (item) => {
    toast.info(`${item.ad} stok girişi başlatılıyor`);
    // Stok giriş modal'ı açılacak
  };

  const handleStockOut = (item) => {
    toast.info(`${item.ad} stok çıkışı başlatılıyor`);
    // Stok çıkış modal'ı açılacak
  };

  const handleModels = (item) => {
    toast.info(`${item.ad} model listesi gösteriliyor`);
    // Model listesi açılacak
  };

  const handleBrand = (item) => {
    toast.info(`${item.ad} marka bilgisi gösteriliyor`);
    // Marka bilgisi açılacak
  };

  const handleMaterial = (item) => {
    toast.info(`Hareket eden malzeme gösteriliyor`);
    // İlgili malzeme açılacak
  };

  const handleReverse = (item) => {
    toast.warning(`Hareket geri alınıyor`);
    // Hareket geri alma onayı açılacak
  };

  const handleDocument = (item) => {
    toast.info(`Hareket belgesi hazırlanıyor`);
    // Hareket belgesi açılacak
  };

  const handleSubcategories = (item) => {
    toast.info(`${item.ad} alt kategorileri gösteriliyor`);
    // Alt kategoriler açılacak
  };

  // Context menu component'ini döndür
  const getContextMenuComponent = () => {
    switch (entityType) {
      case 'malzeme':
        return <MalzemeContextMenu item={item} onAction={handleAction} />;
      case 'personel':
        return <PersonelContextMenu item={item} onAction={handleAction} />;
      case 'birim':
        return <BirimContextMenu item={item} onAction={handleAction} />;
      case 'sube':
        return <SubeContextMenu item={item} onAction={handleAction} />;
      case 'buro':
        return <BuroContextMenu item={item} onAction={handleAction} />;
      case 'marka':
        return <MarkaContextMenu item={item} onAction={handleAction} />;
      case 'model':
        return <ModelContextMenu item={item} onAction={handleAction} />;
      case 'depo':
        return <DepoContextMenu item={item} onAction={handleAction} />;
      case 'konum':
        return <KonumContextMenu item={item} onAction={handleAction} />;
      case 'malzemeHareket':
        return <MalzemeHareketContextMenu item={item} onAction={handleAction} />;
      case 'sabitKodu':
        return <SabitKoduContextMenu item={item} onAction={handleAction} />;
      default:
        return null;
    }
  };

  return getContextMenuComponent();
};