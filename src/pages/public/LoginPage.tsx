import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

type LoginMode = 'select' | 'admin' | 'ct' | 'parceiro' | 'register';

const roleCards = [
  {
    id: 'admin' as const,
    title: 'Administrador',
    subtitle: 'Dashboard Estratégico.',
    desc: 'Gestão completa do sistema, relatórios e controle financeiro.',
    tag: '@BRIGADACAMARAO.COM',
    icon: 'shield',
    iconBg: 'bg-[#8b0000]',
    accentBar: 'from-[#ba100a] to-[#ff4444]',
    tagColor: 'text-[#ff6b6b]',
    borderGlow: 'border-[#ba100a]/40',
  },
  {
    id: 'ct' as const,
    title: 'Coordenador',
    subtitle: 'Gestão Tática.',
    desc: 'Coordenação de equipes, escalas e operações em campo.',
    tag: 'LOGIN + SENHA',
    icon: 'work',
    iconBg: 'bg-[#1d4ed8]',
    accentBar: 'from-[#2563eb] to-[#60a5fa]',
    tagColor: 'text-[#60a5fa]',
    borderGlow: 'border-[#2563eb]/40',
  },
  {
    id: 'parceiro' as const,
    title: 'Parceiro',
    subtitle: 'Acesso Rápido.',
    desc: 'Bombeiro Civil — visualize eventos e candidate-se rapidamente.',
    tag: 'NOME + CPF',
    icon: 'groups',
    iconBg: 'bg-[#15803d]',
    accentBar: 'from-[#16a34a] to-[#4ade80]',
    tagColor: 'text-[#4ade80]',
    borderGlow: 'border-[#16a34a]/40',
  },
] as const;

const Icon = ({ name, filled = false, className = '' }: { name: string; filled?: boolean; className?: string }) => (
  <span
    className={`material-symbols-outlined ${className}`}
    style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}
  >
    {name}
  </span>
);

