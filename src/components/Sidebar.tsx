import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, Users, Briefcase, FileText,
  Shield, Menu, X, Flame, LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Painel', end: true },
  { to: '/admin/coo', icon: Shield, label: 'Painel COO' },
  { to: '/admin/eventos', icon: Calendar, label: 'Eventos' },
  { to: '/admin/vagas', icon: Briefcase, label: 'Vagas' },
  { to: '/admin/orcamentos', icon: FileText, label: 'Orçamentos' },
  { to: '/admin/equipe', icon: Users, label: 'Equipe' },
];

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const roleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'coo': return 'COO';
      default: return 'Equipe';
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand Block */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-on-primary-container flex items-center justify-center shadow-lg shadow-primary/30 logo-pulse">
            <Flame className="w-6 h-6 text-on-primary" />
          </div>
          <div>
            <h1 className="text-sm font-black text-on-surface uppercase tracking-tight leading-tight font-headline">
              Brigada Camarão
            </h1>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em] mt-0.5">
              Sentinel Command
            </p>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-primary/20 via-outline-variant/30 to-transparent" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-1">
        <ul className="flex flex-col gap-0.5">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? 'flex items-center gap-4 bg-white text-primary font-bold rounded-l-full ml-4 pl-4 py-3 border-r-4 border-primary transition-all shadow-sm glow-primary'
                    : 'flex items-center gap-4 text-on-surface-variant px-8 py-3 hover:bg-surface-container-high/60 hover:text-on-surface rounded-lg mx-3 transition-all card-hover'
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Section */}
      <div className="px-5 py-4 border-t border-outline-variant/20">
        {user && (
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-on-primary-container flex items-center justify-center shadow-md">
              <span className="text-sm font-black text-on-primary">
                {user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-on-surface truncate">{user.name}</p>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container text-[10px] font-black uppercase tracking-wider">
                {roleLabel(user.role)}
              </span>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 text-on-surface-variant hover:text-error hover:bg-error-container/40 text-sm font-semibold transition-all py-2.5 px-3 rounded-xl"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair do Sistema</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-3 left-3 z-50 p-3 bg-primary rounded-2xl text-on-primary shadow-xl shadow-primary/30 active:scale-95 transition-transform"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`lg:hidden fixed top-0 left-0 h-full w-[280px] sm:w-72 glass-strong z-40 transform transition-transform duration-300 shadow-2xl ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      <aside className="hidden lg:flex flex-col h-screen w-64 sidebar-gradient sticky top-0 border-r border-outline-variant/10">
        {sidebarContent}
      </aside>
    </>
  );
}
