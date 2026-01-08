/**
 * Notification utility functions for the Full-Stack Multi-User Todo Web Application.
 * Handles browser notifications for due tasks and other alerts.
 */

interface NotificationOptions {
  body?: string;
  icon?: string;
  tag?: string;
  requireInteraction?: boolean;
  silent?: boolean;
}

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported in this browser');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  return await Notification.requestPermission();
};

export const showNotification = async (title: string, options?: NotificationOptions): Promise<void> => {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported in this browser');
    return;
  }

  if (Notification.permission !== 'granted') {
    console.warn('Notifications not granted');
    return;
  }

  try {
    new Notification(title, options);
  } catch (error) {
    console.error('Error showing notification:', error);
  }
};

export const scheduleDueTaskNotifications = (tasks: any[]): void => {
  // Clear any existing scheduled notifications
  if ('serviceWorker' in navigator && 'getRegistrations' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.active?.postMessage({ type: 'CLEAR_DUE_TASK_NOTIFICATIONS' });
      });
    });
  }

  // Schedule notifications for due tasks
  tasks.forEach(task => {
    if (task.due_date && !task.completed) {
      const dueDate = new Date(task.due_date);
      const now = new Date();

      // Only schedule notifications for future dates
      if (dueDate > now) {
        const timeUntilDue = dueDate.getTime() - now.getTime();

        // Schedule a notification 10 minutes before due time
        const notificationTime = timeUntilDue - (10 * 60 * 1000);

        if (notificationTime > 0) {
          const taskId = task.id;
          const taskTitle = task.title;
          setTimeout(() => {
            showNotification(`Task Due Soon: ${taskTitle}`, {
              body: `Task "${taskTitle}" is due at ${dueDate.toLocaleTimeString()}`,
              tag: `task-due-${taskId}`,
              requireInteraction: false
            });
          }, notificationTime);
        }

        // Also schedule a notification for when it's actually due
        const taskId = task.id;
        const taskTitle = task.title;
        setTimeout(() => {
          showNotification(`Task Due: ${taskTitle}`, {
            body: `Task "${taskTitle}" is now due`,
            tag: `task-overdue-${taskId}`,
            requireInteraction: true
          });
        }, timeUntilDue);
      }
    }
  });
};

export const isNotificationSupported = (): boolean => {
  return 'Notification' in window;
};

export const getNotificationPermission = (): NotificationPermission => {
  return Notification ? Notification.permission : 'denied';
};