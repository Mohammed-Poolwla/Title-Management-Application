import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import { useAuth } from '../hooks/useAuth';
import { useTitles } from '../hooks/useTitles';
import { useMetaMask } from '../hooks/useMetaMask';

jest.mock('../hooks/useAuth');
jest.mock('../hooks/useTitles');
jest.mock('../hooks/useMetaMask');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      logout: jest.fn(),
    });
    (useTitles as jest.Mock).mockReturnValue({
      titles:  [],
      fetchTitles: jest.fn(),
      addTitle: jest.fn(),
      deleteTitle: jest.fn(),
    });
    (useMetaMask as jest.Mock).mockReturnValue({
      account: null,
      connectWallet: jest.fn(),
      disconnectWallet: jest.fn(),
    });
  });

  it('renders dashboard', async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(screen.getByText(/title manager/i)).toBeInTheDocument();
    expect(screen.getByText(/your titles/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/subject/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/details/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add title/i })).toBeInTheDocument();
  });

  it('adds a new title', async () => {
    const mockAddTitle = jest.fn();
    (useTitles as jest.Mock).mockReturnValue({
      titles: [],
      fetchTitles: jest.fn(),
      addTitle: mockAddTitle,
      deleteTitle: jest.fn(),
    });
    (useMetaMask as jest.Mock).mockReturnValue({
      account: '0x1234567890123456789012345678901234567890',
      connectWallet: jest.fn(),
      disconnectWallet: jest.fn(),
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/subject/i), {
      target: { value: 'Test Subject' },
    });
    fireEvent.change(screen.getByPlaceholderText(/details/i), {
      target: { value: 'Test Details' },
    });

    fireEvent.click(screen.getByRole('button', { name: /add title/i }));

    await waitFor(() => {
      expect(mockAddTitle).toHaveBeenCalledWith('Test Subject', 'Test Details');
    });
  });

  it('deletes a title', async () => {
    const mockDeleteTitle = jest.fn();
    (useTitles as jest.Mock).mockReturnValue({
      titles: [{ id: '1', subject: 'Test Subject', details: 'Test Details' }],
      fetchTitles: jest.fn(),
      addTitle: jest.fn(),
      deleteTitle: mockDeleteTitle,
    });
    (useMetaMask as jest.Mock).mockReturnValue({
      account: '0x1234567890123456789012345678901234567890',
      connectWallet: jest.fn(),
      disconnectWallet: jest.fn(),
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    await waitFor(() => {
      expect(mockDeleteTitle).toHaveBeenCalledWith('1');
    });
  });

  it('connects wallet', async () => {
    const mockConnectWallet = jest.fn();
    (useMetaMask as jest.Mock).mockReturnValue({
      account: null,
      connectWallet: mockConnectWallet,
      disconnectWallet: jest.fn(),
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /connect wallet/i }));

    await waitFor(() => {
      expect(mockConnectWallet).toHaveBeenCalled();
    });
  });

  it('disconnects wallet', async () => {
    const mockDisconnectWallet = jest.fn();
    (useMetaMask as jest.Mock).mockReturnValue({
      account: '0x1234567890123456789012345678901234567890',
      connectWallet: jest.fn(),
      disconnectWallet: mockDisconnectWallet,
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /disconnect wallet/i }));

    await waitFor(() => {
      expect(mockDisconnectWallet).toHaveBeenCalled();
    });
  });
});