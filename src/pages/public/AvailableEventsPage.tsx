import { Link } from 'react-router-dom';
import { mockEvents } from '../../data/mockData';
import type { Event } from '../../types';

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
};

const payPerPerson = (event: Event) => Math.round(event.budget / event.vacancies);

const remaining = (event: Event) => event.vacancies - event.filledVacancies;

type HeroConfig = { gradient: string; icon: string };

const heroConfig = (type: string): HeroConfig => {
  switch (type.toLowerCase()) {
    case 'festival':
      return { gradient: 'from-[#ff6b35] to-[#f7c59f]', icon: 'celebration' };
    case 'show':
      return { gradient: 'from-[#8b0000] to-[#ba100a]', icon: 'music_note' };
    case 'feira':
      return { gradient: 'from-[#1a237e] to-[#3949ab]', icon: 'store' };
    case 'esportivo':
      return { gradient: 'from-[#1b5e20] to-[#388e3c]', icon: 'sports' };
    default:
      return { gradient: 'from-surface-container-high to-surface-container', icon: 'local_fire_department' };
  }
};

export function AvailableEventsPage() {
  const available = mockEvents.filter(
    (e) => e.status === 'upcoming' || e.status === 'active'
  );

  return (
    <div className="bg-surface min-h-screen pb-20">
      {/* Top App Bar */}
      <header className="sticky top-0 bg-surface-container-lowest border-b border-outline-variant/20 z-30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src="/images/logo-brigada.png"
            alt="Brigada Camarão"
            className="h-9 w-9 rounded-full object-cover shadow"
          />
          <div>
            <p className="text-xs font-black text-on-surface uppercase tracking-tight leading-none">
              BRIGADA CAMARÃO
            </p>
            <p className="text-[10px] text-on-surface-variant font-medium leading-none mt-0.5">
              Portal do Colaborador
            </p>
          </div>
        </div>
        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
          <span
            className="material-symbols-outlined text-sm text-on-primary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            person
          </span>
        </div>
      </header>

      {/* Page Header */}
      <div className="px-4 pt-5 pb-3">
        <p className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest">
          ESCALAS DISPONÍVEIS
        </p>
        <p className="text-sm text-on-surface-variant mt-0.5">
          {available.length} oportunidades encontradas
        </p>
      </div>

      {/* Event Cards */}
      {available.map((event) => {
        const { gradient, icon } = heroConfig(event.type);
        const isFull = event.filledVacancies >= event.vacancies;
        const fillPct = Math.min(100, (event.filledVacancies / event.vacancies) * 100);

        return (
          <div
            key={event.id}
            className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden mb-5 mx-4"
          >
            {/* Hero */}
            <div className={`h-44 relative overflow-hidden bg-gradient-to-br ${gradient}`}>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <span
                  className="material-symbols-outlined text-5xl text-white/90"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {icon}
                </span>
                <p className="text-white font-black text-xs uppercase tracking-widest">
                  {event.type}
                </p>
              </div>

              {/* Status badge */}
              {event.status === 'active' ? (
                <span className="absolute top-3 right-3 bg-primary/90 text-on-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
                  ESCALA ESPECIAL
                </span>
              ) : isFull ? (
                <span className="absolute top-3 right-3 bg-[#1b1c1c]/80 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
                  ESGOTADO
                </span>
              ) : (
                <span className="absolute top-3 right-3 bg-success/90 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
                  DISPONÍVEL
                </span>
              )}
            </div>

            {/* Card Body */}
            <div className="p-5">
              <h3 className="font-black text-on-surface text-lg leading-tight mb-3">
                {event.title}
              </h3>

              {/* Info rows */}
              <div className="space-y-1.5 mb-4">
                <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-sm">calendar_today</span>
                  <span className="font-medium">{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-sm">schedule</span>
                  <span className="font-medium">08:00 às 20:00 (12h)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-sm">location_on</span>
                  <span className="font-medium">{event.location}</span>
                </div>
              </div>

              {/* Pay + Vacancies */}
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                    REMUNERAÇÃO
                  </p>
                  <p className="text-2xl font-black text-primary">
                    R$ {payPerPerson(event)},00
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                    VAGAS
                  </p>
                  <p className="text-sm font-bold text-on-surface">
                    {remaining(event)} de {event.vacancies} restantes
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-surface-container-high rounded-full mb-4 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${fillPct}%` }}
                />
              </div>

              {/* CTA */}
              {isFull ? (
                <button
                  disabled
                  className="w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-tight flex items-center justify-center gap-2 bg-surface-container text-on-surface-variant cursor-not-allowed"
                >
                  VAGAS ESGOTADAS
                </button>
              ) : (
                <Link
                  to={`/missao/${event.id}`}
                  className="w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-tight flex items-center justify-center gap-2 bg-primary text-on-primary shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform"
                >
                  Tenho Interesse →
                </Link>
              )}
            </div>
          </div>
        );
      })}

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-outline-variant/20 z-30 flex lg:hidden">
        <div className="flex-1 flex flex-col items-center py-3">
          <span
            className="material-symbols-outlined text-primary text-xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            event
          </span>
          <span className="text-[10px] font-bold text-primary uppercase">Eventos</span>
          <div className="bg-primary w-1 h-1 rounded-full mt-0.5" />
        </div>
        <Link to="/" className="flex-1 flex flex-col items-center py-3">
          <span className="material-symbols-outlined text-on-surface-variant text-xl">
            person
          </span>
          <span className="text-[10px] font-bold text-on-surface-variant uppercase">Perfil</span>
        </Link>
      </nav>
    </div>
  );
}
