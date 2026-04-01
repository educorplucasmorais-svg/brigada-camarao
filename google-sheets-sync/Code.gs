/**
 * ═══════════════════════════════════════════════════════════════════
 * BRIGADA CAMARÃO — Google Sheets Sync (Apps Script)
 * ═══════════════════════════════════════════════════════════════════
 * 
 * COMO INSTALAR:
 * 1. Abra a planilha: https://docs.google.com/spreadsheets/d/1Ab02MPDSN9-VfNj9p_HhxI32VdJuhDsZb4yOvRUSlKA/edit
 * 2. Menu: Extensões → Apps Script
 * 3. Apague todo o código existente
 * 4. Cole este arquivo INTEIRO
 * 5. Salve (Ctrl+S)
 * 6. Execute a função setup() pela primeira vez (▶ Run)
 * 7. Autorize as permissões quando solicitado
 * 
 * CONFIGURAÇÃO:
 * - Altere API_URL para o URL do seu servidor (Vercel, ngrok, etc.)
 * - Altere API_KEY para a chave definida no .env do servidor
 * ═══════════════════════════════════════════════════════════════════
 */

// ═══ CONFIGURAÇÃO ═══
var CONFIG = {
  // ⚠️ ALTERE para URL de produção quando deployar!
  API_URL: 'http://localhost:3333/api/export/all',
  API_KEY: 'brigada-sync-2026',
  
  // Cores Brigada Camarão (MD3)
  COLORS: {
    PRIMARY: '#ba100a',
    ON_PRIMARY: '#ffffff',
    PRIMARY_CONTAINER: '#ffdad5',
    SURFACE: '#fffbff',
    SURFACE_CONTAINER: '#f8ebe9',
    ON_SURFACE: '#201a19',
    ON_SURFACE_VARIANT: '#534341',
    OUTLINE: '#857371',
    SUCCESS: '#2e7d32',
    WARNING: '#f57c00',
    ERROR: '#ba1a1a',
  },

  // Tabelas → Abas
  TABLES: {
    users:         { sheetName: '👤 Usuários',       icon: '👤' },
    events:        { sheetName: '🔥 Eventos',         icon: '🔥' },
    vacancies:     { sheetName: '📋 Vagas',            icon: '📋' },
    quotes:        { sheetName: '💰 Orçamentos',      icon: '💰' },
    quoteItems:    { sheetName: '📝 Itens Orçamento', icon: '📝' },
    teamMembers:   { sheetName: '🧑‍🚒 Equipe',         icon: '🧑‍🚒' },
    registrations: { sheetName: '✅ Inscrições',      icon: '✅' },
    auditLogs:     { sheetName: '📊 Audit Log',       icon: '📊' },
  },
};

// ═══ MENU ═══

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🦐 Brigada Camarão')
    .addItem('🔄 Sincronizar Agora', 'syncAll')
    .addItem('📊 Atualizar Dashboard', 'updateDashboard')
    .addSeparator()
    .addItem('🏗️ Criar/Recriar Abas', 'createAllSheets')
    .addItem('🎨 Aplicar Formatação', 'formatAllSheets')
    .addSeparator()
    .addItem('⏰ Ativar Sync Automático (6h)', 'enableAutoSync')
    .addItem('⛔ Desativar Sync Automático', 'disableAutoSync')
    .addSeparator()
    .addItem('ℹ️ Sobre', 'showAbout')
    .addToUi();
}

// ═══ SETUP INICIAL ═══

function setup() {
  createAllSheets();
  createDashboardSheet();
  enableAutoSync();
  SpreadsheetApp.getUi().alert(
    '✅ Setup Completo!\n\n' +
    '• Abas criadas para todas as 8 tabelas\n' +
    '• Dashboard com KPIs configurado\n' +
    '• Sync automático ativado (a cada 6h)\n\n' +
    'Use o menu "🦐 Brigada Camarão" → "Sincronizar Agora".'
  );
}

// ═══ SYNC PRINCIPAL ═══

