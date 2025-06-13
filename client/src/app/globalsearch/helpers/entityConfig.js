// client/src/app/globalSearch/helpers/entityConfig.js - Güncellenmiş versiyon
import { 
  Building, Archive, FileText, Users, Package, Wrench, 
  MapPin, Warehouse, Tag 
} from 'lucide-react';

export const entityConfig = {
  birim: { 
    icon: Building, 
    label: 'Birimler', 
    color: 'text-blue-600',
    description: 'Kurumsal birimler ve departmanlar',
    hasContextMenu: true,
    contextMenuActions: ['view', 'edit', 'personnel', 'materials', 'branches', 'report']
  },
  sube: { 
    icon: Archive, 
    label: 'Şubeler', 
    color: 'text-green-600',
    description: 'Birimlere bağlı şubeler',
    hasContextMenu: true,
    contextMenuActions: ['view', 'edit', 'parent-unit', 'offices', 'personnel', 'report']
  },
  buro: { 
    icon: FileText, 
    label: 'Bürolar', 
    color: 'text-purple-600',
    description: 'Şubelere bağlı bürolar',
    hasContextMenu: true,
    contextMenuActions: ['view', 'edit', 'parent-branch', 'personnel', 'report']
  },
  personel: { 
    icon: Users, 
    label: 'Personeller', 
    color: 'text-orange-600',
    description: 'Sistem kullanıcıları ve personeller',
    hasContextMenu: true,
    contextMenuActions: ['view', 'edit', 'assignments', 'history', 'new-assignment', 'report']
  },
  malzeme: { 
    icon: Package, 
    label: 'Malzemeler', 
    color: 'text-red-600',
    description: 'Demirbaş ve sarf malzemeleri',
    hasContextMenu: true,
    contextMenuActions: ['view', 'edit', 'zimmet', 'iade', 'devir', 'transfer', 'location', 'history', 'report']
  },
  malzemeHareket: { 
    icon: Wrench, 
    label: 'Malzeme Hareketleri', 
    color: 'text-yellow-600',
    description: 'Zimmet, iade ve transfer işlemleri',
    hasContextMenu: true,
    contextMenuActions: ['view', 'material', 'personnel', 'location', 'reverse', 'document']
  },
  marka: { 
    icon: Tag, 
    label: 'Markalar', 
    color: 'text-indigo-600',
    description: 'Ürün markaları',
    hasContextMenu: true,
    contextMenuActions: ['view', 'edit', 'models', 'materials', 'report']
  },
  model: { 
    icon: Tag, 
    label: 'Modeller', 
    color: 'text-pink-600',
    description: 'Ürün modelleri',
    hasContextMenu: true,
    contextMenuActions: ['view', 'edit', 'brand', 'materials', 'report']
  },
  depo: { 
    icon: Warehouse, 
    label: 'Depolar', 
    color: 'text-cyan-600',
    description: 'Malzeme depolama alanları',
    hasContextMenu: true,
    contextMenuActions: ['view', 'edit', 'locations', 'materials', 'inventory', 'stock-in', 'stock-out', 'transfer']
  },
  konum: { 
    icon: MapPin, 
    label: 'Konumlar', 
    color: 'text-emerald-600',
    description: 'Depo içi konumlar',
    hasContextMenu: true,
    contextMenuActions: ['view', 'edit', 'parent-warehouse', 'materials', 'move-materials', 'report']
  },
  sabitKodu: { 
    icon: Tag, 
    label: 'Sabit Kodlar', 
    color: 'text-slate-600',
    description: 'Malzeme kategorileri',
    hasContextMenu: true,
    contextMenuActions: ['view', 'edit', 'materials', 'subcategories', 'report']
  }
};

export const getEntityConfig = (entityType) => {
  return entityConfig[entityType] || {
    icon: FileText,
    label: entityType,
    color: 'text-gray-600',
    description: 'Bilinmeyen entity tipi',
    hasContextMenu: false,
    contextMenuActions: []
  };
};

export const getAllEntityTypes = () => {
  return Object.keys(entityConfig);
};

export const getContextMenuSupportedEntities = () => {
  return Object.keys(entityConfig).filter(entityType => 
    entityConfig[entityType].hasContextMenu
  );
};

export const getEntityContextMenuActions = (entityType) => {
  const config = getEntityConfig(entityType);
  return config.contextMenuActions || [];
};

export const hasContextMenuSupport = (entityType) => {
  const config = getEntityConfig(entityType);
  return config.hasContextMenu || false;
};