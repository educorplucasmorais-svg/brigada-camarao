import { Search, Phone, Mail } from 'lucide-react';
import { useState } from 'react';
import { mockTeam } from '../../data/mockData';
import { StatusBadge } from '../../components/StatusBadge';

export function TeamDirectoryPage() {
  const [search, setSearch] = useState('');
  const filtered = mockTeam.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <p className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Recursos Humanos</p>
        <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-on-surface">Diretório de Equipe</h1>
        <p className="text-sm text-on-surface-variant font-medium mt-1">{mockTeam.length} membros cadastrados</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
        <input
          type="text"
          placeholder="Buscar por nome ou função..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-on-surface font-medium placeholder:text-outline/40 text-sm outline-none"
        />
      </div>

      {/* Team grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((member) => (
          <div key={member.id} className="bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                <span className="text-sm font-black text-on-primary-container">
                  {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h3 className="font-bold text-on-surface text-sm">{member.name}</h3>
                    <p className="text-xs text-on-surface-variant font-medium">{member.role}</p>
                  </div>
                  <StatusBadge status={member.status} />
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-on-surface-variant">
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{member.phone}</span>
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{member.email}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {member.certifications.map((cert) => (
                    <span key={cert} className="text-[10px] font-bold bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full uppercase">{cert}</span>
                  ))}
                </div>
                <p className="mt-2 text-[10px] font-bold text-outline uppercase tracking-wider">{member.eventsCompleted} eventos concluídos</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
