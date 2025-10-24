/**
 * Tests for AuthContext
 */

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { authAPI } from '../services/api';

jest.mock('../services/api');

const TestComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'not authenticated'}</div>
      {user && <div data-testid="username">{user.username}</div>}
      <button onClick={() => login('testuser', 'testpass')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('should provide authentication context', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });
    
    expect(screen.getByTestId('auth-status')).toHaveTextContent('not authenticated');
  });

  test('should handle successful login', async () => {
    authAPI.login.mockResolvedValue({ access_token: 'test-token' });
    authAPI.getMe.mockResolvedValue({ username: 'testuser', roles: ['admin'] });

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    await act(async () => {
      screen.getByText('Login').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
    });
  });

  test('should handle logout', async () => {
    authAPI.logout.mockResolvedValue({});
    authAPI.getMe.mockResolvedValue({ username: 'testuser', roles: ['admin'] });
    
    await act(async () => {
      localStorage.setItem('authToken', 'test-token');
      localStorage.setItem('user', JSON.stringify({ username: 'testuser' }));
    });

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
    });

    await act(async () => {
      screen.getByText('Logout').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('not authenticated');
    });
  });
});
