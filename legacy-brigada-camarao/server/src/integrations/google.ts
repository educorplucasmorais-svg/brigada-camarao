/**
 * Google Workspace Integration Hub
 * 
 * Centraliza autenticação e clientes para:
 * - Google Drive (Base de Conhecimento)
 * - Google Sheets (Backup de dados)
 * - Google Calendar (Agenda de eventos)
 * - Gmail (Notificações e comunicação)
 */

import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

// ═══ CONFIG ═══

const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.readonly',
];

const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '1ZjzINOykaGIhp3EFL09zw_LlmAui5q90';
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID || '1Ab02MPDSN9-VfNj9p_HhxI32VdJuhDsZb4yOvRUSlKA';
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || 'primary';

// ═══ AUTH ═══

let authClient: ReturnType<typeof google.auth.JWT> | null = null;

function getAuth() {
  if (authClient) return authClient;

  const keyPath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY || path.join(process.cwd(), 'google-credentials.json');

  if (!fs.existsSync(keyPath)) {
    throw new Error(
      `❌ Google credentials não encontradas em: ${keyPath}\n` +
      'Configure GOOGLE_SERVICE_ACCOUNT_KEY no .env ou coloque google-credentials.json na pasta server/'
    );
  }

  const credentials = JSON.parse(fs.readFileSync(keyPath, 'utf-8'));

  authClient = new google.auth.JWT(
    credentials.client_email,
    undefined,
    credentials.private_key,
    SCOPES,
    process.env.GOOGLE_IMPERSONATE_EMAIL || undefined,
  );

  return authClient;
}

// ═══ DRIVE SERVICE ═══

export const DriveService = {
  /** Lista arquivos da Base de Conhecimento */
  async listFiles(folderId?: string) {
    const auth = getAuth();
    const drive = google.drive({ version: 'v3', auth });
    const targetFolder = folderId || DRIVE_FOLDER_ID;

    const res = await drive.files.list({
      q: `'${targetFolder}' in parents and trashed = false`,
      fields: 'files(id, name, mimeType, size, modifiedTime, webViewLink, iconLink)',
      orderBy: 'modifiedTime desc',
      pageSize: 100,
    });

    return res.data.files || [];
  },

  /** Upload de arquivo para o Drive */
  async uploadFile(fileName: string, content: Buffer | string, mimeType: string, folderId?: string) {
    const auth = getAuth();
    const drive = google.drive({ version: 'v3', auth });

    const res = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [folderId || DRIVE_FOLDER_ID],
      },
      media: {
        mimeType,
        body: typeof content === 'string' ? content : Buffer.from(content),
      },
      fields: 'id, name, webViewLink',
    });

    return res.data;
  },

  /** Download de arquivo */
  async downloadFile(fileId: string) {
    const auth = getAuth();
    const drive = google.drive({ version: 'v3', auth });

    const res = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'arraybuffer' }
    );

    return Buffer.from(res.data as ArrayBuffer);
  },

  /** Buscar arquivos por nome */
  async searchFiles(query: string) {
    const auth = getAuth();
    const drive = google.drive({ version: 'v3', auth });

    const res = await drive.files.list({
      q: `name contains '${query}' and '${DRIVE_FOLDER_ID}' in parents and trashed = false`,
      fields: 'files(id, name, mimeType, size, modifiedTime, webViewLink)',
      orderBy: 'relevance',
    });

    return res.data.files || [];
  },

  /** Criar pasta no Drive */
  async createFolder(name: string, parentId?: string) {
    const auth = getAuth();
    const drive = google.drive({ version: 'v3', auth });

    const res = await drive.files.create({
      requestBody: {
        name,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [parentId || DRIVE_FOLDER_ID],
      },
      fields: 'id, name, webViewLink',
    });

    return res.data;
  },
};

// ═══ SHEETS SERVICE ═══

export const SheetsService = {
  /** Ler dados de uma aba */
  async readSheet(sheetName: string, range?: string) {
    const auth = getAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    const fullRange = range ? `${sheetName}!${range}` : sheetName;
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: fullRange,
    });

    return res.data.values || [];
  },

  /** Escrever dados em uma aba */
  async writeSheet(sheetName: string, data: (string | number | boolean)[][]) {
    const auth = getAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: sheetName,
    });

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: data },
    });

    return { rows: data.length, sheet: sheetName };
  },

  /** Append dados (adicionar linhas) */
  async appendSheet(sheetName: string, rows: (string | number | boolean)[][]) {
    const auth = getAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    const res = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: rows },
    });

    return res.data.updates;
  },

  /** Sync completo: exporta todas as tabelas para o Sheets */
  async syncAll(tables: Record<string, Record<string, unknown>[]>) {
    const results: Record<string, { rows: number }> = {};

    for (const [tableName, rows] of Object.entries(tables)) {
      if (!rows.length) continue;
      const headers = Object.keys(rows[0]);
      const data = [
        headers,
        ...rows.map(row => headers.map(h => {
          const val = row[h];
          if (val === null || val === undefined) return '';
          if (typeof val === 'object') return JSON.stringify(val);
          return String(val);
        })),
      ];

      const sheetName = TABLE_SHEET_MAP[tableName] || tableName;
      await this.writeSheet(sheetName, data);
      results[tableName] = { rows: rows.length };
    }

    return results;
  },
};

const TABLE_SHEET_MAP: Record<string, string> = {
  users: 'Usuários',
  events: 'Eventos',
  vacancies: 'Vagas',
  quotes: 'Orçamentos',
  quoteItems: 'Itens Orçamento',
  teamMembers: 'Equipe',
  registrations: 'Inscrições',
  auditLogs: 'Audit Log',
};

// ═══ CALENDAR SERVICE ═══

