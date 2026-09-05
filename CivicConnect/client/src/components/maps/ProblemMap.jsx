import React, { useState } from 'react';

// Common Jharkhand District Coordinates
export const JHARKHAND_DISTRICTS = [
  { name: 'Ranchi', lat: 23.3441, lng: 85.3096 },
  { name: 'East Singhbhum (Jamshedpur)', lat: 22.8046, lng: 86.2029 },
  { name: 'Dhanbad', lat: 23.7957, lng: 86.4304 },
  { name: 'Bokaro', lat: 23.6693, lng: 86.1511 },
  { name: 'Deoghar', lat: 24.4826, lng: 86.7001 },
  { name: 'Hazaribagh', lat: 23.9937, lng: 85.3623 },
  { name: 'Giridih', lat: 24.1856, lng: 86.3093 },
  { name: 'Ramgarh', lat: 23.6332, lng: 85.5149 },
  { name: 'Dumka', lat: 24.2694, lng: 87.2517 },
  { name: 'Palamu', lat: 24.0409, lng: 84.0722 }
];

export const ProblemMap = ({
  latitude = 23.3441,
  longitude = 85.3096,
  locationName = 'Ranchi, Jharkhand',
  isInteractive = false,
  onCoordinateChange,
  district = 'Ranchi',
  onDistrictChange,
  onRequestGpsModal,
  isGpsDetected = false
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const currentLat = latitude || 23.3441;
  const currentLng = longitude || 85.3096;

  const handleDistrictSelect = (e) => {
    const distName = e.target.value;
    const found = JHARKHAND_DISTRICTS.find(d => d.name === distName || d.name.includes(distName));
    if (found) {
      if (onCoordinateChange) onCoordinateChange(found.lat, found.lng);
      if (onDistrictChange) onDistrictChange(found.name);
    }
  };

  return (
    <div className="card-gov overflow-hidden">
      {/* Map Header */}
      <div className="d-flex align-items-center justify-content-between p-2.5 px-3 bg-white border-bottom">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-geo-alt-fill text-danger fs-6"></i>
          <span className="fw-semibold text-dark" style={{ fontSize: '0.84rem' }}>
            Geo-tagged Location
          </span>
        </div>

        {isInteractive && (
          <button
            type="button"
            className="btn btn-gov-outline btn-sm py-0.5 px-2.5 d-flex align-items-center gap-1"
            onClick={onRequestGpsModal}
            style={{ fontSize: '0.75rem' }}
          >
            <i className="bi bi-crosshair"></i>
            <span>Use GPS</span>
          </button>
        )}
      </div>

      {/* GPS Detected Pill */}
      {isGpsDetected && (
        <div className="bg-success bg-opacity-10 border-bottom border-success border-opacity-25 px-3 py-1.5 d-flex align-items-center justify-content-between">
          <span className="small text-success fw-semibold" style={{ fontSize: '0.74rem' }}>
            📍 Location detected • {district}, Jharkhand
          </span>
          <span className="badge bg-success text-white font-monospace" style={{ fontSize: '0.66rem' }}>
            {currentLat.toFixed(4)}° N, {currentLng.toFixed(4)}° E
          </span>
        </div>
      )}

      {/* Map Box */}
      <div className="map-box-gov position-relative bg-light">
        <iframe
          title="Problem Location Map"
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'contrast(1.02)' }}
          loading="lazy"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${currentLng - 0.012}%2C${currentLat - 0.008}%2C${currentLng + 0.012}%2C${currentLat + 0.008}&layer=mapnik&marker=${currentLat}%2C${currentLng}`}
        ></iframe>

        <div className="position-absolute bottom-0 start-0 m-2 px-2 py-0.5 rounded-pill bg-white shadow-sm border" style={{ zIndex: 5 }}>
          <span className="text-dark font-monospace fw-semibold" style={{ fontSize: '0.70rem' }}>
            <i className="bi bi-pin-map-fill text-danger me-1"></i>
            {currentLat.toFixed(4)}° N, {currentLng.toFixed(4)}° E
          </span>
        </div>
      </div>

      {/* Expandable Advanced Location Details */}
      {isInteractive && (
        <div className="p-2.5 px-3 bg-light bg-opacity-50 border-top">
          <div className="d-flex align-items-center justify-content-between">
            <button
              type="button"
              className="btn btn-link btn-sm text-decoration-none text-secondary p-0 d-flex align-items-center gap-1"
              onClick={() => setShowAdvanced(!showAdvanced)}
              style={{ fontSize: '0.74rem' }}
            >
              <i className={`bi ${showAdvanced ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
              <span>{showAdvanced ? 'Hide coordinates' : 'Show coordinate details'}</span>
            </button>
            <span className="text-muted small" style={{ fontSize: '0.70rem' }}>
              {locationName}
            </span>
          </div>

          {showAdvanced && (
            <div className="row g-2 mt-1.5 pt-2 border-top">
              <div className="col-sm-4">
                <label className="form-label text-muted mb-0.5" style={{ fontSize: '0.68rem' }}>District Preset</label>
                <select 
                  className="form-select form-select-sm"
                  value={district}
                  onChange={handleDistrictSelect}
                  style={{ fontSize: '0.76rem' }}
                >
                  {JHARKHAND_DISTRICTS.map(d => (
                    <option key={d.name} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="col-sm-4">
                <label className="form-label text-muted mb-0.5" style={{ fontSize: '0.68rem' }}>Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  className="form-control form-control-sm font-monospace"
                  value={currentLat}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value) || 0;
                    if (onCoordinateChange) onCoordinateChange(v, currentLng);
                  }}
                  style={{ fontSize: '0.76rem' }}
                />
              </div>

              <div className="col-sm-4">
                <label className="form-label text-muted mb-0.5" style={{ fontSize: '0.68rem' }}>Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  className="form-control form-control-sm font-monospace"
                  value={currentLng}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value) || 0;
                    if (onCoordinateChange) onCoordinateChange(currentLat, v);
                  }}
                  style={{ fontSize: '0.76rem' }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProblemMap;
