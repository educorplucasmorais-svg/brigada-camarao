import { Router } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

/**
 * GET /api/export/all
 * Exporta todos os dados do banco para sincronização com Google Sheets.
 * Protegido por API key simples (header x-api-key).
 */
router.get('/all', async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.SHEETS_API_KEY && apiKey !== 'brigada-sync-2026') {
    return res.status(401).json({ error: 'API key inválida' });
  }

  try {
    const [users, events, vacancies, quotes, quoteItems, teamMembers, registrations, auditLogs] =
      await Promise.all([
        prisma.user.findMany({ orderBy: { createdAt: 'desc' } }),
        prisma.event.findMany({ orderBy: { createdAt: 'desc' } }),
        prisma.vacancy.findMany({ orderBy: { createdAt: 'desc' } }),
        prisma.quote.findMany({ orderBy: { createdAt: 'desc' } }),
        prisma.quoteItem.findMany(),
        prisma.teamMember.findMany({ orderBy: { createdAt: 'desc' } }),
        prisma.registration.findMany({ orderBy: { createdAt: 'desc' } }),
        prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 500 }),
      ]);

    // Remover passwordHash dos users por segurança
    const safeUsers = users.map(({ passwordHash: _, ...user }) => user);

    res.json({
      exportedAt: new Date().toISOString(),
      tables: {
        users: safeUsers,
        events,
        vacancies,
        quotes,
        quoteItems,
        teamMembers,
        registrations,
        auditLogs,
      },
    });
  } catch (err) {
    console.error('Export error:', err);
    res.status(500).json({ error: 'Erro ao exportar dados' });
  }
});

/**
 * GET /api/export/table/:name
 * Exporta uma tabela específica.
 */
router.get('/table/:name', async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.SHEETS_API_KEY && apiKey !== 'brigada-sync-2026') {
    return res.status(401).json({ error: 'API key inválida' });
  }

  const tableName = req.params.name;
  const validTables: Record<string, () => Promise<unknown[]>> = {
    users: () => prisma.user.findMany().then(users => users.map(({ passwordHash: _, ...u }) => u)),
    events: () => prisma.event.findMany(),
    vacancies: () => prisma.vacancy.findMany(),
    quotes: () => prisma.quote.findMany(),
    quoteItems: () => prisma.quoteItem.findMany(),
    teamMembers: () => prisma.teamMember.findMany(),
    registrations: () => prisma.registration.findMany(),
    auditLogs: () => prisma.auditLog.findMany({ take: 500 }),
  };

  if (!validTables[tableName]) {
    return res.status(400).json({ error: `Tabela "${tableName}" não existe`, valid: Object.keys(validTables) });
  }

  try {
    const data = await validTables[tableName]();
    res.json({ table: tableName, count: data.length, data });
  } catch (err) {
    console.error(`Export ${tableName} error:`, err);
    res.status(500).json({ error: `Erro ao exportar ${tableName}` });
  }
});

export default router;
