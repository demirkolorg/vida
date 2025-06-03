import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { DetailItem, DetailSection } from '@/components/table/DetailItem';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BaseDetailSheet } from '@/components/sheet/BaseDetailSheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { statusStyles } from '@/components/table/Functions';

import { EntityType, EntityHuman } from '../constants/api';

const renderTitle = itemData => {
  return itemData?.ad ? `${itemData.ad} ${EntityHuman} Detayı` : `${EntityHuman} Detayı`;
};

const renderDetails = itemData => {
  if (!itemData) {
    return <div className="p-4 text-center text-muted-foreground">{EntityHuman} bilgisi bulunamadı.</div>;
  }

  const createdByAvatar = itemData.createdBy?.avatar || '/placeholder.png';
  const updatedByAvatar = itemData.updatedBy?.avatar || '/placeholder.png';

  return (
    <ScrollArea className="h-[calc(100vh-230px)]">
      <div className="p-2 md:p-4">
        <DetailSection title="Temel Bilgiler">
          <DetailItem label={`${EntityHuman} ID`}>
            <Badge variant="secondary" className="font-mono text-xs">
              {itemData.id}
            </Badge>
          </DetailItem>
          <DetailItem label={`${EntityHuman} Adı`}>{itemData.ad || '-'}</DetailItem>
          <DetailItem label="Bağlı Marka">
            {itemData.marka ? (
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {itemData.marka.ad}
                </Badge>
              </div>
            ) : '-'}
          </DetailItem>
          <DetailItem label="Durum">
            <Badge
              variant={itemData.status === 'Aktif' ? 'success_muted' : itemData.status === 'Pasif' ? 'warning_muted' : itemData.status === 'Silindi' ? 'destructive_muted' : 'outline'}
              className={`text-xs font-mono ${statusStyles[itemData.status]}`}
            >
              {itemData.status || '-'}
            </Badge>
          </DetailItem>
          <DetailItem label="Açıklama">{itemData.aciklama || '-'}</DetailItem>
        </DetailSection>
        
        {itemData.malzemeler && itemData.malzemeler.length > 0 && (
          <DetailSection title={`Bağlı Malzemeler (${itemData.malzemeler.length})`}>
            <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
              {itemData.malzemeler.slice(0, 5).map(malzeme => (
                <li key={malzeme.id} className="flex items-center justify-between">
                  <span>{malzeme.vidaNo || malzeme.kod || malzeme.id}</span>
                </li>
              ))}
              {itemData.malzemeler.length > 5 && <li className="text-muted-foreground text-xs">... ve {itemData.malzemeler.length - 5} malzeme daha</li>}
            </ul>
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
      </div>
    </ScrollArea>
  );
};

export const Model_DetailSheet = props => {
  return (
    <BaseDetailSheet entityType={EntityType} title={renderTitle} {...props}>
      {item => renderDetails(item)}
    </BaseDetailSheet>
  );
};