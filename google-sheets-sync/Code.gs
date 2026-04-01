/**
 * 🦐 Brigada Camarão — Google Sheets Sync
 * ==========================================
 * Padrão Claude Cookbooks: Tool Use + Agentic Loop
 *
 * Instalação:
 *  1. Abra a planilha:
 *     https://docs.google.com/spreadsheets/d/1Ab02MPDSN9-VfNj9p_HhxI32VdJuhDsZb4yOvRUSlKA/edit
 *  2. Extensões → Apps Script → Cole este código
 *  3. Execute setup() e autorize
 *  4. O sync roda automaticamente a cada 6h
 *
 * Endpoints consumidos: GET /api/export/all  (x-api-key: brigada-sync-2026)
 */

const API_BASE = 'https://brigada-camarao.vercel.app/api'; // Troque pela URL do seu backend (Railway/Render)
const API_KEY  = 'brigada-sync-2026';
const SS_ID    = '1Ab02MPDSN9-VfNj9p_HhxI32VdJuhDsZb4yOvRUSlKA';

// ── Tabela de configuração das abas ─────────────────────────
const SHEETS = {
  events: {
    tab: '📅 Eventos',
    color: '#ba100a',
    headers: ['ID', 'Título', 'Tipo', 'Data', 'Horário', 'Local', 'R$/dia', 'Total Vagas', 'Preenchidas', 'Status', 'WhatsApp', 'Sync em'],
    row: e => [e.id, e.title, e.type, e.date ? new Date(e.date).toLocaleDateString('pt-BR') : '', e.time || '', e.location || '', e.pay || 0, e.total || 0, e.filled || 0, e.status, e.whatsapp || '', new Date().toLocaleString('pt-BR')]
  },
  vacancies: {
    tab: '💼 Vagas',
    color: '#1d4ed8',
    headers: ['ID', 'Título', 'Tipo', 'R$/dia', 'Nº Vagas', 'Requisitos', 'Status', 'Sync em'],
    row: v => [v.id, v.title, v.type, v.pay || 0, v.slots || 0, v.req || '', v.status, new Date().toLocaleString('pt-BR')]
  },
  quotes: {
    tab: '💰 Orçamentos',
    color: '#166534',
    headers: ['ID', 'Cliente', 'Tipo', 'Valor Total', 'Status', 'Válido Até', 'Contato', 'Sync em'],
    row: q => [q.id, q.client, q.type, q.totalValue || q.value || 0, q.status, q.validUntil ? new Date(q.validUntil).toLocaleDateString('pt-BR') : '', q.contact || '', new Date().toLocaleString('pt-BR')]
  },
  team: {
    tab: '👥 Equipe',
    color: '#78350f',
    headers: ['ID', 'Nome', 'Função', 'Credencial', 'Chave PIX', 'Status', 'Nº Escalas', 'Sync em'],
    // LGPD: CPF NÃO é exportado para o Sheets
    row: m => [m.id, m.name, m.role, m.cred, m.pix || '', m.status, m.eventsCount || m.events || 0, new Date().toLocaleString('pt-BR')]
  }
};

// ── Ponto de entrada principal ────────────────────────────────
function syncAll() {
  Logger.log('🔄 Iniciando sync Brigada Camarão → Google Sheets...');
  try {
    const resp = UrlFetchApp.fetch(API_BASE + '/export/all', {
      method: 'GET',
      headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json' },
      muteHttpExceptions: true
    });
    if (resp.getResponseCode() !== 200) {
      Logger.log('❌ Erro API: ' + resp.getContentText());
      syncFallbackFromStorage();
      return;
    }
    const data = JSON.parse(resp.getContentText());
    const ss = SpreadsheetApp.openById(SS_ID);
    Object.entries(SHEETS).forEach(([key, cfg]) => {
      if (data[key]?.length >= 0) writeSheet(ss, cfg, data[key]);
    });
    writeSummarySheet(ss, data);
    Logger.log('✅ Sync concluído em ' + new Date().toLocaleString('pt-BR'));
    // Salva cópia local no Properties (fallback)
    PropertiesService.getScriptProperties().setProperty('lastSync', JSON.stringify({ ts: new Date().toISOString(), counts: { events: data.events?.length, vacancies: data.vacancies?.length, quotes: data.quotes?.length, team: data.team?.length } }));
  } catch (e) {
    Logger.log('❌ Erro sync: ' + e.message);
  }
}

