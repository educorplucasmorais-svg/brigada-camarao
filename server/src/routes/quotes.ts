import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, requireAdmin, type AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /quotes — list all with items
router.get('/', async (_req, res) => {
  try {
    const quotes = await prisma.quote.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(quotes);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar orçamentos' });
  }
});

// GET /quotes/:id — single with items
router.get('/:id', async (req, res) => {
  try {
    const quote = await prisma.quote.findUnique({
      where: { id: req.params.id },
      include: { items: true },
    });
    if (!quote) {
      res.status(404).json({ error: 'Orçamento não encontrado' });
      return;
    }
    res.json(quote);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar orçamento' });
  }
});

// POST /quotes — create with items (admin)
router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { clientName, eventType, date, value, items } = req.body;
    const quote = await prisma.quote.create({
      data: {
        clientName,
        eventType,
        date,
        value,
        items: {
          create: items || [],
        },
      },
      include: { items: true },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.userId,
        action: 'CREATE',
        entity: 'Quote',
        entityId: quote.id,
        details: JSON.stringify({ clientName, value }),
        ipAddress: req.ip,
      },
    });

    res.status(201).json(quote);
  } catch (err) {
    console.error('Create quote error:', err);
    res.status(500).json({ error: 'Erro ao criar orçamento' });
  }
});

// PUT /quotes/:id — update status (admin)
router.put('/:id', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const quote = await prisma.quote.update({
      where: { id: req.params.id },
      data: req.body,
      include: { items: true },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.userId,
        action: 'UPDATE',
        entity: 'Quote',
        entityId: quote.id,
        details: JSON.stringify(req.body),
        ipAddress: req.ip,
      },
    });

    res.json(quote);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar orçamento' });
  }
});

export default router;
