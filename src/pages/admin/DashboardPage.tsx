import { useState } from 'react';
import {
  Calendar, Users, DollarSign, Activity, Flame, MapPin,
  ArrowRight, Briefcase, CheckCircle, Target, Clock,
  UserPlus, FileCheck, AlertCircle,
  Telescope, Settings, TrendingUp,
  Package, AlertTriangle
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, PolarAngleAxis, Cell
} from 'recharts';
import { StatsCard } from '../../components/StatsCard';
import { StatusBadge } from '../../components/StatusBadge';
import { useAuth } from '../../contexts/AuthContext';
import { mockStats, mockEvents } from '../../data/mockData';

// ─── Estratégico Data ─────────────────────────────────────────────

const okrs = [
  {
    title: 'Ser a maior brigada de MG',
    kr: '350 profissionais até Q4',
    current: '156',
    target: '350',
    progress: 44.6,
    status: 'No caminho',
    color: '#ba100a',
  },
  {
    title: 'Receita mensal de R$ 600k',
    kr: 'R$ 600k mensal até dezembro',
    current: 'R$ 285k',
    target: 'R$ 600k',
    progress: 47.5,
    status: 'No caminho',
    color: '#775652',
  },
  {
    title: 'NPS acima de 90',
    kr: 'Satisfação do cliente ≥ 90',
    current: '96',
    target: '90',
    progress: 100,
    status: 'Atingido',
    color: '#2e7d32',
  },
];

const revenueAnnual = [
  { month: 'Jan', receita: 195000, meta: 250000 },
  { month: 'Fev', receita: 260000, meta: 300000 },
  { month: 'Mar', receita: 310000, meta: 350000 },
  { month: 'Abr', receita: 285000, meta: 400000 },
  { month: 'Mai', receita: 0, meta: 450000 },
  { month: 'Jun', receita: 0, meta: 500000 },
  { month: 'Jul', receita: 0, meta: 520000 },
  { month: 'Ago', receita: 0, meta: 540000 },
  { month: 'Set', receita: 0, meta: 550000 },
  { month: 'Out', receita: 0, meta: 570000 },
  { month: 'Nov', receita: 0, meta: 590000 },
  { month: 'Dez', receita: 0, meta: 600000 },
];

const marketData = [
  { name: 'Brigada Camarão', share: 32 },
  { name: 'Concorrente A', share: 18 },
  { name: 'Concorrente B', share: 15 },
  { name: 'Concorrente C', share: 12 },
  { name: 'Outros', share: 23 },
];

const metasAnuais = [
  { meta: 'Expandir para 5 cidades', status: 'Em andamento', progresso: '2/5', pct: 40 },
  { meta: '50 eventos/trimestre', status: 'No caminho', progresso: '47/50', pct: 94 },
  { meta: 'Certificação ISO 9001', status: 'Planejado', progresso: '—', pct: 15 },
  { meta: 'App Sentinel 100% digital', status: 'Em andamento', progresso: '—', pct: 75 },
];

const MARKET_COLORS = ['#ba100a', '#775652', '#705c2e', '#534341', '#ece0de'];

const metaStatusColor: Record<string, string> = {
  'Em andamento': 'text-warning',
  'No caminho': 'text-success',
  'Planejado': 'text-on-surface-variant',
};

// ─── Tático Data ──────────────────────────────────────────────────

const revenueData = [
  { month: 'Nov', receita: 180000 },
  { month: 'Dez', receita: 220000 },
  { month: 'Jan', receita: 195000 },
  { month: 'Fev', receita: 260000 },
  { month: 'Mar', receita: 310000 },
  { month: 'Abr', receita: 285000 },
];

const pipelineData = [
  { stage: 'Inscritos', count: 45 },
  { stage: 'Triagem', count: 32 },
  { stage: 'Aprovados', count: 28 },
  { stage: 'Alocados', count: 24 },
];

