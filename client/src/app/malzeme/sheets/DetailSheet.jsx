// client/src/app/malzeme/sheets/DetailSheet.jsx
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DetailItem, DetailSection } from '@/components/table/components/DetailItem';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BaseDetailSheet } from '@/components/sheet/BaseDetailSheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { statusStyles } from '@/components/table/helper/Functions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState, useEffect, useCallback, useRef } from 'react';
import { History, Plus, UserCheck, RotateCcw, ArrowUpDown, Package } from 'lucide-react';

import { EntityType, EntityHuman } from '../constants/api';
import { MalzemeHareket_Store } from '@/app/malzemeHareket/constants/store';
import { useSheetStore } from '@/stores/sheetStore';

const renderTitle = itemData => {
  return itemData?.vidaNo ? `${itemData.vidaNo} ${EntityHuman} Detayı` : `${EntityHuman} Detayı`;
};

// Hook'ları kullanan ayrı bir component oluşturuyoruz
const MalzemeDetailContent = ({ itemData, seciliActiveTab = 'bilgiler' }) => {
  // Hook'lar artık component seviyesinde
  const [activeTab, setActiveTab] = useState(seciliActiveTab);
  const { openSheet } = useSheetStore();

  // Malzeme hareket store - DÜZELTME: Store hook'ları doğru şekilde kullan
  const hareketler = MalzemeHareket_Store(state => state.malzemeGecmisi);
  const loadingHareketler = MalzemeHareket_Store(state => state.loadingMalzemeGecmisi);
  const getMalzemeGecmisi = MalzemeHareket_Store(state => state.GetMalzemeGecmisi);

  // Loading state kontrolü için ref
  const loadingRef = useRef(false);
  const lastMalzemeIdRef = useRef(null);

  // DÜZELTME: useCallback kullanarak function'ı stable yap
  const fetchMalzemeGecmisi = useCallback(
    async malzemeId => {
      if (loadingRef.current || !malzemeId) return;
      if (lastMalzemeIdRef.current === malzemeId) return; // Aynı malzeme için tekrar yükleme

      loadingRef.current = true;
      lastMalzemeIdRef.current = malzemeId;

      try {
        await getMalzemeGecmisi(malzemeId, { showToast: false });
      } catch (error) {
        console.error('Malzeme geçmişi yüklenirken hata:', error);
      } finally {
        loadingRef.current = false;
      }
    },
    [getMalzemeGecmisi],
  );

  // DÜZELTME: Dependency array'i düzelt ve loading guard ekle
  useEffect(() => {
    if (itemData?.id && activeTab === 'hareketler') {
      fetchMalzemeGecmisi(itemData.id);
    }
  }, [itemData?.id, activeTab, fetchMalzemeGecmisi]);

  // DÜZELTME: Component unmount'ta cleanup yap
  useEffect(() => {
    return () => {
      loadingRef.current = false;
      lastMalzemeIdRef.current = null;
    };
  }, []);

  if (!itemData) {
    return <div className="p-4 text-center text-muted-foreground">{EntityHuman} bilgisi bulunamadı.</div>;
  }

  const createdByAvatar = itemData.createdBy?.avatar || '/placeholder.png';
  const updatedByAvatar = itemData.updatedBy?.avatar || '/placeholder.png';

  // DÜZELTME: Event handler'ları useCallback ile optimize et
  const handleYeniZimmet = useCallback(() => {
    openSheet(
      'create',
      {
        malzemeId: itemData.id,
        hareketTuru: 'Zimmet',
        malzemeKondisyonu: itemData.malzemeKondisyonu || 'Saglam',
      },
      'malzemeHareket',
    );
  }, [openSheet, itemData.id, itemData.malzemeKondisyonu]);

  const handleYeniIade = useCallback(() => {
    openSheet(
      'create',
      {
        malzemeId: itemData.id,
        hareketTuru: 'Iade',
        malzemeKondisyonu: itemData.malzemeKondisyonu || 'Saglam',
      },
      'malzemeHareket',
    );
  }, [openSheet, itemData.id, itemData.malzemeKondisyonu]);

  const handleYeniDevir = useCallback(() => {
    openSheet(
      'create',
      {
        malzemeId: itemData.id,
        hareketTuru: 'Devir',
        malzemeKondisyonu: itemData.malzemeKondisyonu || 'Saglam',
      },
      'malzemeHareket',
    );
  }, [openSheet, itemData.id, itemData.malzemeKondisyonu]);

  const handleKondisyonGuncelle = useCallback(() => {
    openSheet(
      'create',
      {
        malzemeId: itemData.id,
        hareketTuru: 'KondisyonGuncelleme',
        malzemeKondisyonu: itemData.malzemeKondisyonu || 'Saglam',
      },
      'malzemeHareket',
    );
  }, [openSheet, itemData.id, itemData.malzemeKondisyonu]);

  const handleYeniHareket = useCallback(() => {
    openSheet('create', { malzemeId: itemData.id }, 'malzemeHareket');
  }, [openSheet, itemData.id]);

  const getHareketTuruVariant = useCallback(hareketTuru => {
    switch (hareketTuru) {
      case 'Kayit':
        return 'default';
      case 'Zimmet':
        return 'destructive';
      case 'Iade':
        return 'success';
      case 'Devir':
        return 'warning';
      case 'DepoTransferi':
        return 'secondary';
      case 'KondisyonGuncelleme':
        return 'outline';
      case 'Kayip':
        return 'destructive';
      case 'Dusum':
        return 'destructive';
      default:
        return 'outline';
    }
  }, []);

  return (
    <ScrollArea className="h-[calc(100vh-230px)]">
      <div className="p-2 md:p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bilgiler">Malzeme Bilgileri</TabsTrigger>
            <TabsTrigger value="hareketler">Hareket Geçmişi</TabsTrigger>
          </TabsList>

          <TabsContent value="bilgiler" className="space-y-4">
            <DetailSection title="Temel Bilgiler">
              <DetailItem label={`${EntityHuman} ID`}>
                <Badge variant="secondary" className="font-mono text-xs">
                  {itemData.id}
                </Badge>
              </DetailItem>
              <DetailItem label="Vida No">{itemData.vidaNo || '-'}</DetailItem>
              <DetailItem label="Kayıt Tarihi">{itemData.kayitTarihi ? format(new Date(itemData.kayitTarihi), 'dd MMMM yyyy', { locale: tr }) : '-'}</DetailItem>
              <DetailItem label="Malzeme Tipi">
                <Badge variant={itemData.malzemeTipi === 'Demirbas' ? 'default' : 'secondary'} className="text-xs">
                  {itemData.malzemeTipi}
                </Badge>
              </DetailItem>
              <DetailItem label="Durum">
                <Badge
                  variant={itemData.status === 'Aktif' ? 'success_muted' : itemData.status === 'Pasif' ? 'warning_muted' : itemData.status === 'Silindi' ? 'destructive_muted' : 'outline'}
                  className={`text-xs font-mono ${statusStyles[itemData.status]}`}
                >
                  {itemData.status || '-'}
                </Badge>
              </DetailItem>
            </DetailSection>

            <DetailSection title="Malzeme Detayları">
              <DetailItem label="Sabit Kodu">{itemData.sabitKodu?.ad || '-'}</DetailItem>
              <DetailItem label="Marka">{itemData.marka?.ad || '-'}</DetailItem>
              <DetailItem label="Model">{itemData.model?.ad || '-'}</DetailItem>
              <DetailItem label="Kod">{itemData.kod || '-'}</DetailItem>
              <DetailItem label="Badem Seri No">{itemData.bademSeriNo || '-'}</DetailItem>
              <DetailItem label="ETMYS Seri No">{itemData.etmysSeriNo || '-'}</DetailItem>
              <DetailItem label="Stok/Demirbaş No">{itemData.stokDemirbasNo || '-'}</DetailItem>
            </DetailSection>

            <DetailSection title="Organizasyon Bilgileri">
              <DetailItem label="Kuvve Birimi">{itemData.birim?.ad || '-'}</DetailItem>
              <DetailItem label="İş Karşılığı Şube">{itemData.sube?.ad || '-'}</DetailItem>
            </DetailSection>

            {itemData.aciklama && (
              <DetailSection title="Açıklama">
                <p className="text-sm">{itemData.aciklama}</p>
              </DetailSection>
            )}

            <DetailSection title="Denetim Bilgileri">
              {itemData.createdBy && (
                <DetailItem label="Oluşturan Personel">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={createdByAvatar} alt={itemData.createdBy.ad || 'Avatar'} />
                      <AvatarFallback>{itemData.createdBy.ad?.substring(0, 1) || 'P'}</AvatarFallback>
                    </Avatar>
                    <span>{itemData.createdBy.ad || itemData.createdBy.sicil || '-'}</span>
                  </div>
                </DetailItem>
              )}
              <DetailItem label="Oluşturulma Tarihi">{itemData.createdAt ? format(new Date(itemData.createdAt), 'dd MMMM yyyy, HH:mm', { locale: tr }) : '-'}</DetailItem>

              {itemData.updatedBy && (
                <DetailItem label="Güncelleyen Personel">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={updatedByAvatar} alt={itemData.updatedBy.ad || 'Avatar'} />
                      <AvatarFallback>{itemData.updatedBy.ad?.substring(0, 1) || 'P'}</AvatarFallback>
                    </Avatar>
                    <span>{itemData.updatedBy.ad || itemData.updatedBy.sicil || '-'}</span>
                  </div>
                </DetailItem>
              )}
              {itemData.updatedAt && <DetailItem label="Son Güncelleme Tarihi">{format(new Date(itemData.updatedAt), 'dd MMMM yyyy, HH:mm', { locale: tr })}</DetailItem>}
            </DetailSection>
          </TabsContent>

          <TabsContent value="hareketler" className="space-y-4">
          
            {/* Hareket Geçmişi */}
            {loadingHareketler ? (
              <div className="text-center py-4">Hareket geçmişi yükleniyor...</div>
            ) : !hareketler || hareketler.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Henüz hareket kaydı bulunmuyor.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {hareketler.map(hareket => (
                  <div key={hareket.id} className="border rounded-lg p-3 bg-card">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={getHareketTuruVariant(hareket.hareketTuru)} className="text-xs">
                        {hareket.hareketTuru}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{format(new Date(hareket.islemTarihi), 'dd.MM.yyyy HH:mm', { locale: tr })}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {hareket.kaynakPersonel && (
                        <div>
                          <span className="text-muted-foreground">Kaynak: </span>
                          <span className="font-medium">{hareket.kaynakPersonel.ad}</span>
                        </div>
                      )}
                      {hareket.hedefPersonel && (
                        <div>
                          <span className="text-muted-foreground">Hedef: </span>
                          <span className="font-medium">{hareket.hedefPersonel.ad}</span>
                        </div>
                      )}
                      {hareket.konum && (
                        <div>
                          <span className="text-muted-foreground">Konum: </span>
                          <span className="font-medium">{hareket.konum.ad}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-muted-foreground">Kondisyon: </span>
                        <Badge variant="outline" className="text-xs">
                          {hareket.malzemeKondisyonu}
                        </Badge>
                      </div>
                    </div>

                    {hareket.aciklama && <p className="text-xs text-muted-foreground mt-2">{hareket.aciklama}</p>}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
};

// Hook'ları kullanmayan basit render fonksiyonu
const renderDetails = itemData => {
  return <MalzemeDetailContent itemData={itemData} />;
};

export const Malzeme_DetailSheet = props => {
  return (
    <BaseDetailSheet entityType={EntityType} title={renderTitle} {...props}>
      {renderDetails}
    </BaseDetailSheet>
  );
};
