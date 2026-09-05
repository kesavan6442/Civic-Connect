import React, { useState } from 'react';
import { Header } from './components/Header';
import { RoleCard } from './components/RoleCard';
import { RoleModal } from './components/RoleModal';
import { StatsBanner } from './components/StatsBanner';
import { Footer } from './components/Footer';
import { InfoIcon } from './components/Icons';
import { UniversityAuth } from './modules/university/UniversityAuth';
import { UniversityDashboard } from './modules/university/UniversityDashboard';
import { CitizenPortal } from './pages/citizen/CitizenPortal';

const ROLES_DATA = [
  {
    id: 'citizen',
    titleEn: 'Citizen',
    titleHi: 'नागरिक',
    badgeEn: 'Public & Grievance',
    badgeHi: 'जन सेवा व समाधान',
    descEn: 'File local grievances, track municipal work orders, participate in ward forums, and access state civic welfare schemes.',
    descHi: 'स्थानीय समस्याएं दर्ज करें, नगर निगम कार्यों को ट्रैक करें, नागरिक मंचों में भाग लें एवं सरकारी योजनाओं का लाभ उठाएं।',
    featuresEn: [
      'Jan Samvaad Grievance Filing',
      'Real-time Road & Water Work Status',
      'Community Discussion & Voting',
      'Direct Ward Councillor Connect'
    ],
    featuresHi: [
      'जन संवाद शिकायत पंजीकरण व ट्रैकिंग',
      'सड़क, पेयजल व स्वच्छता कार्य स्थिति',
      'सामुदायिक चर्चा व नागरिक सुझाव',
      'वार्ड पार्षद व अधिकारियों से सीधा संपर्क'
    ]
  },
  {
    id: 'university',
    titleEn: 'University',
    titleHi: 'विश्वविद्यालय',
    badgeEn: 'Academia & Research',
    badgeHi: 'अकादमिक व शोध संस्थान',
    descEn: 'Collaborate with state departments on policy research, student civic internships, innovation hackathons, and urban lab studies.',
    descHi: 'राज्य के विभागों के साथ नीतिगत शोध, छात्र इंटर्नशिप, इनोवेशन हैकाथॉन और शहरी प्रयोगशालाओं में सहयोग करें।',
    featuresEn: [
      'Jharkhand State Research Grants',
      'Civic Innovation & Youth Hackathons',
      'Student Governance Internships',
      'District Data & Policy Access'
    ],
    featuresHi: [
      'झारखंड राज्य अनुसंधान एवं विकास ग्रांट्स',
      'सिविक इनोवेशन व युवा हैकाथॉन',
      'सरकारी विभागों में छात्र इंटर्नशिप',
      'जिला स्तरीय नीतिगत डेटा सहभागिता'
    ]
  },
  {
    id: 'industry',
    titleEn: 'Industry',
    titleHi: 'उद्योग व व्यापार',
    badgeEn: 'Enterprise & PPP',
    badgeHi: 'कॉर्पोरेट व पीपीपी',
    descEn: 'Direct CSR investment into high-priority state projects, explore Public-Private Partnerships, and align workforce skills.',
    descHi: 'उच्च-प्राथमिकता वाली राज्य परियोजनाओं में सीएसआर निवेश करें, पीपीपी अवसरों की खोज करें और कौशल विकास में हाथ मिलाएं।',
    featuresEn: [
      'Verified District CSR Projects',
      'Public-Private Partnership (PPP) Bids',
      'Local Youth Skill Development',
      'Single-Window Compliance Desk'
    ],
    featuresHi: [
      'सत्यापित जिला स्तरीय सीएसआर परियोजनाएं',
      'पब्लिक-प्राइवेट पार्टनरशिप (PPP) टेंडर',
      'स्थानीय युवा कौशल विकास केंद्र',
      'सिंगल-विंडो औद्योगिक समाधान डेस्क'
    ]
  },
  {
    id: 'admin',
    titleEn: 'Admin',
    titleHi: 'प्रशासन',
    badgeEn: 'Official Command',
    badgeHi: 'प्रशासनिक नियंत्रण कक्ष',
    descEn: 'Departmental dashboard for District Collectors, Municipal Commissioners, and nodal officers to triage and resolve issues.',
    descHi: 'उपायुक्तों (DC), नगर आयुक्तों एवं नोडल अधिकारियों के लिए जन-समस्याओं के त्वरित समाधान हेतु एकीकृत डैशबोर्ड।',
    featuresEn: [
      'Inter-Departmental Issue Escalation',
      '24 Districts Real-time KPI Radar',
      'Automated SLA Breach Alerts',
      'Executive Review & Audit Logs'
    ],
    featuresHi: [
      'अंतर-विभागीय समस्या निवारण तंत्र',
      '24 जिलों का लाइव प्रदर्शन रडार',
      'समय सीमा (SLA) उल्लंघन ऑटो-अलर्ट',
      'उच्चस्तरीय प्रशासनिक समीक्षा व ऑडिट'
    ]
  }
];

