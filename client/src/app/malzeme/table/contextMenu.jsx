import { ContextMenuItem, ContextMenuSeparator } from '@/components/ui/context-menu';
import { BaseContextMenu } from '@/components/contextMenu/BaseContextMenu';
import { EntityHuman, EntityType } from '../constants/api';
import { useMalzemeHareketStore } from '@/stores/useMalzemeHareketStore';
import { Truck, UserCheck, RefreshCw, AlertTriangle, RotateCcw, ArrowUpDown, TrendingDown } from 'lucide-react';
import { kayitUygun, zimmetUygun, iadeUygun, devirUygun, depoTransferiUygun, kondisyonGuncellemeUygun, kayipUygun, dusumUygun, sonHareketi, malzemePersonelde, malzemeDepoda, malzemeYok } from '../helpers/hareketKarar';

export function Malzeme_ContextMenu({ item }) {
  const openZimmetSheet = useMalzemeHareketStore(state => state.openZimmetSheet);
  const openIadeSheet = useMalzemeHareketStore(state => state.openIadeSheet);
  const openDevirSheet = useMalzemeHareketStore(state => state.openDevirSheet);
  const openDepoTransferiSheet = useMalzemeHareketStore(state => state.openDepoTransferiSheet);
  const openKondisyonGuncellemeSheet = useMalzemeHareketStore(state => state.openKondisyonGuncellemeSheet);
  const openKayipSheet = useMalzemeHareketStore(state => state.openKayipSheet);
  const openDusumSheet = useMalzemeHareketStore(state => state.openDusumSheet);
  const openKayitSheet = useMalzemeHareketStore(state => state.openKayitSheet);

  const menuTitle = item?.vidaNo ? `${item.vidaNo} ${EntityHuman} Kaydı` : `${EntityHuman} İşlemleri`;

  const handleZimmetleClick = () => {
    if (item) {
      openZimmetSheet(item);
    }
  };
  const handleIadeClick = () => {
    if (item) {
      openIadeSheet(item);
    }
  };
  const handleDevirClick = () => {
    if (item) {
      openDevirSheet(item);
    }
  };
  const handleDepoTransferiClick = () => {
    if (item) {
      openDepoTransferiSheet(item);
    }
  };
  const handleKondisyonGuncellemeClick = () => {
    if (item) {
      openKondisyonGuncellemeSheet(item);
    }
  };
  const handleKayipClick = () => {
    if (item) {
      openKayipSheet(item);
    }
  };
  const handleDusumClick = () => {
    if (item) {
      openDusumSheet(item);
    }
  };
  const handleKayitClick = () => {
    if (item) {
      openKayitSheet(item);
    }
  };
  return (
    <BaseContextMenu item={item} entityType={EntityType} entityHuman={EntityHuman} menuTitle={menuTitle}>
      {kayitUygun(item) && (
        <ContextMenuItem className="" onSelect={handleKayitClick}>
          <UserCheck className="mr-2 h-4 w-4 text-blue-500" />
          <div className="flex flex-col">
            <span>Kayıt Yap</span>
            <span className="text-xs text-muted-foreground">Personele malzeme zimmetlenir</span>
          </div>
        </ContextMenuItem>
      )}
      {zimmetUygun(item) && (
        <ContextMenuItem className="" onSelect={handleZimmetleClick}>
          <UserCheck className="mr-2 h-4 w-4 text-blue-500" />
          <div className="flex flex-col">
            <span>Zimmet Yap</span>
            <span className="text-xs text-muted-foreground">Personele malzeme zimmetlenir</span>
          </div>
        </ContextMenuItem>
      )}
      {iadeUygun(item) && (
        <ContextMenuItem className="" onSelect={handleIadeClick}>
          <RotateCcw className="mr-2 h-4 w-4 text-green-500" />
          <div className="flex flex-col">
            <span>İade Al</span>
            <span className="text-xs text-muted-foreground">Personelden malzeme iade alınır</span>
          </div>
        </ContextMenuItem>
      )}
      {devirUygun(item) && (
        <ContextMenuItem className="" onSelect={handleDevirClick}>
          <ArrowUpDown className="mr-2 h-4 w-4 text-orange-500" />
          <div className="flex flex-col">
            <span>Devir Yap</span>
            <span className="text-xs text-muted-foreground">Başka personele devredilir</span>
          </div>
        </ContextMenuItem>
      )}
      <ContextMenuSeparator />
      {depoTransferiUygun(item) && (
        <ContextMenuItem className="" onSelect={handleDepoTransferiClick}>
          <Truck className="mr-2 h-4 w-4 text-indigo-500" />
          <div className="flex flex-col">
            <span>Depo Transferi Yap</span>
            <span className="text-xs text-muted-foreground">Farklı konuma transfer edilir</span>
          </div>
        </ContextMenuItem>
      )}
      {kondisyonGuncellemeUygun(item) && (
        <ContextMenuItem className="" onSelect={handleKondisyonGuncellemeClick}>
          <RefreshCw className="mr-2 h-4 w-4 text-purple-500" />
          <div className="flex flex-col">
            <span>Kondisyon Güncelle</span>
            <span className="text-xs text-muted-foreground">Malzeme durumunu günceller</span>
          </div>
        </ContextMenuItem>
      )}
      {kayipUygun(item) && (
        <ContextMenuItem className="" onSelect={handleKayipClick}>
          <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
          <div className="flex flex-col">
            <span>Kayıp Bildir</span>
            <span className="text-xs text-muted-foreground">Malzeme kayıp olarak işaretlenir</span>
          </div>
        </ContextMenuItem>
      )}
      {dusumUygun(item) && (
        <ContextMenuItem className="" onSelect={handleDusumClick}>
          <TrendingDown className="mr-2 h-4 w-4 text-gray-500" />
          <div className="flex flex-col">
            <span>Düşüm Yap</span>
            <span className="text-xs text-muted-foreground">Arızalı/hurda malzeme düşürülür</span>
          </div>
        </ContextMenuItem>
      )}

      {/* {sonHareketi(item) && (
        <>
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t border-border mt-2">Mevcut Durum</div>
          <div className="px-2 py-1.5 text-xs text-muted-foreground">
            Son Hareket: {sonHareketi(item).hareketTuru}
            <br />
            Kondisyon: {sonHareketi(item).malzemeKondisyonu || 'Bilinmiyor'}
            {malzemePersonelde(item) && sonHareketi(item).hedefPersonel && (
              <>
                <br />
                Zimmetli: {sonHareketi(item).hedefPersonel.ad}
              </>
            )}
            {malzemeDepoda(item) && sonHareketi(item).konum && (
              <>
                <br />
                Konum: {sonHareketi(item).konum.ad}
              </>
            )}
          </div>
        </>
      )}

      {!sonHareketi(item) && (
        <>
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t border-border mt-2">Mevcut Durum</div>
          <div className="px-2 py-1.5 text-xs text-muted-foreground">Henüz hareket kaydı yok</div>
        </>
      )} */}
    </BaseContextMenu>
  );
}
