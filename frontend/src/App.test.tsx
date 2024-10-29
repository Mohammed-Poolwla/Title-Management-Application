import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { useAuth } from './hooks/useAuth';

jest.mock('./hooks/useAuth');
jest.mock('./components/Login', () => () => <div>Login Component</div>);
jest.mock('./components/Register', () => () => <div>Register Component</div>);
jest.mock('./components/Dashboard', () => () => <div>Dashboard Component</div>);

describe('App Component', () => {
  it('renders login route', () => {
    (useAuth as jest.Mock).mockReturnValue({ token: null });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Login Component')).toBeInTheDocument();
  });

  it('renders register route', () => {
    (useAuth as jest.Mock).mockReturnValue({ token: null });

    render(
      <MemoryRouter initialEntries={['/register']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Register Component')).toBeInTheDocument();
  });

  it('renders dashboard route when authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ token: 'mock-token' });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard Component')).toBeInTheDocument();
  });

  it('redirects to login when accessing dashboard without authentication', () => {
    (useAuth as jest.Mock).mockReturnValue({ token: null });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Login Component')).toBeInTheDocument();
  });
});