// client/src/app/malzeme/table/contextMenu.jsx - Güncellenmiş versiyon
import { useCallback } from 'react';
import { ContextMenuItem } from '@/components/ui/context-menu';
import { BaseContextMenu } from '@/components/contextMenu/BaseContextMenu';
import { EntityHuman, EntityType } from '../constants/api';
import { useSheetStore } from '@/stores/sheetStore';
import { UserIcon, ArrowRightIcon, ArrowLeftIcon, RefreshCwIcon, AlertTriangleIcon, TruckIcon, TrendingDownIcon, PackageIcon } from 'lucide-react';

// Malzemenin mevcut durumunu analiz eden fonksiyon
const analyzeMalzemeDurumu = item => {
  if (!item || !item.malzemeHareketleri || item.malzemeHareketleri.length === 0) {
    return {
      isZimmetli: false,
      sonHareketTuru: null,
      mevcentKondisyon: 'Saglam',
      zimmetliPersonel: null,
      mevcentKonum: null,
    };
  }

  const sonHareket = item.malzemeHareketleri[0]; // İlk eleman en son hareket (backend'de desc sıralı)

  // Zimmet durumu kontrolü
  const zimmetliHareketler = ['Zimmet', 'Devir'];
  const zimmetSonlandiran = ['Iade', 'Kayip', 'Dusum'];

  let isZimmetli = false;
  let zimmetliPersonel = null;

  if (zimmetliHareketler.includes(sonHareket.hareketTuru)) {
    isZimmetli = true;
    zimmetliPersonel = sonHareket.hedefPersonel;
  } else if (zimmetSonlandiran.includes(sonHareket.hareketTuru)) {
    isZimmetli = false;
    zimmetliPersonel = null;
  } else if (sonHareket.hareketTuru === 'KondisyonGuncelleme') {
    // Kondisyon güncelleme zimmet durumunu etkilemez, önceki harekete bak
    if (item.malzemeHareketleri.length > 1) {
      const oncekiHareket = item.malzemeHareketleri[1];
      if (zimmetliHareketler.includes(oncekiHareket.hareketTuru)) {
        isZimmetli = true;
        zimmetliPersonel = oncekiHareket.hedefPersonel;
      }
    }
  }

  return {
    isZimmetli,
    sonHareketTuru: sonHareket.hareketTuru,
    mevcentKondisyon: sonHareket.malzemeKondisyonu || 'Saglam',
    zimmetliPersonel,
    mevcentKonum: sonHareket.konum,
    sonHareket,
  };
};

