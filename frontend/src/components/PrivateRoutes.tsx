import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function PrivateRoutes() {
  const { user, isLoading } = useAuth();
  
  if (!user?.id && !isLoading) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