function syncAll() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var logSheet = getOrCreateSheet(ss, '📋 Sync Log');
  logSync(logSheet, '🔄 Iniciando sincronização...');
  
  try {
    var response = UrlFetchApp.fetch(CONFIG.API_URL, {
      method: 'get',
      headers: { 'x-api-key': CONFIG.API_KEY, 'Content-Type': 'application/json' },
      muteHttpExceptions: true,
    });
    
    if (response.getResponseCode() !== 200) {
      logSync(logSheet, '❌ HTTP ' + response.getResponseCode() + ': ' + response.getContentText().substring(0, 200));
      SpreadsheetApp.getUi().alert('❌ Erro: HTTP ' + response.getResponseCode());
      return;
    }
    
    var data = JSON.parse(response.getContentText());
    var tables = data.tables;
    var totalRows = 0;
    
    var tableNames = Object.keys(CONFIG.TABLES);
    for (var t = 0; t < tableNames.length; t++) {
      var tableName = tableNames[t];
      var tableConfig = CONFIG.TABLES[tableName];
      var rows = tables[tableName];
      if (rows && rows.length > 0) {
        writeTableToSheet(ss, tableConfig.sheetName, rows);
        totalRows += rows.length;
        logSync(logSheet, '✅ ' + tableConfig.sheetName + ': ' + rows.length + ' registros');
      } else {
        logSync(logSheet, '⚠️ ' + tableConfig.sheetName + ': sem dados');
      }
    }
    
    updateDashboardData(ss, data);
    logSync(logSheet, '🎉 Sync completo! ' + totalRows + ' registros em ' + tableNames.length + ' tabelas');
    ss.toast('✅ Sincronizado! ' + totalRows + ' registros.', '🦐 Brigada Camarão', 5);
    
  } catch (error) {
    logSync(logSheet, '❌ Erro: ' + error.message);
    SpreadsheetApp.getUi().alert('❌ Erro:\n' + error.message + '\n\nVerifique se o servidor está rodando.');
  }
}

// ═══ ESCREVER DADOS NA ABA ═══

function writeTableToSheet(ss, sheetName, data) {
  if (!data || data.length === 0) return;
  var sheet = getOrCreateSheet(ss, sheetName);
  sheet.clear();
  
  var headers = Object.keys(data[0]);
  var headerRow = [];
  for (var h = 0; h < headers.length; h++) {
    headerRow.push(formatHeaderName(headers[h]));
  }
  sheet.getRange(1, 1, 1, headers.length).setValues([headerRow]);
  
  var rows = [];
  for (var i = 0; i < data.length; i++) {
    var row = [];
    for (var j = 0; j < headers.length; j++) {
      var val = data[i][headers[j]];
      if (val === null || val === undefined) val = '';
      else if (typeof val === 'object') val = JSON.stringify(val);
      row.push(val);
    }
    rows.push(row);
  }
  
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }
  
  // Formatar header
  sheet.getRange(1, 1, 1, headers.length)
    .setBackground(CONFIG.COLORS.PRIMARY)
    .setFontColor(CONFIG.COLORS.ON_PRIMARY)
    .setFontWeight('bold')
    .setFontSize(10)
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');
  
  // Zebra striping
  for (var z = 0; z < rows.length; z++) {
    if (z % 2 === 0) {
      sheet.getRange(z + 2, 1, 1, headers.length).setBackground(CONFIG.COLORS.SURFACE_CONTAINER);
    }
  }
  
  // Auto-resize + freeze header
  for (var c = 1; c <= headers.length; c++) { sheet.autoResizeColumn(c); }
  sheet.setFrozenRows(1);
  
  // Filtros
  if (rows.length > 0 && !sheet.getFilter()) {
    sheet.getRange(1, 1, rows.length + 1, headers.length).createFilter();
  }
}

// ═══ DASHBOARD ═══

function createDashboardSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateSheet(ss, '🏠 Dashboard');
  ss.setActiveSheet(sheet);
  ss.moveActiveSheet(1);
  sheet.clear();
  
  // Header
  sheet.getRange('A1:H1').merge()
    .setValue('🦐 BRIGADA CAMARÃO — DASHBOARD DE BACKUP')
    .setBackground(CONFIG.COLORS.PRIMARY)
    .setFontColor(CONFIG.COLORS.ON_PRIMARY)
    .setFontWeight('bold').setFontSize(16)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeight(1, 50);
  
  sheet.getRange('A2:H2').merge()
    .setValue('Backup automático do banco de dados — Sincronizado via Google Apps Script')
    .setBackground(CONFIG.COLORS.PRIMARY_CONTAINER)
    .setFontColor(CONFIG.COLORS.ON_SURFACE).setFontSize(10)
    .setHorizontalAlignment('center');
  
  // Linha 3 vazia
  sheet.getRange('A3:H3').merge().setValue('');
  
  // KPI Row 1
  var kpiLabels1 = ['Usuários', 'Eventos', 'Vagas', 'Equipe'];
  for (var k = 0; k < 4; k++) {
    var col = k * 2 + 1;
    sheet.getRange(4, col, 1, 2).merge()
      .setValue(kpiLabels1[k])
      .setBackground(CONFIG.COLORS.SURFACE_CONTAINER)
      .setFontColor(CONFIG.COLORS.ON_SURFACE_VARIANT)
      .setFontSize(10).setFontWeight('bold')
      .setHorizontalAlignment('center');
    sheet.getRange(5, col, 1, 2).merge()
      .setValue('—')
      .setFontSize(28).setFontWeight('bold')
      .setFontColor(CONFIG.COLORS.PRIMARY)
      .setHorizontalAlignment('center');
    sheet.setRowHeight(5, 50);
  }
  
  // KPI Row 2
  var kpiLabels2 = ['Orçamentos', 'Inscrições', 'Logs Audit', 'Última Sync'];
  for (var k2 = 0; k2 < 4; k2++) {
    var col2 = k2 * 2 + 1;
    sheet.getRange(7, col2, 1, 2).merge()
      .setValue(kpiLabels2[k2])
      .setBackground(CONFIG.COLORS.SURFACE_CONTAINER)
      .setFontColor(CONFIG.COLORS.ON_SURFACE_VARIANT)
      .setFontSize(10).setFontWeight('bold')
      .setHorizontalAlignment('center');
    sheet.getRange(8, col2, 1, 2).merge()
      .setValue('—')
      .setFontSize(28).setFontWeight('bold')
      .setFontColor(CONFIG.COLORS.PRIMARY)
      .setHorizontalAlignment('center');
    sheet.setRowHeight(8, 50);
  }
  
  // Navegação
  sheet.getRange(10, 1, 1, 8).merge()
    .setValue('📑 NAVEGAÇÃO RÁPIDA — Abas do Banco de Dados')
    .setBackground(CONFIG.COLORS.PRIMARY)
    .setFontColor(CONFIG.COLORS.ON_PRIMARY)
    .setFontWeight('bold').setFontSize(12)
    .setHorizontalAlignment('center');
  
  var tableNames = Object.keys(CONFIG.TABLES);
  for (var n = 0; n < tableNames.length; n++) {
    var tc = CONFIG.TABLES[tableNames[n]];
    var row = 11 + n;
    sheet.getRange(row, 1, 1, 4).merge()
      .setValue(tc.icon + ' ' + tc.sheetName)
      .setFontSize(11).setFontColor(CONFIG.COLORS.PRIMARY);
    sheet.getRange(row, 5, 1, 4).merge()
      .setValue('Clique na aba abaixo para ver os dados')
      .setFontColor(CONFIG.COLORS.OUTLINE).setFontSize(9);
  }
  
  // Instruções
  var instrRow = 11 + tableNames.length + 1;
  sheet.getRange(instrRow, 1, 1, 8).merge()
    .setValue('⚙️ INSTRUÇÕES')
    .setBackground(CONFIG.COLORS.PRIMARY_CONTAINER)
    .setFontWeight('bold').setFontSize(12)
    .setHorizontalAlignment('center');
  
  var instructions = [
    '• Menu "🦐 Brigada Camarão" → "Sincronizar Agora" para atualizar dados',
    '• Sync automático roda a cada 6 horas',
    '• NÃO edite dados nas abas — serão sobrescritos na próxima sync',
    '• Para alterar dados, use o admin: http://localhost:5173/admin',
    '• Senhas NUNCA são exportadas (LGPD)',
    '• Cada aba tem filtros — use para pesquisar rapidamente',
  ];
  for (var ins = 0; ins < instructions.length; ins++) {
    sheet.getRange(instrRow + 1 + ins, 1, 1, 8).merge()
      .setValue(instructions[ins])
      .setFontSize(10).setFontColor(CONFIG.COLORS.ON_SURFACE_VARIANT);
  }
  
  for (var w = 1; w <= 8; w++) { sheet.setColumnWidth(w, 130); }
}

