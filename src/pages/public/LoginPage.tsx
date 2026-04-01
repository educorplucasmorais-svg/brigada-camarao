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

const Icon = ({ name, filled = false, className = '', style }: { name: string; filled?: boolean; className?: string; style?: React.CSSProperties }) => (
  <span
    className={`material-symbols-outlined ${className}`}
    style={{ ...(filled ? { fontVariationSettings: "'FILL' 1" } : {}), ...style }}
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
  const [pixKey, setPixKey] = useState('');
  const [credentialNumber, setCredentialNumber] = useState('');
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

  const handleParceiroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const cleanCpf = cpf.replace(/\D/g, '');
    if (!name.trim()) { setError('Informe seu nome completo.'); return; }
    if (cleanCpf.length !== 11) { setError('CPF deve ter 11 dígitos.'); return; }
    setLoading(true);
    // Try login first
    const loginOk = await loginByCpf(name, cleanCpf);
    if (loginOk) { navigate('/eventos'); return; }
    // If login fails, register
    const result = await registerParceiro({ name, cpf: cleanCpf, pixKey, credentialNumber });
    setLoading(false);
    if (result.success) {
      // Auto-login after register
      await loginByCpf(name, cleanCpf);
      navigate('/eventos');
    } else {
      setError('Erro ao registrar. Tente novamente.');
    }
  };

  const resetForm = () => {
    setEmail(''); setPassword(''); setName(''); setCpf('');
    setPixKey(''); setCredentialNumber('');
    setError(''); setShowPassword(false); setRegistered(false);
  };
  const goBack = () => { resetForm(); setMode('select'); };

  // ═══ ROLE SELECTION — Premium Dark UI ═══
  if (mode === 'select') {
    return (
      <div className="fixed inset-0 bg-[#0a0a12] flex flex-col items-center justify-center px-4 py-6 overflow-auto">
        {/* Ambient glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#ba100a]/[0.06] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[200px] bg-[#2563eb]/[0.04] rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-[840px] relative z-10">
          {/* Logo + Title */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="relative inline-block mb-5">
              <div className="absolute inset-0 bg-[#ba100a]/20 rounded-full blur-xl scale-150" />
              <img src="/images/logo-brigada.png" alt="Brigada Camarão"
                className="relative w-16 h-16 sm:w-[72px] sm:h-[72px] object-contain mx-auto drop-shadow-2xl" />
            </div>
            <h1 className="text-[13px] sm:text-[15px] font-medium text-white/40 tracking-[0.5em] uppercase mb-1">
              Sentinel Command
            </h1>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mt-4" />
          </div>

          {/* 3 Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-[780px] mx-auto px-2">
            {roleCards.map((card) => {
              const colors: Record<string, { border: string; glow: string; iconRing: string }> = {
                admin: { border: 'rgba(186,16,10,0.25)', glow: 'rgba(186,16,10,0.08)', iconRing: 'rgba(186,16,10,0.3)' },
                ct: { border: 'rgba(37,99,235,0.25)', glow: 'rgba(37,99,235,0.08)', iconRing: 'rgba(37,99,235,0.3)' },
                parceiro: { border: 'rgba(22,163,74,0.25)', glow: 'rgba(22,163,74,0.08)', iconRing: 'rgba(22,163,74,0.3)' },
              };
              const c = colors[card.id] || colors.admin;
              return (
                <button
                  key={card.id}
                  onClick={() => { resetForm(); setMode(card.id); }}
                  className="group relative rounded-2xl text-center transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] flex flex-col cursor-pointer"
                  style={{
                    background: `linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)`,
                    border: `1px solid ${c.border}`,
                    boxShadow: `0 4px 30px ${c.glow}, inset 0 1px 0 rgba(255,255,255,0.04)`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 8px 40px ${c.glow.replace('0.08', '0.18')}, inset 0 1px 0 rgba(255,255,255,0.06)`;
                    e.currentTarget.style.borderColor = c.border.replace('0.25', '0.5');
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = `0 4px 30px ${c.glow}, inset 0 1px 0 rgba(255,255,255,0.04)`;
                    e.currentTarget.style.borderColor = c.border;
                  }}
                >
                  <div className="px-6 pt-8 pb-6 flex-1 flex flex-col items-center">
                    {/* Icon with ring */}
                    <div className="relative mb-5">
                      <div className="absolute inset-0 rounded-full scale-[1.6] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ background: `radial-gradient(circle, ${c.iconRing}, transparent 70%)` }} />
                      <div className={`relative w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center shadow-lg`}
                        style={{ boxShadow: `0 4px 15px ${c.iconRing}` }}>
                        <Icon name={card.icon} filled className="text-white text-xl" />
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-white/90 mb-0.5 tracking-tight">{card.title}</h3>
                    <p className="text-[11px] font-medium text-white/35 italic mb-3">{card.subtitle}</p>
                    <p className="text-[11px] text-white/25 leading-relaxed mb-5 max-w-[200px]">{card.desc}</p>

                    <div className="mt-auto">
                      <span className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] ${card.tagColor} opacity-80 group-hover:opacity-100 transition-opacity`}>
                        <span className="w-1 h-1 rounded-full bg-current" />
                        {card.tag}
                      </span>
                    </div>
                  </div>

                  {/* Bottom accent line */}
                  <div className="h-px mx-4 mb-0 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"
                    style={{ background: `linear-gradient(90deg, transparent, ${c.border.replace('0.25', '0.6')}, transparent)` }} />
                  <div className="h-0.5" />
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="text-center mt-10 sm:mt-14 space-y-2">
            <div className="flex items-center justify-center gap-4 text-[10px] text-white/15 tracking-wider font-medium">
              <span>Prevenir</span>
              <span className="w-0.5 h-0.5 rounded-full bg-white/20" />
              <span>Combater</span>
              <span className="w-0.5 h-0.5 rounded-full bg-white/20" />
              <span>Salvar</span>
            </div>
            <p className="text-[9px] text-white/10 tracking-wider">
              © 2026 Brigada Camarão · LGPD Compliance
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ═══ REGISTRATION SUCCESS ═══
  if (registered) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
        <main className="w-full max-w-md p-6 md:p-10 bg-white shadow-2xl rounded-3xl">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-[#e8f5e9] flex items-center justify-center mb-6">
              <Icon name="check_circle" filled className="text-[#2e7d32] text-4xl" />
            </div>
            <h2 className="text-2xl font-black text-primary uppercase tracking-tight mb-2">Cadastro Enviado</h2>
            <p className="text-sm text-on-surface-variant font-medium mb-6">
              Aguardando aprovação do administrador. Você será notificado.
            </p>
            <div className="w-full space-y-3 mb-6">
              <div className="p-3 rounded-2xl bg-surface-container-low flex items-center justify-center gap-2">
                <Icon name="qr_code" filled className="text-primary text-lg" />
                <p className="text-[11px] font-black text-on-surface uppercase tracking-wider">
                  QR Code gerado automaticamente
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-surface-container-low flex items-center justify-center gap-2">
                <Icon name="hourglass_top" filled className="text-secondary text-lg" />
                <p className="text-[11px] font-black text-on-surface-variant uppercase tracking-wider">
                  Status: Pré-aprovação pendente
                </p>
              </div>
            </div>
            <button onClick={goBack}
              className="w-full py-3 bg-primary text-on-primary font-black text-sm rounded-xl shadow-lg shadow-primary/30 hover:bg-primary-container transition-all active:scale-[0.98] uppercase tracking-tight">
              Voltar ao Início
            </button>
          </div>
        </main>
        <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary-container to-primary pointer-events-none opacity-40" />
      </div>
    );
  }

  // ═══ PARCEIRO / REGISTER — Stitch MD3 Form (pixel-perfect) ═══
  if (mode === 'register' || mode === 'parceiro') {
    return (
      <div className="bg-surface text-on-surface flex flex-col items-center justify-start min-h-screen py-4 px-3 overflow-y-auto">
        <main className="relative w-full max-w-sm px-5 py-6 bg-white shadow-2xl rounded-2xl my-4 mx-auto">
          {/* Back button */}
          <button onClick={goBack} className="absolute top-3 left-3 text-on-surface-variant hover:text-primary transition-colors">
            <Icon name="arrow_back" className="text-xl" />
          </button>

          {/* Header */}
          <div className="flex flex-col items-center text-center mb-6 pt-2">
            <div className="mb-3">
              <img alt="Brigada Camarão Logo" className="h-16 w-16 object-contain" src="/images/logo-brigada.png" />
            </div>
            <h2 className="text-lg font-black tracking-tight text-primary leading-tight mb-1 uppercase">
              Bem-vindo à Brigada Camarão
            </h2>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-2">
              Recrutamento de Bombeiro Civil
            </p>
            <p className="text-on-surface-variant text-xs font-medium">
              Informe seus dados para prosseguir com a inscrição.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-4 rounded-2xl bg-error-container flex items-center gap-3">
              <Icon name="error" filled className="text-on-error-container text-xl shrink-0" />
              <p className="text-xs font-bold text-on-error-container">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleParceiroSubmit} className="space-y-3.5">
            {/* Nome Completo */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-black text-on-surface-variant uppercase tracking-widest px-1">
                Nome Completo
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Como no seu RG/CNH"
                  required
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-on-surface font-medium placeholder:text-outline/40 transition-all text-sm"
                />
              </div>
            </div>

            {/* CPF */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-black text-on-surface-variant uppercase tracking-widest px-1">
                CPF
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(formatCpf(e.target.value))}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  required
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-on-surface font-medium placeholder:text-outline/40 transition-all text-sm"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline/30 text-lg text-primary">
                  badge
                </span>
              </div>
            </div>

            {/* Chave PIX */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-black text-on-surface-variant uppercase tracking-widest px-1">
                Chave PIX
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                  placeholder="E-mail, CPF ou Celular"
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-on-surface font-medium placeholder:text-outline/40 transition-all text-sm"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline/30 text-lg">
                  account_balance_wallet
                </span>
              </div>
            </div>

            {/* Nº Credencial */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-black text-on-surface-variant uppercase tracking-widest px-1">
                Nº Credencial
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={credentialNumber}
                  onChange={(e) => setCredentialNumber(e.target.value)}
                  placeholder="Ex: BC-12345"
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-on-surface font-medium placeholder:text-outline/40 transition-all text-sm"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline/30 text-lg">
                  admin_panel_settings
                </span>
              </div>
            </div>

            {/* Information Box */}
            <div className="p-3 rounded-xl bg-surface-container border-l-[4px] border-secondary shadow-sm">
              <div className="flex gap-3">
                <Icon name="info" filled className="text-secondary text-xl shrink-0" />
                <div className="space-y-1">
                  <p className="text-xs font-black text-on-surface uppercase tracking-wider">Por que pedimos isso?</p>
                  <p className="text-[11px] leading-relaxed text-on-surface-variant font-semibold">
                    O <strong>CPF</strong> é necessário para o seguro de acidentes pessoais durante os eventos, e a <strong>Chave PIX</strong> garante o recebimento ágil de suas diárias e reembolsos após a conclusão do serviço.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary text-on-primary font-black text-sm rounded-xl shadow-lg shadow-primary/30 hover:bg-primary-container transition-all active:scale-[0.98] flex items-center justify-center gap-2 uppercase tracking-tight disabled:opacity-50"
              >
                {loading ? 'Processando...' : 'Cadastrar / Entrar'}
                {!loading && <Icon name="arrow_forward" className="text-xl" />}
              </button>
              <p className="text-center text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                Ao prosseguir, você aceita nossos{' '}
                <a className="text-primary hover:underline" href="#">Termos de Atuação</a>
              </p>
            </div>
          </form>

          {/* Support Footer */}
          <div className="mt-4 pt-4 border-t border-surface-container-high">
            <div className="flex items-center justify-center gap-2 text-on-surface-variant text-[11px] font-bold uppercase tracking-wider mb-4">
              <Icon name="support_agent" filled className="text-lg" />
              Precisa de ajuda com o acesso?
            </div>
            <div className="flex justify-center gap-8">
              <a className="text-primary font-black text-xs uppercase tracking-widest hover:opacity-80 transition-opacity" href="#">
                WhatsApp Suporte
              </a>
              <a className="text-on-surface font-black text-xs uppercase tracking-widest hover:opacity-80 transition-opacity" href="#">
                FAQ
              </a>
            </div>
          </div>
        </main>

        {/* Decorative Bottom Gradient */}
        <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary-container to-primary pointer-events-none opacity-40" />
      </div>
    );
  }

  // ═══ FORM VIEWS — Admin / CT Dark Glass UI ═══
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
  };
  const cfg = cfgMap[mode as 'admin' | 'ct'];

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

            {/* ── Footer Links ── */}
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