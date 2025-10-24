/**
 * Create Test Page Component
 * Step-by-step wizard for creating new test scripts
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { testsAPI } from '../services/api';
import './CreateTest.css';

// PUBLIC_INTERFACE
/**
 * Wizard component for creating test scripts
 */
const CreateTest = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    metadata: {},
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateStep = () => {
    if (step === 1 && !formData.name.trim()) {
      setError('Please enter a test name');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
    setError('');
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setLoading(true);
    try {
      const response = await testsAPI.create({
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        meta_data: formData.metadata,
      });
      
      // Navigate to the newly created test
      if (response.data && response.data.id) {
        navigate(`/tests/${response.data.id}`);
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create test');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-test-page">
      <div className="wizard-container">
        <div className="wizard-header">
          <button onClick={() => navigate('/')} className="btn-back">
            ← Cancel
          </button>
          <h1>Create New Test Script</h1>
          <div className="wizard-progress">
            <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
              1. Basic Info
            </div>
            <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
              2. Description
            </div>
            <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
              3. Review
            </div>
          </div>
        </div>

        <div className="wizard-content">
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="wizard-step">
              <h2>Test Information</h2>
              <p>Enter the basic information for your test script</p>
              <div className="form-group">
                <label htmlFor="name">Test Name *</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., User Login Test Suite"
                  autoFocus
                  required
                />
                <span className="form-hint">
                  Choose a descriptive name for your test script
                </span>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="wizard-step">
              <h2>Description</h2>
              <p>Add a detailed description (optional)</p>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the purpose and scope of this test script..."
                  rows={6}
                />
                <span className="form-hint">
                  Help others understand what this test script does
                </span>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="wizard-step">
              <h2>Review & Create</h2>
              <p>Review your test script details before creating</p>
              <div className="review-section">
                <div className="review-item">
                  <strong>Test Name:</strong>
                  <span>{formData.name}</span>
                </div>
                <div className="review-item">
                  <strong>Description:</strong>
                  <span>{formData.description || 'No description'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="wizard-footer">
          <button
            onClick={() => navigate('/')}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <div className="footer-right">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="btn btn-secondary"
                disabled={loading}
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={handleNext}
                className="btn btn-primary"
                disabled={loading}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Test'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTest;
