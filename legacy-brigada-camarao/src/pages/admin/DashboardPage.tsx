import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, Users, DollarSign, MapPin,
  ArrowRight, CheckCircle, Clock,
  Telescope, TrendingUp,
  Package, AlertTriangle,
  MessageCircle
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, PolarAngleAxis, Cell
} from 'recharts';
import { StatsCard } from '../../components/StatsCard';

import { useAuth } from '../../contexts/AuthContext';
import { mockStats } from '../../data/mockData';

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

const pipelineColors: Record<string, { bg: string; hex: string }> = {
  Inscritos: { bg: 'bg-primary', hex: '#900001' },
  Triagem: { bg: 'bg-primary-container', hex: '#ba100a' },
  Aprovados: { bg: 'bg-secondary-container', hex: '#fc9910' },
  Alocados: { bg: 'bg-success', hex: '#2e7d32' },
};

const pipelineHistory = [
  { stage: 'Inscritos', data: [30, 35, 42, 38, 45], color: '#900001' },
  { stage: 'Triagem', data: [20, 25, 28, 30, 32], color: '#ba100a' },
  { stage: 'Aprovados', data: [15, 18, 22, 25, 28], color: '#fc9910' },
  { stage: 'Alocados', data: [10, 14, 18, 20, 24], color: '#2e7d32' },
];

const upcomingEvents = [
  { title: 'Festival Gastronômico BH', date: '15/04', location: 'Belo Horizonte', team: 18, total: 25, status: 'Alocados', whatsappGroup: 'https://chat.whatsapp.com/FESTIVAL-BH-2026' },
  { title: 'Show Sertanejo Arena', date: '20/04', location: 'Uberlândia', team: 40, total: 40, status: 'Aprovados', whatsappGroup: 'https://chat.whatsapp.com/SHOW-ARENA-2026' },
  { title: 'Feira Industrial FIEMG', date: '25/04', location: 'Contagem', team: 8, total: 15, status: 'Alocados', whatsappGroup: 'https://chat.whatsapp.com/FEIRA-FIEMG-2026' },
  { title: 'Casamento Villa Real', date: '02/05', location: 'Nova Lima', team: 6, total: 6, status: 'Aprovados', whatsappGroup: 'https://chat.whatsapp.com/VILLA-REAL-2026' },
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

// ─── Sparkline Data ───────────────────────────────────────────────

const sparkEvents = [5, 6, 5, 7, 6, 8, 7, 8];
const sparkEquipe = [120, 128, 135, 140, 145, 148, 152, 156];
const sparkReceita = [195, 210, 240, 260, 250, 280, 310, 285];
const sparkOcupacao = [65, 70, 68, 72, 75, 73, 76, 78];

// ─── Helpers ──────────────────────────────────────────────────────

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
};

const getFormattedDate = () => {
  const now = new Date();
  const weekday = now.toLocaleDateString('pt-BR', { weekday: 'long' });
  const day = now.getDate();
  const month = now.toLocaleDateString('pt-BR', { month: 'long' });
  const year = now.getFullYear();
  // Capitalize first letter of each word
  const capitalize = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());
  return `${capitalize(weekday)}, ${day} De ${capitalize(month)} De ${year}`;
};

// ─── Role-based tab system ─────────────────────────────────────────

type TabId =
  | 'estrategico' | 'tatico' | 'operacional'
  | 'executivo' | 'pipeline' | 'financeiro'
  | 'colaborador';

const getTabsForRole = (role: string | undefined): { id: TabId; label: string }[] => {
  if (role === 'parceiro') return [{ id: 'colaborador', label: 'MINHA ESCALA' }];
  if (role === 'coo') return [
    { id: 'executivo', label: 'VISÃO EXECUTIVA' },
    { id: 'pipeline', label: 'PIPELINE RES' },
    { id: 'financeiro', label: 'FINANCEIRO' },
  ];
  if (role === 'staff') return [
    { id: 'tatico', label: 'TÁTICO' },
    { id: 'operacional', label: 'OPERACIONAL' },
  ];
  return [
    { id: 'estrategico', label: 'ESTRATÉGICO' },
    { id: 'tatico', label: 'TÁTICO' },
    { id: 'operacional', label: 'OPERACIONAL' },
  ];
};

