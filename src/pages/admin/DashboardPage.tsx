import {
  Calendar, Users, DollarSign, Activity, Flame, MapPin,
  ArrowRight, Briefcase, CheckCircle, Target, Clock,
  UserPlus, FileCheck, AlertCircle
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { StatsCard } from '../../components/StatsCard';
import { StatusBadge } from '../../components/StatusBadge';
import { useAuth } from '../../contexts/AuthContext';
import { mockStats, mockEvents } from '../../data/mockData';

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

export function DashboardPage() {
  const { user } = useAuth();
  const activeEvents = mockEvents.filter((e) => e.status !== 'completed');
  const greeting = new Date().getHours() < 12 ? 'Bom dia' : new Date().getHours() < 18 ? 'Boa tarde' : 'Boa noite';
  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const totalVagas = 38;
  const preenchidas = 28;
  const taxaFill = ((preenchidas / totalVagas) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="gradient-hero rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
        <div className="relative z-10">
          <p className="text-white/60 text-sm font-medium capitalize">{today}</p>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight mt-1">
            {greeting}, {user?.name?.split(' ')[0] || 'Admin'}
          </h1>
          <p className="text-white/70 text-sm mt-1">Console de Comando — Brigada Camarão</p>
        </div>
      </div>

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
          <h2 className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest">
            ReS — Recrutamento & Seleção
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard title="Vagas Abertas" value={totalVagas} icon={Target} accentColor="bg-primary" progress={(totalVagas / 50) * 100} />
          <StatsCard title="Preenchidas" value={preenchidas} icon={CheckCircle} change={`${totalVagas - preenchidas} restantes`} accentColor="bg-success" progress={(preenchidas / totalVagas) * 100} />
          <StatsCard title="Taxa de Fill" value={`${taxaFill}%`} icon={Activity} accentColor="bg-tertiary" progress={Number(taxaFill)} />
        </div>
      </div>

      {/* Pipeline */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-6">
        <h3 className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest mb-5">
          Pipeline de Recrutamento
        </h3>
        {/* Horizontal pipeline visual */}
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
        {/* Bar chart */}
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pipelineData} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ece0de" />
              <XAxis dataKey="stage" tick={{ fontSize: 12, fill: '#534341' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#534341' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="count" fill="#ba100a" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts + Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest">
              Receita Mensal
            </h3>
            <span className="text-xs font-bold text-success">+58% 6 meses</span>
          </div>
          <div className="h-64">
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
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-6">
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
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-6">
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
            <div key={event.id} className="bg-surface-container-lowest p-4 lg:p-5 rounded-2xl shadow-sm flex items-center gap-4 transition-lift">
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
  );
}
