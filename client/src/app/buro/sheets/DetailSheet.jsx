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
    return <div className="p-4 text-center text-muted-foreground">{EntityHuman} bilgisi bulunamadı.</div>;
  }

  const createdByAvatar = itemData.createdBy?.avatar || '/placeholder.png';
  const updatedByAvatar = itemData.updatedBy?.avatar || '/placeholder.png';
  const amirAvatar = itemData.amir?.avatar || '/placeholder.png';

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
          <DetailItem label="Bağlı Şube">
            {itemData.sube ? (
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {itemData.sube.ad}
                </Badge>
              </div>
            ) : '-'}
          </DetailItem>
          <DetailItem label="Büro Amiri">
            {itemData.amir ? (
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={amirAvatar} alt={itemData.amir.ad || 'Avatar'} />
                  <AvatarFallback>{itemData.amir.ad?.substring(0, 1) || 'A'}</AvatarFallback>
                </Avatar>
                <span>{itemData.amir.ad || itemData.amir.sicil || '-'}</span>
                {itemData.amir.unvan && (
                  <Badge variant="secondary" className="text-xs">
                    {itemData.amir.unvan}
                  </Badge>
                )}
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
        
        {itemData.personeller && itemData.personeller.length > 0 && (
          <DetailSection title={`Büro Personelleri (${itemData.personeller.length})`}>
            <ul className="list-disc list-inside pl-4 space-y-2 text-sm">
              {itemData.personeller.slice(0, 8).map(personel => (
                <li key={personel.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={personel.avatar || '/placeholder.png'} alt={personel.ad || 'Avatar'} />
                      <AvatarFallback className="text-xs">{personel.ad?.substring(0, 1) || 'P'}</AvatarFallback>
                    </Avatar>
                    <span>{personel.ad || personel.sicil}</span>
                  </div>
                  {personel.unvan && (
                    <Badge variant="outline" className="text-xs ml-2">
                      {personel.unvan}
                    </Badge>
                  )}
                </li>
              ))}
              {itemData.personeller.length > 8 && <li className="text-muted-foreground text-xs">... ve {itemData.personeller.length - 8} personel daha</li>}
            </ul>
          </DetailSection>
        )}
        
        {itemData.malzemeler && itemData.malzemeler.length > 0 && (
          <DetailSection title={`Büro Malzemeleri (${itemData.malzemeler.length})`}>
            <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
              {itemData.malzemeler.slice(0, 6).map(malzeme => (
                <li key={malzeme.id} className="flex items-center justify-between">
                  <span>{malzeme.vidaNo || malzeme.kod || malzeme.ad || malzeme.id}</span>
                  <div className="flex items-center space-x-1">
                    {malzeme.miktar && (
                      <Badge variant="secondary" className="text-xs">
                        Miktar: {malzeme.miktar}
                      </Badge>
                    )}
                    {malzeme.sabitKodu && (
                      <Badge variant="outline" className="text-xs">
                        {malzeme.sabitKodu.ad}
                      </Badge>
                    )}
                  </div>
                </li>
              ))}
              {itemData.malzemeler.length > 6 && <li className="text-muted-foreground text-xs">... ve {itemData.malzemeler.length - 6} malzeme daha</li>}
            </ul>
          </DetailSection>
        )}

        {itemData.projeler && itemData.projeler.length > 0 && (
          <DetailSection title={`Aktif Projeler (${itemData.projeler.length})`}>
            <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
              {itemData.projeler.slice(0, 5).map(proje => (
                <li key={proje.id} className="flex items-center justify-between">
                  <span>{proje.ad || proje.kod}</span>
                  <div className="flex items-center space-x-1">
                    {proje.durum && (
                      <Badge 
                        variant={proje.durum === 'Tamamlandı' ? 'success_muted' : proje.durum === 'Devam Ediyor' ? 'warning_muted' : 'outline'} 
                        className="text-xs"
                      >
                        {proje.durum}
                      </Badge>
                    )}
                  </div>
                </li>
              ))}
              {itemData.projeler.length > 5 && <li className="text-muted-foreground text-xs">... ve {itemData.projeler.length - 5} proje daha</li>}
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

export const Buro_DetailSheet = props => {
  return (
    <BaseDetailSheet entityType={EntityType} title={renderTitle} {...props}>
      {item => renderDetails(item)}
    </BaseDetailSheet>
  );
};