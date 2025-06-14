// client/src/app/globalsearch/contextMenus/ContextMenuManager.jsx
import React from 'react';
import { toast } from 'sonner';

// Gerçek context menu'ları import et
import { Personel_ContextMenu } from '@/app/personel/table/contextMenu';
import { Malzeme_ContextMenu } from '@/app/malzeme/table/contextMenu';
import { MalzemeHareket_ContextMenu } from '@/app/malzemehareket/table/contextMenu';

// Global search özel context menu'ları (daha basit olanlar için)
import { BirimContextMenu } from './BirimContextMenu';
import { SubeContextMenu } from './SubeContextMenu';
import { BuroContextMenu } from './BuroContextMenu';
import { MarkaContextMenu } from './MarkaContextMenu';
import { ModelContextMenu } from './ModelContextMenu';
import { DepoContextMenu } from './DepoContextMenu';
import { KonumContextMenu } from './KonumContextMenu';
import { SabitKoduContextMenu } from './SabitKoduContextMenu';

export const ContextMenuManager = ({ entityType, item, onNavigate }) => {
  
  // Gerçek context menu'ları kullan (tam işlevsellik)
  switch (entityType) {
    case 'personel':
      return <Personel_ContextMenu item={item} />;
      
    case 'malzeme':
      return <Malzeme_ContextMenu item={item} />;
      
    case 'malzemeHareket':
      return <MalzemeHareket_ContextMenu item={item} />;
      
    // Diğer entity'ler için basit context menu'lar
    case 'birim':
      return <BirimContextMenu item={item} onAction={(action, item) => handleSimpleAction(action, item, entityType, onNavigate)} />;
      
    case 'sube':
      return <SubeContextMenu item={item} onAction={(action, item) => handleSimpleAction(action, item, entityType, onNavigate)} />;
      
    case 'buro':
      return <BuroContextMenu item={item} onAction={(action, item) => handleSimpleAction(action, item, entityType, onNavigate)} />;
      
    case 'marka':
      return <MarkaContextMenu item={item} onAction={(action, item) => handleSimpleAction(action, item, entityType, onNavigate)} />;
      
    case 'model':
      return <ModelContextMenu item={item} onAction={(action, item) => handleSimpleAction(action, item, entityType, onNavigate)} />;
      
    case 'depo':
      return <DepoContextMenu item={item} onAction={(action, item) => handleSimpleAction(action, item, entityType, onNavigate)} />;
      
    case 'konum':
      return <KonumContextMenu item={item} onAction={(action, item) => handleSimpleAction(action, item, entityType, onNavigate)} />;
      
    case 'sabitKodu':
      return <SabitKoduContextMenu item={item} onAction={(action, item) => handleSimpleAction(action, item, entityType, onNavigate)} />;
      
    default:
      return null;
  }
};

// Basit entity'ler için action handler
const handleSimpleAction = (action, item, entityType, onNavigate) => {
  
  // Önce onNavigate callback'ini çağır (eğer varsa)
  if (onNavigate) {
    onNavigate(item, entityType, action);
    return;
  }

  // Fallback toast mesajları
  switch (action) {
    case 'view':
      toast.info(`${item.ad || item.vidaNo || item.sicil} görüntüleniyor`);
      break;
    case 'edit':
      toast.info(`${item.ad || item.vidaNo || item.sicil} düzenleniyor`);
      break;
    case 'report':
      toast.info(`${item.ad || item.vidaNo || item.sicil} raporu hazırlanıyor`);
      break;
    case 'personnel':
      toast.info(`${item.ad} personel listesi gösteriliyor`);
      break;
    case 'materials':
      toast.info(`${item.ad} malzeme listesi gösteriliyor`);
      break;
    case 'branches':
      toast.info(`${item.ad} şube listesi gösteriliyor`);
      break;
    default:
      toast.info(`${action} işlemi başlatılıyor`);
  }
};