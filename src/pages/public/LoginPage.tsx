import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

type LoginMode = 'select' | 'admin' | 'ct' | 'parceiro' | 'register';

const roleCards = [
  {
    id: 'admin' as const,
    title: 'Administrador',
    subtitle: 'Dashboard Estratégico',
    desc: 'Gestão completa do sistema, relatórios e controle financeiro.',
    tag: '@brigadacamarao.com',
    icon: 'admin_panel_settings',
    borderColor: 'border-primary-container',
  },
  {
    id: 'ct' as const,
    title: 'Coordenador',
    subtitle: 'Gestão Tática',
    desc: 'Coordenação de equipes, escalas e operações em campo.',
    tag: 'Login + Senha',
    icon: 'shield_person',
    borderColor: 'border-secondary-container',
  },
  {
    id: 'parceiro' as const,
    title: 'Parceiro',
    subtitle: 'Acesso Rápido',
    desc: 'Bombeiro Civil — visualize eventos e candidate-se rapidamente.',
    tag: 'Nome + CPF',
    icon: 'local_fire_department',
    borderColor: 'border-success',
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

  const inputCls = 'w-full px-4 py-3.5 bg-surface-container-low border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-on-surface font-medium placeholder:text-outline/40 transition-all text-sm outline-none';
  const labelCls = 'block text-[11px] font-black text-on-surface-variant uppercase tracking-widest px-1 mb-1.5';

  // ═══ ROLE SELECTION ═══
  if (mode === 'select') {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="mb-6">
              <img
                src="/images/logo-brigada.png"
                alt="Brigada Camarão"
                className="h-28 w-28 object-contain"
              />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-primary-container leading-tight mb-2 uppercase">
              Brigada Camarão
            </h1>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-2">
              Sentinel Command
            </p>
            <p className="text-on-surface-variant text-sm font-medium">
              Selecione seu tipo de acesso para continuar.
            </p>
          </div>

          {/* 3 Role Cards */}
          <div className="space-y-3">
            {roleCards.map((card) => (
              <button
                key={card.id}
                onClick={() => { resetForm(); setMode(card.id); }}
                className={`w-full bg-surface-container-lowest p-5 rounded-2xl border-l-[6px] ${card.borderColor} shadow-sm hover:shadow-md transition-all active:scale-[0.99] text-left flex items-center gap-4 group`}
              >
                <div className="w-12 h-12 rounded-2xl bg-primary-container flex items-center justify-center shrink-0">
                  <Icon name={card.icon} filled className="text-on-primary text-xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-black text-on-surface tracking-tight">{card.title}</h3>
                  <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mt-0.5">{card.subtitle}</p>
                  <p className="text-xs text-outline mt-1 leading-relaxed">{card.desc}</p>
                </div>
                <Icon name="arrow_forward" className="text-outline/40 group-hover:text-primary-container transition-colors" />
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-surface-container-high">
            <div className="flex items-center justify-center gap-2 text-on-surface-variant text-[11px] font-bold uppercase tracking-wider mb-4">
              <Icon name="support_agent" filled className="text-lg" />
              Precisa de ajuda com o acesso?
            </div>
            <div className="flex justify-center gap-6">
              <a href="https://www.instagram.com/brigadacamarao/" target="_blank" rel="noopener noreferrer"
                className="text-primary-container font-black text-xs uppercase tracking-wider hover:underline flex items-center gap-1">
                <Icon name="photo_camera" className="text-base" /> Instagram
              </a>
              <a href="https://wa.me/5531999999999" target="_blank" rel="noopener noreferrer"
                className="text-success font-black text-xs uppercase tracking-wider hover:underline flex items-center gap-1">
                <Icon name="chat" className="text-base" /> WhatsApp
              </a>
            </div>
          </div>

          <p className="text-center text-[10px] text-outline/50 mt-6 font-bold uppercase tracking-wider">
            © 2026 Brigada Camarão · Prevenir · Combater · Salvar
          </p>
        </div>
      </div>
    );
  }

  // ═══ REGISTRATION SUCCESS ═══
  if (registered) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 bg-surface-container-lowest shadow-2xl rounded-3xl text-center">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-5">
            <Icon name="check_circle" filled className="text-success text-3xl" />
          </div>
          <h2 className="text-xl font-black text-on-surface uppercase mb-2">Cadastro Enviado</h2>
          <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
            Aguardando aprovação do administrador. Você será notificado.
          </p>
          <div className="p-4 rounded-2xl bg-surface-container border-l-[6px] border-success mb-6">
            <div className="flex gap-3">
              <Icon name="hourglass_top" filled className="text-success text-xl shrink-0" />
              <p className="text-xs font-black text-on-surface uppercase tracking-wider">
                Status: Pré-aprovação pendente
              </p>
            </div>
          </div>
          <button onClick={goBack}
            className="w-full py-3.5 bg-surface-container-low text-on-surface font-black rounded-2xl text-sm hover:bg-surface-container transition-all uppercase tracking-tight">
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  // ═══ FORM VIEWS ═══
  const cfgMap = {
    admin: { title: 'Administrador', icon: 'admin_panel_settings', color: 'primary-container', domain: '@brigadacamarao.com' },
    ct: { title: 'Coordenador Técnico', icon: 'shield_person', color: 'secondary-container', domain: null },
    parceiro: { title: 'Parceiro — Bombeiro Civil', icon: 'local_fire_department', color: 'success', domain: null },
    register: { title: 'Novo Cadastro', icon: 'person_add', color: 'success', domain: null },
  };
  const cfg = cfgMap[mode];

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <main className="w-full max-w-md p-6 md:p-10 bg-surface-container-lowest shadow-2xl rounded-3xl my-8 mx-auto">
        {/* Back button */}
        <button onClick={goBack}
          className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant hover:text-primary-container mb-6 transition-colors uppercase tracking-wider">
          <Icon name="arrow_back" className="text-lg" />
          Voltar
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary-container flex items-center justify-center mb-4">
            <Icon name={cfg.icon} filled className="text-on-primary text-2xl" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-primary-container leading-tight mb-1 uppercase">
            {cfg.title}
          </h2>
          {cfg.domain && (
            <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">
              {cfg.domain}
            </p>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 rounded-2xl bg-error-container border-l-[6px] border-error mb-5">
            <div className="flex gap-3">
              <Icon name="error" filled className="text-on-error-container text-xl shrink-0" />
              <p className="text-xs font-black text-on-error-container">{error}</p>
            </div>
          </div>
        )}

        {/* ── Admin Form ── */}
        {mode === 'admin' && (
          <form onSubmit={handleAdminLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className={labelCls}>E-mail</label>
              <div className="relative">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className={inputCls} placeholder="admin@brigadacamarao.com" required />
                <Icon name="mail" className="absolute right-4 top-1/2 -translate-y-1/2 text-outline/30 text-lg" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Senha</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)} className={inputCls + ' pr-12'}
                  placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline/30 hover:text-primary-container transition-colors">
                  <Icon name={showPassword ? 'visibility_off' : 'visibility'} className="text-lg" />
                </button>
              </div>
            </div>
            <div className="pt-2">
              <button type="submit" disabled={loading}
                className="w-full py-4 bg-primary-container text-on-primary font-black text-base rounded-2xl shadow-xl shadow-primary/30 hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 uppercase tracking-tight disabled:opacity-50">
                {loading ? 'Entrando...' : <><span>Entrar</span><Icon name="arrow_forward" className="text-xl" /></>}
              </button>
            </div>
          </form>
        )}

        {/* ── CT Form ── */}
        {mode === 'ct' && (
          <form onSubmit={handleCTLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className={labelCls}>E-mail</label>
              <div className="relative">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className={inputCls} placeholder="coordenador@email.com" required />
                <Icon name="mail" className="absolute right-4 top-1/2 -translate-y-1/2 text-outline/30 text-lg" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Senha</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)} className={inputCls + ' pr-12'}
                  placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline/30 hover:text-primary-container transition-colors">
                  <Icon name={showPassword ? 'visibility_off' : 'visibility'} className="text-lg" />
                </button>
              </div>
            </div>
            <div className="pt-2">
              <button type="submit" disabled={loading}
                className="w-full py-4 bg-primary-container text-on-primary font-black text-base rounded-2xl shadow-xl shadow-primary/30 hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 uppercase tracking-tight disabled:opacity-50">
                {loading ? 'Entrando...' : <><span>Entrar</span><Icon name="arrow_forward" className="text-xl" /></>}
              </button>
            </div>
          </form>
        )}

        {/* ── Parceiro Form ── */}
        {mode === 'parceiro' && (
          <form onSubmit={handleParceiroLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className={labelCls}>Nome Completo</label>
              <div className="relative">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className={inputCls} placeholder="Como no seu RG/CNH" required />
                <Icon name="person" className="absolute right-4 top-1/2 -translate-y-1/2 text-outline/30 text-lg" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>CPF</label>
              <div className="relative">
                <input type="text" value={cpf} onChange={(e) => setCpf(formatCpf(e.target.value))}
                  className={inputCls} placeholder="000.000.000-00" maxLength={14} required />
                <Icon name="badge" className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-container text-lg" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface-container border-l-[6px] border-secondary-container shadow-sm">
              <div className="flex gap-3">
                <Icon name="info" filled className="text-secondary-container text-xl shrink-0" />
                <div className="space-y-1">
                  <p className="text-xs font-black text-on-surface uppercase tracking-wider">Acesso rápido</p>
                  <p className="text-[11px] leading-relaxed text-on-surface-variant font-semibold">
                    Use o <strong>CPF</strong> cadastrado para acessar eventos disponíveis e se candidatar.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <button type="submit" disabled={loading}
                className="w-full py-4 bg-primary-container text-on-primary font-black text-base rounded-2xl shadow-xl shadow-primary/30 hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 uppercase tracking-tight disabled:opacity-50">
                {loading ? 'Verificando...' : <><span>Acessar Eventos</span><Icon name="arrow_forward" className="text-xl" /></>}
              </button>
              <button type="button"
                onClick={() => { resetForm(); setMode('register'); }}
                className="w-full py-3 text-sm font-black text-success uppercase tracking-wider hover:bg-success/5 rounded-2xl transition-all flex items-center justify-center gap-2">
                <Icon name="person_add" className="text-lg" />
                Primeiro acesso? Registre-se
              </button>
            </div>
          </form>
        )}

        {/* ── Register Form ── */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="p-4 rounded-2xl bg-surface-container border-l-[6px] border-success shadow-sm">
              <div className="flex gap-3">
                <Icon name="info" filled className="text-success text-xl shrink-0" />
                <p className="text-[11px] leading-relaxed text-on-surface-variant font-semibold">
                  Cadastro sujeito a <strong>aprovação do administrador</strong>. Você será notificado.
                </p>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Nome Completo</label>
              <div className="relative">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className={inputCls} placeholder="Como no seu RG/CNH" required />
                <Icon name="person" className="absolute right-4 top-1/2 -translate-y-1/2 text-outline/30 text-lg" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>CPF</label>
              <div className="relative">
                <input type="text" value={cpf} onChange={(e) => setCpf(formatCpf(e.target.value))}
                  className={inputCls} placeholder="000.000.000-00" maxLength={14} required />
                <Icon name="badge" className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-container text-lg" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Telefone (opcional)</label>
              <div className="relative">
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                  className={inputCls} placeholder="(31) 99999-9999" />
                <Icon name="phone" className="absolute right-4 top-1/2 -translate-y-1/2 text-outline/30 text-lg" />
              </div>
            </div>
            <div className="pt-2">
              <button type="submit" disabled={loading}
                className="w-full py-4 bg-primary-container text-on-primary font-black text-base rounded-2xl shadow-xl shadow-primary/30 hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 uppercase tracking-tight disabled:opacity-50">
                {loading ? 'Enviando...' : <><span>Enviar para Aprovação</span><Icon name="arrow_forward" className="text-xl" /></>}
              </button>
            </div>
          </form>
        )}

        {/* Demo hint */}
        {(mode === 'admin' || mode === 'ct') && (
          <div className="mt-6 pt-5 border-t border-surface-container-high">
            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Demo</p>
            <p className="text-xs text-outline font-medium">
              <span className="font-bold text-on-surface">
                {mode === 'admin' ? 'admin@brigadacamarao.com' : 'coo@brigadacamarao.com'}
              </span> — qualquer senha
            </p>
          </div>
        )}

        {/* Terms footer */}
        <p className="text-center text-[10px] font-black text-on-surface-variant uppercase tracking-widest mt-6">
          Ao prosseguir, você aceita nossos{' '}
          <a className="text-primary-container hover:underline" href="#">Termos de Atuação</a>
        </p>
      </main>
    </div>
  );
}
