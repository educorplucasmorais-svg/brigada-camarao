import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, requireAdmin, type AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /events — list all events (optional status filter)
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const where = status ? { status: String(status) } : {};
    const events = await prisma.event.findMany({
      where,
      orderBy: { date: 'asc' },
      include: { vacancyList: true },
    });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar eventos' });
  }
});

// GET /events/:id — single event with vacancies
router.get('/:id', async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: { vacancyList: true, registrations: true },
    });
    if (!event) {
      res.status(404).json({ error: 'Evento não encontrado' });
      return;
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar evento' });
  }
});

// POST /events — create event (admin only)
router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { title, date, location, type, vacancies, budget, description, uniform, status } = req.body;
    const event = await prisma.event.create({
      data: { title, date, location, type, vacancies, budget: budget || 0, description, uniform, status: status || 'upcoming' },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.userId,
        action: 'CREATE',
        entity: 'Event',
        entityId: event.id,
        details: JSON.stringify({ title }),
        ipAddress: req.ip,
      },
    });

    res.status(201).json(event);
  } catch (err) {
    console.error('Create event error:', err);
    res.status(500).json({ error: 'Erro ao criar evento' });
  }
});

// PUT /events/:id — update event (admin only)
router.put('/:id', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const event = await prisma.event.update({
      where: { id: req.params.id },
      data: req.body,
    });

    await prisma.auditLog.create({
      data: {
        userId: req.userId,
        action: 'UPDATE',
        entity: 'Event',
        entityId: event.id,
        details: JSON.stringify(req.body),
        ipAddress: req.ip,
      },
    });

    res.json(event);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar evento' });
  }
});

// DELETE /events/:id — delete event (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    await prisma.event.delete({ where: { id: req.params.id } });

    await prisma.auditLog.create({
      data: {
        userId: req.userId,
        action: 'DELETE',
        entity: 'Event',
        entityId: req.params.id,
        ipAddress: req.ip,
      },
    });

    res.json({ message: 'Evento excluído com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir evento' });
  }
});

export default router;
