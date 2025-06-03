import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { DetailItem, DetailSection } from '@/components/table/DetailItem';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BaseDetailSheet } from '@/components/sheet/BaseDetailSheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EntityType, EntityHuman } from '../constants/api';

// AuditLog için başlık oluşturma fonksiyonu
const renderAuditLogTitle = itemData => {
  // EntityHuman'ın bu context'te "Denetim Kaydı" veya benzeri bir değere sahip olduğu varsayılır.
  if (itemData?.id) {
    // ID çok uzunsa, okunabilirliği artırmak için kısaltılabilir.
    const displayId = itemData.id.length > 16 ? `${itemData.id.substring(0, 12)}...` : itemData.id;
    return `${EntityHuman} Detayı (ID: ${displayId})`;
  }
  return `${EntityHuman} Detayı`;
};

// AuditLog için detayları render etme fonksiyonu
const renderAuditLogDetails = itemData => {
  if (!itemData) {
    return <div className="p-4 text-center text-muted-foreground">{EntityHuman} bilgisi bulunamadı.</div>;
  }

  // createdBy.avatar alanı Personel şemasında varsa kullanılır.
  const createdByAvatar = itemData.createdBy?.avatar || '/placeholder.png';
  // AuditLog modelinde updatedBy ile ilgili alanlar olmadığı için onlar kaldırıldı.

  const getLevelBadgeVariant = (level) => {
    const lowerLevel = level?.toLowerCase();
    if (lowerLevel === 'error' || lowerLevel === 'err') return 'destructive';
    if (lowerLevel === 'warn' || lowerLevel === 'warning') return 'warning';
    if (lowerLevel === 'info') return 'info_muted'; // 'info' veya özel bir stil olabilir
    if (lowerLevel === 'debug') return 'secondary';
    return 'outline';
  };

  return (
    <ScrollArea className="h-[calc(100vh-200px)]"> {/* Yükseklik ayarlanabilir */}
      <div className="p-3 md:p-4 space-y-4">
        <DetailSection title={`${EntityHuman} Temel Bilgileri`}>
          <DetailItem label={`${EntityHuman} ID`}>
            <Badge variant="outline" className="font-mono text-xs break-all bg-muted hover:bg-muted/90 px-2 py-1">
              {itemData.id || '-'}
            </Badge>
          </DetailItem>
          <DetailItem label="Seviye (Level)">
            <Badge variant={getLevelBadgeVariant(itemData.level)} className="capitalize">
              {itemData.level || '-'}
            </Badge>
          </DetailItem>
          <DetailItem label="Rota (Endpoint)">{itemData.rota || '-'}</DetailItem>
          <DetailItem label="Hizmet (Service)">{itemData.hizmet || '-'}</DetailItem>
        </DetailSection>

        <DetailSection title="Log İçeriği (JSON Verisi)">
          <div className="rounded-md bg-background border p-3 my-2 shadow-sm">
            {itemData.log ? (
              <ScrollArea className="max-h-96"> {/* Uzun loglar için scroll */}
                <pre className="whitespace-pre-wrap break-all text-xs font-mono bg-muted p-2.5 rounded-sm">
                  {JSON.stringify(itemData.log, null, 2)}
                </pre>
              </ScrollArea>
            ) : (
              <p className="text-sm text-muted-foreground italic">Log içeriği bulunmamaktadır.</p>
            )}
          </div>
        </DetailSection>

        <DetailSection title="Oluşturma Bilgileri">
          {itemData.createdBy ? (
            <DetailItem label="Oluşturan Kullanıcı">
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={createdByAvatar} alt={itemData.createdBy.ad || 'Kullanıcı Avatarı'} />
                  <AvatarFallback>{itemData.createdBy.ad ? itemData.createdBy.ad.substring(0, 1).toUpperCase() : (itemData.createdBy.sicil ? itemData.createdBy.sicil.substring(0,1) : 'K')}</AvatarFallback>
                </Avatar>
                <span>{itemData.createdBy.ad || itemData.createdBy.sicil || `ID: ${itemData.createdById}` || 'Bilinmiyor'}</span>
              </div>
            </DetailItem>
          ) : itemData.createdById ? (
            <DetailItem label="Oluşturan Kullanıcı ID">{itemData.createdById}</DetailItem>
          ) : (
            <DetailItem label="Oluşturan">Sistem tarafından veya bilinmiyor</DetailItem>
          )}
          <DetailItem label="Oluşturulma Zamanı">
            {itemData.createdAt ? format(new Date(itemData.createdAt), 'dd MMMM yyyy, HH:mm:ss', { locale: tr }) : '-'}
          </DetailItem>
          {/* AuditLog modelinde updatedAt ve updatedBy alanları olmadığı için bu kısımlar gösterilmez. */}
        </DetailSection>
      </div>
    </ScrollArea>
  );
};

// AuditLog detaylarını göstermek için ana bileşen
export const Audit_DetailSheet = props => {
  // BaseDetailSheet'e EntityType (örn: 'auditlog') ve başlık render fonksiyonu iletilir.
  // Diğer proplar (item dahil) BaseDetailSheet'e yayılır.
  return (
    <BaseDetailSheet
      entityType={EntityType} // Bu prop'un AuditLog için doğru değere sahip olması beklenir (örn: 'auditlog')
      title={renderAuditLogTitle} // AuditLog'a özel başlık render fonksiyonu
      {...props}
    >
      {/* BaseDetailSheet, çocuk fonksiyonuna 'item' prop'unu geçirir */}
      {(itemFromSheet) => renderAuditLogDetails(itemFromSheet)}
    </BaseDetailSheet>
  );
};