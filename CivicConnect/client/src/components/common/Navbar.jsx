import React, { useState } from 'react';

export const Navbar = ({ 
  user = { name: 'Sunil Soren', district: 'Ranchi', ward: 'Ward 12' },
  activeTab,
  onNavigate,
  onBackToLanding,
  onToggleSidebar,
  unreadCount = 0
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(false);
    setShowProfileMenu(false);
    if (onBackToLanding) {
      onBackToLanding();
    }
  };

  return (
    <>
      {/* Top Fixed Header Container */}
      <header className="citizen-header-fixed">
        {/* Top Gov Strip */}
        <div className="gov-strip">
          <div className="container d-flex justify-content-between align-items-center">
            <span><i className="bi bi-globe2 me-1"></i> Government of Jharkhand • झारखंड सरकार</span>
            <span className="d-none d-sm-inline">
              CM Jan Samvaad 181 <span className="sep">|</span> Citizen Portal <span className="sep">|</span> A- A+
            </span>
          </div>
        </div>

        {/* Main Gov Navbar */}
        <nav className="navbar navbar-gov py-2">
          <div className="container flex-nowrap gap-2 position-relative">
          
          {/* Mobile Menu Button */}
          <button 
            className="btn-icon-gov d-lg-none" 
            type="button"
            onClick={onToggleSidebar} 
            aria-label="Open menu"
          >
            <i className="bi bi-list"></i>
          </button>

          {/* Brand Logo & Name */}
          <div 
            className="navbar-brand d-flex align-items-center gap-2 me-auto cursor-pointer"
            onClick={() => onNavigate('dashboard')}
            style={{ cursor: 'pointer' }}
          >
            <span className="emblem-gov">
              <i className="bi bi-buildings"></i>
            </span>
            <span>
              <span className="brand-title-gov d-block">Citizen Engagement</span>
              <span className="brand-sub-gov d-none d-sm-block">Jharkhand Societal Innovation Portal</span>
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <ul className="navbar-nav d-none d-lg-flex flex-row gap-3 me-3">
            <li className="nav-item">
              <button 
                type="button" 
                className={`nav-link text-white btn btn-link text-decoration-none px-2 py-1 ${activeTab === 'dashboard' ? 'fw-bold border-bottom border-2 border-white' : 'opacity-85'}`}
                onClick={() => onNavigate('dashboard')}
              >
                Home
              </button>
            </li>
            <li className="nav-item">
              <button 
                type="button" 
                className={`nav-link text-white btn btn-link text-decoration-none px-2 py-1 ${activeTab === 'submit' ? 'fw-bold border-bottom border-2 border-white' : 'opacity-85'}`}
                onClick={() => onNavigate('submit')}
              >
                Submit a Challenge
              </button>
            </li>
            <li className="nav-item">
              <button 
                type="button" 
                className={`nav-link text-white btn btn-link text-decoration-none px-2 py-1 ${activeTab === 'explore' ? 'fw-bold border-bottom border-2 border-white' : 'opacity-85'}`}
                onClick={() => onNavigate('explore')}
              >
                Explore
              </button>
            </li>
            <li className="nav-item">
              <button 
                type="button" 
                className={`nav-link text-white btn btn-link text-decoration-none px-2 py-1 ${(activeTab === 'my-problems' || activeTab === 'details') ? 'fw-bold border-bottom border-2 border-white' : 'opacity-85'}`}
                onClick={() => onNavigate('my-problems')}
              >
                My Submissions
              </button>
            </li>
          </ul>

          {/* Right Action Icons & Profile */}
          <div className="d-flex align-items-center gap-2">
            
            {/* Notification Bell */}
            <button
              type="button"
              className={`btn-icon-gov position-relative ${activeTab === 'notifications' ? 'bg-white bg-opacity-25' : ''}`}
              title="Notifications"
              onClick={() => onNavigate('notifications')}
            >
              <i className="bi bi-bell"></i>
              {unreadCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger shadow-sm" style={{ fontSize: '0.62rem' }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Profile Dropdown Toggle */}
            <div className="position-relative">
              <button
                type="button"
                className="btn p-0 border-0 bg-transparent text-white d-flex align-items-center gap-2 px-2.5 py-1 rounded-pill bg-white bg-opacity-15"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                aria-expanded={showProfileMenu}
                style={{ fontSize: '0.80rem' }}
              >
                <div 
                  className="rounded-circle bg-white text-success fw-bold d-flex align-items-center justify-content-center"
                  style={{ width: '24px', height: '24px', fontSize: '0.70rem' }}
                >
                  {user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'SS'}
                </div>
                <span className="d-none d-md-inline fw-semibold">{user.name}</span>
                <i className="bi bi-chevron-down small opacity-75"></i>
              </button>

              {/* Dropdown Menu Modal/Overlay */}
              {showProfileMenu && (
                <>
                  <div 
                    className="position-fixed inset-0" 
                    style={{ top: 0, left: 0, right: 0, bottom: 0, zIndex: 1025 }}
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <div 
                    className="position-absolute end-0 mt-2 bg-white rounded-3 shadow-lg border py-2 text-start"
                    style={{ width: '240px', zIndex: 1030 }}
                  >
                    {/* User Header */}
                    <div className="px-3 py-2 border-bottom">
                      <div className="fw-bold text-dark text-truncate" style={{ fontSize: '0.88rem' }}>{user.name}</div>
                      <div className="text-muted small" style={{ fontSize: '0.74rem' }}>
                        <i className="bi bi-patch-check-fill text-success me-1"></i>
                        {user.district || 'Ranchi'} ({user.ward || 'Ward 12'})
                      </div>
                    </div>

                    {/* Navigation Items */}
                    <button
                      type="button"
                      className="dropdown-item d-flex align-items-center gap-2 px-3 py-2 text-secondary hover-bg-light"
                      onClick={() => {
                        setShowProfileMenu(false);
                        onNavigate('profile');
                      }}
                      style={{ fontSize: '0.84rem' }}
                    >
                      <i className="bi bi-person text-success"></i>
                      <span>Citizen Profile</span>
                    </button>

                    <button
                      type="button"
                      className="dropdown-item d-flex align-items-center justify-content-between px-3 py-2 text-secondary hover-bg-light"
                      onClick={() => {
                        setShowProfileMenu(false);
                        onNavigate('notifications');
                      }}
                      style={{ fontSize: '0.84rem' }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-bell text-warning"></i>
                        <span>Notifications</span>
                      </div>
                      {unreadCount > 0 && (
                        <span className="badge rounded-pill bg-danger" style={{ fontSize: '0.62rem' }}>
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      className="dropdown-item d-flex align-items-center gap-2 px-3 py-2 text-secondary hover-bg-light"
                      onClick={() => {
                        setShowProfileMenu(false);
                        onNavigate('my-problems');
                      }}
                      style={{ fontSize: '0.84rem' }}
                    >
                      <i className="bi bi-folder2-open text-primary"></i>
                      <span>My Submissions</span>
                    </button>

                    <div className="dropdown-divider my-1"></div>

                    {/* Logout Option */}
                    <button
                      type="button"
                      className="dropdown-item d-flex align-items-center gap-2 px-3 py-2 text-danger hover-bg-light"
                      onClick={() => {
                        setShowProfileMenu(false);
                        setShowLogoutModal(true);
                      }}
                      style={{ fontSize: '0.84rem' }}
                    >
                      <i className="bi bi-box-arrow-right"></i>
                      <span>Exit Session / Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* All Portals Button */}
            <button
              type="button"
              className="btn btn-sm btn-outline-light ms-1 px-2.5 py-1 rounded-pill"
              onClick={onBackToLanding}
              title="Return to main 4-persona portal landing page"
              style={{ fontSize: '0.78rem' }}
            >
              <i className="bi bi-grid-fill me-1"></i>
              <span className="d-none d-sm-inline">All Portals</span>
            </button>

          </div>

        </div>
      </nav>

      {/* Saffron / White / Green Tri-Color Accent Line */}
      <div className="accent-rule"></div>
    </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(18, 50, 75, 0.65)', backdropFilter: 'blur(3px)', zIndex: 1070 }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-light py-3 px-4 border-bottom">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-box-arrow-right text-danger fs-5"></i>
                  <h5 className="modal-title fw-bold text-dark mb-0" style={{ fontSize: '1.05rem' }}>
                    Citizen Portal Session Exit
                  </h5>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowLogoutModal(false)}
                ></button>
              </div>
              <div className="modal-body p-4 text-center">
                <p className="text-secondary small mb-2">
                  Are you sure you want to end your current citizen session?
                </p>
                <p className="text-muted small mb-0">
                  Your submitted challenges and drafts will remain safely recorded in the Government of Jharkhand Grievance Database.
                </p>
              </div>
              <div className="modal-footer bg-light py-2.5 px-4 border-top d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm px-3"
                  onClick={() => setShowLogoutModal(false)}
                >
                  Continue Session
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm px-3"
                  onClick={handleLogout}
                >
                  Confirm Exit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
