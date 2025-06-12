// client/src/app/globalSearch/helpers/entityConfig.js
import { 
  Building, Archive, FileText, Users, Package, Wrench, 
  MapPin, Warehouse, Tag 
} from 'lucide-react';

export const entityConfig = {
  birim: { 
    icon: Building, 
    label: 'Birimler', 
    color: 'text-blue-600',
    description: 'Kurumsal birimler ve departmanlar'
  },
  sube: { 
    icon: Archive, 
    label: 'Şubeler', 
    color: 'text-green-600',
    description: 'Birimlere bağlı şubeler'
  },
  buro: { 
    icon: FileText, 
    label: 'Bürolar', 
    color: 'text-purple-600',
    description: 'Şubelere bağlı bürolar'
  },
  personel: { 
    icon: Users, 
    label: 'Personeller', 
    color: 'text-orange-600',
    description: 'Sistem kullanıcıları ve personeller'
  },
  malzeme: { 
    icon: Package, 
    label: 'Malzemeler', 
    color: 'text-red-600',
    description: 'Demirbaş ve sarf malzemeleri'
  },
  malzemeHareket: { 
    icon: Wrench, 
    label: 'Malzeme Hareketleri', 
    color: 'text-yellow-600',
    description: 'Zimmet, iade ve transfer işlemleri'
  },
  marka: { 
    icon: Tag, 
    label: 'Markalar', 
    color: 'text-indigo-600',
    description: 'Ürün markaları'
  },
  model: { 
    icon: Tag, 
    label: 'Modeller', 
    color: 'text-pink-600',
    description: 'Ürün modelleri'
  },
  depo: { 
    icon: Warehouse, 
    label: 'Depolar', 
    color: 'text-cyan-600',
    description: 'Malzeme depolama alanları'
  },
  konum: { 
    icon: MapPin, 
    label: 'Konumlar', 
    color: 'text-emerald-600',
    description: 'Depo içi konumlar'
  },
  sabitKodu: { 
    icon: Tag, 
    label: 'Sabit Kodlar', 
    color: 'text-slate-600',
    description: 'Malzeme kategorileri'
  }
};

export const getEntityConfig = (entityType) => {
  return entityConfig[entityType] || {
    icon: FileText,
    label: entityType,
    color: 'text-gray-600',
    description: 'Bilinmeyen entity tipi'
  };
};

export const getAllEntityTypes = () => {
  return Object.keys(entityConfig);
};

export const getContextMenuSupportedEntities = () => {
  return ['malzeme', 'birim', 'personel', 'sube'];
};