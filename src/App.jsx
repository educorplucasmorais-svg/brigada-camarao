import { useState, useEffect, useRef } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from "recharts";

// ═══ CONSTANTS ═══════════════════════════════════════════════════
const RED = '#ba100a';
const DKRED = '#8a0508';
const BORD = '#e8ddd9';
const MUT = '#6b5e5c';
const BG = '#f5f0ee';
const uid = () => 'id' + Date.now() + Math.random().toString(36).slice(2, 6);
const cur = v => 'R$ ' + Number(v || 0).toLocaleString('pt-BR');
const dt = d => d ? new Date(d + 'T12:00').toLocaleDateString('pt-BR') : '-';
const IS = { border: '1.5px solid #e8ddd9', borderRadius: 10, padding: '10px 13px', fontSize: 14, width: '100%', fontFamily: 'Inter,sans-serif', background: '#faf7f6', outline: 'none', color: '#1a0806', boxSizing: 'border-box' };
const SEL = { ...IS, cursor: 'pointer' };
const LS = { fontSize: 11, fontWeight: 700, letterSpacing: '0.8px', color: '#374151', textTransform: 'uppercase', display: 'block', marginBottom: 5, fontFamily: 'Manrope,sans-serif' };

// ═══ SEED DATA ════════════════════════════════════════════════════
const SEED = {
  events: [
    { id: 'ev1', title: 'Plantão Hospital Santa Joana', type: 'Hospitalar', date: '2026-10-15', time: '08:00-20:00', location: 'Bela Vista, SP', pay: 220, total: 5, filled: 2, status: 'Ativo', whatsapp: 'https://wa.me/' },
    { id: 'ev2', title: 'Show na Praça da Sé', type: 'Evento Especial', date: '2026-10-18', time: '16:00-04:00', location: 'Centro Histórico, SP', pay: 280, total: 15, filled: 7, status: 'Ativo', whatsapp: 'https://wa.me/' },
    { id: 'ev3', title: 'Shopping Ibirapuera', type: 'Corporativo', date: '2026-10-16', time: '09:00-18:00', location: 'Ibirapuera, SP', pay: 185, total: 15, filled: 15, status: 'Encerrado', whatsapp: '' },
    { id: 'ev4', title: 'Plantão Noturno Berrini', type: 'Hospitalar', date: '2026-04-01', time: '20:00-08:00', location: 'Berrini, SP', pay: 240, total: 30, filled: 27, status: 'Ativo', whatsapp: 'https://wa.me/' },
    { id: 'ev5', title: 'Carnaval Cultural SP', type: 'Evento Especial', date: '2026-04-25', time: '14:00-02:00', location: 'Centro, SP', pay: 310, total: 40, filled: 0, status: 'Aberto', whatsapp: '' },
  ],
  vacancies: [
    { id: 'vc1', title: 'Bombeiro Civil – Plantão', type: 'Hospitalar', pay: 220, slots: 15, req: 'NR-23, Primeiros Socorros', status: 'Aberto' },
    { id: 'vc2', title: 'Coordenador de Segurança', type: 'Eventos', pay: 380, slots: 5, req: 'Liderança, 3+ anos', status: 'Aberto' },
    { id: 'vc3', title: 'Brigadista Industrial', type: 'Industrial', pay: 260, slots: 8, req: 'NR-23, CIPA', status: 'Aberto' },
  ],
  quotes: [
    { id: 'qt1', client: 'Hospital A. Einstein', type: 'Hospitalar', value: 85000, status: 'Aprovado', valid: '2026-04-30', contact: 'compras@einstein.br' },
    { id: 'qt2', client: 'Rock in Rio SP', type: 'Mega Evento', value: 220000, status: 'Em Análise', valid: '2026-04-15', contact: 'eventos@rockinrio.com' },
    { id: 'qt3', client: 'Petrobras Refinaria', type: 'Industrial', value: 45000, status: 'Aprovado', valid: '2026-05-20', contact: 'seg@petrobras.com' },
    { id: 'qt4', client: 'Shopping Morumbi', type: 'Corporativo', value: 32000, status: 'Negociação', valid: '2026-04-10', contact: 'ops@morumbi.com' },
    { id: 'qt5', client: 'Anhembi Eventos', type: 'Evento Grande', value: 98000, status: 'Em Análise', valid: '2026-05-05', contact: 'eventos@anhembi.com' },
  ],
  team: [
    { id: 'tm1', name: 'Carlos Silva', role: 'Bombeiro Civil', cred: 'BC-001', cpf: '111.222.333-01', pix: 'carlos@brigade.com', status: 'Ativo', events: 45 },
    { id: 'tm2', name: 'Ana Beatriz Costa', role: 'Coordenadora', cred: 'BC-002', cpf: '111.222.333-02', pix: 'ana@brigade.com', status: 'Ativo', events: 62 },
    { id: 'tm3', name: 'Ricardo Santos', role: 'Bombeiro Civil', cred: 'BC-003', cpf: '111.222.333-03', pix: 'ricardo@brigade.com', status: 'Disponível', events: 28 },
    { id: 'tm4', name: 'Fernanda Lima', role: 'Bombeiro Sênior', cred: 'BC-004', cpf: '111.222.333-04', pix: 'fernanda@brigade.com', status: 'Em Missão', events: 89 },
    { id: 'tm5', name: 'Pedro Oliveira', role: 'Bombeiro Civil', cred: 'BC-005', cpf: '111.222.333-05', pix: 'pedro@brigade.com', status: 'Ativo', events: 34 },
    { id: 'tm6', name: 'Juliana Mendes', role: 'Coordenadora', cred: 'BC-006', cpf: '111.222.333-06', pix: 'juliana@brigade.com', status: 'Disponível', events: 51 },
  ],
};

// ═══ STORAGE (window.storage + memory fallback) ════════════════
const MEM = {};
const st = {
  async get(k) { try { const r = await window.storage.get(k); return r?.value ?? null; } catch { return MEM[k] ?? null; } },
  async set(k, v) { try { await window.storage.set(k, v); } catch { MEM[k] = v; } },
};

// ═══ CLAUDE AI — Cookbooks Tool Use + Agentic Loop ════════════
const AI_TOOLS = [
  { name: 'get_stats', description: 'Estatísticas atuais do banco de dados da Brigada Camarão', input_schema: { type: 'object', properties: {} } },
  { name: 'filter_events', description: 'Filtrar eventos por status ou tipo', input_schema: { type: 'object', properties: { status: { type: 'string' }, type: { type: 'string' } } } },
  { name: 'analyze_revenue', description: 'Analisar receitas e métricas financeiras', input_schema: { type: 'object', properties: {} } },
  { name: 'team_summary', description: 'Resumo da equipe por status e função', input_schema: { type: 'object', properties: {} } },
];
function runTool(name, inp, db) {
  if (name === 'get_stats') return JSON.stringify({ eventos: { total: db.events.length, ativos: db.events.filter(e => e.status === 'Ativo').length, abertos: db.events.filter(e => e.status === 'Aberto').length }, equipe: { total: db.team.length, disponíveis: db.team.filter(t => t.status === 'Disponível').length, emMissão: db.team.filter(t => t.status === 'Em Missão').length }, orçamentos: { total: db.quotes.length, aprovados: db.quotes.filter(q => q.status === 'Aprovado').length, valorAprovado: db.quotes.filter(q => q.status === 'Aprovado').reduce((s, q) => s + q.value, 0) }, vagas: { abertas: db.vacancies.filter(v => v.status === 'Aberto').length } });
  if (name === 'filter_events') { let e = [...db.events]; if (inp.status && inp.status !== 'all') e = e.filter(x => x.status === inp.status); if (inp.type) e = e.filter(x => x.type.toLowerCase().includes(inp.type.toLowerCase())); return JSON.stringify(e.map(x => ({ título: x.title, data: x.date, remuneração: `R$${x.pay}`, vagas: `${x.filled}/${x.total}`, status: x.status }))); }
  if (name === 'analyze_revenue') { const t = db.quotes.reduce((s, q) => s + q.value, 0); const c = db.quotes.filter(q => q.status === 'Aprovado').reduce((s, q) => s + q.value, 0); return JSON.stringify({ pipeline: t, confirmado: c, conversão: t ? Math.round(c / t * 100) + '%' : '0%', remuneraçãoMédia: db.events.length ? Math.round(db.events.reduce((s, e) => s + e.pay, 0) / db.events.length) : 0 }); }
  if (name === 'team_summary') { const r = db.team.reduce((a, m) => { a[m.role] = (a[m.role] || 0) + 1; return a; }, {}); const s = db.team.reduce((a, m) => { a[m.status] = (a[m.status] || 0) + 1; return a; }, {}); return JSON.stringify({ total: db.team.length, porFunção: r, porStatus: s, médiasEscalas: db.team.length ? Math.round(db.team.reduce((s, m) => s + m.events, 0) / db.team.length) : 0 }); }
  return '{}';
}
async function callAI(msgs, db) {
  const SYS = `Você é Sentinel AI, assistente inteligente da Brigada Camarão — maior brigada civil do Brasil. Use as ferramentas disponíveis para consultar o banco de dados em tempo real. Responda em português, seja objetivo e profissional.`;
  const call = async m => { const r = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1000, system: SYS, messages: m, tools: AI_TOOLS }) }); return r.json(); };
  let data = await call(msgs);
  // Agentic loop — Claude Cookbooks pattern: keep calling while tool_use
  while (data.stop_reason === 'tool_use') {
    const uses = data.content.filter(b => b.type === 'tool_use');
    const results = uses.map(u => ({ type: 'tool_result', tool_use_id: u.id, content: runTool(u.name, u.input, db) }));
    data = await call([...msgs, { role: 'assistant', content: data.content }, { role: 'user', content: results }]);
  }
  return data.content?.filter(b => b.type === 'text').map(b => b.text).join('') || 'Não foi possível processar.';
}

