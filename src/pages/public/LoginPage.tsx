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
  const [phone, setPhone] = useState('');
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
    const result = await registerParceiro({ name, cpf: cleanCpf, phone, pixKey, credentialNumber });
    setLoading(false);
    if (result.success) setRegistered(true);
    else setError('Erro ao registrar. Tente novamente.');
  };

  const resetForm = () => {
    setEmail(''); setPassword(''); setName(''); setCpf(''); setPhone('');
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
      <div className="min-h-screen login-grid-bg flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-[#1e1e2a]/80 backdrop-blur-2xl rounded-2xl border border-[#16a34a]/30 overflow-hidden shadow-2xl">
          <div className="h-1 bg-gradient-to-r from-[#16a34a] via-[#4ade80] to-[#16a34a]" />
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#15803d]/20 flex items-center justify-center mx-auto mb-5">
              <Icon name="check_circle" filled className="text-[#4ade80] text-3xl" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Cadastro Enviado</h2>
            <p className="text-sm text-white/40 mb-4 leading-relaxed">
              Aguardando aprovação do administrador. Você será notificado.
            </p>
            <div className="bg-[#15803d]/10 border border-[#4ade80]/15 rounded-xl p-3.5 mb-4">
              <div className="flex items-center justify-center gap-2">
                <Icon name="qr_code" filled className="text-[#4ade80] text-lg" />
                <p className="text-[11px] text-[#4ade80]/80 font-bold uppercase tracking-wider">
                  QR Code gerado automaticamente
                </p>
              </div>
            </div>
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

  // ═══ REGISTRATION FORM — Stitch Light Design (Recrutamento) ═══
  if (mode === 'register') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f8f5f2] to-[#f0ebe6] flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="pt-10 pb-6 px-8 text-center">
              <img src="/images/logo-brigada.png" alt="Brigada Camarão"
                className="w-24 h-24 rounded-full object-contain mx-auto mb-5" />
              <h1 className="text-2xl sm:text-[28px] font-black text-[#2c1810] tracking-tight leading-tight mb-2">
                BEM-VINDO À BRIGADA<br />CAMARÃO
              </h1>
              <p className="text-[11px] font-bold text-[#8a7060] tracking-[0.2em] uppercase mb-1.5">
                Recrutamento de Bombeiro Civil
              </p>
              <p className="text-xs text-[#a09080]">
                Informe seus dados para prosseguir com a inscrição.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleRegister} className="px-8 pb-8 space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2.5">
                  <Icon name="error" filled className="text-red-500 text-lg shrink-0" />
                  <p className="text-xs font-medium text-red-600">{error}</p>
                </div>
              )}

              {/* Nome Completo */}
              <div>
                <label className="block text-[10px] font-black text-[#3a2e26] uppercase tracking-[0.15em] mb-2">
                  Nome Completo
                </label>
                <div className="relative">
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Como no seu RG/CNH" required
                    className="w-full px-4 py-3.5 bg-[#faf8f6] border border-[#e8e0d8] rounded-xl text-sm text-[#2c1810] font-medium placeholder:text-[#c0b0a0] outline-none focus:border-[#ba100a]/50 focus:ring-2 focus:ring-[#ba100a]/10 transition-all" />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Icon name="person" className="text-lg text-[#c0b0a0]" />
                  </div>
                </div>
              </div>

              {/* CPF */}
              <div>
                <label className="block text-[10px] font-black text-[#3a2e26] uppercase tracking-[0.15em] mb-2">
                  CPF
                </label>
                <div className="relative">
                  <input type="text" value={cpf} onChange={(e) => setCpf(formatCpf(e.target.value))}
                    placeholder="000.000.000-00" maxLength={14} required
                    className="w-full px-4 py-3.5 bg-[#faf8f6] border border-[#e8e0d8] rounded-xl text-sm text-[#2c1810] font-medium placeholder:text-[#c0b0a0] outline-none focus:border-[#ba100a]/50 focus:ring-2 focus:ring-[#ba100a]/10 transition-all" />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Icon name="badge" filled className="text-lg text-[#ba100a]/40" />
                  </div>
                </div>
              </div>

              {/* Chave PIX */}
              <div>
                <label className="block text-[10px] font-black text-[#3a2e26] uppercase tracking-[0.15em] mb-2">
                  Chave PIX
                </label>
                <div className="relative">
                  <input type="text" value={pixKey} onChange={(e) => setPixKey(e.target.value)}
                    placeholder="E-mail, CPF ou Celular"
                    className="w-full px-4 py-3.5 bg-[#faf8f6] border border-[#e8e0d8] rounded-xl text-sm text-[#2c1810] font-medium placeholder:text-[#c0b0a0] outline-none focus:border-[#ba100a]/50 focus:ring-2 focus:ring-[#ba100a]/10 transition-all" />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Icon name="pix" filled className="text-lg text-[#ba100a]/40" />
                  </div>
                </div>
              </div>

              {/* Nº Credencial */}
              <div>
                <label className="block text-[10px] font-black text-[#3a2e26] uppercase tracking-[0.15em] mb-2">
                  Nº Credencial
                </label>
                <div className="relative">
                  <input type="text" value={credentialNumber} onChange={(e) => setCredentialNumber(e.target.value)}
                    placeholder="Ex: BC-12345"
                    className="w-full px-4 py-3.5 bg-[#faf8f6] border border-[#e8e0d8] rounded-xl text-sm text-[#2c1810] font-medium placeholder:text-[#c0b0a0] outline-none focus:border-[#ba100a]/50 focus:ring-2 focus:ring-[#ba100a]/10 transition-all" />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Icon name="verified" filled className="text-lg text-[#ba100a]/40" />
                  </div>
                </div>
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-[10px] font-black text-[#3a2e26] uppercase tracking-[0.15em] mb-2">
                  Telefone <span className="text-[#c0b0a0] font-medium normal-case">(opcional)</span>
                </label>
                <div className="relative">
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    placeholder="(31) 99999-9999"
                    className="w-full px-4 py-3.5 bg-[#faf8f6] border border-[#e8e0d8] rounded-xl text-sm text-[#2c1810] font-medium placeholder:text-[#c0b0a0] outline-none focus:border-[#ba100a]/50 focus:ring-2 focus:ring-[#ba100a]/10 transition-all" />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Icon name="phone" className="text-lg text-[#c0b0a0]" />
                  </div>
                </div>
              </div>

              {/* Info Box (Stitch) */}
              <div className="bg-[#fef9f0] border border-[#f5e0c0] rounded-xl p-4 flex items-start gap-3">
                <Icon name="info" filled className="text-[#d4a050] text-lg shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-extrabold text-[#7a5c30] mb-1">Por que pedimos isso?</p>
                  <p className="text-[11px] text-[#8a7060] leading-relaxed">
                    O <strong className="text-[#5a4030]">CPF</strong> é necessário para o seguro de acidentes pessoais durante os eventos, e a <strong className="text-[#5a4030]">Chave PIX</strong> garante o recebimento ágil de suas diárias e reembolsos após a conclusão do serviço.
                  </p>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-[#900001] to-[#ba100a] text-white font-extrabold rounded-xl text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg hover:shadow-xl hover:brightness-110">
                <Icon name="how_to_reg" className="text-lg" />
                {loading ? 'Enviando...' : 'Enviar para Aprovação'}
              </button>

              {/* Back link */}
              <button type="button" onClick={goBack}
                className="w-full py-2.5 text-xs font-bold text-[#8a7060] hover:text-[#5a4030] transition-colors flex items-center justify-center gap-2">
                <Icon name="arrow_back" className="text-base" />
                Voltar para seleção
              </button>
            </form>
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
  };
  const cfg = cfgMap[mode as 'admin' | 'ct' | 'parceiro'];

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