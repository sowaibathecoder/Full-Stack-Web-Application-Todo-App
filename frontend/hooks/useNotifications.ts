import { useState, useEffect } from 'react';

interface NotificationHook {
  state: NotificationPermission;
  requestPermission: () => Promise<NotificationPermission>;
  showNotification: (title: string, options?: NotificationOptions) => void;
}

export const useNotifications = (): NotificationHook => {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Initialize the current permission state
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      console.warn('Notifications not supported in this environment');
      return 'denied';
    }

    if (Notification.permission !== 'default') {
      setPermission(Notification.permission);
      return Notification.permission;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  };

  const showNotification = (title: string, options?: NotificationOptions): void => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      console.warn('Notifications not supported in this environment');
      return;
    }

    if (Notification.permission === 'granted') {
      try {
        new Notification(title, options);
      } catch (error) {
        console.error('Error showing notification:', error);
      }
    } else if (Notification.permission === 'default') {
      console.warn('Notification permission not granted');
    }
  };

  return {
    state: permission,
    requestPermission,
    showNotification
  };
};