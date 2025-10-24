/**
 * Test Detail Page Component
 * Shows detailed view of a test script with all its test cases
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { testsAPI, casesAPI, executionAPI, queueAPI } from '../services/api';
import './TestDetail.css';

// PUBLIC_INTERFACE
/**
 * Test detail component with case management
 */
const TestDetail = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCases, setSelectedCases] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadTestData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testId]);

  const loadTestData = async () => {
    try {
      setLoading(true);
      const [testData, casesData] = await Promise.all([
        testsAPI.get(testId),
        casesAPI.list({ test_script_id: testId, page_size: 100 }),
      ]);
      setTest(testData);
      setCases(casesData.items || []);
      setError(null);
    } catch (err) {
      setError('Failed to load test details');
      console.error('Error loading test:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCaseSelect = (caseId) => {
    setSelectedCases(prev => 
      prev.includes(caseId) 
        ? prev.filter(id => id !== caseId)
        : [...prev, caseId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCases.length === cases.length) {
      setSelectedCases([]);
    } else {
      setSelectedCases(cases.map(c => c.id));
    }
  };

  const handleExecute = async () => {
    if (selectedCases.length === 0) {
      alert('Please select at least one test case');
      return;
    }

    try {
      await executionAPI.execute(selectedCases, 'ad_hoc');
      alert(`Executing ${selectedCases.length} test case(s)`);
      setSelectedCases([]);
    } catch (err) {
      alert('Failed to execute tests: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleAddToQueue = async () => {
    if (selectedCases.length === 0) {
      alert('Please select at least one test case');
      return;
    }

    try {
      await queueAPI.add(selectedCases);
      alert(`Added ${selectedCases.length} test case(s) to queue`);
      setSelectedCases([]);
    } catch (err) {
      alert('Failed to add to queue: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleDeleteCase = async (caseId) => {
    if (!window.confirm('Are you sure you want to delete this test case?')) {
      return;
    }

    try {
      await casesAPI.delete(caseId);
      loadTestData();
    } catch (err) {
      alert('Failed to delete test case: ' + (err.response?.data?.detail || err.message));
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading test details...</p>
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error || 'Test not found'}</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="test-detail">
      <div className="detail-header">
        <button onClick={() => navigate('/')} className="btn-back">
          ← Back
        </button>
        <div className="header-info">
          <h1>{test.name}</h1>
          <p>{test.description || 'No description'}</p>
        </div>
      </div>

      <div className="detail-actions">
        <button 
          onClick={() => setShowCreateModal(true)} 
          className="btn btn-primary"
        >
          + Create Test Case
        </button>
        
        {selectedCases.length > 0 && (
          <>
            <button onClick={handleExecute} className="btn btn-success">
              Execute Selected ({selectedCases.length})
            </button>
            <button onClick={handleAddToQueue} className="btn btn-secondary">
              Add to Queue ({selectedCases.length})
            </button>
          </>
        )}
      </div>

      <div className="cases-section">
        <div className="cases-header">
          <h2>Test Cases ({cases.length})</h2>
          {cases.length > 0 && (
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedCases.length === cases.length}
                onChange={handleSelectAll}
              />
              Select All
            </label>
          )}
        </div>

        {cases.length === 0 ? (
          <div className="empty-state">
            <p>No test cases yet</p>
            <button 
              onClick={() => setShowCreateModal(true)} 
              className="btn btn-primary"
            >
              Create First Test Case
            </button>
          </div>
        ) : (
          <div className="cases-list">
            {cases.map((testCase) => (
              <div key={testCase.id} className="case-item">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedCases.includes(testCase.id)}
                    onChange={() => handleCaseSelect(testCase.id)}
                  />
                </label>
                <div className="case-content">
                  <h3>{testCase.name}</h3>
                  <p>{testCase.description || 'No description'}</p>
                  {testCase.variables && Object.keys(testCase.variables).length > 0 && (
                    <div className="case-variables">
                      Variables: {Object.keys(testCase.variables).length}
                    </div>
                  )}
                </div>
                <div className="case-actions">
                  <button
                    onClick={() => navigate(`/cases/${testCase.id}`)}
                    className="btn btn-small btn-secondary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCase(testCase.id)}
                    className="btn btn-small btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateCaseModal
          testScriptId={testId}
          onClose={() => setShowCreateModal(false)}
          onSuccess={loadTestData}
        />
      )}
    </div>
  );
};

/**
 * Modal component for creating new test cases
 */
const CreateCaseModal = ({ testScriptId, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Please enter a test case name');
      return;
    }

    setLoading(true);
    try {
      await casesAPI.create({
        test_script_id: testScriptId,
        name: name.trim(),
        description: description.trim() || null,
        variables: {},
      });
      onSuccess();
      onClose();
    } catch (err) {
      alert('Failed to create test case: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create Test Case</h2>
          <button onClick={onClose} className="btn-close">×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter test case name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter test case description"
              rows={4}
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TestDetail;
