/**
 * Queue Page Component
 * Displays and manages the test execution queue
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { queueAPI } from '../services/api';
import './Queue.css';

// PUBLIC_INTERFACE
/**
 * Queue management component
 */
const Queue = () => {
  const [queueItems, setQueueItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadQueue();
    // Refresh queue every 5 seconds
    const interval = setInterval(loadQueue, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadQueue = async () => {
    try {
      const items = await queueAPI.list();
      setQueueItems(items || []);
      setError(null);
    } catch (err) {
      setError('Failed to load queue');
      console.error('Error loading queue:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (caseId) => {
    if (!window.confirm('Remove this test case from the queue?')) {
      return;
    }

    try {
      await queueAPI.remove(caseId);
      loadQueue();
    } catch (err) {
      alert('Failed to remove from queue: ' + (err.response?.data?.detail || err.message));
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: 'status-pending',
      running: 'status-running',
      completed: 'status-completed',
      failed: 'status-failed',
    };
    return statusMap[status] || 'status-pending';
  };

  return (
    <div className="queue-page">
      <div className="page-header">
        <button onClick={() => navigate('/')} className="btn-back">
          ← Back to Dashboard
        </button>
        <h1>Execution Queue</h1>
        <p>Manage queued test cases</p>
      </div>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      <div className="queue-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading queue...</p>
          </div>
        ) : queueItems.length === 0 ? (
          <div className="empty-state">
            <h3>Queue is empty</h3>
            <p>No test cases are currently queued for execution</p>
            <button onClick={() => navigate('/')} className="btn btn-primary">
              Go to Tests
            </button>
          </div>
        ) : (
          <div className="queue-list">
            <div className="queue-header">
              <span className="header-priority">Priority</span>
              <span className="header-case">Test Case</span>
              <span className="header-status">Status</span>
              <span className="header-queued">Queued At</span>
              <span className="header-actions">Actions</span>
            </div>
            {queueItems.map((item) => (
              <div key={item.case_id} className="queue-item">
                <span className="item-priority">
                  {item.priority !== undefined ? item.priority : 0}
                </span>
                <span className="item-case">{item.case_id}</span>
                <span className={`item-status ${getStatusBadge(item.status)}`}>
                  {item.status}
                </span>
                <span className="item-queued">
                  {new Date(item.queued_at).toLocaleString()}
                </span>
                <span className="item-actions">
                  {item.status === 'pending' && (
                    <button
                      onClick={() => handleRemove(item.case_id)}
                      className="btn btn-small btn-danger"
                    >
                      Remove
                    </button>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Queue;
