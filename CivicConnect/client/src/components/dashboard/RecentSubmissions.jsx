import React from 'react';
import { ProblemCard } from '../problem/ProblemCard';

export const RecentSubmissions = ({ problems = [], onViewDetails, onNavigate, onUpvote }) => {
  return (
    <div className="card shadow-sm border-0 rounded-3 p-4 bg-white">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '0.92rem' }}>Recent Grievances & Challenges</h6>
          <small className="text-muted" style={{ fontSize: '0.74rem' }}>Latest updates on your reported challenges</small>
        </div>
        <button
          type="button"
          className="btn btn-outline-success btn-sm py-1 px-3 rounded-pill fw-semibold"
          onClick={() => onNavigate('my-problems')}
          style={{ fontSize: '0.75rem' }}
        >
          View All Submissions →
        </button>
      </div>

      {problems.length === 0 ? (
        <div className="text-center py-4 bg-light rounded-3">
          <i className="bi bi-inbox fs-2 text-muted"></i>
          <h6 className="fw-semibold text-dark mt-2 mb-1" style={{ fontSize: '0.85rem' }}>No Submissions Yet</h6>
          <p className="text-muted small mb-2" style={{ fontSize: '0.75rem' }}>You haven't reported any civic challenges yet.</p>
          <button
            type="button"
            className="btn btn-success btn-sm rounded-pill px-3 py-1"
            onClick={() => onNavigate('submit')}
            style={{ backgroundColor: '#036D33', fontSize: '0.78rem' }}
          >
            Submit First Challenge
          </button>
        </div>
      ) : (
        <div className="row g-3.5">
          {problems.slice(0, 3).map((problem) => (
            <div key={problem.id} className="col-md-4">
              <ProblemCard
                problem={problem}
                onViewDetails={onViewDetails}
                onUpvote={onUpvote}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentSubmissions;
