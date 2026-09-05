import React, { useState, useEffect } from 'react';
import { ProblemStatus } from '../../components/problem/ProblemStatus';
import { AiAnalysisCard } from '../../components/problem/AiAnalysisCard';
import { ProblemMap } from '../../components/maps/ProblemMap';
import { problemService, CIVIC_CATEGORIES } from '../../services/problemService';
import { getLocationLabel } from '../../utils/location';

export const ProblemDetails = ({ problemId, onNavigate, onViewProblem }) => {
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(false);
  const [upvoting, setUpvoting] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Edit State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    additionalDetails: ''
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Withdraw State
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const loadProblemDetails = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await problemService.getProblemById(id);
      setProblem(data);
      if (data) {
        setEditFormData({
          title: data.title || '',
          description: data.description || '',
          category: data.category || 'Roads & Infrastructure',
          location: data.location || '',
          additionalDetails: data.additionalDetails || ''
        });
      }
    } catch (err) {
      console.error('Error loading problem details:', err);
      setError(err.message || 'Problem not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (problemId) {
      loadProblemDetails(problemId);
    }
  }, [problemId]);

  const handleUpvote = async () => {
    if (!problem || upvoting) return;
    try {
      setUpvoting(true);
      const updated = await problemService.upvoteProblem(problem.id);
      setProblem(prev => ({ ...prev, upvotes: updated.upvotes }));
      showToast('Endorsement recorded! Thank you for supporting this civic cause.');
    } catch (err) {
      console.error('Failed to upvote:', err);
    } finally {
      setUpvoting(false);
    }
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleCopyLink = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(`CivicConnect Challenge #${problem.id}: ${problem.title}`);
      showToast('Challenge reference copied to clipboard!');
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editFormData.title.trim() || !editFormData.description.trim()) {
      return;
    }
    setIsSavingEdit(true);
    try {
      const updated = await problemService.updateProblem(problem.id, editFormData);
      setProblem(updated);
      setShowEditModal(false);
      showToast('Challenge details updated successfully.');
    } catch (err) {
      console.error('Failed to update problem:', err);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleConfirmWithdraw = async () => {
    setIsWithdrawing(true);
    try {
      await problemService.withdrawProblem(problem.id);
      setShowWithdrawModal(false);
      onNavigate('my-problems');
    } catch (err) {
      console.error('Failed to withdraw problem:', err);
      setIsWithdrawing(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" style={{ color: 'var(--gov-green)' }} role="status"></div>
        <p className="text-muted small mt-2">Loading challenge details...</p>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="card-gov p-5 text-center">
        <i className="bi bi-exclamation-circle fs-2 text-danger mb-2"></i>
        <h5 className="fw-bold text-dark">Challenge Not Found</h5>
        <p className="text-muted small mb-3">{error || 'Could not load details for this challenge.'}</p>
        <div>
          <button
            type="button"
            className="btn btn-gov btn-sm px-3"
            onClick={() => onNavigate('my-problems')}
          >
            ← Back to My Submissions
          </button>
        </div>
      </div>
    );
  }

  const {
    id,
    title,
    description,
    category,
    location,
    locationName,
    district,
    latitude,
    longitude,
    image,
    imageName,
    documentName,
    additionalDetails,
    createdAt,
    status = 'Submitted',
    department = 'Ranchi Municipal Corporation',
    assignedOfficer = 'Ward Engineering Cell',
    timeline = [],
    aiAnalysis,
    upvotes = 0,
    matchedUniversities = []
  } = problem;

  const isEditable = status === 'Submitted' || status === 'Under Review';
  const locationLabel = getLocationLabel(location, locationName);

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    : 'Recently';

  return (
    <div className="problem-details-page pb-5">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div 
          className="alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-4 shadow-lg py-2 px-3 small z-3"
          style={{ zIndex: 1080 }}
          role="alert"
        >
          <i className="bi bi-check-circle-fill me-2"></i>
          {toastMsg}
        </div>
      )}

      {/* Back Button & Action Strip */}
      <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
        <div className="d-flex align-items-center gap-2">
          <button 
            type="button" 
            className="btn btn-gov-ghost px-2 py-1" 
            onClick={() => onNavigate('my-problems')} 
            aria-label="Back"
          >
            <i className="bi bi-arrow-left"></i>
          </button>
          <h1 className="h5 mb-0 fw-bold">Challenge Details</h1>
        </div>

        <div className="d-flex align-items-center gap-2">
          {/* Share / Copy */}
          <button
            type="button"
            className="btn btn-light border btn-sm d-flex align-items-center gap-1 text-secondary"
            onClick={handleCopyLink}
            title="Share Challenge"
            style={{ fontSize: '0.78rem' }}
          >
            <i className="bi bi-share"></i>
            <span className="d-none d-sm-inline">Share</span>
          </button>

          {/* Edit Button (if Submitted or Under Review) */}
          {isEditable && (
            <button
              type="button"
              className="btn btn-outline-success btn-sm d-flex align-items-center gap-1"
              onClick={() => setShowEditModal(true)}
              style={{ fontSize: '0.78rem' }}
            >
              <i className="bi bi-pencil-square"></i>
              <span>Edit</span>
            </button>
          )}

          {/* Withdraw Button */}
          {isEditable && (
            <button
              type="button"
              className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
              onClick={() => setShowWithdrawModal(true)}
              style={{ fontSize: '0.78rem' }}
            >
              <i className="bi bi-trash"></i>
              <span className="d-none d-sm-inline">Withdraw</span>
            </button>
          )}
        </div>
      </div>

      {/* 1. Main Header Article */}
      <article className="card-gov p-3 p-md-4 mb-3">
        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
          <h2 className="h5 mb-0 fw-bold text-dark">{title}</h2>
          <ProblemStatus status={status} compact={true} />
        </div>

        <div className="text-muted small mb-2 d-flex flex-wrap align-items-center gap-3">
          <span><i className="bi bi-hash"></i><strong>{id}</strong></span>
          <span><i className="bi bi-calendar3 me-1"></i>Submitted on {formattedDate}</span>
          <span><i className="bi bi-geo-alt me-1 text-danger"></i>{locationLabel} {district ? `(${district})` : ''}</span>
        </div>

        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
          <span className="chip-gov"><i className="bi bi-tag me-1 text-success"></i>{category}</span>

          {/* Upvote Pill */}
          <button
            type="button"
            className="btn btn-sm rounded-pill d-flex align-items-center gap-1.5 px-3 py-1 text-success border border-success-subtle bg-success-subtle hover-bg-success"
            onClick={handleUpvote}
            disabled={upvoting}
            style={{ fontSize: '0.80rem' }}
            title="Endorse this public challenge"
          >
            <i className="bi bi-hand-thumbs-up-fill"></i>
            <strong>{upvotes}</strong>
            <span className="text-secondary">Endorsements</span>
          </button>
        </div>

        <p className="mb-0 text-dark" style={{ lineHeight: '1.6', whiteSpace: 'pre-line' }}>{description}</p>
        
        {additionalDetails && (
          <div className="p-2.5 bg-light rounded-3 mt-3 text-muted small" style={{ fontSize: '0.78rem' }}>
            <strong className="text-dark d-block mb-0.5">Landmarks & Notes:</strong>
            {additionalDetails}
          </div>
        )}
      </article>

      {/* 2-Column Details Grid */}
      <div className="row g-3">
        
        {/* Left Column: Location, Images, Government Response */}
        <div className="col-12 col-lg-7">
          
          {/* Geo-tagged Location */}
          <div className="card-gov p-3 p-md-4 mb-3">
            <h3 className="section-title-gov">
              <i className="bi bi-geo-alt me-1" style={{ color: 'var(--gov-green)' }}></i>
              Geo-tagged Location
            </h3>
            <div className="text-muted small mb-2">{locationLabel}</div>
            <ProblemMap
              latitude={latitude || 23.3441}
              longitude={longitude || 85.3096}
              locationName={locationLabel}
              isInteractive={false}
              district={district}
            />
          </div>

          {/* Supporting Images */}
          <div className="card-gov p-3 p-md-4 mb-3">
            <h3 className="section-title-gov">
              <i className="bi bi-images me-1" style={{ color: 'var(--gov-green)' }}></i>
              Supporting Evidence
            </h3>
            {image ? (
              <div className="row g-2">
                <div className="col-6 col-md-4">
                  <div 
                    className="preview-thumb-gov cursor-pointer"
                    onClick={() => setPreviewImage(true)}
                    style={{ cursor: 'pointer', height: '120px' }}
                  >
                    <img src={image} alt={title} style={{ height: '120px' }} />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted small mb-0">No photos attached with this submission.</p>
            )}

            {documentName && (
              <div className="p-2.5 bg-light rounded-3 border mt-3 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-file-earmark-pdf-fill text-danger fs-5"></i>
                  <div>
                    <div className="fw-semibold text-dark small" style={{ fontSize: '0.78rem' }}>{documentName}</div>
                    <div className="text-muted" style={{ fontSize: '0.68rem' }}>Official representation document</div>
                  </div>
                </div>
                <button type="button" className="btn btn-gov-ghost btn-sm py-1 px-2.5" style={{ fontSize: '0.74rem' }}>
                  <i className="bi bi-download me-1"></i> Download
                </button>
              </div>
            )}
          </div>

          {/* Government / University Response */}
          <div className="card-gov p-3 p-md-4 mb-3" style={{ borderLeft: '4px solid var(--gov-green)' }}>
            <h3 className="section-title-gov">
              <i className="bi bi-buildings me-1" style={{ color: 'var(--gov-green)' }}></i>
              Government / Department Routing
            </h3>
            <div className="fw-semibold text-dark" style={{ fontSize: '0.88rem' }}>
              {department}
            </div>
            <div className="text-muted small mb-2" style={{ fontSize: '0.75rem' }}>
              In-charge: {assignedOfficer} • Updated recently
            </div>
            <p className="mb-0 text-muted small" style={{ fontSize: '0.82rem', lineHeight: '1.5' }}>
              Your challenge has been recorded and scheduled under Jharkhand State Urban & Rural Infrastructure SLA. Municipal and department officers are authorized to act.
            </p>
          </div>

          {/* Matched Universities & Research Teams */}
          {matchedUniversities && matchedUniversities.length > 0 && (
            <div className="card-gov p-3 p-md-4 mb-3">
              <h3 className="section-title-gov">
                <i className="bi bi-mortarboard me-1" style={{ color: 'var(--gov-green)' }}></i>
                State University & Research Mapping
              </h3>
              <p className="text-muted small mb-3" style={{ fontSize: '0.76rem' }}>
                Relevant higher education research cells matched via domain expertise and geographic proximity:
              </p>
              <div className="d-flex flex-column gap-2.5">
                {matchedUniversities.map((u, idx) => (
                  <div key={idx} className="p-2.5 rounded-3 bg-light border d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
                    <div>
                      <div className="fw-bold text-dark" style={{ fontSize: '0.86rem' }}>{u.name}</div>
                      <div className="text-muted small" style={{ fontSize: '0.74rem' }}>
                        <i className="bi bi-geo-alt me-1"></i>{u.district} ({u.distanceKm || 12} km away) • {u.relevantDepartment}
                      </div>
                      {u.expertise && (
                        <div className="d-flex gap-1 flex-wrap mt-1">
                          {u.expertise.map((exp, eIdx) => (
                            <span key={eIdx} className="badge bg-white text-secondary border" style={{ fontSize: '0.65rem' }}>
                              {exp}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-sm-end flex-shrink-0">
                      <span className="badge bg-success-subtle text-success border border-success-subtle mb-1 d-inline-block">
                        {u.matchScore || 92}% Match Score
                      </span>
                      <div className="text-muted small" style={{ fontSize: '0.70rem' }}>
                        {u.status || 'Available for Assignment'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: AI Analysis & Progress Timeline */}
        <div className="col-12 col-lg-5">
          
          {/* AI Analysis Card */}
          <div className="mb-3">
            <AiAnalysisCard
              analysis={aiAnalysis}
              onViewProblem={onViewProblem || loadProblemDetails}
            />
          </div>

          {/* Progress Timeline */}
          <ProblemStatus
            status={status}
            timeline={timeline}
          />

        </div>

      </div>

      {/* Back Button Footer */}
      <button 
        type="button" 
        className="btn btn-gov-outline w-100 mt-2 d-flex align-items-center justify-content-center gap-1" 
        onClick={() => onNavigate('my-problems')}
      >
        <i className="bi bi-arrow-left me-1"></i>
        <span>Back to My Submissions</span>
      </button>

      {/* Image Preview Lightbox Modal */}
      {previewImage && image && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(18, 50, 75, 0.75)', backdropFilter: 'blur(4px)', zIndex: 1060 }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-white py-2.5 px-3 border-bottom">
                <h6 className="modal-title fw-bold text-dark small mb-0">
                  {imageName || 'Challenge Evidence Photo'}
                </h6>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setPreviewImage(false)}
                ></button>
              </div>
              <div className="modal-body p-0 bg-dark text-center" style={{ maxHeight: '70vh', overflow: 'hidden' }}>
                <img
                  src={image}
                  alt="Full preview"
                  className="w-100 h-100 object-fit-contain"
                  style={{ maxHeight: '70vh', objectFit: 'contain' }}
                />
              </div>
              <div className="modal-footer bg-white py-2 px-3">
                <button
                  type="button"
                  className="btn btn-gov-ghost btn-sm px-3"
                  onClick={() => setPreviewImage(false)}
                  style={{ fontSize: '0.78rem' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Challenge Modal */}
      {showEditModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(18, 50, 75, 0.65)', backdropFilter: 'blur(3px)', zIndex: 1060 }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-light py-2.5 px-3.5 border-bottom">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-pencil-square text-success fs-5"></i>
                  <h5 className="modal-title fw-bold text-dark mb-0" style={{ fontSize: '1rem' }}>
                    Edit Challenge Details
                  </h5>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                  disabled={isSavingEdit}
                ></button>
              </div>
              <form onSubmit={handleSaveEdit}>
                <div className="modal-body p-3.5">
                  <div className="mb-2.5">
                    <label className="form-label-gov">Challenge Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editFormData.title}
                      onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="row g-2.5 mb-2.5">
                    <div className="col-md-6">
                      <label className="form-label-gov">Category *</label>
                      <select
                        className="form-select"
                        value={editFormData.category}
                        onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                        required
                      >
                        {CIVIC_CATEGORIES.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label-gov">Location / Street *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editFormData.location}
                        onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-2.5">
                    <label className="form-label-gov">Detailed Description *</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={editFormData.description}
                      onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-0">
                    <label className="form-label-gov">Landmarks & Navigation Notes</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editFormData.additionalDetails}
                      onChange={(e) => setEditFormData({ ...editFormData, additionalDetails: e.target.value })}
                      placeholder="e.g. Near Central Gate, opposite Primary School"
                    />
                  </div>
                </div>

                <div className="modal-footer bg-light py-2 px-3.5 border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm px-3"
                    onClick={() => setShowEditModal(false)}
                    disabled={isSavingEdit}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-gov btn-sm px-4"
                    disabled={isSavingEdit}
                  >
                    {isSavingEdit ? 'Saving Changes...' : 'Save & Update Challenge'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Challenge Confirmation Modal */}
      {showWithdrawModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(18, 50, 75, 0.65)', backdropFilter: 'blur(3px)', zIndex: 1060 }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '440px' }}>
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-danger-subtle py-2.5 px-3.5 border-bottom border-danger-subtle">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-exclamation-triangle-fill text-danger fs-5"></i>
                  <h5 className="modal-title fw-bold text-danger mb-0" style={{ fontSize: '1rem' }}>
                    Withdraw Challenge?
                  </h5>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowWithdrawModal(false)}
                  disabled={isWithdrawing}
                ></button>
              </div>
              <div className="modal-body py-3 px-3.5 text-center">
                <p className="text-secondary small mb-2">
                  Are you sure you want to withdraw challenge <strong>#{problem.id}</strong> (<em>{problem.title}</em>)?
                </p>
                <p className="text-muted small mb-0" style={{ fontSize: '0.78rem' }}>
                  This will remove the challenge from the public register and cancel the department triage workflow.
                </p>
              </div>
              <div className="modal-footer bg-light py-2 px-3.5 border-top d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm px-3"
                  onClick={() => setShowWithdrawModal(false)}
                  disabled={isWithdrawing}
                >
                  Keep Challenge
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm px-3"
                  onClick={handleConfirmWithdraw}
                  disabled={isWithdrawing}
                >
                  {isWithdrawing ? 'Withdrawing...' : 'Yes, Withdraw Challenge'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProblemDetails;
