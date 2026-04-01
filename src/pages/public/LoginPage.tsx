import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, ArrowRight, MessageCircle, HelpCircle, Eye, EyeOff, Shield, Users, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      navigate('/admin');
    } else {
      setError('Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* LEFT — Gradient Hero */}
      <div className="gradient-hero relative lg:w-[55%] flex flex-col justify-center items-center p-8 lg:p-16 text-white overflow-hidden">
        {/* Decorative grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        {/* Decorative circles */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full border border-white/10" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full border border-white/5" />
        <div className="absolute top-1/2 right-0 w-48 h-48 rounded-full bg-white/5 blur-3xl" />

        <div className="relative z-10 text-center lg:text-left max-w-lg">
          <div className="flex items-center gap-3 mb-6 justify-center lg:justify-start">
            <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Flame className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none mb-4">
            Brigada<br />Camarão
          </h1>

          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/70 mb-3">
            Recrutamento de Bombeiro Civil
          </p>

          <p className="text-lg lg:text-xl text-white/60 font-medium italic mb-10">
            &ldquo;Sempre perto de você&rdquo;
          </p>

          {/* Stats preview */}
          <div className="hidden lg:flex items-center gap-8 pt-8 border-t border-white/10">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-white/50" />
              <div>
                <p className="text-2xl font-black">156</p>
                <p className="text-[10px] uppercase tracking-widest text-white/50">Bombeiros</p>
              </div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-white/50" />
              <div>
                <p className="text-2xl font-black">47</p>
                <p className="text-[10px] uppercase tracking-widest text-white/50">Eventos</p>
              </div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-white/50" />
              <div>
                <p className="text-2xl font-black">96%</p>
                <p className="text-[10px] uppercase tracking-widest text-white/50">Satisfação</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT — Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-surface">
        <main className="w-full max-w-md">
          {/* Flame icon */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-on-primary-container flex items-center justify-center shadow-xl shadow-primary/20">
              <Flame className="w-8 h-8 text-on-primary" />
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-on-surface text-center mb-1">
            Acesso ao Sistema
          </h2>
          <p className="text-sm text-on-surface-variant text-center mb-8">
            Informe seus dados para prosseguir
          </p>

          {/* Error */}
          {error && (
            <div className="bg-error-container text-on-error-container text-sm p-3 rounded-2xl mb-4 font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-black text-on-surface-variant uppercase tracking-widest px-1">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-surface-container-low border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-on-surface font-medium placeholder:text-outline/40 transition-all text-sm outline-none"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-black text-on-surface-variant uppercase tracking-widest px-1">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 pr-12 bg-surface-container-low border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-on-surface font-medium placeholder:text-outline/40 transition-all text-sm outline-none"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary text-on-primary font-black text-base rounded-2xl shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all active:scale-[0.98] flex items-center justify-center gap-2 uppercase tracking-tight disabled:opacity-50"
              >
                {loading ? 'Entrando...' : 'Entrar'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Info box */}
          <div className="mt-8 p-4 bg-surface-container-low rounded-2xl">
            <p className="text-[11px] font-black text-primary uppercase tracking-wider mb-2">
              Por que pedimos isso?
            </p>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Os dados são necessários para a escala de eventos. Ao clicar em &ldquo;Entrar&rdquo;,
              você garante o recebimento legal dos seus honorários após a conclusão do evento.
            </p>
          </div>

          {/* Bottom links */}
          <div className="mt-6 flex items-center justify-center gap-6">
            <a href="#" className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider hover:underline">
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
            <a href="#" className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant uppercase tracking-wider hover:text-primary transition-colors">
              <HelpCircle className="w-4 h-4" />
              FAQ
            </a>
          </div>

          <p className="text-center text-[10px] text-outline mt-4">
            Demo: admin@brigadacamarao.com / qualquer senha
          </p>
        </main>
      </div>
    </div>
  );
}