function updateDashboard() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dashboard = ss.getSheetByName('🏠 Dashboard');
  if (!dashboard) return;
  
  var tableNames = Object.keys(CONFIG.TABLES);
  var counts = {};
  for (var i = 0; i < tableNames.length; i++) {
    var s = ss.getSheetByName(CONFIG.TABLES[tableNames[i]].sheetName);
    counts[tableNames[i]] = s ? Math.max(0, s.getLastRow() - 1) : 0;
  }
  
  // KPI Row 1
  dashboard.getRange(5, 1, 1, 2).merge().setValue(counts.users || 0)
    .setFontSize(28).setFontWeight('bold').setFontColor(CONFIG.COLORS.PRIMARY).setHorizontalAlignment('center');
  dashboard.getRange(5, 3, 1, 2).merge().setValue(counts.events || 0)
    .setFontSize(28).setFontWeight('bold').setFontColor(CONFIG.COLORS.PRIMARY).setHorizontalAlignment('center');
  dashboard.getRange(5, 5, 1, 2).merge().setValue(counts.vacancies || 0)
    .setFontSize(28).setFontWeight('bold').setFontColor(CONFIG.COLORS.PRIMARY).setHorizontalAlignment('center');
  dashboard.getRange(5, 7, 1, 2).merge().setValue(counts.teamMembers || 0)
    .setFontSize(28).setFontWeight('bold').setFontColor(CONFIG.COLORS.PRIMARY).setHorizontalAlignment('center');
  
  // KPI Row 2
  dashboard.getRange(8, 1, 1, 2).merge().setValue(counts.quotes || 0)
    .setFontSize(28).setFontWeight('bold').setFontColor(CONFIG.COLORS.PRIMARY).setHorizontalAlignment('center');
  dashboard.getRange(8, 3, 1, 2).merge().setValue(counts.registrations || 0)
    .setFontSize(28).setFontWeight('bold').setFontColor(CONFIG.COLORS.PRIMARY).setHorizontalAlignment('center');
  dashboard.getRange(8, 5, 1, 2).merge().setValue(counts.auditLogs || 0)
    .setFontSize(28).setFontWeight('bold').setFontColor(CONFIG.COLORS.PRIMARY).setHorizontalAlignment('center');
  dashboard.getRange(8, 7, 1, 2).merge()
    .setValue(Utilities.formatDate(new Date(), 'America/Sao_Paulo', 'dd/MM/yyyy HH:mm'))
    .setFontSize(14).setFontWeight('bold').setFontColor(CONFIG.COLORS.SUCCESS).setHorizontalAlignment('center');
  
  ss.toast('📊 Dashboard atualizado!', '🦐 Brigada Camarão', 3);
}

function updateDashboardData(ss, data) {
  var dashboard = ss.getSheetByName('🏠 Dashboard');
  if (!dashboard) return;
  var t = data.tables;
  
  dashboard.getRange(5, 1, 1, 2).merge().setValue(t.users ? t.users.length : 0)
    .setFontSize(28).setFontWeight('bold').setFontColor(CONFIG.COLORS.PRIMARY).setHorizontalAlignment('center');
  dashboard.getRange(5, 3, 1, 2).merge().setValue(t.events ? t.events.length : 0)
    .setFontSize(28).setFontWeight('bold').setFontColor(CONFIG.COLORS.PRIMARY).setHorizontalAlignment('center');
  dashboard.getRange(5, 5, 1, 2).merge().setValue(t.vacancies ? t.vacancies.length : 0)
    .setFontSize(28).setFontWeight('bold').setFontColor(CONFIG.COLORS.PRIMARY).setHorizontalAlignment('center');
  dashboard.getRange(5, 7, 1, 2).merge().setValue(t.teamMembers ? t.teamMembers.length : 0)
    .setFontSize(28).setFontWeight('bold').setFontColor(CONFIG.COLORS.PRIMARY).setHorizontalAlignment('center');
  
  dashboard.getRange(8, 1, 1, 2).merge().setValue(t.quotes ? t.quotes.length : 0)
    .setFontSize(28).setFontWeight('bold').setFontColor(CONFIG.COLORS.PRIMARY).setHorizontalAlignment('center');
  dashboard.getRange(8, 3, 1, 2).merge().setValue(t.registrations ? t.registrations.length : 0)
    .setFontSize(28).setFontWeight('bold').setFontColor(CONFIG.COLORS.PRIMARY).setHorizontalAlignment('center');
  dashboard.getRange(8, 5, 1, 2).merge().setValue(t.auditLogs ? t.auditLogs.length : 0)
    .setFontSize(28).setFontWeight('bold').setFontColor(CONFIG.COLORS.PRIMARY).setHorizontalAlignment('center');
  dashboard.getRange(8, 7, 1, 2).merge()
    .setValue(Utilities.formatDate(new Date(), 'America/Sao_Paulo', 'dd/MM/yyyy HH:mm'))
    .setFontSize(14).setFontWeight('bold').setFontColor(CONFIG.COLORS.SUCCESS).setHorizontalAlignment('center');
}

