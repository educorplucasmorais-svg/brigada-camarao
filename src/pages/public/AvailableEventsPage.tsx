import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Search, Flame, ArrowLeft } from 'lucide-react';
import { mockEvents } from '../../data/mockData';

export function AvailableEventsPage() {
  const available = mockEvents
    .filter((e) => e.status === 'upcoming' || e.status === 'active');

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-primary px-4 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-on-primary">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-on-primary" />
            <div>
              <p className="text-on-primary font-black text-sm uppercase tracking-wider">Brigada Camarão</p>
              <p className="text-on-primary/70 text-[10px] font-bold uppercase tracking-widest">Escalas Ativas</p>
            </div>
          </div>
        </div>
        <button className="text-on-primary">
          <Search className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        <h2 className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest mb-4">
          Escalas Disponíveis
        </h2>

        <div className="space-y-6">
          {available.map((event) => (
            <div key={event.id} className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden">
              {/* Event image placeholder */}
              <div className="h-40 bg-gradient-to-br from-surface-container-high to-surface-container relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Flame className="w-10 h-10 text-outline-variant mx-auto mb-2" />
                    <p className="text-xs font-bold text-on-surface-variant uppercase">{event.type}</p>
                  </div>
                </div>
                {event.status === 'active' && (
                  <span className="absolute top-3 right-3 bg-primary text-on-primary text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">
                    Escala Especial
                  </span>
                )}
              </div>

              <div className="p-5">
                <h3 className="font-extrabold text-on-surface text-lg mb-3">{event.title}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="font-medium">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="font-medium">08:00 às 20:00 (12h)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="font-medium">{event.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Remuneração</p>
                    <p className="text-xl font-black text-primary">
                      R$ {(event.budget / event.vacancies).toFixed(0)},00
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Vagas</p>
                    <p className="text-sm font-bold text-on-surface">
                      {event.vacancies - event.filledVacancies} / {event.vacancies} restantes
                    </p>
                  </div>
                </div>

                <Link
                  to={`/missao/${event.id}`}
                  className="w-full py-3.5 bg-primary text-on-primary font-black text-sm rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-[0.98] flex items-center justify-center gap-2 uppercase tracking-tight"
                >
                  Tenho Interesse
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-outline-variant/20 flex lg:hidden z-30">
        <Link to="/eventos" className="flex-1 flex flex-col items-center py-3 text-primary">
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase mt-1">Eventos</span>
        </Link>
        <Link to="/" className="flex-1 flex flex-col items-center py-3 text-on-surface-variant">
          <Flame className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase mt-1">Perfil</span>
        </Link>
      </nav>
    </div>
  );
}
