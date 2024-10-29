import React, { useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import { useAuth } from './hooks/useAuth';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = React.memo(({ children }) => {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/login" />;
});

const App: React.FC = () => {
  const routes = useMemo(() => (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  ), []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {routes}
      </div>
    </Router>
  );
};

export default App;