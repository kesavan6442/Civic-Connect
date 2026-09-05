import React, { useState, useEffect } from 'react';
import { ProblemCard } from '../../components/problem/ProblemCard';
import { ProblemStatus } from '../../components/problem/ProblemStatus';
import { problemService, CIVIC_CATEGORIES } from '../../services/problemService';
import { getLocationLabel } from '../../utils/location';

export const MyProblems = ({ onNavigate, onViewDetails }) => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const data = await problemService.getMyProblems({
        search,
        category: selectedCategory,
        status: selectedStatus,
        sortBy
      });
      setProblems(data);
    } catch (err) {
      console.error('Error fetching problems:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [search, selectedCategory, selectedStatus, sortBy]);

  const handleUpvote = async (id) => {
    await problemService.upvoteProblem(id);
    fetchProblems();
  };

  const statusOptions = ['All', 'Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved'];

  return (
    <div className="my-problems-page">
      
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
        <h1 className="h5 mb-0 fw-bold">My Submissions</h1>
        <button 
          type="button" 
          className="btn btn-gov btn-sm ms-auto d-none d-sm-inline-flex align-items-center gap-1"
          onClick={() => onNavigate('submit')}
        >
          <i className="bi bi-plus-lg me-1"></i>New Challenge
        </button>
      </div>

      {/* Filter Card */}
      <div className="card-gov p-3 mb-3">
        <div className="row g-2">
          
          <div className="col-12 col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
              <input
                type="text"
                className="form-control"
                placeholder="Search my challenges..."
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
          </div>

          <div className="col-6 col-md-3">
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

          <div className="col-6 col-md-2">
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

          <div className="col-6 col-md-2">
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="upvotes">Most upvoted</option>
            </select>
          </div>

          <div className="col-12 col-md-2 d-flex justify-content-end">
            <div className="btn-group w-100" role="group">
              <button
                type="button"
                className={`btn btn-sm ${viewMode === 'grid' ? 'btn-gov' : 'btn-gov-ghost'}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <i className="bi bi-grid-fill"></i>
              </button>
              <button
                type="button"
                className={`btn btn-sm ${viewMode === 'table' ? 'btn-gov' : 'btn-gov-ghost'}`}
                onClick={() => setViewMode('table')}
                title="Table View"
              >
                <i className="bi bi-list-ul"></i>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* List / Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" style={{ color: 'var(--gov-green)' }} role="status"></div>
          <p className="text-muted small mt-2">Loading submissions...</p>
        </div>
      ) : problems.length === 0 ? (
        <div className="card-gov p-5 text-center">
          <p className="text-muted mb-3">No submissions match your search.</p>
          <div>
            <button
              type="button"
              className="btn btn-gov btn-sm"
              onClick={() => onNavigate('submit')}
            >
              Submit a Challenge Now
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="row g-3">
          {problems.map((problem) => (
            <div key={problem.id} className="col-12 col-lg-6">
              <ProblemCard
                problem={problem}
                onViewDetails={onViewDetails}
                onUpvote={handleUpvote}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="card-gov overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-muted small" style={{ fontSize: '0.74rem' }}>
                <tr>
                  <th scope="col" className="ps-3">ID</th>
                  <th scope="col">Title</th>
                  <th scope="col">Category</th>
                  <th scope="col">Location</th>
                  <th scope="col">Status</th>
                  <th scope="col">Date</th>
                  <th scope="col" className="text-end pe-3">Action</th>
                </tr>
              </thead>
              <tbody className="small" style={{ fontSize: '0.82rem' }}>
                {problems.map((p) => (
                  <tr key={p.id}>
                    <td className="ps-3 font-monospace fw-semibold text-secondary">
                      {p.id}
                    </td>
                    <td style={{ maxWidth: '280px' }}>
                      <div className="fw-semibold text-dark text-truncate">{p.title}</div>
                    </td>
                    <td>
                      <span className="chip-gov" style={{ fontSize: '0.70rem', padding: '0.2rem 0.5rem' }}>
                        {p.category}
                      </span>
                    </td>
                    <td style={{ maxWidth: '180px' }} className="text-truncate text-muted">
                      {getLocationLabel(p.location, p.locationName)}
                    </td>
                    <td>
                      <ProblemStatus status={p.status} compact={true} />
                    </td>
                    <td className="text-muted">
                      {new Date(p.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </td>
                    <td className="text-end pe-3">
                      <button
                        type="button"
                        className="btn btn-gov-outline btn-sm py-0.5 px-2.5"
                        onClick={() => onViewDetails(p.id)}
                        style={{ fontSize: '0.75rem' }}
                      >
                        Details <i className="bi bi-chevron-right"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyProblems;
