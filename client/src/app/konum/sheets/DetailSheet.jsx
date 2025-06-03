import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { DetailItem, DetailSection } from '@/components/table/components/DetailItem';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BaseDetailSheet } from '@/components/sheet/BaseDetailSheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { statusStyles } from '@/components/table/helper/Functions';
import { Button } from '@/components/ui/button';
import { ExternalLinkIcon, PackageIcon, TrendingUpIcon, TrendingDownIcon } from 'lucide-react';

import { EntityType, EntityHuman } from '../constants/api';

const renderTitle = itemData => {
  return itemData?.ad ? `${itemData.ad} ${EntityHuman} Detayı` : `${EntityHuman} Detayı`;
};

const getHareketTuruColor = (hareketTuru) => {
  const colors = {
    'Zimmet': 'bg-blue-50 text-blue-700 border-blue-200',
    'Iade': 'bg-green-50 text-green-700 border-green-200',
    'Kayit': 'bg-purple-50 text-purple-700 border-purple-200',
    'Devir': 'bg-orange-50 text-orange-700 border-orange-200',
    'Kayip': 'bg-red-50 text-red-700 border-red-200',
    'KondisyonGuncelleme': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'DepoTransferi': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Dusum': 'bg-gray-50 text-gray-700 border-gray-200',
  };
  return colors[hareketTuru] || 'bg-gray-50 text-gray-700 border-gray-200';
};

const getHareketTuruIcon = (hareketTuru) => {
  const icons = {
    'Zimmet': <TrendingDownIcon className="h-3 w-3" />,
    'Iade': <TrendingUpIcon className="h-3 w-3" />,
    'DepoTransferi': <PackageIcon className="h-3 w-3" />,
  };
  return icons[hareketTuru] || <PackageIcon className="h-3 w-3" />;
};

const renderDetails = itemData => {
  if (!itemData) {
    return <div className="p-4 text-center text-muted-foreground">{EntityHuman} bilgisi bulunamadı.</div>;
  }

  const createdByAvatar = itemData.createdBy?.avatar || '/placeholder.png';
  const updatedByAvatar = itemData.updatedBy?.avatar || '/placeholder.png';

  // Malzeme hareket istatistikleri
  const hareketIstatistikleri = itemData.malzemeHareketleri?.reduce((acc, hareket) => {
    acc[hareket.hareketTuru] = (acc[hareket.hareketTuru] || 0) + 1;
    return acc;
  }, {}) || {};

  const toplamHareket = itemData.malzemeHareketleri?.length || 0;
  const sonHareket = itemData.malzemeHareketleri?.sort((a, b) => 
    new Date(b.islemTarihi) - new Date(a.islemTarihi)
  )[0];

  return (
    <ScrollArea className="h-[calc(100vh-230px)]">
      <div className="p-2 md:p-4">
        <DetailSection title="Temel Bilgiler">
          <DetailItem label={`${EntityHuman} ID`}>
            <Badge variant="secondary" className="font-mono text-xs">
              {itemData.id}
            </Badge>
          </DetailItem>
          <DetailItem label={`${EntityHuman} Adı`}>
            <span className="font-semibold text-lg">{itemData.ad || '-'}</span>
          </DetailItem>
          <DetailItem label="Bağlı Depo">
            {itemData.depo ? (
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  {itemData.depo.ad}
                </Badge>
                <Button variant="ghost" size="sm" className="h-6 px-2">
                  <ExternalLinkIcon className="h-3 w-3 mr-1" />
                  Depo Detayı
                </Button>
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
          <DetailItem label="Açıklama">
            <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded border">
              {itemData.aciklama || 'Açıklama bulunmuyor.'}
            </div>
          </DetailItem>
        </DetailSection>

        {/* Malzeme Hareket İstatistikleri */}
        {toplamHareket > 0 && (
          <DetailSection title={`Malzeme Hareket İstatistikleri (Toplam: ${toplamHareket})`}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {Object.entries(hareketIstatistikleri).map(([hareketTuru, sayi]) => (
                <div key={hareketTuru} className="flex items-center justify-between p-2 rounded border bg-muted/30">
                  <div className="flex items-center space-x-2">
                    {getHareketTuruIcon(hareketTuru)}
                    <span className="text-sm font-medium">{hareketTuru}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {sayi}
                  </Badge>
                </div>
              ))}
            </div>
            
            {sonHareket && (
              <DetailItem label="Son Hareket">
                <div className="flex items-center space-x-2">
                  <Badge className={`text-xs ${getHareketTuruColor(sonHareket.hareketTuru)}`}>
                    {sonHareket.hareketTuru}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {format(new Date(sonHareket.islemTarihi), 'dd MMM yyyy, HH:mm', { locale: tr })}
                  </span>
                  {sonHareket.malzeme?.vidaNo && (
                    <Badge variant="outline" className="text-xs">
                      {sonHareket.malzeme.vidaNo}
                    </Badge>
                  )}
                </div>
              </DetailItem>
            )}
          </DetailSection>
        )}
        
        {/* Malzeme Hareketleri Detay */}
        {itemData.malzemeHareketleri && itemData.malzemeHareketleri.length > 0 && (
          <DetailSection title={`Son Malzeme Hareketleri (${Math.min(10, itemData.malzemeHareketleri.length)} / ${itemData.malzemeHareketleri.length})`}>
            <div className="space-y-2">
              {itemData.malzemeHareketleri
                .sort((a, b) => new Date(b.islemTarihi) - new Date(a.islemTarihi))
                .slice(0, 10)
                .map(hareket => (
                <div key={hareket.id} className="flex items-center justify-between p-3 rounded border bg-background hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    {getHareketTuruIcon(hareket.hareketTuru)}
                    <div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`text-xs ${getHareketTuruColor(hareket.hareketTuru)}`}>
                          {hareket.hareketTuru}
                        </Badge>
                        {hareket.malzeme?.vidaNo && (
                          <span className="text-sm font-medium">
                            {hareket.malzeme.vidaNo}
                          </span>
                        )}
                      </div>
                      {hareket.malzeme?.sabitKodu?.ad && (
                        <div className="text-xs text-gray-500 mt-1">
                          {hareket.malzeme.sabitKodu.ad}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      {format(new Date(hareket.islemTarihi), 'dd.MM.yyyy', { locale: tr })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(hareket.islemTarihi), 'HH:mm', { locale: tr })}
                    </div>
                  </div>
                </div>
              ))}
              {itemData.malzemeHareketleri.length > 10 && (
                <div className="text-center py-2">
                  <Button variant="outline" size="sm">
                    <PackageIcon className="h-4 w-4 mr-2" />
                    Tüm Hareketleri Görüntüle ({itemData.malzemeHareketleri.length - 10} daha)
                  </Button>
                </div>
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

export const Konum_DetailSheet = props => {
  return (
    <BaseDetailSheet entityType={EntityType} title={renderTitle} {...props}>
      {item => renderDetails(item)}
    </BaseDetailSheet>
  );
};