/**
 * notificationService.js
 * CivicConnect Notification Service for Citizens
 * Communicates with Node.js Express Backend & MongoDB
 */

import api from './api';

const STORAGE_KEY_CITIZEN_NOTIFS = 'civicconnect_citizen_notifications_v2';

function getStoredNotifications() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CITIZEN_NOTIFS);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading citizen notifications from localStorage:', err);
  }
  return [];
}

function saveStoredNotifications(notifs) {
  try {
    localStorage.setItem(STORAGE_KEY_CITIZEN_NOTIFS, JSON.stringify(notifs));
  } catch (err) {
    console.error('Error saving citizen notifications to localStorage:', err);
  }
}

export const notificationService = {
  /**
   * Get all notifications (API first)
   */
  async getNotifications(filter = 'all') {
    try {
      const response = await api.get('/notifications', { params: { filter } });
      if (response.data && response.data.data) {
        saveStoredNotifications(response.data.data);
        return response.data.data;
      }
    } catch (_err) {
      console.warn('API notifications notice: using local cache.');
    }

    const notifs = getStoredNotifications();
    if (filter === 'unread') return notifs.filter(n => !n.read);
    if (filter === 'read') return notifs.filter(n => n.read);
    return notifs;
  },

  /**
   * Get unread count (API first)
   */
  async getUnreadCount() {
    try {
      const response = await api.get('/notifications/unread-count');
      if (response.data && response.data.unreadCount !== undefined) {
        return response.data.unreadCount;
      }
    } catch (_err) {
      // Local fallback
    }
    const notifs = getStoredNotifications();
    return notifs.filter(n => !n.read).length;
  },

  /**
   * Mark a single notification as read
   */
  async markAsRead(id) {
    try {
      await api.put(`/notifications/${id}/read`);
    } catch (_err) {
      // fallback
    }
    const notifs = getStoredNotifications();
    const updated = notifs.map(n => n.id === id ? { ...n, read: true } : n);
    saveStoredNotifications(updated);
    return updated;
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead() {
    try {
      await api.put('/notifications/mark-all-read');
    } catch (_err) {
      // fallback
    }
    const notifs = getStoredNotifications();
    const updated = notifs.map(n => ({ ...n, read: true }));
    saveStoredNotifications(updated);
    return updated;
  },

  /**
   * Add a new notification
   */
  async addNotification({ title, message, problemId = null, category = 'Alert', type = 'system', badgeText = 'Update', badgeColor = 'primary', icon = 'bi-bell' }) {
    const notifs = getStoredNotifications();
    const newNotif = {
      id: `NOTIF-${Date.now()}`,
      title,
      message,
      problemId,
      category,
      type,
      read: false,
      timestamp: new Date().toISOString(),
      badgeText,
      badgeColor,
      icon
    };
    const updated = [newNotif, ...notifs];
    saveStoredNotifications(updated);
    return newNotif;
  },

  /**
   * Delete a notification
   */
  async deleteNotification(id) {
    try {
      await api.delete(`/notifications/${id}`);
    } catch (_err) {
      // fallback
    }
    const notifs = getStoredNotifications();
    const updated = notifs.filter(n => n.id !== id);
    saveStoredNotifications(updated);
    return updated;
  }
};

export default notificationService;
