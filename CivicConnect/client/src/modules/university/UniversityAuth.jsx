import React, { useState } from 'react';
import './university.css';
import { JharkhandCrest, ChevronRight, CloseIcon } from '../../components/Icons';

export const EXPERTISE_OPTIONS = [
  'Healthcare',
  'Education',
  'Agriculture',
  'Water management',
  'Sanitation',
  'Environment',
  'Energy',
  'Rural Livelihoods',
  'Accessibility',
  'Urban Infrastructure',
  'Public service delivery'
];

export const CAPABILITIES_CONFIG = {
  'Technical Support': [
    'Software Development',
    'AI/ML Solutions',
    'Prototype Development',
    'Data Analysis',
    'Technical Consultation'
  ],
  'Research Support': [
    'Research & Development',
    'Field Studies',
    'Testing & Validation',
    'Laboratory Facilities'
  ],
  'Human Resources': [
    'Faculty Expertise',
    'Student Projects',
    'Student Volunteers',
    'Researchers'
  ],
  'Infrastructure': [
    'Laboratory',
    'Equipment',
    'Fabrication/Workshop Facilities',
    'Computing Resources'
  ],
  'Training & Community Support': [
    'Training',
    'Workshops',
    'Awareness Programs',
    'Community Engagement'
  ],
  'Implementation': [
    'Pilot Testing',
    'Field Implementation',
    'Monitoring & Evaluation'
  ]
};

