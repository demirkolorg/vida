// client/src/app/malzeme/table/contextMenu.jsx - Güncellenmiş versiyon
import { useCallback } from 'react';
import { ContextMenuItem } from '@/components/ui/context-menu';
import { BaseContextMenu } from '@/components/contextMenu/BaseContextMenu';
import { EntityHuman, EntityType } from '../constants/api';
import { useSheetStore } from '@/stores/sheetStore';
import { getAvailableHareketTurleri } from '../helpers/hareketBusinessLogic';
import { UserIcon, ArrowRightIcon, ArrowLeftIcon, RefreshCwIcon, AlertTriangleIcon, TruckIcon, TrendingDownIcon, PackageIcon } from 'lucide-react';

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

  // Malzeme durumuna göre yapılabilecek hareket türleri
  const availableHareketler = getAvailableHareketTurleri(item);

  const handleHareketEkle = useCallback(
    (hareketKey, hareketData) => {
      // Her hareket türü için ayrı sheet açacağız
      const sheetModeMap = {
        'Zimmet': 'zimmet',
        'Iade': 'iade', 
        'Devir': 'devir',
        'DepoTransferi': 'depoTransfer',
        'KondisyonGuncelleme': 'kondisyon',
        'Kayip': 'kayip',
        'Dusum': 'dusum'
      };

      const sheetMode = sheetModeMap[hareketKey];
      
      if (sheetMode) {
        // Malzeme hareket sheet'ini aç
        openSheet(sheetMode, item, 'malzemeHareket', {
          hareketConfig: hareketData,
        });
      }
    },
    [item, openSheet],
  );

  return (
    <BaseContextMenu item={item} entityType={EntityType} entityHuman={EntityHuman} menuTitle={menuTitle}>
      {/* Yapılabilecek İşlemler */}
      {availableHareketler.length > 0 && (
        <>
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-b border-border my-1">
            Yapılabilecek İşlemler ({availableHareketler.length})
          </div>
          {availableHareketler.map(hareket => {
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
        </>
      )}

      {/* Eğer hiç yapılabilecek işlem yoksa */}
      {availableHareketler.length === 0 && (
        <>
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-b border-border my-1">
            Yapılabilecek İşlemler
          </div>
          <ContextMenuItem className="cursor-default" disabled>
            <AlertTriangleIcon className="mr-2 h-4 w-4 text-yellow-500" />
            <span className="text-sm text-muted-foreground">
              Mevcut durumda yapılabilecek işlem yok
            </span>
          </ContextMenuItem>
        </>
      )}
    </BaseContextMenu>
  );
}