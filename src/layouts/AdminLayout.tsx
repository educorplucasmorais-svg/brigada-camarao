import { Navigate, Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';

export function AdminLayout() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user || user.role === 'staff') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 pt-16 lg:p-8 lg:pt-8 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
