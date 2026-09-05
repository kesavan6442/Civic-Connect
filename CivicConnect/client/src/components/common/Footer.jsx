import React from 'react';
import { JharkhandCrest } from '../Icons';

export const Footer = () => {
  return (
    <footer className="gov-footer-modern">
      {/* Top Helpline Quick Strip */}
      <div className="gov-footer-helpline-strip">
        <div className="container-fluid px-3 px-md-4">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 py-2">
            <div className="d-flex align-items-center gap-2 text-white-50 small">
              <i className="bi bi-shield-check text-warning"></i>
              <span className="text-white fw-semibold">Official State Grievance Redressal Network</span>
            </div>
            <div className="d-flex flex-wrap align-items-center gap-3 gap-md-4 small">
              <div className="helpline-badge">
                <i className="bi bi-telephone-fill text-warning me-1"></i>
                <span className="text-white-50">CM Jan Samvaad:</span>
                <strong className="text-white ms-1">181</strong> (Toll-Free)
              </div>
              <div className="helpline-badge">
                <i className="bi bi-telephone-fill text-danger me-1"></i>
                <span className="text-white-50">State Emergency:</span>
                <strong className="text-white ms-1">112</strong>
              </div>
              <div className="helpline-badge d-none d-sm-flex">
                <i className="bi bi-telephone-fill text-info me-1"></i>
                <span className="text-white-50">Child Helpline:</span>
                <strong className="text-white ms-1">1098</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="gov-footer-body">
        <div className="container-fluid px-3 px-md-4">
          <div className="row g-4 py-4">
            {/* Left Brand Col */}
            <div className="col-12 col-lg-5">
              <div className="d-flex align-items-center gap-3 mb-3">
                <JharkhandCrest size={42} />
                <div>
                  <h5 className="mb-0 fw-bold text-white tracking-tight" style={{ fontSize: '1.2rem', letterSpacing: '-0.3px' }}>
                    Civic<span style={{ color: '#FDBA74' }}>Connect</span>
                  </h5>
                  <div className="small fw-semibold text-white-50" style={{ fontSize: '0.78rem' }}>
                    Jharkhand Societal Innovation Portal
                  </div>
                </div>
              </div>
              <p className="gov-footer-desc mb-3 text-white-50" style={{ fontSize: '0.84rem', lineHeight: '1.6', maxWidth: '480px' }}>
                An integrated platform by the Department of Higher, Technical Education &amp; Skill Development, Government of Jharkhand, empowering citizens to submit local challenges and connecting universities for R&amp;D-driven civic solutions.
              </p>
              <div className="d-flex flex-wrap align-items-center gap-2">
                <span className="badge bg-success bg-opacity-25 text-white border border-success border-opacity-25 px-2.5 py-1 small rounded-pill">
                  <i className="bi bi-patch-check-fill text-warning me-1"></i>
                  DHTE&amp;SD Verified
                </span>
                <span className="badge bg-secondary bg-opacity-25 text-white-50 px-2.5 py-1 small rounded-pill">
                  ISO 27001 Security Compliant
                </span>
              </div>
            </div>

            {/* Quick Links Col */}
            <div className="col-6 col-sm-4 col-lg-2">
              <h6 className="gov-footer-col-title">Portal Modules</h6>
              <ul className="gov-footer-links">
                <li><a href="#dashboard"><i className="bi bi-chevron-right small me-1"></i>Citizen Dashboard</a></li>
                <li><a href="#submit"><i className="bi bi-chevron-right small me-1"></i>Submit Challenge</a></li>
                <li><a href="#explore"><i className="bi bi-chevron-right small me-1"></i>Explore Issues</a></li>
                <li><a href="#my-problems"><i className="bi bi-chevron-right small me-1"></i>My Submissions</a></li>
              </ul>
            </div>

            {/* External Links Col */}
            <div className="col-6 col-sm-4 col-lg-2">
              <h6 className="gov-footer-col-title">State Services</h6>
              <ul className="gov-footer-links">
                <li><a href="https://jharkhand.gov.in" target="_blank" rel="noreferrer"><i className="bi bi-box-arrow-up-right small me-1"></i>Jharkhand Portal</a></li>
                <li><a href="https://jharsewa.jharkhand.gov.in" target="_blank" rel="noreferrer"><i className="bi bi-box-arrow-up-right small me-1"></i>JharSewa Portal</a></li>
                <li><a href="https://cmjansamvaad.jharkhand.gov.in" target="_blank" rel="noreferrer"><i className="bi bi-box-arrow-up-right small me-1"></i>CM Jan Samvaad</a></li>
                <li><a href="https://dhte.jharkhand.gov.in" target="_blank" rel="noreferrer"><i className="bi bi-box-arrow-up-right small me-1"></i>DHTE&amp;SD Portal</a></li>
              </ul>
            </div>

            {/* Policy & Help Col */}
            <div className="col-12 col-sm-4 col-lg-3">
              <h6 className="gov-footer-col-title">Legal &amp; Policy</h6>
              <ul className="gov-footer-links">
                <li><a href="#privacy"><i className="bi bi-shield-lock small me-1"></i>Privacy Policy</a></li>
                <li><a href="#terms"><i className="bi bi-file-earmark-text small me-1"></i>Terms of Service</a></li>
                <li><a href="#hyperlink"><i className="bi bi-link-45deg small me-1"></i>Hyperlinking Policy</a></li>
                <li><a href="#accessibility"><i className="bi bi-universal-access small me-1"></i>Accessibility Statement</a></li>
                <li><a href="#security"><i className="bi bi-shield-shaded small me-1"></i>Security Guidelines</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sub-Footer */}
      <div className="gov-footer-bottom">
        <div className="container-fluid px-3 px-md-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 py-3">
            <div className="text-white-50 small text-center text-md-start">
              © {new Date().getFullYear()} Government of Jharkhand. All Rights Reserved. · Content Owned &amp; Maintained by Department of Higher, Technical Education &amp; Skill Development.
            </div>
            <div className="d-flex align-items-center gap-3 small text-white-50">
              <span>Hosted at <strong className="text-white">SDC Ranchi</strong></span>
              <span>•</span>
              <span>Version <strong className="text-white">2.4.0 (Live)</strong></span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
