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

  const inputCls = 'w-full px-4 py-3.5 bg-white/[0.06] border border-white/[0.08] rounded-xl text-white font-medium placeholder:text-white/25 focus:border-white/20 focus:ring-2 focus:ring-white/10 focus:bg-white/[0.08] transition-all text-sm outline-none';
  const labelCls = 'block text-[10px] font-bold text-white/40 uppercase tracking-[0.15em] mb-1.5 pl-0.5';

  // ═══ ROLE SELECTION — Stitch Dark Glassmorphism ═══
  if (mode === 'select') {
    return (
      <div className="min-h-screen bg-[#12121a] flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
        {/* Watermark seal */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
          <img
            src="/images/logo-brigada.png"
            alt=""
            className="w-[500px] h-[500px] sm:w-[600px] sm:h-[600px] object-contain"
          />
        </div>

        <div className="w-full max-w-4xl relative z-10">
          {/* Logo */}
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-block mb-6">
              <img
                src="/images/logo-brigada.png"
                alt="Brigada Camarão"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover mx-auto opacity-90"
              />
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
                className="group relative bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.08] overflow-hidden text-center transition-all duration-300 hover:bg-white/[0.07] hover:border-white/[0.15] hover:scale-[1.02] active:scale-[0.98] flex flex-col"
              >
                {/* Card content */}
                <div className="px-5 pt-7 pb-5 flex-1 flex flex-col items-center">
                  {/* Icon circle */}
                  <div className={`w-14 h-14 rounded-full ${card.iconBg} flex items-center justify-center mb-5 shadow-lg`}>
                    <Icon name={card.icon} filled className="text-white text-2xl" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white mb-1 tracking-tight">{card.title}</h3>

                  {/* Subtitle (italic bold) */}
                  <p className="text-xs font-semibold text-white/50 italic mb-3">{card.subtitle}</p>

                  {/* Description */}
                  <p className="text-[11px] text-white/30 leading-relaxed mb-5">
                    {card.desc}
                  </p>

                  {/* Tag */}
                  <div className="mt-auto">
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${card.tagColor}`}>
                      {card.tag}
                    </span>
                  </div>
                </div>

                {/* Bottom accent bar */}
                <div className={`h-[3px] bg-gradient-to-r ${card.accentBar} opacity-70 group-hover:opacity-100 transition-opacity`} />
              </button>
            ))}
          </div>

          {/* Footer */}
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
      <div className="min-h-screen bg-[#12121a] flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-8 text-center">
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
    );
  }

  // ═══ FORM VIEWS ═══
  const cfgMap = {
    admin: { title: 'Administrador', icon: 'shield', iconBg: 'bg-[#8b0000]', accent: '#ba100a', domain: '@brigadacamarao.com' },
    ct: { title: 'Coordenador Técnico', icon: 'work', iconBg: 'bg-[#1d4ed8]', accent: '#2563eb', domain: null },
    parceiro: { title: 'Parceiro', icon: 'groups', iconBg: 'bg-[#15803d]', accent: '#16a34a', domain: null },
    register: { title: 'Novo Cadastro', icon: 'person_add', iconBg: 'bg-[#15803d]', accent: '#16a34a', domain: null },
  };
  const cfg = cfgMap[mode];

  return (
    <div className="min-h-screen bg-[#12121a] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
        <img src="/images/logo-brigada.png" alt="" className="w-[500px] h-[500px] object-contain" />
      </div>

      <div className="w-full max-w-[420px] relative z-10">
        {/* Back */}
        <button onClick={goBack}
          className="flex items-center gap-2 text-xs text-white/30 hover:text-white/60 mb-5 transition-colors font-bold uppercase tracking-wider">
          <Icon name="arrow_back" className="text-lg" />
          Voltar
        </button>

        <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl">
          {/* Top accent bar */}
          <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${cfg.accent}, ${cfg.accent}88)` }} />

          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="text-center mb-7">
              <div className={`w-14 h-14 rounded-full ${cfg.iconBg} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                <Icon name={cfg.icon} filled className="text-white text-2xl" />
              </div>
              <h2 className="text-xl font-bold text-white mb-1">{cfg.title}</h2>
              {cfg.domain && (
                <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: cfg.accent }}>
                  {cfg.domain}
                </p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3.5 mb-5 flex items-center gap-2.5">
                <Icon name="error" filled className="text-red-400 text-lg shrink-0" />
                <p className="text-xs font-medium text-red-400">{error}</p>
              </div>
            )}

            {/* ── Admin Form ── */}
            {mode === 'admin' && (
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className={labelCls}>E-mail</label>
                  <div className="relative">
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      className={inputCls} placeholder="admin@brigadacamarao.com" required />
                    <Icon name="mail" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/15 text-lg" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Senha</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} value={password}
                      onChange={(e) => setPassword(e.target.value)} className={inputCls + ' pr-12'}
                      placeholder="••••••••" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/15 hover:text-white/40 transition-colors">
                      <Icon name={showPassword ? 'visibility_off' : 'visibility'} className="text-lg" />
                    </button>
                  </div>
                </div>
                <div className="pt-2">
                  <button type="submit" disabled={loading}
                    className="w-full py-3.5 font-bold text-white rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
                    style={{ background: `linear-gradient(135deg, ${cfg.accent}, ${cfg.accent}cc)` }}>
                    {loading ? 'Entrando...' : <><span>Entrar</span><Icon name="arrow_forward" className="text-lg" /></>}
                  </button>
                </div>
              </form>
            )}

            {/* ── CT Form ── */}
            {mode === 'ct' && (
              <form onSubmit={handleCTLogin} className="space-y-4">
                <div>
                  <label className={labelCls}>E-mail</label>
                  <div className="relative">
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      className={inputCls} placeholder="coordenador@email.com" required />
                    <Icon name="mail" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/15 text-lg" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Senha</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} value={password}
                      onChange={(e) => setPassword(e.target.value)} className={inputCls + ' pr-12'}
                      placeholder="••••••••" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/15 hover:text-white/40 transition-colors">
                      <Icon name={showPassword ? 'visibility_off' : 'visibility'} className="text-lg" />
                    </button>
                  </div>
                </div>
                <div className="pt-2">
                  <button type="submit" disabled={loading}
                    className="w-full py-3.5 font-bold text-white rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
                    style={{ background: `linear-gradient(135deg, ${cfg.accent}, ${cfg.accent}cc)` }}>
                    {loading ? 'Entrando...' : <><span>Entrar</span><Icon name="arrow_forward" className="text-lg" /></>}
                  </button>
                </div>
              </form>
            )}

            {/* ── Parceiro Form ── */}
            {mode === 'parceiro' && (
              <form onSubmit={handleParceiroLogin} className="space-y-4">
                <div>
                  <label className={labelCls}>Nome Completo</label>
                  <div className="relative">
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                      className={inputCls} placeholder="Como no seu RG/CNH" required />
                    <Icon name="person" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/15 text-lg" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>CPF</label>
                  <div className="relative">
                    <input type="text" value={cpf} onChange={(e) => setCpf(formatCpf(e.target.value))}
                      className={inputCls} placeholder="000.000.000-00" maxLength={14} required />
                    <Icon name="badge" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/15 text-lg" />
                  </div>
                </div>
                <div className="pt-2 space-y-3">
                  <button type="submit" disabled={loading}
                    className="w-full py-3.5 font-bold text-white rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
                    style={{ background: `linear-gradient(135deg, ${cfg.accent}, ${cfg.accent}cc)` }}>
                    {loading ? 'Verificando...' : <><span>Acessar Eventos</span><Icon name="arrow_forward" className="text-lg" /></>}
                  </button>
                  <div className="pt-1 border-t border-white/[0.06]">
                    <button type="button"
                      onClick={() => { resetForm(); setMode('register'); }}
                      className="w-full py-2.5 text-xs font-bold text-[#4ade80]/70 hover:text-[#4ade80] hover:bg-[#4ade80]/5 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider">
                      <Icon name="person_add" className="text-base" />
                      Primeiro acesso? Registre-se
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* ── Register Form ── */}
            {mode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="bg-[#15803d]/10 border border-[#4ade80]/10 rounded-xl p-3 flex items-start gap-2.5">
                  <Icon name="info" filled className="text-[#4ade80] text-base shrink-0 mt-0.5" />
                  <p className="text-[11px] text-[#4ade80]/70 font-medium leading-relaxed">
                    Cadastro sujeito a <strong className="text-[#4ade80]/90">aprovação do administrador</strong>. Você será notificado.
                  </p>
                </div>
                <div>
                  <label className={labelCls}>Nome Completo</label>
                  <div className="relative">
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                      className={inputCls} placeholder="Como no seu RG/CNH" required />
                    <Icon name="person" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/15 text-lg" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>CPF</label>
                  <div className="relative">
                    <input type="text" value={cpf} onChange={(e) => setCpf(formatCpf(e.target.value))}
                      className={inputCls} placeholder="000.000.000-00" maxLength={14} required />
                    <Icon name="badge" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/15 text-lg" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Telefone (opcional)</label>
                  <div className="relative">
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                      className={inputCls} placeholder="(31) 99999-9999" />
                    <Icon name="phone" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/15 text-lg" />
                  </div>
                </div>
                <div className="pt-2">
                  <button type="submit" disabled={loading}
                    className="w-full py-3.5 font-bold text-white rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
                    style={{ background: `linear-gradient(135deg, ${cfg.accent}, ${cfg.accent}cc)` }}>
                    {loading ? 'Enviando...' : <><span>Enviar para Aprovação</span><Icon name="arrow_forward" className="text-lg" /></>}
                  </button>
                </div>
              </form>
            )}

            {/* Demo hint */}
            {(mode === 'admin' || mode === 'ct') && (
              <div className="mt-5 pt-4 border-t border-white/[0.06]">
                <p className="text-[9px] font-bold text-white/15 uppercase tracking-[0.15em] mb-1">Demo</p>
                <p className="text-[11px] text-white/25">
                  <span className="font-semibold text-white/40">
                    {mode === 'admin' ? 'admin@brigadacamarao.com' : 'coo@brigadacamarao.com'}
                  </span> — qualquer senha
                </p>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-[10px] text-white/15 mt-6 tracking-wider font-medium">
          © 2026 Brigada Camarão • LGPD
        </p>
      </div>
    </div>
  );
}