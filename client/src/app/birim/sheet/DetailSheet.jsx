// src/app/(features)/birim/sheet/birim-detail-sheet.jsx

// 'use client';

import React from "react";
// DetailItem ve DetailSection'ı aynı dosyadan import ediyoruz
import { DetailItem, DetailSection } from "@/components/table/DetailItem";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BaseDetailSheet } from "@/components/sheet/BaseDetailSheet";
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { ScrollArea } from "@/components/ui/scroll-area";

const ENTITY_TYPE = 'birim';

const renderBirimTitle = (itemData) => {
  return itemData?.ad ? `${itemData.ad} Birimi Detayları` : "Birim Detayları";
};

const renderBirimDetails = (itemData) => {
  if (!itemData) {
    return <div className="p-4 text-center text-muted-foreground">Birim bilgisi bulunamadı.</div>;
  }

  const createdByAvatar = itemData.createdBy?.avatar || "/placeholder.png";
  const updatedByAvatar = itemData.updatedBy?.avatar || "/placeholder.png";

  return (
    <ScrollArea className="h-[calc(100vh-120px)]">
      <div className="p-2 md:p-4"> {/* Ana sarmalayıcı, DetailSection mb-6'ya sahip olduğu için space-y kaldırıldı */}
        
        <DetailSection title="Temel Bilgiler">
          <DetailItem label="Birim ID">
            <Badge variant="secondary" className="font-mono text-xs">{itemData.id}</Badge>
          </DetailItem>
          <DetailItem label="Birim Adı">{itemData.ad || "-"}</DetailItem>
          <DetailItem label="Açıklama">{itemData.aciklama || "-"}</DetailItem>
          <DetailItem label="Durum">
            <Badge
              variant={
                itemData.status === 'Aktif' ? 'success_muted' :
                itemData.status === 'Pasif' ? 'warning_muted' :
                itemData.status === 'Silindi' ? 'destructive_muted' : 'outline'
              }
            >
              {itemData.status || "-"}
            </Badge>
          </DetailItem>
        </DetailSection>

        {itemData.subeler && itemData.subeler.length > 0 && (
          <DetailSection title={`Bağlı Şubeler (${itemData.subeler.length})`}>
            <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
              {itemData.subeler.slice(0, 5).map(sube => (
                <li key={sube.id}>{sube.ad}</li>
              ))}
              {itemData.subeler.length > 5 && (
                <li className="text-muted-foreground text-xs">... ve {itemData.subeler.length - 5} şube daha</li>
              )}
            </ul>
          </DetailSection>
        )}

        {itemData.malzemeler && itemData.malzemeler.length > 0 && (
          <DetailSection title={`İlişkili Malzemeler (${itemData.malzemeler.length})`}>
             <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
              {itemData.malzemeler.slice(0, 5).map(malzeme => (
                <li key={malzeme.id}>{malzeme.vidaNo || malzeme.sabitKodu?.ad || malzeme.id}</li>
              ))}
              {itemData.malzemeler.length > 5 && (
                <li className="text-muted-foreground text-xs">... ve {itemData.malzemeler.length - 5} malzeme daha</li>
              )}
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
                <span>{itemData.createdBy.ad || itemData.createdBy.sicil || "-"}</span>
              </div>
            </DetailItem>
          )}
          <DetailItem label="Oluşturulma Tarihi">
            {itemData.createdAt ? format(new Date(itemData.createdAt), 'dd MMMM yyyy, HH:mm', { locale: tr }) : "-"}
          </DetailItem>

          {itemData.updatedBy && (
            <DetailItem label="Güncelleyen Personel">
               <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={updatedByAvatar} alt={itemData.updatedBy.ad || 'Avatar'} />
                  <AvatarFallback>{itemData.updatedBy.ad?.substring(0, 1) || 'P'}</AvatarFallback>
                </Avatar>
                <span>{itemData.updatedBy.ad || itemData.updatedBy.sicil || "-"}</span>
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

export const BirimDetailSheet = (props) => {
  return (
    <BaseDetailSheet
      entityType={props.entityType || ENTITY_TYPE}
      title={renderBirimTitle}
      {...props}
    >
      {(item) => renderBirimDetails(item)}
    </BaseDetailSheet>
  );
};