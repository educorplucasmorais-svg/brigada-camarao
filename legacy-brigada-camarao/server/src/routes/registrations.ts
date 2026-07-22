import { Router } from 'express';
import crypto from 'crypto';
import prisma from '../lib/prisma.js';
import { authenticate, type AuthRequest } from '../middleware/auth.js';

const router = Router();

function computeHash(data: Record<string, unknown>): string {
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
}

// POST /registrations
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { eventId, contractAccepted } = req.body;
    const userId = req.userId!;

    // Check event exists and has capacity
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      res.status(404).json({ error: 'Evento não encontrado' });
      return;
    }
    if (event.filledVacancies >= event.vacancies) {
      res.status(400).json({ error: 'Evento sem vagas disponíveis' });
      return;
    }

    // Create registration
    const registration = await prisma.registration.create({
      data: { userId, eventId, contractAccepted: contractAccepted || false, status: 'confirmed' },
    });

    // DATA VERIFICATION: Read back
    const stored = await prisma.registration.findUnique({
      where: { id: registration.id },
      include: { user: { select: { name: true, email: true, cpf: true } }, event: { select: { title: true } } },
    });

    const hashData = {
      id: stored!.id,
      userId: stored!.userId,
      eventId: stored!.eventId,
      contractAccepted: stored!.contractAccepted,
      status: stored!.status,
    };
    const verificationHash = computeHash(hashData);

    // Update with hash
    await prisma.registration.update({
      where: { id: registration.id },
      data: { verificationHash, verifiedAt: new Date() },
    });

    // Update event fill count
    await prisma.event.update({
      where: { id: eventId },
      data: { filledVacancies: { increment: 1 } },
    });

    // Audit
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'REGISTER',
        entity: 'Registration',
        entityId: registration.id,
        details: JSON.stringify({ verified: true, verificationHash, eventTitle: stored!.event.title }),
        ipAddress: req.ip,
      },
    });

    const verified = stored!.userId === userId && stored!.eventId === eventId;

    res.status(201).json({
      registration: { ...stored, verificationHash },
      verified,
      verificationHash,
      message: verified ? 'Registro verificado com sucesso' : 'ALERTA: Verificação falhou',
    });
  } catch (err: any) {
    if (err?.code === 'P2002') {
      res.status(409).json({ error: 'Você já está inscrito neste evento' });
      return;
    }
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Erro ao registrar inscrição' });
  }
});

// GET /registrations/:id/verify
router.get('/:id/verify', authenticate, async (req: AuthRequest, res) => {
  try {
    const stored = await prisma.registration.findUnique({
      where: { id: req.params.id },
      include: { user: { select: { name: true, email: true } }, event: { select: { title: true } } },
    });
    if (!stored) {
      res.status(404).json({ error: 'Registro não encontrado' });
      return;
    }

    const hashData = {
      id: stored.id,
      userId: stored.userId,
      eventId: stored.eventId,
      contractAccepted: stored.contractAccepted,
      status: stored.status,
    };
    const currentHash = computeHash(hashData);
    const integrityOk = currentHash === stored.verificationHash;

    await prisma.auditLog.create({
      data: {
        userId: req.userId,
        action: 'VERIFY',
        entity: 'Registration',
        entityId: stored.id,
        details: JSON.stringify({ integrityOk, currentHash, storedHash: stored.verificationHash }),
        ipAddress: req.ip,
      },
    });

    res.json({
      registration: stored,
      integrity: integrityOk ? 'VERIFIED' : 'COMPROMISED',
      currentHash,
      storedHash: stored.verificationHash,
      verifiedAt: stored.verifiedAt,
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao verificar registro' });
  }
});

// GET /registrations (user's own)
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const registrations = await prisma.registration.findMany({
      where: { userId: req.userId },
      include: { event: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar registros' });
  }
});

export default router;
