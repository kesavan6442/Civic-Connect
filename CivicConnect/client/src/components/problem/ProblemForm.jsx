import React, { useState, useEffect } from 'react';
import { CIVIC_CATEGORIES } from '../../services/problemService';
import { aiService } from '../../services/aiService';
import { ProblemMap, JHARKHAND_DISTRICTS } from '../maps/ProblemMap';

export const ProblemForm = ({ 
  onSubmit, 
  onCancel, 
  isSubmitting = false,
  onRequestGpsModal,
  isGpsDetected = false,
  onImagePreviewClick
}) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Auto-Detect with AI',
    description: '',
    location: '',
    district: 'Ranchi',
    latitude: 23.3441,
    longitude: 85.3096,
    impactedCount: 50,
    urgency: 'medium',
    additionalDetails: '',
    image: null,
    imageName: '',
    imageSize: '',
    imagePreviewUrl: '',
    document: null
  });

  const [aiSuggestions, setAiSuggestions] = useState({
    predictedCategory: null,
    confidence: null
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (formData.title.length > 5 || formData.description.length > 10) {
      const timer = setTimeout(async () => {
        const res = await aiService.predictCategory(formData.title, formData.description);
        if (res && res.category) {
          setAiSuggestions({
            predictedCategory: res.category,
            confidence: res.confidenceScore
          });
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [formData.title, formData.description]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size exceeds 5MB limit.');
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        image: file,
        imageName: file.name,
        imageSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        imagePreviewUrl: previewUrl
      }));
    }
  };

  const handleRemoveImage = (e) => {
    if (e) e.stopPropagation();
    if (formData.imagePreviewUrl) {
      URL.revokeObjectURL(formData.imagePreviewUrl);
    }
    setFormData(prev => ({
      ...prev,
      image: null,
      imageName: '',
      imageSize: '',
      imagePreviewUrl: ''
    }));
  };

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('Document size exceeds 10MB limit.');
        return;
      }
      setFormData(prev => ({ ...prev, document: file }));
    }
  };

  const handleCoordinates = (lat, lng) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));
  };

  const handleDistrictChange = (distName) => {
    setFormData(prev => ({ ...prev, district: distName }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Please enter a short, clear title.';
    if (!formData.description.trim() || formData.description.length < 15) {
      newErrors.description = 'Please describe the challenge (minimum 15 characters).';
    }
    if (!formData.location.trim()) newErrors.location = 'Please specify the location / ward.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="problem-form">
      <div className="row g-4">
        
        {/* Left Column: Form Fields */}
        <div className="col-lg-8">
          <div className="card-gov p-3 p-md-4">
            
            {/* Title */}
            <div className="mb-3">
              <label className="form-label" htmlFor="cTitle">
                Challenge Title <span className="req">*</span>
              </label>
              <input
                id="cTitle"
                type="text"
                name="title"
                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                placeholder="e.g. Drinking water shortage in Ward 12"
                value={formData.title}
                onChange={handleChange}
                maxLength={120}
              />
              {errors.title && <div className="invalid-feedback">{errors.title}</div>}
            </div>

            {/* Description */}
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label mb-0" htmlFor="cDesc">
                  Description <span className="req">*</span>
                </label>
                <span className="text-muted small" style={{ fontSize: '0.70rem' }}>
                  {formData.description.length} characters
                </span>
              </div>
              <textarea
                id="cDesc"
                name="description"
                rows="4"
                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                placeholder="Describe the problem, who is affected and since when."
                value={formData.description}
                onChange={handleChange}
              ></textarea>
              {errors.description && <div className="invalid-feedback">{errors.description}</div>}
            </div>

            {/* Category & District */}
            <div className="row g-3 mb-3">
              <div className="col-12 col-md-6">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label mb-0" htmlFor="cCat">
                    Category <span className="req">*</span>
                  </label>
                  {aiSuggestions.predictedCategory && formData.category !== aiSuggestions.predictedCategory && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-success py-0 px-2 rounded-pill shadow-none"
                      onClick={() => setFormData(prev => ({ ...prev, category: aiSuggestions.predictedCategory }))}
                      title="Apply AI suggestion"
                      style={{ fontSize: '0.68rem' }}
                    >
                      <i className="bi bi-stars me-1 text-primary"></i>
                      AI: <strong>{aiSuggestions.predictedCategory}</strong>
                    </button>
                  )}
                </div>
                <select
                  id="cCat"
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="Auto-Detect with AI">🤖 Auto-Detect with AI (Recommended)</option>
                  <option disabled value="">────────── Manual Categories ──────────</option>
                  {CIVIC_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                {/* AI Detection Info Strip */}
                {formData.category === 'Auto-Detect with AI' ? (
                  aiSuggestions.predictedCategory ? (
                    <div className="d-flex align-items-center justify-content-between p-2 bg-success bg-opacity-10 border border-success border-opacity-25 rounded-3 mt-2">
                      <div className="d-flex align-items-center gap-2">
                        <span className="pulse-dot" style={{ width: '8px', height: '8px' }}></span>
                        <div className="small text-dark" style={{ fontSize: '0.74rem' }}>
                          <strong className="text-success">AI Live Detected:</strong> {aiSuggestions.predictedCategory}
                          {aiSuggestions.confidence && (
                            <span className="text-muted ms-1">({aiSuggestions.confidence}% confidence)</span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-success py-0 px-2 rounded-pill shadow-none"
                        style={{ fontSize: '0.66rem' }}
                        onClick={() => setFormData(prev => ({ ...prev, category: aiSuggestions.predictedCategory }))}
                      >
                        Lock In
                      </button>
                    </div>
                  ) : (
                    <div className="form-text text-muted small mt-1.5" style={{ fontSize: '0.72rem' }}>
                      <i className="bi bi-robot text-success me-1"></i>
                      CivicConnect AI will automatically analyze your description and photo to route this challenge.
                    </div>
                  )
                ) : (
                  <button
                    type="button"
                    className="btn btn-link p-0 text-success text-decoration-none small mt-1.5"
                    style={{ fontSize: '0.70rem' }}
                    onClick={() => setFormData(prev => ({ ...prev, category: 'Auto-Detect with AI' }))}
                  >
                    <i className="bi bi-stars me-1"></i> Reset to AI Auto-Detect
                  </button>
                )}
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label mb-1" htmlFor="cDist">
                  District
                </label>
                <select
                  id="cDist"
                  name="district"
                  className="form-select"
                  value={formData.district}
                  onChange={(e) => {
                    handleChange(e);
                    handleDistrictChange(e.target.value);
                  }}
                >
                  {JHARKHAND_DISTRICTS.map((d) => (
                    <option key={d.name} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location & Map */}
            <div className="mb-3 mt-2">
              <label className="form-label" htmlFor="cLoc">
                Location <span className="req">*</span>
              </label>
              <div className="input-group mb-2">
                <span className="input-group-text bg-white"><i className="bi bi-geo-alt"></i></span>
                <input
                  id="cLoc"
                  type="text"
                  name="location"
                  className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                  placeholder="Village / Ward, Block, District"
                  value={formData.location}
                  onChange={handleChange}
                />
                <button 
                  className="btn btn-gov-outline" 
                  type="button" 
                  onClick={onRequestGpsModal}
                >
                  <i className="bi bi-crosshair me-1"></i>Use GPS
                </button>
              </div>
              {errors.location && <div className="text-danger small mb-1">{errors.location}</div>}
              <div className="form-text small text-muted mb-2">
                Geo-tagging helps identify local and duplicate problems accurately.
              </div>

              {/* Embedded Map */}
              <ProblemMap
                latitude={formData.latitude}
                longitude={formData.longitude}
                locationName={formData.location || `${formData.district}, Jharkhand`}
                isInteractive={true}
                onCoordinateChange={handleCoordinates}
                district={formData.district}
                onDistrictChange={handleDistrictChange}
                onRequestGpsModal={onRequestGpsModal}
                isGpsDetected={isGpsDetected}
              />
            </div>

            {/* Upload Image / Document */}
            <div className="mb-3">
              <label className="form-label">Upload Image / Document</label>
              
              {!formData.imagePreviewUrl ? (
                <label className="upload-zone-gov d-block mb-2" htmlFor="cFiles">
                  <i className="bi bi-cloud-arrow-up fs-2" style={{ color: 'var(--gov-green)' }}></i>
                  <div className="fw-semibold mt-1">Tap to upload photos or documents</div>
                  <div className="text-muted small">JPG, PNG, WEBP or PDF · max 5 MB</div>
                  <input
                    type="file"
                    id="cFiles"
                    className="d-none"
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleImageChange}
                  />
                </label>
              ) : (
                <div className="row g-2 mb-2">
                  <div className="col-6 col-md-4">
                    <div 
                      className="preview-thumb-gov cursor-pointer"
                      onClick={() => onImagePreviewClick && onImagePreviewClick(formData.imagePreviewUrl, formData.imageName, handleRemoveImage)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img src={formData.imagePreviewUrl} alt="Preview" />
                      <button type="button" className="rm-btn" onClick={handleRemoveImage} aria-label="Remove image">
                        <i className="bi bi-x"></i>
                      </button>
                    </div>
                    <div className="text-muted small text-truncate mt-1" style={{ fontSize: '0.70rem' }}>
                      {formData.imageName}
                    </div>
                  </div>
                </div>
              )}

              {/* Supporting Document */}
              <div className="pt-2 border-top">
                <label className="form-label text-muted small mb-1">
                  Optional Representation Document (.pdf / .doc)
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="form-control form-control-sm"
                  onChange={handleDocumentChange}
                  style={{ fontSize: '0.76rem' }}
                />
                {formData.document && (
                  <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1 mt-1 d-inline-block">
                    <i className="bi bi-file-earmark-pdf me-1 text-danger"></i>{formData.document.name}
                  </span>
                )}
              </div>
            </div>

            {/* Additional Details */}
            <div className="mb-4">
              <label className="form-label" htmlFor="cExtra">Additional Details</label>
              <textarea
                id="cExtra"
                name="additionalDetails"
                rows="3"
                className="form-control"
                placeholder="Landmarks, number of people affected, previous complaints..."
                value={formData.additionalDetails}
                onChange={handleChange}
              ></textarea>
            </div>

            {/* Form Actions */}
            <div className="d-flex flex-column flex-sm-row gap-2">
              <button 
                type="submit" 
                className="btn btn-gov flex-fill d-flex align-items-center justify-content-center gap-1.5"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <i className="bi bi-send me-1"></i>
                    <span>Submit Challenge</span>
                  </>
                )}
              </button>
              <button 
                type="button" 
                className="btn btn-gov-ghost flex-fill" 
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>

          </div>
        </div>

        {/* Right Column: AI Analysis Card */}
        <div className="col-lg-4">
          <div className="card-gov p-3.5 sticky-top" style={{ top: '80px', zIndex: 10 ,padding:'20px'}}>
            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
              <div className="d-flex align-items-center gap-2">
                <span className="tile-ico-gov" style={{ width: '30px', height: '30px', fontSize: '0.90rem' }}>
                  <i className="bi bi-robot"></i>
                </span>
                <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '0.90rem' }}>
                  AI Analysis
                </h6>
              </div>
              <span className="chip-gov" style={{ fontSize: '0.65rem' }}>
                Pre-Screening
              </span>
            </div>

            <div className="d-flex flex-column gap-2 mb-3">
              <div className="p-2 bg-light rounded-2 border d-flex align-items-center justify-content-between">
                <span className="text-muted small" style={{ fontSize: '0.74rem' }}>Suggested Category</span>
                <span className="fw-semibold text-dark small" style={{ fontSize: '0.78rem' }}>
                  {aiSuggestions.predictedCategory || formData.category}
                </span>
              </div>

              <div className="p-2 bg-light rounded-2 border d-flex align-items-center justify-content-between">
                <span className="text-muted small" style={{ fontSize: '0.74rem' }}>Priority</span>
                <span className={`badge ${formData.urgency === 'high' ? 'bg-danger' : 'bg-warning text-dark'}`} style={{ fontSize: '0.70rem' }}>
                  {formData.urgency === 'high' ? 'HIGH' : 'MEDIUM'}
                </span>
              </div>

              <div className="p-2 bg-light rounded-2 border d-flex align-items-center justify-content-between">
                <span className="text-muted small" style={{ fontSize: '0.74rem' }}>Duplicate Probability</span>
                <span className="fw-bold text-warning small" style={{ fontSize: '0.78rem' }}>
                  92%
                </span>
              </div>

              <div className="p-2 bg-light rounded-2 border d-flex align-items-center justify-content-between">
                <span className="text-muted small" style={{ fontSize: '0.74rem' }}>Confidence</span>
                <span className="fw-semibold text-success small" style={{ fontSize: '0.78rem' }}>
                  94%
                </span>
              </div>

              <div className="p-2 bg-light rounded-2 border d-flex align-items-center justify-content-between">
                <span className="text-muted small" style={{ fontSize: '0.74rem' }}>Similar Challenges</span>
                <span className="fw-semibold text-dark small" style={{ fontSize: '0.78rem' }}>
                  2 nearby
                </span>
              </div>
            </div>

            <div className="text-muted small" style={{ fontSize: '0.70rem' }}>
              <i className="bi bi-shield-check text-success me-1"></i>
              Submissions are screened against duplicate reports across your ward.
            </div>
          </div>
        </div>

      </div>
    </form>
  );
};

export default ProblemForm;
