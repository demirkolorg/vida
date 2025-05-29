// client/src/app/malzeme/table/contextMenu.jsx
import { useCallback } from 'react';
import { ContextMenuItem } from '@/components/ui/context-menu';
import { BaseContextMenu } from '@/components/contextMenu/BaseContextMenu';
import { EntityHuman, EntityType } from '../constants/api';
import { History, Plus, Package, UserCheck, RotateCcw, ArrowUpDown } from 'lucide-react';
import { useSheetStore } from '@/stores/sheetStore';
import { MalzemeHareket_Store } from '@/app/malzemeHareket/constants/store';

export function Malzeme_ContextMenu({ item }) {
  const { openSheet } = useSheetStore();
  const malzemeHareketStore = MalzemeHareket_Store();
  
  const menuTitle = item?.vidaNo 
    ? `${item.vidaNo} ${EntityHuman} Kaydı` 
    : `${EntityHuman} İşlemleri`;

  // Malzeme hareket geçmişini göster
  const handleShowMalzemeGecmisi = useCallback(() => {
    if (!item?.id) return;
    malzemeHareketStore.GetMalzemeGecmisi(item.id, { showToast: true });
    // Hareket geçmişi için ayrı bir dialog veya sheet açılabilir
  }, [item, malzemeHareketStore]);

  // Yeni zimmet işlemi başlat
  const handleYeniZimmet = useCallback(() => {
    if (!item?.id) return;
    // MalzemeHareket create sheet'ini malzeme ile birlikte aç
    openSheet('create', { 
      malzemeId: item.id, 
      hareketTuru: 'Zimmet',
      malzemeKondisyonu: 'Saglam' // varsayılan
    }, 'malzemeHareket');
  }, [item, openSheet]);

  // Yeni iade işlemi başlat
  const handleYeniIade = useCallback(() => {
    if (!item?.id) return;
    openSheet('create', { 
      malzemeId: item.id, 
      hareketTuru: 'Iade',
      malzemeKondisyonu: 'Saglam'
    }, 'malzemeHareket');
  }, [item, openSheet]);

  // Yeni devir işlemi başlat
  const handleYeniDevir = useCallback(() => {
    if (!item?.id) return;
    openSheet('create', { 
      malzemeId: item.id, 
      hareketTuru: 'Devir',
      malzemeKondisyonu: 'Saglam'
    }, 'malzemeHareket');
  }, [item, openSheet]);

  // Kondisyon güncelleme
  const handleKondisyonGuncelle = useCallback(() => {
    if (!item?.id) return;
    openSheet('create', { 
      malzemeId: item.id, 
      hareketTuru: 'KondisyonGuncelleme',
      malzemeKondisyonu: item.malzemeKondisyonu || 'Saglam'
    }, 'malzemeHareket');
  }, [item, openSheet]);

  return (
    <BaseContextMenu 
      item={item} 
      entityType={EntityType} 
      entityHuman={EntityHuman} 
      menuTitle={menuTitle}
    >
      {/* Malzeme hareket geçmişi */}
      <ContextMenuItem onSelect={handleShowMalzemeGecmisi}>
        <History className="mr-2 h-4 w-4 text-blue-500" />
        <span>Hareket Geçmişini Göster</span>
      </ContextMenuItem>

      {/* Hızlı hareket işlemleri */}
      <div className="px-2 py-1.5">
        <div className="text-xs font-medium text-muted-foreground mb-1">Hızlı İşlemler</div>
      </div>

      <ContextMenuItem onSelect={handleYeniZimmet}>
        <UserCheck className="mr-2 h-4 w-4 text-red-500" />
        <span>Zimmet Ver</span>
      </ContextMenuItem>

      <ContextMenuItem onSelect={handleYeniIade}>
        <RotateCcw className="mr-2 h-4 w-4 text-green-500" />
        <span>İade Al</span>
      </ContextMenuItem>

      <ContextMenuItem onSelect={handleYeniDevir}>
        <ArrowUpDown className="mr-2 h-4 w-4 text-yellow-500" />
        <span>Devir Yap</span>
      </ContextMenuItem>

      <ContextMenuItem onSelect={handleKondisyonGuncelle}>
        <Package className="mr-2 h-4 w-4 text-purple-500" />
        <span>Kondisyon Güncelle</span>
      </ContextMenuItem>

      {/* Genel hareket ekleme */}
      <ContextMenuItem onSelect={() => openSheet('create', { malzemeId: item.id }, 'malzemeHareket')}>
        <Plus className="mr-2 h-4 w-4 text-primary" />
        <span>Yeni Hareket Ekle</span>
      </ContextMenuItem>
    </BaseContextMenu>
  );
}