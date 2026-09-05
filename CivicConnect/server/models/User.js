import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: '+91 98351 44210' },
  role: { type: String, enum: ['citizen', 'university', 'industry', 'admin'], default: 'citizen' },
  district: { type: String, default: 'Ranchi' },
  ward: { type: String, default: 'Ward 12' },
  address: { type: String, default: 'Kanke Road, Near Central University, Ranchi' },
  pincode: { type: String, default: '834006' },
  language: { type: String, default: 'English' },
  aadhaarVerified: { type: Boolean, default: true },
  memberSince: { type: String, default: 'January 2026' },
  avatarInitials: { type: String, default: 'SS' },
  preferences: {
    smsNotifications: { type: Boolean, default: true },
    whatsappNotifications: { type: Boolean, default: true },
    emailDigest: { type: Boolean, default: false }
  },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
