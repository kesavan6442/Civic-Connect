import React from 'react';

export const QuickActions = ({ onNavigate }) => {
  return (
    <div className="card shadow-sm border-0 rounded-3 p-4 bg-white mb-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '0.92rem' }}>Citizen Quick Actions</h6>
          <small className="text-muted" style={{ fontSize: '0.74rem' }}>Direct shortcuts to report, track, and explore</small>
        </div>
      </div>

      <div className="row g-3">
        {/* Action 1: Submit Challenge */}
        <div className="col-md-4">
          <div 
            className="p-3 rounded-3 border h-100 d-flex flex-column justify-content-between cursor-pointer transition-hover bg-light bg-opacity-40"
            onClick={() => onNavigate('submit')}
            style={{ cursor: 'pointer' }}
          >
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="p-2 bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', backgroundColor: '#036D33' }}>
                  <i className="bi bi-plus-lg fw-bold" style={{ fontSize: '0.85rem' }}></i>
                </div>
                <strong className="text-dark small" style={{ fontSize: '0.84rem' }}>Submit a Challenge</strong>
              </div>
              <p className="text-muted small mb-3" style={{ fontSize: '0.76rem', lineHeight: '1.4' }}>
                Report potholes, water leaks, sanitation issues, or streetlights with live photo proof.
              </p>
            </div>
            <button type="button" className="btn btn-sm btn-outline-success fw-semibold w-100 rounded-pill" style={{ fontSize: '0.76rem' }}>
              Report Now →
            </button>
          </div>
        </div>

        {/* Action 2: Track My Submissions */}
        <div className="col-md-4">
          <div 
            className="p-3 rounded-3 border h-100 d-flex flex-column justify-content-between cursor-pointer transition-hover bg-light bg-opacity-40"
            onClick={() => onNavigate('my-problems')}
            style={{ cursor: 'pointer' }}
          >
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="p-2 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                  <i className="bi bi-card-checklist" style={{ fontSize: '0.85rem' }}></i>
                </div>
                <strong className="text-dark small" style={{ fontSize: '0.84rem' }}>My Submissions</strong>
              </div>
              <p className="text-muted small mb-3" style={{ fontSize: '0.76rem', lineHeight: '1.4' }}>
                Track live progress, AI classification scores, and municipal action timeline updates.
              </p>
            </div>
            <button type="button" className="btn btn-sm btn-outline-primary fw-semibold w-100 rounded-pill" style={{ fontSize: '0.76rem' }}>
              Track Submissions →
            </button>
          </div>
        </div>

        {/* Action 3: Explore Public Challenges */}
        <div className="col-md-4">
          <div 
            className="p-3 rounded-3 border h-100 d-flex flex-column justify-content-between cursor-pointer transition-hover bg-light bg-opacity-40"
            onClick={() => onNavigate('explore')}
            style={{ cursor: 'pointer' }}
          >
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="p-2 bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                  <i className="bi bi-compass" style={{ fontSize: '0.85rem' }}></i>
                </div>
                <strong className="text-dark small" style={{ fontSize: '0.84rem' }}>Explore Challenges</strong>
              </div>
              <p className="text-muted small mb-3" style={{ fontSize: '0.76rem', lineHeight: '1.4' }}>
                Discover civic issues reported across all 24 Jharkhand districts. Upvote to support.
              </p>
            </div>
            <button type="button" className="btn btn-sm btn-outline-secondary fw-semibold w-100 rounded-pill" style={{ fontSize: '0.76rem' }}>
              Explore Community →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default QuickActions;
