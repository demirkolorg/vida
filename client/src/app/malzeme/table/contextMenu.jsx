// client/src/app/malzeme/table/contextMenu.jsx
import { useCallback } from 'react';
import { ContextMenuItem } from '@/components/ui/context-menu';
import { BaseContextMenu } from '@/components/contextMenu/BaseContextMenu';
import { EntityHuman, EntityType } from '../constants/api';
import { useSheetStore } from '@/stores/sheetStore';
import { 
  UserIcon, 
  ArrowRightIcon, 
  ArrowLeftIcon, 
  RefreshCwIcon, 
  AlertTriangleIcon, 
  TruckIcon, 
  TrendingDownIcon,
  PackageIcon 
} from 'lucide-react';

// Simplified hareket türleri - iş mantığını basitleştirdik
const getAvailableHareketTurleri = (item) => {
  if (!item) return [];

  // Tüm temel hareket türlerini döndür - karmaşık iş mantığını kaldırdık
  return [
    {
      key: 'Zimmet',
      label: 'Zimmet Ver',
      description: 'Malzemeyi personele zimmet ver',
      icon: 'UserIcon',
      color: 'blue',
    },
    {
      key: 'Iade',
      label: 'İade Al',
      description: 'Zimmetli malzemeyi iade al',
      icon: 'ArrowLeftIcon',
      color: 'green',
    },
    {
      key: 'Devir',
      label: 'Devir Et',
      description: 'Malzemeyi başka personele devret',
      icon: 'ArrowRightIcon',
      color: 'orange',
    },
    {
      key: 'KondisyonGuncelleme',
      label: 'Kondisyon Güncelle',
      description: 'Malzemenin kondisyonunu güncelle',
      icon: 'RefreshCwIcon',
      color: 'purple',
    },
    {
      key: 'DepoTransferi',
      label: 'Depo Transfer',
      description: 'Malzemeyi başka depoya transfer et',
      icon: 'TruckIcon',
      color: 'indigo',
    },
    {
      key: 'Kayip',
      label: 'Kayıp Bildir',
      description: 'Malzemenin kayıp olduğunu bildir',
      icon: 'AlertTriangleIcon',
      color: 'red',
    },
    {
      key: 'Dusum',
      label: 'Düşüm Yap',
      description: 'Malzemeyi envanterden düş',
      icon: 'TrendingDownIcon',
      color: 'gray',
    },
  ];
};

// Icon mapping
const ICON_MAP = {
  UserIcon: UserIcon,
  ArrowRightIcon: ArrowRightIcon,
  ArrowLeftIcon: ArrowLeftIcon,
  RefreshCwIcon: RefreshCwIcon,
  AlertTriangleIcon: AlertTriangleIcon,
  TruckIcon: TruckIcon,
  TrendingDownIcon: TrendingDownIcon,
  PackageIcon: PackageIcon,
};

// Color mapping for icons
const COLOR_MAP = {
  blue: 'text-blue-500',
  green: 'text-green-500',
  orange: 'text-orange-500',
  purple: 'text-purple-500',
  red: 'text-red-500',
  indigo: 'text-indigo-500',
  gray: 'text-gray-500',
  emerald: 'text-emerald-500',
};

export function Malzeme_ContextMenu({ item }) {
  const { openSheet } = useSheetStore();
  const menuTitle = item?.vidaNo ? `${item.vidaNo} ${EntityHuman} Kaydı` : `${EntityHuman} İşlemleri`;

  // Basitleştirilmiş hareket türleri
  const availableHareketler = getAvailableHareketTurleri(item);

  const handleHareketEkle = useCallback((hareketKey, hareketData) => {
    // MalzemeHareket create sheet'ini aç ve ilgili verileri gönder
    const sheetParams = {
      preSelectedMalzeme: {
        id: item.id,
        vidaNo: item.vidaNo,
        sabitKodu: item.sabitKodu,
        marka: item.marka,
        model: item.model,
      },
      preSelectedHareketTuru: hareketKey,
      currentDate: new Date().toISOString().split('T')[0], // Bugünün tarihi
      hareketConfig: hareketData,
    };

    console.log('Hareket ekle:', hareketKey, sheetParams); // Debug için
    openSheet('create', null, 'malzemeHareket', sheetParams);
  }, [item, openSheet]);

  return (
    <BaseContextMenu item={item} entityType={EntityType} entityHuman={EntityHuman} menuTitle={menuTitle}>
      {/* Hızlı İşlemler Bölümü */}
      {availableHareketler.length > 0 && (
        <>
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
            Hızlı İşlemler
          </div>
          {availableHareketler.map((hareket) => {
            const IconComponent = ICON_MAP[hareket.icon] || PackageIcon;
            const iconColorClass = COLOR_MAP[hareket.color] || 'text-gray-500';
            
            return (
              <ContextMenuItem 
                key={hareket.key}
                onSelect={() => handleHareketEkle(hareket.key, hareket)}
                className="cursor-pointer"
              >
                <IconComponent className={`mr-2 h-4 w-4 ${iconColorClass}`} />
                <div className="flex flex-col">
                  <span>{hareket.label}</span>
                  <span className="text-xs text-muted-foreground">{hareket.description}</span>
                </div>
              </ContextMenuItem>
            );
          })}
          <div className="h-1 border-b border-border my-1" />
        </>
      )}

      {/* Malzeme Bilgileri */}
      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
        Malzeme Bilgileri
      </div>
      
      {/* Sabit Kod Bilgisi */}
      {item?.sabitKodu && (
        <ContextMenuItem className="cursor-default" disabled>
          <PackageIcon className="mr-2 h-4 w-4 text-gray-400" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Sabit Kod</span>
            <span className="text-sm">{item.sabitKodu.ad}</span>
          </div>
        </ContextMenuItem>
      )}
      
      {/* Marka/Model Bilgisi */}
      {item?.marka && item?.model && (
        <ContextMenuItem className="cursor-default" disabled>
          <PackageIcon className="mr-2 h-4 w-4 text-gray-400" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Marka/Model</span>
            <span className="text-sm">{item.marka.ad} / {item.model.ad}</span>
          </div>
        </ContextMenuItem>
      )}
    </BaseContextMenu>
  );
}