// ── Escreve uma aba ───────────────────────────────────────────
function writeSheet(ss, cfg, rows) {
  let sheet = ss.getSheetByName(cfg.tab);
  if (!sheet) {
    sheet = ss.insertSheet(cfg.tab);
    sheet.setTabColor(cfg.color);
  }
  sheet.clearContents();

  // Header row
  const headerRange = sheet.getRange(1, 1, 1, cfg.headers.length);
  headerRange.setValues([cfg.headers]);
  headerRange.setBackground(cfg.color);
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setFontFamily('Manrope');
  headerRange.setFontSize(10);

  // Data rows
  if (rows.length > 0) {
    const data = rows.map(cfg.row);
    sheet.getRange(2, 1, data.length, cfg.headers.length).setValues(data);
    // Zebra striping
    for (let i = 2; i <= rows.length + 1; i++) {
      sheet.getRange(i, 1, 1, cfg.headers.length).setBackground(i % 2 === 0 ? '#fff8f8' : '#ffffff');
    }
  }

  // Auto resize
  cfg.headers.forEach((_, i) => sheet.autoResizeColumn(i + 1));
  // Freeze header
  sheet.setFrozenRows(1);
  Logger.log(`  → ${cfg.tab}: ${rows.length} registros`);
}

// ── Aba de resumo executivo ───────────────────────────────────
function writeSummarySheet(ss, data) {
  let sheet = ss.getSheetByName('📊 Dashboard');
  if (!sheet) { sheet = ss.insertSheet('📊 Dashboard'); ss.moveActiveSheet(1); }
  sheet.clearContents();
  sheet.setTabColor('#ba100a');

  const now = new Date().toLocaleString('pt-BR');
  const evAtivos = (data.events || []).filter(e => e.status === 'Ativo').length;
  const disponiveis = (data.team || []).filter(m => (m.status || m.status) === 'Disponível').length;
  const receita = (data.quotes || []).filter(q => q.status === 'Aprovado').reduce((s, q) => s + (q.totalValue || q.value || 0), 0);

  const summary = [
    ['🦐 BRIGADA CAMARÃO — SENTINEL COMMAND', '', '', ''],
    ['Atualizado em:', now, '', ''],
    ['', '', '', ''],
    ['INDICADOR', 'VALOR', 'UNIDADE', 'OBSERVAÇÃO'],
    ['Total de Eventos', data.events?.length || 0, 'eventos', ''],
    ['Eventos Ativos', evAtivos, 'eventos', 'Status = Ativo'],
    ['Total Equipe', data.team?.length || 0, 'membros', ''],
    ['Disponíveis', disponiveis, 'membros', 'Prontos para escalar'],
    ['Total Vagas', data.vacancies?.length || 0, 'vagas', 'Em aberto'],
    ['Total Orçamentos', data.quotes?.length || 0, 'orçamentos', ''],
    ['Receita Aprovada', receita, 'R$', 'Soma orçamentos aprovados'],
  ];

  sheet.getRange(1, 1, summary.length, 4).setValues(summary);

  // Header styling
  const h1 = sheet.getRange(1, 1, 1, 4);
  h1.merge(); h1.setBackground('#ba100a'); h1.setFontColor('#ffffff');
  h1.setFontWeight('bold'); h1.setFontSize(14); h1.setFontFamily('Manrope');
  h1.setHorizontalAlignment('center');

  const th = sheet.getRange(4, 1, 1, 4);
  th.setBackground('#1a0806'); th.setFontColor('#ffffff'); th.setFontWeight('bold');

  // Zebra data rows
  for (let i = 5; i <= summary.length; i++) {
    sheet.getRange(i, 1, 1, 4).setBackground(i % 2 === 0 ? '#fff8f8' : '#ffffff');
  }
  [1, 2, 3, 4].forEach(c => sheet.autoResizeColumn(c));
  sheet.setFrozenRows(4);
}

// ── Fallback: usa dados salvos no Properties ──────────────────
function syncFallbackFromStorage() {
  const raw = PropertiesService.getScriptProperties().getProperty('lastSync');
  if (raw) {
    const info = JSON.parse(raw);
    Logger.log('⚠️ API indisponível. Último sync: ' + info.ts);
  } else {
    Logger.log('⚠️ Sem dados em cache. Execute syncAll() com o backend online.');
  }
}

// ── Setup inicial ─────────────────────────────────────────────
function setup() {
  // Cria trigger de sync a cada 6 horas
  ScriptApp.getProjectTriggers().forEach(t => { if (t.getHandlerFunction() === 'syncAll') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('syncAll').timeBased().everyHours(6).create();
  Logger.log('✅ Trigger criado: syncAll a cada 6 horas');
  syncAll(); // sync imediato
}

// ── Sync manual via botão na planilha ─────────────────────────
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🦐 Brigada Camarão')
    .addItem('🔄 Sync Agora', 'syncAll')
    .addItem('⚙️ Configurar Triggers', 'setup')
    .addToUi();
}
