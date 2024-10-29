import { renderHook, act } from '@testing-library/react-hooks';
import { useTitles } from './useTitles';
import api from '../utils/api';

jest.mock('../utils/api');

describe('useTitles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch titles successfully', async () => {
    const mockTitles = [
      { id: '1', subject: 'Test Subject 1', details: 'Test Details 1' },
      { id: '2', subject: 'Test Subject 2', details: 'Test Details 2' },
    ];
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockTitles });

    const { result } = renderHook(() => useTitles());

    await act(async () => {
      await result.current.fetchTitles();
    });

    expect(result.current.titles).toEqual(mockTitles);
  });

  it('should add a title successfully', async () => {
    const newTitle = { id: '3', subject: 'New Subject', details: 'New Details' };
    (api.post as jest.Mock).mockResolvedValueOnce({ data: newTitle });

    const { result } = renderHook(() => useTitles());

    await act(async () => {
      await result.current.addTitle('New Subject', 'New Details');
    });

    expect(result.current.titles).toContainEqual(newTitle);
  });

  it('should delete a title successfully', async () => {
    const initialTitles = [
      { id: '1', subject: 'Test Subject 1', details: 'Test Details 1' },
      { id: '2', subject: 'Test Subject 2', details: 'Test Details 2' },
    ];
    (api.get as jest.Mock).mockResolvedValueOnce({ data: initialTitles });
    (api.delete as jest.Mock).mockResolvedValueOnce({});

    const { result } = renderHook(() => useTitles());

    await act(async () => {
      await result.current.fetchTitles();
    });

    await act(async () => {
      await result.current.deleteTitle('1');
    });

    expect(result.current.titles).toEqual([initialTitles[1]]);
  });
});