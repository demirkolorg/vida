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
import { getAvailableHareketTurleri, getCurrentPersonel, getCurrentKonum } from '../helpers/hareketBusinessLogic';

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

  // İş mantığına göre uygun hareket türlerini al
  const availableHareketler = getAvailableHareketTurleri(item);
  const currentPersonel = getCurrentPersonel(item);
  const currentKonum = getCurrentKonum(item);

  const handleHareketEkle = useCallback((hareketKey, hareketData) => {
    // MalzemeHareket create sheet'ini aç ve ilgili verileri gönder
    const sheetParams = {
      preSelectedMalzeme: {
        id: item.id,
        vidaNo: item.vidaNo,
        sabitKodu: item.sabitKodu,
        marka: item.marka,
        model: item.model,
        currentPersonelId: currentPersonel?.id,
        currentKonumId: currentKonum?.id,
      },
      preSelectedHareketTuru: hareketKey,
      currentDate: new Date().toISOString().split('T')[0], // Bugünün tarihi
      hareketConfig: hareketData, // Hareket türü konfigürasyonu
      currentMalzemeInfo: {
        kondisyon: hareketData.currentInfo?.currentKondisyon,
        isZimmetli: hareketData.currentInfo?.isZimmetli,
        lastPersonel: hareketData.currentInfo?.lastPersonel,
      }
    };

    openSheet('create', null, 'malzemeHareket', sheetParams);
  }, [item, currentPersonel, currentKonum, openSheet]);

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
                  {/* Ek bilgi gösterimi */}
                  {hareket.currentInfo && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {hareket.currentInfo.isZimmetli && hareket.currentInfo.lastPersonel && (
                        <span>Zimmetli: {hareket.currentInfo.lastPersonel}</span>
                      )}
                      {hareket.currentInfo.currentKondisyon && (
                        <span>Kondisyon: {hareket.currentInfo.currentKondisyon}</span>
                      )}
                    </div>
                  )}
                </div>
              </ContextMenuItem>
            );
          })}
          <div className="h-1 border-b border-border my-1" />
        </>
      )}

      {/* Eğer hiç hareket yapılamıyorsa bilgilendirme */}
      {availableHareketler.length === 0 && (
        <>
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
            Hızlı İşlemler
          </div>
          <ContextMenuItem className="cursor-default" disabled>
            <AlertTriangleIcon className="mr-2 h-4 w-4 text-amber-500" />
            <div className="flex flex-col">
              <span className="text-sm">Yapılabilecek işlem yok</span>
              <span className="text-xs text-muted-foreground">
                Malzemenin mevcut durumu işlem yapılmasına uygun değil
              </span>
            </div>
          </ContextMenuItem>
          <div className="h-1 border-b border-border my-1" />
        </>
      )}

      {/* Malzeme Mevcut Durum Bilgileri */}
      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
        Mevcut Durum
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

      {/* Zimmet Durumu */}
      {currentPersonel && (
        <ContextMenuItem className="cursor-default" disabled>
          <UserIcon className="mr-2 h-4 w-4 text-blue-400" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Zimmetli Personel</span>
            <span className="text-sm">{currentPersonel.ad} ({currentPersonel.sicil})</span>
          </div>
        </ContextMenuItem>
      )}

      {/* Konum Bilgisi */}
      {currentKonum && (
        <ContextMenuItem className="cursor-default" disabled>
          <TruckIcon className="mr-2 h-4 w-4 text-indigo-400" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Mevcut Konum</span>
            <span className="text-sm">{currentKonum.ad} - {currentKonum.depo?.ad}</span>
          </div>
        </ContextMenuItem>
      )}

      {/* Kondisyon Bilgisi */}
      {availableHareketler.length > 0 && availableHareketler[0]?.currentInfo?.currentKondisyon && (
        <ContextMenuItem className="cursor-default" disabled>
          <RefreshCwIcon className="mr-2 h-4 w-4 text-purple-400" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Kondisyon</span>
            <span className="text-sm">
              {availableHareketler[0].currentInfo.currentKondisyon === 'Saglam' ? 'Sağlam' :
               availableHareketler[0].currentInfo.currentKondisyon === 'Arizali' ? 'Arızalı' :
               availableHareketler[0].currentInfo.currentKondisyon === 'Hurda' ? 'Hurda' :
               availableHareketler[0].currentInfo.currentKondisyon}
            </span>
          </div>
        </ContextMenuItem>
      )}
    </BaseContextMenu>
  );
}