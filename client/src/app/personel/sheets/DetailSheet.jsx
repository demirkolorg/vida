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
  const personelAvatar = itemData.avatar || '/placeholder.png';

  const roleColors = {
    'Superadmin': 'destructive',
    'Admin': 'warning_muted',
    'Personel': 'secondary',
    'User': 'outline'
  };

  return (
    <ScrollArea className="h-[calc(100vh-230px)]">
      <div className="p-2 md:p-4">
        <DetailSection title="Temel Bilgiler">
          <DetailItem label="Profil Fotoğrafı">
            <Avatar className="h-16 w-16">
              <AvatarImage src={personelAvatar} alt={itemData.ad || 'Avatar'} />
              <AvatarFallback className="text-lg">{itemData.ad?.substring(0, 1) || 'P'}</AvatarFallback>
            </Avatar>
          </DetailItem>
          
          <DetailItem label={`${EntityHuman} ID`}>
            <Badge variant="secondary" className="font-mono text-xs">
              {itemData.id}
            </Badge>
          </DetailItem>
          
          <DetailItem label={`${EntityHuman} Adı`}>{itemData.ad || '-'}</DetailItem>
          
          <DetailItem label="Sicil Numarası">
            <Badge variant="outline" className="font-mono text-xs">
              {itemData.sicil || '-'}
            </Badge>
          </DetailItem>
          
          <DetailItem label="Rol">
            <Badge variant={roleColors[itemData.role] || 'outline'} className="text-xs">
              {itemData.role || '-'}
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

        <DetailSection title="Organizasyonel Bilgiler">
          <DetailItem label="Bağlı Büro">
            {itemData.buro ? (
              <div className="flex flex-col space-y-1">
                <Badge variant="outline" className="text-xs w-fit">
                  {itemData.buro.ad}
                </Badge>
                {itemData.buro.sube && (
                  <span className="text-xs text-muted-foreground">
                    Şube: {itemData.buro.sube.ad}
                  </span>
                )}
              </div>
            ) : '-'}
          </DetailItem>
          
          <DetailItem label="Sistem Kullanıcısı">
            <Badge variant={itemData.isUser ? 'success_muted' : 'outline'} className="text-xs">
              {itemData.isUser ? 'Evet' : 'Hayır'}
            </Badge>
          </DetailItem>
          
          <DetailItem label="Amir Yetkisi">
            <Badge variant={itemData.isAmir ? 'warning_muted' : 'outline'} className="text-xs">
              {itemData.isAmir ? 'Evet' : 'Hayır'}
            </Badge>
          </DetailItem>
        </DetailSection>

        {itemData.isUser && (
          <DetailSection title="Sistem Giriş Bilgileri">
            <DetailItem label="Son Giriş">
              {itemData.lastLogin ? (
                <div className="flex flex-col">
                  <span className="text-sm">
                    {format(new Date(itemData.lastLogin), 'dd MMMM yyyy, HH:mm', { locale: tr })}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {(() => {
                      const diff = Date.now() - new Date(itemData.lastLogin).getTime();
                      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                      if (days === 0) return 'Bugün';
                      if (days === 1) return 'Dün';
                      return `${days} gün önce`;
                    })()}
                  </span>
                </div>
              ) : (
                <span className="text-muted-foreground">Hiç giriş yapmamış</span>
              )}
            </DetailItem>
            
            <DetailItem label="Son Çıkış">
              {itemData.lastLogout ? (
                format(new Date(itemData.lastLogout), 'dd MMMM yyyy, HH:mm', { locale: tr })
              ) : '-'}
            </DetailItem>
            
            <DetailItem label="Parola Durumu">
              <Badge variant={itemData.parola ? 'success_muted' : 'warning_muted'} className="text-xs">
                {itemData.parola ? 'Ayarlanmış' : 'Ayarlanmamış'}
              </Badge>
            </DetailItem>
          </DetailSection>
        )}

        {itemData.projeler && itemData.projeler.length > 0 && (
          <DetailSection title={`Katıldığı Projeler (${itemData.projeler.length})`}>
            <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
              {itemData.projeler.slice(0, 5).map(proje => (
                <li key={proje.id} className="flex items-center justify-between">
                  <span>{proje.ad || proje.kod}</span>
                  {proje.durum && (
                    <Badge 
                      variant={proje.durum === 'Tamamlandı' ? 'success_muted' : proje.durum === 'Devam Ediyor' ? 'warning_muted' : 'outline'} 
                      className="text-xs"
                    >
                      {proje.durum}
                    </Badge>
                  )}
                </li>
              ))}
              {itemData.projeler.length > 5 && <li className="text-muted-foreground text-xs">... ve {itemData.projeler.length - 5} proje daha</li>}
            </ul>
          </DetailSection>
        )}

        {itemData.yetkilendirmeler && itemData.yetkilendirmeler.length > 0 && (
          <DetailSection title={`Sistem Yetkileri (${itemData.yetkilendirmeler.length})`}>
            <div className="flex flex-wrap gap-2">
              {itemData.yetkilendirmeler.slice(0, 10).map((yetki, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {yetki.ad || yetki.kod}
                </Badge>
              ))}
              {itemData.yetkilendirmeler.length > 10 && (
                <Badge variant="outline" className="text-xs">
                  +{itemData.yetkilendirmeler.length - 10} yetki daha
                </Badge>
              )}
            </div>
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

export const Personel_DetailSheet = props => {
  return (
    <BaseDetailSheet entityType={EntityType} title={renderTitle} {...props}>
      {item => renderDetails(item)}
    </BaseDetailSheet>
  );
};