export const UniversityAuth = ({ onLoginSuccess, onBackToLanding }) => {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  
  // Login State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Signup State
  const [formData, setFormData] = useState({
    universityName: '',
    city: '',
    state: 'Jharkhand',
    representativeName: '',
    designation: '',
    officialEmail: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    areasOfExpertise: [],
    capabilities: {
      'Technical Support': [],
      'Research Support': [],
      'Human Resources': [],
      'Infrastructure': [],
      'Training & Community Support': [],
      'Implementation': []
    }
  });

  const [formErrors, setFormErrors] = useState({});

  // Handlers for Area of Expertise
  const handleExpertiseToggle = (item) => {
    setFormData(prev => {
      const exists = prev.areasOfExpertise.includes(item);
      const updated = exists
        ? prev.areasOfExpertise.filter(e => e !== item)
        : [...prev.areasOfExpertise, item];
      return { ...prev, areasOfExpertise: updated };
    });
  };

  // Handlers for Capabilities
  const handleCapabilityToggle = (category, item) => {
    setFormData(prev => {
      const catList = prev.capabilities[category] || [];
      const exists = catList.includes(item);
      const updatedCat = exists
        ? catList.filter(i => i !== item)
        : [...catList, item];
      return {
        ...prev,
        capabilities: {
          ...prev.capabilities,
          [category]: updatedCat
        }
      };
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Login Submit Handler
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      alert('Please enter both your Username/Official Email and Password.');
      return;
    }
    // Success login mock
    onLoginSuccess({
      universityName: loginIdentifier.includes('@') ? 'Birsa Institute of Technology (BIT Sindri)' : loginIdentifier,
      representativeName: 'Dr. Alok Verma',
      designation: 'Dean of Research & Innovation',
      city: 'Ranchi',
      state: 'Jharkhand',
      officialEmail: loginIdentifier.includes('@') ? loginIdentifier : 'univ.admin@jharkhand.edu.in',
      areasOfExpertise: ['Water management', 'Agriculture', 'Urban Infrastructure'],
      capabilitiesCount: 14
    });
  };

  // Quick Demo Login for instant review
  const handleQuickDemoLogin = () => {
    onLoginSuccess({
      universityName: 'Ranchi University / Central University of Jharkhand',
      representativeName: 'Prof. Ramesh K. Soren',
      designation: 'Director of Civic Innovation Lab',
      city: 'Ranchi',
      state: 'Jharkhand',
      officialEmail: 'civic.lab@cuj.ac.in',
      areasOfExpertise: ['Environment', 'Water management', 'Healthcare', 'Agriculture'],
      capabilitiesCount: 18
    });
  };

  // Signup Submit Handler
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.universityName.trim()) errors.universityName = 'University name is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.state.trim()) errors.state = 'State is required';
    if (!formData.representativeName.trim()) errors.representativeName = 'Representative name is required';
    if (!formData.designation.trim()) errors.designation = 'Designation is required';
    if (!formData.officialEmail.trim()) errors.officialEmail = 'Official email is required';
    if (!formData.phoneNumber.trim()) errors.phoneNumber = 'Phone number is required';
    if (!formData.password) errors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      alert('Please fill in all required fields and ensure passwords match.');
      return;
    }

    // Success signup -> enters dashboard
    const totalCapabilitiesCount = Object.values(formData.capabilities).reduce(
      (acc, list) => acc + list.length,
      0
    );

    onLoginSuccess({
      ...formData,
      capabilitiesCount: totalCapabilitiesCount
    });
  };

  // Forgot Password Submit
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      alert('Please enter your registered official email address.');
      return;
    }
    setForgotSubmitted(true);
  };

  return (
    <div className="univ-auth-wrapper">
      <div className={`univ-auth-card ${authMode === 'signup' ? 'signup-mode' : ''}`}>
        {/* Card Header */}
        <div className="univ-auth-header">
          <div className="univ-auth-emblem">
            <JharkhandCrest size={18} />
            <span>Government of Jharkhand • University Gateway</span>
          </div>

          <h2 className="univ-auth-title">
            {authMode === 'login' && 'University Portal Login'}
            {authMode === 'signup' && 'University Registration'}
            {authMode === 'forgot' && 'Reset University Account Password'}
          </h2>

          <p className="univ-auth-subtitle">
            {authMode === 'login' && 'Enter your institutional credentials to manage problem statements & research projects.'}
            {authMode === 'signup' && 'Register your institution, academic areas of expertise, and technical capabilities.'}
            {authMode === 'forgot' && 'Enter your registered official email to receive a password recovery link.'}
          </p>

          <button
            type="button"
            onClick={onBackToLanding}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255,255,255,0.18)',
              border: 'none',
              color: '#FFFFFF',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="Return to Civic Connect Portals"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        {/* Card Body */}
        <div className="univ-auth-body">
          {/* =========================================================
              VIEW 1: LOGIN FORM
             ========================================================= */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit}>
              <div className="univ-form-group">
                <label className="univ-form-label">
                  Username or Official Email <span className="required">*</span>
                </label>
                <div className="univ-input-wrapper">
                  <input
                    type="text"
                    className="univ-form-input"
                    placeholder="e.g., bit.sindri@jharkhand.edu.in or bit_sindri"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="univ-form-group">
                <label className="univ-form-label">
                  Password <span className="required">*</span>
                </label>
                <div className="univ-input-wrapper">
                  <input
                    type="password"
                    className="univ-form-input"
                    placeholder="Enter your university portal password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="univ-auth-meta-row">
                <button
                  type="button"
                  className="univ-forgot-link"
                  onClick={() => {
                    setAuthMode('forgot');
                    setForgotSubmitted(false);
                  }}
                >
                  Forgot Password?
                </button>
              </div>

              <button type="submit" className="univ-btn-primary">
                <span>Login to University Portal</span>
                <ChevronRight size={18} />
              </button>

              {/* Demo fast-track login button */}
              <div style={{ marginTop: '14px', textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  style={{
                    background: '#E8F5EC',
                    border: '1.5px dashed #036D33',
                    color: '#024D24',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  ⚡ One-Click Demo Login (Ranchi University)
                </button>
              </div>

              <div className="univ-toggle-row">
                <span>New user?</span>
                <button
                  type="button"
                  className="univ-toggle-btn"
                  onClick={() => setAuthMode('signup')}
                >
                  Sign Up
                </button>
              </div>
            </form>
          )}

          {/* =========================================================
              VIEW 2: FORGOT PASSWORD
             ========================================================= */}
          {authMode === 'forgot' && (
            <div>
              {!forgotSubmitted ? (
                <form onSubmit={handleForgotSubmit}>
                  <div className="univ-form-group">
                    <label className="univ-form-label">
                      Registered Official Email Address <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      className="univ-form-input"
                      placeholder="e.g. registrar@university.edu.in"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="univ-btn-primary" style={{ marginTop: '12px' }}>
                    <span>Send Password Reset Instructions</span>
                  </button>

                  <div className="univ-toggle-row">
                    <span>Remembered your password?</span>
                    <button
                      type="button"
                      className="univ-toggle-btn"
                      onClick={() => setAuthMode('login')}
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div style={{ background: '#E8F5EC', color: '#036D33', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
                    <h4 style={{ fontWeight: 800, marginBottom: '6px' }}>Recovery Link Sent</h4>
                    <p style={{ fontSize: '0.88rem', margin: 0 }}>
                      If an account exists for <strong>{forgotEmail}</strong>, password reset instructions have been dispatched.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="univ-btn-primary"
                    onClick={() => {
                      setAuthMode('login');
                      setForgotSubmitted(false);
                    }}
                  >
                    <span>Return to Login</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* =========================================================
              VIEW 3: SIGN UP FORM
             ========================================================= */}
          {authMode === 'signup' && (
            <form onSubmit={handleSignupSubmit}>
              {/* Section A: University Basic Information */}
              <div className="signup-section-divider" style={{ marginTop: 0 }}>
                <div className="signup-section-heading">
                  <span>1. Institutional & Contact Details</span>
                </div>
                <span className="signup-badge-count">Basic Info</span>
              </div>

              <div className="univ-form-group">
                <label className="univ-form-label">
                  University / Institute Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="universityName"
                  className="univ-form-input"
                  placeholder="e.g. Birsa Agricultural University / Central University of Jharkhand"
                  value={formData.universityName}
                  onChange={handleInputChange}
                  required
                />
                {formErrors.universityName && <span style={{ color: '#C62828', fontSize: '0.78rem' }}>{formErrors.universityName}</span>}
              </div>

              <div className="univ-input-grid">
                <div className="univ-form-group">
                  <label className="univ-form-label">
                    City <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    className="univ-form-input"
                    placeholder="e.g. Ranchi, Jamshedpur, Dhanbad"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.city && <span style={{ color: '#C62828', fontSize: '0.78rem' }}>{formErrors.city}</span>}
                </div>

                <div className="univ-form-group">
                  <label className="univ-form-label">
                    State <span className="required">*</span>
                  </label>
                  <select
                    name="state"
                    className="univ-form-select"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Jharkhand">Jharkhand (झारखंड)</option>
                    <option value="Bihar">Bihar</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Other">Other State</option>
                  </select>
                </div>
              </div>

              <div className="univ-input-grid">
                <div className="univ-form-group">
                  <label className="univ-form-label">
                    Representative Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="representativeName"
                    className="univ-form-input"
                    placeholder="e.g. Dr. Rajesh Sharma"
                    value={formData.representativeName}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.representativeName && <span style={{ color: '#C62828', fontSize: '0.78rem' }}>{formErrors.representativeName}</span>}
                </div>

                <div className="univ-form-group">
                  <label className="univ-form-label">
                    Designation <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="designation"
                    className="univ-form-input"
                    placeholder="e.g. Dean R&D, HoD Civil Engineering, Registrar"
                    value={formData.designation}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.designation && <span style={{ color: '#C62828', fontSize: '0.78rem' }}>{formErrors.designation}</span>}
                </div>
              </div>

              <div className="univ-input-grid">
                <div className="univ-form-group">
                  <label className="univ-form-label">
                    Official Email ID <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    name="officialEmail"
                    className="univ-form-input"
                    placeholder="e.g. dean.rnd@university.ac.in"
                    value={formData.officialEmail}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.officialEmail && <span style={{ color: '#C62828', fontSize: '0.78rem' }}>{formErrors.officialEmail}</span>}
                </div>

                <div className="univ-form-group">
                  <label className="univ-form-label">
                    Phone Number <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    className="univ-form-input"
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.phoneNumber && <span style={{ color: '#C62828', fontSize: '0.78rem' }}>{formErrors.phoneNumber}</span>}
                </div>
              </div>

              <div className="univ-input-grid">
                <div className="univ-form-group">
                  <label className="univ-form-label">
                    Create Password <span className="required">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    className="univ-form-input"
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.password && <span style={{ color: '#C62828', fontSize: '0.78rem' }}>{formErrors.password}</span>}
                </div>

                <div className="univ-form-group">
                  <label className="univ-form-label">
                    Confirm Password <span className="required">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="univ-form-input"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.confirmPassword && <span style={{ color: '#C62828', fontSize: '0.78rem' }}>{formErrors.confirmPassword}</span>}
                </div>
              </div>

              {/* Section B: Area of Expertise */}
              <div className="signup-section-divider">
                <div className="signup-section-heading">
                  <span>2. Area of Expertise</span>
                </div>
                <span className="signup-badge-count">
                  {formData.areasOfExpertise.length} Selected
                </span>
              </div>

              <p style={{ fontSize: '0.84rem', color: '#4B5563', marginBottom: '14px' }}>
                Select all domains where your university faculty and departments can offer specialized research, solutions, or policy input:
              </p>

              <div className="expertise-grid">
                {EXPERTISE_OPTIONS.map((item) => {
                  const isChecked = formData.areasOfExpertise.includes(item);
                  return (
                    <label
                      key={item}
                      className={`checkbox-pill-card ${isChecked ? 'checked' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleExpertiseToggle(item)}
                      />
                      <span>{item}</span>
                    </label>
                  );
                })}
              </div>

              {/* Section C: University Capabilities */}
              <div className="signup-section-divider">
                <div className="signup-section-heading">
                  <span>3. University Capabilities</span>
                </div>
                <span className="signup-badge-count">
                  Categorized Support
                </span>
              </div>

              <p style={{ fontSize: '0.84rem', color: '#4B5563', marginBottom: '16px' }}>
                Specify available institutional resources across technical, research, infrastructure, and field execution domains:
              </p>

              <div className="capabilities-container">
                {Object.entries(CAPABILITIES_CONFIG).map(([category, items]) => {
                  const selectedCount = (formData.capabilities[category] || []).length;
                  return (
                    <div key={category} className="capability-category-box">
                      <div className="capability-category-header">
                        <span>{category}</span>
                        <span style={{ fontSize: '0.76rem', color: selectedCount > 0 ? '#036D33' : '#6B7280', fontWeight: 600 }}>
                          {selectedCount} / {items.length} selected
                        </span>
                      </div>

                      <div className="capability-items-grid">
                        {items.map((item) => {
                          const isChecked = (formData.capabilities[category] || []).includes(item);
                          return (
                            <label key={item} className="capability-check-item">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleCapabilityToggle(category, item)}
                              />
                              <span style={{ fontWeight: isChecked ? 600 : 400 }}>{item}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Submit & Navigation */}
              <button type="submit" className="univ-btn-primary" style={{ padding: '15px' }}>
                <span>Complete University Sign Up & Enter Portal</span>
                <ChevronRight size={18} />
              </button>

              <div className="univ-toggle-row">
                <span>Already registered?</span>
                <button
                  type="button"
                  className="univ-toggle-btn"
                  onClick={() => setAuthMode('login')}
                >
                  Login here
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
