import React, { useState, useEffect } from 'react';
import './university.css';
import { JharkhandCrest } from '../../components/Icons';
import { universityService } from '../../services/universityService';
import { getLocationLabel } from '../../utils/location';

export const UniversityDashboard = ({ user, onLogout, onBackToLanding }) => {
  const [activeTab, setActiveTab] = useState('recommended'); // 'recommended' | 'accepted' | 'explore' | 'faculty' | 'notifications'
  const [recommendedProblems, setRecommendedProblems] = useState([]);
  const [acceptedProblems, setAcceptedProblems] = useState([]);
  const [metrics, setMetrics] = useState({
    totalProblems: 0,
    newProblems: 0,
    currentlyWorking: 0,
    submittedProblems: 0,
    fundingApproved: 0,
    submittedToGovernment: 0
  });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Modals state
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showSolutionModal, setShowSolutionModal] = useState(false);

  // Form states for assignment
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [solutionSummary, setSolutionSummary] = useState('');
  const [prototypeUrl, setPrototypeUrl] = useState('');
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  const universityId = user?.id || 'UNIV-BIT-MESRA';
  const universityName = user?.name || profile?.name || 'State Nodal University';

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [recData, accData, metricsData, profData] = await Promise.all([
        universityService.getRecommendedChallenges(universityId),
        universityService.getMyChallenges(universityId),
        universityService.getMetrics(universityId),
        universityService.getProfile(universityId)
      ]);

      setRecommendedProblems(recData || []);
      setAcceptedProblems(accData || []);
      if (metricsData) setMetrics(metricsData);
      if (profData) {
        setProfile(profData);
        if (profData.faculty && profData.faculty.length > 0) {
          setSelectedFaculty(profData.faculty[0].name);
        }
        if (profData.teams && profData.teams.length > 0) {
          setSelectedTeam(profData.teams[0].name);
        }
      }
    } catch (err) {
      console.error('Error loading university dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [universityId]);

  const showToast = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const handleOpenDetail = (problem) => {
    setSelectedProblem(problem);
    setShowDetailModal(true);
  };

  const handleOpenAccept = (problem, e) => {
    e?.stopPropagation();
    setSelectedProblem(problem);
    setShowAcceptModal(true);
  };

  const handleConfirmAccept = async () => {
    if (!selectedProblem) return;
    setIsSubmittingAction(true);
    try {
      await universityService.acceptChallenge(selectedProblem.id, {
        universityId,
        universityName,
        department: selectedProblem.relevantDepartment || profile?.departments?.[0] || 'Engineering R&D Cell'
      });
      setShowAcceptModal(false);
      showToast(`Challenge #${selectedProblem.id} accepted by ${universityName}! Citizen notified.`);
      await loadDashboardData();
    } catch (err) {
      console.error('Error accepting challenge:', err);
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleOpenAssign = (problem, e) => {
    e?.stopPropagation();
    setSelectedProblem(problem);
    setShowAssignModal(true);
  };

  const handleConfirmAssign = async (e) => {
    e.preventDefault();
    if (!selectedProblem) return;
    setIsSubmittingAction(true);
    try {
      await universityService.assignTeam(selectedProblem.id, {
        facultyMentor: selectedFaculty,
        studentTeam: selectedTeam,
        department: selectedProblem.relevantDepartment || profile?.departments?.[0]
      });
      setShowAssignModal(false);
      showToast(`Assigned ${selectedFaculty} & ${selectedTeam} to #${selectedProblem.id}!`);
      await loadDashboardData();
    } catch (err) {
      console.error('Error assigning team:', err);
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleOpenSolution = (problem, e) => {
    e?.stopPropagation();
    setSelectedProblem(problem);
    setShowSolutionModal(true);
  };

  const handleConfirmSolution = async (e) => {
    e.preventDefault();
    if (!selectedProblem) return;
    setIsSubmittingAction(true);
    try {
      await universityService.submitSolution(selectedProblem.id, {
        summary: solutionSummary,
        prototypeUrl,
        submittedBy: `${universityName} R&D Cell`
      });
      setShowSolutionModal(false);
      setSolutionSummary('');
      setPrototypeUrl('');
      showToast(`Solution blueprint for #${selectedProblem.id} submitted to Government Nodal Cell!`);
      await loadDashboardData();
    } catch (err) {
      console.error('Error submitting solution:', err);
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const problemMetricsCards = [
    {
      id: 'total-problems',
      className: 'card-total-problems',
      labelEn: 'Total Problems',
      labelHi: 'कुल समस्याएं',
      count: metrics.totalProblems || 0
    },
    {
      id: 'new-problems',
      className: 'card-new-problems',
      labelEn: 'AI Recommended',
      labelHi: 'एआई अनुशंसित',
      count: recommendedProblems.length
    },
    {
      id: 'currently-working',
      className: 'card-currently-working',
      labelEn: 'Active R&D Teams',
      labelHi: 'सक्रिय शोध दल',
      count: acceptedProblems.length
    },
    {
      id: 'submitted-problems',
      className: 'card-submitted-problems',
      labelEn: 'Solutions Submitted',
      labelHi: 'प्रस्तुत समाधान',
      count: metrics.submittedToGovernment || 0
    },
    {
      id: 'funding-approved',
      className: 'card-funding-approved',
      labelEn: 'State Grants Approved',
      labelHi: 'अनुमोदित अनुदान',
      count: metrics.fundingApproved || 0
    },
    {
      id: 'submitted-to-government',
      className: 'card-submitted-to-government',
      labelEn: 'Municipal Deployments',
      labelHi: 'नगर निगम क्रियान्वयन',
      count: metrics.fundingApproved || 0
    }
  ];

  return (
    <div className="univ-dashboard-wrapper">
      {/* Top Navbar */}
      <header className="univ-navbar">
        <div className="univ-navbar-inner">
          <div className="univ-brand-group">
            <JharkhandCrest size={38} />
            <div>
              <span className="univ-portal-title">University Research & Innovation Exchange</span>
              <span className="univ-portal-sub">Government of Jharkhand • उच्च एवं तकनीकी शिक्षा विभाग</span>
            </div>
          </div>

          <div className="univ-header-actions d-flex align-items-center gap-2">
            <div className="d-none d-md-flex flex-column text-end me-2">
              <span className="fw-bold text-dark" style={{ fontSize: '0.84rem' }}>{universityName}</span>
              <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                <i className="bi bi-patch-check-fill text-success me-1"></i>
                State Nodal University Partner
              </span>
            </div>

            <button
              type="button"
              className="btn btn-sm btn-outline-success rounded-pill px-3"
              onClick={onBackToLanding}
              style={{ fontSize: '0.78rem' }}
            >
              <i className="bi bi-grid-fill me-1"></i> All Portals
            </button>

            <button
              type="button"
              className="btn btn-sm btn-outline-danger rounded-pill px-3"
              onClick={onLogout}
              style={{ fontSize: '0.78rem' }}
            >
              <i className="bi bi-box-arrow-right me-1"></i> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="univ-main-content">
        
        {/* Toast Feedback */}
        {feedbackMsg && (
          <div className="alert alert-success alert-dismissible fade show mb-4 py-2.5 px-3 small shadow-sm" role="alert">
            <i className="bi bi-check-circle-fill me-2"></i>
            {feedbackMsg}
          </div>
        )}

        {/* Hero Section */}
        <section className="univ-hero-card mb-4 p-4 rounded-4 bg-white border shadow-sm">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1 rounded-pill">
                  Academia & Research Portal
                </span>
                <span className="badge bg-light text-secondary border px-2.5 py-1 rounded-pill">
                  <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                  {profile?.district || 'Ranchi'}, Jharkhand
                </span>
              </div>
              <h1 className="h4 fw-bold text-dark mb-1">
                Welcome, {universityName}
              </h1>
              <p className="text-muted small mb-0" style={{ maxWidth: '720px' }}>
                AI Multi-Modal Engine automatically routes real-world civic challenges to your engineering departments based on institutional expertise, faculty specialization, and regional proximity.
              </p>
            </div>

            <div className="d-flex gap-2">
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-1.5 ${activeTab === 'recommended' ? 'btn-success fw-bold' : 'btn-light border text-secondary'}`}
                onClick={() => setActiveTab('recommended')}
              >
                <i className="bi bi-stars me-1 text-warning"></i>
                AI Recommended ({recommendedProblems.length})
              </button>
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-1.5 ${activeTab === 'accepted' ? 'btn-success fw-bold' : 'btn-light border text-secondary'}`}
                onClick={() => setActiveTab('accepted')}
              >
                <i className="bi bi-folder-check me-1"></i>
                Our Active Projects ({acceptedProblems.length})
              </button>
            </div>
          </div>
        </section>

        {/* 6 Problem Metrics Cards */}
        <section className="row g-3 mb-4">
          {problemMetricsCards.map((m) => (
            <div key={m.id} className="col-6 col-md-4 col-lg-2">
              <div className="card h-100 p-3 rounded-3 border bg-white text-center shadow-xs">
                <span className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.66rem' }}>
                  {m.labelEn}
                </span>
                <div className="h3 fw-bold text-dark mt-1 mb-0">{m.count}</div>
                <span className="text-secondary" style={{ fontSize: '0.68rem' }}>{m.labelHi}</span>
              </div>
            </div>
          ))}
        </section>

        {/* Dynamic Challenges Section */}
        <section className="mb-5">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <h2 className="h5 fw-bold text-dark mb-0">
                {activeTab === 'recommended' ? '🎯 AI-Matched Civic Challenges for Your University' : `📂 Active Challenges Accepted by ${universityName}`}
              </h2>
              <p className="text-muted small mb-0">
                {activeTab === 'recommended'
                  ? 'Ranked using multi-factor domain expertise, department relevance, and geo-distance calculations.'
                  : 'Manage faculty mentors, student research teams, and submit engineering solution blueprints.'}
              </p>
            </div>

            <button
              type="button"
              className="btn btn-sm btn-light border"
              onClick={loadDashboardData}
              title="Refresh Data"
            >
              <i className="bi bi-arrow-clockwise me-1"></i> Refresh
            </button>
          </div>

          {loading ? (
            <div className="p-5 text-center bg-white rounded-4 border">
              <div className="spinner-border text-success mb-2" role="status"></div>
              <p className="text-muted small mb-0">Querying MongoDB & matching university research portfolios...</p>
            </div>
          ) : (
            <>
              {/* Tab 1: AI Recommended Challenges */}
              {activeTab === 'recommended' && (
                <div className="row g-3">
                  {recommendedProblems.length === 0 ? (
                    <div className="col-12 p-5 text-center bg-white rounded-4 border">
                      <i className="bi bi-inbox fs-2 text-muted mb-2"></i>
                      <h6 className="fw-bold text-dark">No New Recommended Challenges</h6>
                      <p className="text-muted small mb-0">All current challenges have been allocated or are in other regional sectors.</p>
                    </div>
                  ) : (
                    recommendedProblems.map((prob) => (
                      <div key={prob.id} className="col-12 col-lg-6">
                        <div className="univ-challenge-card">
                          
                          {/* Card Header with Match Score Badge */}
                          <div className="d-flex justify-content-between align-items-center gap-2 mb-2.5">
                            <div className="d-flex align-items-center gap-2 flex-wrap">
                              <span className="univ-id-badge">
                                #{prob.id}
                              </span>
                              <span className="univ-category-chip">
                                <i className="bi bi-tag-fill me-1"></i>{prob.category}
                              </span>
                            </div>
                            
                            {/* Dynamic Multi-Factor Match Score */}
                            {prob.matchScore !== undefined && (
                              <span 
                                className="univ-match-score-badge"
                                title="Dynamic match score computed by Python AI"
                              >
                                <i className="bi bi-stars me-1 text-warning"></i>
                                {prob.matchScore}% Match
                              </span>
                            )}
                          </div>

                          {/* Problem Title */}
                          <h3 className="univ-card-title cursor-pointer" onClick={() => handleOpenDetail(prob)}>
                            {prob.title}
                          </h3>

                          {/* Description */}
                          <p className="univ-card-desc">
                            {prob.description}
                          </p>

                          {/* Location & Meta Info Strip (Clean Spaced Badges) */}
                          <div className="univ-meta-strip">
                            <span className="univ-meta-item">
                              <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                              {getLocationLabel(prob.location, prob.locationName)}
                            </span>
                            {prob.distanceKm !== undefined && (
                              <span className="univ-meta-item">
                                <i className="bi bi-signpost-2 text-primary me-1"></i>
                                <strong>{prob.distanceKm} km</strong> away
                              </span>
                            )}
                            {prob.relevantDepartment && (
                              <span className="univ-meta-item dept">
                                <i className="bi bi-building text-success me-1"></i>
                                {prob.relevantDepartment}
                              </span>
                            )}
                          </div>

                          {/* Dynamic AI Explainability Box */}
                          {prob.matchReasons && prob.matchReasons.length > 0 && (
                            <div className="univ-reasons-box">
                              <div className="univ-reasons-header">
                                <i className="bi bi-cpu-fill text-success me-1.5"></i>
                                Why this matches <strong>{universityName}</strong>:
                              </div>
                              <ul className="univ-reasons-list">
                                {prob.matchReasons.map((reason, rIdx) => (
                                  <li key={rIdx}>
                                    <i className="bi bi-check2-circle text-success me-1.5 flex-shrink-0 mt-0.5"></i>
                                    <span>{reason}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Footer Action Buttons */}
                          <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-auto gap-2">
                            <button
                              type="button"
                              className="btn btn-sm univ-btn-secondary"
                              onClick={() => handleOpenDetail(prob)}
                            >
                              <i className="bi bi-eye me-1.5"></i> View Dossier
                            </button>

                            <button
                              type="button"
                              className="btn btn-sm univ-btn-accept"
                              onClick={(e) => handleOpenAccept(prob, e)}
                            >
                              <i className="bi bi-check-circle-fill me-1.5"></i> Accept Challenge
                            </button>
                          </div>

                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab 2: Accepted / Active University Challenges */}
              {activeTab === 'accepted' && (
                <div className="row g-3">
                  {acceptedProblems.length === 0 ? (
                    <div className="col-12 p-5 text-center bg-white rounded-4 border">
                      <i className="bi bi-folder2-open fs-2 text-muted mb-2"></i>
                      <h6 className="fw-bold text-dark">No Active Accepted Projects Yet</h6>
                      <p className="text-muted small mb-3">Accept recommended challenges from the AI matching feed to assign teams.</p>
                      <button
                        type="button"
                        className="btn btn-success btn-sm px-3"
                        onClick={() => setActiveTab('recommended')}
                      >
                        Browse Recommended Challenges
                      </button>
                    </div>
                  ) : (
                    acceptedProblems.map((prob) => (
                      <div key={prob.id} className="col-12 col-lg-6">
                        <div className="univ-challenge-card" style={{ borderLeft: '4.5px solid #036D33' }}>
                          
                          <div className="d-flex justify-content-between align-items-center gap-2 mb-2.5">
                            <div className="d-flex align-items-center gap-2 flex-wrap">
                              <span className="univ-id-badge">#{prob.id}</span>
                              <span className="badge bg-success">{prob.status}</span>
                            </div>
                            <span className="badge bg-light text-muted border" style={{ fontSize: '0.70rem' }}>
                              <i className="bi bi-calendar-check me-1"></i>
                              Accepted on {new Date(prob.assignedUniversity?.acceptedAt || prob.createdAt).toLocaleDateString('en-IN')}
                            </span>
                          </div>

                          <h3 className="univ-card-title">{prob.title}</h3>
                          <p className="univ-card-desc">
                            {prob.description}
                          </p>

                          {/* Assigned Faculty & Student Team Info */}
                          <div className="p-3 rounded-3 bg-light border mb-3">
                            <div className="row g-2 small" style={{ fontSize: '0.78rem' }}>
                              <div className="col-6">
                                <span className="text-muted d-block">Faculty Mentor:</span>
                                <strong className="text-dark">
                                  {prob.assignedUniversity?.facultyMentor || 'Pending Allocation'}
                                </strong>
                              </div>
                              <div className="col-6">
                                <span className="text-muted d-block">Student Research Team:</span>
                                <strong className="text-primary">
                                  {prob.assignedUniversity?.studentTeam || 'Pending Allocation'}
                                </strong>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-auto gap-2">
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm px-3 py-1.5 rounded-3 fw-semibold"
                              onClick={(e) => handleOpenAssign(prob, e)}
                              style={{ fontSize: '0.78rem' }}
                            >
                              <i className="bi bi-people-fill me-1.5"></i>
                              {prob.assignedUniversity?.facultyMentor ? 'Reassign Team' : 'Assign Team'}
                            </button>

                            <button
                              type="button"
                              className="btn btn-success btn-sm px-3.5 py-1.5 rounded-3 fw-semibold"
                              onClick={(e) => handleOpenSolution(prob, e)}
                              style={{ fontSize: '0.78rem' }}
                            >
                              <i className="bi bi-send-check-fill me-1.5"></i>
                              Submit Solution Blueprint
                            </button>
                          </div>

                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </section>

      </main>

      {/* MODAL 1: Challenge Dossier Detail */}
      {showDetailModal && selectedProblem && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(18, 50, 75, 0.65)', backdropFilter: 'blur(3px)', zIndex: 1060 }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-light py-3 px-4 border-bottom">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-file-earmark-text text-success fs-5"></i>
                  <h5 className="modal-title fw-bold text-dark mb-0" style={{ fontSize: '1.05rem' }}>
                    Civic Challenge Dossier #{selectedProblem.id}
                  </h5>
                </div>
                <button type="button" className="btn-close" onClick={() => setShowDetailModal(false)}></button>
              </div>

              <div className="modal-body p-4">
                <h4 className="h6 fw-bold text-dark mb-2">{selectedProblem.title}</h4>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  <span className="badge bg-light text-dark border">{selectedProblem.category}</span>
                  <span className="badge bg-danger-subtle text-danger border border-danger-subtle">
                    Priority: {selectedProblem.aiAnalysis?.priority || 'HIGH'} {selectedProblem.aiAnalysis?.priorityScore ? `(${selectedProblem.aiAnalysis.priorityScore}/100)` : ''}
                  </span>
                  {selectedProblem.matchScore !== undefined && (
                    <span className="badge bg-success-subtle text-success border border-success-subtle">
                      Match Score: {selectedProblem.matchScore}%
                    </span>
                  )}
                </div>

                <p className="text-secondary small mb-3" style={{ lineHeight: '1.6' }}>
                  {selectedProblem.description}
                </p>

                {selectedProblem.image && (
                  <div className="mb-3">
                    <span className="text-muted small fw-bold d-block mb-1">Visual Evidence:</span>
                    <img src={selectedProblem.image} alt="Evidence" className="rounded border img-fluid" style={{ maxHeight: '200px' }} />
                  </div>
                )}

                <div className="p-3 rounded-3 bg-light border mb-0">
                  <span className="fw-bold text-dark small d-block mb-1">Location Details:</span>
                  <div className="text-muted small">
                    📍 {getLocationLabel(selectedProblem.location, selectedProblem.locationName)} ({selectedProblem.district || 'Ranchi'})
                    {selectedProblem.latitude && selectedProblem.longitude ? ` • GPS: ${selectedProblem.latitude}, ${selectedProblem.longitude}` : ''}
                  </div>
                </div>
              </div>

              <div className="modal-footer bg-light py-2.5 px-4 border-top d-flex justify-content-between">
                <button type="button" className="btn btn-outline-secondary btn-sm px-3" onClick={() => setShowDetailModal(false)}>
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-success btn-sm px-3.5"
                  onClick={() => {
                    setShowDetailModal(false);
                    setShowAcceptModal(true);
                  }}
                >
                  Accept This Challenge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Accept Challenge Confirmation */}
      {showAcceptModal && selectedProblem && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(18, 50, 75, 0.65)', backdropFilter: 'blur(3px)', zIndex: 1060 }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-success-subtle py-3 px-4 border-bottom border-success-subtle">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-mortarboard-fill text-success fs-5"></i>
                  <h5 className="modal-title fw-bold text-success-emphasis mb-0" style={{ fontSize: '1.05rem' }}>
                    Accept Challenge for R&D?
                  </h5>
                </div>
                <button type="button" className="btn-close" onClick={() => setShowAcceptModal(false)}></button>
              </div>

              <div className="modal-body p-4 text-start">
                <p className="text-secondary small mb-2">
                  You are accepting civic challenge <strong>#{selectedProblem.id}</strong> (<em>{selectedProblem.title}</em>) on behalf of <strong>{universityName}</strong>.
                </p>
                <div className="p-2.5 rounded bg-light border text-muted small mb-0" style={{ fontSize: '0.74rem' }}>
                  ✓ Problem will be registered under your institution's active R&D portfolio.<br />
                  ✓ The citizen who reported this challenge will be notified automatically with your university name.
                </div>
              </div>

              <div className="modal-footer bg-light py-2.5 px-4 border-top d-flex justify-content-between">
                <button type="button" className="btn btn-outline-secondary btn-sm px-3" onClick={() => setShowAcceptModal(false)} disabled={isSubmittingAction}>
                  Cancel
                </button>
                <button type="button" className="btn btn-success btn-sm px-3.5 fw-semibold" onClick={handleConfirmAccept} disabled={isSubmittingAction}>
                  {isSubmittingAction ? 'Recording Acceptance...' : 'Confirm & Accept Challenge'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Assign Faculty & Student Team */}
      {showAssignModal && selectedProblem && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(18, 50, 75, 0.65)', backdropFilter: 'blur(3px)', zIndex: 1060 }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-light py-3 px-4 border-bottom">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-people-fill text-primary fs-5"></i>
                  <h5 className="modal-title fw-bold text-dark mb-0" style={{ fontSize: '1.05rem' }}>
                    Assign Project Team
                  </h5>
                </div>
                <button type="button" className="btn-close" onClick={() => setShowAssignModal(false)}></button>
              </div>

              <form onSubmit={handleConfirmAssign}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-dark">Faculty Mentor *</label>
                    <select
                      className="form-select form-select-sm"
                      value={selectedFaculty}
                      onChange={(e) => setSelectedFaculty(e.target.value)}
                      required
                    >
                      {profile?.faculty && profile.faculty.length > 0 ? (
                        profile.faculty.map((f) => (
                          <option key={f.id || f.name} value={f.name}>
                            {f.name} ({f.department} - {f.specialization})
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>No registered faculty mentors in profile</option>
                      )}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-dark">Student Research / Innovation Team *</label>
                    <select
                      className="form-select form-select-sm"
                      value={selectedTeam}
                      onChange={(e) => setSelectedTeam(e.target.value)}
                      required
                    >
                      {profile?.teams && profile.teams.length > 0 ? (
                        profile.teams.map((t) => (
                          <option key={t.id || t.name} value={t.name}>
                            {t.name} (Lead: {t.leadStudent}, {t.membersCount} members)
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>No registered student teams in profile</option>
                      )}
                    </select>
                  </div>
                </div>

                <div className="modal-footer bg-light py-2.5 px-4 border-top d-flex justify-content-between">
                  <button type="button" className="btn btn-outline-secondary btn-sm px-3" onClick={() => setShowAssignModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm px-3.5" disabled={isSubmittingAction}>
                    {isSubmittingAction ? 'Saving Team...' : 'Save & Assign Team'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Submit Solution Blueprint */}
      {showSolutionModal && selectedProblem && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(18, 50, 75, 0.65)', backdropFilter: 'blur(3px)', zIndex: 1060 }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-light py-3 px-4 border-bottom">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-send-check-fill text-success fs-5"></i>
                  <h5 className="modal-title fw-bold text-dark mb-0" style={{ fontSize: '1.05rem' }}>
                    Submit Technical Solution Blueprint
                  </h5>
                </div>
                <button type="button" className="btn-close" onClick={() => setShowSolutionModal(false)}></button>
              </div>

              <form onSubmit={handleConfirmSolution}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-dark">Technical Proposal Summary & Recommendations *</label>
                    <textarea
                      className="form-control form-control-sm"
                      rows={4}
                      value={solutionSummary}
                      onChange={(e) => setSolutionSummary(e.target.value)}
                      placeholder="Describe the engineering design, material specifications, deployment cost estimate, and expected durability..."
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-dark">Prototype Repository / CAD Blueprint URL</label>
                    <input
                      type="url"
                      className="form-control form-control-sm"
                      value={prototypeUrl}
                      onChange={(e) => setPrototypeUrl(e.target.value)}
                      placeholder="https://github.com/bitmesra-civic/pothole-polymer-design"
                    />
                  </div>
                </div>

                <div className="modal-footer bg-light py-2.5 px-4 border-top d-flex justify-content-between">
                  <button type="button" className="btn btn-outline-secondary btn-sm px-3" onClick={() => setShowSolutionModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success btn-sm px-4 fw-semibold" disabled={isSubmittingAction}>
                    {isSubmittingAction ? 'Submitting...' : 'Submit to Government Nodal Cell'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UniversityDashboard;
