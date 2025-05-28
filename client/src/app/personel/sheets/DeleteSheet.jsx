import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BaseDeleteSheet } from '@/components/sheet/BaseDeleteSheet';
import { EntityType, EntityHuman } from '../constants/api';

import { Personel_Store as EntityStore } from '../constants/store'; 

const renderDetails = itemData => (
  <div className="space-y-4 rounded-md border bg-muted/30 p-4">
    <p className="text-sm text-muted-foreground">Aşağıdaki {EntityHuman} kaydını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>
    
    {/* Personel Özet Bilgileri */}
    <div className="flex items-center space-x-4 p-3 bg-background rounded-md border">
      <Avatar className="h-12 w-12">
        <AvatarImage src={itemData.avatar || '/placeholder.png'} alt={itemData.ad || 'Avatar'} />
        <AvatarFallback className="text-sm">{itemData.ad?.substring(0, 1) || 'P'}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h4 className="font-semibold">{itemData.ad || '-'}</h4>
        <div className="flex items-center space-x-2 mt-1">
          <Badge variant="outline" className="font-mono text-xs">
            Sicil: {itemData.sicil || '-'}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {itemData.role || 'Personel'}
          </Badge>
        </div>
      </div>
    </div>

    {/* Detay Bilgileri */}
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-muted-foreground">{EntityHuman} ID:</span>
        <Badge variant="secondary" className="font-mono text-xs">
          {itemData.id}
        </Badge>
      </div>

      {itemData.buro && (
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-muted-foreground">Bağlı Büro:</span>
          <div className="flex flex-col items-end">
            <span className="font-semibold">{itemData.buro.ad}</span>
            {itemData.buro.sube && (
              <span className="text-xs text-muted-foreground">{itemData.buro.sube.ad}</span>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-muted-foreground">Sistem Kullanıcısı:</span>
        <Badge variant={itemData.isUser ? 'success_muted' : 'outline'} className="text-xs">
          {itemData.isUser ? 'Evet' : 'Hayır'}
        </Badge>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-muted-foreground">Amir Yetkisi:</span>
        <Badge variant={itemData.isAmir ? 'warning_muted' : 'outline'} className="text-xs">
          {itemData.isAmir ? 'Evet' : 'Hayır'}
        </Badge>
      </div>

      {itemData.lastLogin && (
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-muted-foreground">Son Giriş:</span>
          <span className="text-xs">
            {new Date(itemData.lastLogin).toLocaleDateString('tr-TR')}
          </span>
        </div>
      )}
    </div>

    {/* Uyarı Mesajları */}
    <div className="space-y-2 pt-2 border-t">
      {itemData.isUser && (
        <div className="flex items-start space-x-2 p-2 bg-yellow-50 rounded-md">
          <span className="text-yellow-600 font-medium text-xs">⚠️</span>
          <p className="text-xs text-yellow-800">
            Bu personel sistem kullanıcısıdır. Silme işlemi sistemde oturum açma yetkisini de kaldıracaktır.
          </p>
        </div>
      )}

      {itemData.isAmir && (
        <div className="flex items-start space-x-2 p-2 bg-orange-50 rounded-md">
          <span className="text-orange-600 font-medium text-xs">⚠️</span>
          <p className="text-xs text-orange-800">
            Bu personel amir yetkisine sahiptir. Silme işleminden önce yönettiği personel/büroları kontrol ediniz.
          </p>
        </div>
      )}

      <div className="flex items-start space-x-2 p-2 bg-red-50 rounded-md">
        <span className="text-red-600 font-medium text-xs">🚨</span>
        <p className="text-xs text-red-800">
          Bu işlem geri alınamaz. {EntityHuman} kaydı ve tüm ilişkili veriler kalıcı olarak silinecektir.
          Emin değilseniz, önce durumunu "Pasif" olarak değiştirmeyi düşünün.
        </p>
      </div>
    </div>
  </div>
);

export const Personel_DeleteSheet = props => {
  const deleteAction = EntityStore(state => state.Delete);
  const loadingAction = EntityStore(state => state.loadingAction);

  return (
    <BaseDeleteSheet entityType={EntityType} title={`${EntityHuman} Sil`} deleteAction={deleteAction} loadingAction={loadingAction} {...props}>
      {item => renderDetails(item)}
    </BaseDeleteSheet>
  );
};