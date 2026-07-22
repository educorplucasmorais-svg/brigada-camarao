import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, requireAdmin, type AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /team — list all team members
router.get('/', async (_req, res) => {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar equipe' });
  }
});

// GET /team/:id — single member
router.get('/:id', async (req, res) => {
  try {
    const member = await prisma.teamMember.findUnique({
      where: { id: req.params.id },
    });
    if (!member) {
      res.status(404).json({ error: 'Membro não encontrado' });
      return;
    }
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar membro' });
  }
});

// POST /team — create (admin)
router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { name, role, phone, email, certifications, avatar } = req.body;
    const member = await prisma.teamMember.create({
      data: {
        name,
        role,
        phone,
        email,
        certifications: typeof certifications === 'string' ? certifications : JSON.stringify(certifications),
        avatar,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.userId,
        action: 'CREATE',
        entity: 'TeamMember',
        entityId: member.id,
        details: JSON.stringify({ name, role }),
        ipAddress: req.ip,
      },
    });

    res.status(201).json(member);
  } catch (err) {
    console.error('Create team member error:', err);
    res.status(500).json({ error: 'Erro ao criar membro da equipe' });
  }
});

// PUT /team/:id — update (admin)
router.put('/:id', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const data = { ...req.body };
    if (data.certifications && typeof data.certifications !== 'string') {
      data.certifications = JSON.stringify(data.certifications);
    }

    const member = await prisma.teamMember.update({
      where: { id: req.params.id },
      data,
    });

    await prisma.auditLog.create({
      data: {
        userId: req.userId,
        action: 'UPDATE',
        entity: 'TeamMember',
        entityId: member.id,
        details: JSON.stringify(req.body),
        ipAddress: req.ip,
      },
    });

    res.json(member);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar membro' });
  }
});

export default router;
