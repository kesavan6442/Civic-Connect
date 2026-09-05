import React from 'react';

export const AiAnalysisCard = ({ analysis, onViewProblem }) => {
  if (!analysis) {
    return (
      <div className="card border-0 shadow-sm rounded-3 p-3 bg-white text-center">
        <i className="bi bi-cpu fs-3 text-muted mb-1"></i>
        <h6 className="fw-semibold text-dark mb-1" style={{ fontSize: '0.85rem' }}>AI Triage Engine</h6>
        <p className="small text-muted mb-0" style={{ fontSize: '0.74rem' }}>
          AI classification, duplicate analysis, and priority scoring will be processed.
        </p>
      </div>
    );
  }

  const {
    suggestedCategory = 'Roads & Infrastructure',
    categoryConfidence = 96,
    priority = 'HIGH',
    priorityReasoning = 'Critical safety hazard with high resident impact.',
    priorityConfidence = 94,
    duplicateProbability = 92,
    inputs = {
      textSimilarity: 92,
      imageSimilarity: 86,
      distanceMeters: 180
    },
    similarProblems = []
  } = analysis;

  const isHighPriority = priority === 'HIGH';

  return (
    <div className="card border-0 shadow-sm rounded-3 overflow-hidden bg-white">
      
      {/* Header */}
      <div className="card-header bg-white d-flex align-items-center justify-content-between py-3 px-4 border-bottom">
        <div className="d-flex align-items-center gap-2">
          <div className="p-1.5 bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center" style={{ width: '30px', height: '30px' }}>
            <i className="bi bi-robot fs-6"></i>
          </div>
          <div>
            <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: '0.90rem' }}>
              AI Analysis & Triage
            </h6>
            <small className="text-muted" style={{ fontSize: '0.72rem' }}>
              Multimodal verification (Text + Vision + Geospatial)
            </small>
          </div>
        </div>
        <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill px-2.5 py-1" style={{ fontSize: '0.72rem' }}>
          Confidence: {categoryConfidence || priorityConfidence}%
        </span>
      </div>

      <div className="card-body p-3.5">
        
        {/* 4 Metric Pills Grid */}
        <div className="row g-2 mb-3">
          
          {/* Suggested Category */}
          <div className="col-6">
            <div className="gov-stat-box h-100" style={{ padding: '10px' }}>
              <div className="text-muted small mb-0.5" style={{ fontSize: '0.70rem' }}>Suggested Category</div>
              <div className="fw-bold text-dark text-truncate" style={{ fontSize: '0.82rem' }}>
                {suggestedCategory}
              </div>
            </div>
          </div>

          {/* Priority */}
          <div className="col-6">
            <div className="gov-stat-box h-100" style={{ padding: '10px' }}>
              <div className="text-muted small mb-0.5" style={{ fontSize: '0.70rem' }}>Priority</div>
              <div>
                <span className={`badge ${isHighPriority ? 'bg-danger' : 'bg-warning text-dark'} px-2.5 py-1`} style={{ fontSize: '0.75rem' }}>
                  {priority}
                </span>
              </div>
            </div>
          </div>

          {/* Duplicate Probability */}
          <div className="col-6">
            <div className="gov-stat-box h-100" style={{ padding: '10px' }}>
              <div className="text-muted small mb-0.5" style={{ fontSize: '0.70rem' }}>Duplicate Probability</div>
              <div className="fw-bold text-dark" style={{ fontSize: '0.84rem' }}>
                <i className="bi bi-intersect text-warning me-1"></i>
                {duplicateProbability}%
              </div>
            </div>
          </div>

          {/* Confidence / Similar */}
          <div className="col-6">
            <div className="gov-stat-box h-100" style={{ padding: '10px' }}>
              <div className="text-muted small mb-0.5" style={{ fontSize: '0.70rem' }}>Similar Challenges</div>
              <div className="fw-bold text-dark" style={{ fontSize: '0.84rem' }}>
                <i className="bi bi-geo-alt text-danger me-1"></i>
                {similarProblems.length > 0 ? `${similarProblems.length} nearby` : 'None detected'}
              </div>
            </div>
          </div>

        </div>

        {/* Priority Reasoning note */}
        {priorityReasoning && (
          <div className="gov-info-box mb-3 text-muted small" style={{ padding: '10px', fontSize: '0.74rem' }}>
            <i className="bi bi-info-circle text-primary me-1"></i>
            {priorityReasoning}
          </div>
        )}

        {/* Multi-modal inputs breakdown */}
        <div className="gov-info-box mb-3" style={{ padding: '10px' }}>
          <div className="text-muted fw-semibold mb-1.5" style={{ fontSize: '0.70rem', textTransform: 'uppercase' }}>
            Duplicate Matching Inputs
          </div>
          <div className="d-flex align-items-center justify-content-between text-secondary" style={{ fontSize: '0.74rem' }}>
            <span><i className="bi bi-file-text me-1 text-primary"></i>Text: <strong>{inputs.textSimilarity}%</strong></span>
            <span><i className="bi bi-image me-1 text-success"></i>Vision: <strong>{inputs.imageSimilarity || '86'}%</strong></span>
            <span><i className="bi bi-geo-alt me-1 text-danger"></i>Distance: <strong>{inputs.distanceMeters || '180'}m</strong></span>
          </div>
        </div>

        {/* Similar Problems list */}
        {similarProblems && similarProblems.length > 0 && (
          <div>
            <div className="text-muted fw-semibold mb-1.5" style={{ fontSize: '0.70rem', textTransform: 'uppercase' }}>
              Nearby Similar Challenges
            </div>
            <div className="list-group list-group-flush border rounded-3 overflow-hidden">
              {similarProblems.map((sim, idx) => (
                <div key={idx} className="list-group-item d-flex align-items-center justify-content-between bg-white" style={{ padding: '10px' }}>
                  <div className="me-2 text-truncate">
                    <div className="d-flex align-items-center gap-1.5 mb-0.5">
                      <span className="badge bg-secondary font-monospace" style={{ fontSize: '0.65rem' }}>
                        {sim.id || 'CC-REF'}
                      </span>
                      <strong className="text-dark small text-truncate" style={{ fontSize: '0.78rem' }}>
                        {sim.title}
                      </strong>
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.70rem' }}>
                      <i className="bi bi-geo-alt text-danger me-0.5"></i>
                      {sim.distanceMeters || 180}m away • {sim.location || 'Harmu Bypass'}
                    </div>
                  </div>
                  {onViewProblem && sim.id && (
                    <button 
                      type="button" 
                      className="btn btn-sm btn-outline-primary py-0.5 px-2 rounded-pill flex-shrink-0"
                      onClick={() => onViewProblem(sim.id)}
                      style={{ fontSize: '0.72rem' }}
                    >
                      View
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AiAnalysisCard;
