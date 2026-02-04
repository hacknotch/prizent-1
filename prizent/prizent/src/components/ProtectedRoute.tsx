import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles }) => {
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && requiredRoles.length > 0) {
    const user = authService.getCurrentUser();
    const hasRequiredRole = user?.roles?.some((role: string) => requiredRoles.includes(role));
    
    if (!hasRequiredRole) {
      return <Navigate to="/categories" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
