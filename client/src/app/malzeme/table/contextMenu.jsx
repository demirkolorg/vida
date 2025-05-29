import { useCallback } from 'react';
import { ContextMenuItem, ContextMenuSeparator } from '@/components/ui/context-menu';
import { BaseContextMenu } from '@/components/contextMenu/BaseContextMenu';
import { EntityHuman, EntityType } from '../constants/api';
import { 
  PackageIcon, 
  BuildingIcon, 
  ArrowRightLeft,
  ArrowLeftRight,
  Users,
  MapPin,
  AlertTriangle,
  Settings,
  HistoryIcon,
  ClipboardListIcon
} from 'lucide-react';
import { useSheetStore } from '@/stores/sheetStore';

export function Malzeme_ContextMenu({ item }) {
  const { openSheet } = useSheetStore();
  const menuTitle = item?.vidaNo 
    ? `${item.vidaNo} - ${item.sabitKodu?.ad || 'Malzeme'} İşlemleri` 
    : `${EntityHuman} İşlemleri`;

  // Birim detayını görüntüle
  const handleViewBirim = useCallback(() => {
    if (!item?.birim) return;
    console.log('Birim detayı:', item.birim);
  }, [item]);

  // Şube detayını görüntüle
  const handleViewSube = useCallback(() => {
    if (!item?.sube) return;
    console.log('Şube detayı:', item.sube);
  }, [item]);

  // Malzeme hareket geçmişini görüntüle
  const handleViewHareketGecmisi = useCallback(() => {
    if (!item) return;
    // Malzeme hareket geçmişi sayfasına yönlendir
    console.log('Malzeme hareket geçmişi:', item.id);
  }, [item]);

  // === MALZEME HAREKET İŞLEMLERİ ===

  // Zimmet Ver
  const handleZimmetVer = useCallback(() => {
    if (!item) return;
    console.log('Zimmet Ver - Malzeme:', item); // Debug log
    openSheet('zimmet', { malzemeId: item.id, malzeme: item }, 'malzemeHareket');
  }, [item, openSheet]);

  // İade Al
  const handleIadeAl = useCallback(() => {
    if (!item) return;
    console.log('İade Al - Malzeme:', item); // Debug log
    openSheet('iade', { malzemeId: item.id, malzeme: item }, 'malzemeHareket');
  }, [item, openSheet]);

  // Devir Yap
  const handleDevirYap = useCallback(() => {
    if (!item) return;
    console.log('Devir Yap - Malzeme:', item); // Debug log
    openSheet('devir', { malzemeId: item.id, malzeme: item }, 'malzemeHareket');
  }, [item, openSheet]);

  // Depo Transferi
  const handleDepoTransferi = useCallback(() => {
    if (!item) return;
    console.log('Depo Transferi - Malzeme:', item); // Debug log
    openSheet('depoTransfer', { malzemeId: item.id, malzeme: item }, 'malzemeHareket');
  }, [item, openSheet]);

  // Kayıp Bildir
  const handleKayipBildir = useCallback(() => {
    if (!item) return;
    console.log('Kayıp Bildir - Malzeme:', item); // Debug log
    openSheet('kayip', { malzemeId: item.id, malzeme: item }, 'malzemeHareket');
  }, [item, openSheet]);

  // Kondisyon Güncelle
  const handleKondisyonGuncelle = useCallback(() => {
    if (!item) return;
    console.log('Kondisyon Güncelle - Malzeme:', item); // Debug log
    openSheet('kondisyon', { malzemeId: item.id, malzeme: item }, 'malzemeHareket');
  }, [item, openSheet]);

  return (
    <BaseContextMenu 
      item={item} 
      entityType={EntityType} 
      entityHuman={EntityHuman} 
      menuTitle={menuTitle}
    >
      {/* Malzeme Bilgileri */}
      {item?.birim && (
        <ContextMenuItem onSelect={handleViewBirim}>
          <BuildingIcon className="mr-2 h-4 w-4 text-blue-500" />
          <span>Bağlı Birim Detayı ({item.birim.ad})</span>
        </ContextMenuItem>
      )}

      {item?.sube && (
        <ContextMenuItem onSelect={handleViewSube}>
          <BuildingIcon className="mr-2 h-4 w-4 text-green-500" />
          <span>Bağlı Şube Detayı ({item.sube.ad})</span>
        </ContextMenuItem>
      )}

      <ContextMenuItem onSelect={handleViewHareketGecmisi}>
        <HistoryIcon className="mr-2 h-4 w-4 text-purple-500" />
        <span>Hareket Geçmişini Görüntüle</span>
      </ContextMenuItem>

      <ContextMenuSeparator />

      {/* Malzeme Hareket İşlemleri */}
      <ContextMenuItem onSelect={handleZimmetVer}>
        <ArrowRightLeft className="mr-2 h-4 w-4 text-blue-600" />
        <span>Zimmet Ver</span>
      </ContextMenuItem>

      <ContextMenuItem onSelect={handleIadeAl}>
        <ArrowLeftRight className="mr-2 h-4 w-4 text-green-600" />
        <span>İade Al</span>
      </ContextMenuItem>

      <ContextMenuItem onSelect={handleDevirYap}>
        <Users className="mr-2 h-4 w-4 text-purple-600" />
        <span>Devir Yap</span>
      </ContextMenuItem>

      <ContextMenuItem onSelect={handleDepoTransferi}>
        <MapPin className="mr-2 h-4 w-4 text-orange-600" />
        <span>Depo Transferi</span>
      </ContextMenuItem>

      <ContextMenuItem onSelect={handleKondisyonGuncelle}>
        <Settings className="mr-2 h-4 w-4 text-indigo-600" />
        <span>Kondisyon Güncelle</span>
      </ContextMenuItem>

      <ContextMenuSeparator />

      {/* Özel Durumlar */}
      <ContextMenuItem onSelect={handleKayipBildir} className="text-red-600">
        <AlertTriangle className="mr-2 h-4 w-4 text-red-600" />
        <span>Kayıp Bildir</span>
      </ContextMenuItem>
    </BaseContextMenu>
  );
}