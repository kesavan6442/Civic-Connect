import React, { useState } from 'react';
import { PhoneIcon, GlobeIcon, JharkhandCrest } from './Icons';

export const Header = ({ lang, onToggleLang }) => {
  return (
    <header className="main-header-wrapper">
      {/* Topmost Official Bar */}
      <div className="gov-topbar">
        <div className="gov-topbar-left">
          <span className="gov-emblem-badge">
            <JharkhandCrest size={18} />
            {lang === 'hi' ? 'झारखंड सरकार' : 'Government of Jharkhand'}
          </span>
          <span style={{ opacity: 0.7 }}>|</span>
          <span style={{ fontSize: '0.78rem', opacity: 0.9 }}>
            {lang === 'hi' ? 'सूचना प्रौद्योगिकी एवं ई-गवर्नेंस विभाग' : 'Dept. of IT & e-Governance'}
          </span>
        </div>
        <div className="gov-topbar-right">
          <div className="gov-helpline">
            <PhoneIcon size={13} />
            <span>{lang === 'hi' ? 'हेल्पलाइन:' : 'Toll Free:'} 181 / 112</span>
            <span className="helpline-tag">24x7</span>
          </div>
        </div>
      </div>

      {/* Main Branding Header */}
      <div className="main-header">
        <div className="header-inner">
          <div className="brand-section">
            <div className="brand-crest">
              <JharkhandCrest size={40} />
            </div>
            <div className="brand-text">
              <div className="brand-title">
                Civic<span className="brand-title-accent">Connect</span>
              </div>
              <div className="brand-subtitle">
                <span className="brand-state-badge">झारखंड</span> • {lang === 'hi' ? 'नागरिक एवं संस्थागत सहभागिता मंच' : 'Unified Civic & Institutional Portal'}
              </div>
            </div>
          </div>

          <div className="header-actions">
            <button 
              className="lang-switch-btn" 
              onClick={onToggleLang}
              title="Change Language"
            >
              <GlobeIcon size={16} />
              <span>{lang === 'hi' ? 'English' : 'हिन्दी'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
