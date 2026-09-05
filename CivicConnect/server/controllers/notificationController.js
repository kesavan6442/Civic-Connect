import { notificationService } from '../services/notificationService.js';

export const notificationController = {
  async getNotifications(req, res) {
    try {
      const recipientId = req.user?.id || 'CIT-JH-88392';
      const { filter = 'all' } = req.query;
      const notifs = await notificationService.getNotifications(recipientId, filter);
      const unreadCount = await notificationService.getUnreadCount(recipientId);
      return res.json({
        success: true,
        unreadCount,
        data: notifs
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  async markAsRead(req, res) {
    try {
      const { id } = req.params;
      const updated = await notificationService.markAsRead(id);
      return res.json({ success: true, data: updated });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  async markAllAsRead(req, res) {
    try {
      const recipientId = req.user?.id || 'CIT-JH-88392';
      await notificationService.markAllAsRead(recipientId);
      return res.json({ success: true, message: 'All notifications marked as read' });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  async deleteNotification(req, res) {
    try {
      const { id } = req.params;
      await notificationService.deleteNotification(id);
      return res.json({ success: true, message: 'Notification deleted' });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  async getUnreadCount(req, res) {
    try {
      const recipientId = req.user?.id || 'CIT-JH-88392';
      const count = await notificationService.getUnreadCount(recipientId);
      return res.json({ success: true, unreadCount: count });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
};

export default notificationController;
