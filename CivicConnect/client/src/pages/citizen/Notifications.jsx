import React, { useState, useEffect } from 'react';
import notificationService from '../../services/notificationService';

export const Notifications = ({ onNavigate, onViewDetails }) => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'read'
  const [loading, setLoading] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getNotifications(filter);
      setNotifications(data);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const handleMarkAsRead = async (id, e) => {
    e?.stopPropagation();
    await notificationService.markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllAsRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setFeedbackMsg('All notifications marked as read.');
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  const handleDelete = async (id, e) => {
    e?.stopPropagation();
    await notificationService.deleteNotification(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleNotificationClick = (item) => {
    if (!item.read) {
      notificationService.markAsRead(item.id);
    }
    if (item.problemId && onViewDetails) {
      onViewDetails(item.problemId);
    }
  };

  const formatTime = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (_err) {
      return isoString;
    }
  };

  const unreadTotal = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications-page">
      {/* Page Header */}
      <div className="card-gov p-4 mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge rounded-pill" style={{ backgroundColor: 'var(--gov-green-soft)', color: 'var(--gov-green)', fontWeight: 600 }}>
                Citizen Updates
              </span>
              {unreadTotal > 0 && (
                <span className="badge rounded-pill bg-danger">
                  {unreadTotal} Unread
                </span>
              )}
            </div>
            <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--gov-navy)' }}>
              Notifications & Alerts
            </h1>
            <p className="text-muted small mb-0">
              Live status updates, departmental work orders, AI triage alerts, and milestone updates for your submissions.
            </p>
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm rounded-pill d-flex align-items-center gap-1.5"
              onClick={fetchNotifications}
              title="Refresh notifications"
            >
              <i className="bi bi-arrow-clockwise"></i>
              <span>Refresh</span>
            </button>
            <button
              type="button"
              className="btn btn-gov btn-sm d-flex align-items-center gap-1.5"
              onClick={handleMarkAllAsRead}
              disabled={unreadTotal === 0}
            >
              <i className="bi bi-check2-all"></i>
              <span>Mark All Read</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedbackMsg && (
          <div className="alert alert-success alert-dismissible fade show mt-3 mb-0 py-2 small" role="alert">
            <i className="bi bi-check-circle-fill me-2"></i>
            {feedbackMsg}
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="d-flex align-items-center gap-2 mb-3">
        <button
          type="button"
          className={`btn btn-sm rounded-pill px-3 ${filter === 'all' ? 'btn-gov' : 'btn-light text-secondary border'}`}
          onClick={() => setFilter('all')}
        >
          All Updates
        </button>
        <button
          type="button"
          className={`btn btn-sm rounded-pill px-3 ${filter === 'unread' ? 'btn-gov' : 'btn-light text-secondary border'}`}
          onClick={() => setFilter('unread')}
        >
          Unread Only
        </button>
        <button
          type="button"
          className={`btn btn-sm rounded-pill px-3 ${filter === 'read' ? 'btn-gov' : 'btn-light text-secondary border'}`}
          onClick={() => setFilter('read')}
        >
          Read
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="card-gov p-5 text-center">
          <div className="spinner-border text-success mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted small mb-0">Retrieving official alerts and status records...</p>
        </div>
      )}

      {/* Notification List */}
      {!loading && notifications.length > 0 && (
        <div className="d-flex flex-column gap-3">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`card-gov p-3.5 transition-all cursor-pointer position-relative ${
                !item.read ? 'border-start border-4 border-success' : 'opacity-90'
              }`}
              style={{
                backgroundColor: !item.read ? '#f8fcf9' : '#ffffff',
                borderColor: !item.read ? 'var(--gov-green)' : 'var(--line)',
                cursor: item.problemId ? 'pointer' : 'default'
              }}
              onClick={() => handleNotificationClick(item)}
            >
              <div className="d-flex align-items-start gap-3">
                {/* Icon Column */}
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                  style={{
                    width: '42px',
                    height: '42px',
                    backgroundColor: !item.read ? 'var(--gov-green-soft)' : '#edf2f7',
                    color: !item.read ? 'var(--gov-green)' : 'var(--muted)'
                  }}
                >
                  <i className={`bi ${item.icon || 'bi-bell'} fs-5`}></i>
                </div>

                {/* Content Column */}
                <div className="flex-grow-1" style={{ minWidth: 0 }}>
                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-1">
                    <div className="d-flex align-items-center gap-2">
                      <span className="fw-bold" style={{ color: 'var(--gov-navy)', fontSize: '0.94rem' }}>
                        {item.title}
                      </span>
                      {!item.read && (
                        <span className="badge bg-success" style={{ fontSize: '0.62rem' }}>
                          NEW
                        </span>
                      )}
                    </div>
                    <span className="text-muted" style={{ fontSize: '0.74rem' }}>
                      <i className="bi bi-clock me-1"></i>
                      {formatTime(item.timestamp)}
                    </span>
                  </div>

                  <p className="text-secondary small mb-2" style={{ lineHeight: '1.45' }}>
                    {item.message}
                  </p>

                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 pt-1 border-top border-light">
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-light text-dark border" style={{ fontSize: '0.68rem' }}>
                        {item.category}
                      </span>
                      {item.problemId && (
                        <span className="badge bg-white text-success border border-success" style={{ fontSize: '0.68rem' }}>
                          <i className="bi bi-hash me-0.5"></i>
                          {item.problemId}
                        </span>
                      )}
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      {item.problemId && (
                        <button
                          type="button"
                          className="btn btn-sm btn-link text-decoration-none text-success p-0 fw-semibold"
                          style={{ fontSize: '0.78rem' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onViewDetails) onViewDetails(item.problemId);
                          }}
                        >
                          View Challenge <i className="bi bi-arrow-right ms-0.5"></i>
                        </button>
                      )}

                      {!item.read && (
                        <button
                          type="button"
                          className="btn btn-sm btn-light border p-1 px-2 text-muted"
                          title="Mark as read"
                          style={{ fontSize: '0.72rem' }}
                          onClick={(e) => handleMarkAsRead(item.id, e)}
                        >
                          <i className="bi bi-check2 me-1"></i>Mark Read
                        </button>
                      )}

                      <button
                        type="button"
                        className="btn btn-sm btn-light border p-1 px-2 text-danger"
                        title="Delete notification"
                        style={{ fontSize: '0.72rem' }}
                        onClick={(e) => handleDelete(item.id, e)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && notifications.length === 0 && (
        <div className="card-gov p-5 text-center">
          <div className="d-inline-flex p-3 rounded-circle bg-light mb-3 text-muted">
            <i className="bi bi-bell-slash fs-1"></i>
          </div>
          <h4 className="fw-bold mb-2" style={{ color: 'var(--gov-navy)' }}>
            No Notifications Found
          </h4>
          <p className="text-muted small mx-auto mb-4" style={{ maxWidth: '420px' }}>
            {filter === 'unread'
              ? 'You have caught up with all official notifications and updates.'
              : 'You have not received any notifications yet. Updates regarding your reported challenges will appear here.'}
          </p>
          <div className="d-flex justify-content-center gap-2">
            {filter !== 'all' && (
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                onClick={() => setFilter('all')}
              >
                View All Notifications
              </button>
            )}
            <button
              type="button"
              className="btn btn-gov btn-sm px-3"
              onClick={() => onNavigate('submit')}
            >
              <i className="bi bi-plus-circle me-1.5"></i>
              Submit a Challenge
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
