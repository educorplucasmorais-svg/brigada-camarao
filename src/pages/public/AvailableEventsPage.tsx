import { Link } from 'react-router-dom';
import { mockEvents } from '../../data/mockData';
import type { Event } from '../../types';

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
};

const payPerPerson = (event: Event) => Math.round(event.budget / event.vacancies);
const remaining = (event: Event) => event.vacancies - event.filledVacancies;

type EventConfig = { bg: string; accent: string; icon: string; label: string };

const eventConfig = (type: string): EventConfig => {
  switch (type.toLowerCase()) {
    case 'festival': return { bg: 'from-[#ff6a00] to-[#ee0979]', accent: '#ee0979', icon: 'celebration', label: 'Festival' };
    case 'show':     return { bg: 'from-[#4a0000] to-[#900001]',  accent: '#ba100a',  icon: 'music_note',  label: 'Show' };
    case 'feira':    return { bg: 'from-[#0d47a1] to-[#1976d2]', accent: '#1976d2',  icon: 'store',       label: 'Feira' };
    case 'esportivo':return { bg: 'from-[#1b5e20] to-[#43a047]', accent: '#43a047',  icon: 'sports',      label: 'Esportivo' };
    default:         return { bg: 'from-[#37474f] to-[#607d8b]', accent: '#607d8b',  icon: 'local_fire_department', label: type };
  }
};

type StatusTag = { label: string; bg: string; text: string };
const statusTag = (event: Event): StatusTag => {
  if (event.status === 'active')                          return { label: 'ESCALA ESPECIAL', bg: '#900001',   text: '#fff' };
  if (event.filledVacancies >= event.vacancies)           return { label: 'ESGOTADO',         bg: '#1b1c1c',   text: '#fff' };
  return                                                         { label: 'DISPONÍVEL',        bg: '#2e7d32',   text: '#fff' };
};

