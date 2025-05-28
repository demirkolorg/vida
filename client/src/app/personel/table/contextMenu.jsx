import { useCallback } from 'react';
import { ContextMenuItem } from '@/components/ui/context-menu';
import { BaseContextMenu } from '@/components/contextMenu/BaseContextMenu';
import { EntityHuman, EntityType } from '../constants/api';
import { Building2Icon, KeyIcon, UserCheckIcon, ShieldIcon, MailIcon, PhoneIcon, HistoryIcon } from 'lucide-react';

export function Personel_ContextMenu({ item }) {
  const menuTitle = item?.ad ? `${item.ad} ${EntityHuman} Kaydı` : `${EntityHuman} İşlemleri`;

  const handleViewBuro = useCallback(() => {
    if (!item?.buro) return;
    // Bağlı büro detayını göster
    // Örnek: router.push(`/burolar/${item.buro.id}`);
  }, [item]);

  const handleResetPassword = useCallback(() => {
    if (!item) return;
    // Şifre sıfırlama işlemi
    console.log('Şifre sıfırlama:', item.sicil);
  }, [item]);

  const handleToggleUserStatus = useCallback(() => {
    if (!item) return;
    // Sistem kullanıcısı durumunu değiştir
    console.log('Kullanıcı durumu değiştir:', item.sicil);
  }, [item]);

  const handleManagePermissions = useCallback(() => {
    if (!item) return;
    // Yetki yönetimi ekranını aç
    console.log('Yetki yönetimi:', item.sicil);
  }, [item]);

  const handleSendEmail = useCallback(() => {
    if (!item) return;
    // Email gönderme ekranını aç
    console.log('Email gönder:', item.sicil);
  }, [item]);

  const handleCallPhone = useCallback(() => {
    if (!item) return;
    // Telefon arama işlemi
    console.log('Telefon ara:', item.sicil);
  }, [item]);

  const handleViewLoginHistory = useCallback(() => {
    if (!item) return;
    // Giriş geçmişini göster
    console.log('Giriş geçmişi:', item.sicil);
  }, [item]);

  return (
    <BaseContextMenu item={item} entityType={EntityType} entityHuman={EntityHuman} menuTitle={menuTitle}>
      {/* Bağlı Büro Görüntüleme */}
      {item?.buro && (
        <ContextMenuItem className="" onSelect={handleViewBuro}>
          <Building2Icon className="mr-2 h-4 w-4 text-blue-500" />
          <span>Bağlı Büroyu Görüntüle ({item.buro.ad})</span>
        </ContextMenuItem>
      )}

      {/* Şifre Sıfırlama */}
      {item?.isUser && (
        <ContextMenuItem className="" onSelect={handleResetPassword}>
          <KeyIcon className="mr-2 h-4 w-4 text-orange-500" />
          <span>Şifre Sıfırla</span>
        </ContextMenuItem>
      )}

      {/* Sistem Kullanıcısı Durumunu Değiştir */}
      <ContextMenuItem className="" onSelect={handleToggleUserStatus}>
        <UserCheckIcon className="mr-2 h-4 w-4 text-green-500" />
        <span>
          {item?.isUser ? 'Sistem Kullanıcılığını Kaldır' : 'Sistem Kullanıcısı Yap'}
        </span>
      </ContextMenuItem>

      {/* Yetki Yönetimi */}
      {item?.isUser && (
        <ContextMenuItem className="" onSelect={handleManagePermissions}>
          <ShieldIcon className="mr-2 h-4 w-4 text-purple-500" />
          <span>Yetkileri Yönet</span>
        </ContextMenuItem>
      )}

      {/* Email Gönder */}
      <ContextMenuItem className="" onSelect={handleSendEmail}>
        <MailIcon className="mr-2 h-4 w-4 text-indigo-500" />
        <span>Email Gönder</span>
      </ContextMenuItem>

      {/* Telefon Ara */}
      <ContextMenuItem className="" onSelect={handleCallPhone}>
        <PhoneIcon className="mr-2 h-4 w-4 text-teal-500" />
        <span>Telefon Ara</span>
      </ContextMenuItem>

      {/* Giriş Geçmişi */}
      {item?.isUser && (
        <ContextMenuItem className="" onSelect={handleViewLoginHistory}>
          <HistoryIcon className="mr-2 h-4 w-4 text-gray-500" />
          <span>Giriş Geçmişini Görüntüle</span>
        </ContextMenuItem>
      )}
    </BaseContextMenu>
  );
}