import { TrendingUp, DollarSign, Users, Activity } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { StatsCard } from '../../components/StatsCard';
import { mockStats, mockQuotes } from '../../data/mockData';

const revenueTrend = [
  { month: 'Nov', receita: 180000 },
  { month: 'Dez', receita: 220000 },
  { month: 'Jan', receita: 195000 },
  { month: 'Fev', receita: 260000 },
  { month: 'Mar', receita: 310000 },
  { month: 'Abr', receita: 285000 },
];

const occupancyByType = [
  { tipo: 'Festival', ocupacao: 85 },
  { tipo: 'Show', ocupacao: 95 },
  { tipo: 'Feira', ocupacao: 72 },
  { tipo: 'Esportivo', ocupacao: 60 },
  { tipo: 'Privado', ocupacao: 100 },
];

export function COODashboardPage() {
  const quotesByStatus = {
    approved: mockQuotes.filter(q => q.status === 'approved').reduce((s, q) => s + q.value, 0),
    pending: mockQuotes.filter(q => q.status === 'pending').reduce((s, q) => s + q.value, 0),
    negotiating: mockQuotes.filter(q => q.status === 'negotiating').reduce((s, q) => s + q.value, 0),
    rejected: mockQuotes.filter(q => q.status === 'rejected').reduce((s, q) => s + q.value, 0),
  };
  const totalQuotes = Object.values(quotesByStatus).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="chameleon-gradient rounded-2xl p-5 sm:p-6 lg:p-8 text-white relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/5 blur-2xl hidden sm:block" />
        <div className="relative z-10 flex items-center gap-4">
          <img
            src="/images/logo-brigada.png"
            alt="Brigada Camarão"
            className="w-12 h-12 rounded-full object-cover border border-white/20 shadow-lg logo-pulse"
          />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">Sentinel Response</p>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight font-headline">Painel Executivo</h1>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Receita Mensal"
          value={`R$ ${(mockStats.monthlyRevenue / 1000).toFixed(0)}k`}
          icon={DollarSign}
          change="+12% vs anterior"
          trend="up"
          accentColor="bg-primary"
          progress={78}
        />
        <StatsCard
          title="Orçamentos Pendentes"
          value={mockStats.pendingQuotes}
          icon={Activity}
          change="R$ 87k em aberto"
          accentColor="bg-tertiary"
          progress={45}
        />
        <StatsCard
          title="Taxa Ocupação"
          value={`${mockStats.occupancyRate}%`}
          icon={TrendingUp}
          change="Meta: 85%"
          accentColor="bg-secondary"
          progress={mockStats.occupancyRate}
        />
        <StatsCard
          title="Equipe Ativa"
          value={mockStats.availableStaff}
          icon={Users}
          change={`de ${mockStats.totalStaff} total`}
          trend="up"
          accentColor="bg-success"
          progress={(mockStats.availableStaff / mockStats.totalStaff) * 100}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 card-hover">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest">
              Tendência de Receita
            </h3>
            <span className="text-xs font-bold text-success">+58% 6 meses</span>
          </div>
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="cooRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ba100a" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#ba100a" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ece0de" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#534341' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#534341' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Receita']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="receita" stroke="#ba100a" strokeWidth={2.5} fill="url(#cooRevenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Occupancy by Type */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 card-hover">
          <h3 className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest mb-5">
            Ocupação por Tipo de Evento
          </h3>
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyByType} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ece0de" />
                <XAxis dataKey="tipo" tick={{ fontSize: 11, fill: '#534341' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#534341' }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 100]}
                  tickFormatter={(v: number) => `${v}%`}
                />
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Ocupação']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="ocupacao" fill="#775652" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Financial Summary Table */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-4 sm:p-6 card-hover">
        <h3 className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest mb-4 sm:mb-5">
          Resumo Financeiro — Orçamentos
        </h3>
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-variant/20">
                <th className="text-left py-3 px-4 text-[11px] font-black uppercase tracking-widest text-on-surface-variant">Status</th>
                <th className="text-right py-3 px-4 text-[11px] font-black uppercase tracking-widest text-on-surface-variant">Valor Total</th>
                <th className="text-right py-3 px-4 text-[11px] font-black uppercase tracking-widest text-on-surface-variant">% do Total</th>
                <th className="text-left py-3 px-4 text-[11px] font-black uppercase tracking-widest text-on-surface-variant">Distribuição</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Aprovados', value: quotesByStatus.approved, color: 'bg-success' },
                { label: 'Pendentes', value: quotesByStatus.pending, color: 'bg-warning' },
                { label: 'Em Negociação', value: quotesByStatus.negotiating, color: 'bg-tertiary' },
                { label: 'Rejeitados', value: quotesByStatus.rejected, color: 'bg-error' },
              ].map((row) => {
                const pct = totalQuotes > 0 ? ((row.value / totalQuotes) * 100).toFixed(1) : '0';
                return (
                  <tr key={row.label} className="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${row.color}`} />
                        <span className="font-semibold text-on-surface">{row.label}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-on-surface">
                      R$ {row.value.toLocaleString('pt-BR')}
                    </td>
                    <td className="py-3 px-4 text-right text-on-surface-variant font-medium">{pct}%</td>
                    <td className="py-3 px-4">
                      <div className="w-full max-w-[120px] h-2 bg-surface-container-high rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${row.color}`} style={{ width: `${pct}%` }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
              <tr className="font-black">
                <td className="py-3 px-4 text-on-surface">Total</td>
                <td className="py-3 px-4 text-right text-on-surface">R$ {totalQuotes.toLocaleString('pt-BR')}</td>
                <td className="py-3 px-4 text-right text-on-surface">100%</td>
                <td className="py-3 px-4" />
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
