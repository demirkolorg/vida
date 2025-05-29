// client/src/app/malzeme/sheets/DetailSheet.jsx
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DetailItem, DetailSection } from '@/components/table/DetailItem';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BaseDetailSheet } from '@/components/sheet/BaseDetailSheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { statusStyles } from '@/components/table/Functions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState, useEffect } from 'react';
import { History, Plus, UserCheck, RotateCcw, ArrowUpDown, Package } from 'lucide-react';

import { EntityType, EntityHuman } from '../constants/api';
import { MalzemeHareket_Store } from '@/app/malzemeHareket/constants/store';
import { useSheetStore } from '@/stores/sheetStore';

const renderTitle = itemData => {
  return itemData?.vidaNo ? `${itemData.vidaNo} ${EntityHuman} Detayı` : `${EntityHuman} Detayı`;
};

const renderDetails = itemData => {
  const [activeTab, setActiveTab] = useState('bilgiler');
  const { openSheet } = useSheetStore();
  
  // Malzeme hareket store
  const malzemeHareketStore = MalzemeHareket_Store();
  const hareketler = malzemeHareketStore.malzemeGecmisi;
  const loadingHareketler = malzemeHareketStore.loadingMalzemeGecmisi;

  // Malzeme hareket geçmişini yükle
  useEffect(() => {
    if (itemData?.id && activeTab === 'hareketler') {
      malzemeHareketStore.GetMalzemeGecmisi(itemData.id, { showToast: false });
    }
  }, [itemData?.id, activeTab, malzemeHareketStore]);

  if (!itemData) {
    return <div className="p-4 text-center text-muted-foreground">{EntityHuman} bilgisi bulunamadı.</div>;
  }

  const createdByAvatar = itemData.createdBy?.avatar || '/placeholder.png';
  const updatedByAvatar = itemData.updatedBy?.avatar || '/placeholder.png';

  // Hızlı hareket işlemleri
  const handleYeniZimmet = () => {
    openSheet('create', { 
      malzemeId: itemData.id, 
      hareketTuru: 'Zimmet',
      malzemeKondisyonu: itemData.malzemeKondisyonu || 'Saglam'
    }, 'malzemeHareket');
  };

  const handleYeniIade = () => {
    openSheet('create', { 
      malzemeId: itemData.id, 
      hareketTuru: 'Iade',
      malzemeKondisyonu: itemData.malzemeKondisyonu || 'Saglam'
    }, 'malzemeHareket');
  };

  const handleYeniDevir = () => {
    openSheet('create', { 
      malzemeId: itemData.id, 
      hareketTuru: 'Devir',
      malzemeKondisyonu: itemData.malzemeKondisyonu || 'Saglam'
    }, 'malzemeHareket');
  };

  const handleKondisyonGuncelle = () => {
    openSheet('create', { 
      malzemeId: itemData.id, 
      hareketTuru: 'KondisyonGuncelleme',
      malzemeKondisyonu: itemData.malzemeKondisyonu || 'Saglam'
    }, 'malzemeHareket');
  };

  // Hareket türü badge renkleri
  const getHareketTuruVariant = (hareketTuru) => {
    switch (hareketTuru) {
      case 'Kayit': return 'default';
      case 'Zimmet': return 'destructive';
      case 'Iade': return 'success';
      case 'Devir': return 'warning';
      case 'DepoTransferi': return 'secondary';
      case 'KondisyonGuncelleme': return 'outline';
      case 'Kayip': return 'destructive';
      case 'Dusum': return 'destructive';
      default: return 'outline';
    }
  };

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
              <DetailItem label="Kayıt Tarihi">
                {itemData.kayitTarihi ? format(new Date(itemData.kayitTarihi), 'dd MMMM yyyy', { locale: tr }) : '-'}
              </DetailItem>
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
              <DetailItem label="Oluşturulma Tarihi">
                {itemData.createdAt ? format(new Date(itemData.createdAt), 'dd MMMM yyyy, HH:mm', { locale: tr }) : '-'}
              </DetailItem>

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
              {itemData.updatedAt && (
                <DetailItem label="Son Güncelleme Tarihi">
                  {format(new Date(itemData.updatedAt), 'dd MMMM yyyy, HH:mm', { locale: tr })}
                </DetailItem>
              )}
            </DetailSection>
          </TabsContent>

          <TabsContent value="hareketler" className="space-y-4">
            {/* Hızlı İşlem Butonları */}
            <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg">
              <Button size="sm" variant="outline" onClick={handleYeniZimmet}>
                <UserCheck className="mr-2 h-4 w-4" />
                Zimmet Ver
              </Button>
              <Button size="sm" variant="outline" onClick={handleYeniIade}>
                <RotateCcw className="mr-2 h-4 w-4" />
                İade Al
              </Button>
              <Button size="sm" variant="outline" onClick={handleYeniDevir}>
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Devir Yap
              </Button>
              <Button size="sm" variant="outline" onClick={handleKondisyonGuncelle}>
                <Package className="mr-2 h-4 w-4" />
                Kondisyon Güncelle
              </Button>
              <Button 
                size="sm" 
                onClick={() => openSheet('create', { malzemeId: itemData.id }, 'malzemeHareket')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Yeni Hareket
              </Button>
            </div>

            {/* Hareket Geçmişi */}
            {loadingHareketler ? (
              <div className="text-center py-4">Hareket geçmişi yükleniyor...</div>
            ) : hareketler.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Henüz hareket kaydı bulunmuyor.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {hareketler.map((hareket, index) => (
                  <div key={hareket.id} className="border rounded-lg p-3 bg-card">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={getHareketTuruVariant(hareket.hareketTuru)} className="text-xs">
                        {hareket.hareketTuru}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(hareket.islemTarihi), 'dd.MM.yyyy HH:mm', { locale: tr })}
                      </span>
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
                    
                    {hareket.aciklama && (
                      <p className="text-xs text-muted-foreground mt-2">{hareket.aciklama}</p>
                    )}
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

export const Malzeme_DetailSheet = props => {
  return (
    <BaseDetailSheet entityType={EntityType} title={renderTitle} {...props}>
      {item => renderDetails(item)}
    </BaseDetailSheet>
  );
};