// ═══ CSV EXPORT (Sheets backup) ═══════════════════════════════
function exportCSV(entity, db) {
  const cfg = {
    events: { h: ['ID', 'Título', 'Tipo', 'Data', 'Horário', 'Local', 'R$/dia', 'Total Vagas', 'Preenchidas', 'Status', 'WhatsApp'], r: e => [e.id, e.title, e.type, e.date, e.time, e.location, e.pay, e.total, e.filled, e.status, e.whatsapp] },
    vacancies: { h: ['ID', 'Título', 'Tipo', 'R$/dia', 'Vagas', 'Requisitos', 'Status'], r: v => [v.id, v.title, v.type, v.pay, v.slots, v.req, v.status] },
    quotes: { h: ['ID', 'Cliente', 'Tipo', 'Valor', 'Status', 'Válido Até', 'Contato'], r: q => [q.id, q.client, q.type, q.value, q.status, q.valid, q.contact] },
    team: { h: ['ID', 'Nome', 'Função', 'Credencial', 'CPF', 'PIX', 'Status', 'Escalas'], r: m => [m.id, m.name, m.role, m.cred, m.cpf, m.pix, m.status, m.events] },
  };
  const { h, r } = cfg[entity];
  const csv = [h, ...db[entity].map(r)].map(row => row.map(c => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })), download: `brigada-${entity}-${new Date().toISOString().slice(0, 10)}.csv` });
  a.click();
}

// ═══ SMALL COMPONENTS ════════════════════════════════════════
const BC = { Ativo: ['#dcfce7', '#166534'], Disponível: ['#dbeafe', '#1e40af'], 'Em Missão': ['#fef3c7', '#92400e'], Encerrado: ['#f3f4f6', '#6b7280'], Aberto: ['#ede9fe', '#5b21b6'], Aprovado: ['#dcfce7', '#166534'], 'Em Análise': ['#fef3c7', '#92400e'], Negociação: ['#dbeafe', '#1e40af'], Inativo: ['#fecaca', '#991b1b'], Recusado: ['#fecaca', '#991b1b'], Hospitalar: ['#dbeafe', '#1e40af'], 'Evento Especial': ['#fef3c7', '#92400e'], Corporativo: ['#f3f4f6', '#374151'], Industrial: ['#f0fdf4', '#15803d'], Fechado: ['#f3f4f6', '#6b7280'], 'Mega Evento': ['#ede9fe', '#5b21b6'], 'Evento Grande': ['#fef3c7', '#92400e'], Eventos: ['#fef3c7', '#92400e'] };
function Badge({ label }) { const [bg, c] = BC[label] || ['#f3f4f6', '#374151']; return <span style={{ background: bg, color: c, fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, whiteSpace: 'nowrap' }}>{label}</span>; }
function Av({ name, size = 36 }) { const i = name.split(' ').slice(0, 2).map(n => n[0]).join(''); return <div style={{ width: size, height: size, borderRadius: '50%', background: RED, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: size * .38, flexShrink: 0, fontFamily: 'Manrope,sans-serif' }}>{i}</div>; }
function Toast({ msg, type = 'ok', onClose }) { useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []); return <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, background: type === 'err' ? '#fef2f2' : '#f0fdf4', border: `1px solid ${type === 'err' ? '#fca5a5' : '#86efac'}`, borderRadius: 12, padding: '12px 16px', boxShadow: '0 4px 20px rgba(0,0,0,.12)', display: 'flex', alignItems: 'center', gap: 10, maxWidth: 320 }}><span>{type === 'err' ? '❌' : '✅'}</span><span style={{ fontSize: 13, fontWeight: 600, color: type === 'err' ? '#991b1b' : '#166534' }}>{msg}</span></div>; }
function Confirm({ msg, onOk, onCancel }) { return <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9998, padding: 20 }}><div style={{ background: '#fff', borderRadius: 16, padding: 28, maxWidth: 340, width: '100%', textAlign: 'center' }}><div style={{ fontSize: 36, marginBottom: 12 }}>🗑️</div><p style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>{msg}</p><div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}><button onClick={onCancel} style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid ' + BORD, background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'Manrope,sans-serif' }}>Cancelar</button><button onClick={onOk} style={{ padding: '10px 20px', borderRadius: 10, background: RED, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'Manrope,sans-serif' }}>Excluir</button></div></div></div>; }

