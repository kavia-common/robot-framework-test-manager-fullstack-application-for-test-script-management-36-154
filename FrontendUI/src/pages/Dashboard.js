/**
 * Dashboard Page Component
 * Main view showing all test scripts as cards
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { testsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

// PUBLIC_INTERFACE
/**
 * Dashboard component with test cards
 */
const Dashboard = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    loadTests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const loadTests = async () => {
    try {
      setLoading(true);
      const response = await testsAPI.list(page, 20);
      setTests(response.items || []);
      setTotalPages(Math.ceil(response.total / response.page_size));
      setError(null);
    } catch (err) {
      setError('Failed to load tests. Please try again.');
      console.error('Error loading tests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTest = () => {
    navigate('/tests/create');
  };

  const handleTestClick = (testId) => {
    navigate(`/tests/${testId}`);
  };

  const handleDeleteTest = async (testId, e) => {
    e.stopPropagation();
    
    if (!window.confirm('Are you sure you want to delete this test? This action cannot be undone.')) {
      return;
    }

    try {
      await testsAPI.delete(testId);
      loadTests();
    } catch (err) {
      alert('Failed to delete test: ' + (err.response?.data?.detail || err.message));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Robot Framework Test Manager</h1>
          <div className="header-actions">
            <span className="user-info">
              {user?.username} ({user?.roles?.join(', ')})
            </span>
            <button onClick={logout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button className="nav-item active" onClick={() => navigate('/')}>
          Tests
        </button>
        <button className="nav-item" onClick={() => navigate('/queue')}>
          Queue
        </button>
        <button className="nav-item" onClick={() => navigate('/history')}>
          History
        </button>
      </nav>

      <main className="dashboard-main">
        <div className="content-header">
          <h2>Test Scripts</h2>
          <button onClick={handleCreateTest} className="btn btn-primary">
            + Create Test
          </button>
        </div>

        {error && (
          <div className="error-banner" role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading tests...</p>
          </div>
        ) : tests.length === 0 ? (
          <div className="empty-state">
            <h3>No tests found</h3>
            <p>Create your first test to get started</p>
            <button onClick={handleCreateTest} className="btn btn-primary">
              Create Test
            </button>
          </div>
        ) : (
          <>
            <div className="tests-grid">
              {tests.map((test) => (
                <div
                  key={test.id}
                  className="test-card"
                  onClick={() => handleTestClick(test.id)}
                >
                  <div className="test-card-header">
                    <h3>{test.name}</h3>
                    <button
                      className="btn-icon delete-btn"
                      onClick={(e) => handleDeleteTest(test.id, e)}
                      aria-label="Delete test"
                    >
                      ×
                    </button>
                  </div>
                  <p className="test-description">
                    {test.description || 'No description'}
                  </p>
                  <div className="test-card-footer">
                    <span className="test-date">
                      Created: {formatDate(test.created_at)}
                    </span>
                    <span className="test-date">
                      Updated: {formatDate(test.updated_at)}
                    </span>
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
      </main>
    </div>
  );
};

export default Dashboard;