const upcomingEvents = [
  { title: 'Festival Gastronômico BH', date: '15/04', location: 'Belo Horizonte', team: 18, total: 25 },
  { title: 'Show Sertanejo Arena', date: '20/04', location: 'Uberlândia', team: 40, total: 40 },
  { title: 'Feira Industrial FIEMG', date: '25/04', location: 'Contagem', team: 8, total: 15 },
  { title: 'Casamento Villa Real', date: '02/05', location: 'Nova Lima', team: 6, total: 6 },
];

const recentActivities = [
  { icon: UserPlus, text: 'João Pedro Santos alocado para Festival BH', time: '2h atrás', color: 'bg-primary' },
  { icon: FileCheck, text: 'Orçamento Arena Shows MG aprovado — R$ 72.000', time: '4h atrás', color: 'bg-success' },
  { icon: AlertCircle, text: '3 novas inscrições para vaga de Socorrista', time: '5h atrás', color: 'bg-tertiary' },
  { icon: CheckCircle, text: 'Evento Rock in BH finalizado com sucesso', time: '1 dia', color: 'bg-secondary' },
  { icon: UserPlus, text: 'Fernanda Oliveira obteve certificação NR-35', time: '2 dias', color: 'bg-primary' },
];

// ─── Operacional Data ─────────────────────────────────────────────

type EscalaStatus = 'checked_in' | 'pending' | 'absent';

const escalaDia: { qt: number; nome: string; horario: string; status: EscalaStatus; remuneracao: number }[] = [
  { qt: 1, nome: 'João Pedro Santos', horario: '08:00 às 20:00', status: 'checked_in', remuneracao: 153.74 },
  { qt: 2, nome: 'Ana Carolina Lima', horario: '08:00 às 20:00', status: 'checked_in', remuneracao: 153.74 },
  { qt: 3, nome: 'Roberto Ferreira', horario: '08:00 às 20:00', status: 'pending', remuneracao: 153.74 },
  { qt: 4, nome: 'Fernanda Oliveira', horario: '08:00 às 20:00', status: 'checked_in', remuneracao: 153.74 },
  { qt: 5, nome: 'Lucas Mendes', horario: '08:00 às 00:00', status: 'pending', remuneracao: 205.00 },
  { qt: 6, nome: 'Marcos Almeida', horario: '08:00 às 00:00', status: 'checked_in', remuneracao: 205.00 },
  { qt: 7, nome: 'Juliana Costa', horario: '08:00 às 20:00', status: 'absent', remuneracao: 153.74 },
  { qt: 8, nome: 'Thiago Barbosa', horario: '08:00 às 00:00', status: 'checked_in', remuneracao: 205.00 },
];

const checkins = [
  { nome: 'João Pedro Santos', hora: '07:45', tipo: 'Entrada' },
  { nome: 'Ana Carolina Lima', hora: '07:50', tipo: 'Entrada' },
  { nome: 'Marcos Almeida', hora: '07:52', tipo: 'Entrada' },
  { nome: 'Fernanda Oliveira', hora: '07:58', tipo: 'Entrada' },
  { nome: 'Thiago Barbosa', hora: '08:02', tipo: 'Entrada (atrasado)' },
];

const equipamentos = [
  { item: 'Extintores (4 un)', conferido: true },
  { item: 'Maca dobrável (2 un)', conferido: true },
  { item: 'Kit primeiros socorros', conferido: false },
  { item: 'Rádio comunicador (8 un)', conferido: true },
];

const statusConfig: Record<EscalaStatus, { dot: string; label: string }> = {
  checked_in: { dot: 'bg-success', label: 'Presente' },
  pending: { dot: 'bg-warning', label: 'Aguardando' },
  absent: { dot: 'bg-error', label: 'Ausente' },
};

// ─── Component ────────────────────────────────────────────────────

