import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Shield, Briefcase, Users, UserPlus, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

type LoginMode = 'select' | 'admin' | 'ct' | 'parceiro' | 'register';

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
    const success = await login(email, password);
    setLoading(false);
    if (success) navigate('/admin');
    else setError('Credenciais inválidas.');
  };

  const handleCTLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) navigate('/admin');
    else setError('Credenciais inválidas.');
  };

  const handleParceiroLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11) {
      setError('CPF deve ter 11 dígitos.');
      return;
    }
    setLoading(true);
    const success = await loginByCpf(name, cleanCpf);
    setLoading(false);
    if (success) navigate('/admin');
    else setError('CPF não encontrado. Registre-se primeiro.');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const cleanCpf = cpf.replace(/\D/g, '');
    if (!name.trim() || cleanCpf.length !== 11) {
      setError('Preencha nome e CPF completo.');
      return;
    }
    setLoading(true);
    const result = await registerParceiro({ name, cpf: cleanCpf, phone });
    setLoading(false);
    if (result.success) {
      setRegistered(true);
    } else {
      setError('Erro ao registrar. Tente novamente.');
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setCpf('');
    setPhone('');
    setError('');
    setShowPassword(false);
    setRegistered(false);
  };

  const goBack = () => {
    resetForm();
    setMode('select');
  };

  const inputClass = 'w-full px-4 py-3.5 bg-[#f9fafb] border border-[#e5e5e5] rounded-xl focus:border-[#ba100a] focus:ring-2 focus:ring-[#ba100a]/10 text-[#1a1a1a] font-medium placeholder:text-[#9ca3af] transition-all text-[15px] outline-none';
  const labelClass = 'block text-[11px] font-bold text-[#6b7280] uppercase tracking-widest mb-1.5 pl-0.5';

  // ═══ ROLE SELECTION ═══
  if (mode === 'select') {
    return (
      <div className="min-h-screen bg-[#f4f4f5] flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-10">
            <img
              src="/images/logo-brigada.png"
              alt="Brigada Camarão"
              className="w-20 h-20 rounded-full object-cover mx-auto mb-4 shadow-lg"
            />
            <h1 className="font-headline text-3xl sm:text-4xl font-extrabold text-[#1a1a1a] tracking-tight">
              Brigada Camarão
            </h1>
            <p className="text-sm text-[#6b7280] mt-2">Sentinel Command — Selecione seu perfil de acesso</p>
          </div>

          {/* 3 Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {/* Admin Card */}
            <button
              onClick={() => { resetForm(); setMode('admin'); }}
              className="group bg-white rounded-2xl border border-[#e5e5e5] p-6 sm:p-8 text-left hover:shadow-lg hover:border-[#ba100a]/30 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-[#ba100a]/10 flex items-center justify-center mb-4 group-hover:bg-[#ba100a]/20 transition-colors">
                <Shield className="w-6 h-6 text-[#ba100a]" />
              </div>
              <h3 className="font-headline text-lg font-bold text-[#1a1a1a] mb-1">Admin</h3>
              <p className="text-xs text-[#6b7280] leading-relaxed">
                Gestão completa do sistema. Dashboard estratégico, tático e operacional.
              </p>
              <div className="mt-4 pt-3 border-t border-[#f0f0f0]">
                <span className="text-[10px] font-bold text-[#ba100a] uppercase tracking-wider">
                  @brigadacamarao.com
                </span>
              </div>
            </button>

            {/* CT Card */}
            <button
              onClick={() => { resetForm(); setMode('ct'); }}
              className="group bg-white rounded-2xl border border-[#e5e5e5] p-6 sm:p-8 text-left hover:shadow-lg hover:border-[#2563eb]/30 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-[#2563eb]/10 flex items-center justify-center mb-4 group-hover:bg-[#2563eb]/20 transition-colors">
                <Briefcase className="w-6 h-6 text-[#2563eb]" />
              </div>
              <h3 className="font-headline text-lg font-bold text-[#1a1a1a] mb-1">CT</h3>
              <p className="text-xs text-[#6b7280] leading-relaxed">
                Coordenador Técnico. Gestão de equipes e operações em campo.
              </p>
              <div className="mt-4 pt-3 border-t border-[#f0f0f0]">
                <span className="text-[10px] font-bold text-[#2563eb] uppercase tracking-wider">
                  Login + Senha
                </span>
              </div>
            </button>

            {/* Parceiro Card */}
            <button
              onClick={() => { resetForm(); setMode('parceiro'); }}
              className="group bg-white rounded-2xl border border-[#e5e5e5] p-6 sm:p-8 text-left hover:shadow-lg hover:border-[#16a34a]/30 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-[#16a34a]/10 flex items-center justify-center mb-4 group-hover:bg-[#16a34a]/20 transition-colors">
                <Users className="w-6 h-6 text-[#16a34a]" />
              </div>
              <h3 className="font-headline text-lg font-bold text-[#1a1a1a] mb-1">Parceiro</h3>
              <p className="text-xs text-[#6b7280] leading-relaxed">
                Bombeiro Civil. Acesso rápido a eventos disponíveis para candidatura.
              </p>
              <div className="mt-4 pt-3 border-t border-[#f0f0f0]">
                <span className="text-[10px] font-bold text-[#16a34a] uppercase tracking-wider">
                  Nome + CPF
                </span>
              </div>
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-[10px] text-[#9ca3af] mt-8">
            © 2026 Brigada Camarão · Prevenir · Combater · Salvar · LGPD Compliant
          </p>
        </div>
      </div>
    );
  }

  // ═══ REGISTRATION SUCCESS ═══
  if (registered) {
    return (
      <div className="min-h-screen bg-[#f4f4f5] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl border border-[#e5e5e5] p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[#16a34a]/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-[#16a34a]" />
          </div>
          <h2 className="font-headline text-2xl font-bold text-[#1a1a1a] mb-2">Cadastro Enviado!</h2>
          <p className="text-sm text-[#6b7280] mb-6 leading-relaxed">
            Seu cadastro foi enviado para aprovação do administrador.
            Você receberá uma notificação assim que for aprovado.
          </p>
          <div className="bg-[#fef9c3] border border-[#fde047] rounded-xl p-4 mb-6">
            <p className="text-xs text-[#854d0e] font-medium">
              ⏳ Status: <strong>Aguardando aprovação</strong>
            </p>
          </div>
          <button
            onClick={goBack}
            className="w-full py-3.5 bg-[#1a1a1a] text-white font-bold rounded-xl hover:bg-[#333] transition-colors text-sm"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  // ═══ LOGIN / REGISTER FORMS ═══
  const configs = {
    admin: { title: 'Admin', accent: '#ba100a', icon: Shield, domain: '@brigadacamarao.com' },
    ct: { title: 'Coordenador Técnico', accent: '#2563eb', icon: Briefcase, domain: null },
    parceiro: { title: 'Parceiro', accent: '#16a34a', icon: Users, domain: null },
    register: { title: 'Registrar Parceiro', accent: '#16a34a', icon: UserPlus, domain: null },
  };
  const cfg = configs[mode];

  return (
    <div className="min-h-screen bg-[#f4f4f5] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back button */}
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#1a1a1a] mb-6 transition-colors"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Voltar
        </button>

        <div className="bg-white rounded-2xl border border-[#e5e5e5] shadow-sm overflow-hidden">
          {/* Card accent bar */}
          <div className="h-1" style={{ backgroundColor: cfg.accent }} />

          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: cfg.accent + '15' }}>
                <cfg.icon className="w-5 h-5" style={{ color: cfg.accent }} />
              </div>
              <div>
                <h2 className="font-headline text-xl font-bold text-[#1a1a1a]">{cfg.title}</h2>
                {cfg.domain && (
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: cfg.accent }}>
                    {cfg.domain}
                  </p>
                )}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-xl mb-5 font-medium flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                {error}
              </div>
            )}

            {/* ── Admin Form ── */}
            {mode === 'admin' && (
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className={labelClass}>E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder="admin@brigadacamarao.com"
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Senha</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={inputClass + ' pr-12'}
                      placeholder="••••••••"
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#1a1a1a] transition-colors">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 font-bold text-white rounded-xl text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                  style={{ backgroundColor: cfg.accent }}>
                  {loading ? 'Entrando...' : 'Entrar'} <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* ── CT Form ── */}
            {mode === 'ct' && (
              <form onSubmit={handleCTLogin} className="space-y-4">
                <div>
                  <label className={labelClass}>E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder="seu@email.com"
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Senha</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={inputClass + ' pr-12'}
                      placeholder="••••••••"
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#1a1a1a] transition-colors">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 font-bold text-white rounded-xl text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                  style={{ backgroundColor: cfg.accent }}>
                  {loading ? 'Entrando...' : 'Entrar'} <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* ── Parceiro Form (Nome + CPF) ── */}
            {mode === 'parceiro' && (
              <form onSubmit={handleParceiroLogin} className="space-y-4">
                <div>
                  <label className={labelClass}>Nome Completo</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                    placeholder="João Pedro Santos"
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>CPF</label>
                  <input
                    type="text"
                    value={cpf}
                    onChange={(e) => setCpf(formatCpf(e.target.value))}
                    className={inputClass}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    required
                  />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 font-bold text-white rounded-xl text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                  style={{ backgroundColor: cfg.accent }}>
                  {loading ? 'Entrando...' : 'Acessar Eventos'} <ArrowRight className="w-4 h-4" />
                </button>
                <div className="pt-2 border-t border-[#f0f0f0]">
                  <button type="button"
                    onClick={() => { resetForm(); setMode('register'); }}
                    className="w-full py-3 text-sm font-bold text-[#16a34a] hover:bg-[#16a34a]/5 rounded-xl transition-colors flex items-center justify-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Primeiro acesso? Registre-se
                  </button>
                </div>
              </form>
            )}

            {/* ── Register Form (Parceiro) ── */}
            {mode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-3 mb-2">
                  <p className="text-xs text-[#166534] font-medium">
                    📋 Seu cadastro será enviado para aprovação do administrador antes de ativar o acesso.
                  </p>
                </div>
                <div>
                  <label className={labelClass}>Nome Completo</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                    placeholder="João Pedro Santos"
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>CPF</label>
                  <input
                    type="text"
                    value={cpf}
                    onChange={(e) => setCpf(formatCpf(e.target.value))}
                    className={inputClass}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Telefone (opcional)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputClass}
                    placeholder="(31) 99999-9999"
                  />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 font-bold text-white rounded-xl text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                  style={{ backgroundColor: cfg.accent }}>
                  {loading ? 'Enviando...' : 'Enviar para Aprovação'} <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Demo credentials */}
            {(mode === 'admin' || mode === 'ct') && (
              <div className="mt-5 pt-4 border-t border-[#f0f0f0]">
                <p className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">Acesso Demo</p>
                <p className="text-xs text-[#6b7280]">
                  <span className="font-semibold text-[#1a1a1a]">
                    {mode === 'admin' ? 'admin@brigadacamarao.com' : 'coo@brigadacamarao.com'}
                  </span> — qualquer senha
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-[#9ca3af] mt-6">
          © 2026 Brigada Camarão · LGPD Compliant
        </p>
      </div>
    </div>
  );
}