export function LoginPage() {
  const [mode, setMode] = useState<LoginMode>('select');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const { login, loginByCpf, registerParceiro } = useAuth();
  const navigate = useNavigate();

  const formatCpf = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.includes('@brigadacamarao.com')) {
      setError('Use um e-mail @brigadacamarao.com');
      return;
    }
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) navigate('/admin');
    else setError('Credenciais inválidas.');
  };

  const handleCTLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) navigate('/admin');
    else setError('Credenciais inválidas.');
  };

  const handleParceiroLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11) { setError('CPF deve ter 11 dígitos.'); return; }
    setLoading(true);
    const ok = await loginByCpf(name, cleanCpf);
    setLoading(false);
    if (ok) navigate('/admin');
    else setError('CPF não encontrado. Registre-se primeiro.');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const cleanCpf = cpf.replace(/\D/g, '');
    if (!name.trim() || cleanCpf.length !== 11) { setError('Preencha nome e CPF completo.'); return; }
    setLoading(true);
    const result = await registerParceiro({ name, cpf: cleanCpf, phone });
    setLoading(false);
    if (result.success) setRegistered(true);
    else setError('Erro ao registrar. Tente novamente.');
  };

  const resetForm = () => {
    setEmail(''); setPassword(''); setName(''); setCpf(''); setPhone('');
    setError(''); setShowPassword(false); setRegistered(false);
  };
  const goBack = () => { resetForm(); setMode('select'); };

  // ═══ ROLE SELECTION — Stitch Dark Glassmorphism ═══
  if (mode === 'select') {
    return (
      <div className="min-h-screen bg-[#12121a] flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
        {/* Watermark seal */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
          <img src="/images/logo-brigada.png" alt=""
            className="w-[500px] h-[500px] sm:w-[600px] sm:h-[600px] object-contain" />
        </div>

        <div className="w-full max-w-4xl relative z-10">
          {/* Logo */}
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-block mb-6">
              <img src="/images/logo-brigada.png" alt="Brigada Camarão"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover mx-auto opacity-90" />
            </div>
            <h1 className="text-xl sm:text-2xl font-light text-white/70 tracking-[0.4em] uppercase">
              Sentinel Command
            </h1>
          </div>

          {/* 3 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 max-w-3xl mx-auto">
            {roleCards.map((card) => (
              <button
                key={card.id}
                onClick={() => { resetForm(); setMode(card.id); }}
                className={`group relative bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.08] overflow-hidden text-center transition-all duration-300 hover:bg-white/[0.07] hover:${card.borderGlow} hover:scale-[1.02] active:scale-[0.98] flex flex-col`}
              >
                <div className="px-5 pt-7 pb-5 flex-1 flex flex-col items-center">
                  <div className={`w-14 h-14 rounded-full ${card.iconBg} flex items-center justify-center mb-5 shadow-lg`}>
                    <Icon name={card.icon} filled className="text-white text-2xl" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1 tracking-tight">{card.title}</h3>
                  <p className="text-xs font-semibold text-white/50 italic mb-3">{card.subtitle}</p>
                  <p className="text-[11px] text-white/30 leading-relaxed mb-5">{card.desc}</p>
                  <div className="mt-auto">
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${card.tagColor}`}>
                      {card.tag}
                    </span>
                  </div>
                </div>
                <div className={`h-[3px] bg-gradient-to-r ${card.accentBar} opacity-70 group-hover:opacity-100 transition-opacity`} />
              </button>
            ))}
          </div>

          <p className="text-center text-[10px] text-white/20 mt-10 tracking-wider font-medium">
            © 2026 Brigada Camarão • Prevenir • Combater • Salvar • LGPD
          </p>
        </div>
      </div>
    );
  }

  // ═══ REGISTRATION SUCCESS ═══
  if (registered) {
    return (
      <div className="min-h-screen login-grid-bg flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-[#1e1e2a]/80 backdrop-blur-2xl rounded-2xl border border-[#16a34a]/30 overflow-hidden shadow-2xl">
          <div className="h-1 bg-gradient-to-r from-[#16a34a] via-[#4ade80] to-[#16a34a]" />
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#15803d]/20 flex items-center justify-center mx-auto mb-5">
              <Icon name="check_circle" filled className="text-[#4ade80] text-3xl" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Cadastro Enviado</h2>
            <p className="text-sm text-white/40 mb-6 leading-relaxed">
              Aguardando aprovação do administrador. Você será notificado.
            </p>
            <div className="bg-[#15803d]/10 border border-[#4ade80]/15 rounded-xl p-3.5 mb-6">
              <div className="flex items-center justify-center gap-2">
                <Icon name="hourglass_top" filled className="text-[#4ade80] text-lg" />
                <p className="text-[11px] text-[#4ade80]/80 font-bold uppercase tracking-wider">
                  Status: Pré-aprovação pendente
                </p>
              </div>
            </div>
            <button onClick={goBack}
              className="w-full py-3.5 bg-white/[0.06] text-white font-bold rounded-xl text-sm hover:bg-white/[0.1] transition-all border border-white/[0.08]">
              Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══ FORM VIEWS — Stitch Design (Image 2 Reference) ═══
  const cfgMap = {
    admin: {
      label: 'ADMINISTRADOR', sublabel: 'ACESSO ESTRATÉGICO', accent: '#ba100a',
      accentLight: '#ff6b6b', glowShadow: '0 0 60px rgba(186,16,10,0.15)',
      inputIcon1: 'person_outline', inputIcon2: 'lock_outline',
      ph1: 'admin@brigadacamarao.com', ph2: 'Senha',
      btnText: 'INICIAR OPERAÇÃO',
    },
    ct: {
      label: 'COORDENADOR', sublabel: 'ACESSO TÁTICO', accent: '#2563eb',
      accentLight: '#60a5fa', glowShadow: '0 0 60px rgba(37,99,235,0.15)',
      inputIcon1: 'person_outline', inputIcon2: 'lock_outline',
      ph1: 'Usuário / Login', ph2: 'Senha',
      btnText: 'INICIAR OPERAÇÃO',
    },
    parceiro: {
      label: 'PARCEIRO', sublabel: 'ACESSO RÁPIDO', accent: '#16a34a',
      accentLight: '#4ade80', glowShadow: '0 0 60px rgba(22,163,74,0.15)',
      inputIcon1: 'person_outline', inputIcon2: 'badge',
      ph1: 'Nome Completo', ph2: 'CPF (000.000.000-00)',
      btnText: 'ACESSAR EVENTOS',
    },
    register: {
      label: 'NOVO CADASTRO', sublabel: 'PRÉ-APROVAÇÃO', accent: '#16a34a',
      accentLight: '#4ade80', glowShadow: '0 0 60px rgba(22,163,74,0.15)',
      inputIcon1: 'person_outline', inputIcon2: 'badge',
      ph1: 'Nome Completo', ph2: 'CPF (000.000.000-00)',
      btnText: 'ENVIAR PARA APROVAÇÃO',
    },
  };
  const cfg = cfgMap[mode];

  const styledInput = (
    icon: string,
    props: React.InputHTMLAttributes<HTMLInputElement>,
    accentColor: string,
    rightAction?: React.ReactNode
  ) => (
    <div className="relative group">
      <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center pointer-events-none z-10">
        <Icon name={icon} className="text-xl" style={{ color: `${accentColor}88` }} />
      </div>
      <input
        {...props}
        className="w-full pl-12 pr-4 py-3.5 bg-[#1a1a2e]/60 rounded-xl text-white text-sm font-medium placeholder:text-white/25 outline-none transition-all duration-200"
        style={{
          border: `1.5px solid ${accentColor}44`,
          boxShadow: `inset 0 1px 4px rgba(0,0,0,0.2)`,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = `${accentColor}`;
          e.currentTarget.style.boxShadow = `inset 0 1px 4px rgba(0,0,0,0.2), 0 0 12px ${accentColor}22`;
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = `${accentColor}44`;
          e.currentTarget.style.boxShadow = `inset 0 1px 4px rgba(0,0,0,0.2)`;
        }}
      />
      {rightAction && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
          {rightAction}
        </div>
      )}
    </div>
  );

  const passwordToggle = (
    <button type="button" onClick={() => setShowPassword(!showPassword)}
      className="text-white/20 hover:text-white/50 transition-colors">
      <Icon name={showPassword ? 'visibility_off' : 'visibility'} className="text-lg" />
    </button>
  );

  return (
    <div className="min-h-screen login-grid-bg flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-[440px]">
        {/* ── Glass Card with Top Glow ── */}
        <div
          className="bg-[#1e1e2a]/80 backdrop-blur-2xl rounded-2xl overflow-hidden"
          style={{
            border: `1.5px solid ${cfg.accent}40`,
            boxShadow: `${cfg.glowShadow}, 0 25px 50px -12px rgba(0,0,0,0.5)`,
          }}
        >
          {/* Top glow gradient */}
          <div className="h-1 bg-gradient-to-r" style={{
            backgroundImage: `linear-gradient(90deg, transparent, ${cfg.accent}, ${cfg.accentLight}, ${cfg.accent}, transparent)`,
          }} />

          <div className="px-8 pt-8 pb-7 sm:px-10 sm:pt-10 sm:pb-8">
            {/* Logo */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <img src="/images/logo-brigada.png" alt="Brigada Camarão"
                  className="w-10 h-10 object-contain opacity-90" />
                <div className="text-left">
                  <p className="text-lg font-bold text-white leading-tight">Brigada</p>
                  <p className="text-lg font-bold text-white leading-tight">Camarão</p>
                </div>
              </div>
              <p className="text-sm font-bold text-white tracking-wide">
                {cfg.label} - <span style={{ color: cfg.accentLight }}>{cfg.sublabel}</span>
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-5 flex items-center gap-2.5">
                <Icon name="error" filled className="text-red-400 text-lg shrink-0" />
                <p className="text-xs font-medium text-red-400">{error}</p>
              </div>
            )}

            {/* ── Admin Form ── */}
            {mode === 'admin' && (
              <form onSubmit={handleAdminLogin} className="space-y-4">
                {styledInput('mail', {
                  type: 'email', value: email, onChange: (e) => setEmail(e.target.value),
                  placeholder: cfg.ph1, required: true,
                }, cfg.accent)}
                {styledInput('lock_outline', {
                  type: showPassword ? 'text' : 'password', value: password,
                  onChange: (e) => setPassword(e.target.value),
                  placeholder: cfg.ph2, required: true,
                }, cfg.accent, passwordToggle)}
                <div className="pt-2">
                  <button type="submit" disabled={loading}
                    className="w-full py-4 font-extrabold text-white rounded-xl text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg hover:brightness-110"
                    style={{ background: cfg.accent }}>
                    {loading ? 'Entrando...' : cfg.btnText}
                  </button>
                </div>
              </form>
            )}

            {/* ── CT Form ── */}
            {mode === 'ct' && (
              <form onSubmit={handleCTLogin} className="space-y-4">
                {styledInput(cfg.inputIcon1, {
                  type: 'email', value: email, onChange: (e) => setEmail(e.target.value),
                  placeholder: cfg.ph1, required: true,
                }, cfg.accent)}
                {styledInput(cfg.inputIcon2, {
                  type: showPassword ? 'text' : 'password', value: password,
                  onChange: (e) => setPassword(e.target.value),
                  placeholder: cfg.ph2, required: true,
                }, cfg.accent, passwordToggle)}
                <div className="pt-2">
                  <button type="submit" disabled={loading}
                    className="w-full py-4 font-extrabold text-white rounded-xl text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg hover:brightness-110"
                    style={{ background: cfg.accent }}>
                    {loading ? 'Entrando...' : cfg.btnText}
                  </button>
                </div>
              </form>
            )}

            {/* ── Parceiro Form ── */}
            {mode === 'parceiro' && (
              <form onSubmit={handleParceiroLogin} className="space-y-4">
                {styledInput(cfg.inputIcon1, {
                  type: 'text', value: name, onChange: (e) => setName(e.target.value),
                  placeholder: cfg.ph1, required: true,
                }, cfg.accent)}
                {styledInput(cfg.inputIcon2, {
                  type: 'text', value: cpf,
                  onChange: (e) => setCpf(formatCpf(e.target.value)),
                  placeholder: cfg.ph2, maxLength: 14, required: true,
                }, cfg.accent)}
                <div className="pt-2 space-y-3">
                  <button type="submit" disabled={loading}
                    className="w-full py-4 font-extrabold text-white rounded-xl text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg hover:brightness-110"
                    style={{ background: cfg.accent }}>
                    {loading ? 'Verificando...' : cfg.btnText}
                  </button>
                  <button type="button" onClick={() => { resetForm(); setMode('register'); }}
                    className="w-full py-2.5 text-xs font-bold hover:bg-white/[0.04] rounded-xl transition-all flex items-center justify-center gap-2"
                    style={{ color: `${cfg.accentLight}99` }}>
                    <Icon name="person_add" className="text-base" />
                    Primeiro acesso? Registre-se
                  </button>
                </div>
              </form>
            )}

            {/* ── Register Form ── */}
            {mode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="bg-[#15803d]/10 border border-[#4ade80]/10 rounded-xl p-3 flex items-start gap-2.5">
                  <Icon name="info" filled className="text-[#4ade80] text-base shrink-0 mt-0.5" />
                  <p className="text-[11px] text-[#4ade80]/70 font-medium leading-relaxed">
                    Cadastro sujeito a <strong className="text-[#4ade80]/90">aprovação do administrador</strong>.
                  </p>
                </div>
                {styledInput('person_outline', {
                  type: 'text', value: name, onChange: (e) => setName(e.target.value),
                  placeholder: 'Nome Completo', required: true,
                }, cfg.accent)}
                {styledInput('badge', {
                  type: 'text', value: cpf,
                  onChange: (e) => setCpf(formatCpf(e.target.value)),
                  placeholder: 'CPF (000.000.000-00)', maxLength: 14, required: true,
                }, cfg.accent)}
                {styledInput('phone', {
                  type: 'tel', value: phone, onChange: (e) => setPhone(e.target.value),
                  placeholder: 'Telefone (opcional)',
                }, cfg.accent)}
                <div className="pt-2">
                  <button type="submit" disabled={loading}
                    className="w-full py-4 font-extrabold text-white rounded-xl text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg hover:brightness-110"
                    style={{ background: cfg.accent }}>
                    {loading ? 'Enviando...' : cfg.btnText}
                  </button>
                </div>
              </form>
            )}

            {/* ── Footer Links (Stitch style) ── */}
            <div className="mt-6 space-y-2 text-center">
              <button className="flex items-center justify-center gap-2 text-xs text-white/30 hover:text-white/50 transition-colors mx-auto font-medium">
                <Icon name="help_outline" className="text-base" />
                Suporte Operacional
              </button>
              <button onClick={goBack}
                className="flex items-center justify-center gap-2 text-xs text-white/30 hover:text-white/50 transition-colors mx-auto font-medium">
                <Icon name="logout" className="text-base" />
                Voltar para seleção
              </button>
            </div>

            {/* Demo hint */}
            {(mode === 'admin' || mode === 'ct') && (
              <div className="mt-4 pt-3 border-t border-white/[0.06] text-center">
                <p className="text-[10px] text-white/20">
                  Demo: <span className="font-semibold text-white/30">
                    {mode === 'admin' ? 'admin@brigadacamarao.com' : 'coo@brigadacamarao.com'}
                  </span> — qualquer senha
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}