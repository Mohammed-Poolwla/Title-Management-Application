import { renderHook, act } from '@testing-library/react-hooks';
import { useAuth } from './useAuth';
import api from '../utils/api';

jest.mock('../utils/api');

describe('useAuth', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });

  it('should login successfully', async () => {
    const mockUser = { id: '1', email: 'test@example.com' };
    const mockToken = 'mock-token';
    (api.post as jest.Mock).mockResolvedValueOnce({ data: { user: mockUser, token: mockToken } });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe(mockToken);
    expect(localStorage.getItem('token')).toBe(mockToken);
    expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
  });

  it('should register successfully', async () => {
    const mockUser = { id: '1', email: 'test@example.com' };
    const mockToken = 'mock-token';
    (api.post as jest.Mock).mockResolvedValueOnce({ data: { user: mockUser, token: mockToken } });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.register('testUser','test@example.com', 'password');
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe(mockToken);
    expect(localStorage.getItem('token')).toBe(mockToken);
    expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
  });

  it('should logout successfully', () => {
    localStorage.setItem('token', 'mock-token');
    localStorage.setItem('user', JSON.stringify({ id: '1', email: 'test@example.com' }));

    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });
});