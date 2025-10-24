/**
 * History Page Component
 * Displays run history with filtering and log access
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { historyAPI, logsAPI } from '../services/api';
import './History.css';

// PUBLIC_INTERFACE
/**
 * Run history component with filtering and log viewing
 */
const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    case_id: '',
    status: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        page_size: 20,
        ...(filters.case_id && { case_id: filters.case_id }),
        ...(filters.status && { status: filters.status }),
      };
      const response = await historyAPI.list(params);
      setHistory(response.items || []);
      setTotalPages(Math.ceil(response.total / response.page_size));
      setError(null);
    } catch (err) {
      setError('Failed to load history');
      console.error('Error loading history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewLogs = async (runId) => {
    try {
      const response = await logsAPI.getLogUrl(runId);
      if (response.log_url) {
        window.open(response.log_url, '_blank');
      } else {
        alert('No logs available for this run');
      }
    } catch (err) {
      alert('Failed to load logs: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(1); // Reset to first page on filter change
  };

  const clearFilters = () => {
    setFilters({ case_id: '', status: '' });
    setPage(1);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: 'status-pending',
      running: 'status-running',
      passed: 'status-passed',
      failed: 'status-failed',
      error: 'status-error',
    };
    return statusMap[status] || 'status-pending';
  };

  const formatDuration = (startedAt, finishedAt) => {
    if (!startedAt || !finishedAt) return 'N/A';
    const duration = new Date(finishedAt) - new Date(startedAt);
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  return (
    <div className="history-page">
      <div className="page-header">
        <button onClick={() => navigate('/')} className="btn-back">
          ← Back to Dashboard
        </button>
        <h1>Run History</h1>
        <p>View past test executions and logs</p>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label>Case ID</label>
          <input
            type="text"
            placeholder="Filter by case ID"
            value={filters.case_id}
            onChange={(e) => handleFilterChange('case_id', e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="running">Running</option>
            <option value="passed">Passed</option>
            <option value="failed">Failed</option>
            <option value="error">Error</option>
          </select>
        </div>
        <button onClick={clearFilters} className="btn btn-secondary">
          Clear Filters
        </button>
      </div>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      <div className="history-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="empty-state">
            <h3>No run history found</h3>
            <p>Execute some test cases to see results here</p>
            <button onClick={() => navigate('/')} className="btn btn-primary">
              Go to Tests
            </button>
          </div>
        ) : (
          <>
            <div className="history-list">
              {history.map((run) => (
                <div key={run.run_id} className="history-item">
                  <div className="history-main">
                    <div className="run-info">
                      <h3>Run ID: {run.run_id}</h3>
                      <p>Case ID: {run.case_id}</p>
                    </div>
                    <div className={`run-status ${getStatusBadge(run.status)}`}>
                      {run.status}
                    </div>
                  </div>
                  <div className="history-details">
                    <div className="detail-item">
                      <span className="detail-label">Started:</span>
                      <span className="detail-value">
                        {run.started_at 
                          ? new Date(run.started_at).toLocaleString()
                          : 'N/A'}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Finished:</span>
                      <span className="detail-value">
                        {run.finished_at 
                          ? new Date(run.finished_at).toLocaleString()
                          : 'N/A'}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Duration:</span>
                      <span className="detail-value">
                        {formatDuration(run.started_at, run.finished_at)}
                      </span>
                    </div>
                  </div>
                  <div className="history-actions">
                    {run.log_url && (
                      <button
                        onClick={() => handleViewLogs(run.run_id)}
                        className="btn btn-small btn-primary"
                      >
                        View Logs
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn btn-secondary"
                >
                  Previous
                </button>
                <span className="page-info">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn btn-secondary"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default History;