// ═══ CRIAR ABAS ═══

function createAllSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  createDashboardSheet();
  
  var tableNames = Object.keys(CONFIG.TABLES);
  for (var i = 0; i < tableNames.length; i++) {
    var tc = CONFIG.TABLES[tableNames[i]];
    var sheet = getOrCreateSheet(ss, tc.sheetName);
    sheet.getRange('A1').setValue('Aguardando sincronização...')
      .setFontColor(CONFIG.COLORS.OUTLINE).setFontStyle('italic');
  }
  
  // Sync Log
  var logSheet = getOrCreateSheet(ss, '📋 Sync Log');
  logSheet.getRange('A1').setValue('Timestamp').setBackground(CONFIG.COLORS.PRIMARY)
    .setFontColor(CONFIG.COLORS.ON_PRIMARY).setFontWeight('bold');
  logSheet.getRange('B1').setValue('Mensagem').setBackground(CONFIG.COLORS.PRIMARY)
    .setFontColor(CONFIG.COLORS.ON_PRIMARY).setFontWeight('bold');
  logSheet.setColumnWidth(1, 180);
  logSheet.setColumnWidth(2, 500);
  logSheet.setFrozenRows(1);
  logSync(logSheet, '🏗️ Abas criadas');
}

// ═══ FORMATAÇÃO GLOBAL ═══

function formatAllSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var tableNames = Object.keys(CONFIG.TABLES);
  
  for (var i = 0; i < tableNames.length; i++) {
    var tc = CONFIG.TABLES[tableNames[i]];
    var sheet = ss.getSheetByName(tc.sheetName);
    if (!sheet || sheet.getLastRow() < 2) continue;
    
    var lastCol = sheet.getLastColumn();
    var lastRow = sheet.getLastRow();
    
    sheet.getRange(1, 1, 1, lastCol)
      .setBackground(CONFIG.COLORS.PRIMARY)
      .setFontColor(CONFIG.COLORS.ON_PRIMARY)
      .setFontWeight('bold').setFontSize(10)
      .setHorizontalAlignment('center');
    
    for (var r = 2; r <= lastRow; r++) {
      sheet.getRange(r, 1, 1, lastCol).setBackground(
        r % 2 === 0 ? CONFIG.COLORS.SURFACE_CONTAINER : CONFIG.COLORS.SURFACE
      );
    }
    
    for (var c = 1; c <= lastCol; c++) { sheet.autoResizeColumn(c); }
  }
  
  ss.toast('✅ Formatação aplicada!', '🦐 Brigada Camarão', 3);
}

// ═══ AUTO-SYNC TRIGGERS ═══

function enableAutoSync() {
  disableAutoSync();
  ScriptApp.newTrigger('syncAll').timeBased().everyHours(6).create();
  ScriptApp.newTrigger('onOpen').forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet()).onOpen().create();
  SpreadsheetApp.getActiveSpreadsheet().toast('⏰ Sync automático: a cada 6h', '🦐 Brigada Camarão', 5);
}

function disableAutoSync() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'syncAll') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
}

// ═══ UTILITÁRIOS ═══

function getOrCreateSheet(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  return sheet;
}

function formatHeaderName(camelCase) {
  return camelCase
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, function(s) { return s.toUpperCase(); })
    .replace(/Id$/, 'ID')
    .replace(/^Id$/, 'ID')
    .trim();
}

function logSync(sheet, message) {
  var ts = Utilities.formatDate(new Date(), 'America/Sao_Paulo', 'dd/MM/yyyy HH:mm:ss');
  sheet.appendRow([ts, message]);
}

function showAbout() {
  SpreadsheetApp.getUi().alert(
    '🦐 Brigada Camarão — Google Sheets Sync v1.0\n\n' +
    'Tabelas: Users, Events, Vacancies, Quotes, QuoteItems,\n' +
    'TeamMembers, Registrations, AuditLog\n\n' +
    'Sync: a cada 6h ou manual via menu\n' +
    '© 2026 Brigada Camarão — Sentinel Command'
  );
}
