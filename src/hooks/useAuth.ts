import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthReturn {
  role: string | null;
  staffUser: string | null;
  isAuthenticated: boolean;
  logout: () => void;
}

/**
 * useAuth Hook
 * Checks if user has required role
 * Redirects to login if not authenticated or lacks permission
 */
export const useAuth = (requiredRole?: string | null): AuthReturn => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');

    // If role required but not present, redirect to login
    if (requiredRole && !role) {
      navigate('/staff-login');
      return;
    }

    // If specific role required and doesn't match, redirect to login
    if (requiredRole && role !== requiredRole) {
      navigate('/staff-login');
      return;
    }
  }, [requiredRole, navigate]);

  const role = localStorage.getItem('role');
  const staffUser = localStorage.getItem('staffUser');

  const logout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('staffUser');
    navigate('/staff-login');
  };

  return {
    role,
    staffUser,
    isAuthenticated: !!role,
    logout
  };
};
