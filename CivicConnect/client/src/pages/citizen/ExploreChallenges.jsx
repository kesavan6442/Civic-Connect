import React, { useState, useEffect } from 'react';
import { ProblemCard } from '../../components/problem/ProblemCard';
import { problemService, CIVIC_CATEGORIES } from '../../services/problemService';
import { JHARKHAND_DISTRICTS } from '../../components/maps/ProblemMap';
import { getLocationLabel } from '../../utils/location';

export const ExploreChallenges = ({ onNavigate, onViewDetails }) => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const loadPublicChallenges = async () => {
    try {
      setLoading(true);
      const data = await problemService.getPublicChallenges({
        search,
        category: selectedCategory,
        status: selectedStatus
      });
      let filtered = data;
      if (selectedDistrict !== 'All') {
        filtered = filtered.filter(p => p.district === selectedDistrict || getLocationLabel(p.location, p.locationName).includes(selectedDistrict));
      }
      setProblems(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPublicChallenges();
  }, [search, selectedCategory, selectedDistrict, selectedStatus]);

  const handleUpvote = async (id) => {
    await problemService.upvoteProblem(id);
    loadPublicChallenges();
  };

  const statusOptions = ['All', 'Under Review', 'Assigned', 'In Progress', 'Resolved'];

  return (
    <div className="explore-challenges-page">
      
      {/* Header */}
      <div className="d-flex align-items-center gap-2 mb-3">
        <button 
          type="button" 
          className="btn btn-gov-ghost px-2 py-1" 
          onClick={() => onNavigate('dashboard')} 
          aria-label="Back"
        >
          <i className="bi bi-arrow-left"></i>
        </button>
        <h1 className="h5 mb-0 fw-bold">Explore Public Challenges</h1>
      </div>

      {/* Filter Card */}
      <div className="card-gov p-3 mb-3">
        <div className="input-group mb-2">
          <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
          <input
            type="text"
            className="form-control"
            placeholder="Search challenges by keyword, road, or area..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => setSearch('')}
            >
              <i className="bi bi-x"></i>
            </button>
          )}
        </div>

        <div className="row g-2">
          <div className="col-12 col-sm-4">
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All categories</option>
              {CIVIC_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="col-6 col-sm-4">
            <select
              className="form-select"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              <option value="All">All districts</option>
              {JHARKHAND_DISTRICTS.map(d => (
                <option key={d.name} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="col-6 col-sm-4">
            <select
              className="form-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {statusOptions.map(st => (
                <option key={st} value={st}>{st === 'All' ? 'All statuses' : st}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Public Challenges */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" style={{ color: 'var(--gov-green)' }} role="status"></div>
          <p className="text-muted small mt-2">Loading public challenges across districts...</p>
        </div>
      ) : problems.length === 0 ? (
        <div className="card-gov p-5 text-center">
          <p className="text-muted mb-0">No public challenges match your filters.</p>
        </div>
      ) : (
        <div className="row g-3">
          {problems.map((problem) => (
            <div key={problem.id} className="col-12 col-md-6 col-xl-4">
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
  );
};

export default ExploreChallenges;