export function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'estrategico' | 'tatico' | 'operacional'>('tatico');

  const activeEvents = mockEvents.filter((e) => e.status !== 'completed');
  const greeting = new Date().getHours() < 12 ? 'Bom dia' : new Date().getHours() < 18 ? 'Boa tarde' : 'Boa noite';
  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const totalVagas = 38;
  const preenchidas = 28;
  const taxaFill = ((preenchidas / totalVagas) * 100).toFixed(1);

  const tabs = [
    { id: 'estrategico' as const, label: 'ESTRATÉGICO', icon: Telescope },
    { id: 'tatico' as const, label: 'TÁTICO', icon: Target },
    { id: 'operacional' as const, label: 'OPERACIONAL', icon: Settings },
  ];

  return (
    <div className="space-y-6">
      {/* ═══ Welcome Banner ═══ */}
      <div className="chameleon-gradient rounded-2xl p-5 sm:p-6 lg:p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] hidden sm:block" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5 blur-2xl hidden sm:block" />
        <div className="relative z-10">
          <p className="text-white/60 text-xs sm:text-sm font-medium capitalize">{today}</p>
          <h1 className="font-headline text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mt-1">
            {greeting}, {user?.name?.split(' ')[0] || 'Admin'}
          </h1>
          <p className="text-white/70 text-sm mt-1">Console de Comando — Brigada Camarão</p>
        </div>
      </div>

      {/* ═══ Tab Selector ═══ */}
      <div className="glass rounded-2xl p-1 sm:p-1.5 flex gap-1 sm:gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-primary text-on-primary glow-primary'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.label.slice(0, 4)}.</span>
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════
           TAB 1 — ESTRATÉGICO (Visão C-Level / Diretoria)
         ═══════════════════════════════════════════════════════════ */}
      {activeTab === 'estrategico' && (
        <div className="space-y-6">
          {/* Section Label */}
          <div className="flex items-center gap-2">
            <Telescope className="w-4 h-4 text-primary" />
            <span className="section-eyebrow">
              OKRs — Objetivos e Resultados-Chave
            </span>
          </div>

          {/* OKR Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {okrs.map((okr) => (
              <div key={okr.title} className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden card-hover">
                <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${okr.color}, ${okr.color}88)` }} />
                <div className="p-6">
                  <h4 className="font-black text-on-surface text-sm leading-tight">{okr.title}</h4>
                  <p className="text-xs text-on-surface-variant mt-1">{okr.kr}</p>

                  <div className="flex items-center justify-center my-4 sm:my-5">
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                          cx="50%"
                          cy="50%"
                          innerRadius="70%"
                          outerRadius="90%"
                          startAngle={90}
                          endAngle={-270}
                          data={[{ value: okr.progress }]}
                          barSize={10}
                        >
                          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                          <RadialBar background dataKey="value" cornerRadius={10} fill={okr.color} />
                        </RadialBarChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg sm:text-2xl font-black tracking-tighter" style={{ color: okr.color }}>
                          {okr.progress >= 100 ? '100%' : `${okr.progress}%`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xl font-black text-on-surface">{okr.current}</p>
                      <p className="text-xs text-on-surface-variant">meta: {okr.target}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {okr.status === 'Atingido' ? (
                        <CheckCircle className="w-4 h-4 text-success" />
                      ) : (
                        <TrendingUp className="w-4 h-4 text-warning" />
                      )}
                      <span className={`text-xs font-bold ${okr.status === 'Atingido' ? 'text-success' : 'text-warning'}`}>
                        {okr.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Receita Anual Chart */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 card-hover">
            <h3 className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest mb-5">
              Receita Anual — Real vs Meta
            </h3>
            <div className="h-48 sm:h-64 lg:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueAnnual}>
                  <defs>
                    <linearGradient id="revenueAnnualGrad" x1="0" y1="0" x2="0" y2="1">
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
                    formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, '']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)' }}
                  />
                  <Area type="monotone" dataKey="meta" stroke="#775652" strokeWidth={2} strokeDasharray="6 4" fill="none" />
                  <Area type="monotone" dataKey="receita" stroke="#ba100a" strokeWidth={2.5} fill="url(#revenueAnnualGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Market Share */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 card-hover">
            <h3 className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest mb-5">
              Market Share — Brigadas em MG
            </h3>
            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={marketData} layout="vertical" barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ece0de" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#534341' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}%`} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#534341' }} axisLine={false} tickLine={false} width={100} />
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'Market Share']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="share" radius={[0, 8, 8, 0]}>
                    {marketData.map((_entry, index) => (
                      <Cell key={`ms-${index}`} fill={MARKET_COLORS[index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Metas Anuais */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 card-hover">
            <h3 className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest mb-5">
              Metas Anuais 2026
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-outline-variant/30">
                    <th className="text-left py-3 px-4 text-[11px] font-black text-on-surface-variant uppercase tracking-widest">Meta</th>
                    <th className="text-left py-3 px-4 text-[11px] font-black text-on-surface-variant uppercase tracking-widest">Status</th>
                    <th className="text-left py-3 px-4 text-[11px] font-black text-on-surface-variant uppercase tracking-widest">Progresso</th>
                  </tr>
                </thead>
                <tbody>
                  {metasAnuais.map((m) => (
                    <tr key={m.meta} className="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors">
                      <td className="py-3 px-4 font-bold text-on-surface">{m.meta}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-bold ${metaStatusColor[m.status] ?? 'text-on-surface-variant'}`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden max-w-[120px]">
                            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${m.pct}%` }} />
                          </div>
                          <span className="text-xs font-bold text-on-surface whitespace-nowrap">
                            {m.progresso !== '—' ? `${m.progresso} (${m.pct}%)` : `${m.pct}%`}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
           TAB 2 — TÁTICO (Visão Gerencial / Coordenação)
         ═══════════════════════════════════════════════════════════ */}
      {activeTab === 'tatico' && (
        <div className="space-y-6">
          {/* Main Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard title="Eventos Ativos" value={mockStats.activeEvents} icon={Calendar} change="+3 esta semana" trend="up" accentColor="bg-primary" progress={65} />
            <StatsCard title="Equipe Total" value={mockStats.totalStaff} icon={Users} change={`${mockStats.availableStaff} disponíveis`} trend="up" accentColor="bg-tertiary" progress={57} />
            <StatsCard title="Receita Mensal" value={`R$ ${(mockStats.monthlyRevenue / 1000).toFixed(0)}k`} icon={DollarSign} change="+12% vs anterior" trend="up" accentColor="bg-secondary" progress={78} />
            <StatsCard title="Ocupação" value={`${mockStats.occupancyRate}%`} icon={Activity} change="Meta: 85%" accentColor="bg-success" progress={mockStats.occupancyRate} />
          </div>

          {/* ReS Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-4 h-4 text-primary" />
              <span className="section-eyebrow">
                ReS — Recrutamento & Seleção
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatsCard title="Vagas Abertas" value={totalVagas} icon={Target} accentColor="bg-primary" progress={(totalVagas / 50) * 100} />
              <StatsCard title="Preenchidas" value={preenchidas} icon={CheckCircle} change={`${totalVagas - preenchidas} restantes`} accentColor="bg-success" progress={(preenchidas / totalVagas) * 100} />
              <StatsCard title="Taxa de Fill" value={`${taxaFill}%`} icon={Activity} accentColor="bg-tertiary" progress={Number(taxaFill)} />
            </div>
          </div>

          {/* Pipeline */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 card-hover">
            <h3 className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest mb-5">
              Pipeline de Recrutamento
            </h3>
            <div className="hidden md:flex items-center justify-between mb-6">
              {pipelineData.map((stage, i) => (
                <div key={stage.stage} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg ${
                      i === 0 ? 'bg-primary' : i === 1 ? 'bg-secondary' : i === 2 ? 'bg-tertiary' : 'bg-success'
                    }`}>
                      {stage.count}
                    </div>
                    <p className="text-xs font-bold text-on-surface mt-2">{stage.stage}</p>
                  </div>
                  {i < pipelineData.length - 1 && (
                    <ArrowRight className="w-5 h-5 text-outline shrink-0 mx-1" />
                  )}
                </div>
              ))}
            </div>
            <div className="h-40 sm:h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineData} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ece0de" />
                  <XAxis dataKey="stage" tick={{ fontSize: 12, fill: '#534341' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#534341' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="count" fill="#ba100a" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts + Events Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 card-hover">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest">
                  Receita Mensal
                </h3>
                <span className="text-xs font-bold text-success">+58% 6 meses</span>
              </div>
              <div className="h-48 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
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
                    <Area type="monotone" dataKey="receita" stroke="#ba100a" strokeWidth={2.5} fill="url(#revenueGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 card-hover">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest">
                  Próximos Eventos
                </h3>
                <button className="text-[11px] font-black text-primary uppercase tracking-wider flex items-center gap-1">
                  Ver Todos <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-3">
                {upcomingEvents.map((evt) => (
                  <div key={evt.title} className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-container-low transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-primary-container flex flex-col items-center justify-center shrink-0">
                      <span className="text-xs font-black text-on-primary-container leading-none">{evt.date.split('/')[0]}</span>
                      <span className="text-[9px] font-bold text-on-primary-container/70">/{evt.date.split('/')[1]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-on-surface text-sm truncate">{evt.title}</p>
                      <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> {evt.location}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-black text-on-surface">{evt.team}/{evt.total}</p>
                      <p className="text-[10px] text-on-surface-variant">equipe</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 card-hover">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest">
                Atividades Recentes
              </h3>
              <button className="text-[11px] font-black text-primary uppercase tracking-wider flex items-center gap-1">
                Ver Todas <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((act, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="relative">
                    <div className={`w-9 h-9 rounded-full ${act.color} flex items-center justify-center shrink-0`}>
                      <act.icon className="w-4 h-4 text-white" />
                    </div>
                    {i < recentActivities.length - 1 && (
                      <div className="absolute top-9 left-1/2 -translate-x-1/2 w-px h-6 bg-outline-variant/30" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <p className="text-sm text-on-surface">{act.text}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {act.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Events Table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest">Eventos em Andamento</h2>
            </div>
            <div className="space-y-3">
              {activeEvents.slice(0, 5).map((event) => (
                <div key={event.id} className="bg-surface-container-lowest p-4 lg:p-5 rounded-2xl shadow-sm flex items-center gap-4 card-hover">
                  <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center shrink-0">
                    <Flame className="w-5 h-5 text-on-primary-container" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-on-surface text-sm truncate">{event.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-on-surface-variant flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {event.date}
                      </span>
                      <span className="text-xs text-on-surface-variant flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {event.location}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-bold text-on-surface-variant">{event.filledVacancies}/{event.vacancies}</span>
                    <StatusBadge status={event.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
           TAB 3 — OPERACIONAL (Visão de Campo / Supervisor)
         ═══════════════════════════════════════════════════════════ */}
      {activeTab === 'operacional' && (
        <div className="space-y-6">
          {/* Evento Ativo Hoje — Hero Card */}
          <div className="chameleon-gradient rounded-2xl p-5 sm:p-6 lg:p-8 text-white relative overflow-hidden">
            <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-white/5 blur-2xl hidden sm:block" />
            <div className="relative z-10">
              <p className="text-[11px] font-black uppercase tracking-widest text-white/60 mb-2">Evento Ativo Hoje</p>
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-tight font-headline">ABRAMULTI STREAMING 2026</h2>
              <div className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-2 mt-3 sm:mt-4 text-xs sm:text-sm">
                <span className="flex items-center gap-1.5 text-white/80">
                  <MapPin className="w-4 h-4" /> EXPOMINAS, Belo Horizonte
                </span>
                <span className="flex items-center gap-1.5 text-white/80">
                  <Calendar className="w-4 h-4" /> 03/04 a 10/04/2026
                </span>
                <span className="flex items-center gap-1.5 text-white/80">
                  <Users className="w-4 h-4" /> 16 Brigadistas escalados
                </span>
                <span className="flex items-center gap-1.5 text-white/80">
                  <DollarSign className="w-4 h-4" /> Folha estimada: R$ 4.718,96
                </span>
              </div>
            </div>
          </div>

          {/* Escala do Dia */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-4 sm:p-6 card-hover">
            <h3 className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest mb-4 sm:mb-5">
              Escala do Dia — 05/04/2026
            </h3>
            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-outline-variant/30">
                    <th className="text-left py-3 px-4 text-[11px] font-black text-on-surface-variant uppercase tracking-widest">QT</th>
                    <th className="text-left py-3 px-4 text-[11px] font-black text-on-surface-variant uppercase tracking-widest">Nome</th>
                    <th className="text-left py-3 px-4 text-[11px] font-black text-on-surface-variant uppercase tracking-widest">Horário</th>
                    <th className="text-left py-3 px-4 text-[11px] font-black text-on-surface-variant uppercase tracking-widest">Status</th>
                    <th className="text-right py-3 px-4 text-[11px] font-black text-on-surface-variant uppercase tracking-widest">Remuneração</th>
                  </tr>
                </thead>
                <tbody>
                  {escalaDia.map((row) => (
                    <tr key={row.qt} className="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors">
                      <td className="py-3 px-4 font-black text-on-surface">{row.qt}</td>
                      <td className="py-3 px-4 font-bold text-on-surface">{row.nome}</td>
                      <td className="py-3 px-4 text-on-surface-variant">{row.horario}</td>
                      <td className="py-3 px-4">
                        <span className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${statusConfig[row.status].dot}`} />
                          <span className="text-xs font-bold">{statusConfig[row.status].label}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-on-surface">
                        R$ {row.remuneracao.toFixed(2).replace('.', ',')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Resumo Financeiro */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="section-eyebrow">
                Resumo Financeiro do Evento
              </span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {([
                { label: 'Total Folha', value: 'R$ 4.718,96', color: 'bg-primary' },
                { label: 'Pagos', value: 'R$ 2.150,00', color: 'bg-success' },
                { label: 'Pendentes', value: 'R$ 2.568,96', color: 'bg-warning' },
                { label: 'Custo/hora médio', value: 'R$ 12,81', color: 'bg-tertiary' },
              ] as const).map((card) => (
                <div key={card.label} className="bg-surface-container-lowest rounded-2xl shadow-sm p-5 relative overflow-hidden card-hover">
                  <div className={`absolute top-0 left-0 w-1 h-full ${card.color}`} />
                  <p className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest">{card.label}</p>
                  <p className="text-xl lg:text-2xl font-black tracking-tight text-on-surface mt-2">{card.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Check-in Timeline + Equipamentos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Check-in Timeline */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 card-hover">
              <div className="flex items-center gap-2 mb-5">
                <Clock className="w-4 h-4 text-primary" />
                <h3 className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest">
                  Check-in de Hoje
                </h3>
              </div>
              <div className="space-y-4">
                {checkins.map((ci, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="relative">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        ci.tipo.includes('atrasado') ? 'bg-warning' : 'bg-success'
                      }`}>
                        <Clock className="w-3.5 h-3.5 text-white" />
                      </div>
                      {i < checkins.length - 1 && (
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-px h-6 bg-outline-variant/30" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="text-sm font-bold text-on-surface">{ci.nome}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        {ci.hora} — {ci.tipo}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Material / Equipamento */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 card-hover">
              <div className="flex items-center gap-2 mb-5">
                <Package className="w-4 h-4 text-primary" />
                <h3 className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest">
                  Material / Equipamento
                </h3>
              </div>
              <div className="space-y-3">
                {equipamentos.map((eq) => (
                  <div key={eq.item} className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low">
                    {eq.conferido ? (
                      <CheckCircle className="w-5 h-5 text-success shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-warning shrink-0" />
                    )}
                    <span className="text-sm font-bold text-on-surface flex-1">{eq.item}</span>
                    <span className={`text-xs font-bold ${eq.conferido ? 'text-success' : 'text-warning'}`}>
                      {eq.conferido ? 'Conferido' : 'Pendente'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
