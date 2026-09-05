import React, { useState, useEffect } from 'react';
import './citizen.css';
import { Navbar } from '../../components/common/Navbar';
import { Sidebar } from '../../components/common/Sidebar';
import { Footer } from '../../components/common/Footer';
import { CitizenDashboard } from './CitizenDashboard';
import { SubmitProblem } from './SubmitProblem';
import { MyProblems } from './MyProblems';
import { ProblemDetails } from './ProblemDetails';
import { ExploreChallenges } from './ExploreChallenges';
import { Notifications } from './Notifications';
import { Profile } from './Profile';
import authService from '../../services/authService';
import notificationService from '../../services/notificationService';

export const CitizenPortal = ({ onBackToLanding }) => {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'submit' | 'my-problems' | 'details' | 'explore' | 'notifications' | 'profile'
  const [selectedProblemId, setSelectedProblemId] = useState('CC-2026-08912');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const [citizenUser, setCitizenUser] = useState({
    name: 'Sunil Soren',
    district: 'Ranchi',
    ward: 'Ward 12',
    email: 'sunil.soren@jharkhandmail.gov.in'
  });

  const loadUserData = async () => {
    try {
      const u = await authService.getCurrentUser();
      setCitizenUser(u);
    } catch (err) {
      console.error('Failed to load user:', err);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error('Failed to load unread count:', err);
    }
  };

  useEffect(() => {
    loadUserData();
    loadUnreadCount();
  }, [activeTab]);

  const handleNavigate = (tabId) => {
    setActiveTab(tabId);
    setShowMobileSidebar(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadUnreadCount();
  };

  const handleViewDetails = (problemId) => {
    setSelectedProblemId(problemId);
    setActiveTab('details');
    setShowMobileSidebar(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="citizen-portal-container min-vh-100 bg-light">
      
      {/* Top Gov Strip & Navbar (Fixed Top) */}
      <Navbar
        user={citizenUser}
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onBackToLanding={onBackToLanding}
        onToggleSidebar={() => setShowMobileSidebar(!showMobileSidebar)}
        unreadCount={unreadCount}
      />

      {/* Desktop Fixed Left Sidebar (Fixed on Left, Non-Scrollable) */}
      <aside 
        className="citizen-sidebar-fixed d-none d-lg-block" 
        style={{ 
          width: isSidebarCollapsed ? '72px' : '220px'
        }}
      >
        <Sidebar
          activeTab={activeTab}
          onNavigate={handleNavigate}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          unreadCount={unreadCount}
        />
      </aside>

      {/* Main Dynamic View Content (Offset for Fixed Header & Sidebar) */}
      <div className={`citizen-main-layout ${isSidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
        <main className="flex-grow-1 p-3 p-md-4" style={{ minWidth: 0, maxWidth: '1280px', width: '100%', margin: '0 auto' }}>
          {activeTab === 'dashboard' && (
            <CitizenDashboard
              user={citizenUser}
              onNavigate={handleNavigate}
              onViewDetails={handleViewDetails}
            />
          )}

          {activeTab === 'submit' && (
            <SubmitProblem
              onNavigate={handleNavigate}
              onViewDetails={handleViewDetails}
            />
          )}

          {activeTab === 'my-problems' && (
            <MyProblems
              onNavigate={handleNavigate}
              onViewDetails={handleViewDetails}
            />
          )}

          {activeTab === 'details' && (
            <ProblemDetails
              problemId={selectedProblemId}
              onNavigate={handleNavigate}
              onViewProblem={handleViewDetails}
            />
          )}

          {activeTab === 'explore' && (
            <ExploreChallenges
              onNavigate={handleNavigate}
              onViewDetails={handleViewDetails}
            />
          )}

          {activeTab === 'notifications' && (
            <Notifications
              onNavigate={handleNavigate}
              onViewDetails={handleViewDetails}
            />
          )}

          {activeTab === 'profile' && (
            <Profile
              onNavigate={handleNavigate}
            />
          )}
        </main>

        {/* Official Government Footer */}
        <Footer />
      </div>

      {/* Mobile Offcanvas Drawer Sidebar */}
      {showMobileSidebar && (
        <div 
          className="position-fixed inset-0 d-lg-none" 
          style={{ top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(18, 50, 75, 0.65)', zIndex: 1050 }}
          onClick={() => setShowMobileSidebar(false)}
        >
          <div 
            className="bg-white h-100 position-absolute start-0 top-0 bottom-0 shadow-lg d-flex flex-column"
            style={{ width: '280px', zIndex: 1051 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 d-flex align-items-center justify-content-between text-white flex-shrink-0" style={{ background: 'var(--gov-green)' }}>
              <div>
                <div className="fw-bold fs-6">Citizen Engagement</div>
                <small style={{ opacity: 0.85, fontSize: '0.70rem' }}>Jharkhand Societal Innovation Portal</small>
              </div>
              <button
                type="button"
                className="btn-icon-gov"
                onClick={() => setShowMobileSidebar(false)}
                aria-label="Close"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="flex-grow-1 overflow-auto">
              <Sidebar
                activeTab={activeTab}
                onNavigate={handleNavigate}
                isMobile={true}
                onCloseMobile={() => setShowMobileSidebar(false)}
                unreadCount={unreadCount}
              />
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Navigation for Mobile Devices */}
      <nav className="bottom-nav-gov" aria-label="Primary">
        <button 
          type="button"
          className={activeTab === 'dashboard' ? 'active' : ''} 
          onClick={() => handleNavigate('dashboard')}
        >
          <i className="bi bi-house-door"></i>
          <span>Home</span>
        </button>
        <button 
          type="button"
          className={activeTab === 'submit' ? 'active' : ''} 
          onClick={() => handleNavigate('submit')}
        >
          <i className="bi bi-plus-square"></i>
          <span>Submit</span>
        </button>
        <button 
          type="button"
          className={activeTab === 'explore' ? 'active' : ''} 
          onClick={() => handleNavigate('explore')}
        >
          <i className="bi bi-compass"></i>
          <span>Explore</span>
        </button>
        <button 
          type="button"
          className={activeTab === 'notifications' ? 'active' : ''} 
          onClick={() => handleNavigate('notifications')}
        >
          <div className="position-relative d-inline-block">
            <i className="bi bi-bell"></i>
            {unreadCount > 0 && (
              <span 
                className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
                style={{ width: '8px', height: '8px' }}
              ></span>
            )}
          </div>
          <span>Alerts</span>
        </button>
        <button 
          type="button"
          className={activeTab === 'profile' ? 'active' : ''} 
          onClick={() => handleNavigate('profile')}
        >
          <i className="bi bi-person"></i>
          <span>Profile</span>
        </button>
      </nav>

    </div>
  );
};

export default CitizenPortal;
