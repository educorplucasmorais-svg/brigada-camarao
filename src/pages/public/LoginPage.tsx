import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, ArrowRight, Eye, EyeOff, Shield, Users, Star, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Fotos da Brigada Camarão — substitua por fotos reais do Instagram (@brigadacamarao)
// Basta trocar os arquivos em /public/images/hero/
const heroPhotos = [
  '/images/hero/hero-1.jpg', // Brigadistas em ação
  '/images/hero/hero-2.jpg', // Treinamento de resgate
  '/images/hero/hero-3.jpg', // Evento — estrutura
  '/images/hero/hero-4.jpg', // Grande evento
  '/images/hero/hero-5.jpg', // Primeiros socorros
];

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhoto((prev) => (prev + 1) % heroPhotos.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      navigate('/admin');
    } else {
      setError('Credenciais inválidas. Verifique e-mail e senha.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ═══ LEFT — Photo Slideshow Hero ═══ */}
      <div className="relative lg:w-[55%] min-h-[35vh] sm:min-h-[40vh] lg:min-h-screen flex flex-col justify-center items-center overflow-hidden">
        {/* Photo layers */}
        {heroPhotos.map((photo, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
              i === currentPhoto ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={photo}
              alt=""
              className="w-full h-full object-cover slideshow-photo"
              style={{ filter: 'blur(2px)' }}
              key={`${i}-${currentPhoto === i ? 'active' : 'idle'}`}
            />
          </div>
        ))}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-primary/40 to-black/70 z-10" />

        {/* Content */}
        <div className="relative z-20 text-center lg:text-left px-6 sm:px-8 lg:px-16 max-w-lg">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-4 sm:mb-8 justify-center lg:justify-start">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 logo-pulse">
              <Flame className="w-7 h-7 sm:w-9 sm:h-9 text-white" />
            </div>
          </div>

          <h1 className="font-headline text-3xl sm:text-5xl lg:text-7xl font-extrabold uppercase tracking-tight leading-[0.9] text-white mb-4 drop-shadow-2xl">
            Brigada<br />Camarão
          </h1>

          <p className="text-xs sm:text-[11px] font-bold uppercase tracking-[0.3em] text-white/60 mb-2">
            Recrutamento de Bombeiro Civil
          </p>

          <p className="text-base sm:text-lg text-white/50 font-medium italic mb-6 sm:mb-10">
            "Sempre perto de você"
          </p>

          {/* Stats row — visible on md+ */}
          <div className="hidden md:flex items-center gap-6 py-6 border-t border-white/10">
            {[
              { icon: Shield, value: '156', label: 'Bombeiros' },
              { icon: Users, value: '47', label: 'Eventos' },
              { icon: Star, value: '96%', label: 'Satisfação' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <stat.icon className="w-5 h-5 text-white/40" />
                <div>
                  <p className="text-2xl font-extrabold font-headline text-white">{stat.value}</p>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold">{stat.label}</p>
                </div>
                {i < 2 && <div className="w-px h-8 bg-white/10 ml-4" />}
              </div>
            ))}
          </div>

          {/* Photo indicator dots */}
          <div className="flex items-center gap-1.5 mt-6 justify-center lg:justify-start">
            {heroPhotos.map((_, i) => (
              <div
                key={i}
                className={`photo-dot ${i === currentPhoto ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ═══ RIGHT — Login Form ═══ */}
      <div className="flex-1 flex items-center justify-center p-5 sm:p-10 lg:p-16 bg-surface-container-lowest">
        <main className="w-full max-w-[420px]">
          {/* Header */}
          <div className="mb-6 sm:mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Acesso Seguro</span>
            </div>
            <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-on-surface leading-tight">
              Entre na sua<br />conta
            </h2>
            <p className="text-sm text-on-surface-variant mt-3 leading-relaxed">
              Gerencie eventos, equipes e escalas em tempo real.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl mb-6 font-medium flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10 text-on-surface font-medium placeholder:text-outline/40 transition-all text-[15px] outline-none"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 pr-12 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10 text-on-surface font-medium placeholder:text-outline/40 transition-all text-[15px] outline-none"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-outline/60 hover:text-on-surface transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 btn-gradient font-headline font-bold text-[15px] rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 uppercase tracking-wider disabled:opacity-50"
              >
                {loading ? 'Entrando...' : 'Entrar'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="border-t border-outline-variant/20 mt-8 pt-6">
            <div className="bg-surface-container-low border border-outline-variant/15 rounded-xl p-5">
              <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                Acesso Demo
              </p>
              <p className="text-[13px] text-on-surface-variant leading-relaxed">
                <span className="font-semibold text-on-surface">admin@brigadacamarao.com</span> — qualquer senha
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-[10px] text-outline/50 mt-6">
            © 2026 Brigada Camarão · LGPD Compliant
          </p>
        </main>
      </div>
    </div>
  );
}
