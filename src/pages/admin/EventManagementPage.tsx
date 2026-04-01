import { Calendar, MapPin, Search, Flame, Plus } from 'lucide-react';
import { useState } from 'react';
import { mockEvents } from '../../data/mockData';
import { StatusBadge } from '../../components/StatusBadge';
import { DataBadge } from '../../components/DataBadge';
import { useApiData } from '../../hooks/useApiData';
import { api } from '../../lib/api';
import type { Event } from '../../types';

export function EventManagementPage() {
  const [search, setSearch] = useState('');
  const { data: events, isLive } = useApiData<Event[]>(() => api.getEvents(), mockEvents);
  const filtered = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.location.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = events.filter(e => e.status === 'active').length;

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Console Sentinel</p>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-on-surface">Gestão de Eventos</h1>
        </div>
        <button className="py-3 px-5 bg-primary text-on-primary font-black text-sm rounded-2xl shadow-lg shadow-primary/20 flex items-center gap-2 uppercase tracking-tight">
          <Plus className="w-4 h-4" /> Novo
        </button>
      </div>

      {/* Hero stat */}
      <div className="bg-primary rounded-2xl p-6 mb-6 flex items-center justify-between text-on-primary">
        <div>
          <p className="text-3xl font-black">{activeCount > 0 ? `${events.length} Unidades Ativas` : '0 Ativas'}</p>
          <p className="text-on-primary/70 text-sm font-medium mt-1">Total de eventos cadastrados</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Flame className="w-12 h-12 text-on-primary/30" />
          <DataBadge isLive={isLive} />
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
        <input
          type="text"
          placeholder="Buscar eventos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-on-surface font-medium placeholder:text-outline/40 transition-all text-sm outline-none"
        />
      </div>

      {/* Events list */}
      <p className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest mb-3">Registro de Eventos</p>
      <div className="space-y-3">
        {filtered.map((event) => (
          <div key={event.id} className="bg-surface-container-lowest p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-extrabold text-on-surface">{event.title}</h3>
                <p className="text-xs text-on-surface-variant font-medium mt-0.5">{event.type}</p>
              </div>
              <StatusBadge status={event.status} />
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-on-surface-variant">
              <span className="flex items-center gap-1.5 font-medium"><Calendar className="w-4 h-4 text-primary" />{event.date}</span>
              <span className="flex items-center gap-1.5 font-medium"><MapPin className="w-4 h-4 text-primary" />{event.location}</span>
              <span className="font-bold text-on-surface">R$ {event.budget.toLocaleString('pt-BR')}</span>
              <span className="font-medium">{event.filledVacancies}/{event.vacancies} vagas</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