export const CalendarService = {
  /** Listar próximos eventos */
  async listEvents(maxResults = 20) {
    const auth = getAuth();
    const calendar = google.calendar({ version: 'v3', auth });

    const res = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: new Date().toISOString(),
      maxResults,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return res.data.items || [];
  },

  /** Criar evento no Google Calendar */
  async createEvent(event: {
    title: string;
    description?: string;
    location?: string;
    startDate: string;
    endDate: string;
    attendees?: string[];
  }) {
    const auth = getAuth();
    const calendar = google.calendar({ version: 'v3', auth });

    const res = await calendar.events.insert({
      calendarId: CALENDAR_ID,
      requestBody: {
        summary: event.title,
        description: event.description,
        location: event.location,
        start: { dateTime: event.startDate, timeZone: 'America/Sao_Paulo' },
        end: { dateTime: event.endDate, timeZone: 'America/Sao_Paulo' },
        attendees: event.attendees?.map(email => ({ email })),
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 1440 },
            { method: 'popup', minutes: 60 },
          ],
        },
      },
    });

    return res.data;
  },

  /** Atualizar evento */
  async updateEvent(eventId: string, updates: Partial<{
    title: string;
    description: string;
    location: string;
    startDate: string;
    endDate: string;
  }>) {
    const auth = getAuth();
    const calendar = google.calendar({ version: 'v3', auth });

    const body: Record<string, unknown> = {};
    if (updates.title) body.summary = updates.title;
    if (updates.description) body.description = updates.description;
    if (updates.location) body.location = updates.location;
    if (updates.startDate) body.start = { dateTime: updates.startDate, timeZone: 'America/Sao_Paulo' };
    if (updates.endDate) body.end = { dateTime: updates.endDate, timeZone: 'America/Sao_Paulo' };

    const res = await calendar.events.patch({
      calendarId: CALENDAR_ID,
      eventId,
      requestBody: body,
    });

    return res.data;
  },

  /** Deletar evento */
  async deleteEvent(eventId: string) {
    const auth = getAuth();
    const calendar = google.calendar({ version: 'v3', auth });
    await calendar.events.delete({ calendarId: CALENDAR_ID, eventId });
  },
};

// ═══ GMAIL SERVICE ═══

export const GmailService = {
  /** Enviar email */
  async sendEmail(to: string, subject: string, htmlBody: string) {
    const auth = getAuth();
    const gmail = google.gmail({ version: 'v1', auth });

    const message = [
      `To: ${to}`,
      `Subject: =?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=utf-8',
      '',
      htmlBody,
    ].join('\r\n');

    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: encodedMessage },
    });

    return res.data;
  },

  /** Enviar email de confirmação de inscrição */
  async sendRegistrationConfirmation(to: string, name: string, eventTitle: string) {
    const html = `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #ba100a; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🦐 Brigada Camarão</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0;">Sentinel Command</p>
        </div>
        <div style="background: #fffbff; padding: 32px; border: 1px solid #e8e0df; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="color: #201a19; margin-top: 0;">Olá, ${name}! ✅</h2>
          <p style="color: #534341;">Sua inscrição para <strong>${eventTitle}</strong> foi confirmada com sucesso.</p>
          <div style="background: #f8ebe9; border-left: 4px solid #ba100a; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 0; color: #201a19;"><strong>Próximos passos:</strong></p>
            <ul style="color: #534341; margin: 8px 0 0; padding-left: 20px;">
              <li>Verifique a data e local do evento</li>
              <li>Confirme seus documentos e certificações</li>
              <li>Chegue 30 minutos antes para briefing</li>
            </ul>
          </div>
          <p style="color: #857371; font-size: 12px; margin-top: 24px;">
            Brigada Camarão — Prevenir · Combater · Salvar<br/>
            Desde 2009 · BH/MG
          </p>
        </div>
      </div>
    `;

    return this.sendEmail(to, `✅ Inscrição Confirmada — ${eventTitle}`, html);
  },

  /** Enviar notificação genérica */
  async sendNotification(to: string, title: string, body: string) {
    const html = `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #ba100a; padding: 16px 24px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 18px;">🦐 Brigada Camarão</h1>
        </div>
        <div style="background: #fffbff; padding: 24px; border: 1px solid #e8e0df; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="color: #201a19; margin-top: 0;">${title}</h2>
          <p style="color: #534341;">${body}</p>
          <hr style="border: none; border-top: 1px solid #e8e0df; margin: 20px 0;" />
          <p style="color: #857371; font-size: 11px;">
            Brigada Camarão — Sentinel Command
          </p>
        </div>
      </div>
    `;

    return this.sendEmail(to, title, html);
  },
};

// ═══ STATUS CHECK ═══

export async function checkGoogleStatus() {
  const keyPath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY || path.join(process.cwd(), 'google-credentials.json');
  const hasCredentials = fs.existsSync(keyPath);

  const services: Record<string, string> = {
    credentials: hasCredentials ? '✅ Configurado' : '❌ Faltando google-credentials.json',
    drive: DRIVE_FOLDER_ID ? '✅ Folder ID configurado' : '⚠️ GOOGLE_DRIVE_FOLDER_ID não definido',
    sheets: SPREADSHEET_ID ? '✅ Spreadsheet ID configurado' : '⚠️ GOOGLE_SPREADSHEET_ID não definido',
    calendar: '✅ Pronto (calendar ID: ' + CALENDAR_ID + ')',
    gmail: '✅ Pronto',
  };

  if (hasCredentials) {
    try {
      const auth = getAuth();
      await auth.authorize();
      services.auth = '✅ Autenticado com sucesso';
    } catch (err) {
      services.auth = `❌ Erro de autenticação: ${(err as Error).message}`;
    }
  }

  return services;
}
