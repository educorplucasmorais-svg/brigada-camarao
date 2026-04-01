import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, requireAdmin, type AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /vacancies — list all (optional eventId filter)
router.get('/', async (req, res) => {
  try {
    const { eventId } = req.query;
    const where = eventId ? { eventId: String(eventId) } : {};
    const vacancies = await prisma.vacancy.findMany({
      where,
      include: { event: { select: { title: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(vacancies);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar vagas' });
  }
});

// POST /vacancies — create (admin)
router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { eventId, role, quantity, requirements, hourlyRate } = req.body;
    const vacancy = await prisma.vacancy.create({
      data: {
        eventId,
        role,
        quantity,
        requirements: typeof requirements === 'string' ? requirements : JSON.stringify(requirements),
        hourlyRate,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.userId,
        action: 'CREATE',
        entity: 'Vacancy',
        entityId: vacancy.id,
        details: JSON.stringify({ role, eventId }),
        ipAddress: req.ip,
      },
    });

    res.status(201).json(vacancy);
  } catch (err) {
    console.error('Create vacancy error:', err);
    res.status(500).json({ error: 'Erro ao criar vaga' });
  }
});

// PUT /vacancies/:id — update (admin)
router.put('/:id', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const data = { ...req.body };
    if (data.requirements && typeof data.requirements !== 'string') {
      data.requirements = JSON.stringify(data.requirements);
    }

    const vacancy = await prisma.vacancy.update({
      where: { id: req.params.id },
      data,
    });

    await prisma.auditLog.create({
      data: {
        userId: req.userId,
        action: 'UPDATE',
        entity: 'Vacancy',
        entityId: vacancy.id,
        details: JSON.stringify(req.body),
        ipAddress: req.ip,
      },
    });

    res.json(vacancy);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar vaga' });
  }
});

export default router;
