/**
 * Tests for Dashboard component
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import { AuthProvider } from '../context/AuthContext';
import { testsAPI } from '../services/api';

jest.mock('../services/api');

const MockedDashboard = () => (
  <BrowserRouter>
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  </BrowserRouter>
);

describe('Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders dashboard with loading state', () => {
    testsAPI.list.mockImplementation(() => new Promise(() => {}));
    
    render(<MockedDashboard />);
    
    expect(screen.getByText(/loading tests/i)).toBeInTheDocument();
  });

  test('displays tests when loaded', async () => {
    testsAPI.list.mockResolvedValue({
      items: [
        { id: '1', name: 'Test 1', description: 'Description 1', created_at: '2024-01-01', updated_at: '2024-01-02' },
      ],
      total: 1,
      page: 1,
      page_size: 20,
    });

    render(<MockedDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Test 1')).toBeInTheDocument();
    });
  });

  test('displays empty state when no tests', async () => {
    testsAPI.list.mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      page_size: 20,
    });

    render(<MockedDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/no tests found/i)).toBeInTheDocument();
    });
  });

  test('handles error state', async () => {
    testsAPI.list.mockRejectedValue(new Error('Failed to load'));

    render(<MockedDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load tests/i)).toBeInTheDocument();
    });
  });
});
