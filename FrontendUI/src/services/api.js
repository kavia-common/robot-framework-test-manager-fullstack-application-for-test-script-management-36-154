/**
 * API service module for backend communication
 * Handles all HTTP requests to the Backend API
 */

import axios from 'axios';

// Base API URL - in production this should come from environment variables
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// PUBLIC_INTERFACE
/**
 * Authentication API calls
 */
export const authAPI = {
  /**
   * Login user and get JWT token
   * @param {string} username - Username
   * @param {string} password - Password
   * @returns {Promise} Token response
   */
  login: async (username, password) => {
    const response = await apiClient.post('/auth/login', { username, password });
    return response.data;
  },

  /**
   * Get current user info
   * @returns {Promise} User data with roles
   */
  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  /**
   * Logout and invalidate token
   * @returns {Promise}
   */
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },
};

// PUBLIC_INTERFACE
/**
 * Test Scripts API calls
 */
export const testsAPI = {
  /**
   * List all test scripts with pagination
   * @param {number} page - Page number
   * @param {number} pageSize - Items per page
   * @returns {Promise} Paginated test scripts
   */
  list: async (page = 1, pageSize = 20) => {
    const response = await apiClient.get('/tests', {
      params: { page, page_size: pageSize },
    });
    return response.data;
  },

  /**
   * Get a specific test script by ID
   * @param {string} testId - Test script UUID
   * @returns {Promise} Test script details
   */
  get: async (testId) => {
    const response = await apiClient.get(`/tests/${testId}`);
    return response.data;
  },

  /**
   * Create a new test script
   * @param {Object} data - Test script data
   * @returns {Promise} Created test script
   */
  create: async (data) => {
    const response = await apiClient.post('/tests', data);
    return response.data;
  },

  /**
   * Update an existing test script
   * @param {string} testId - Test script UUID
   * @param {Object} data - Updated test script data
   * @returns {Promise} Updated test script
   */
  update: async (testId, data) => {
    const response = await apiClient.put(`/tests/${testId}`, data);
    return response.data;
  },

  /**
   * Delete a test script
   * @param {string} testId - Test script UUID
   * @returns {Promise}
   */
  delete: async (testId) => {
    const response = await apiClient.delete(`/tests/${testId}`);
    return response.data;
  },
};

// PUBLIC_INTERFACE
/**
 * Test Cases API calls
 */
export const casesAPI = {
  /**
   * List all test cases with optional filtering
   * @param {Object} params - Query parameters
   * @returns {Promise} Paginated test cases
   */
  list: async (params = {}) => {
    const response = await apiClient.get('/cases', { params });
    return response.data;
  },

  /**
   * Get a specific test case by ID
   * @param {string} caseId - Test case UUID
   * @returns {Promise} Test case details
   */
  get: async (caseId) => {
    const response = await apiClient.get(`/cases/${caseId}`);
    return response.data;
  },

  /**
   * Create a new test case
   * @param {Object} data - Test case data
   * @returns {Promise} Created test case
   */
  create: async (data) => {
    const response = await apiClient.post('/cases', data);
    return response.data;
  },

  /**
   * Update an existing test case
   * @param {string} caseId - Test case UUID
   * @param {Object} data - Updated test case data
   * @returns {Promise} Updated test case
   */
  update: async (caseId, data) => {
    const response = await apiClient.put(`/cases/${caseId}`, data);
    return response.data;
  },

  /**
   * Delete a test case
   * @param {string} caseId - Test case UUID
   * @returns {Promise}
   */
  delete: async (caseId) => {
    const response = await apiClient.delete(`/cases/${caseId}`);
    return response.data;
  },
};

// PUBLIC_INTERFACE
/**
 * Execution API calls
 */
export const executionAPI = {
  /**
   * Execute one or more test cases
   * @param {Array<string>} caseIds - Test case UUIDs
   * @param {string} runType - 'ad_hoc' or 'queued'
   * @returns {Promise} Execution response
   */
  execute: async (caseIds, runType = 'ad_hoc') => {
    const response = await apiClient.post('/execute', { case_ids: caseIds, run_type: runType });
    return response.data;
  },
};

// PUBLIC_INTERFACE
/**
 * Queue API calls
 */
export const queueAPI = {
  /**
   * Get current execution queue
   * @returns {Promise} Queue items
   */
  list: async () => {
    const response = await apiClient.get('/queue');
    return response.data;
  },

  /**
   * Add test cases to queue
   * @param {Array<string>} caseIds - Test case UUIDs
   * @returns {Promise} Queue response
   */
  add: async (caseIds) => {
    const response = await apiClient.post('/queue', { case_ids: caseIds });
    return response.data;
  },

  /**
   * Remove a test case from queue
   * @param {string} caseId - Test case UUID
   * @returns {Promise}
   */
  remove: async (caseId) => {
    const response = await apiClient.delete(`/queue/${caseId}`);
    return response.data;
  },
};

// PUBLIC_INTERFACE
/**
 * Run History API calls
 */
export const historyAPI = {
  /**
   * List run history with filtering and pagination
   * @param {Object} params - Query parameters
   * @returns {Promise} Paginated run history
   */
  list: async (params = {}) => {
    const response = await apiClient.get('/history', { params });
    return response.data;
  },

  /**
   * Get details of a specific run
   * @param {string} runId - Run UUID
   * @returns {Promise} Run details
   */
  get: async (runId) => {
    const response = await apiClient.get(`/history/${runId}`);
    return response.data;
  },
};

// PUBLIC_INTERFACE
/**
 * Logs API calls
 */
export const logsAPI = {
  /**
   * Get execution log URL for a run
   * @param {string} runId - Run UUID
   * @returns {Promise} Log URL
   */
  getLogUrl: async (runId) => {
    const response = await apiClient.get(`/logs/${runId}`);
    return response.data;
  },
};

export default apiClient;
