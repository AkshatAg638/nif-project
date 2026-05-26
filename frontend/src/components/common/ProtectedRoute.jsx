import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect user to login page but save their original location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole) {
    const rolesOrder = ['user', 'editor', 'admin', 'super-admin'];
    const userRoleIndex = rolesOrder.indexOf(user.role);
    const requiredRoleIndex = rolesOrder.indexOf(requiredRole);

    if (userRoleIndex < requiredRoleIndex) {
      // User is authenticated but lacks required permission level
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
