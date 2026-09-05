import React, { useState, useEffect } from 'react';
import authService from '../../services/authService';
import problemService from '../../services/problemService';

const JHARKHAND_DISTRICTS = [
  'Bokaro', 'Chatra', 'Deoghar', 'Dhanbad', 'Dumka', 'East Singhbhum (Jamshedpur)',
  'Garhwa', 'Giridih', 'Godda', 'Gumla', 'Hazaribagh', 'Jamtara', 'Khunti',
  'Koderma', 'Latehar', 'Lohardaga', 'Pakur', 'Palamu', 'Ramgarh', 'Ranchi',
  'Sahebganj', 'Saraikela-Kharsawan', 'Simdega', 'West Singhbhum (Chaibasa)'
];

export const Profile = ({ onNavigate }) => {
  const [user, setUser] = useState({
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
    smsNotifications: true,
    whatsappNotifications: true,
    emailDigest: false
  });

  const [stats, setStats] = useState({
    totalSubmissions: 3,
    submitted: 1,
    underReview: 1,
    inProgress: 1,
    resolved: 0
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const u = await authService.getCurrentUser();
        setUser(u);
        setFormData(u);
      } catch (err) {
        console.error('Failed to load user:', err);
      }
    };

    const loadStats = async () => {
      try {
        const s = await problemService.getDashboardStats();
        setStats(s);
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      }
    };

    loadUserData();
    loadStats();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await authService.updateProfile(formData);
      setUser(updated);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...user });
    setIsEditing(false);
  };

  return (
    <div className="citizen-profile-page">
      {/* Top Banner & Profile Header */}
      <div className="card-gov p-4 mb-4 position-relative overflow-hidden">
        <div 
          className="position-absolute top-0 start-0 end-0" 
          style={{ height: '6px', background: 'linear-gradient(90deg, var(--gov-saffron) 0%, #ffffff 50%, var(--gov-green) 100%)' }}
        ></div>

        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 pt-2">
          <div className="d-flex align-items-center gap-3">
            {/* Avatar */}
            <div 
              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm flex-shrink-0"
              style={{
                width: '72px',
                height: '72px',
                fontSize: '1.6rem',
                backgroundColor: 'var(--gov-green)',
                border: '3px solid #e8f3ec'
              }}
            >
              {user.avatarInitials || 'SS'}
            </div>

            {/* Basic Info */}
            <div>
              <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                <h2 className="h4 fw-bold mb-0" style={{ color: 'var(--gov-navy)' }}>
                  {user.name}
                </h2>
                {user.aadhaarVerified && (
                  <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle d-inline-flex align-items-center gap-1">
                    <i className="bi bi-patch-check-fill text-success"></i>
                    Aadhaar Verified Resident
                  </span>
                )}
              </div>
              <p className="text-muted small mb-1">
                <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                {user.district}, {user.ward} • <span className="text-secondary">Resident ID: <strong>{user.id}</strong></span>
              </p>
              <div className="text-muted" style={{ fontSize: '0.74rem' }}>
                <i className="bi bi-calendar-check me-1"></i>
                Active Citizen Contributor since {user.memberSince || 'January 2026'}
              </div>
            </div>
          </div>

          {/* Edit Profile Action */}
          <div>
            {!isEditing ? (
              <button
                type="button"
                className="btn btn-gov btn-sm px-3 d-flex align-items-center gap-1.5"
                onClick={() => setIsEditing(true)}
              >
                <i className="bi bi-pencil-square"></i>
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm px-3"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-gov btn-sm px-3 d-flex align-items-center gap-1"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-lg"></i>
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Success Alert */}
        {saveSuccess && (
          <div className="alert alert-success alert-dismissible fade show mt-3 mb-0 py-2 small" role="alert">
            <i className="bi bi-check-circle-fill me-2"></i>
            Profile details updated successfully and synced with Citizen Directory.
          </div>
        )}
      </div>

      {/* Citizen Engagement Score & Stats Strip */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card-gov p-3 text-center h-100">
            <span className="text-muted small text-uppercase fw-semibold" style={{ fontSize: '0.68rem' }}>
              Challenges Reported
            </span>
            <div className="h3 fw-bold text-dark mt-1 mb-0">{stats.totalSubmissions || 0}</div>
            <span className="text-success small" style={{ fontSize: '0.70rem' }}>
              <i className="bi bi-award-fill me-1"></i>Civic Champion
            </span>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card-gov p-3 text-center h-100">
            <span className="text-muted small text-uppercase fw-semibold" style={{ fontSize: '0.68rem' }}>
              Under AI Triage
            </span>
            <div className="h3 fw-bold text-primary mt-1 mb-0">{stats.underReview || 0}</div>
            <span className="text-muted small" style={{ fontSize: '0.70rem' }}>Verified by system</span>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card-gov p-3 text-center h-100">
            <span className="text-muted small text-uppercase fw-semibold" style={{ fontSize: '0.68rem' }}>
              Work Deployed
            </span>
            <div className="h3 fw-bold text-warning mt-1 mb-0">{stats.inProgress || 0}</div>
            <span className="text-muted small" style={{ fontSize: '0.70rem' }}>Active municipal field teams</span>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card-gov p-3 text-center h-100">
            <span className="text-muted small text-uppercase fw-semibold" style={{ fontSize: '0.68rem' }}>
              Resolved Issues
            </span>
            <div className="h3 fw-bold text-success mt-1 mb-0">{stats.resolved || 0}</div>
            <span className="text-muted small" style={{ fontSize: '0.70rem' }}>Verified resolutions</span>
          </div>
        </div>
      </div>

      {/* Profile Details Form */}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card-gov p-4">
            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
              <div>
                <h3 className="h5 fw-bold mb-0" style={{ color: 'var(--gov-navy)' }}>
                  Personal & Residential Information
                </h3>
                <span className="text-muted small">Registered identity in Government Citizen Portal</span>
              </div>
              <span className="badge bg-light text-secondary border">
                <i className="bi bi-lock-fill me-1"></i>256-bit Encrypted
              </span>
            </div>

            <form onSubmit={handleSave}>
              <div className="row g-3">
                {/* Full Name */}
                <div className="col-md-6">
                  <label className="form-label-gov">Full Name (as per Aadhaar)</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleChange}
                      required
                    />
                  ) : (
                    <div className="p-2 rounded bg-light border text-dark fw-medium small">
                      {user.name}
                    </div>
                  )}
                </div>

                {/* Email Address */}
                <div className="col-md-6">
                  <label className="form-label-gov">Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                      required
                    />
                  ) : (
                    <div className="p-2 rounded bg-light border text-dark fw-medium small">
                      {user.email}
                    </div>
                  )}
                </div>

                {/* Phone Number */}
                <div className="col-md-6">
                  <label className="form-label-gov">Mobile Number (OTP Registered)</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleChange}
                      required
                    />
                  ) : (
                    <div className="p-2 rounded bg-light border text-dark fw-medium small d-flex align-items-center justify-content-between">
                      <span>{user.phone}</span>
                      <span className="badge bg-success-subtle text-success border border-success-subtle" style={{ fontSize: '0.65rem' }}>
                        OTP Verified
                      </span>
                    </div>
                  )}
                </div>

                {/* Preferred Language */}
                <div className="col-md-6">
                  <label className="form-label-gov">Preferred Communication Language</label>
                  {isEditing ? (
                    <select
                      className="form-select"
                      name="language"
                      value={formData.language || 'English'}
                      onChange={handleChange}
                    >
                      <option value="English">English</option>
                      <option value="Hindi">हिंदी (Hindi)</option>
                      <option value="Santhali">ᱥᱟᱱᱛᱟᱲᱤ (Santhali)</option>
                      <option value="Ho">Ho (ᱦᱳ)</option>
                      <option value="Mundari">Mundari (ᱢᱩᱱᱰᱟᱨᱤ)</option>
                    </select>
                  ) : (
                    <div className="p-2 rounded bg-light border text-dark fw-medium small">
                      {user.language || 'English'}
                    </div>
                  )}
                </div>

                {/* District */}
                <div className="col-md-6">
                  <label className="form-label-gov">Home District</label>
                  {isEditing ? (
                    <select
                      className="form-select"
                      name="district"
                      value={formData.district || 'Ranchi'}
                      onChange={handleChange}
                      required
                    >
                      {JHARKHAND_DISTRICTS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="p-2 rounded bg-light border text-dark fw-medium small">
                      {user.district}
                    </div>
                  )}
                </div>

                {/* Ward / Panchayat */}
                <div className="col-md-6">
                  <label className="form-label-gov">Ward / Gram Panchayat / Block</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-control"
                      name="ward"
                      value={formData.ward || ''}
                      onChange={handleChange}
                      placeholder="e.g. Ward 12, Kanke Block"
                      required
                    />
                  ) : (
                    <div className="p-2 rounded bg-light border text-dark fw-medium small">
                      {user.ward}
                    </div>
                  )}
                </div>

                {/* Address */}
                <div className="col-md-8">
                  <label className="form-label-gov">Residential Address</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={formData.address || ''}
                      onChange={handleChange}
                      placeholder="Street, Landmark, Locality"
                    />
                  ) : (
                    <div className="p-2 rounded bg-light border text-dark fw-medium small">
                      {user.address}
                    </div>
                  )}
                </div>

                {/* PIN Code */}
                <div className="col-md-4">
                  <label className="form-label-gov">PIN Code</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-control"
                      name="pincode"
                      value={formData.pincode || ''}
                      onChange={handleChange}
                      maxLength={6}
                    />
                  ) : (
                    <div className="p-2 rounded bg-light border text-dark fw-medium small">
                      {user.pincode}
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm px-3"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-gov btn-sm px-4"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Right Sidebar: Notification Preferences & Help */}
        <div className="col-lg-4 d-flex flex-column gap-3">
          {/* Notification Preferences */}
          <div className="card-gov p-3.5">
            <h4 className="h6 fw-bold mb-3" style={{ color: 'var(--gov-navy)' }}>
              <i className="bi bi-bell-fill text-warning me-1.5"></i>
              Alert Preferences
            </h4>

            <div className="d-flex flex-column gap-3">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="fw-semibold small">SMS Status Alerts</div>
                  <div className="text-muted" style={{ fontSize: '0.72rem' }}>Instant updates when work orders deploy</div>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="smsNotifications"
                    checked={formData.smsNotifications}
                    onChange={handleChange}
                    disabled={!isEditing}
                    style={{ cursor: isEditing ? 'pointer' : 'default' }}
                  />
                </div>
              </div>

              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="fw-semibold small">WhatsApp Updates</div>
                  <div className="text-muted" style={{ fontSize: '0.72rem' }}>Receive photos upon challenge resolution</div>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="whatsappNotifications"
                    checked={formData.whatsappNotifications}
                    onChange={handleChange}
                    disabled={!isEditing}
                    style={{ cursor: isEditing ? 'pointer' : 'default' }}
                  />
                </div>
              </div>

              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="fw-semibold small">Ward Newsletter</div>
                  <div className="text-muted" style={{ fontSize: '0.72rem' }}>Monthly societal innovation digest</div>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="emailDigest"
                    checked={formData.emailDigest}
                    onChange={handleChange}
                    disabled={!isEditing}
                    style={{ cursor: isEditing ? 'pointer' : 'default' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Box */}
          <div className="card-gov p-3.5" style={{ backgroundColor: 'var(--gov-green-soft)', borderColor: '#c7e3d2' }}>
            <h5 className="fw-bold mb-1" style={{ color: 'var(--gov-green-dark)', fontSize: '0.88rem' }}>
              <i className="bi bi-lightbulb-fill text-warning me-1.5"></i>
              Have a New Local Challenge?
            </h5>
            <p className="text-secondary small mb-3" style={{ fontSize: '0.78rem' }}>
              Report civic issues in your neighborhood with photo evidence, GPS location, and automatic AI duplicate check.
            </p>
            <button
              type="button"
              className="btn btn-gov btn-sm w-100"
              onClick={() => onNavigate('submit')}
            >
              <i className="bi bi-plus-circle me-1.5"></i>
              Submit a Challenge Now
            </button>
          </div>

          {/* Jan Samvaad Helpline Info */}
          <div className="card-gov p-3 text-center">
            <div className="text-muted small mb-1" style={{ fontSize: '0.74rem' }}>
              Jharkhand Chief Minister Grievance Cell
            </div>
            <div className="fw-bold text-dark fs-5 mb-1">
              <i className="bi bi-telephone-inbound-fill text-success me-1.5"></i>
              181 <span className="badge bg-secondary-subtle text-secondary fs-6 fw-normal">Toll Free</span>
            </div>
            <div className="text-muted" style={{ fontSize: '0.70rem' }}>
              Available 24x7 for citizen assistance across all 24 districts.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