// ═══ FORMS ════════════════════════════════════════════════════
function G2({ children }) { return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>{children}</div>; }
function FL({ label, span, children }) { return <div style={span ? { gridColumn: 'span 2' } : {}}><label style={LS}>{label}</label>{children}</div>; }
function EventForm({ d, s }) {
  const f = (k, v) => s({ ...d, [k]: v });
  return <G2>
    <FL label="Título" span><input style={IS} value={d.title || ''} onChange={e => f('title', e.target.value)} /></FL>
    <FL label="Tipo"><select style={SEL} value={d.type || 'Hospitalar'} onChange={e => f('type', e.target.value)}>{['Hospitalar', 'Evento Especial', 'Corporativo', 'Industrial'].map(o => <option key={o}>{o}</option>)}</select></FL>
    <FL label="Status"><select style={SEL} value={d.status || 'Ativo'} onChange={e => f('status', e.target.value)}>{['Ativo', 'Aberto', 'Encerrado'].map(o => <option key={o}>{o}</option>)}</select></FL>
    <FL label="Data"><input style={IS} type="date" value={d.date || ''} onChange={e => f('date', e.target.value)} /></FL>
    <FL label="Horário (ex: 08:00-20:00)"><input style={IS} value={d.time || ''} onChange={e => f('time', e.target.value)} /></FL>
    <FL label="Local" span><input style={IS} value={d.location || ''} onChange={e => f('location', e.target.value)} /></FL>
    <FL label="Remuneração (R$)"><input style={IS} type="number" value={d.pay || ''} onChange={e => f('pay', Number(e.target.value))} /></FL>
    <FL label="Total de Vagas"><input style={IS} type="number" value={d.total || ''} onChange={e => f('total', Number(e.target.value))} /></FL>
    <FL label="Vagas Preenchidas"><input style={IS} type="number" value={d.filled || 0} onChange={e => f('filled', Number(e.target.value))} /></FL>
    <FL label="Link WhatsApp"><input style={IS} value={d.whatsapp || ''} onChange={e => f('whatsapp', e.target.value)} /></FL>
  </G2>;
}
function VacancyForm({ d, s }) {
  const f = (k, v) => s({ ...d, [k]: v });
  return <G2>
    <FL label="Título da Vaga" span><input style={IS} value={d.title || ''} onChange={e => f('title', e.target.value)} /></FL>
    <FL label="Tipo"><select style={SEL} value={d.type || 'Hospitalar'} onChange={e => f('type', e.target.value)}>{['Hospitalar', 'Eventos', 'Industrial', 'Corporativo'].map(o => <option key={o}>{o}</option>)}</select></FL>
    <FL label="Status"><select style={SEL} value={d.status || 'Aberto'} onChange={e => f('status', e.target.value)}>{['Aberto', 'Fechado'].map(o => <option key={o}>{o}</option>)}</select></FL>
    <FL label="Remuneração (R$/dia)"><input style={IS} type="number" value={d.pay || ''} onChange={e => f('pay', Number(e.target.value))} /></FL>
    <FL label="Nº Vagas"><input style={IS} type="number" value={d.slots || ''} onChange={e => f('slots', Number(e.target.value))} /></FL>
    <FL label="Requisitos" span><input style={IS} value={d.req || ''} onChange={e => f('req', e.target.value)} /></FL>
  </G2>;
}
function QuoteForm({ d, s }) {
  const f = (k, v) => s({ ...d, [k]: v });
  return <G2>
    <FL label="Cliente" span><input style={IS} value={d.client || ''} onChange={e => f('client', e.target.value)} /></FL>
    <FL label="Tipo"><select style={SEL} value={d.type || 'Hospitalar'} onChange={e => f('type', e.target.value)}>{['Hospitalar', 'Evento Grande', 'Mega Evento', 'Industrial', 'Corporativo'].map(o => <option key={o}>{o}</option>)}</select></FL>
    <FL label="Status"><select style={SEL} value={d.status || 'Em Análise'} onChange={e => f('status', e.target.value)}>{['Em Análise', 'Aprovado', 'Negociação', 'Recusado'].map(o => <option key={o}>{o}</option>)}</select></FL>
    <FL label="Valor Total (R$)"><input style={IS} type="number" value={d.value || ''} onChange={e => f('value', Number(e.target.value))} /></FL>
    <FL label="Válido Até"><input style={IS} type="date" value={d.valid || ''} onChange={e => f('valid', e.target.value)} /></FL>
    <FL label="Contato" span><input style={IS} value={d.contact || ''} onChange={e => f('contact', e.target.value)} /></FL>
  </G2>;
}
function TeamForm({ d, s }) {
  const f = (k, v) => s({ ...d, [k]: v });
  return <G2>
    <FL label="Nome Completo" span><input style={IS} value={d.name || ''} onChange={e => f('name', e.target.value)} /></FL>
    <FL label="Função"><select style={SEL} value={d.role || 'Bombeiro Civil'} onChange={e => f('role', e.target.value)}>{['Bombeiro Civil', 'Bombeiro Sênior', 'Coordenador', 'Coordenadora', 'Instrutor'].map(o => <option key={o}>{o}</option>)}</select></FL>
    <FL label="Status"><select style={SEL} value={d.status || 'Ativo'} onChange={e => f('status', e.target.value)}>{['Ativo', 'Disponível', 'Em Missão', 'Inativo'].map(o => <option key={o}>{o}</option>)}</select></FL>
    <FL label="Credencial (BC-XXX)"><input style={IS} value={d.cred || ''} onChange={e => f('cred', e.target.value)} /></FL>
    <FL label="CPF"><input style={IS} value={d.cpf || ''} onChange={e => f('cpf', e.target.value)} /></FL>
    <FL label="Chave PIX"><input style={IS} value={d.pix || ''} onChange={e => f('pix', e.target.value)} /></FL>
    <FL label="Nº Escalas"><input style={IS} type="number" value={d.events || 0} onChange={e => f('events', Number(e.target.value))} /></FL>
  </G2>;
}

