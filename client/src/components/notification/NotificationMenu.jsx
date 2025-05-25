
import React, { useState, useEffect, useMemo } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { BellIcon, CheckCheck, MessageSquare, ClipboardCheck, Cog } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Link, useNavigate } from 'react-router-dom'; // <<< DEĞİŞİKLİK: react-router-dom'dan Link ve useNavigate importu
import { cn } from '@/lib/utils';

// Örnek bildirim ikonları (type'a göre)
const typeIcons = {
  new_message: <MessageSquare className="h-4 w-4 text-blue-500" />,
  task_assigned: <ClipboardCheck className="h-4 w-4 text-green-500" />,
  system_update: <Cog className="h-4 w-4 text-gray-500" />,
  default: <BellIcon className="h-4 w-4 text-gray-500" />,
};

// Bu hook/state yönetimi uygulamanızın geneline yayılmalı (Zustand, Context, Redux vb.)
// Şimdilik basit bir lokal state ile demo yapıyoruz.
const useNotifications = () => {
  const [notifications, setNotifications] = useState([
    { id: '1', type: 'new_message', title: 'Yeni Mesajınız Var', description: 'Ahmet Yılmaz size bir mesaj gönderdi.', timestamp: new Date(Date.now() - 1000 * 60 * 5), isRead: false, link: '/messages/123' },
    { id: '2', type: 'task_assigned', title: 'Görev Atandı', description: 'Proje X için "Ana Sayfa Tasarımı" görevi size atandı.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), isRead: false, link: '/tasks/456' },
    { id: '3', type: 'system_update', title: 'Sistem Güncellemesi', description: 'Bakım çalışması bu gece 02:00\'de yapılacaktır.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), isRead: true, link: '/announcements/1' },
    { id: '4', type: 'default', title: 'Hoş Geldiniz!', description: 'Platformumuza hoş geldiniz. Keşfetmeye başlayın!', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), isRead: true, link: '/welcome' },
  ]);

  const unreadCount = useMemo(() => notifications.filter(n => !n.isRead).length, [notifications]);

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
    console.log(`Notification ${notificationId} marked as read.`);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    console.log('All notifications marked as read.');
  };

  const addNotification = (newNotification) => {
    setNotifications(prev => [
        { ...newNotification, id: String(Date.now()), timestamp: new Date(), isRead: false },
        ...prev
    ]);
  };

  return { notifications, unreadCount, markAsRead, markAllAsRead, addNotification };
};


export function NotificationMenu() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // <<< DEĞİŞİKLİK: useNavigate hook'u

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    setIsOpen(false); // Menüyü kapat
    if (notification.link) {
      navigate(notification.link); // <<< DEĞİŞİKLİK: Programatik yönlendirme
    }
  };

  const handleSeeAllNotifications = () => {
    setIsOpen(false);
    navigate('/notifications'); // <<< DEĞİŞİKLİK: Programatik yönlendirme
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative rounded-md h-8 w-8">
          <BellIcon className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-4 w-4 min-w-[1rem] p-0 flex items-center justify-center text-xs rounded-full"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 sm:w-96">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Bildirimler</span>
          {unreadCount > 0 && (
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto text-xs"
              onClick={(e) => {
                e.stopPropagation();
                markAllAsRead();
              }}
            >
              Tümünü Okundu İşaretle
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="max-h-90 ">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Yeni bildiriminiz yok.
            </div>
          ) : (
            notifications.map((notification) => {
              const IconComponent = typeIcons[notification.type] || typeIcons.default;
              return (
                // DropdownMenuItem'ın kendisi bir buton gibi davranır,
                // onSelect ile aksiyonu tetikleyip sonra programatik olarak yönlendirmek daha iyi bir pratiktir.
                // Bu, DropdownMenu'nun klavye navigasyonu gibi özelliklerini korur.
                <DropdownMenuItem
                  key={notification.id}
                  onSelect={() => handleNotificationClick(notification)}
                  className={cn(
                    "flex items-start p-2 mb-1 last:mb-0 rounded-md hover:bg-accent cursor-pointer data-[highlighted]:bg-accent",
                    !notification.isRead && "bg-primary/5 dark:bg-primary/10"
                  )}
                  // `asChild` burada doğrudan Link ile kullanılınca bazen stil sorunları çıkarabilir
                  // veya DropdownMenu'nun beklediği davranışı bozabilir.
                  // `onSelect` ve programatik navigasyon daha güvenilirdir.
                >
                  {/* Link'i doğrudan item içine gömmek yerine, onSelect ile yönlendirme yapacağız. */}
                  <div className="flex-shrink-0 mt-0.5">
                    {notification.icon || IconComponent}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm font-medium truncate",
                      !notification.isRead && "font-semibold"
                    )}>
                      {notification.title}
                    </p>
                    {notification.description && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {notification.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground/80 mt-1">
                      {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true, locale: tr })}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div className="ml-2 flex-shrink-0 self-center">
                      <span className="h-2 w-2 rounded-full bg-blue-500 block"></span>
                    </div>
                  )}
                </DropdownMenuItem>
              );
            })
          )}
        </ScrollArea>
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            {/* "Tüm Bildirimleri Gör" için de onSelect ve programatik navigasyon */}
            <DropdownMenuItem
              onSelect={handleSeeAllNotifications}
              className="w-full flex justify-center text-sm py-2 cursor-pointer data-[highlighted]:bg-accent"
            >
              Tüm Bildirimleri Gör
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}