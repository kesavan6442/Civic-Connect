import React from 'react';

export const Sidebar = ({ 
  activeTab = 'dashboard', 
  onNavigate,
  isCollapsed = false,
  onToggleCollapse,
  isMobile = false,
  onCloseMobile,
  unreadCount = 0
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'bi-grid-1x2',
      activeIcon: 'bi-grid-1x2-fill',
      badge: null
    },
    {
      id: 'submit',
      label: 'Submit a Challenge',
      icon: 'bi-plus-circle',
      activeIcon: 'bi-plus-circle-fill',
      badge: 'New'
    },
    {
      id: 'my-problems',
      label: 'My Submissions',
      icon: 'bi-folder2',
      activeIcon: 'bi-folder2-open',
      badge: null
    },
    {
      id: 'explore',
      label: 'Explore Challenges',
      icon: 'bi-compass',
      activeIcon: 'bi-compass-fill',
      badge: null
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'bi-bell',
      activeIcon: 'bi-bell-fill',
      badge: unreadCount > 0 ? unreadCount : null,
      badgeColor: 'bg-danger'
    },
    {
      id: 'profile',
      label: 'Citizen Profile',
      icon: 'bi-person',
      activeIcon: 'bi-person-fill',
      badge: null
    }
  ];

  const handleItemClick = (id) => {
    onNavigate(id);
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside 
      className={`citizen-sidebar bg-white border-end d-flex flex-column h-100 transition-all ${
        isMobile ? 'p-3' : isCollapsed ? 'p-2' : 'p-3'
      }`}
      style={{
        width: isMobile ? '100%' : isCollapsed ? '72px' : '220px',
        transition: 'width 0.25s ease'
      }}
    >
      {/* Sidebar Header with Collapse Toggle */}
      {!isMobile && (
        <div className={`d-flex align-items-center mb-3 pb-2 border-bottom ${isCollapsed ? 'justify-content-center' : 'justify-content-between'}`}>
          {!isCollapsed && (
            <span className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.68rem', letterSpacing: '0.8px' }}>
              Citizen Menu
            </span>
          )}
          <button
            type="button"
            className="btn btn-sm btn-light p-1 text-muted border-0"
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{ width: '28px', height: '28px' }}
          >
            <i className={`bi ${isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'} fs-6`}></i>
          </button>
        </div>
      )}

      {/* Navigation List */}
      <nav className="nav nav-pills flex-column gap-1 mb-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id || (item.id === 'my-problems' && activeTab === 'details');
          return (
            <button
              key={item.id}
              type="button"
              className={`nav-link text-start d-flex align-items-center rounded-3 border-0 transition-all ${
                isCollapsed ? 'justify-content-center px-2 py-2.5 position-relative' : 'justify-content-between px-3 py-2'
              } ${
                isActive 
                  ? 'bg-success text-white shadow-sm fw-semibold' 
                  : 'text-secondary bg-transparent hover-bg-light'
              }`}
              onClick={() => handleItemClick(item.id)}
              title={isCollapsed ? item.label : undefined}
              style={{
                backgroundColor: isActive ? '#036D33' : 'transparent',
                cursor: 'pointer'
              }}
            >
              <div className="d-flex align-items-center gap-2.5">
                <i className={`bi ${isActive ? item.activeIcon : item.icon} fs-5 ${isActive ? 'text-white' : 'text-secondary'}`}></i>
                {!isCollapsed && (
                  <span style={{ fontSize: '0.86rem' }}>{item.label}</span>
                )}
              </div>

              {!isCollapsed && item.badge && (
                <span className={`badge rounded-pill ${
                  isActive 
                    ? 'bg-white text-success' 
                    : (item.badgeColor || 'bg-danger') + ' text-white'
                }`} style={{ fontSize: '0.65rem' }}>
                  {item.badge}
                </span>
              )}

              {isCollapsed && item.badge && (
                <span 
                  className="position-absolute top-1 end-1 p-1 bg-danger border border-light rounded-circle"
                  style={{ width: '8px', height: '8px' }}
                  title={`${item.badge} updates`}
                ></span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Verified Resident Info Pill */}
      {!isCollapsed && (
        <div className="p-2.5 mt-3 rounded-3 bg-light border text-start">
          <div className="d-flex align-items-center gap-1.5 mb-0.5">
            <i className="bi bi-shield-check text-success" style={{ fontSize: '0.85rem' }}></i>
            <span className="fw-semibold text-dark" style={{ fontSize: '0.74rem' }}>
              Jan Samvaad Verified
            </span>
          </div>
          <div className="text-muted" style={{ fontSize: '0.68rem' }}>
            Helpline: <strong>181</strong> (Toll-Free)
          </div>
        </div>
      )}

      {isCollapsed && (
        <div className="text-center mt-3 pt-2 border-top">
          <i className="bi bi-shield-check text-success fs-5" title="Jan Samvaad Verified Resident"></i>
        </div>
      )}

    </aside>
  );
};

export default Sidebar;
