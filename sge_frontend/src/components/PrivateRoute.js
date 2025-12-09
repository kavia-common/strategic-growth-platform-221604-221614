import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// PUBLIC_INTERFACE
const PrivateRoute = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="spinner"></div>
      </div>
    );
  }

  return session ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
