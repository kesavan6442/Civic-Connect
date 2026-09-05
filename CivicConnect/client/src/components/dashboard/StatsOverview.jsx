import React from 'react';

export const StatsOverview = ({ stats = {} }) => {
  const {
    totalSubmissions = 4,
    submitted = 1,
    underReview = 1,
    inProgress = 1,
    resolved = 1
  } = stats;

  const statCards = [
    {
      title: 'Total Submissions',
      count: totalSubmissions,
      subtext: 'Filed by you',
      icon: 'bi-files',
      bgClass: 'bg-primary bg-opacity-10 text-primary border-primary'
    },
    {
      title: 'Under Review / AI',
      count: underReview + submitted,
      subtext: 'In triage & verification',
      icon: 'bi-hourglass-split',
      bgClass: 'bg-info bg-opacity-10 text-info border-info'
    },
    {
      title: 'Work In Progress',
      count: inProgress,
      subtext: 'Department assigned',
      icon: 'bi-tools',
      bgClass: 'bg-warning bg-opacity-10 text-warning border-warning'
    },
    {
      title: 'Successfully Resolved',
      count: resolved,
      subtext: 'SLA verified',
      icon: 'bi-check-circle-fill',
      bgClass: 'bg-success bg-opacity-10 text-success border-success'
    }
  ];

  return (
    <div className="row g-3 mb-4">
      {statCards.map((card, idx) => (
        <div key={idx} className="col-6 col-lg-3">
          <div className="card h-100 shadow-sm border-0 rounded-3 p-3 bg-white transition-hover">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted fw-semibold small text-uppercase" style={{ fontSize: '0.72rem' }}>
                {card.title}
              </span>
              <div className={`p-2 rounded-circle border ${card.bgClass} d-flex align-items-center justify-content-center`} style={{ width: '36px', height: '36px' }}>
                <i className={`bi ${card.icon} fs-6`}></i>
              </div>
            </div>
            <div className="d-flex align-items-baseline gap-2">
              <h3 className="fw-bold text-dark mb-0">{card.count}</h3>
            </div>
            <div className="text-muted small mt-1" style={{ fontSize: '0.72rem' }}>
              {card.subtext}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;