export function AvailableEventsPage() {
  const available = mockEvents.filter(
    (e) => e.status === 'upcoming' || e.status === 'active'
  );

  return (
    <div className="min-h-screen" style={{ background: '#f7f7f9' }}>

      {/* ── Brand Header ── */}
      <header style={{ background: '#900001' }} className="sticky top-0 z-40 shadow-lg">
        <div className="flex items-center justify-between px-4 py-3 max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-sm opacity-40" style={{ background: '#fff' }} />
              <img src="/images/logo-brigada.png" alt="Brigada Camarão"
                className="relative h-10 w-10 rounded-full object-cover border-2 border-white/30 shadow" />
            </div>
            <div>
              <p className="text-[13px] font-black text-white uppercase tracking-wider leading-none">
                Brigada Camarão
              </p>
              <p className="text-[10px] font-medium text-white/60 leading-none mt-0.5">
                Portal do Colaborador
              </p>
            </div>
          </div>
          <Link to="/admin/perfil"
            className="w-10 h-10 rounded-full bg-white/15 border border-white/25 flex items-center justify-center hover:bg-white/25 transition-colors">
            <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              person
            </span>
          </Link>
        </div>
      </header>

      {/* ── Hero Strip ── */}
      <div style={{ background: 'linear-gradient(180deg, #7a0001 0%, #900001 40%, #f7f7f9 100%)' }}
        className="pt-6 pb-10 px-4 text-center">
        <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em] mb-1">
          Oportunidades em aberto
        </p>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Escalas Disponíveis
        </h1>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="w-2 h-2 rounded-full bg-[#4caf50] animate-pulse" />
          <p className="text-white/70 text-sm font-medium">{available.length} oportunidades encontradas</p>
        </div>
      </div>

      {/* ── Cards ── */}
      <div className="px-4 pb-28 max-w-2xl mx-auto -mt-4 space-y-5">
        {available.map((event) => {
          const cfg = eventConfig(event.type);
          const isFull = event.filledVacancies >= event.vacancies;
          const fillPct = Math.min(100, (event.filledVacancies / event.vacancies) * 100);
          const tag = statusTag(event);
          const pay = payPerPerson(event);
          const rem = remaining(event);

          return (
            <div key={event.id}
              className="rounded-2xl overflow-hidden shadow-lg"
              style={{ background: '#ffffff', border: '1px solid #ebebeb' }}>

              {/* ── Hero Band ── */}
              <div className={`relative h-40 bg-gradient-to-br ${cfg.bg} overflow-hidden`}>
                {/* Decorative circles */}
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-black/10" />

                {/* Type pill + icon */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-inner border border-white/20">
                    <span className="material-symbols-outlined text-white text-3xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}>
                      {cfg.icon}
                    </span>
                  </div>
                  <span className="text-white/90 text-[11px] font-black uppercase tracking-[0.25em]">
                    {cfg.label}
                  </span>
                </div>

                {/* Status badge */}
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg"
                    style={{ background: tag.bg, color: tag.text }}>
                    {tag.label}
                  </span>
                </div>
              </div>

              {/* ── Card Body ── */}
              <div className="p-5">
                <h3 className="font-black text-[#111827] text-xl leading-tight mb-1">
                  {event.title}
                </h3>
                <p className="text-[11px] font-bold uppercase tracking-widest mb-4"
                  style={{ color: cfg.accent }}>
                  {event.location}
                </p>

                {/* Info chips */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {[
                    { icon: 'calendar_today', text: formatDate(event.date) },
                    { icon: 'schedule', text: '08:00 – 20:00 · 12h' },
                  ].map((chip) => (
                    <div key={chip.icon}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold text-[#374151]"
                      style={{ background: '#f3f4f6' }}>
                      <span className="material-symbols-outlined text-sm" style={{ color: '#900001' }}>
                        {chip.icon}
                      </span>
                      {chip.text}
                    </div>
                  ))}
                </div>

                {/* Pay + Vacancies row */}
                <div className="flex items-end justify-between mb-3">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#9ca3af] mb-0.5">
                      Remuneração
                    </p>
                    <p className="text-3xl font-black leading-none" style={{ color: '#900001' }}>
                      R$ {pay.toLocaleString('pt-BR')}<span className="text-base font-bold">,00</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#9ca3af] mb-0.5">
                      Vagas
                    </p>
                    <p className="text-sm font-black text-[#111827]">
                      {rem} <span className="font-medium text-[#6b7280]">de {event.vacancies}</span>
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 rounded-full mb-5 overflow-hidden" style={{ background: '#f3f4f6' }}>
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${fillPct}%`, background: isFull ? '#ef4444' : cfg.accent }} />
                </div>

                {/* CTA */}
                {isFull ? (
                  <div className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-wider"
                    style={{ background: '#f3f4f6', color: '#9ca3af' }}>
                    <span className="material-symbols-outlined text-base">block</span>
                    Vagas Esgotadas
                  </div>
                ) : (
                  <Link to={`/missao/${event.id}`}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-wider text-white transition-all active:scale-[0.98] shadow-md"
                    style={{ background: `linear-gradient(135deg, #900001, ${cfg.accent})`, boxShadow: `0 4px 15px ${cfg.accent}40` }}>
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                      bolt
                    </span>
                    Tenho Interesse
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </Link>
                )}
              </div>
            </div>
          );
        })}

        {available.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
              style={{ background: '#fef2f2' }}>
              <span className="material-symbols-outlined text-3xl" style={{ color: '#900001' }}>
                event_busy
              </span>
            </div>
            <p className="font-black text-lg text-[#111827] mb-1">Nenhuma escala disponível</p>
            <p className="text-sm text-[#6b7280]">Volte em breve para novas oportunidades</p>
          </div>
        )}
      </div>

      {/* ── Bottom Nav ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
        style={{ background: '#ffffff', borderTop: '1px solid #f3f4f6', boxShadow: '0 -4px 20px rgba(0,0,0,0.08)' }}>
        <div className="flex max-w-2xl mx-auto">
          <div className="flex-1 flex flex-col items-center py-3 gap-0.5">
            <span className="material-symbols-outlined text-xl" style={{ color: '#900001', fontVariationSettings: "'FILL' 1" }}>
              event
            </span>
            <span className="text-[10px] font-black uppercase" style={{ color: '#900001' }}>Escalas</span>
            <div className="w-5 h-0.5 rounded-full mt-0.5" style={{ background: '#900001' }} />
          </div>
          <Link to="/" className="flex-1 flex flex-col items-center py-3 gap-0.5 hover:bg-gray-50 transition-colors">
            <span className="material-symbols-outlined text-xl text-[#9ca3af]">home</span>
            <span className="text-[10px] font-bold uppercase text-[#9ca3af]">Início</span>
          </Link>
          <Link to="/admin/perfil" className="flex-1 flex flex-col items-center py-3 gap-0.5 hover:bg-gray-50 transition-colors">
            <span className="material-symbols-outlined text-xl text-[#9ca3af]">person</span>
            <span className="text-[10px] font-bold uppercase text-[#9ca3af]">Perfil</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

