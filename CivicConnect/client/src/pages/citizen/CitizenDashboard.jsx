import React, { useState, useEffect } from 'react';
import { problemService } from '../../services/problemService';
import { ProblemCard } from '../../components/problem/ProblemCard';

export const CitizenDashboard = ({ 
  user = { name: 'Sunil Soren', district: 'Ranchi', ward: 'Ward 12' },
  onNavigate,
  onViewDetails
}) => {
  const [recentProblems, setRecentProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const problemsData = await problemService.getMyProblems();
      setRecentProblems(problemsData);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpvote = async (id) => {
    await problemService.upvoteProblem(id);
    loadData();
  };

  return (
    <div className="citizen-dashboard">
      
      {/* 1. Hero Section */}
      <div className="hero-gov mb-4 mt-n3 rounded-4 px-3 px-md-4 py-4 text-white shadow-sm">
        <div className="container px-0">
          <span className="chip-gov mb-2 d-inline-flex" style={{ background: 'rgba(255,255,255,0.18)', borderColor: 'rgba(255,255,255,0.35)', color: '#fff' }}>
            <i className="bi bi-patch-check me-1"></i>Official Civic Engagement Platform
          </span>
          <h1 className="h4 fw-bold mb-2">Namaskar, {user.name}</h1>
          <p className="lead mb-0">
            Report the problems you see around you. Submit local challenges, explore challenges raised by other citizens, and track how government departments and partner universities are solving them.
          </p>
        </div>
      </div>

      {/* 2. Three Main Action Tiles */}
      <div className="row g-3 mb-4">
        
        <div className="col-12 col-md-4">
          <button 
            type="button" 
            className="action-tile-gov"
            onClick={() => onNavigate('submit')}
          >
            <span className="tile-ico-gov">
              <i className="bi bi-plus-lg"></i>
            </span>
            <span>
              <span className="d-block fw-bold text-dark" style={{ fontSize: '0.95rem' }}>Submit a Challenge</span>
              <span className="text-muted small" style={{ fontSize: '0.78rem' }}>Raise a local problem with photo & location</span>
            </span>
          </button>
        </div>

        <div className="col-12 col-md-4">
          <button 
            type="button" 
            className="action-tile-gov"
            onClick={() => onNavigate('explore')}
          >
            <span className="tile-ico-gov saffron">
              <i className="bi bi-compass"></i>
            </span>
            <span>
              <span className="d-block fw-bold text-dark" style={{ fontSize: '0.95rem' }}>Explore Challenges</span>
              <span className="text-muted small" style={{ fontSize: '0.78rem' }}>See public challenges across districts</span>
            </span>
          </button>
        </div>

        <div className="col-12 col-md-4">
          <button 
            type="button" 
            className="action-tile-gov"
            onClick={() => onNavigate('my-problems')}
          >
            <span className="tile-ico-gov navy">
              <i className="bi bi-list-check"></i>
            </span>
            <span>
              <span className="d-block fw-bold text-dark" style={{ fontSize: '0.95rem' }}>My Submissions</span>
              <span className="text-muted small" style={{ fontSize: '0.78rem' }}>Track status of what you reported</span>
            </span>
          </button>
        </div>

      </div>

      {/* 3. Overall State Stats Card */}
      <div className="card-gov p-3 p-md-4 mb-4">
        <div className="row g-3 text-center">
          <div className="col-4">
            <div className="h4 mb-0 fw-bold" style={{ color: 'var(--gov-green)' }}>4,286</div>
            <div className="text-muted small" style={{ fontSize: '0.76rem' }}>Challenges Raised</div>
          </div>
          <div className="col-4">
            <div className="h4 mb-0 fw-bold" style={{ color: 'var(--gov-saffron)' }}>1,142</div>
            <div className="text-muted small" style={{ fontSize: '0.76rem' }}>In Progress</div>
          </div>
          <div className="col-4">
            <div className="h4 mb-0 fw-bold" style={{ color: 'var(--gov-navy)' }}>2,318</div>
            <div className="text-muted small" style={{ fontSize: '0.76rem' }}>Resolved</div>
          </div>
        </div>
      </div>

      {/* 4. Recent Submissions Feed */}
      <div className="card-gov p-3 p-md-4 mb-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '0.98rem' }}>
              <i className="bi bi-clock-history me-1.5" style={{ color: 'var(--gov-green)' }}></i>
              My Recent Submissions
            </h6>
            <small className="text-muted" style={{ fontSize: '0.74rem' }}>Live updates on your reported challenges</small>
          </div>
          <button
            type="button"
            className="btn btn-gov-outline btn-sm py-1 px-3"
            onClick={() => onNavigate('my-problems')}
            style={{ fontSize: '0.78rem' }}
          >
            View All →
          </button>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-success mx-auto" role="status"></div>
            <p className="text-muted small mt-2 mb-0">Loading submissions...</p>
          </div>
        ) : recentProblems.length === 0 ? (
          <div className="text-center py-4 bg-light rounded-3">
            <i className="bi bi-inbox fs-2 text-muted"></i>
            <h6 className="fw-semibold text-dark mt-2 mb-1" style={{ fontSize: '0.85rem' }}>No Submissions Yet</h6>
            <p className="text-muted small mb-2">You haven't reported any challenges yet.</p>
            <button
              type="button"
              className="btn btn-gov btn-sm"
              onClick={() => onNavigate('submit')}
            >
              Submit First Challenge
            </button>
          </div>
        ) : (
          <div className="row g-3">
            {recentProblems.slice(0, 3).map((problem) => (
              <div key={problem.id} className="col-12 col-md-4">
                <ProblemCard
                  problem={problem}
                  onViewDetails={onViewDetails}
                  onUpvote={handleUpvote}
                />
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default CitizenDashboard;
