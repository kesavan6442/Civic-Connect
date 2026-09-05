import React from 'react';

export const getStatusClass = (status) => {
  switch (status) {
    case 'Resolved':
      return 'st-resolved';
    case 'In Progress':
      return 'st-progress';
    case 'Assigned':
      return 'st-assigned';
    case 'Under Review':
      return 'st-review';
    case 'Submitted':
    default:
      return 'st-submitted';
  }
};

export const ProblemStatus = ({ status = 'Submitted', timeline = [], compact = false }) => {
  const statusClass = getStatusClass(status);

  if (compact) {
    return (
      <span className={`badge-status ${statusClass}`}>
        <i className="bi bi-circle-fill me-1" style={{ fontSize: '0.45rem' }}></i>
        {status}
      </span>
    );
  }

  // 5-stage progress timeline
  const stages = timeline.length > 0 ? timeline : [
    { stage: 'Submitted', title: 'Challenge submitted', date: 'Day 1', completed: true, note: 'Challenge recorded by citizen.' },
    { stage: 'Under Review', title: 'Under review by district team', date: 'Day 1', completed: true, note: 'AI screening & municipal verification.' },
    { stage: 'Assigned', title: 'Department assignment', date: 'Day 2', completed: status !== 'Submitted', note: 'Transferred to engineering cell.' },
    { stage: 'In Progress', title: 'Repair work in progress', date: 'Day 3', completed: status === 'In Progress' || status === 'Resolved', note: 'Squad deployed on site.' },
    { stage: 'Resolved', title: 'Resolution & closure', date: 'Pending', completed: status === 'Resolved', note: 'Final inspection sign-off.' }
  ];

  return (
    <div className="card-gov p-3 p-md-4 mb-3">
      <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
        <h3 className="section-title-gov mb-0">
          <i className="bi bi-clock-history me-1.5" style={{ color: 'var(--gov-green)' }}></i>
          Progress Timeline
        </h3>
        <span className={`badge-status ${statusClass}`}>
          Status: {status}
        </span>
      </div>

      <ul className="timeline-gov mb-0">
        {stages.map((item, index) => {
          const isDone = item.completed;
          const isCurrent = !isDone && (index === 0 || stages[index - 1]?.completed);
          const itemClass = isDone ? 'done' : isCurrent ? 'current' : '';

          return (
            <li key={index} className={itemClass}>
              <div className="tl-title-gov">{item.title}</div>
              <div className="tl-meta-gov">{item.date} • {item.note || 'Awaiting update'}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ProblemStatus;
