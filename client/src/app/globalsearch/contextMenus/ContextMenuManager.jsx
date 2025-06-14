// client/src/app/globalsearch/contextMenus/ContextMenuManager.jsx
import React from 'react';
import { toast } from 'sonner';
import { MalzemeContextMenu } from './MalzemeContextMenu';
import { PersonelContextMenu } from './PersonelContextMenu';
import { BirimContextMenu } from './BirimContextMenu';
import { SubeContextMenu } from './SubeContextMenu';
import { BuroContextMenu } from './BuroContextMenu';
import { MarkaContextMenu } from './MarkaContextMenu';
import { ModelContextMenu } from './ModelContextMenu';
import { DepoContextMenu } from './DepoContextMenu';
import { KonumContextMenu } from './KonumContextMenu';
import { MalzemeHareketContextMenu } from './MalzemeHareketContextMenu';
import { SabitKoduContextMenu } from './SabitKoduContextMenu';

export const ContextMenuManager = ({ entityType, item, onNavigate }) => {
  
  const handleAction = (action, item) => {
    console.log(`Context menu action: ${action}`, item);
    
    // Önce onNavigate callback'ini çağır (eğer varsa)
    if (onNavigate) {
      onNavigate(item, entityType, action);
      return;
    }

    // Fallback toast mesajları (eğer onNavigate yoksa)
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
        
      // Hareket işlemleri
      case 'material':
        handleMaterial(item);
        break;
      case 'reverse':
        handleReverse(item);
        break;
      case 'document':
        handleDocument(item);
        break;
      case 'subcategories':
        handleSubcategories(item);
        break;
        
      default:
        toast.info(`${action} işlemi henüz implement edilmedi`);
    }
  };

  // Fallback handler fonksiyonları
  const handleView = (item, entityType) => {
    toast.info(`${item.ad || item.vidaNo || item.sicil} görüntüleniyor`);
  };

  const handleEdit = (item, entityType) => {
    toast.info(`${item.ad || item.vidaNo || item.sicil} düzenleniyor`);
  };

  const handleReport = (item, entityType) => {
    toast.info(`${item.ad || item.vidaNo || item.sicil} raporu hazırlanıyor`);
  };

  const handleZimmet = (item) => {
    toast.info(`${item.vidaNo} zimmet işlemi başlatılıyor`);
  };

  const handleIade = (item) => {
    toast.info(`${item.vidaNo} iade işlemi başlatılıyor`);
  };

  const handleDevir = (item) => {
    toast.info(`${item.vidaNo} devir işlemi başlatılıyor`);
  };

  const handleTransfer = (item) => {
    toast.info(`${item.vidaNo} transfer işlemi başlatılıyor`);
  };

  const handleLocation = (item) => {
    toast.info(`${item.vidaNo || item.ad} konum bilgisi gösteriliyor`);
  };

  const handleHistory = (item, entityType) => {
    toast.info(`${item.ad || item.vidaNo || item.sicil} geçmişi gösteriliyor`);
  };

  const handleAssignments = (item) => {
    toast.info(`${item.ad} zimmetli malzemeleri gösteriliyor`);
  };

  const handleNewAssignment = (item) => {
    toast.info(`${item.ad} için yeni zimmet işlemi başlatılıyor`);
  };

  const handleBulkAssignment = (item) => {
    toast.info(`${item.ad} için toplu zimmet işlemi başlatılıyor`);
  };

  const handlePersonnel = (item, entityType) => {
    toast.info(`${item.ad} personel listesi gösteriliyor`);
  };

  const handleMaterials = (item, entityType) => {
    toast.info(`${item.ad} malzeme listesi gösteriliyor`);
  };

  const handleBranches = (item) => {
    toast.info(`${item.ad} şube listesi gösteriliyor`);
  };

  const handleOffices = (item) => {
    toast.info(`${item.ad} büro listesi gösteriliyor`);
  };

  const handleParentUnit = (item) => {
    toast.info(`${item.ad} bağlı birimi gösteriliyor`);
  };

  const handleParentBranch = (item) => {
    toast.info(`${item.ad} bağlı şubesi gösteriliyor`);
  };

  const handleLocations = (item) => {
    toast.info(`${item.ad} depo konumları gösteriliyor`);
  };

  const handleInventory = (item) => {
    toast.info(`${item.ad} envanter raporu hazırlanıyor`);
  };

  const handleStockIn = (item) => {
    toast.info(`${item.ad} stok girişi başlatılıyor`);
  };

  const handleStockOut = (item) => {
    toast.info(`${item.ad} stok çıkışı başlatılıyor`);
  };

  const handleModels = (item) => {
    toast.info(`${item.ad} model listesi gösteriliyor`);
  };

  const handleBrand = (item) => {
    toast.info(`${item.ad} marka bilgisi gösteriliyor`);
  };

  const handleMaterial = (item) => {
    toast.info(`Hareket eden malzeme gösteriliyor`);
  };

  const handleReverse = (item) => {
    toast.warning(`Hareket geri alınıyor`);
  };

  const handleDocument = (item) => {
    toast.info(`Hareket belgesi hazırlanıyor`);
  };

  const handleSubcategories = (item) => {
    toast.info(`${item.ad} alt kategorileri gösteriliyor`);
  };

  // Context menu component'ini döndür
  const getContextMenuComponent = () => {
    const commonProps = { item, onAction: handleAction };
    
    switch (entityType) {
      case 'malzeme':
        return <MalzemeContextMenu {...commonProps} />;
      case 'personel':
        return <PersonelContextMenu {...commonProps} />;
      case 'birim':
        return <BirimContextMenu {...commonProps} />;
      case 'sube':
        return <SubeContextMenu {...commonProps} />;
      case 'buro':
        return <BuroContextMenu {...commonProps} />;
      case 'marka':
        return <MarkaContextMenu {...commonProps} />;
      case 'model':
        return <ModelContextMenu {...commonProps} />;
      case 'depo':
        return <DepoContextMenu {...commonProps} />;
      case 'konum':
        return <KonumContextMenu {...commonProps} />;
      case 'malzemeHareket':
        return <MalzemeHareketContextMenu {...commonProps} />;
      case 'sabitKodu':
        return <SabitKoduContextMenu {...commonProps} />;
      default:
        return null;
    }
  };

  return getContextMenuComponent();
};