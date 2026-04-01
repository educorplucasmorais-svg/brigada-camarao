import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Icon = ({ name, filled = false, className = '' }: { name: string; filled?: boolean; className?: string }) => (
  <span
    className={`material-symbols-outlined ${className}`}
    style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}
  >
    {name}
  </span>
);

const navItems = [
  { to: '/admin', icon: 'dashboard', label: 'Painel', end: true },
  { to: '/admin/coo', icon: 'monitoring', label: 'Painel COO' },
  { to: '/admin/eventos', icon: 'emergency', label: 'Eventos' },
  { to: '/admin/vagas', icon: 'work', label: 'Vagas' },
  { to: '/admin/orcamentos', icon: 'request_quote', label: 'Orçamentos' },
  { to: '/admin/equipe', icon: 'groups', label: 'Equipe' },
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
            className="w-11 h-11 rounded-full object-cover shadow-md"
          />
          <div>
            <h1 className="text-sm font-black text-on-surface uppercase tracking-tight leading-tight">
              Brigada Camarão
            </h1>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em] mt-0.5">
              Sentinel Command
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-1">
        <ul className="flex flex-col">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? 'flex items-center gap-4 bg-surface-container-lowest text-primary-container font-bold rounded-l-full ml-4 pl-4 py-3 border-r-4 border-primary-container transition-all'
                    : 'flex items-center gap-4 text-on-surface-variant px-8 py-3 hover:text-primary-container transition-all'
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon name={item.icon} filled={isActive} className="text-xl" />
                    <span className="text-sm">{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Quick Social Links */}
      <div className="px-5 py-3 border-t border-surface-container-high">
        <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Links Rápidos</p>
        <div className="flex items-center gap-2">
          <a
            href="https://www.instagram.com/brigadacamarao/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#E1306C]/10 text-[#E1306C] hover:bg-[#E1306C]/20 transition-colors text-xs font-bold flex-1 justify-center"
          >
            <Icon name="photo_camera" className="text-base" />
            <span className="hidden sm:inline">Instagram</span>
          </a>
          <a
            href="https://wa.me/5531999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors text-xs font-bold flex-1 justify-center"
          >
            <Icon name="chat" className="text-base" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>
      </div>

      {/* User Section */}
      <div className="px-5 py-4 border-t border-surface-container-high">
        {user && (
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center shrink-0">
              <span className="text-sm font-black text-on-primary">
                {user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-on-surface truncate">{user.name}</p>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                {roleLabel(user.role)}
              </span>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 text-on-surface-variant hover:text-error text-sm font-semibold transition-all py-2.5 px-1 rounded-xl hover:bg-error/5"
        >
          <Icon name="logout" className="text-lg" />
          <span>Sair do Sistema</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-3 left-3 z-50 p-3 bg-surface-container-lowest rounded-2xl text-on-surface shadow-lg active:scale-95 transition-transform border border-surface-container-high"
      >
        <Icon name={mobileOpen ? 'close' : 'menu'} className="text-xl" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/30 z-40" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-full w-[280px] sm:w-72 bg-surface-container-low z-40 transform transition-transform duration-300 shadow-2xl ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col h-screen w-64 bg-surface-container-low sticky top-0">
        {sidebarContent}
      </aside>
    </>
  );
}