// ═══ ENTITY MODAL ════════════════════════════════════════════
function EntityModal({ type, mode, data, onSave, onClose }) {
  const [form, setForm] = useState(data || {});
  const T = { events: 'Evento', vacancies: 'Vaga', quotes: 'Orçamento', team: 'Membro da Equipe' };
  return <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9000, padding: 20 }}>
    <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 620, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,.2)' }}>
      <div style={{ padding: '18px 24px', borderBottom: '1px solid ' + BORD, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
        <h3 style={{ fontFamily: 'Manrope,sans-serif', fontWeight: 800, fontSize: 18 }}>{mode === 'add' ? '➕' : '✏️'} {mode === 'add' ? 'Adicionar' : 'Editar'} {T[type]}</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: MUT }}>×</button>
      </div>
      <div style={{ padding: 24 }}>
        {type === 'events' && <EventForm d={form} s={setForm} />}
        {type === 'vacancies' && <VacancyForm d={form} s={setForm} />}
        {type === 'quotes' && <QuoteForm d={form} s={setForm} />}
        {type === 'team' && <TeamForm d={form} s={setForm} />}
      </div>
      <div style={{ padding: '0 24px 24px', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button onClick={onClose} style={{ padding: '11px 20px', borderRadius: 10, border: '1px solid ' + BORD, background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'Manrope,sans-serif' }}>Cancelar</button>
        <button onClick={() => onSave({ ...form, id: form.id || uid() })} style={{ padding: '11px 20px', borderRadius: 10, background: RED, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'Manrope,sans-serif' }}>💾 Salvar</button>
      </div>
    </div>
  </div>;
}

// ═══ FILTER BAR ══════════════════════════════════════════════
function FilterBar({ search, onSearch, statusOpts = [], status, onStatus, onAdd, addLabel, onExport }) {
  return <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
    <input value={search} onChange={e => onSearch(e.target.value)} placeholder="🔍 Pesquisar..." style={{ border: '1.5px solid ' + BORD, borderRadius: 10, padding: '9px 14px', fontSize: 13, flex: 1, minWidth: 160, outline: 'none', background: '#faf7f6', fontFamily: 'Inter,sans-serif' }} />
    {statusOpts.length > 0 && <select value={status} onChange={e => onStatus(e.target.value)} style={{ border: '1.5px solid ' + BORD, borderRadius: 10, padding: '9px 14px', fontSize: 13, background: '#faf7f6', outline: 'none', fontFamily: 'Inter,sans-serif', color: '#374151' }}><option value="">Todos</option>{statusOpts.map(s => <option key={s} value={s}>{s}</option>)}</select>}
    {onExport && <button onClick={onExport} style={{ padding: '9px 14px', borderRadius: 10, border: '1px solid ' + BORD, background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'Manrope,sans-serif', color: '#374151', whiteSpace: 'nowrap' }}>📥 Exportar CSV</button>}
    {onAdd && <button onClick={onAdd} style={{ padding: '9px 14px', borderRadius: 10, background: RED, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'Manrope,sans-serif', whiteSpace: 'nowrap' }}>+ {addLabel}</button>}
  </div>;
}

// ═══ ADMIN TABLE ════════════════════════════════════════════
function TH({ children }) { return <th style={{ padding: '12px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: MUT, letterSpacing: '0.8px', textTransform: 'uppercase', borderBottom: '2px solid ' + BORD, whiteSpace: 'nowrap' }}>{children}</th>; }
function TD({ children, bold, red }) { return <td style={{ padding: '13px 14px', fontSize: 13, fontWeight: bold ? 700 : 400, color: red ? RED : '#1a0806', borderBottom: '1px solid #f3f4f6', verticalAlign: 'middle' }}>{children}</td>; }

// ═══ ADMIN SECTIONS ══════════════════════════════════════════
function EventsAdmin({ db, onUpdate, toast }) {
  const [search, setSearch] = useState(''); const [status, setStatus] = useState(''); const [modal, setModal] = useState(null); const [confirm, setConfirm] = useState(null);
  const list = db.events.filter(e => (!status || e.status === status) && (!search || e.title.toLowerCase().includes(search.toLowerCase()) || e.type.toLowerCase().includes(search.toLowerCase()) || e.location.toLowerCase().includes(search.toLowerCase())));
  const save = d => { const exists = db.events.find(e => e.id === d.id); onUpdate({ ...db, events: exists ? db.events.map(e => e.id === d.id ? d : e) : [...db.events, d] }); setModal(null); toast(exists ? 'Evento atualizado!' : 'Evento adicionado!'); };
  const del = id => { onUpdate({ ...db, events: db.events.filter(e => e.id !== id) }); setConfirm(null); toast('Evento excluído.', 'ok'); };
  return <div>
    <FilterBar search={search} onSearch={setSearch} statusOpts={['Ativo', 'Aberto', 'Encerrado']} status={status} onStatus={setStatus} onAdd={() => setModal({ mode: 'add', data: {} })} addLabel="Evento" onExport={() => exportCSV('events', db)} />
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid ' + BORD, overflow: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr><TH>Evento</TH><TH>Tipo</TH><TH>Data</TH><TH>Remuneração</TH><TH>Vagas</TH><TH>Status</TH><TH>Ações</TH></tr></thead>
        <tbody>{list.map(e => <tr key={e.id} style={{ transition: 'background .15s' }} onMouseEnter={el => el.currentTarget.style.background = '#faf7f6'} onMouseLeave={el => el.currentTarget.style.background = ''}>
          <TD bold>{e.title}<div style={{ fontSize: 11, color: MUT, marginTop: 2 }}>📍 {e.location}</div></TD>
          <TD><Badge label={e.type} /></TD>
          <TD>{dt(e.date)}<div style={{ fontSize: 11, color: MUT }}>🕐 {e.time}</div></TD>
          <TD red bold>{cur(e.pay)}</TD>
          <TD><div style={{ fontSize: 13 }}>{e.filled}/{e.total}</div><div style={{ height: 4, borderRadius: 99, background: '#e5e7eb', marginTop: 4, width: 60, overflow: 'hidden' }}><div style={{ height: '100%', borderRadius: 99, background: RED, width: `${Math.min(100, Math.round(e.filled / Math.max(1, e.total) * 100))}%` }} /></div></TD>
          <TD><Badge label={e.status} /></TD>
          <TD><div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => setModal({ mode: 'edit', data: e })} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid ' + BORD, background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'Manrope,sans-serif' }}>✏️</button>
            <button onClick={() => setConfirm({ msg: `Excluir "${e.title}"?`, onOk: () => del(e.id) })} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #fca5a5', background: '#fef2f2', cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'Manrope,sans-serif' }}>🗑️</button>
          </div></TD>
        </tr>)}</tbody>
      </table>
      {list.length === 0 && <div style={{ padding: '40px', textAlign: 'center', color: MUT, fontSize: 14 }}>Nenhum evento encontrado.</div>}
    </div>
    {modal && <EntityModal type="events" mode={modal.mode} data={modal.data} onSave={save} onClose={() => setModal(null)} />}
    {confirm && <Confirm msg={confirm.msg} onOk={confirm.onOk} onCancel={() => setConfirm(null)} />}
  </div>;
}

function VacanciesAdmin({ db, onUpdate, toast }) {
  const [search, setSearch] = useState(''); const [status, setStatus] = useState(''); const [modal, setModal] = useState(null); const [confirm, setConfirm] = useState(null);
  const list = db.vacancies.filter(v => (!status || v.status === status) && (!search || v.title.toLowerCase().includes(search.toLowerCase()) || v.type.toLowerCase().includes(search.toLowerCase())));
  const save = d => { const exists = db.vacancies.find(v => v.id === d.id); onUpdate({ ...db, vacancies: exists ? db.vacancies.map(v => v.id === d.id ? d : v) : [...db.vacancies, d] }); setModal(null); toast(exists ? 'Vaga atualizada!' : 'Vaga adicionada!'); };
  const del = id => { onUpdate({ ...db, vacancies: db.vacancies.filter(v => v.id !== id) }); setConfirm(null); toast('Vaga excluída.'); };
  return <div>
    <FilterBar search={search} onSearch={setSearch} statusOpts={['Aberto', 'Fechado']} status={status} onStatus={setStatus} onAdd={() => setModal({ mode: 'add', data: {} })} addLabel="Vaga" onExport={() => exportCSV('vacancies', db)} />
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid ' + BORD, overflow: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr><TH>Título</TH><TH>Tipo</TH><TH>Remuneração</TH><TH>Vagas</TH><TH>Requisitos</TH><TH>Status</TH><TH>Ações</TH></tr></thead>
        <tbody>{list.map(v => <tr key={v.id} onMouseEnter={el => el.currentTarget.style.background = '#faf7f6'} onMouseLeave={el => el.currentTarget.style.background = ''}>
          <TD bold>{v.title}</TD><TD><Badge label={v.type} /></TD><TD red bold>{cur(v.pay)}/dia</TD><TD>{v.slots} vagas</TD><TD><span style={{ fontSize: 12, color: MUT }}>{v.req}</span></TD><TD><Badge label={v.status} /></TD>
          <TD><div style={{ display: 'flex', gap: 6 }}><button onClick={() => setModal({ mode: 'edit', data: v })} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid ' + BORD, background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'Manrope,sans-serif' }}>✏️</button><button onClick={() => setConfirm({ msg: `Excluir "${v.title}"?`, onOk: () => del(v.id) })} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #fca5a5', background: '#fef2f2', cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'Manrope,sans-serif' }}>🗑️</button></div></TD>
        </tr>)}</tbody>
      </table>
    </div>
    {modal && <EntityModal type="vacancies" mode={modal.mode} data={modal.data} onSave={save} onClose={() => setModal(null)} />}
    {confirm && <Confirm msg={confirm.msg} onOk={confirm.onOk} onCancel={() => setConfirm(null)} />}
  </div>;
}

function QuotesAdmin({ db, onUpdate, toast }) {
  const [search, setSearch] = useState(''); const [status, setStatus] = useState(''); const [modal, setModal] = useState(null); const [confirm, setConfirm] = useState(null);
  const list = db.quotes.filter(q => (!status || q.status === status) && (!search || q.client.toLowerCase().includes(search.toLowerCase()) || q.type.toLowerCase().includes(search.toLowerCase())));
  const save = d => { const exists = db.quotes.find(q => q.id === d.id); onUpdate({ ...db, quotes: exists ? db.quotes.map(q => q.id === d.id ? d : q) : [...db.quotes, d] }); setModal(null); toast(exists ? 'Orçamento atualizado!' : 'Orçamento adicionado!'); };
  const del = id => { onUpdate({ ...db, quotes: db.quotes.filter(q => q.id !== id) }); setConfirm(null); toast('Orçamento excluído.'); };
  const total = list.reduce((s, q) => s + q.value, 0);
  const approved = list.filter(q => q.status === 'Aprovado').reduce((s, q) => s + q.value, 0);
  return <div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 20 }}>
      {[['Pipeline Total', cur(total), '#1a0806'], ['Valor Aprovado', cur(approved), '#166534'], ['Taxa Conversão', total ? Math.round(approved / total * 100) + '%' : '0%', RED]].map(([l, v, c]) => <div key={l} style={{ background: '#fff', borderRadius: 12, padding: '16px 18px', border: '1px solid ' + BORD }}><div style={{ fontSize: 11, fontWeight: 700, color: MUT, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 }}>{l}</div><div style={{ fontFamily: 'Manrope,sans-serif', fontSize: 22, fontWeight: 800, color: c }}>{v}</div></div>)}
    </div>
    <FilterBar search={search} onSearch={setSearch} statusOpts={['Em Análise', 'Aprovado', 'Negociação', 'Recusado']} status={status} onStatus={setStatus} onAdd={() => setModal({ mode: 'add', data: {} })} addLabel="Orçamento" onExport={() => exportCSV('quotes', db)} />
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid ' + BORD, overflow: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr><TH>Cliente</TH><TH>Tipo</TH><TH>Valor</TH><TH>Status</TH><TH>Válido Até</TH><TH>Contato</TH><TH>Ações</TH></tr></thead>
        <tbody>{list.map(q => <tr key={q.id} onMouseEnter={el => el.currentTarget.style.background = '#faf7f6'} onMouseLeave={el => el.currentTarget.style.background = ''}>
          <TD bold>{q.client}</TD><TD><Badge label={q.type} /></TD><TD red bold>{cur(q.value)}</TD><TD><Badge label={q.status} /></TD><TD>{dt(q.valid)}</TD><TD><span style={{ fontSize: 12, color: MUT }}>{q.contact}</span></TD>
          <TD><div style={{ display: 'flex', gap: 6 }}><button onClick={() => setModal({ mode: 'edit', data: q })} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid ' + BORD, background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'Manrope,sans-serif' }}>✏️</button><button onClick={() => setConfirm({ msg: `Excluir "${q.client}"?`, onOk: () => del(q.id) })} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #fca5a5', background: '#fef2f2', cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'Manrope,sans-serif' }}>🗑️</button></div></TD>
        </tr>)}</tbody>
      </table>
    </div>
    {modal && <EntityModal type="quotes" mode={modal.mode} data={modal.data} onSave={save} onClose={() => setModal(null)} />}
    {confirm && <Confirm msg={confirm.msg} onOk={confirm.onOk} onCancel={() => setConfirm(null)} />}
  </div>;
}

