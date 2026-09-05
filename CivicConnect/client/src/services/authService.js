/**
 * authService.js
 * Citizen Profile & Authentication Service
 * Communicates with Node.js Express Backend & MongoDB
 */

import api from './api';

const STORAGE_KEY_CITIZEN_USER = 'civicconnect_citizen_user_v2';

const DEFAULT_CITIZEN = {
  id: 'CIT-JH-88392',
  name: 'Sunil Soren',
  email: 'sunil.soren@jharkhandmail.gov.in',
  phone: '+91 98351 44210',
  district: 'Ranchi',
  ward: 'Ward 12',
  address: 'Kanke Road, Near Central University, Ranchi',
  pincode: '834006',
  aadhaarVerified: true,
  memberSince: 'January 2026',
  avatarInitials: 'SS',
  language: 'English',
  preferences: {
    smsNotifications: true,
    whatsappNotifications: true,
    emailDigest: false
  }
};

export const authService = {
  /**
   * Get currently authenticated citizen profile (API first)
   */
  async getCurrentUser() {
    try {
      const response = await api.get('/citizens/profile');
      if (response.data && response.data.data) {
        const u = response.data.data;
        localStorage.setItem(STORAGE_KEY_CITIZEN_USER, JSON.stringify(u));
        return u;
      }
    } catch (_err) {
      console.warn('API profile notice: using cached citizen profile.');
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY_CITIZEN_USER);
      if (saved) return JSON.parse(saved);
    } catch (err) {
      console.error('Error reading citizen user from storage:', err);
    }
    localStorage.setItem(STORAGE_KEY_CITIZEN_USER, JSON.stringify(DEFAULT_CITIZEN));
    return DEFAULT_CITIZEN;
  },

  /**
   * Update citizen profile
   */
  async updateProfile(updates) {
    try {
      const response = await api.put('/citizens/profile', updates);
      if (response.data && response.data.data) {
        const updated = response.data.data;
        localStorage.setItem(STORAGE_KEY_CITIZEN_USER, JSON.stringify(updated));
        return updated;
      }
    } catch (_err) {
      console.warn('API profile update notice: saving to local profile.');
    }

    const current = await this.getCurrentUser();
    const updated = {
      ...current,
      ...updates,
      avatarInitials: updates.name 
        ? updates.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        : current.avatarInitials
    };
    try {
      localStorage.setItem(STORAGE_KEY_CITIZEN_USER, JSON.stringify(updated));
    } catch (err) {
      console.error('Error saving updated citizen profile:', err);
    }
    return updated;
  },

  /**
   * Logout citizen session
   */
  logout() {
    localStorage.removeItem('civic_auth_token');
  }
};

export default authService;
