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
  if (itemData?.vidaNo) {
    return `${itemData.vidaNo} ${EntityHuman} Detayı`;
  }
  return `${EntityHuman} Detayı`;
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
        {/* Temel Bilgiler */}
        <DetailSection title="Temel Bilgiler">
          <DetailItem label={`${EntityHuman} ID`}>
            <Badge variant="secondary" className="font-mono text-xs">
              {itemData.id}
            </Badge>
          </DetailItem>
          
          {itemData.vidaNo && (
            <DetailItem label="Vida No">
              <Badge variant="outline" className="font-mono">
                {itemData.vidaNo}
              </Badge>
            </DetailItem>
          )}
          
          <DetailItem label="Malzeme Tipi">
            <Badge 
              variant={itemData.malzemeTipi === 'Demirbas' ? 'default' : 'secondary'} 
              className="text-xs"
            >
              {itemData.malzemeTipi || '-'}
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
          
          {itemData.kayitTarihi && (
            <DetailItem label="Kayıt Tarihi">
              {new Date(itemData.kayitTarihi).toLocaleDateString('tr-TR')}
            </DetailItem>
          )}
          
          {itemData.aciklama && (
            <DetailItem label="Açıklama">{itemData.aciklama}</DetailItem>
          )}
        </DetailSection>

        {/* Kategori ve Sınıflandırma */}
        <DetailSection title="Kategori ve Sınıflandırma">
          {itemData.sabitKodu && (
            <DetailItem label="Sabit Kodu">
              <Badge variant="secondary" className="text-xs">
                {itemData.sabitKodu.ad}
              </Badge>
            </DetailItem>
          )}
          
          {itemData.marka && (
            <DetailItem label="Marka">
              <div className="font-medium">{itemData.marka.ad}</div>
            </DetailItem>
          )}
          
          {itemData.model && (
            <DetailItem label="Model">
              <div>{itemData.model.ad}</div>
            </DetailItem>
          )}
        </DetailSection>

        {/* Organizasyon Bilgileri */}
        <DetailSection title="Organizasyon Bilgileri">
          {itemData.birim && (
            <DetailItem label="Kuvve Birimi">
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                {itemData.birim.ad}
              </Badge>
            </DetailItem>
          )}
          
          {itemData.sube && (
            <DetailItem label="İş Karşılığı Şube">
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                {itemData.sube.ad}
              </Badge>
            </DetailItem>
          )}
        </DetailSection>

        {/* Teknik Bilgiler */}
        <DetailSection title="Teknik Bilgiler ve Kodlar">
          {itemData.kod && (
            <DetailItem label="Kod">
              <Badge variant="outline" className="font-mono text-xs">
                {itemData.kod}
              </Badge>
            </DetailItem>
          )}
          
          {itemData.stokDemirbasNo && (
            <DetailItem label="Stok/Demirbaş No">
              <Badge variant="outline" className="font-mono text-xs">
                {itemData.stokDemirbasNo}
              </Badge>
            </DetailItem>
          )}
          
          {itemData.bademSeriNo && (
            <DetailItem label="Badem Seri No">
              <Badge variant="outline" className="font-mono text-xs">
                {itemData.bademSeriNo}
              </Badge>
            </DetailItem>
          )}
          
          {itemData.etmysSeriNo && (
            <DetailItem label="ETMYS Seri No">
              <Badge variant="outline" className="font-mono text-xs">
                {itemData.etmysSeriNo}
              </Badge>
            </DetailItem>
          )}
        </DetailSection>

        {/* Malzeme Hareketleri */}
        {itemData.malzemeHareketleri && itemData.malzemeHareketleri.length > 0 && (
          <DetailSection title={`Son Malzeme Hareketleri (${itemData.malzemeHareketleri.length})`}>
            <div className="space-y-2">
              {itemData.malzemeHareketleri.slice(0, 5).map((hareket, index) => (
                <div key={hareket.id || index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <div className="flex flex-col">
                    <Badge variant="outline" className="text-xs w-fit mb-1">
                      {hareket.hareketTuru}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {hareket.islemTarihi ? format(new Date(hareket.islemTarihi), 'dd MMM yyyy, HH:mm', { locale: tr }) : '-'}
                    </span>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="text-xs">
                      {hareket.malzemeKondisyonu}
                    </Badge>
                    {hareket.hedefPersonel && (
                      <div className="text-xs text-muted-foreground mt-1">
                        → {hareket.hedefPersonel.ad}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {itemData.malzemeHareketleri.length > 5 && (
                <p className="text-xs text-muted-foreground text-center">
                  ... ve {itemData.malzemeHareketleri.length - 5} hareket daha
                </p>
              )}
            </div>
          </DetailSection>
        )}

        {/* Denetim Bilgileri */}
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