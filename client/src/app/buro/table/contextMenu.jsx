import { useCallback } from 'react';
import { ContextMenuItem } from '@/components/ui/context-menu';
import { BaseContextMenu } from '@/components/contextMenu/BaseContextMenu';
import { EntityHuman, EntityType } from '../constants/api';
import { Building2Icon, PackageIcon, UsersIcon, FolderIcon, UserIcon } from 'lucide-react';

export function Buro_ContextMenu({ item }) {
  const menuTitle = item?.ad ? `${item.ad} ${EntityHuman} Kaydı` : `${EntityHuman} İşlemleri`;

  const handleViewSube = useCallback(() => {
    if (!item?.sube) return;
    // Bağlı şube detayını göster
    // Örnek: router.push(`/subeler/${item.sube.id}`);
  }, [item]);

  const handleViewAmir = useCallback(() => {
    if (!item?.amir) return;
    // Büro amiri detayını göster
    // Örnek: router.push(`/personeller/${item.amir.id}`);
  }, [item]);

  const handleListPersoneller = useCallback(() => {
    if (!item) return;
    // Personel listesini göster veya filtreleme yap
    // Örnek: router.push(`/personeller?buroId=${item.id}`);
  }, [item]);

  const handleListMalzemeler = useCallback(() => {
    if (!item) return;
    // Malzeme listesini göster veya filtreleme yap
    // Örnek: router.push(`/malzemeler?buroId=${item.id}`);
  }, [item]);

  const handleListProjeler = useCallback(() => {
    if (!item) return;
    // Proje listesini göster veya filtreleme yap
    // Örnek: router.push(`/projeler?buroId=${item.id}`);
  }, [item]);

  const handleManagePersonel = useCallback(() => {
    if (!item) return;
    // Personel atama/çıkarma işlemleri
    // Örnek: openPersonelManagementModal(item.id);
  }, [item]);

  return (
    <BaseContextMenu item={item} entityType={EntityType} entityHuman={EntityHuman} menuTitle={menuTitle}>
      {/* Bağlı Şube Görüntüleme */}
      {item?.sube && (
        <ContextMenuItem className="" onSelect={handleViewSube}>
          <Building2Icon className="mr-2 h-4 w-4 text-blue-500" />
          <span>Bağlı Şubeyi Görüntüle ({item.sube.ad})</span>
        </ContextMenuItem>
      )}

      {/* Büro Amiri Görüntüleme */}
      {item?.amir && (
        <ContextMenuItem className="" onSelect={handleViewAmir}>
          <UserIcon className="mr-2 h-4 w-4 text-purple-500" />
          <span>Büro Amirini Görüntüle ({item.amir.ad || item.amir.sicil})</span>
        </ContextMenuItem>
      )}

      {/* Büro Personellerini Listele */}
      {item?.personeller && item.personeller.length > 0 && (
        <ContextMenuItem className="" onSelect={handleListPersoneller}>
          <UsersIcon className="mr-2 h-4 w-4 text-green-500" />
          <span>Büro Personellerini Listele ({item.personeller.length})</span>
        </ContextMenuItem>
      )}

      {/* Personel Yönetimi */}
      <ContextMenuItem className="" onSelect={handleManagePersonel}>
        <UsersIcon className="mr-2 h-4 w-4 text-indigo-500" />
        <span>Personel Ata/Çıkar</span>
      </ContextMenuItem>

      {/* Büro Malzemelerini Listele */}
      {item?.malzemeler && item.malzemeler.length > 0 && (
        <ContextMenuItem className="" onSelect={handleListMalzemeler}>
          <PackageIcon className="mr-2 h-4 w-4 text-orange-500" />
          <span>Büro Malzemelerini Listele ({item.malzemeler.length})</span>
        </ContextMenuItem>
      )}

      {/* Aktif Projeleri Listele */}
      {item?.projeler && item.projeler.length > 0 && (
        <ContextMenuItem className="" onSelect={handleListProjeler}>
          <FolderIcon className="mr-2 h-4 w-4 text-teal-500" />
          <span>Aktif Projeleri Listele ({item.projeler.length})</span>
        </ContextMenuItem>
      )}
    </BaseContextMenu>
  );
}