import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { DetailItem, DetailSection } from '@/components/table/components/DetailItem';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BaseDetailSheet } from '@/components/sheet/BaseDetailSheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { statusStyles } from '@/components/table/helper/Functions';

import { EntityType, EntityHuman } from '../constants/api';

const renderTitle = itemData => {
  return itemData?.ad ? `${itemData.ad} ${EntityHuman} Detayı` : `${EntityHuman} Detayı`;
};

const renderDetails = itemData => {
  if (!itemData) {
    return <div className="p-4 text-center text-muted-foreground">${EntityHuman} bilgisi bulunamadı.</div>;
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
        {itemData.konumlar && itemData.konumlar.length > 0 && (
          <DetailSection title={`Bağlı Şubeler (${itemData.konumlar.length})`}>
            <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
              {itemData.konumlar.slice(0, 5).map(sube => (
                <li key={sube.id}>{sube.ad}</li>
              ))}
              {itemData.konumlar.length > 5 && <li className="text-muted-foreground text-xs">... ve {itemData.konumlar.length - 5} şube daha</li>}
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

export const Depo_DetailSheet = props => {
  return (
    <BaseDetailSheet entityType={EntityType} title={renderTitle} {...props}>
      {item => renderDetails(item)}
    </BaseDetailSheet>
  );
};
