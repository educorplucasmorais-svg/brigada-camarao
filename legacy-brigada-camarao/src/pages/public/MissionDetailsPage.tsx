import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockEvents } from '../../data/mockData';

function getHeroGradient(type: string): string {
  const t = type.toLowerCase();
  if (t.includes('festival')) return 'from-[#ff6b35] to-[#f7c59f]';
  if (t.includes('feira')) return 'from-[#1a237e] to-[#3949ab]';
  return 'from-[#8b0000] to-[#ba100a]';
}

function getHeroIcon(type: string): string {
  const t = type.toLowerCase();
  if (t.includes('festival')) return 'celebration';
  if (t.includes('feira')) return 'storefront';
  if (t.includes('esportivo') || t.includes('esporte')) return 'sports';
  if (t.includes('carnaval')) return 'music_note';
  if (t.includes('privado')) return 'home';
  return 'local_fire_department';
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function MissionDetailsPage() {
  const { id } = useParams();
  const event = mockEvents.find((e) => e.id === id);
  const [portaria50Open, setPortaria50Open] = useState(false);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center px-4">
          <p className="text-on-surface-variant font-medium">Missão não encontrada.</p>
          <Link to="/eventos" className="text-primary font-bold text-sm mt-2 inline-block">
            ← Voltar para Eventos
          </Link>
        </div>
      </div>
    );
  }

  const isFull = event.filledVacancies >= event.vacancies;
  const fillPct = Math.min((event.filledVacancies / event.vacancies) * 100, 100);
  const pricePerShift = Math.round(event.budget / event.vacancies);

  return (
    <div className="bg-surface min-h-screen pb-32">
      {/* TopAppBar */}
      <div className="sticky top-0 bg-surface-container-lowest border-b border-outline-variant/20 z-30 px-4 py-3 flex items-center">
        <Link to="/eventos" className="text-on-surface flex items-center">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <span className="flex-1 text-center text-sm font-black text-on-surface">Detalhes da Missão</span>
        <img
          src="/images/logo-brigada.png"
          alt="Brigada Camarão"
          className="h-8 w-8 rounded-full object-cover"
        />
      </div>

      {/* Hero band */}
      <div className={`h-36 relative overflow-hidden bg-gradient-to-br ${getHeroGradient(event.type)}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="material-symbols-outlined text-5xl text-white/50"
            style={{ fontSize: '3rem' }}
          >
            {getHeroIcon(event.type)}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-white font-black text-xl leading-tight">{event.title}</h1>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">

        {/* Card A — Status & Vagas */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-bold text-success">Inscrição Aberta</span>
            </div>
            <div className="ml-auto text-right">
              <span className="text-2xl font-black text-on-surface">
                {event.filledVacancies}/{event.vacancies}
              </span>
              <p className="text-[10px] text-on-surface-variant uppercase">preenchidas</p>
            </div>
          </div>
          <div className="mt-3 h-2 bg-surface-container-high rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${fillPct}%` }}
            />
          </div>
          {isFull ? (
            <p className="text-sm font-bold text-error mt-2">Vagas esgotadas</p>
          ) : (
            <p className="text-sm font-bold text-success mt-2">Sua vaga está disponível!</p>
          )}
        </div>

        {/* Card B — Informações do Evento */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-3">
            INFORMAÇÕES
          </p>
          {[
            { icon: 'calendar_today', text: formatDate(event.date) },
            { icon: 'schedule', text: '08:00 às 20:00 — 12 horas' },
            { icon: 'location_on', text: event.location },
            { icon: 'payments', text: `R$ ${pricePerShift},00 por escala` },
          ].map(({ icon, text }, idx, arr) => (
            <div
              key={icon}
              className={`flex items-center gap-3 py-2 ${idx < arr.length - 1 ? 'border-b border-outline-variant/10' : ''}`}
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '1.1rem' }}>
                  {icon}
                </span>
              </div>
              <span className="text-sm text-on-surface">{text}</span>
            </div>
          ))}
        </div>

        {/* Card C — Uniforme + Portaria 50 */}
        <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
          <div
            className="p-5 flex items-center gap-3 cursor-pointer"
            onClick={() => setPortaria50Open(o => !o)}
          >
            <div className="w-8 h-8 rounded-lg bg-tertiary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-tertiary-container" style={{ fontSize: '1.1rem' }}>
                checkroom
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">UNIFORME</p>
              <p className="text-sm font-bold text-on-surface truncate">
                {event.uniform || 'Uniforme Brigada Camarão'}
              </p>
            </div>
            <span
              className={`material-symbols-outlined text-outline transform transition-transform ${portaria50Open ? 'rotate-180' : ''}`}
            >
              expand_more
            </span>
          </div>

          {portaria50Open && (
            <>
              <div className="border-t border-outline-variant/20" />
              <div className="px-5 pb-5 pt-3">
                <span className="text-[10px] font-black text-primary-container uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full inline-block mb-3">
                  PORTARIA 50 / CBMMG
                </span>
                <p className="text-sm font-bold text-on-surface mb-2">Uniformização Obrigatória</p>
                {[
                  'Calça operacional preta',
                  'Camiseta polo vermelha com identificação',
                  'Colete refletivo "BRIGADISTA"',
                  'Boné preto com brasão',
                  'Calçado fechado preto (antiderrapante)',
                  'Crachá de identificação Brigada Camarão',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 py-1.5">
                    <span
                      className="material-symbols-outlined text-success"
                      style={{ fontSize: '1rem', fontVariationSettings: "'FILL' 1" }}
                    >
                      check_circle
                    </span>
                    <span className="text-sm text-on-surface-variant">{item}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Card D — Comunicação / WhatsApp */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#25D366]/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined" style={{ fontSize: '1.1rem', color: '#25D366' }}>
                radio
              </span>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">COMUNICAÇÃO</p>
              <p className="text-sm font-bold text-on-surface">Grupo de Coordenação</p>
            </div>
          </div>
          <a
            href={event.whatsappGroup || 'https://wa.me/5531999999999'}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 w-full py-3.5 rounded-2xl flex items-center justify-center gap-3 font-black text-sm uppercase tracking-tight text-white"
            style={{ backgroundColor: '#25D366' }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Entrar no Grupo de WhatsApp
          </a>
        </div>
      </div>

      {/* Sticky confirm button */}
      <div className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-3 bg-surface/80 backdrop-blur-sm z-30">
        <Link
          to="/confirmacao"
          className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-on-primary font-black text-sm rounded-2xl uppercase tracking-tight shadow-xl shadow-primary/30 active:scale-[0.98] transition-transform"
        >
          Confirmar Dados e Inscrição
          <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}
