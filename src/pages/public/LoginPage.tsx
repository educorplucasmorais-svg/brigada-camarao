import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Shield, Briefcase, Users, UserPlus, CheckCircle, Flame } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

type LoginMode = 'select' | 'admin' | 'ct' | 'parceiro' | 'register';

const roleCards = [
  {
    id: 'admin' as const,
    title: 'Administrador',
    subtitle: 'Dashboard Estratégico',
    desc: 'Gestão completa do sistema, relatórios e controle financeiro.',
    tag: '@brigadacamarao.com',
    icon: Shield,
    gradient: 'from-[#ba100a] to-[#8b0000]',
    glow: 'shadow-[0_0_30px_rgba(186,16,10,0.2)]',
    ring: 'ring-[#ba100a]/30',
  },
  {
    id: 'ct' as const,
    title: 'Coordenador',
    subtitle: 'Gestão Tática',
    desc: 'Coordenação de equipes, escalas e operações em campo.',
    tag: 'Login + Senha',
    icon: Briefcase,
    gradient: 'from-[#2563eb] to-[#1d4ed8]',
    glow: 'shadow-[0_0_30px_rgba(37,99,235,0.2)]',
    ring: 'ring-[#2563eb]/30',
  },
  {
    id: 'parceiro' as const,
    title: 'Parceiro',
    subtitle: 'Acesso Rápido',
    desc: 'Bombeiro Civil — visualize eventos e candidate-se rapidamente.',
    tag: 'Nome + CPF',
    icon: Users,
    gradient: 'from-[#16a34a] to-[#15803d]',
    glow: 'shadow-[0_0_30px_rgba(22,163,74,0.2)]',
    ring: 'ring-[#16a34a]/30',
  },
] as const;

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

  // ═══ Shared Styles ═══
  const inputCls = 'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium placeholder:text-white/30 focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all text-[15px] outline-none backdrop-blur-sm';
  const labelCls = 'block text-[10px] font-bold text-white/40 uppercase tracking-[0.15em] mb-1.5 pl-0.5';

  // ═══ ROLE SELECTION ═══
  if (mode === 'select') {
    return (
      <div className="min-h-screen bg-[#0f0f13] flex flex-col items-center justify-center px-4 py-8 sm:py-12 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-[#ba100a]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] bg-[#2563eb]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-lg sm:max-w-4xl relative z-10">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="relative inline-block mb-5">
              <div className="absolute inset-0 bg-[#ba100a]/20 rounded-full blur-xl animate-pulse" />
              <img
                src="/images/logo-brigada.png"
                alt="Brigada Camarão"
                className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-white/10 shadow-2xl"
              />
            </div>
            <h1 className="font-headline text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">
              Brigada Camarão
            </h1>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Flame className="w-3 h-3 text-[#ba100a]" />
              <p className="text-[11px] sm:text-xs text-white/30 font-semibold uppercase tracking-[0.25em]">
                Sentinel Command
              </p>
              <Flame className="w-3 h-3 text-[#ba100a]" />
            </div>
          </div>

          {/* 3 Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {roleCards.map((card) => (
              <button
                key={card.id}
                onClick={() => { resetForm(); setMode(card.id); }}
                className={`group relative bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.06] p-5 sm:p-6 text-left transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.12] hover:${card.glow} active:scale-[0.98]`}
              >
                {/* Icon */}
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-105 transition-transform`}>
                  <card.icon className="w-5 h-5 text-white" />
                </div>
                {/* Text */}
                <h3 className="font-headline text-base sm:text-lg font-bold text-white mb-0.5">{card.title}</h3>
                <p className="text-[11px] text-white/30 font-semibold mb-2">{card.subtitle}</p>
                <p className="text-[11px] sm:text-xs text-white/20 leading-relaxed">
                  {card.desc}
                </p>
                {/* Tag */}
                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <span className={`text-[9px] font-bold uppercase tracking-[0.15em] bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                    {card.tag}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <p className="text-center text-[9px] text-white/15 mt-8 tracking-wider">
            © 2026 Brigada Camarão · Prevenir · Combater · Salvar · LGPD
          </p>
        </div>
      </div>
    );
  }

  // ═══ REGISTRATION SUCCESS ═══
  if (registered) {
    return (
      <div className="min-h-screen bg-[#0f0f13] flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.06] p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[#16a34a]/10 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-[#16a34a]" />
          </div>
          <h2 className="font-headline text-xl font-bold text-white mb-2">Cadastro Enviado</h2>
          <p className="text-sm text-white/40 mb-6 leading-relaxed">
            Aguardando aprovação do administrador. Você será notificado.
          </p>
          <div className="bg-[#16a34a]/5 border border-[#16a34a]/10 rounded-xl p-3 mb-6">
            <p className="text-[11px] text-[#16a34a]/80 font-semibold">
              ⏳ Status: Pré-aprovação pendente
            </p>
          </div>
          <button onClick={goBack}
            className="w-full py-3 bg-white/5 text-white font-bold rounded-xl text-sm hover:bg-white/10 transition-colors border border-white/10">
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  // ═══ FORM VIEWS (Admin / CT / Parceiro / Register) ═══
  const cfgMap = {
    admin: { title: 'Administrador', icon: Shield, gradient: 'from-[#ba100a] to-[#8b0000]', accent: '#ba100a', domain: '@brigadacamarao.com' },
    ct: { title: 'Coordenador Técnico', icon: Briefcase, gradient: 'from-[#2563eb] to-[#1d4ed8]', accent: '#2563eb', domain: null },
    parceiro: { title: 'Parceiro', icon: Users, gradient: 'from-[#16a34a] to-[#15803d]', accent: '#16a34a', domain: null },
    register: { title: 'Novo Cadastro', icon: UserPlus, gradient: 'from-[#16a34a] to-[#15803d]', accent: '#16a34a', domain: null },
  };
  const cfg = cfgMap[mode];
  const CardIcon = cfg.icon;

  return (
    <div className="min-h-screen bg-[#0f0f13] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient */}
      <div className="absolute top-[-30%] right-[-20%] w-[60vw] h-[60vw] rounded-full blur-[150px] pointer-events-none" style={{ backgroundColor: cfg.accent + '08' }} />

      <div className="w-full max-w-[400px] relative z-10">
        {/* Back */}
        <button onClick={goBack}
          className="flex items-center gap-2 text-xs text-white/30 hover:text-white/60 mb-5 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Voltar
        </button>

        <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.06] overflow-hidden shadow-2xl shadow-black/20">
          {/* Gradient accent */}
          <div className={`h-1 bg-gradient-to-r ${cfg.gradient}`} />

          <div className="p-6 sm:p-7">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center shadow-lg`}>
                <CardIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-headline text-lg font-bold text-white">{cfg.title}</h2>
                {cfg.domain && (
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: cfg.accent + 'aa' }}>
                    {cfg.domain}
                  </p>
                )}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl mb-5 font-medium flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                {error}
              </div>
            )}

            {/* ── Admin Form ── */}
            {mode === 'admin' && (
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div><label className={labelCls}>E-mail</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className={inputCls} placeholder="admin@brigadacamarao.com" required />
                </div>
                <div><label className={labelCls}>Senha</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} value={password}
                      onChange={(e) => setPassword(e.target.value)} className={inputCls + ' pr-12'}
                      placeholder="••••••••" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors p-1">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className={`w-full py-3 font-bold text-white rounded-xl text-sm flex items-center justify-center gap-2 bg-gradient-to-r ${cfg.gradient} shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 hover:shadow-xl`}>
                  {loading ? <span className="animate-pulse">Entrando...</span> : <>Entrar <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            )}

            {/* ── CT Form ── */}
            {mode === 'ct' && (
              <form onSubmit={handleCTLogin} className="space-y-4">
                <div><label className={labelCls}>E-mail</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className={inputCls} placeholder="coo@brigadacamarao.com" required />
                </div>
                <div><label className={labelCls}>Senha</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} value={password}
                      onChange={(e) => setPassword(e.target.value)} className={inputCls + ' pr-12'}
                      placeholder="••••••••" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors p-1">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className={`w-full py-3 font-bold text-white rounded-xl text-sm flex items-center justify-center gap-2 bg-gradient-to-r ${cfg.gradient} shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 hover:shadow-xl`}>
                  {loading ? <span className="animate-pulse">Entrando...</span> : <>Entrar <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            )}

            {/* ── Parceiro Form ── */}
            {mode === 'parceiro' && (
              <form onSubmit={handleParceiroLogin} className="space-y-4">
                <div><label className={labelCls}>Nome Completo</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                    className={inputCls} placeholder="João Pedro Santos" required />
                </div>
                <div><label className={labelCls}>CPF</label>
                  <input type="text" value={cpf} onChange={(e) => setCpf(formatCpf(e.target.value))}
                    className={inputCls} placeholder="000.000.000-00" maxLength={14} required />
                </div>
                <button type="submit" disabled={loading}
                  className={`w-full py-3 font-bold text-white rounded-xl text-sm flex items-center justify-center gap-2 bg-gradient-to-r ${cfg.gradient} shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 hover:shadow-xl`}>
                  {loading ? <span className="animate-pulse">Verificando...</span> : <>Acessar Eventos <ArrowRight className="w-4 h-4" /></>}
                </button>
                <div className="pt-2 border-t border-white/[0.06]">
                  <button type="button"
                    onClick={() => { resetForm(); setMode('register'); }}
                    className="w-full py-2.5 text-[13px] font-semibold text-[#16a34a]/80 hover:text-[#16a34a] hover:bg-[#16a34a]/5 rounded-xl transition-all flex items-center justify-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Primeiro acesso? Registre-se
                  </button>
                </div>
              </form>
            )}

            {/* ── Register Form ── */}
            {mode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="bg-[#16a34a]/5 border border-[#16a34a]/10 rounded-xl p-3 mb-1">
                  <p className="text-[11px] text-[#16a34a]/70 font-medium">
                    📋 Cadastro sujeito a aprovação do administrador.
                  </p>
                </div>
                <div><label className={labelCls}>Nome Completo</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                    className={inputCls} placeholder="João Pedro Santos" required />
                </div>
                <div><label className={labelCls}>CPF</label>
                  <input type="text" value={cpf} onChange={(e) => setCpf(formatCpf(e.target.value))}
                    className={inputCls} placeholder="000.000.000-00" maxLength={14} required />
                </div>
                <div><label className={labelCls}>Telefone (opcional)</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    className={inputCls} placeholder="(31) 99999-9999" />
                </div>
                <button type="submit" disabled={loading}
                  className={`w-full py-3 font-bold text-white rounded-xl text-sm flex items-center justify-center gap-2 bg-gradient-to-r ${cfg.gradient} shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 hover:shadow-xl`}>
                  {loading ? <span className="animate-pulse">Enviando...</span> : <>Enviar para Aprovação <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            )}

            {/* Demo hint */}
            {(mode === 'admin' || mode === 'ct') && (
              <div className="mt-5 pt-4 border-t border-white/[0.06]">
                <p className="text-[10px] font-bold text-white/15 uppercase tracking-[0.15em] mb-1">Demo</p>
                <p className="text-[12px] text-white/25">
                  <span className="font-semibold text-white/40">
                    {mode === 'admin' ? 'admin@brigadacamarao.com' : 'coo@brigadacamarao.com'}
                  </span> — qualquer senha
                </p>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-[9px] text-white/10 mt-6 tracking-wider">
          © 2026 Brigada Camarão · LGPD
        </p>
      </div>
    </div>
  );
}