function TeamAdmin({ db, onUpdate, toast }) {
  const [search, setSearch] = useState(''); const [status, setStatus] = useState(''); const [modal, setModal] = useState(null); const [confirm, setConfirm] = useState(null);
  const list = db.team.filter(m => (!status || m.status === status) && (!search || m.name.toLowerCase().includes(search.toLowerCase()) || m.cred.toLowerCase().includes(search.toLowerCase()) || m.role.toLowerCase().includes(search.toLowerCase())));
  const save = d => { const exists = db.team.find(m => m.id === d.id); onUpdate({ ...db, team: exists ? db.team.map(m => m.id === d.id ? d : m) : [...db.team, d] }); setModal(null); toast(exists ? 'Membro atualizado!' : 'Membro adicionado!'); };
  const del = id => { onUpdate({ ...db, team: db.team.filter(m => m.id !== id) }); setConfirm(null); toast('Membro excluído.'); };
  return <div>
    <FilterBar search={search} onSearch={setSearch} statusOpts={['Ativo', 'Disponível', 'Em Missão', 'Inativo']} status={status} onStatus={setStatus} onAdd={() => setModal({ mode: 'add', data: {} })} addLabel="Membro" onExport={() => exportCSV('team', db)} />
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid ' + BORD, overflow: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr><TH>Membro</TH><TH>Credencial</TH><TH>Função</TH><TH>PIX</TH><TH>Status</TH><TH>Escalas</TH><TH>Ações</TH></tr></thead>
        <tbody>{list.map(m => <tr key={m.id} onMouseEnter={el => el.currentTarget.style.background = '#faf7f6'} onMouseLeave={el => el.currentTarget.style.background = ''}>
          <TD><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Av name={m.name} size={34} /><div><div style={{ fontWeight: 700, fontSize: 13 }}>{m.name}</div><div style={{ fontSize: 11, color: MUT }}>{m.cpf}</div></div></div></TD>
          <TD><span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: RED }}>{m.cred}</span></TD>
          <TD>{m.role}</TD><TD><span style={{ fontSize: 12, color: MUT }}>{m.pix}</span></TD><TD><Badge label={m.status} /></TD>
          <TD bold>{m.events}</TD>
          <TD><div style={{ display: 'flex', gap: 6 }}><button onClick={() => setModal({ mode: 'edit', data: m })} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid ' + BORD, background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'Manrope,sans-serif' }}>✏️</button><button onClick={() => setConfirm({ msg: `Excluir "${m.name}"?`, onOk: () => del(m.id) })} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #fca5a5', background: '#fef2f2', cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'Manrope,sans-serif' }}>🗑️</button></div></TD>
        </tr>)}</tbody>
      </table>
    </div>
    {modal && <EntityModal type="team" mode={modal.mode} data={modal.data} onSave={save} onClose={() => setModal(null)} />}
    {confirm && <Confirm msg={confirm.msg} onOk={confirm.onOk} onCancel={() => setConfirm(null)} />}
  </div>;
}

