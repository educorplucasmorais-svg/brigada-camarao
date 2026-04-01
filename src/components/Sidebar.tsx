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

interface NavItem { to: string; icon: string; label: string; end?: boolean }

const navByRole: Record<string, NavItem[]> = {
  // Parceiro: simplified — profile, events, vacancies
  parceiro: [
    { to: '/admin/perfil', icon: 'person', label: 'Meu Perfil', end: true },
    { to: '/admin/eventos', icon: 'calendar_month', label: 'Eventos' },
    { to: '/admin/vagas', icon: 'work', label: 'Vagas Disponíveis' },
  ],
  // Staff (CT/Coordenador): tactical view
  staff: [
    { to: '/admin', icon: 'dashboard', label: 'Painel', end: true },
    { to: '/admin/eventos', icon: 'emergency', label: 'Eventos' },
    { to: '/admin/vagas', icon: 'work', label: 'Vagas' },
    { to: '/admin/equipe', icon: 'groups', label: 'Equipe' },
    { to: '/admin/perfil', icon: 'qr_code', label: 'Perfil & QR' },
  ],
  // COO: strategic + tactical
  coo: [
    { to: '/admin', icon: 'dashboard', label: 'Painel Geral', end: true },
    { to: '/admin/eventos', icon: 'emergency', label: 'Eventos' },
    { to: '/admin/vagas', icon: 'work', label: 'Vagas' },
    { to: '/admin/orcamentos', icon: 'request_quote', label: 'Orçamentos' },
    { to: '/admin/equipe', icon: 'groups', label: 'Equipe' },
    { to: '/admin/perfil', icon: 'qr_code', label: 'Perfil & QR' },
  ],
  // Admin: full access
  admin: [
    { to: '/admin', icon: 'dashboard', label: 'Painel Geral', end: true },
    { to: '/admin/eventos', icon: 'emergency', label: 'Eventos' },
    { to: '/admin/vagas', icon: 'work', label: 'Vagas' },
    { to: '/admin/orcamentos', icon: 'request_quote', label: 'Orçamentos' },
    { to: '/admin/equipe', icon: 'groups', label: 'Equipe' },
    { to: '/admin/perfil', icon: 'qr_code', label: 'Perfil & QR' },
  ],
};

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
      case 'parceiro': return 'Bombeiro Civil';
      default: return 'Coordenador';
    }
  };

  const userInitials = user?.name?.split(' ').map(n => n[0]).slice(0, 2).join('') || 'BC';
  const navItems = navByRole[user?.role || 'parceiro'] || navByRole.parceiro;
  const isParceiro = user?.role === 'parceiro';

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand Block */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-3 mb-4">
          <img
            src="/images/logo-brigada.png"
            alt="Brigada Camarão"
            className="w-11 h-11 rounded-full object-cover shadow-lg"
          />
          <div>
            <h1 className="text-sm font-black text-white uppercase tracking-tight leading-tight">
              Brigada Camarão
            </h1>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.15em] mt-0.5">
              {isParceiro ? 'Portal Parceiro' : 'Sentinel Command'}
            </p>
          </div>
        </div>
        <div className="h-px bg-white/[0.06]" />
      </div>

      {/* Role Badge */}
      <div className="px-5 mb-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06]">
          <span className="w-2 h-2 rounded-full bg-[#2e7d32]" />
          <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">
            {roleLabel(user?.role || '')}
          </span>
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
                    ? 'flex items-center gap-4 bg-white/[0.08] text-white font-bold rounded-l-full ml-4 pl-4 py-3 border-r-4 border-[#ba100a] transition-all'
                    : 'flex items-center gap-4 text-white/40 px-8 py-3 hover:text-white/70 hover:bg-white/[0.03] transition-all'
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
      <div className="px-5 py-3 border-t border-white/[0.06]">
        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-2">Links Rápidos</p>
        <div className="flex items-center gap-2">
          <a
            href="https://www.instagram.com/brigadacamarao/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#E1306C]/15 text-[#E1306C] hover:bg-[#E1306C]/25 transition-colors text-xs font-bold flex-1 justify-center"
          >
            <Icon name="photo_camera" className="text-base" />
            <span className="hidden sm:inline">Instagram</span>
          </a>
          <a
            href="https://wa.me/5531999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#25D366]/15 text-[#25D366] hover:bg-[#25D366]/25 transition-colors text-xs font-bold flex-1 justify-center"
          >
            <Icon name="chat" className="text-base" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>
      </div>

      {/* User Section */}
      <div className="px-5 py-4 border-t border-white/[0.06]">
        {user && (
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#ba100a] flex items-center justify-center shrink-0">
              <span className="text-sm font-black text-white">{userInitials}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white truncate">{user.name}</p>
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
                {roleLabel(user.role)}
              </span>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 text-white/25 hover:text-red-400 text-sm font-semibold transition-all py-2.5 px-1 rounded-xl hover:bg-white/[0.03]"
        >
          <Icon name="logout" className="text-lg" />
          <span>Sair do Sistema</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Mobile Top Bar ── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-surface-container-high">
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-1.5 -ml-1.5 rounded-lg hover:bg-surface-container-low transition-colors"
            >
              <Icon name={mobileOpen ? 'close' : 'menu'} className="text-xl text-on-surface" />
            </button>
            <img src="/images/logo-brigada.png" alt="Brigada Camarão"
              className="w-8 h-8 rounded-full object-cover" />
            <div className="leading-tight">
              <p className="text-xs font-black text-on-surface tracking-tight">Brigada Camarão</p>
              <p className="text-[9px] font-medium text-on-surface-variant">
                {isParceiro ? 'Portal Parceiro' : 'Sentinel Command'}
              </p>
            </div>
          </div>
          <NavLink to="/admin/perfil" onClick={() => setMobileOpen(false)}
            className="w-9 h-9 rounded-full bg-[#ba100a] flex items-center justify-center shadow-sm">
            <span className="text-xs font-black text-white">{userInitials}</span>
          </NavLink>
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-full w-[280px] sm:w-72 bg-[#1a1a2e] z-40 transform transition-transform duration-300 shadow-2xl ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col h-screen w-64 bg-[#1a1a2e] sticky top-0">
        {sidebarContent}
      </aside>
    </>
  );
}
