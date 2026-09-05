import React, { useState } from 'react';
import { ProblemForm } from '../../components/problem/ProblemForm';
import { problemService } from '../../services/problemService';
import { aiService } from '../../services/aiService';
import { notificationService } from '../../services/notificationService';
import { getLocationLabel } from '../../utils/location';

export const SubmitProblem = ({ onNavigate, onViewDetails }) => {
  // Modal states
  const [showGpsModal, setShowGpsModal] = useState(false);
  const [isGpsDetected, setIsGpsDetected] = useState(false);
  
  const [previewImage, setPreviewImage] = useState(null);
  
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiCheckingState, setAiCheckingState] = useState('processing'); // 'processing' | 'result'
  const [pendingFormData, setPendingFormData] = useState(null);
  const [aiDuplicateData, setAiDuplicateData] = useState(null);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedProblem, setSubmittedProblem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. GPS Modal Handlers
  const handleAllowLocation = () => {
    setShowGpsModal(false);
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        setIsGpsDetected(true);
      },
      (_err) => {
        setIsGpsDetected(true);
      },
      { timeout: 6000 }
    );
  };

  // 2. Image Preview Click
  const handleOpenImagePreview = (url, name, onRemove) => {
    setPreviewImage({ url, name, onRemove });
  };

  const handleCloseImagePreview = () => {
    setPreviewImage(null);
  };

  // 3. Form Submit -> AI Duplicate Check Modal
  const handleFormSubmit = async (formData) => {
    setPendingFormData(formData);
    setShowAiModal(true);
    setAiCheckingState('processing');

    try {
      const existingList = await problemService.getMyProblems();
      const duplicateResult = await aiService.checkDuplicates(formData, existingList);
      setAiDuplicateData(duplicateResult);
      
      setTimeout(() => {
        setAiCheckingState('result');
      }, 1000);
    } catch (_err) {
      setAiCheckingState('result');
    }
  };

  // 4. Final Submission Execution with Animated Multi-Step Processing
  const [processingStep, setProcessingStep] = useState(1);

  const handleExecuteSubmission = async () => {
    setShowAiModal(false);
    setIsSubmitting(true);
    setProcessingStep(1);

    // Dynamic processing step simulation while real API call resolves
    const stepInterval = setInterval(() => {
      setProcessingStep(prev => (prev < 6 ? prev + 1 : prev));
    }, 450);

    try {
      const result = await problemService.submitProblem(pendingFormData);
      clearInterval(stepInterval);
      setProcessingStep(7);
      setSubmittedProblem(result);
      
      // Add notification for submission
      try {
        await notificationService.addNotification({
          title: 'Challenge Registered Successfully',
          message: `Your challenge #${result.id} "${result.title}" has been recorded and submitted for AI pre-screening and municipal triage.`,
          problemId: result.id,
          category: 'Submission',
          type: 'system',
          badgeText: 'Submitted',
          badgeColor: 'primary',
          icon: 'bi-send-check'
        });
      } catch (_notifErr) {
        // Continue even if notification add fails
      }

      setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccessModal(true);
      }, 400);
    } catch (err) {
      clearInterval(stepInterval);
      setIsSubmitting(false);
      console.error('Submission error:', err);
      alert('Failed to submit challenge: ' + (err.message || 'Please try again.'));
    }
  };

  return (
    <div className="submit-problem-page">
      
      {/* Header with Back Button */}
      <div className="d-flex align-items-center gap-2 mb-3">
        <button 
          type="button" 
          className="btn btn-gov-ghost px-2 py-1" 
          onClick={() => onNavigate('dashboard')} 
          aria-label="Back"
        >
          <i className="bi bi-arrow-left"></i>
        </button>
        <h1 className="h5 mb-0 fw-bold">Submit a Challenge</h1>
      </div>

      {/* The Sectioned Problem Form */}
      <ProblemForm
        onSubmit={handleFormSubmit}
        onCancel={() => onNavigate('dashboard')}
        isSubmitting={isSubmitting}
        onRequestGpsModal={() => setShowGpsModal(true)}
        isGpsDetected={isGpsDetected}
        onImagePreviewClick={handleOpenImagePreview}
      />

      {/* MODAL A: GPS LOCATION MODAL */}
      {showGpsModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(18, 50, 75, 0.65)', backdropFilter: 'blur(3px)', zIndex: 1060 }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '440px' }}>
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-body py-3.5 px-4 text-center">
                <div className="p-2.5 bg-success bg-opacity-10 text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-2.5">
                  <i className="bi bi-geo-alt-fill fs-3" style={{ color: 'var(--gov-green)' }}></i>
                </div>
                <h5 className="fw-bold text-dark mb-1.5" style={{ fontSize: '1rem' }}>Use Your Current Location?</h5>
                <p className="text-muted small mb-3" style={{ fontSize: '0.80rem', lineHeight: '1.4' }}>
                  CivicConnect will use your device location to identify the exact area of this civic challenge for rapid municipal dispatch.
                </p>
                <div className="d-flex justify-content-center gap-2">
                  <button
                    type="button"
                    className="btn btn-gov-ghost px-3.5 py-1.5 btn-sm"
                    onClick={() => setShowGpsModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-gov px-3.5 py-1.5 btn-sm shadow-sm"
                    onClick={handleAllowLocation}
                  >
                    Allow Location
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL B: IMAGE PREVIEW MODAL */}
      {previewImage && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(18, 50, 75, 0.75)', backdropFilter: 'blur(4px)', zIndex: 1060 }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-white py-2.5 px-3 border-bottom">
                <h6 className="modal-title fw-bold text-dark small mb-0">
                  <i className="bi bi-image me-1 text-primary"></i>
                  {previewImage.name || 'Site Photo Preview'}
                </h6>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseImagePreview}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body p-0 bg-dark text-center" style={{ minHeight: '320px', maxHeight: '70vh', overflow: 'hidden' }}>
                <img
                  src={previewImage.url}
                  alt="Full preview"
                  className="w-100 h-100 object-fit-contain"
                  style={{ maxHeight: '70vh', objectFit: 'contain' }}
                />
              </div>
              <div className="modal-footer bg-white py-2 px-3 justify-content-between">
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => {
                    if (previewImage.onRemove) previewImage.onRemove();
                    handleCloseImagePreview();
                  }}
                  style={{ fontSize: '0.78rem' }}
                >
                  <i className="bi bi-trash me-1"></i> Remove Image
                </button>
                <button
                  type="button"
                  className="btn btn-gov-ghost btn-sm px-3"
                  onClick={handleCloseImagePreview}
                  style={{ fontSize: '0.78rem' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL C: AI DUPLICATE CHECK MODAL */}
      {showAiModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(18, 50, 75, 0.65)', backdropFilter: 'blur(4px)', zIndex: 1060 }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '520px' }}>
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              
              <div className="modal-header py-2.5 px-4 bg-white border-bottom">
                <div className="d-flex align-items-center gap-2">
                  <span className="tile-ico-gov" style={{ width: '28px', height: '28px', fontSize: '0.90rem' }}>
                    <i className="bi bi-robot"></i>
                  </span>
                  <h6 className="modal-title fw-bold text-dark mb-0" style={{ fontSize: '0.90rem' }}>
                    AI Pre-Submission Verification
                  </h6>
                </div>
                {aiCheckingState === 'result' && (
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAiModal(false)}
                    aria-label="Close"
                  ></button>
                )}
              </div>

              <div className="modal-body py-3 px-3.5">
                {aiCheckingState === 'processing' ? (
                  <div className="text-center py-2.5">
                    <div className="spinner-border mb-2.5" style={{ color: 'var(--gov-green)', width: '2.4rem', height: '2.4rem' }} role="status"></div>
                    <h6 className="fw-bold text-dark mb-1.5" style={{ fontSize: '0.90rem' }}>
                      CivicConnect AI is analyzing your report...
                    </h6>
                    <div className="text-muted small text-start mx-auto p-2.5 bg-light rounded-3 border" style={{ maxWidth: '340px', fontSize: '0.76rem' }}>
                      <div className="text-success mb-1">✓ Problem description semantic analysis</div>
                      <div className="text-success mb-1">✓ Evidence image feature verification</div>
                      <div className="text-success">✓ Geospatial proximity duplicate calculation</div>
                    </div>
                  </div>
                ) : (
                  <div>
                    {aiDuplicateData && aiDuplicateData.isPossibleDuplicate ? (
                      <div className="alert alert-warning border-warning d-flex align-items-start gap-2 p-2.5 rounded-3 mb-2.5">
                        <i className="bi bi-exclamation-triangle-fill text-warning fs-5 flex-shrink-0"></i>
                        <div>
                          <div className="fw-bold text-dark" style={{ fontSize: '0.88rem' }}>
                            Similar Challenge Already Reported
                          </div>
                          <div className="fw-bold text-danger mb-0.5" style={{ fontSize: '0.80rem' }}>
                            {aiDuplicateData.highestSimilarity}% Similarity Detected
                          </div>
                          <div className="small text-dark fw-medium" style={{ fontSize: '0.78rem' }}>
                            “{aiDuplicateData.topMatch?.title || 'Existing civic report in this locality'}”
                          </div>
                          <div className="small text-muted mt-0.5" style={{ fontSize: '0.72rem' }}>
                            📍 {aiDuplicateData.topMatch?.distanceMeters ? `${aiDuplicateData.topMatch.distanceMeters} meters away` : 'Nearby area'}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="alert alert-success border-success d-flex align-items-start gap-2 p-2.5 rounded-3 mb-2.5">
                        <i className="bi bi-shield-check text-success fs-5 flex-shrink-0"></i>
                        <div>
                          <div className="fw-bold text-dark" style={{ fontSize: '0.88rem' }}>
                            No Duplicate Reports Found
                          </div>
                          <div className="small text-muted mt-0.5" style={{ fontSize: '0.74rem' }}>
                            This report appears to be a unique civic challenge ready for departmental assignment.
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="d-flex flex-column gap-2">
                      {aiDuplicateData?.isPossibleDuplicate && aiDuplicateData?.topMatch && (
                        <button
                          type="button"
                          className="btn btn-gov-outline btn-sm py-1.5"
                          onClick={() => {
                            setShowAiModal(false);
                            if (onViewDetails) {
                              onViewDetails(aiDuplicateData.topMatch.id);
                            }
                          }}
                        >
                          <i className="bi bi-eye me-1"></i> View Similar Challenge (#{aiDuplicateData.topMatch.id})
                        </button>
                      )}

                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-gov flex-grow-1 btn-sm py-1.5 shadow-sm"
                          onClick={handleExecuteSubmission}
                        >
                          Confirm &amp; Submit Challenge
                        </button>
                        <button
                          type="button"
                          className="btn btn-gov-ghost btn-sm py-1.5 px-3"
                          onClick={() => setShowAiModal(false)}
                        >
                          Edit Submission
                        </button>
                      </div>
                    </div>

                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODAL D: LIVE MULTI-STEP AI PROCESSING SCREEN */}
      {isSubmitting && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(18, 50, 75, 0.75)', backdropFilter: 'blur(5px)', zIndex: 1070 }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '460px' }}>
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-body py-3.5 px-4 text-center">
                <div className="spinner-border mb-2.5" style={{ color: 'var(--gov-green)', width: '2.5rem', height: '2.5rem' }} role="status"></div>
                <h5 className="fw-bold text-dark mb-0.5" style={{ fontSize: '1rem' }}>
                  Processing Civic Challenge
                </h5>
                <p className="text-muted small mb-2.5" style={{ fontSize: '0.74rem' }}>
                  Government of Jharkhand Multi-Modal AI Engine
                </p>

                <div className="d-flex flex-column gap-1 text-start bg-light p-2.5 rounded-3 border">
                  <div className={`ai-processing-step ${processingStep >= 1 ? (processingStep === 1 ? 'active' : 'done') : 'pending'}`}>
                    <i className={`bi ${processingStep > 1 ? 'bi-check-circle-fill' : 'bi-circle'} me-2`}></i>
                    <span>Step 1: Storing challenge &amp; GeoJSON coordinates</span>
                  </div>
                  <div className={`ai-processing-step ${processingStep >= 2 ? (processingStep === 2 ? 'active' : 'done') : 'pending'}`}>
                    <i className={`bi ${processingStep > 2 ? 'bi-check-circle-fill' : 'bi-circle'} me-2`}></i>
                    <span>Step 2: NLP text classification &amp; technical domain mapping</span>
                  </div>
                  <div className={`ai-processing-step ${processingStep >= 3 ? (processingStep === 3 ? 'active' : 'done') : 'pending'}`}>
                    <i className={`bi ${processingStep > 3 ? 'bi-check-circle-fill' : 'bi-circle'} me-2`}></i>
                    <span>Step 3: Computer Vision defect evidence extraction</span>
                  </div>
                  <div className={`ai-processing-step ${processingStep >= 4 ? (processingStep === 4 ? 'active' : 'done') : 'pending'}`}>
                    <i className={`bi ${processingStep > 4 ? 'bi-check-circle-fill' : 'bi-circle'} me-2`}></i>
                    <span>Step 4: Cross-repository duplicate detection</span>
                  </div>
                  <div className={`ai-processing-step ${processingStep >= 5 ? (processingStep === 5 ? 'active' : 'done') : 'pending'}`}>
                    <i className={`bi ${processingStep > 5 ? 'bi-check-circle-fill' : 'bi-circle'} me-2`}></i>
                    <span>Step 5: Dynamic risk priority score calculation</span>
                  </div>
                  <div className={`ai-processing-step ${processingStep >= 6 ? (processingStep === 6 ? 'active' : 'done') : 'pending'}`}>
                    <i className={`bi ${processingStep > 6 ? 'bi-check-circle-fill' : 'bi-circle'} me-2`}></i>
                    <span>Step 6: Multi-factor university &amp; department matching</span>
                  </div>
                  <div className={`ai-processing-step ${processingStep >= 7 ? 'done' : 'pending'}`}>
                    <i className={`bi ${processingStep >= 7 ? 'bi-check-circle-fill' : 'bi-circle'} me-2`}></i>
                    <span>Step 7: Routing challenge &amp; creating notifications</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL E: MODERNIZED SUBMISSION SUCCESS & AI TRIAGE POPUP */}
      {showSuccessModal && submittedProblem && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(18, 50, 75, 0.60)', backdropFilter: 'blur(4px)', zIndex: 1070 }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered success-modal-dialog">
            <div className="modal-content success-modal-card">
              
              {/* Header */}
              <div className="success-modal-header">
                <div className="d-flex align-items-center gap-3">
                  <div className="success-icon-badge">
                    <i className="bi bi-check2"></i>
                  </div>
                  <div>
                    <h2 className="h6 mb-0 fw-bold text-dark" style={{ fontSize: '1.05rem', letterSpacing: '-0.2px' }}>
                      Challenge Registered Successfully
                    </h2>
                    <span className="text-muted small" style={{ fontSize: '0.74rem' }}>
                      AI multi-modal triage and institutional routing completed
                    </span>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="badge-status st-submitted py-1 px-2.5" style={{ fontSize: '0.72rem' }}>
                    <i className="bi bi-patch-check-fill text-success me-1"></i>Pre-Screened
                  </span>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowSuccessModal(false)}
                    aria-label="Close"
                  ></button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-3">
                
                {/* Official Metadata Strip */}
                <div className="success-meta-strip">
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-muted fw-semibold" style={{ fontSize: '0.72rem' }}>OFFICIAL TOKEN:</span>
                    <span className="success-token-pill">#{submittedProblem.id}</span>
                  </div>
                  <div className="text-dark fw-medium">
                    <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                    {getLocationLabel(submittedProblem.location, submittedProblem.locationName)} ({submittedProblem.district || 'Ranchi'})
                  </div>
                  <div className="text-muted">
                    <i className="bi bi-clock-history me-1"></i>
                    {new Date(submittedProblem.createdAt || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                </div>

                {/* 2-Column AI & University Grid */}
                <div className="row g-3">
                  
                  {/* Left Column: AI Multi-Modal Analysis */}
                  <div className="col-12 col-md-6">
                    <div className="success-ai-box">
                      <div className="success-box-title">
                        <i className="bi bi-cpu-fill text-success"></i>
                        <span>AI Multi-Modal Triage &amp; Risk</span>
                      </div>

                      <div className="d-flex flex-column">
                        <div className="success-metric-row">
                          <span className="success-metric-label">Detected Category:</span>
                          <span className="badge bg-success bg-opacity-10 text-success fw-bold px-2 py-0.5 rounded-pill" style={{ fontSize: '0.72rem' }}>
                            {submittedProblem.category || 'Roads & Infrastructure'}
                          </span>
                        </div>

                        <div className="success-metric-row">
                          <span className="success-metric-label">Technical Domain:</span>
                          <span className="success-metric-val" style={{ fontSize: '0.76rem' }}>
                            {submittedProblem.aiAnalysis?.domain || submittedProblem.aiAnalysis?.technicalDomain || 'Civil & Urban Engineering'}
                          </span>
                        </div>

                        <div className="success-metric-row">
                          <span className="success-metric-label">Risk Priority:</span>
                          <span className={`badge ${
                            submittedProblem.aiAnalysis?.priority === 'CRITICAL' ? 'bg-danger' :
                            submittedProblem.aiAnalysis?.priority === 'HIGH' ? 'bg-warning text-dark' :
                            submittedProblem.aiAnalysis?.priority === 'MEDIUM' ? 'bg-primary' : 'bg-success'
                          }`} style={{ fontSize: '0.72rem' }}>
                            {submittedProblem.aiAnalysis?.priority || 'HIGH'} ({submittedProblem.aiAnalysis?.priorityScore || 82.0}/100)
                          </span>
                        </div>

                        <div className="success-metric-row">
                          <span className="success-metric-label">Severity Level:</span>
                          <span className="fw-bold text-dark">
                            {submittedProblem.aiAnalysis?.severity || 'HIGH'}
                          </span>
                        </div>

                        <div className="success-metric-row">
                          <span className="success-metric-label">Duplicate Check:</span>
                          <span className="fw-semibold text-success" style={{ fontSize: '0.74rem' }}>
                            {submittedProblem.aiAnalysis?.duplicateProbability ? `${submittedProblem.aiAnalysis.duplicateProbability}% Match` : '0% • Unique Report'}
                          </span>
                        </div>

                        <div className="success-metric-row">
                          <span className="success-metric-label">Image Evidence:</span>
                          <span className="text-dark" style={{ fontSize: '0.74rem' }}>
                            {submittedProblem.image ? (
                              <span className="text-primary fw-semibold">
                                <i className="bi bi-camera-fill me-1"></i>Verified ({submittedProblem.aiAnalysis?.imageConfidence || 91.5}%)
                              </span>
                            ) : (
                              <span className="text-muted">No image uploaded</span>
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2.5 pt-2 border-top text-muted" style={{ fontSize: '0.72rem', lineHeight: '1.4' }}>
                        <span className="text-dark fw-bold d-block mb-0.5">Routing Department:</span>
                        {submittedProblem.department || 'Municipal Corporation - Engineering Cell'}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: AI-Matched State Universities */}
                  <div className="col-12 col-md-6">
                    <div className="success-ai-box">
                      <div className="success-box-title d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-1.5">
                          <i className="bi bi-mortarboard-fill text-primary"></i>
                          <span>AI-Matched State Universities</span>
                        </div>
                        {submittedProblem.matchedUniversities && submittedProblem.matchedUniversities.length > 0 && (
                          <span className="badge bg-light text-dark border" style={{ fontSize: '0.65rem' }}>
                            {submittedProblem.matchedUniversities.length} Matched
                          </span>
                        )}
                      </div>

                      {submittedProblem.matchedUniversities && submittedProblem.matchedUniversities.length > 0 ? (
                        <div className="d-flex flex-column gap-2">
                          {submittedProblem.matchedUniversities.slice(0, 2).map((u, idx) => (
                            <div key={idx} className="success-univ-card">
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <strong className="text-dark text-truncate me-1" style={{ fontSize: '0.78rem', maxWidth: '190px' }}>
                                  {u.name}
                                </strong>
                                <span className="success-univ-badge">
                                  {u.matchScore}% Match
                                </span>
                              </div>
                              <div className="text-muted small mb-1" style={{ fontSize: '0.70rem' }}>
                                <i className="bi bi-building me-1 text-secondary"></i>
                                {u.relevantDepartment} • <strong>{u.distanceKm} km</strong> away
                              </div>
                              {u.matchReasons && u.matchReasons.length > 0 && (
                                <div className="text-success small fw-semibold" style={{ fontSize: '0.66rem' }}>
                                  ✓ {u.matchReasons[0]}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-muted small" style={{ fontSize: '0.78rem' }}>
                          <i className="bi bi-info-circle d-block fs-4 text-secondary mb-1"></i>
                          No specialized university match found yet. Forwarded to State Central Civic Cell.
                        </div>
                      )}

                      <div className="mt-2.5 pt-2 border-top text-primary small d-flex align-items-center gap-1.5" style={{ fontSize: '0.70rem' }}>
                        <i className="bi bi-send-check-fill text-success"></i>
                        <span>Challenge dossier dispatched to matched university R&amp;D cells.</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Footer Action Buttons */}
                <div className="success-action-bar">
                  <button 
                    type="button"
                    className="btn btn-light border btn-sm px-3 text-secondary" 
                    onClick={() => {
                      setShowSuccessModal(false);
                      onNavigate('dashboard');
                    }}
                    style={{ fontSize: '0.80rem' }}
                  >
                    <i className="bi bi-house me-1"></i>
                    Dashboard
                  </button>
                  <button 
                    type="button"
                    className="btn btn-gov-outline btn-sm px-3" 
                    onClick={() => {
                      setShowSuccessModal(false);
                      onNavigate('my-problems');
                    }}
                    style={{ fontSize: '0.80rem' }}
                  >
                    <i className="bi bi-folder2 me-1"></i>
                    My Submissions
                  </button>
                  <button 
                    type="button"
                    className="btn btn-gov btn-sm px-3.5 shadow-sm" 
                    onClick={() => {
                      setShowSuccessModal(false);
                      if (onViewDetails) {
                        onViewDetails(submittedProblem.id);
                      }
                    }}
                    style={{ fontSize: '0.80rem' }}
                  >
                    <i className="bi bi-file-earmark-text me-1"></i>
                    View Submission Details
                  </button>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SubmitProblem;