export default function App() {
  const [lang, setLang] = useState('en');
  const [selectedRole, setSelectedRole] = useState(null);
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'citizen-portal' | 'university-auth' | 'university-dashboard'
  const [universityUser, setUniversityUser] = useState(null);

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'hi' : 'en');
  };

  const handleSelectRole = (roleData) => {
    if (roleData.id === 'university') {
      setCurrentView('university-auth');
      return;
    }
    if (roleData.id === 'citizen') {
      setCurrentView('citizen-portal');
      return;
    }
    setSelectedRole(roleData);
  };

  const handleEnterModule = (role) => {
    setSelectedRole(null);
    if (role.id === 'university') {
      setCurrentView('university-auth');
    } else if (role.id === 'citizen') {
      setCurrentView('citizen-portal');
    } else {
      alert(`Ready to enter ${role.titleEn} module! (Coming up in the next step)`);
    }
  };

  const handleFooterRoleSelect = (roleId) => {
    if (roleId === 'university') {
      setCurrentView('university-auth');
      return;
    }
    if (roleId === 'citizen') {
      setCurrentView('citizen-portal');
      return;
    }
    const found = ROLES_DATA.find(r => r.id === roleId);
    if (found) {
      setSelectedRole(found);
    }
  };

  const handleUniversityLoginSuccess = (userData) => {
    setUniversityUser(userData);
    setCurrentView('university-dashboard');
  };

  const handleUniversityLogout = () => {
    setUniversityUser(null);
    setCurrentView('university-auth');
  };

  const handleBackToLanding = () => {
    setSelectedRole(null);
    setCurrentView('landing');
  };

  const isHindi = lang === 'hi';

  // Render Citizen Portal
  if (currentView === 'citizen-portal') {
    return (
      <CitizenPortal onBackToLanding={handleBackToLanding} />
    );
  }

  // Render University Portal Views
  if (currentView === 'university-auth') {
    return (
      <div className="app-container">
        <Header lang={lang} onToggleLang={toggleLanguage} />
        <UniversityAuth
          onLoginSuccess={handleUniversityLoginSuccess}
          onBackToLanding={handleBackToLanding}
        />
        <Footer lang={lang} onSelectRole={handleFooterRoleSelect} />
      </div>
    );
  }

  if (currentView === 'university-dashboard') {
    return (
      <UniversityDashboard
        user={universityUser}
        onLogout={handleUniversityLogout}
        onBackToLanding={handleBackToLanding}
      />
    );
  }

  return (
    <div className="app-container">
      {/* Header with Government branding */}
      <Header lang={lang} onToggleLang={toggleLanguage} />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-pill">
          <span className="pulse-dot"></span>
          <span>
            {isHindi ? 'झारखंड सरकार डिजिटल पहल' : 'Government of Jharkhand Digital Initiative'}
          </span>
        </div>

        <h1 className="hero-heading">
          {isHindi ? (
            <>
              एक साझा मंच, <span>सशक्त झारखंड</span>
            </>
          ) : (
            <>
              One Unified Portal, <span>Empowered Jharkhand</span>
            </>
          )}
        </h1>

        <p className="hero-subheading">
          {isHindi 
            ? 'नागरिकों, शिक्षण संस्थानों, उद्योगों एवं सरकारी प्रशासन को पारदर्शी समाधान और समग्र विकास के लिए एक मंच पर लाना।'
            : 'Uniting Citizens, Universities, Industries, and Administration to accelerate civic problem resolution, research collaboration, and regional progress.'}
        </p>

        {/* Stakeholder Selection Prompt Banner */}
        <div className="select-prompt-banner">
          <div className="prompt-text">
            <div className="prompt-icon">
              <InfoIcon size={22} />
            </div>
            <div>
              <div className="prompt-title">
                {isHindi ? 'कृपया अपनी श्रेणी चुनें (Select Your Persona)' : 'Please Select Your Persona'}
              </div>
              <div className="prompt-desc">
                {isHindi 
                  ? 'अपनी प्रासंगिक सेवाओं और डैशबोर्ड तक पहुंचने के लिए नीचे दिए गए चार कार्डों में से एक चुनें:'
                  : 'Choose from the 4 cards below to proceed to your tailored workspace and services:'}
              </div>
            </div>
          </div>
          <div className="state-seal-stamp">
            {isHindi ? 'अधिकारिक चयन' : 'Official Portal'}
          </div>
        </div>
      </section>

      {/* 4 Cards Grid */}
      <main className="cards-container" id="personas">
        <div className="cards-grid">
          {ROLES_DATA.map((role) => (
            <RoleCard
              key={role.id}
              roleData={role}
              isSelected={selectedRole?.id === role.id}
              onSelect={handleSelectRole}
              lang={lang}
            />
          ))}
        </div>
      </main>

      {/* Stats Across 24 Districts */}
      <div style={{ padding: '0 24px' }}>
        <StatsBanner lang={lang} />
      </div>

      {/* Official Government Footer */}
      <Footer lang={lang} onSelectRole={handleFooterRoleSelect} />

      {/* Interactive Module Entrance Modal */}
      {selectedRole && (
        <RoleModal
          role={selectedRole}
          onClose={() => setSelectedRole(null)}
          onEnterModule={handleEnterModule}
          lang={lang}
        />
      )}
    </div>
  );
}
