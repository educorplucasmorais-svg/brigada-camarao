import { Navigate, Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';

export function AdminLayout() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="p-4 pt-16 sm:p-6 sm:pt-18 lg:p-8 lg:pt-8 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
