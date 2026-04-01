import { Search, Users } from 'lucide-react';
import { useState } from 'react';
import { mockVacancies } from '../../data/mockData';
import { StatusBadge } from '../../components/StatusBadge';
import { DataBadge } from '../../components/DataBadge';
import { useApiData } from '../../hooks/useApiData';
import { api } from '../../lib/api';
import type { Vacancy } from '../../types';

export function VacancyManagementPage() {
  const [search, setSearch] = useState('');
  const { data: vacancies, isLive } = useApiData<Vacancy[]>(() => api.getVacancies(), mockVacancies);
  const filtered = vacancies.filter((v) =>
    v.eventTitle.toLowerCase().includes(search.toLowerCase()) ||
    v.role.toLowerCase().includes(search.toLowerCase())
  );

  const totalFilled = vacancies.reduce((a, v) => a + v.filled, 0);
  const totalQty = vacancies.reduce((a, v) => a + v.quantity, 0);
  const fillRate = Math.round((totalFilled / totalQty) * 100);

  return (
    <div>
      <div className="mb-8">
        <p className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Operação de Escala</p>
        <h1 className="text-xl lg:text-2xl font-extrabold tracking-tight text-on-surface">Gestão de Vagas</h1>
      </div>

      {/* Fill rate hero */}
      <div className="bg-primary rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-on-primary/70 text-xs font-bold uppercase tracking-widest">Mural de Vagas</p>
          <DataBadge isLive={isLive} />
        </div>
        <div className="flex items-end gap-4">
          <span className="text-5xl font-black text-on-primary">{fillRate}%</span>
          <div className="mb-1">
            <p className="text-on-primary/70 text-sm font-medium">{totalFilled} / {totalQty} preenchidas</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-4 h-2 bg-on-primary/20 rounded-full overflow-hidden">
          <div className="h-full bg-on-primary rounded-full transition-all" style={{ width: `${fillRate}%` }} />
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
        <input
          type="text"
          placeholder="Buscar vagas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-on-surface font-medium placeholder:text-outline/40 text-sm outline-none"
        />
      </div>

      {/* Vacancies list */}
      <div className="space-y-3">
        {filtered.map((v) => (
          <div key={v.id} className="bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest">{v.role}</p>
                <h3 className="font-bold text-on-surface text-sm mt-0.5">{v.eventTitle}</h3>
              </div>
              <StatusBadge status={v.status} />
            </div>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-outline" />
                <span className="text-sm font-bold text-on-surface">{v.filled}/{v.quantity}</span>
              </div>
              <span className="text-sm font-medium text-on-surface-variant">R$ {v.hourlyRate}/h</span>
              <div className="flex gap-1 ml-auto">
                {v.requirements.map((req) => (
                  <span key={req} className="text-[10px] font-bold bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full uppercase">{req}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
