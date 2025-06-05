import { useCallback } from 'react';
import { ContextMenuItem } from '@/components/ui/context-menu';
import { BaseContextMenu } from '@/components/contextMenu/BaseContextMenu';
import { EntityHuman, EntityType } from '../constants/api';
import { 
  FileTextIcon, 
  PrinterIcon, 
  EyeIcon, 
  EditIcon,
  PackageIcon,
  ClipboardListIcon 
} from 'lucide-react';

export function Tutanak_ContextMenu({ item }) {
  const menuTitle = item?.id 
    ? `${item.id} ${EntityHuman} İşlemleri` 
    : `${EntityHuman} İşlemleri`;

  const handleViewDetails = useCallback(() => {
    if (!item) return;
    // Tutanak önizleme işlemi - split screen açılacak
    console.log('Tutanak detay görüntüleme:', item.id);
  }, [item]);

  const handlePrintTutanak = useCallback(() => {
    if (!item) return;
    // Tutanak yazdırma işlemi
    console.log('Tutanak yazdırma:', item.id);
  }, [item]);

  const handleViewMalzemeler = useCallback(() => {
    if (!item) return;
    // İlgili malzemeleri listele
    console.log('Tutanak malzemeleri:', item.malzemeHareketleri);
  }, [item]);

  const handleEditTutanak = useCallback(() => {
    if (!item) return;
    // Sadece Taslak durumundaki tutanaklar düzenlenebilir
    if (item.durumu === 'Taslak') {
      console.log('Tutanak düzenleme:', item.id);
    }
  }, [item]);

  const isDraft = item?.durumu === 'Taslak';
  const isApproved = item?.durumu === 'Onaylandi';
  const malzemeCount = item?.malzemeHareketleri?.length || 0;

  return (
    <BaseContextMenu 
      item={item} 
      entityType={EntityType} 
      entityHuman={EntityHuman} 
      menuTitle={menuTitle}
      hideDefaultActions={true} // Varsayılan CRUD işlemlerini gizle
    >
      {/* Tutanak Önizleme */}
      <ContextMenuItem className="flex items-center" onSelect={handleViewDetails}>
        <EyeIcon className="mr-2 h-4 w-4 text-blue-500" />
        <span>Tutanak Önizlemesi</span>
      </ContextMenuItem>

      {/* Yazdırma - Sadece onaylı tutanaklar için */}
      {isApproved && (
        <ContextMenuItem className="flex items-center" onSelect={handlePrintTutanak}>
          <PrinterIcon className="mr-2 h-4 w-4 text-green-500" />
          <span>Tutanak Yazdır</span>
        </ContextMenuItem>
      )}

      {/* Düzenleme - Sadece taslak tutanaklar için */}
      {isDraft && (
        <ContextMenuItem className="flex items-center" onSelect={handleEditTutanak}>
          <EditIcon className="mr-2 h-4 w-4 text-orange-500" />
          <span>Tutanak Düzenle</span>
        </ContextMenuItem>
      )}

      {/* Malzeme Listesi */}
      {malzemeCount > 0 && (
        <ContextMenuItem className="flex items-center" onSelect={handleViewMalzemeler}>
          <PackageIcon className="mr-2 h-4 w-4 text-purple-500" />
          <span>İlgili Malzemeler ({malzemeCount})</span>
        </ContextMenuItem>
      )}

      {/* Tutanak Raporu */}
      <ContextMenuItem className="flex items-center" onSelect={() => console.log('Tutanak raporu')}>
        <ClipboardListIcon className="mr-2 h-4 w-4 text-indigo-500" />
        <span>Detaylı Rapor</span>
      </ContextMenuItem>

      {/* PDF Export */}
      <ContextMenuItem className="flex items-center" onSelect={() => console.log('PDF export')}>
        <FileTextIcon className="mr-2 h-4 w-4 text-red-500" />
        <span>PDF Olarak İndir</span>
      </ContextMenuItem>
    </BaseContextMenu>
  );
}