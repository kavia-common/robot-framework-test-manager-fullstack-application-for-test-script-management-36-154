/**
 * Tests for API service module
 */

import { authAPI, testsAPI, executionAPI } from './api';

// Mock axios module
jest.mock('axios', () => {
  const mockAxios = {
    create: jest.fn(() => ({
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
    })),
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  };
  return mockAxios;
});

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('authAPI', () => {
    test('login should be defined', () => {
      expect(authAPI.login).toBeDefined();
      expect(typeof authAPI.login).toBe('function');
    });

    test('getMe should be defined', () => {
      expect(authAPI.getMe).toBeDefined();
      expect(typeof authAPI.getMe).toBe('function');
    });

    test('logout should be defined', () => {
      expect(authAPI.logout).toBeDefined();
      expect(typeof authAPI.logout).toBe('function');
    });
  });

  describe('testsAPI', () => {
    test('list should be defined', () => {
      expect(testsAPI.list).toBeDefined();
      expect(typeof testsAPI.list).toBe('function');
    });

    test('create should be defined', () => {
      expect(testsAPI.create).toBeDefined();
      expect(typeof testsAPI.create).toBe('function');
    });

    test('get should be defined', () => {
      expect(testsAPI.get).toBeDefined();
      expect(typeof testsAPI.get).toBe('function');
    });

    test('update should be defined', () => {
      expect(testsAPI.update).toBeDefined();
      expect(typeof testsAPI.update).toBe('function');
    });

    test('delete should be defined', () => {
      expect(testsAPI.delete).toBeDefined();
      expect(typeof testsAPI.delete).toBe('function');
    });
  });

  describe('executionAPI', () => {
    test('execute should be defined', () => {
      expect(executionAPI.execute).toBeDefined();
      expect(typeof executionAPI.execute).toBe('function');
    });
  });
});
