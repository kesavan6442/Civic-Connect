import { Notification } from '../models/Notification.js';

export const notificationService = {
  /**
   * Create and store a notification in MongoDB
   */
  async createNotification({
    recipientId = 'CIT-JH-88392',
    role = 'citizen',
    title,
    message,
    problemId = null,
    category = 'Status Update',
    type = 'system',
    badgeText = 'Update',
    badgeColor = 'primary',
    icon = 'bi-bell'
  }) {
    try {
      const notifId = `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const notif = await Notification.create({
        id: notifId,
        recipientId,
        role,
        title,
        message,
        problemId,
        category,
        type,
        badgeText,
        badgeColor,
        icon,
        read: false,
        createdAt: new Date()
      });
      return notif;
    } catch (err) {
      console.error('Error creating notification in MongoDB:', err);
      return null;
    }
  },

  /**
   * Get notifications for user
   */
  async getNotifications(recipientId = 'CIT-JH-88392', filter = 'all') {
    try {
      const query = { recipientId };
      if (filter === 'unread') query.read = false;
      if (filter === 'read') query.read = true;
      return await Notification.find(query).sort({ createdAt: -1 }).lean();
    } catch (err) {
      console.error('Error fetching notifications:', err);
      return [];
    }
  },

  /**
   * Mark notification as read
   */
  async markAsRead(id) {
    try {
      return await Notification.findOneAndUpdate({ id }, { read: true }, { new: true });
    } catch (err) {
      console.error('Error marking notification as read:', err);
      return null;
    }
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(recipientId = 'CIT-JH-88392') {
    try {
      return await Notification.updateMany({ recipientId }, { read: true });
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      return null;
    }
  },

  /**
   * Delete notification
   */
  async deleteNotification(id) {
    try {
      return await Notification.findOneAndDelete({ id });
    } catch (err) {
      console.error('Error deleting notification:', err);
      return null;
    }
  },

  /**
   * Get unread count
   */
  async getUnreadCount(recipientId = 'CIT-JH-88392') {
    try {
      return await Notification.countDocuments({ recipientId, read: false });
    } catch (err) {
      console.error('Error counting unread notifications:', err);
      return 0;
    }
  }
};

export default notificationService;
