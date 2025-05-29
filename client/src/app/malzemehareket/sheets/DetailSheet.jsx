// client/src/app/malzemeHareket/sheets/DetailSheet.jsx
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { DetailItem, DetailSection } from '@/components/table/DetailItem';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BaseDetailSheet } from '@/components/sheet/BaseDetailSheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { statusStyles } from '@/components/table/Functions';
import { HareketTuruOptions, KondisyonOptions } from '../constants/schema';

import { EntityType, EntityHuman } from '../constants/api';

const renderTitle = itemData => {
  const malzemeInfo = itemData?.malzeme?.vidaNo || itemData?.malzeme?.sabitKodu?.ad || 'Bilinmeyen Malzeme';
  const hareketTuru = HareketTuruOptions.find(opt => opt.value === itemData?.hareketTuru)?.label || itemData?.hareketTuru;
  return `${malzemeInfo} - ${hareketTuru} Detayı`;
};

const renderDetails = itemData => {
  if (!itemData) {
    return <div className="p-4 text-center text-muted-foreground">{EntityHuman} bilgisi bulunamadı.</div>;
  }

  const createdByAvatar = itemData.createdBy?.avatar || '/placeholder.png';
  const hareketTuruLabel = HareketTuruOptions.find(opt => opt.value === itemData.hareketTuru)?.label || itemData.hareketTuru;
  const kondisyonLabel = KondisyonOptions.find(opt => opt.value === itemData.malzemeKondisyonu)?.label || itemData.malzemeKondisyonu;

  // Hareket türüne göre renk
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

  // Kondisyon rengi
  const getKondisyonVariant = (kondisyon) => {
    switch (kondisyon) {
      case 'Saglam': return 'success';
      case 'Arizali': return 'warning';
      case 'Hurda': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-230px)]">
      <div className="p-2 md:p-4">
        <DetailSection title="Hareket Bilgileri">
          <DetailItem label={`${EntityHuman} ID`}>
            <Badge variant="secondary" className="font-mono text-xs">
              {itemData.id}
            </Badge>
          </DetailItem>
          <DetailItem label="İşlem Tarihi">
            {itemData.islemTarihi ? format(new Date(itemData.islemTarihi), 'dd MMMM yyyy, HH:mm', { locale: tr }) : '-'}
          </DetailItem>
          <DetailItem label="Hareket Türü">
            <Badge variant={getHareketTuruVariant(itemData.hareketTuru)} className="text-xs">
              {hareketTuruLabel}
            </Badge>
          </DetailItem>
          <DetailItem label="Malzeme Kondisyonu">
            <Badge variant={getKondisyonVariant(itemData.malzemeKondisyonu)} className="text-xs">
              {kondisyonLabel}
            </Badge>
          </DetailItem>
          <DetailItem label="Açıklama">{itemData.aciklama || '-'}</DetailItem>
        </DetailSection>

        <DetailSection title="Malzeme Bilgileri">
          <DetailItem label="Vida No">{itemData.malzeme?.vidaNo || '-'}</DetailItem>
          <DetailItem label="Sabit Kodu">{itemData.malzeme?.sabitKodu?.ad || '-'}</DetailItem>
          {itemData.malzeme?.marka?.ad && (
            <DetailItem label="Marka">{itemData.malzeme.marka.ad}</DetailItem>
          )}
          {itemData.malzeme?.model?.ad && (
            <DetailItem label="Model">{itemData.malzeme.model.ad}</DetailItem>
          )}
        </DetailSection>

        {(itemData.kaynakPersonel || itemData.hedefPersonel) && (
          <DetailSection title="Personel Bilgileri">
            {itemData.kaynakPersonel && (
              <DetailItem label="Kaynak Personel">
                <div className="space-y-1">
                  <div className="font-medium">{itemData.kaynakPersonel.ad}</div>
                  <div className="text-sm text-muted-foreground">Sicil: {itemData.kaynakPersonel.sicil}</div>
                </div>
              </DetailItem>
            )}
            {itemData.hedefPersonel && (
              <DetailItem label="Hedef Personel">
                <div className="space-y-1">
                  <div className="font-medium">{itemData.hedefPersonel.ad}</div>
                  <div className="text-sm text-muted-foreground">Sicil: {itemData.hedefPersonel.sicil}</div>
                </div>
              </DetailItem>
            )}
          </DetailSection>
        )}

        {itemData.konum && (
          <DetailSection title="Konum Bilgileri">
            <DetailItem label="Konum Adı">{itemData.konum.ad}</DetailItem>
            {itemData.konum.depo?.ad && (
              <DetailItem label="Depo">{itemData.konum.depo.ad}</DetailItem>
            )}
          </DetailSection>
        )}

        <DetailSection title="Denetim Bilgileri">
          {itemData.createdBy && (
            <DetailItem label="İşlem Yapan Personel">
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={createdByAvatar} alt={itemData.createdBy.ad || 'Avatar'} />
                  <AvatarFallback>{itemData.createdBy.ad?.substring(0, 1) || 'P'}</AvatarFallback>
                </Avatar>
                <span>{itemData.createdBy.ad || '-'}</span>
              </div>
            </DetailItem>
          )}
          <DetailItem label="Oluşturulma Tarihi">
            {itemData.createdAt ? format(new Date(itemData.createdAt), 'dd MMMM yyyy, HH:mm', { locale: tr }) : '-'}
          </DetailItem>
        </DetailSection>
      </div>
    </ScrollArea>
  );
};

export const MalzemeHareket_DetailSheet = props => {
  return (
    <BaseDetailSheet entityType={EntityType} title={renderTitle} {...props}>
      {item => renderDetails(item)}
    </BaseDetailSheet>
  );
};