// ═══ DASHBOARD ════════════════════════════════════════════════
const REV = [{ m: 'Out', v: 120 }, { m: 'Nov', v: 145 }, { m: 'Dez', v: 138 }, { m: 'Jan', v: 162 }, { m: 'Fev', v: 210 }, { m: 'Mar', v: 248 }, { m: 'Abr', v: 285 }];
function StatCard({ label, value, sub, color = '#1a0806' }) {
  return <div style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', border: '1px solid ' + BORD }}>
    <div style={{ fontSize: 11, fontWeight: 700, color: MUT, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
    <div style={{ fontFamily: 'Manrope,sans-serif', fontSize: 28, fontWeight: 800, color }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: sub.includes('↑') ? '#166534' : MUT, fontWeight: 600, marginTop: 4 }}>{sub}</div>}
  </div>;
}
function Dashboard({ db, tab, setTab }) {
  const ae = db.events.filter(e => e.status === 'Ativo').length;
  const avail = db.team.filter(t => t.status === 'Disponível').length;
  const apvQ = db.quotes.filter(q => q.status === 'Aprovado').reduce((s, q) => s + q.value, 0);
  const funnel = [{ stage: 'Inscritos', n: 45 }, { stage: 'Triagem', n: 32 }, { stage: 'Aprovados', n: 28 }, { stage: 'Alocados', n: 24 }];
  return <div>
    <div style={{ display: 'flex', borderBottom: '2px solid ' + BORD, marginBottom: 24 }}>
      {['Estratégico', 'Tático', 'Operacional'].map(t => <button key={t} onClick={() => setTab(t.toLowerCase())} style={{ padding: '10px 22px', fontSize: 13, fontWeight: 700, letterSpacing: '0.8px', color: tab === t.toLowerCase() ? RED : MUT, borderBottom: tab === t.toLowerCase() ? '2px solid ' + RED : '2px solid transparent', marginBottom: -2, background: 'none', border: 'none', borderBottom: tab === t.toLowerCase() ? `2px solid ${RED}` : '2px solid transparent', cursor: 'pointer', fontFamily: 'Manrope,sans-serif' }}>{t.toUpperCase()}</button>)}
    </div>
    {tab === 'estratégico' && <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 20 }}>
        <StatCard label="Receita Anual" value="R$ 3,4M" sub="↑ 22% vs ano anterior" />
        <StatCard label="Meta Anual" value="R$ 4,0M" sub="85% atingido" />
        <StatCard label="NPS Clientes" value="87" sub="↑ 5pts este trimestre" color="#166534" />
      </div>
      <div style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', border: '1px solid ' + BORD }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: MUT, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 16 }}>Receita Mensal (R$ mil)</div>
        <ResponsiveContainer width="100%" height={220}><AreaChart data={REV}><CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" /><XAxis dataKey="m" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} tickFormatter={v => v + 'k'} /><Tooltip formatter={v => ['R$ ' + v + 'k', 'Receita']} /><Area type="monotone" dataKey="v" stroke={RED} fill={RED + '22'} strokeWidth={2} /></AreaChart></ResponsiveContainer>
      </div>
    </div>}
    {tab === 'tático' && <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
        <StatCard label="Eventos Ativos" value={ae} sub={`↑ ${ae} esta semana`} />
        <StatCard label="Equipe Total" value={db.team.length} sub={`↑ ${avail} disponíveis`} />
        <StatCard label="Receita Mensal" value="R$ 285k" sub="↑ 12% vs anterior" color="#166534" />
        <StatCard label="Ocupação" value="78%" sub="Meta: 85%" color="#ea580c" />
      </div>
      <div style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', border: '1px solid ' + BORD, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: MUT, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 20 }}>Funil R&S — Recrutamento & Seleção</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0 }}>
          {funnel.map((f, i) => <div key={f.stage} style={{ borderRight: i < 3 ? '1px solid ' + BORD : 'none', padding: '0 16px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{f.stage}</div>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: i === 3 ? '#dcfce7' : '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Manrope,sans-serif', fontWeight: 800, fontSize: 18, color: i === 3 ? '#166534' : RED }}>{f.n}</div>
            <div style={{ height: 4, borderRadius: 99, background: '#e5e7eb', width: '100%', overflow: 'hidden' }}><div style={{ height: '100%', background: i === 3 ? '#16a34a' : RED, borderRadius: 99, width: Math.round(f.n / 45 * 100) + '%' }} /></div>
          </div>)}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', border: '1px solid ' + BORD }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: MUT, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 16 }}>Receita Mensal</div>
          <ResponsiveContainer width="100%" height={160}><AreaChart data={REV}><XAxis dataKey="m" tick={{ fontSize: 11 }} /><Tooltip formatter={v => ['R$ ' + v + 'k']} /><Area type="monotone" dataKey="v" stroke={RED} fill={RED + '22'} strokeWidth={2} /></AreaChart></ResponsiveContainer>
        </div>
        <div style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', border: '1px solid ' + BORD }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: MUT, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 14 }}>Próximos Eventos</div>
          {db.events.filter(e => e.status !== 'Encerrado').slice(0, 3).map(e => <div key={e.id} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid ' + BORD }}>
            <div style={{ width: 40, height: 40, background: '#fef2f2', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Manrope,sans-serif', fontWeight: 800, fontSize: 13, color: RED, flexShrink: 0 }}>{e.date.slice(8)}<div style={{ fontSize: 9, color: MUT }}>/{e.date.slice(5, 7)}</div></div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{e.title}</div><div style={{ fontSize: 11, color: MUT }}>{e.location}</div><div style={{ height: 3, borderRadius: 99, background: '#e5e7eb', marginTop: 5, overflow: 'hidden' }}><div style={{ height: '100%', background: RED, borderRadius: 99, width: Math.round(e.filled / Math.max(1, e.total) * 100) + '%' }} /></div></div>
          </div>)}
        </div>
      </div>
    </div>}
    {tab === 'operacional' && <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 20 }}>
        <StatCard label="Escalas Hoje" value="3" sub="67 bombeiros em campo" />
        <StatCard label="Check-ins" value="61/67" sub="91% presentes" color="#166534" />
        <StatCard label="Equipamentos" value="✅" sub="Todos conferidos" color="#166534" />
      </div>
      <div style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', border: '1px solid ' + BORD }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: MUT, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 16 }}>Timeline de Escalas — Hoje</div>
        {[{ t: '08:00–20:00', n: 'Plantão Hospital Santa Joana', s: 'Em andamento', c: '#16a34a', k: 12 }, { t: '16:00–04:00', n: 'Show na Praça da Sé', s: 'Mobilização', c: '#ea580c', k: 28 }, { t: '20:00–08:00', n: 'Plantão Noturno Berrini', s: 'Aguardando', c: '#9ca3af', k: 27 }].map(i => <div key={i.n} style={{ display: 'flex', gap: 14, marginBottom: 16 }}><div style={{ width: 3, borderRadius: 2, background: i.c, flexShrink: 0, minHeight: 50 }} /><div><div style={{ fontSize: 12, color: MUT }}>{i.t}</div><div style={{ fontSize: 14, fontWeight: 600 }}>{i.n}</div><div style={{ fontSize: 12, color: i.c, fontWeight: 700 }}>● {i.s} · {i.k} bombeiros</div></div></div>)}
      </div>
    </div>}
  </div>;
}

// ═══ AI PANEL ════════════════════════════════════════════════
function AIPanel({ db, onClose }) {
  const [msgs, setMsgs] = useState([{ role: 'assistant', text: 'Olá! Sou o **Sentinel AI** da Brigada Camarão. Posso consultar dados em tempo real e ajudar com análises. O que você precisa?' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);
  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim(); setInput(''); setLoading(true);
    setMsgs(m => [...m, { role: 'user', text: userMsg }]);
    try {
      const history = msgs.filter(m => m.role !== 'assistant' || msgs.indexOf(m) > 0).map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text.replace(/\*\*/g, '') }));
      const reply = await callAI([...history, { role: 'user', content: userMsg }], db);
      setMsgs(m => [...m, { role: 'assistant', text: reply }]);
    } catch (e) { setMsgs(m => [...m, { role: 'assistant', text: '❌ Erro ao conectar à API. Verifique a key.' }]); }
    setLoading(false);
  };
  return <div style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: 380, background: '#fff', boxShadow: '-4px 0 30px rgba(0,0,0,.15)', display: 'flex', flexDirection: 'column', zIndex: 8000 }}>
    <div style={{ padding: '16px 20px', background: RED, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div><div style={{ fontFamily: 'Manrope,sans-serif', fontWeight: 800, fontSize: 16 }}>🤖 Sentinel AI</div><div style={{ fontSize: 11, opacity: .8 }}>Powered by Claude Cookbooks</div></div>
      <button onClick={onClose} style={{ background: 'rgba(255,255,255,.2)', border: 'none', color: '#fff', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
    </div>
    <div style={{ flex: 1, overflow: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {msgs.map((m, i) => <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
        <div style={{ maxWidth: '85%', padding: '10px 14px', borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px', background: m.role === 'user' ? RED : '#f5f0ee', color: m.role === 'user' ? '#fff' : '#1a0806', fontSize: 13, lineHeight: 1.6 }}>{m.text}</div>
      </div>)}
      {loading && <div style={{ display: 'flex', gap: 6, padding: '10px 14px', background: '#f5f0ee', borderRadius: '14px 14px 14px 4px', width: 'fit-content' }}>{[0, 1, 2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: RED, opacity: 0.6, animation: `bounce ${0.6 + i * 0.15}s infinite alternate` }} />)}</div>}
      <div ref={bottomRef} />
    </div>
    <div style={{ padding: '12px 16px', borderTop: '1px solid ' + BORD, display: 'flex', gap: 8 }}>
      <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Pergunte algo sobre a brigada..." style={{ ...IS, flex: 1 }} />
      <button onClick={send} disabled={loading} style={{ padding: '10px 16px', borderRadius: 10, background: RED, color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontFamily: 'Manrope,sans-serif', fontSize: 13 }}>→</button>
    </div>
    <div style={{ padding: '0 16px 12px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {['Quantos bombeiros disponíveis?', 'Analise as receitas', 'Próximos eventos ativos'].map(q => <button key={q} onClick={() => { setInput(q); }} style={{ fontSize: 11, padding: '5px 10px', borderRadius: 20, border: '1px solid ' + BORD, background: '#faf7f6', cursor: 'pointer', fontFamily: 'Inter,sans-serif', color: MUT }}>{q}</button>)}
    </div>
  </div>;
}

// ═══ ADMIN LAYOUT ════════════════════════════════════════════
const MENU = [
  { id: 'dashboard', icon: '📊', label: 'Painel' },
  { id: 'events', icon: '📅', label: 'Eventos' },
  { id: 'vacancies', icon: '💼', label: 'Vagas' },
  { id: 'quotes', icon: '💰', label: 'Orçamentos' },
  { id: 'team', icon: '👥', label: 'Equipe' },
];
function AdminLayout({ db, onUpdate, onLogout, user }) {
  const [sec, setSec] = useState('dashboard');
  const [tab, setTab] = useState('tático');
  const [aiOpen, setAiOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'ok') => setToast({ msg, type });
  const secTitles = { dashboard: 'Painel Sentinel Command', events: 'Gerenciar Eventos', vacancies: 'Gerenciar Vagas', quotes: 'Gerenciar Orçamentos', team: 'Gerenciar Equipe' };
  return <div style={{ display: 'flex', minHeight: '100vh', background: BG }}>
    {/* Sidebar */}
    <div style={{ width: 220, background: '#150505', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: RED, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>🔥</div>
          <div><div style={{ color: '#fff', fontSize: 12, fontWeight: 800, fontFamily: 'Manrope,sans-serif' }}>Brigada Camarão</div><div style={{ color: '#9ca3af', fontSize: 10 }}>Sentinel Command</div></div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: '10px 0' }}>
        {MENU.map(m => <div key={m.id} onClick={() => setSec(m.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px', color: sec === m.id ? '#fff' : '#d1c5c4', fontSize: 14, fontWeight: 600, cursor: 'pointer', borderRadius: 10, margin: '2px 8px', background: sec === m.id ? RED : 'transparent', fontFamily: 'Manrope,sans-serif', transition: 'all .15s' }}>{m.icon} {m.label}</div>)}
        <div onClick={() => setAiOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px', color: aiOpen ? '#fff' : '#d1c5c4', fontSize: 14, fontWeight: 600, cursor: 'pointer', borderRadius: 10, margin: '2px 8px', background: aiOpen ? '#4f46e5' : 'transparent', fontFamily: 'Manrope,sans-serif' }}>🤖 Sentinel AI</div>
      </nav>
      <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}><Av name={user?.name || 'Admin'} size={34} /><div><div style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>{user?.name || 'Admin'}</div><div style={{ color: '#9ca3af', fontSize: 10 }}>ADMINISTRADOR</div></div></div>
        <button onClick={onLogout} style={{ width: '100%', background: 'rgba(255,255,255,.06)', color: '#9ca3af', borderRadius: 8, padding: '9px', border: 'none', fontSize: 12, fontWeight: 700, fontFamily: 'Manrope,sans-serif', cursor: 'pointer' }}>→ Sair</button>
      </div>
    </div>
    {/* Main */}
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', marginRight: aiOpen ? 380 : 0, transition: 'margin .3s' }}>
      <div style={{ padding: '20px 28px', background: '#fff', borderBottom: '1px solid ' + BORD, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'Manrope,sans-serif', fontWeight: 800, fontSize: 26, color: '#1a0806' }}>Boa noite, {(user?.name || 'Admin').split(' ')[0]} 👋</h1>
          <div style={{ fontSize: 13, color: MUT, marginTop: 4, display: 'flex', alignItems: 'center', gap: 10 }}><span>{secTitles[sec]}</span><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a', display: 'inline-block', animation: 'pulse 2s infinite' }} />Status Online</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => exportCSV('events', db)} style={{ padding: '9px 16px', borderRadius: 10, border: '1px solid ' + BORD, background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'Manrope,sans-serif', color: '#374151' }}>📥 Backup Sheets</button>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px' }}>
        {sec === 'dashboard' && <Dashboard db={db} tab={tab} setTab={setTab} />}
        {sec === 'events' && <EventsAdmin db={db} onUpdate={onUpdate} toast={showToast} />}
        {sec === 'vacancies' && <VacanciesAdmin db={db} onUpdate={onUpdate} toast={showToast} />}
        {sec === 'quotes' && <QuotesAdmin db={db} onUpdate={onUpdate} toast={showToast} />}
        {sec === 'team' && <TeamAdmin db={db} onUpdate={onUpdate} toast={showToast} />}
      </div>
    </div>
    {aiOpen && <AIPanel db={db} onClose={() => setAiOpen(false)} />}
    {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}} @keyframes bounce{from{transform:translateY(0)}to{transform:translateY(-6px)}}`}</style>
  </div>;
}

// ═══ EMPLOYEE SCREENS ════════════════════════════════════════
function LoginScreen({ onLogin, onAdmin }) {
  const [form, setForm] = useState({ nome: '', cpf: '', pix: '', cred: '' });
  return <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '0 0 80px' }}>
    <div style={{ width: '100%', maxWidth: 420, padding: '40px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div style={{ width: 90, height: 90, borderRadius: '50%', background: RED, margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>🔥</div>
        <h1 style={{ fontFamily: 'Manrope,sans-serif', fontSize: 30, fontWeight: 800, color: RED, textTransform: 'uppercase', letterSpacing: -0.5, lineHeight: 1.1 }}>BEM-VINDO À<br />BRIGADA CAMARÃO</h1>
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '2.5px', color: MUT, marginTop: 8, textTransform: 'uppercase' }}>Recrutamento de Bombeiro Civil</p>
        <p style={{ fontSize: 14, color: MUT, marginTop: 10 }}>Informe seus dados para prosseguir com a inscrição.</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[['Nome Completo', 'nome', 'Como no seu RG/CNH', 'text'], ['CPF', 'cpf', '000.000.000-00', 'text'], ['Chave PIX', 'pix', 'E-mail, CPF ou Celular', 'text'], ['Nº Credencial', 'cred', 'Ex: BC-12345', 'text']].map(([l, k, p, t]) => <div key={k}><label style={LS}>{l}</label><input style={IS} type={t} placeholder={p} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} /></div>)}
        <div style={{ background: '#fef7ed', borderLeft: '3px solid #f59e0b', borderRadius: '0 8px 8px 0', padding: '14px', display: 'flex', gap: 10 }}>
          <span>ℹ️</span>
          <div><strong style={{ fontSize: 12, color: '#92400e' }}>POR QUE PEDIMOS ISSO?</strong><p style={{ fontSize: 13, color: '#78350f', marginTop: 4 }}>O <strong>CPF</strong> é necessário para o seguro durante os eventos, e a <strong>Chave PIX</strong> garante o recebimento ágil de suas diárias.</p></div>
        </div>
        <button onClick={() => onLogin(form)} style={{ background: RED, color: '#fff', borderRadius: 14, padding: '16px 24px', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'Manrope,sans-serif', letterSpacing: '0.8px' }}>CADASTRAR / ENTRAR →</button>
        <p style={{ textAlign: 'center', fontSize: 11, color: MUT }}>AO PROSSEGUIR, VOCÊ ACEITA NOSSOS <a href="#" style={{ color: RED, fontWeight: 700, textDecoration: 'none' }}>TERMOS DE ATUAÇÃO</a></p>
        <button onClick={onAdmin} style={{ background: 'none', border: '1px solid ' + BORD, color: MUT, borderRadius: 10, padding: '11px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Manrope,sans-serif' }}>🛡️ Acesso Admin / Gestor</button>
      </div>
    </div>
  </div>;
}

function EventsScreen({ db, user, onSelect, onProfile }) {
  const avail = db.events.filter(e => e.status !== 'Encerrado');
  const closed = db.events.filter(e => e.status === 'Encerrado');
  const TypeColors = { Hospitalar: 'linear-gradient(135deg,#1e3a5f,#1a5276)', 'Evento Especial': 'linear-gradient(135deg,#065f46,#0d9488)', Corporativo: 'linear-gradient(135deg,#374151,#6b7280)', Industrial: 'linear-gradient(135deg,#78350f,#d97706)' };
  return <div style={{ background: BG, minHeight: '100vh', maxWidth: 480, margin: 'auto', display: 'flex', flexDirection: 'column' }}>
    <div style={{ background: '#fff', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid ' + BORD, position: 'sticky', top: 0, zIndex: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: RED, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔥</div>
        <div><div style={{ fontFamily: 'Manrope,sans-serif', fontSize: 12, fontWeight: 800, color: RED }}>BRIGADA CAMARÃO</div><div style={{ fontSize: 11, color: MUT }}>Escalas Ativas</div></div>
      </div>
      <Av name={user?.nome || 'Usuário'} size={34} />
    </div>
    <div style={{ flex: 1, overflow: 'auto', padding: '20px 16px 80px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ fontFamily: 'Manrope,sans-serif', fontSize: 18, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 3, height: 20, background: RED, borderRadius: 2, display: 'inline-block' }} />Escalas Disponíveis</h2>
      {avail.map(ev => <div key={ev.id} onClick={() => onSelect(ev)} style={{ background: '#fff', borderRadius: 18, border: '1px solid ' + BORD, overflow: 'hidden', cursor: 'pointer' }}>
        <div style={{ background: TypeColors[ev.type] || TypeColors.Hospitalar, height: 140, position: 'relative', display: 'flex', alignItems: 'flex-end', padding: '14px' }}>
          <span style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(255,255,255,.9)', color: '#374151', fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20 }}>{ev.type}</span>
          <span style={{ fontFamily: 'Manrope,sans-serif', color: '#fff', fontSize: 17, fontWeight: 800, textShadow: '0 1px 4px rgba(0,0,0,.5)', lineHeight: 1.2 }}>{ev.title}</span>
        </div>
        <div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: MUT }}><span style={{ color: RED }}>📅</span>{dt(ev.date)}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: MUT }}><span style={{ color: RED }}>🕐</span>{ev.time}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: MUT }}><span style={{ color: RED }}>📍</span>{ev.location}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div><div style={{ fontSize: 11, color: MUT, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Remuneração</div><div style={{ fontFamily: 'Manrope,sans-serif', fontSize: 22, fontWeight: 800, color: RED }}>{cur(ev.pay)}</div></div>
            <div style={{ textAlign: 'right' }}><div style={{ fontSize: 11, color: MUT, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Vagas</div><div style={{ fontFamily: 'Manrope,sans-serif', fontSize: 14, fontWeight: 800, color: ev.total - ev.filled <= 3 ? '#ea580c' : '#166534' }}>{ev.total - ev.filled} restantes</div></div>
          </div>
          <button style={{ width: '100%', background: RED, color: '#fff', borderRadius: 12, padding: '13px', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'Manrope,sans-serif', letterSpacing: '1px' }}>TENHO INTERESSE</button>
        </div>
      </div>)}
      {closed.length > 0 && <><h3 style={{ fontFamily: 'Manrope,sans-serif', fontSize: 14, fontWeight: 700, color: MUT, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Encerradas</h3>
        {closed.map(ev => <div key={ev.id} style={{ background: '#fff', borderRadius: 18, border: '1px solid ' + BORD, overflow: 'hidden', opacity: 0.5 }}>
          <div style={{ background: '#9ca3af', height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontFamily: 'Manrope,sans-serif', color: '#fff', fontSize: 13, fontWeight: 800, letterSpacing: '2px' }}>ESCALA ENCERRADA</span></div>
          <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between' }}><div><div style={{ fontSize: 13, fontWeight: 700 }}>{ev.title}</div><div style={{ fontSize: 12, color: MUT }}>{dt(ev.date)}</div></div><div style={{ fontFamily: 'Manrope,sans-serif', fontSize: 16, fontWeight: 800, color: MUT }}>{cur(ev.pay)}</div></div>
        </div>)}</>}
    </div>
    <div style={{ position: 'sticky', bottom: 0, background: '#fff', borderTop: '1px solid ' + BORD, display: 'flex', padding: '8px 0 14px' }}>
      {[['📅', 'EVENTOS', true], ['👤', 'PERFIL', false]].map(([i, l, a]) => <div key={l} onClick={l === 'PERFIL' ? onProfile : undefined} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: a ? RED : MUT, cursor: 'pointer', fontFamily: 'Manrope,sans-serif' }}><span style={{ fontSize: 20 }}>{i}</span>{l}</div>)}
    </div>
  </div>;
}

function EventDetailScreen({ ev, user, onBack }) {
  return <div style={{ background: BG, minHeight: '100vh', maxWidth: 480, margin: 'auto', display: 'flex', flexDirection: 'column' }}>
    <div style={{ background: '#fff', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid ' + BORD, position: 'sticky', top: 0 }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: RED, fontFamily: 'Manrope,sans-serif', fontWeight: 700 }}>← Voltar</button>
      <div style={{ flex: 1, textAlign: 'center', fontSize: 12, fontWeight: 700, color: MUT, letterSpacing: '0.5px' }}>MISSÃO ATIVA</div>
      <Av name={user?.nome || 'U'} size={32} />
    </div>
    <div style={{ flex: 1, overflow: 'auto', padding: '20px 16px 80px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <h1 style={{ fontFamily: 'Manrope,sans-serif', fontSize: 28, fontWeight: 800, lineHeight: 1.1 }}>Detalhes do Evento</h1>
      <div style={{ background: '#fff', borderRadius: 16, padding: '18px', border: '1px solid ' + BORD }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div><div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#166534', fontSize: 13, fontWeight: 700, marginBottom: 4 }}>✅ Inscrição Confirmada</div><div style={{ fontFamily: 'Manrope,sans-serif', fontSize: 20, fontWeight: 800 }}>{ev.title}</div></div>
          <div style={{ textAlign: 'right' }}><div style={{ fontFamily: 'Manrope,sans-serif', fontSize: 28, fontWeight: 800 }}>{ev.filled}/{ev.total}</div><div style={{ fontSize: 10, color: MUT, fontWeight: 700, letterSpacing: '0.5px' }}>PREENCHIDAS</div></div>
        </div>
        <div style={{ height: 6, borderRadius: 99, background: '#e5e7eb', overflow: 'hidden' }}><div style={{ height: '100%', borderRadius: 99, background: `linear-gradient(90deg,${RED},#e85d04)`, width: Math.round(ev.filled / Math.max(1, ev.total) * 100) + '%' }} /></div>
      </div>
      <div style={{ background: '#fff', borderRadius: 16, padding: '16px', border: '1px solid ' + BORD, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[['📅', 'Data', dt(ev.date)], ['🕐', 'Horário', ev.time], ['📍', 'Local', ev.location], ['💰', 'Remuneração', cur(ev.pay)]].map(([i, l, v]) => <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: '#f9fafb', borderRadius: 12 }}>
          <div style={{ width: 40, height: 40, background: '#fef2f2', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{i}</div>
          <div><div style={{ fontSize: 10, color: MUT, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{l}</div><div style={{ fontSize: 14, fontWeight: 700 }}>{v}</div></div>
        </div>)}
      </div>
      {ev.whatsapp && <div style={{ background: '#fff', borderRadius: 16, padding: '16px', border: '1px solid ' + BORD }}>
        <div style={{ fontSize: 10, color: MUT, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>Comunicação</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}><div style={{ width: 44, height: 44, background: '#dcfce7', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>👥</div><div style={{ fontSize: 15, fontWeight: 700 }}>Grupo de Coordenação</div></div>
        <a href={ev.whatsapp} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#25D366', color: '#fff', borderRadius: 12, padding: '14px', fontSize: 15, fontWeight: 700, textDecoration: 'none', fontFamily: 'Manrope,sans-serif' }}>📱 Entrar no Grupo do WhatsApp</a>
      </div>}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#f0fdf4', borderRadius: 12, border: '1px solid #bbf7d0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: '#166534', letterSpacing: '0.5px' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a' }} />SINCRONIZADO EM TEMPO REAL</div>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#166534' }}>ID: {ev.id.toUpperCase()}</div>
      </div>
    </div>
    <div style={{ position: 'sticky', bottom: 0, background: '#fff', borderTop: '1px solid ' + BORD, display: 'flex', padding: '8px 0 14px' }}>
      {[['📋', 'INSCRIÇÕES'], ['👤', 'PERFIL']].map(([i, l]) => <div key={l} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: l === 'INSCRIÇÕES' ? RED : MUT, cursor: 'pointer', fontFamily: 'Manrope,sans-serif' }}><span style={{ fontSize: 20 }}>{i}</span>{l}</div>)}
    </div>
  </div>;
}

function ProfileScreen({ user, db, onBack, onLogout }) {
  const totalPaid = db.events.filter(e => e.status !== 'Aberto').reduce((s, e) => s + e.pay, 0);
  return <div style={{ background: BG, minHeight: '100vh', maxWidth: 480, margin: 'auto' }}>
    <div style={{ background: RED, padding: '40px 24px 60px', textAlign: 'center' }}>
      <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,.2)', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid rgba(255,255,255,.4)', fontSize: 36 }}>🧑‍🚒</div>
      <h2 style={{ color: '#fff', fontFamily: 'Manrope,sans-serif', fontSize: 22, fontWeight: 800 }}>{user?.nome || 'Bombeiro'}</h2>
      <p style={{ color: 'rgba(255,255,255,.75)', fontSize: 13 }}>Credencial: {user?.cred || 'BC-XXXXX'}</p>
    </div>
    <div style={{ padding: '24px 16px', marginTop: -24 }}>
      <div style={{ background: '#fff', borderRadius: 18, padding: '20px', border: '1px solid ' + BORD, display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 16 }}>
        {[['CPF', user?.cpf || '–'], ['Chave PIX', user?.pix || '–'], ['Escalas Realizadas', '23'], ['Total Recebido', 'R$ 4.850,00']].map(([l, v]) => <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 14, borderBottom: '1px solid ' + BORD }}>
          <span style={{ fontSize: 13, color: MUT }}>{l}</span>
          <span style={{ fontFamily: l.includes('Total') ? 'Manrope,sans-serif' : 'inherit', fontSize: l.includes('Total') || l.includes('Escalas') ? 18 : 14, fontWeight: l.includes('Total') || l.includes('Escalas') ? 800 : 600, color: l.includes('Total') ? '#166534' : '#1a0806' }}>{v}</span>
        </div>)}
      </div>
      <button onClick={onBack} style={{ width: '100%', background: RED, color: '#fff', borderRadius: 14, padding: '14px', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'Manrope,sans-serif', marginBottom: 10 }}>← Minhas Escalas</button>
      <button onClick={onLogout} style={{ width: '100%', background: '#f3f4f6', color: MUT, borderRadius: 14, padding: '14px', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'Manrope,sans-serif' }}>Sair do App</button>
    </div>
  </div>;
}

// ═══ APP ROOT ════════════════════════════════════════════════
export default function App() {
  const [ready, setReady] = useState(false);
  const [db, setDb] = useState(SEED);
  const [view, setView] = useState('login');
  const [user, setUser] = useState(null);
  const [selEv, setSelEv] = useState(null);
  const [empView, setEmpView] = useState('events');

  // Load DB from storage on mount
  useEffect(() => {
    (async () => {
      const raw = await st.get('bc:db:v2');
      if (raw) { try { setDb(JSON.parse(raw)); } catch {} }
      setReady(true);
    })();
  }, []);

  // Save DB to storage on every change (after initial load)
  const updateDb = async (newDb) => {
    setDb(newDb);
    await st.set('bc:db:v2', JSON.stringify(newDb));
  };

  if (!ready) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: BG, flexDirection: 'column', gap: 16 }}>
    <div style={{ fontSize: 48 }}>🔥</div>
    <div style={{ fontFamily: 'Manrope,sans-serif', fontWeight: 700, color: RED }}>Carregando Sentinel Command...</div>
  </div>;

  if (view === 'admin') return <AdminLayout db={db} onUpdate={updateDb} user={user} onLogout={() => setView('login')} />;

  if (view === 'employee') {
    if (empView === 'profile') return <ProfileScreen user={user} db={db} onBack={() => setEmpView('events')} onLogout={() => setView('login')} />;
    if (empView === 'detail' && selEv) return <EventDetailScreen ev={selEv} user={user} onBack={() => setEmpView('events')} />;
    return <EventsScreen db={db} user={user} onSelect={ev => { setSelEv(ev); setEmpView('detail'); }} onProfile={() => setEmpView('profile')} />;
  }

  return <LoginScreen
    onLogin={form => { setUser(form); setEmpView('events'); setView('employee'); }}
    onAdmin={() => { setUser({ nome: 'Lucas Morais', role: 'admin' }); setView('admin'); }}
  />;
}
