import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true },
  recipientId: { type: String, default: 'CIT-JH-88392', index: true },
  role: { type: String, default: 'citizen' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  problemId: { type: String, default: null, index: true },
  category: { type: String, default: 'Status Update' },
  type: {
    type: String,
    enum: ['in_progress', 'assigned', 'resolved', 'ai_alert', 'system', 'submission'],
    default: 'system'
  },
  read: { type: Boolean, default: false, index: true },
  badgeText: { type: String, default: 'Update' },
  badgeColor: { type: String, default: 'primary' },
  icon: { type: String, default: 'bi-bell' },
  createdAt: { type: Date, default: Date.now, index: true }
});

export const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
export default Notification;
