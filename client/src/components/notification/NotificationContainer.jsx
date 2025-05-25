// src/components/ui/NotificationContainer.jsx
import React from 'react';
import Notification from './NotificationMenu'; // Notification bileşenimiz
import { cn } from '@/lib/utils';

// Bu hook, bildirimleri yönetmek için bir örnek.
// Gerçek bir uygulamada Zustand, Redux veya Context API kullanabilirsiniz.
// Şimdilik basit bir örnek:
let notificationId = 0;
const useNotificationStore = () => {
  const [notifications, setNotifications] = React.useState([]);

  const addNotification = (notification) => {
    // type, title, message, duration
    const id = notificationId++;
    setNotifications((prev) => [...prev, { ...notification, id }]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return { notifications, addNotification, removeNotification };
};
// DİKKAT: Yukarıdaki `useNotificationStore` sadece bu dosya içinde basit bir örnektir
// ve global state yönetimi için yeterli olmayabilir.
// Projenizde zaten bir state management çözümü varsa onu kullanın.
// Örnek: `sonner` veya `react-hot-toast` gibi kütüphaneler bu işi zaten yapar.

const NotificationContainer = ({
  notifications, // Dışarıdan gelen bildirimler dizisi [{ id, type, title, message, ... }]
  onCloseNotification, // (id) => void
  position = 'top-right', // 'top-right', 'top-left', 'bottom-right', 'bottom-left'
  className,
}) => {
  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-0 left-0';
      case 'bottom-right':
        return 'bottom-0 right-0';
      case 'bottom-left':
        return 'bottom-0 left-0';
      case 'top-right':
      default:
        return 'top-0 right-0';
    }
  };

  if (!notifications || notifications.length === 0) {
    return null;
  }

  return (
    <div
      aria-live="assertive"
      className={cn(
        'fixed z-50 p-4 space-y-3 w-full max-w-sm', // max-w-sm bildirimlerin genişliğini sınırlar
        getPositionClasses(),
        className
      )}
    >
      {notifications.map((notif) => (
        <Notification
          key={notif.id}
          id={notif.id}
          type={notif.type}
          title={notif.title}
          message={notif.message}
          duration={notif.duration}
          onClose={onCloseNotification}
          showProgressBar={notif.showProgressBar}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;