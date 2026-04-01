import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, Users, Briefcase, FileText,
  Shield, Menu, X, LogOut, MessageCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { InstagramIcon } from './InstagramIcon';

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
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-3 mb-4">
          <img
            src="/images/logo-brigada.png"
            alt="Brigada Camarão"
            className="w-11 h-11 rounded-full object-cover shadow-lg shadow-[#ba100a]/30 logo-pulse"
          />
          <div>
            <h1 className="text-sm font-black text-white uppercase tracking-tight leading-tight font-headline">
              Brigada Camarão
            </h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mt-0.5">
              Sentinel Command
            </p>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-gray-600/40 via-gray-700/20 to-transparent" />
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
                    ? 'flex items-center gap-3 text-white font-bold bg-white/10 border-l-[3px] border-[#ba100a] pl-[17px] pr-4 py-3 mx-2 transition-all'
                    : 'flex items-center gap-3 text-gray-400 hover:text-white hover:bg-white/5 pl-5 pr-4 py-3 mx-2 border-l-[3px] border-transparent transition-all'
                }
              >
                <item.icon className="w-[18px] h-[18px]" />
                <span className="text-sm">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Quick Social Links */}
      <div className="px-5 py-3 border-t border-gray-700/40">
        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2">Links Rápidos</p>
        <div className="flex items-center gap-2">
          <a
            href="https://www.instagram.com/brigadacamarao/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#E1306C]/15 text-[#E1306C] hover:bg-[#E1306C]/25 transition-colors text-xs font-bold flex-1 justify-center"
          >
            <InstagramIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Instagram</span>
          </a>
          <a
            href="https://wa.me/5531999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#25D366]/15 text-[#25D366] hover:bg-[#25D366]/25 transition-colors text-xs font-bold flex-1 justify-center"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>
      </div>

      {/* User Section */}
      <div className="px-5 py-4 border-t border-gray-700/40">
        {user && (
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#ba100a] flex items-center justify-center shrink-0">
              <span className="text-sm font-black text-white">
                {user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white truncate">{user.name}</p>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {roleLabel(user.role)}
              </span>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 text-gray-500 hover:text-red-400 text-sm font-semibold transition-all py-2.5 px-1"
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
        className="lg:hidden fixed top-3 left-3 z-50 p-3 bg-[#1e1e2d] rounded-xl text-white shadow-xl active:scale-95 transition-transform"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`lg:hidden fixed top-0 left-0 h-full w-[280px] sm:w-72 bg-[#1e1e2d] z-40 transform transition-transform duration-300 shadow-2xl ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      <aside className="hidden lg:flex flex-col h-screen w-64 bg-[#1e1e2d] sticky top-0">
        {sidebarContent}
      </aside>
    </>
  );
}
