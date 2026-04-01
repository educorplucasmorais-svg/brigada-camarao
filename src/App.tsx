import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AdminLayout } from './layouts/AdminLayout';
import { PublicLayout } from './layouts/PublicLayout';
import { LoginPage } from './pages/public/LoginPage';
import { AvailableEventsPage } from './pages/public/AvailableEventsPage';
import { MissionDetailsPage } from './pages/public/MissionDetailsPage';
import { RegistrationConfirmPage } from './pages/public/RegistrationConfirmPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { COODashboardPage } from './pages/admin/COODashboardPage';
import { EventManagementPage } from './pages/admin/EventManagementPage';
import { VacancyManagementPage } from './pages/admin/VacancyManagementPage';
import { QuotesPage } from './pages/admin/QuotesPage';
import { TeamDirectoryPage } from './pages/admin/TeamDirectoryPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LoginPage />} />
            <Route path="/eventos" element={<AvailableEventsPage />} />
            <Route path="/missao/:id" element={<MissionDetailsPage />} />
            <Route path="/confirmacao" element={<RegistrationConfirmPage />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="coo" element={<COODashboardPage />} />
            <Route path="eventos" element={<EventManagementPage />} />
            <Route path="vagas" element={<VacancyManagementPage />} />
            <Route path="orcamentos" element={<QuotesPage />} />
            <Route path="equipe" element={<TeamDirectoryPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