// Malzemenin mevcut durumuna göre yapılabilecek hareket türlerini belirle
const getAvailableHareketTurleri = item => {
  if (!item) return [];

  const durum = analyzeMalzemeDurumu(item);
  const availableHareketler = [];

  // Zimmet Ver - Malzeme zimmetli değilse ve sağlam durumda ise
  if (!durum.isZimmetli && durum.mevcentKondisyon === 'Saglam') {
    availableHareketler.push({
      key: 'Zimmet',
      label: 'Zimmet Ver',
      description: 'Malzemeyi personele zimmet ver',
      icon: 'UserIcon',
      color: 'blue',
    });
  }

  // İade Al - Malzeme zimmetli ise
  if (durum.isZimmetli) {
    availableHareketler.push({
      key: 'Iade',
      label: 'İade Al',
      description: `${durum.zimmetliPersonel?.ad || 'Personel'}den iade al`,
      icon: 'ArrowLeftIcon',
      color: 'green',
    });
  }

  // Devir Et - Malzeme zimmetli ise
  if (durum.isZimmetli) {
    availableHareketler.push({
      key: 'Devir',
      label: 'Devir Et',
      description: 'Başka personele devret',
      icon: 'ArrowRightIcon',
      color: 'orange',
    });
  }

  // Kondisyon Güncelle - Her zaman yapılabilir
  availableHareketler.push({
    key: 'KondisyonGuncelleme',
    label: 'Kondisyon Güncelle',
    description: `Mevcut: ${durum.mevcentKondisyon}`,
    icon: 'RefreshCwIcon',
    color: 'purple',
  });

  // Depo Transfer - Zimmetli değilse
  if (!durum.isZimmetli) {
    availableHareketler.push({
      key: 'DepoTransferi',
      label: 'Depo Transfer',
      description: 'Başka depoya transfer et',
      icon: 'TruckIcon',
      color: 'indigo',
    });
  }

  // Kayıp Bildir - Zimmetli ise veya depoda ise
  if (durum.isZimmetli || durum.mevcentKonum) {
    availableHareketler.push({
      key: 'Kayip',
      label: 'Kayıp Bildir',
      description: 'Malzemenin kayıp olduğunu bildir',
      icon: 'AlertTriangleIcon',
      color: 'red',
    });
  }

  // Düşüm Yap - Zimmetli değilse ve arızalı/hurda ise
  if (!durum.isZimmetli && ['Arizali', 'Hurda'].includes(durum.mevcentKondisyon)) {
    availableHareketler.push({
      key: 'Dusum',
      label: 'Düşüm Yap',
      description: 'Envanterden çıkar',
      icon: 'TrendingDownIcon',
      color: 'gray',
    });
  }

  return availableHareketler;
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

  // Malzeme durumunu analiz et
  const malzemeDurum = analyzeMalzemeDurumu(item);

  // Mevcut duruma göre yapılabilecek hareket türleri
  const availableHareketler = getAvailableHareketTurleri(item);

  const handleHareketEkle = useCallback(
    (hareketKey, hareketData) => {
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
        malzemeDurum: malzemeDurum, // Malzeme durumu bilgisi
      };

      console.log('Hareket ekle:', hareketKey, sheetParams); // Debug için
      openSheet('create', null, 'malzemeHareket', sheetParams);
    },
    [item, openSheet, malzemeDurum],
  );

  return (
    <BaseContextMenu item={item} entityType={EntityType} entityHuman={EntityHuman} menuTitle={menuTitle}>
      {/* Malzeme Durum Bilgisi */}
      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-b border-border mb-1">Mevcut Durum</div>

      <ContextMenuItem className="cursor-default" disabled>
        <div className="flex flex-col w-full">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Son Hareket:</span>
            <span className="text-sm font-medium">{malzemeDurum.sonHareketTuru || 'Kayıt Yok'}</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-muted-foreground">Kondisyon:</span>
            <span className="text-sm">{malzemeDurum.mevcentKondisyon}</span>
          </div>
          {malzemeDurum.isZimmetli && malzemeDurum.zimmetliPersonel && (
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-muted-foreground">Zimmetli:</span>
              <span className="text-sm text-orange-600">{malzemeDurum.zimmetliPersonel.ad}</span>
            </div>
          )}
        </div>
      </ContextMenuItem>

      {/* Yapılabilecek İşlemler */}
      {availableHareketler.length > 0 && (
        <>
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-b border-border my-1">Yapılabilecek İşlemler ({availableHareketler.length})</div>
          {availableHareketler.map(hareket => {
            const IconComponent = ICON_MAP[hareket.icon] || PackageIcon;
            const iconColorClass = COLOR_MAP[hareket.color] || 'text-gray-500';

            return (
              <ContextMenuItem key={hareket.key} onSelect={() => handleHareketEkle(hareket.key, hareket)} className="cursor-pointer">
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
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-b border-border my-1">Yapılabilecek İşlemler</div>
          <ContextMenuItem className="cursor-default" disabled>
            <AlertTriangleIcon className="mr-2 h-4 w-4 text-yellow-500" />
            <span className="text-sm text-muted-foreground">Mevcut durumda yapılabilecek işlem yok</span>
          </ContextMenuItem>
        </>
      )}

   
    </BaseContextMenu>
  );
}
