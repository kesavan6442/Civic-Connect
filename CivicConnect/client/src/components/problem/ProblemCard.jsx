import React from 'react';
import { ProblemStatus } from './ProblemStatus';
import { getLocationLabel } from '../../utils/location';

export const ProblemCard = ({ problem, onViewDetails, onUpvote }) => {
  if (!problem) return null;

  const {
    id,
    title,
    category,
    location,
    locationName,
    district,
    image,
    createdAt,
    status = 'Submitted',
    upvotes = 0,
    aiAnalysis
  } = problem;

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    : 'Recently';

  const defaultImage = 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=600&q=60';
  const locationLabel = getLocationLabel(location, locationName);

  return (
    <article className="card-gov h-100 overflow-hidden d-flex flex-column transition-hover">
      
      {/* Thumbnail Image */}
      <div className="position-relative" style={{ height: '140px', backgroundColor: '#eef2f5' }}>
        <img
          src={image || defaultImage}
          alt={title}
          className="w-100 h-100 object-fit-cover"
          onError={(e) => {
            e.target.src = defaultImage;
          }}
          style={{ objectFit: 'cover' }}
        />

        {/* Priority Badge */}
        {aiAnalysis?.priority === 'HIGH' && (
          <div className="position-absolute top-0 end-0 m-2">
            <span className="badge bg-danger shadow-sm px-2 py-0.5" style={{ fontSize: '0.65rem' }}>
              <i className="bi bi-lightning-charge-fill me-0.5"></i> High Priority
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-3 d-flex flex-column flex-grow-1">
        
        {/* Title & Status Badge */}
        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
          <h2 className="h6 mb-0 fw-bold text-dark text-truncate-2" style={{ minHeight: '38px', lineHeight: '1.3', fontSize: '0.92rem' }}>
            {title}
          </h2>
          <div className="flex-shrink-0">
            <ProblemStatus status={status} compact={true} />
          </div>
        </div>

        {/* Location */}
        <div className="text-muted small mb-1.5 text-truncate" style={{ fontSize: '0.78rem' }}>
          <i className="bi bi-geo-alt me-1 text-danger"></i>
          {locationLabel} {district ? `(${district})` : ''}
        </div>

        {/* Date & ID */}
        <div className="text-muted small mb-2" style={{ fontSize: '0.72rem' }}>
          <i className="bi bi-calendar3 me-1"></i>Submitted on {formattedDate}
          <span className="ms-2 font-monospace fw-semibold text-secondary">
            <i className="bi bi-hash"></i>{id}
          </span>
        </div>

        {/* Category Chip */}
        <div className="mb-3">
          <span className="chip-gov">
            <i className="bi bi-tag me-1 text-success"></i>{category}
          </span>
        </div>

        {/* Actions */}
        <div className="mt-auto pt-2 border-top d-flex align-items-center justify-content-between">
          <button
            type="button"
            className="btn btn-sm btn-light border text-secondary py-1 px-2.5 rounded-pill d-flex align-items-center gap-1"
            onClick={(e) => {
              e.stopPropagation();
              if (onUpvote) onUpvote(id);
            }}
            title="Endorse this challenge"
            style={{ fontSize: '0.75rem' }}
          >
            <i className="bi bi-hand-thumbs-up text-primary"></i>
            <span>{upvotes}</span>
          </button>

          <button
            type="button"
            className="btn btn-gov-outline btn-sm py-1 px-3 d-flex align-items-center gap-1"
            onClick={() => onViewDetails(id)}
            style={{ fontSize: '0.78rem' }}
          >
            <span>View Details</span>
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>

      </div>
    </article>
  );
};

export default ProblemCard;
