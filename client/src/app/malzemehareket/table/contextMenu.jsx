import { useCallback } from 'react';
import { ContextMenuItem } from '@/components/ui/context-menu';
import { BaseContextMenu } from '@/components/contextMenu/BaseContextMenu';
import { EntityHuman, EntityType } from '../constants/api';
import { 
  PackageIcon, 
  UserIcon, 
  ClipboardListIcon, 
  MapPinIcon,
  HistoryIcon,
  ExternalLinkIcon,
  InfoIcon
} from 'lucide-react';

export function MalzemeHareket_ContextMenu({ item }) {
  const menuTitle = item?.hareketTuru 
    ? `${item.hareketTuru} - ${item.malzeme?.vidaNo || 'Malzeme'} İşlemi` 
    : `${EntityHuman} İşlemleri`;

  // Malzeme detayını görüntüle
  const handleViewMalzeme = useCallback(() => {
    if (!item?.malzeme) return;
    // Malzeme detay sayfasına yönlendir
    console.log('Malzeme detayı:', item.malzeme);
  }, [item]);

  // Malzeme sayfasında bu malzemeyi bul
  const handleGoToMalzeme = useCallback(() => {
    if (!item?.malzeme) return;
    // Malzeme listesi sayfasına git ve bu malzemeyi vurgula
    console.log('Malzeme sayfasına git:', item.malzeme.id);
  }, [item]);

  // Kaynak personel detayını görüntüle
  const handleViewKaynakPersonel = useCallback(() => {
    if (!item?.kaynakPersonel) return;
    console.log('Kaynak personel detayı:', item.kaynakPersonel);
  }, [item]);

  // Hedef personel detayını görüntüle
  const handleViewHedefPersonel = useCallback(() => {
    if (!item?.hedefPersonel) return;
    console.log('Hedef personel detayı:', item.hedefPersonel);
  }, [item]);

  // Konum detayını görüntüle
  const handleViewKonum = useCallback(() => {
    if (!item?.konum) return;
    console.log('Konum detayı:', item.konum);
  }, [item]);

  // Malzeme geçmişini görüntüle
  const handleViewMalzemeGecmisi = useCallback(() => {
    if (!item?.malzeme) return;
    console.log('Malzeme geçmişi:', item.malzeme.id);
  }, [item]);

  // Personel zimmet listesini görüntüle
  const handleViewPersonelZimmetleri = useCallback((personelId, personelAd) => {
    if (!personelId) return;
    console.log('Personel zimmetleri:', personelId, personelAd);
  }, []);

  return (
    <BaseContextMenu 
      item={item} 
      entityType={EntityType} 
      entityHuman={EntityHuman} 
      menuTitle={menuTitle}
      // Sadece DetailSheet aktif, Edit/Delete/Create yok
      showEdit={false}
      showDelete={false}
      showCreate={false}
    >
      {/* Bilgilendirme */}
      <ContextMenuItem className="text-blue-600 cursor-default" disabled>
        <InfoIcon className="mr-2 h-4 w-4" />
        <span className="text-xs">Hareket işlemleri Malzeme sayfasından yapılır</span>
      </ContextMenuItem>
      
      {/* Malzeme İşlemleri */}
      {item?.malzeme && (
        <>
          <ContextMenuItem onSelect={handleViewMalzeme}>
            <PackageIcon className="mr-2 h-4 w-4 text-blue-500" />
            <span>Malzeme Detayını Görüntüle</span>
          </ContextMenuItem>
          
          <ContextMenuItem onSelect={handleGoToMalzeme}>
            <ExternalLinkIcon className="mr-2 h-4 w-4 text-purple-500" />
            <span>Malzeme Sayfasına Git</span>
          </ContextMenuItem>
          
          <ContextMenuItem onSelect={handleViewMalzemeGecmisi}>
            <HistoryIcon className="mr-2 h-4 w-4 text-purple-500" />
            <span>Bu Malzemenin Tüm Geçmişi</span>
          </ContextMenuItem>
        </>
      )}

      {/* Personel İşlemleri - Sadece Görüntüleme */}
      {item?.kaynakPersonel && (
        <>
          <ContextMenuItem onSelect={handleViewKaynakPersonel}>
            <UserIcon className="mr-2 h-4 w-4 text-blue-600" />
            <span>Kaynak Personel Detayı ({item.kaynakPersonel.ad})</span>
          </ContextMenuItem>
          
          <ContextMenuItem onSelect={() => handleViewPersonelZimmetleri(item.kaynakPersonel.id, item.kaynakPersonel.ad)}>
            <ClipboardListIcon className="mr-2 h-4 w-4 text-indigo-500" />
            <span>Kaynak Personel Zimmet Listesi</span>
          </ContextMenuItem>
        </>
      )}

      {item?.hedefPersonel && (
        <>
          <ContextMenuItem onSelect={handleViewHedefPersonel}>
            <UserIcon className="mr-2 h-4 w-4 text-green-600" />
            <span>Hedef Personel Detayı ({item.hedefPersonel.ad})</span>
          </ContextMenuItem>
          
          <ContextMenuItem onSelect={() => handleViewPersonelZimmetleri(item.hedefPersonel.id, item.hedefPersonel.ad)}>
            <ClipboardListIcon className="mr-2 h-4 w-4 text-emerald-500" />
            <span>Hedef Personel Zimmet Listesi</span>
          </ContextMenuItem>
        </>
      )}

      {/* Konum İşlemleri - Sadece Görüntüleme */}
      {item?.konum && (
        <ContextMenuItem onSelect={handleViewKonum}>
          <MapPinIcon className="mr-2 h-4 w-4 text-red-500" />
          <span>Konum Detayı ({item.konum.ad})</span>
        </ContextMenuItem>
      )}
    </BaseContextMenu>
  );
}