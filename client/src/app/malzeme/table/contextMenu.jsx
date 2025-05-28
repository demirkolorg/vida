import { useCallback } from 'react';
import { ContextMenuItem } from '@/components/ui/context-menu';
import { BaseContextMenu } from '@/components/contextMenu/BaseContextMenu';
import { EntityHuman, EntityType } from '../constants/api';
import { Building2Icon, HomeIcon, PackageIcon, HistoryIcon, TagIcon } from 'lucide-react';

export function Malzeme_ContextMenu({ item }) {
  const menuTitle = item?.vidaNo 
    ? `${item.vidaNo} ${EntityHuman} Kaydı` 
    : `${EntityHuman} İşlemleri`;

  const handleViewBirim = useCallback(() => {
    if (!item?.birim) return;
    // Kuvve birimi detayını göster
    // Örnek: router.push(`/birimler/${item.birim.id}`);
  }, [item]);

  const handleViewSube = useCallback(() => {
    if (!item?.sube) return;
    // İş karşılığı şube detayını göster
    // Örnek: router.push(`/subeler/${item.sube.id}`);
  }, [item]);

  const handleViewSabitKodu = useCallback(() => {
    if (!item?.sabitKodu) return;
    // Sabit kodu detayını göster
    // Örnek: router.push(`/sabit-kodlar/${item.sabitKodu.id}`);
  }, [item]);

  const handleViewMarka = useCallback(() => {
    if (!item?.marka) return;
    // Marka detayını göster
    // Örnek: router.push(`/markalar/${item.marka.id}`);
  }, [item]);

  const handleViewModel = useCallback(() => {
    if (!item?.model) return;
    // Model detayını göster
    // Örnek: router.push(`/modeller/${item.model.id}`);
  }, [item]);

  const handleViewHareketler = useCallback(() => {
    if (!item) return;
    // Malzeme hareketlerini listele
    // Örnek: router.push(`/malzeme-hareketleri?malzemeId=${item.id}`);
  }, [item]);

  return (
    <BaseContextMenu 
      item={item} 
      entityType={EntityType} 
      entityHuman={EntityHuman} 
      menuTitle={menuTitle}
    >
      {/* Kuvve Birimi Görüntüleme */}
      {item?.birim && (
        <ContextMenuItem className="" onSelect={handleViewBirim}>
          <Building2Icon className="mr-2 h-4 w-4 text-blue-500" />
          <span>Kuvve Birimini Görüntüle ({item.birim.ad})</span>
        </ContextMenuItem>
      )}

      {/* İş Karşılığı Şube Görüntüleme */}
      {item?.sube && (
        <ContextMenuItem className="" onSelect={handleViewSube}>
          <HomeIcon className="mr-2 h-4 w-4 text-green-500" />
          <span>İş Karşılığı Şubeyi Görüntüle ({item.sube.ad})</span>
        </ContextMenuItem>
      )}

      {/* Sabit Kodu Görüntüleme */}
      {item?.sabitKodu && (
        <ContextMenuItem className="" onSelect={handleViewSabitKodu}>
          <TagIcon className="mr-2 h-4 w-4 text-purple-500" />
          <span>Sabit Kodunu Görüntüle ({item.sabitKodu.ad})</span>
        </ContextMenuItem>
      )}

      {/* Marka Görüntüleme */}
      {item?.marka && (
        <ContextMenuItem className="" onSelect={handleViewMarka}>
          <PackageIcon className="mr-2 h-4 w-4 text-orange-500" />
          <span>Markayı Görüntüle ({item.marka.ad})</span>
        </ContextMenuItem>
      )}

      {/* Model Görüntüleme */}
      {item?.model && (
        <ContextMenuItem className="" onSelect={handleViewModel}>
          <PackageIcon className="mr-2 h-4 w-4 text-teal-500" />
          <span>Modeli Görüntüle ({item.model.ad})</span>
        </ContextMenuItem>
      )}

      {/* Malzeme Hareketleri */}
      <ContextMenuItem className="" onSelect={handleViewHareketler}>
        <HistoryIcon className="mr-2 h-4 w-4 text-indigo-500" />
        <span>Malzeme Hareketlerini Görüntüle</span>
      </ContextMenuItem>
    </BaseContextMenu>
  );
}