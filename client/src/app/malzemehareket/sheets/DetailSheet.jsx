import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { DetailItem, DetailSection } from '@/components/table/DetailItem';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BaseDetailSheet } from '@/components/sheet/BaseDetailSheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { statusStyles } from '@/components/table/Functions';

import { EntityType, EntityHuman } from '../constants/api';

const getHareketTuruBadgeVariant = (hareketTuru) => {
  switch (hareketTuru) {
    case 'Zimmet':
      return 'default';
    case 'Iade':
      return 'secondary';
    case 'Devir':
      return 'outline';
    case 'Kayip':
      return 'destructive_muted';
    case 'DepoTransferi':
      return 'warning_muted';
    case 'KondisyonGuncelleme':
      return 'success_muted';
    default:
      return 'outline';
  }
};

const getKondisyonBadgeVariant = (kondisyon) => {
  switch (kondisyon) {
    case 'Saglam':
      return 'success_muted';
    case 'Arizali':
      return 'warning_muted';
    case 'Hurda':
      return 'destructive_muted';
    default:
      return 'outline';
  }
};

const renderTitle = itemData => {
  const hareketTuru = itemData?.hareketTuru || 'Hareket';
  const malzemeInfo = itemData?.malzeme?.vidaNo || itemData?.malzeme?.sabitKodu?.ad || 'Malzeme';
  return `${hareketTuru} - ${malzemeInfo} Detayı`;
};

const renderDetails = itemData => {
  if (!itemData) {
    return <div className="p-4 text-center text-muted-foreground">{EntityHuman} bilgisi bulunamadı.</div>;
  }

  const createdByAvatar = itemData.createdBy?.avatar || '/placeholder.png';

  return (
    <ScrollArea className="h-[calc(100vh-230px)]">
      <div className="p-2 md:p-4">
        <DetailSection title="Temel Bilgiler">
          <DetailItem label={`${EntityHuman} ID`}>
            <Badge variant="secondary" className="font-mono text-xs">
              {itemData.id}
            </Badge>
          </DetailItem>
          
          <DetailItem label="Hareket Türü">
            <Badge variant={getHareketTuruBadgeVariant(itemData.hareketTuru)} className="text-xs">
              {itemData.hareketTuru || '-'}
            </Badge>
          </DetailItem>

          <DetailItem label="Malzeme Kondisyonu">
            <Badge variant={getKondisyonBadgeVariant(itemData.malzemeKondisyonu)} className="text-xs">
              {itemData.malzemeKondisyonu || '-'}
            </Badge>
          </DetailItem>

          <DetailItem label="İşlem Tarihi">
            {itemData.islemTarihi ? format(new Date(itemData.islemTarihi), 'dd MMMM yyyy, HH:mm', { locale: tr }) : '-'}
          </DetailItem>

          <DetailItem label="Durum">
            <Badge
              variant={itemData.status === 'Aktif' ? 'success_muted' : itemData.status === 'Pasif' ? 'warning_muted' : itemData.status === 'Silindi' ? 'destructive_muted' : 'outline'}
              className={`text-xs font-mono ${statusStyles[itemData.status]}`}
            >
              {itemData.status || '-'}
            </Badge>
          </DetailItem>

          {itemData.aciklama && (
            <DetailItem label="Açıklama">{itemData.aciklama}</DetailItem>
          )}
        </DetailSection>

        {itemData.malzeme && (
          <DetailSection title="Malzeme Bilgileri">
            <DetailItem label="Vida No">{itemData.malzeme.vidaNo || '-'}</DetailItem>
            
            {itemData.malzeme.sabitKodu && (
              <DetailItem label="Sabit Kodu">
                <Badge variant="outline" className="text-xs">
                  {itemData.malzeme.sabitKodu.ad}
                </Badge>
              </DetailItem>
            )}

            {itemData.malzeme.marka && (
              <DetailItem label="Marka">
                <Badge variant="outline" className="text-xs">
                  {itemData.malzeme.marka.ad}
                </Badge>
              </DetailItem>
            )}

            {itemData.malzeme.model && (
              <DetailItem label="Model">
                <Badge variant="outline" className="text-xs">
                  {itemData.malzeme.model.ad}
                </Badge>
              </DetailItem>
            )}

            {itemData.malzeme.birim && (
              <DetailItem label="Birim">
                <Badge variant="secondary" className="text-xs">
                  {itemData.malzeme.birim.ad}
                </Badge>
              </DetailItem>
            )}

            {itemData.malzeme.sube && (
              <DetailItem label="Şube">
                <Badge variant="secondary" className="text-xs">
                  {itemData.malzeme.sube.ad}
                </Badge>
              </DetailItem>
            )}
          </DetailSection>
        )}

        {(itemData.kaynakPersonel || itemData.hedefPersonel) && (
          <DetailSection title="Personel Bilgileri">
            {itemData.kaynakPersonel && (
              <DetailItem label="Kaynak Personel">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={itemData.kaynakPersonel.avatar || '/placeholder.png'} alt={itemData.kaynakPersonel.ad || 'Avatar'} />
                    <AvatarFallback>{itemData.kaynakPersonel.ad?.substring(0, 1) || 'P'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-medium">{itemData.kaynakPersonel.ad || '-'}</span>
                    <span className="text-xs text-muted-foreground ml-2">({itemData.kaynakPersonel.sicil})</span>
                  </div>
                </div>
                {itemData.kaynakPersonel.buro && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    {itemData.kaynakPersonel.buro.ad} - {itemData.kaynakPersonel.buro.sube?.ad}
                  </div>
                )}
              </DetailItem>
            )}

            {itemData.hedefPersonel && (
              <DetailItem label="Hedef Personel">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={itemData.hedefPersonel.avatar || '/placeholder.png'} alt={itemData.hedefPersonel.ad || 'Avatar'} />
                    <AvatarFallback>{itemData.hedefPersonel.ad?.substring(0, 1) || 'P'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-medium">{itemData.hedefPersonel.ad || '-'}</span>
                    <span className="text-xs text-muted-foreground ml-2">({itemData.hedefPersonel.sicil})</span>
                  </div>
                </div>
                {itemData.hedefPersonel.buro && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    {itemData.hedefPersonel.buro.ad} - {itemData.hedefPersonel.buro.sube?.ad}
                  </div>
                )}
              </DetailItem>
            )}
          </DetailSection>
        )}

        {itemData.konum && (
          <DetailSection title="Konum Bilgileri">
            <DetailItem label="Konum Adı">{itemData.konum.ad || '-'}</DetailItem>
            
            {itemData.konum.depo && (
              <DetailItem label="Depo">
                <Badge variant="outline" className="text-xs">
                  {itemData.konum.depo.ad}
                </Badge>
              </DetailItem>
            )}

            {itemData.konum.aciklama && (
              <DetailItem label="Konum Açıklaması">{itemData.konum.aciklama}</DetailItem>
            )}
          </DetailSection>
        )}
        
        <DetailSection title="Denetim Bilgileri">
          {itemData.createdBy && (
            <DetailItem label="İşlemi Yapan Personel">
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={createdByAvatar} alt={itemData.createdBy.ad || 'Avatar'} />
                  <AvatarFallback>{itemData.createdBy.ad?.substring(0, 1) || 'P'}</AvatarFallback>
                </Avatar>
                <div>
                  <span className="font-medium">{itemData.createdBy.ad || '-'}</span>
                  <span className="text-xs text-muted-foreground ml-2">({itemData.createdBy.sicil})</span>
                </div>
              </div>
            </DetailItem>
          )}
          
          <DetailItem label="Kayıt Tarihi">
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