const getDefaultTab = (role: string | undefined): TabId => {
  if (role === 'parceiro') return 'colaborador';
  if (role === 'coo') return 'executivo';
  return 'tatico';
};

// ─── Component ────────────────────────────────────────────────────

export function DashboardPage() {
  const { user } = useAuth();
  const tabs = getTabsForRole(user?.role);
  const [activeTab, setActiveTab] = useState<TabId>(() => getDefaultTab(user?.role));

  const firstName = user?.name?.split(' ')[0] || 'Admin';

  // Parceiro view — completely different layout, no tabs header needed
  if (user?.role === 'parceiro') {
    return (
      <div className="space-y-0">
        {/* Greeting Hero */}
        <div className="bg-gradient-to-r from-[#8b0000] to-[#ba100a] rounded-2xl p-6 text-white mb-6">
          <p className="text-white/60 text-xs font-bold uppercase tracking-widest">{getGreeting()}</p>
          <h2 className="text-2xl font-black mt-1">{firstName}!</h2>
          <p className="text-white/70 text-sm mt-1">{getFormattedDate()}</p>
          <div className="flex items-center gap-2 mt-4 bg-white/10 rounded-xl px-4 py-2 w-fit">
            <span className="w-2 h-2 rounded-full bg-[#4caf50] animate-pulse" />
            <span className="text-xs font-bold text-white/80">Credencial Ativa</span>
            <span className="text-xs font-bold text-white ml-2">{(user as { credentialNumber?: string })?.credentialNumber || 'BC-00421'}</span>
          </div>
        </div>

        {/* Próxima Escala */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>event_available</span>
            <span className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant">PRÓXIMA ESCALA</span>
          </div>
          <p className="font-black text-lg text-on-surface mb-3">Festival Gastronômico BH</p>
          <div className="space-y-2 mb-4">
            {([
              { icon: 'calendar_today', label: '15/04/2026' },
              { icon: 'location_on', label: 'Belo Horizonte, MG' },
              { icon: 'schedule', label: '08:00 às 20:00' },
              { icon: 'payments', label: 'R$ 1.800,00' },
            ] as const).map((row) => (
              <div key={row.label} className="flex items-center gap-2 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-base text-primary/70">{row.icon}</span>
                <span>{row.label}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="bg-success/10 text-success border border-success/20 rounded-full px-3 py-1 text-xs font-black">
              CONFIRMADO
            </span>
          </div>
          <Link
            to="/eventos"
            className="block border-2 border-primary text-primary rounded-xl py-3 w-full text-center font-black uppercase text-sm hover:bg-primary/5 transition-colors"
          >
            Ver Todos os Eventos
          </Link>
        </div>

        {/* Histórico de Escalas */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm mb-4">
          <p className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant mb-4">HISTÓRICO DE ESCALAS</p>
          <div className="divide-y divide-outline-variant/10">
            {([
              { name: 'Rock in BH Festival', date: '28/03/2026', status: 'REALIZADO', amount: 'R$ 1.800,00' },
              { name: 'Expo Construção 2026', date: '18/04/2026', status: 'CONFIRMADO', amount: 'R$ 1.440,00' },
              { name: 'Show Sertanejo Arena', date: '20/04/2026', status: 'CONFIRMADO', amount: 'R$ 2.000,00' },
              { name: 'Carnaval Ouro Preto', date: '14/02/2026', status: 'REALIZADO', amount: 'R$ 3.600,00' },
            ] as const).map((ev) => (
              <div key={ev.name} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-bold text-sm text-on-surface">{ev.name}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{ev.date}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-xs font-black rounded-full px-2.5 py-0.5 ${
                    ev.status === 'REALIZADO'
                      ? 'bg-success/10 text-success'
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {ev.status}
                  </span>
                  <span className="text-xs font-bold text-on-surface-variant">{ev.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagamentos */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm mb-4">
          <p className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant mb-4">PAGAMENTOS</p>
          <div className="flex items-center gap-6 mb-3">
            <div>
              <p className="text-xs text-on-surface-variant mb-1">Total Recebido</p>
              <p className="text-2xl font-black text-success">R$ 5.400,00</p>
            </div>
            <div className="w-px h-10 bg-outline-variant/30" />
            <div>
              <p className="text-xs text-on-surface-variant mb-1">A Receber</p>
              <p className="text-2xl font-black text-primary">R$ 3.440,00</p>
            </div>
          </div>
          <p className="text-xs text-on-surface-variant">
            Último pagamento: Rock in BH — R$ 1.800,00 em 02/04/2026
          </p>
        </div>

        {/* Certificações */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm mb-4">
          <p className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant mb-4">CERTIFICAÇÕES & HABILITAÇÕES</p>
          <div className="flex flex-wrap gap-2">
            {['NR-23', 'APH', 'Primeiros Socorros', 'NR-35', 'Brigadista Civil'].map((cert) => (
              <span key={cert} className="bg-primary/10 text-primary rounded-full px-3 py-1.5 text-xs font-bold border border-primary/20">
                {cert}
              </span>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Link
            to="/eventos"
            className="bg-primary text-on-primary rounded-2xl py-4 font-black text-sm uppercase text-center flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-base">event</span>
            Ver Eventos
          </Link>
          <Link
            to="/admin/perfil"
            className="bg-surface-container text-on-surface border border-outline-variant/30 rounded-2xl py-4 font-black text-sm uppercase text-center flex items-center justify-center gap-2 hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-base">person</span>
            Meu Perfil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ═══ Header ═══ */}
      <div className="pb-4 pt-3 lg:pt-5">
        <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-[#111827]">
          {getGreeting()}, {firstName}
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm text-[#6b7280]">{getFormattedDate()}</p>
          <span className="text-[#6b7280]">•</span>
          <span className="flex items-center gap-1.5 text-sm text-[#2e7d32] font-medium">
            <span className="w-2 h-2 rounded-full bg-[#2e7d32] inline-block animate-pulse" />
            Status
          </span>
        </div>
      </div>

      {/* ═══ Tab Selector ═══ */}
      <div className="border-b border-[#e5e7eb] -mx-4 sm:-mx-5 lg:-mx-8">
        <div className="flex gap-0 overflow-x-auto justify-center px-4 sm:px-5 lg:px-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-8 py-3 text-[11px] font-black tracking-[0.12em] transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-[#ba100a]'
                  : 'text-[#9ca3af] hover:text-[#374151]'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ba100a]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ Tab Content ═══ */}
      <div className="py-6 space-y-6">

      {/* ═══════════════════════════════════════════════════════════
           COO — VISÃO EXECUTIVA
         ═══════════════════════════════════════════════════════════ */}
      {activeTab === 'executivo' && (
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-black text-on-surface">Visão Executiva</h2>
            <p className="text-sm text-on-surface-variant mt-1">Indicadores Estratégicos</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard title="Receita Mensal" value="R$ 285k" change="↑ 12% vs anterior" trend="up" sparkData={sparkReceita} />
            <StatsCard title="Orçamentos Ativos" value="12" change="R$ 87k em aberto" sparkData={[8,9,10,12,11,13,12]} />
            <StatsCard title="Taxa de Ocupação" value="78%" change="Meta: 85%" sparkData={[65,68,70,72,75,73,76,78]} />
            <StatsCard title="Equipe Disponível" value="89" change="de 156 total" trend="up" sparkData={sparkEquipe} />
          </div>

          {/* Revenue Area Chart */}
          <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest">
                TENDÊNCIA DE RECEITA — 6 MESES
              </h3>
              <span className="flex items-center gap-1.5 text-xs font-bold text-success bg-success/10 px-2.5 py-1 rounded-md">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                +58% semestre
              </span>
            </div>
            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="cooRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ba100a" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#ba100a" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 320000]}
                    ticks={[0, 80000, 160000, 240000, 320000]}
                    tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Receita']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e5e5', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="receita"
                    stroke="#ba100a"
                    strokeWidth={2.5}
                    fill="url(#cooRevenueGrad)"
                    dot={{ r: 4, fill: '#ba100a', stroke: '#fff', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#ba100a', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quote Pipeline */}
          <div className="bg-surface-container rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest">
                PIPELINE DE ORÇAMENTOS
              </h3>
              <span className="text-xs font-bold text-on-surface-variant">R$ 328.500 em pipeline</span>
            </div>
            <div className="space-y-4">
              {([
                { label: 'Aprovados', amount: 'R$ 93.500', pct: 30, colorBar: 'bg-success', colorText: 'text-success' },
                { label: 'Pendentes', amount: 'R$ 87.000', pct: 28, colorBar: 'bg-warning', colorText: 'text-warning' },
                { label: 'Em Negociação', amount: 'R$ 28.000', pct: 9, colorBar: 'bg-tertiary', colorText: 'text-tertiary' },
                { label: 'Rejeitados', amount: 'R$ 120.000', pct: 39, colorBar: 'bg-error', colorText: 'text-error' },
              ] as const).map((row) => (
                <div key={row.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-bold text-on-surface">{row.label}</span>
                    <span className={`text-sm font-black ${row.colorText}`}>{row.amount}</span>
                  </div>
                  <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${row.colorBar} transition-all`} style={{ width: `${row.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
           COO — PIPELINE RES (reuses same pipeline circles + charts)
         ═══════════════════════════════════════════════════════════ */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-2">
              <h3 className="text-[11px] font-black text-[#6b7280] uppercase tracking-[0.15em]">
                RES — RECRUTAMENTO & SELEÇÃO
              </h3>
            </div>
            <div className="grid grid-cols-4 divide-x divide-[#f3f4f6]">
              {pipelineData.map((stage) => {
                const colors = pipelineColors[stage.stage];
                const hist = pipelineHistory.find((h) => h.stage === stage.stage)!;
                const chartData = hist.data.map((v, idx) => ({ idx, v }));
                const maxY = Math.max(...hist.data);
                const yTicks = [0, Math.round(maxY * 0.25), Math.round(maxY * 0.5), Math.round(maxY * 0.75), maxY];
                return (
                  <div key={stage.stage} className="flex flex-col">
                    <div className="px-4 pt-4 pb-3 bg-[#fafafa] border-b border-[#f3f4f6]">
                      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#6b7280] mb-3">{stage.stage}</p>
                      <div className={`w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center shadow-sm`}>
                        <span className="text-white font-black text-sm">{stage.count}</span>
                      </div>
                    </div>
                    <div className="px-2 pt-3 pb-2 flex-1" style={{ minHeight: 120 }}>
                      <ResponsiveContainer width="100%" height={110}>
                        <BarChart data={chartData} barSize={10} margin={{ top: 2, right: 4, bottom: 0, left: 0 }}>
                          <YAxis tick={{ fontSize: 8, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={22} domain={[0, maxY + 5]} ticks={yTicks} />
                          <Bar dataKey="v" fill={hist.color} radius={[3, 3, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
           COO — FINANCEIRO
         ═══════════════════════════════════════════════════════════ */}
      {activeTab === 'financeiro' && (
        <div className="space-y-6">
          {/* Financial Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {([
              { label: 'Folha Total (Abr)', value: 'R$ 42.180', style: 'bg-primary/10 border-l-4 border-primary' },
              { label: 'Receita Bruta (Abr)', value: 'R$ 285.000', style: 'bg-success/10 border-l-4 border-success' },
              { label: 'Margem Operacional', value: '38,2%', style: 'bg-secondary-container/20 border-l-4 border-secondary' },
              { label: 'A Pagar (Pendente)', value: 'R$ 18.450', style: 'bg-error/10 border-l-4 border-error' },
            ] as const).map((card) => (
              <div key={card.label} className={`${card.style} rounded-xl p-5`}>
                <p className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest">{card.label}</p>
                <p className="text-2xl font-black text-on-surface mt-2">{card.value}</p>
              </div>
            ))}
          </div>

          {/* Events Table */}
          <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-sm p-6">
            <h3 className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest mb-5">
              Próximos Eventos
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-container-high">
                    {['Evento', 'Data', 'Local', 'Equipe', 'Status', 'WhatsApp'].map((h) => (
                      <th key={h} className="text-left py-3 px-3 text-[11px] font-black text-on-surface-variant uppercase tracking-widest whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {upcomingEvents.map((evt) => (
                    <tr key={evt.title} className="border-b border-[#f4f4f5] hover:bg-[#f9f9f9] transition-colors">
                      <td className="py-3 px-3 font-bold text-on-surface whitespace-nowrap">{evt.title}</td>
                      <td className="py-3 px-3 text-on-surface-variant whitespace-nowrap">{evt.date}</td>
                      <td className="py-3 px-3 text-on-surface-variant whitespace-nowrap">{evt.location}</td>
                      <td className="py-3 px-3 text-on-surface whitespace-nowrap">
                        {evt.team}/{evt.total}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="text-xs font-bold text-on-surface-variant">{evt.status}</span>
                      </td>
                      <td className="py-3 px-3">
                        <a
                          href={evt.whatsappGroup}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-black text-success bg-success/10 px-2.5 py-1 rounded-lg hover:bg-success/20 transition-colors"
                        >
                          <MessageCircle className="w-3 h-3" /> Abrir
                        </a>
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
           TAB 1 — ESTRATÉGICO (Visão C-Level / Diretoria)
         ═══════════════════════════════════════════════════════════ */}
      {activeTab === 'estrategico' && (
        <div className="space-y-6">
          {/* Section Label */}
          <div className="flex items-center gap-2">
            <Telescope className="w-4 h-4 text-primary-container" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-primary-container">
              OKRs — Objetivos e Resultados-Chave
            </span>
          </div>

          {/* OKR Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {okrs.map((okr) => (
              <div key={okr.title} className="bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-sm overflow-hidden hover:shadow-md transition-shadow">
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
          <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-sm p-6">
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
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, '']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e5e5', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  />
                  <Area type="monotone" dataKey="meta" stroke="#775652" strokeWidth={2} strokeDasharray="6 4" fill="none" />
                  <Area type="monotone" dataKey="receita" stroke="#ba100a" strokeWidth={2.5} fill="url(#revenueAnnualGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Market Share */}
          <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-sm p-6">
            <h3 className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest mb-5">
              Market Share — Brigadas em MG
            </h3>
            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={marketData} layout="vertical" barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}%`} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} width={100} />
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'Market Share']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e5e5', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
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
          <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-sm p-6">
            <h3 className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest mb-5">
              Metas Anuais 2026
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-container-high">
                    <th className="text-left py-3 px-4 text-[11px] font-black text-on-surface-variant uppercase tracking-widest">Meta</th>
                    <th className="text-left py-3 px-4 text-[11px] font-black text-on-surface-variant uppercase tracking-widest">Status</th>
                    <th className="text-left py-3 px-4 text-[11px] font-black text-on-surface-variant uppercase tracking-widest">Progresso</th>
                  </tr>
                </thead>
                <tbody>
                  {metasAnuais.map((m) => (
                    <tr key={m.meta} className="border-b border-[#f4f4f5] hover:bg-[#f9f9f9] transition-colors">
                      <td className="py-3 px-4 font-bold text-on-surface">{m.meta}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-bold ${metaStatusColor[m.status] ?? 'text-on-surface-variant'}`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-[#f4f4f5] rounded-full overflow-hidden max-w-[120px]">
                            <div className="h-full rounded-full bg-primary-container transition-all" style={{ width: `${m.pct}%` }} />
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
            <StatsCard title="Eventos Ativos" value={mockStats.activeEvents} change="↑ 3 esta semana" trend="up" sparkData={sparkEvents} />
            <StatsCard title="Equipe Total" value={mockStats.totalStaff} change={`↑ ${mockStats.availableStaff} disponíveis`} trend="up" sparkData={sparkEquipe} />
            <StatsCard title="Receita Mensal" value={`R$ ${(mockStats.monthlyRevenue / 1000).toFixed(0)}k`} change="↑ 12% vs anterior" trend="up" sparkData={sparkReceita} />
            <StatsCard title="Ocupação" value={`${mockStats.occupancyRate}%`} change="Meta: 85%" sparkData={sparkOcupacao} />
          </div>

          {/* RES — Recrutamento & Seleção — Stitch unified column layout */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-2">
              <h3 className="text-[11px] font-black text-[#6b7280] uppercase tracking-[0.15em]">
                RES — RECRUTAMENTO & SELEÇÃO
              </h3>
            </div>

            {/* 4-column unified section with chevron dividers */}
            <div className="grid grid-cols-4 divide-x divide-[#f3f4f6]">
              {pipelineData.map((stage, _i) => {
                const colors = pipelineColors[stage.stage];
                const hist = pipelineHistory.find((h) => h.stage === stage.stage)!;
                const chartData = hist.data.map((v, idx) => ({ idx, v }));
                const maxY = Math.max(...hist.data);
                const yTicks = [0, Math.round(maxY * 0.25), Math.round(maxY * 0.5), Math.round(maxY * 0.75), maxY];
                return (
                  <div key={stage.stage} className="flex flex-col">
                    {/* Stage header */}
                    <div className="px-4 pt-4 pb-3 bg-[#fafafa] border-b border-[#f3f4f6]">
                      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#6b7280] mb-3">
                        {stage.stage}
                      </p>
                      <div className={`w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center shadow-sm`}>
                        <span className="text-white font-black text-sm">{stage.count}</span>
                      </div>
                    </div>
                    {/* Mini bar chart */}
                    <div className="px-2 pt-3 pb-2 flex-1" style={{ minHeight: 120 }}>
                      <ResponsiveContainer width="100%" height={110}>
                        <BarChart data={chartData} barSize={10} margin={{ top: 2, right: 4, bottom: 0, left: 0 }}>
                          <YAxis
                            tick={{ fontSize: 8, fill: '#9ca3af' }}
                            axisLine={false}
                            tickLine={false}
                            width={22}
                            domain={[0, maxY + 5]}
                            ticks={yTicks}
                          />
                          <Bar dataKey="v" fill={hist.color} radius={[3, 3, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Row: Revenue Chart + Upcoming Events */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest">
                  Receita Mensal
                </h3>
                <span className="flex items-center gap-1.5 text-xs font-bold text-success bg-success/10 px-2.5 py-1 rounded-md">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                  +58% 6 meses
                </span>
              </div>
              <div className="h-48 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ba100a" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#ba100a" stopOpacity={0.03} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                    <YAxis
                      tick={{ fontSize: 11, fill: '#6b7280' }}
                      axisLine={false}
                      tickLine={false}
                      domain={[0, 320000]}
                      ticks={[0, 80000, 160000, 240000, 320000]}
                      tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Receita']}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e5e5e5', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="receita"
                      stroke="#ba100a"
                      strokeWidth={2.5}
                      fill="url(#revenueGradient)"
                      dot={{ r: 4, fill: '#ba100a', stroke: '#fff', strokeWidth: 2 }}
                      activeDot={{ r: 6, fill: '#ba100a', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Upcoming Events — 2x2 grid */}
            <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest">
                  Próximos Eventos
                </h3>
                <button className="text-[11px] font-black text-primary-container uppercase tracking-wider flex items-center gap-1 hover:underline">
                  Ver Todos <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {upcomingEvents.map((evt) => {
                  const fillPct = Math.round((evt.team / evt.total) * 100);
                  return (
                    <div key={evt.title} className="border border-surface-container-high rounded-lg p-3 hover:shadow-sm transition-shadow">
                      <div className="flex items-start gap-3">
                        {/* Date badge */}
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex flex-col items-center justify-center shrink-0 border border-primary/20">
                          <span className="text-base font-black text-primary leading-none">{evt.date.split('/')[0]}</span>
                          <span className="text-[9px] font-bold text-primary/60">/{evt.date.split('/')[1]}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-on-surface text-sm truncate">{evt.title}</p>
                          <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 shrink-0" /> {evt.location} • Camarão
                          </p>
                          <div className="flex items-center justify-between mt-1.5">
                            <span className="text-[10px] font-bold text-on-surface-variant">{evt.status}</span>
                            <span className="text-xs font-black text-on-surface">
                              {evt.team}/{evt.total} <span className="font-normal text-on-surface-variant">equipe</span>
                            </span>
                          </div>
                          {/* Progress bar */}
                          <div className="mt-2 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{ width: `${fillPct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
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
          <div className="bg-[#1e1e2d] rounded-xl p-5 sm:p-6 lg:p-8 text-white relative overflow-hidden">
            <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-white/5 blur-2xl hidden sm:block" />
            <div className="relative z-10">
              <p className="text-[11px] font-black uppercase tracking-widest text-white/50 mb-2">Evento Ativo Hoje</p>
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-tight font-headline">ABRAMULTI STREAMING 2026</h2>
              <div className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-2 mt-3 sm:mt-4 text-xs sm:text-sm">
                <span className="flex items-center gap-1.5 text-white/70">
                  <MapPin className="w-4 h-4" /> EXPOMINAS, Belo Horizonte
                </span>
                <span className="flex items-center gap-1.5 text-white/70">
                  <Calendar className="w-4 h-4" /> 03/04 a 10/04/2026
                </span>
                <span className="flex items-center gap-1.5 text-white/70">
                  <Users className="w-4 h-4" /> 16 Brigadistas escalados
                </span>
                <span className="flex items-center gap-1.5 text-white/70">
                  <DollarSign className="w-4 h-4" /> Folha estimada: R$ 4.718,96
                </span>
              </div>
            </div>
          </div>

          {/* Escala do Dia */}
          <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-sm p-4 sm:p-6">
            <h3 className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest mb-4 sm:mb-5">
              Escala do Dia — 05/04/2026
            </h3>
            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-container-high">
                    <th className="text-left py-3 px-4 text-[11px] font-black text-on-surface-variant uppercase tracking-widest">QT</th>
                    <th className="text-left py-3 px-4 text-[11px] font-black text-on-surface-variant uppercase tracking-widest">Nome</th>
                    <th className="text-left py-3 px-4 text-[11px] font-black text-on-surface-variant uppercase tracking-widest">Horário</th>
                    <th className="text-left py-3 px-4 text-[11px] font-black text-on-surface-variant uppercase tracking-widest">Status</th>
                    <th className="text-right py-3 px-4 text-[11px] font-black text-on-surface-variant uppercase tracking-widest">Remuneração</th>
                  </tr>
                </thead>
                <tbody>
                  {escalaDia.map((row) => (
                    <tr key={row.qt} className="border-b border-[#f4f4f5] hover:bg-[#f9f9f9] transition-colors">
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
              <DollarSign className="w-4 h-4 text-primary-container" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-primary-container">
                Resumo Financeiro do Evento
              </span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {([
                { label: 'Total Folha', value: 'R$ 4.718,96', color: 'bg-primary-container' },
                { label: 'Pagos', value: 'R$ 2.150,00', color: 'bg-success' },
                { label: 'Pendentes', value: 'R$ 2.568,96', color: 'bg-warning' },
                { label: 'Custo/hora médio', value: 'R$ 12,81', color: 'bg-tertiary' },
              ] as const).map((card) => (
                <div key={card.label} className="bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-sm p-5 relative overflow-hidden hover:shadow-md transition-shadow">
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
            <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <Clock className="w-4 h-4 text-primary-container" />
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
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-px h-6 bg-[#e5e5e5]" />
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
            <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <Package className="w-4 h-4 text-primary-container" />
                <h3 className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest">
                  Material / Equipamento
                </h3>
              </div>
              <div className="space-y-3">
                {equipamentos.map((eq) => (
                  <div key={eq.item} className="flex items-center gap-3 p-3 rounded-lg bg-[#f9f9f9] border border-[#f4f4f5]">
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
    </div>
  );
}
