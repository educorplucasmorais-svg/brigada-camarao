import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

import prisma from './lib/prisma.js';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import vacancyRoutes from './routes/vacancies.js';
import quoteRoutes from './routes/quotes.js';
import teamRoutes from './routes/team.js';
import registrationRoutes from './routes/registrations.js';
import exportRoutes from './routes/export.js';

const app = express();
const PORT = Number(process.env.PORT) || 3333;

app.use(helmet());
app.use(cors({ origin: ['http://localhost:3050', 'http://localhost:3051', 'http://localhost:5173'], credentials: true }));
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Brigada Camarão API', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/vacancies', vacancyRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/export', exportRoutes);

// Dashboard stats endpoint
app.get('/api/stats', async (_req, res) => {
  try {
    const [totalEvents, activeEvents, totalStaff, totalRegistrations] = await Promise.all([
      prisma.event.count(),
      prisma.event.count({ where: { status: { in: ['active', 'upcoming'] } } }),
      prisma.teamMember.count(),
      prisma.registration.count(),
    ]);

    const availableStaff = await prisma.teamMember.count({ where: { status: 'active' } });
    const events = await prisma.event.findMany();
    const monthlyRevenue = events.reduce((sum, e) => sum + e.budget, 0);
    const pendingQuotes = await prisma.quote.count({ where: { status: 'pending' } });

    res.json({
      totalEvents,
      activeEvents,
      totalStaff,
      availableStaff,
      monthlyRevenue,
      pendingQuotes,
      occupancyRate: totalStaff > 0 ? Math.round((totalRegistrations / totalStaff) * 100) : 0,
      customerSatisfaction: 96,
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

app.listen(PORT, () => {
  console.log(`🔥 Brigada Camarão API running on http://localhost:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/api/health`);
});
