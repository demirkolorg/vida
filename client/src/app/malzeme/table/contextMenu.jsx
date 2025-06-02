import { ContextMenuItem, ContextMenuSeparator } from '@/components/ui/context-menu';
import { BaseContextMenu } from '@/components/contextMenu/BaseContextMenu';
import { EntityHuman, EntityType } from '../constants/api';
import { useMalzemeHareketStore } from '@/stores/useMalzemeHareketStore';
import { Truck, UserCheck, RefreshCw, AlertTriangle, RotateCcw, ArrowUpDown, TrendingDown, Package } from 'lucide-react';
import { kayitUygun, zimmetUygun, iadeUygun, devirUygun, depoTransferiUygun, kondisyonGuncellemeUygun, kayipUygun, dusumUygun, sonHareketi, malzemePersonelde, malzemeDepoda, malzemeYok } from '../helpers/hareketKarar';

export function Malzeme_ContextMenu({ 
  item, 
  selectedItems = [], 
  isCurrentItemSelected = false, 
  selectionCount = 0 
}) {
  // Single item operations
  const openZimmetSheet = useMalzemeHareketStore(state => state.openZimmetSheet);
  const openIadeSheet = useMalzemeHareketStore(state => state.openIadeSheet);
  const openDevirSheet = useMalzemeHareketStore(state => state.openDevirSheet);
  const openDepoTransferiSheet = useMalzemeHareketStore(state => state.openDepoTransferiSheet);
  const openKondisyonGuncellemeSheet = useMalzemeHareketStore(state => state.openKondisyonGuncellemeSheet);
  const openKayipSheet = useMalzemeHareketStore(state => state.openKayipSheet);
  const openDusumSheet = useMalzemeHareketStore(state => state.openDusumSheet);
  const openKayitSheet = useMalzemeHareketStore(state => state.openKayitSheet);

  // Bulk operations
  const openBulkZimmetSheet = useMalzemeHareketStore(state => state.openBulkZimmetSheet);
  const openBulkIadeSheet = useMalzemeHareketStore(state => state.openBulkIadeSheet);
  const openBulkDevirSheet = useMalzemeHareketStore(state => state.openBulkDevirSheet);
  const openBulkDepoTransferiSheet = useMalzemeHareketStore(state => state.openBulkDepoTransferiSheet);
  const openBulkKondisyonGuncellemeSheet = useMalzemeHareketStore(state => state.openBulkKondisyonGuncellemeSheet);
  const openBulkKayipSheet = useMalzemeHareketStore(state => state.openBulkKayipSheet);
  const openBulkDusumSheet = useMalzemeHareketStore(state => state.openBulkDusumSheet);
  const openBulkKayitSheet = useMalzemeHareketStore(state => state.openBulkKayitSheet);

  // Hedef öğeleri belirle - Mantık tamamen düzeltildi
  const targetItems = (() => {
    // Eğer seçili itemlar varsa ve mevcut item da seçili ise, seçili itemları kullan
    if (selectionCount > 0 && isCurrentItemSelected) {
      return selectedItems;
    }
    // Eğer seçili itemlar var ama mevcut item seçili değilse, mevcut item'i seçili itemlara ekle
    if (selectionCount > 0 && !isCurrentItemSelected) {
      return [...selectedItems, item];
    }
    // Hiç seçim yoksa, sadece mevcut item'i kullan
    return [item];
  })();

  const isMultipleSelection = targetItems.length > 1;
  const hasSelectedItems = selectionCount > 0;

  // Menu başlığını belirle
  const menuTitle = (() => {
    if (isMultipleSelection) {
      return `${targetItems.length} ${EntityHuman} Seçildi`;
    }
    return item?.vidaNo ? `${item.vidaNo} ${EntityHuman} Kaydı` : `${EntityHuman} İşlemleri`;
  })();


  

  // İşlem handler'ları - Artık her zaman doğru fonksiyonu çağırıyor
  const handleKayit = () => {
    if (hasSelectedItems) {
      openBulkKayitSheet(targetItems);
    } else {
      openKayitSheet(item);
    }
  };

  const handleZimmet = () => {
    if (hasSelectedItems) {
      openBulkZimmetSheet(targetItems);
    } else {
      openZimmetSheet(item);
    }
  };

  const handleIade = () => {
    if (hasSelectedItems) {
      openBulkIadeSheet(targetItems);
    } else {
      openIadeSheet(item);
    }
  };

  const handleDevir = () => {
    if (hasSelectedItems) {
      openBulkDevirSheet(targetItems);
    } else {
      openDevirSheet(item);
    }
  };

  const handleDepoTransferi = () => {
    if (hasSelectedItems) {
      openBulkDepoTransferiSheet(targetItems);
    } else {
      openDepoTransferiSheet(item);
    }
  };

  const handleKondisyonGuncelleme = () => {
    if (hasSelectedItems) {
        openBulkKondisyonGuncellemeSheet(targetItems);
    } else {
      openKondisyonGuncellemeSheet(item);
    }
  };

  const handleKayip = () => {
    if (hasSelectedItems) {
      openBulkKayipSheet(targetItems);
    } else {
      openKayipSheet(item);
    }
  };

  const handleDusum = () => {
    if (hasSelectedItems) {
      openBulkDusumSheet(targetItems);
    } else {
      openDusumSheet(item);
    }
  };

  // İşlem uygunluğunu kontrol et
  const checkEligibility = (checkFunction) => {
    if (hasSelectedItems) {
      return targetItems.some(item => checkFunction(item));
    }
    return checkFunction(item);
  };

  return (
    <BaseContextMenu item={item} entityType={EntityType} entityHuman={EntityHuman} menuTitle={menuTitle}>
      {/* Çoklu seçim bilgisi */}
      {hasSelectedItems && (
        <>
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-b border-border">
            {isMultipleSelection ? `Çoklu İşlem - ${targetItems.length} öğe` : `Toplu İşlem - ${targetItems.length} öğe seçili`}
          </div>
          <ContextMenuSeparator />
        </>
      )}

      {/* TOPLU İŞLEMLER - Sadece çoklu seçim olduğunda göster */}
      {hasSelectedItems && (
        <>
          {/* Kayıt işlemi */}
          {checkEligibility(kayitUygun) && (
            <ContextMenuItem onSelect={handleKayit}>
              <Package className="mr-2 h-4 w-4 text-blue-500" />
              <div className="flex flex-col">
                <span>Toplu Kayıt Yap</span>
                <span className="text-xs text-muted-foreground">
                  {targetItems.length} malzeme kaydedilir
                </span>
              </div>
            </ContextMenuItem>
          )}

          {/* Zimmet işlemi */}
          {checkEligibility(zimmetUygun) && (
            <ContextMenuItem onSelect={handleZimmet}>
              <UserCheck className="mr-2 h-4 w-4 text-blue-500" />
              <div className="flex flex-col">
                <span>Toplu Zimmet Ver</span>
                <span className="text-xs text-muted-foreground">
                  {targetItems.length} malzeme zimmetlenir
                </span>
              </div>
            </ContextMenuItem>
          )}

          {/* İade işlemi */}
          {checkEligibility(iadeUygun) && (
            <ContextMenuItem onSelect={handleIade}>
              <RotateCcw className="mr-2 h-4 w-4 text-green-500" />
              <div className="flex flex-col">
                <span>Toplu İade Al</span>
                <span className="text-xs text-muted-foreground">
                  {targetItems.length} malzeme iade alınır
                </span>
              </div>
            </ContextMenuItem>
          )}

          {/* Devir işlemi */}
          {checkEligibility(devirUygun) && (
            <ContextMenuItem onSelect={handleDevir}>
              <ArrowUpDown className="mr-2 h-4 w-4 text-orange-500" />
              <div className="flex flex-col">
                <span>Toplu Devir Yap</span>
                <span className="text-xs text-muted-foreground">
                  {targetItems.length} malzeme devredilir
                </span>
              </div>
            </ContextMenuItem>
          )}

          <ContextMenuSeparator />

          {/* Depo transferi işlemi */}
          {checkEligibility(depoTransferiUygun) && (
            <ContextMenuItem onSelect={handleDepoTransferi}>
              <Truck className="mr-2 h-4 w-4 text-indigo-500" />
              <div className="flex flex-col">
                <span>Toplu Depo Transferi</span>
                <span className="text-xs text-muted-foreground">
                  {targetItems.length} malzeme transfer edilir
                </span>
              </div>
            </ContextMenuItem>
          )}

          {/* Kondisyon güncelleme */}
          {checkEligibility(kondisyonGuncellemeUygun) && (
            <ContextMenuItem onSelect={handleKondisyonGuncelleme}>
              <RefreshCw className="mr-2 h-4 w-4 text-purple-500" />
              <div className="flex flex-col">
                <span>Toplu Kondisyon Güncelle</span>
                <span className="text-xs text-muted-foreground">
                  {targetItems.length} malzemenin durumu güncellenir
                </span>
              </div>
            </ContextMenuItem>
          )}

          {/* Kayıp bildirimi */}
          {checkEligibility(kayipUygun) && (
            <ContextMenuItem onSelect={handleKayip}>
              <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
              <div className="flex flex-col">
                <span>Toplu Kayıp Bildir</span>
                <span className="text-xs text-muted-foreground">
                  {targetItems.length} malzeme kayıp olarak işaretlenir
                </span>
              </div>
            </ContextMenuItem>
          )}

          {/* Düşüm işlemi */}
          {checkEligibility(dusumUygun) && (
            <ContextMenuItem onSelect={handleDusum}>
              <TrendingDown className="mr-2 h-4 w-4 text-gray-500" />
              <div className="flex flex-col">
                <span>Toplu Düşüm Yap</span>
                <span className="text-xs text-muted-foreground">
                  {targetItems.length} malzeme düşürülür
                </span>
              </div>
            </ContextMenuItem>
          )}
        </>
      )}

      {/* TEKLİ İŞLEMLER - Sadece çoklu seçim YOKSA göster */}
      {!hasSelectedItems && (
        <>
          {/* Kayıt işlemi */}
          {checkEligibility(kayitUygun) && (
            <ContextMenuItem onSelect={handleKayit}>
              <Package className="mr-2 h-4 w-4 text-blue-500" />
              <div className="flex flex-col">
                <span>Kayıt Yap</span>
                <span className="text-xs text-muted-foreground">
                  Malzeme sisteme kaydedilir
                </span>
              </div>
            </ContextMenuItem>
          )}

          {/* Zimmet işlemi */}
          {checkEligibility(zimmetUygun) && (
            <ContextMenuItem onSelect={handleZimmet}>
              <UserCheck className="mr-2 h-4 w-4 text-blue-500" />
              <div className="flex flex-col">
                <span>Zimmet Yap</span>
                <span className="text-xs text-muted-foreground">
                  Personele malzeme zimmetlenir
                </span>
              </div>
            </ContextMenuItem>
          )}

          {/* İade işlemi */}
          {checkEligibility(iadeUygun) && (
            <ContextMenuItem onSelect={handleIade}>
              <RotateCcw className="mr-2 h-4 w-4 text-green-500" />
              <div className="flex flex-col">
                <span>İade Al</span>
                <span className="text-xs text-muted-foreground">
                  Personelden malzeme iade alınır
                </span>
              </div>
            </ContextMenuItem>
          )}

          {/* Devir işlemi */}
          {checkEligibility(devirUygun) && (
            <ContextMenuItem onSelect={handleDevir}>
              <ArrowUpDown className="mr-2 h-4 w-4 text-orange-500" />
              <div className="flex flex-col">
                <span>Devir Yap</span>
                <span className="text-xs text-muted-foreground">
                  Başka personele devredilir
                </span>
              </div>
            </ContextMenuItem>
          )}

          <ContextMenuSeparator />

          {/* Depo transferi işlemi */}
          {checkEligibility(depoTransferiUygun) && (
            <ContextMenuItem onSelect={handleDepoTransferi}>
              <Truck className="mr-2 h-4 w-4 text-indigo-500" />
              <div className="flex flex-col">
                <span>Depo Transferi Yap</span>
                <span className="text-xs text-muted-foreground">
                  Farklı konuma transfer edilir
                </span>
              </div>
            </ContextMenuItem>
          )}

          {/* Kondisyon güncelleme */}
          {checkEligibility(kondisyonGuncellemeUygun) && (
            <ContextMenuItem onSelect={handleKondisyonGuncelleme}>
              <RefreshCw className="mr-2 h-4 w-4 text-purple-500" />
              <div className="flex flex-col">
                <span>Kondisyon Güncelle</span>
                <span className="text-xs text-muted-foreground">
                  Malzeme durumunu günceller
                </span>
              </div>
            </ContextMenuItem>
          )}

          {/* Kayıp bildirimi */}
          {checkEligibility(kayipUygun) && (
            <ContextMenuItem onSelect={handleKayip}>
              <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
              <div className="flex flex-col">
                <span>Kayıp Bildir</span>
                <span className="text-xs text-muted-foreground">
                  Malzeme kayıp olarak işaretlenir
                </span>
              </div>
            </ContextMenuItem>
          )}

          {/* Düşüm işlemi */}
          {checkEligibility(dusumUygun) && (
            <ContextMenuItem onSelect={handleDusum}>
              <TrendingDown className="mr-2 h-4 w-4 text-gray-500" />
              <div className="flex flex-col">
                <span>Düşüm Yap</span>
                <span className="text-xs text-muted-foreground">
                  Arızalı/hurda malzeme düşürülür
                </span>
              </div>
            </ContextMenuItem>
          )}
        </>
      )}

      {/* Seçili malzemeler listesi (sadece çoklu seçimde) */}
      {hasSelectedItems && (
        <>
          <ContextMenuSeparator />
          <div className="px-2 py-1.5 text-xs text-muted-foreground">
            <div className="font-semibold mb-1">İşlem Yapılacak Malzemeler:</div>
            {targetItems.slice(0, 3).map((selectedItem) => (
              <div key={selectedItem.id} className="text-xs truncate">
                • {selectedItem.vidaNo || selectedItem.ad || `ID: ${selectedItem.id}`}
              </div>
            ))}
            {targetItems.length > 3 && (
              <div className="text-xs text-muted-foreground/70">
                ... ve {targetItems.length - 3} tane daha
              </div>
            )}
          </div>
        </>
      )}

      {/* Mevcut durum bilgisi (sadece tek seçimde) */}
      {/* {!hasSelectedItems && sonHareketi(item) && (
        <>
          <ContextMenuSeparator />
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t border-border">
            Mevcut Durum
          </div>
          <div className="px-2 py-1.5 text-xs text-muted-foreground">
            <div>Son Hareket: {sonHareketi(item).hareketTuru}</div>
            <div>Kondisyon: {sonHareketi(item).malzemeKondisyonu || 'Bilinmiyor'}</div>
            {malzemePersonelde(item) && sonHareketi(item).hedefPersonel && (
              <div>Zimmetli: {sonHareketi(item).hedefPersonel.ad}</div>
            )}
            {malzemeDepoda(item) && sonHareketi(item).konum && (
              <div>Konum: {sonHareketi(item).konum.ad}</div>
            )}
          </div>
        </>
      )} */}

      {!sonHareketi(item) && !hasSelectedItems && (
        <>
          <ContextMenuSeparator />
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t border-border">
            Mevcut Durum
          </div>
          <div className="px-2 py-1.5 text-xs text-muted-foreground">
            Henüz hareket kaydı yok
          </div>
        </>
      )}
    </BaseContextMenu>
  );
}