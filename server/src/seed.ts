import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Brigada Camarão database...')

  // ── Users ──────────────────────────────────────────────────
  const users = [
    { name: 'Lucas Morais', email: 'admin@brigadacamarao.com', password: 'admin123', role: 'admin', cred: 'BC-ADM-01' },
    { name: 'Ana COO', email: 'coo@brigadacamarao.com', password: 'coo123', role: 'coo', cred: 'BC-COO-01' },
    { name: 'Carlos Staff', email: 'staff@brigadacamarao.com', password: 'staff123', role: 'staff', cred: 'BC-001' },
  ]
  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 12)
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { name: u.name, email: u.email, passwordHash: hash, role: u.role, cred: u.cred }
    })
  }

  // ── Events ─────────────────────────────────────────────────
  const events = [
    { id: 'ev-sjoa-01', title: 'Plantão Hospital Santa Joana', type: 'Hospitalar', date: new Date('2026-10-15'), time: '08:00-20:00', location: 'Bela Vista, SP', pay: 220, total: 5, filled: 2, status: 'Ativo', whatsapp: 'https://wa.me/5511999999999' },
    { id: 'ev-praca-01', title: 'Show na Praça da Sé', type: 'Evento Especial', date: new Date('2026-10-18'), time: '16:00-04:00', location: 'Centro Histórico, SP', pay: 280, total: 15, filled: 7, status: 'Ativo', whatsapp: 'https://wa.me/5511988888888' },
    { id: 'ev-ibira-01', title: 'Shopping Ibirapuera Segurança', type: 'Corporativo', date: new Date('2026-10-16'), time: '09:00-18:00', location: 'Ibirapuera, SP', pay: 185, total: 15, filled: 15, status: 'Encerrado', whatsapp: '' },
    { id: 'ev-berri-01', title: 'Plantão Noturno Berrini', type: 'Hospitalar', date: new Date('2026-04-01'), time: '20:00-08:00', location: 'Berrini, SP', pay: 240, total: 30, filled: 27, status: 'Ativo', whatsapp: 'https://wa.me/5511977777777' },
    { id: 'ev-carn-01', title: 'Carnaval Cultural SP', type: 'Evento Especial', date: new Date('2026-04-25'), time: '14:00-02:00', location: 'Centro, SP', pay: 310, total: 40, filled: 0, status: 'Aberto', whatsapp: '' },
  ]
  for (const ev of events) {
    await prisma.event.upsert({ where: { id: ev.id }, update: {}, create: ev })
  }

  // ── Vacancies ──────────────────────────────────────────────
  const vacancies = [
    { title: 'Bombeiro Civil – Plantão', type: 'Hospitalar', pay: 220, slots: 15, req: 'NR-23, Primeiros Socorros', status: 'Aberto' },
    { title: 'Coordenador de Segurança', type: 'Eventos', pay: 380, slots: 5, req: 'Liderança, 3+ anos experiência', status: 'Aberto' },
    { title: 'Brigadista Industrial', type: 'Industrial', pay: 260, slots: 8, req: 'NR-23, NR-35, CIPA', status: 'Aberto' },
  ]
  for (const v of vacancies) {
    await prisma.vacancy.create({ data: v }).catch(() => {})
  }

  // ── Quotes ─────────────────────────────────────────────────
  const quotes = [
    { client: 'Hospital A. Einstein', type: 'Hospitalar', totalValue: 85000, status: 'Aprovado', validUntil: new Date('2026-04-30'), contact: 'compras@einstein.br', items: [{ description: 'Plantão 12h x 30 dias', quantity: 30, unitPrice: 2833 }] },
    { client: 'Rock in Rio SP', type: 'Mega Evento', totalValue: 220000, status: 'Em Análise', validUntil: new Date('2026-04-15'), contact: 'eventos@rockinrio.com', items: [{ description: 'Cobertura total 3 dias', quantity: 3, unitPrice: 73333 }] },
    { client: 'Petrobras Refinaria', type: 'Industrial', totalValue: 45000, status: 'Aprovado', validUntil: new Date('2026-05-20'), contact: 'seg@petrobras.com', items: [{ description: 'Serviço mensal contínuo', quantity: 1, unitPrice: 45000 }] },
    { client: 'Shopping Morumbi', type: 'Corporativo', totalValue: 32000, status: 'Negociação', validUntil: new Date('2026-04-10'), contact: 'ops@morumbi.com', items: [{ description: 'Cobertura mensal plantão', quantity: 1, unitPrice: 32000 }] },
    { client: 'Anhembi Eventos', type: 'Evento Grande', totalValue: 98000, status: 'Em Análise', validUntil: new Date('2026-05-05'), contact: 'eventos@anhembi.com', items: [{ description: 'Evento 5 dias completo', quantity: 5, unitPrice: 19600 }] },
  ]
  for (const { items, ...q } of quotes) {
    await prisma.quote.create({ data: { ...q, items: { create: items } } }).catch(() => {})
  }

  // ── Team Members ───────────────────────────────────────────
  const team = [
    { name: 'Carlos Silva', role: 'Bombeiro Civil', cred: 'BC-001', cpf: '111.222.333-01', pix: 'carlos@brigade.com', status: 'Ativo', eventsCount: 45 },
    { name: 'Ana Beatriz Costa', role: 'Coordenadora', cred: 'BC-002', cpf: '111.222.333-02', pix: 'ana@brigade.com', status: 'Ativo', eventsCount: 62 },
    { name: 'Ricardo Santos', role: 'Bombeiro Civil', cred: 'BC-003', cpf: '111.222.333-03', pix: 'ricardo@brigade.com', status: 'Disponível', eventsCount: 28 },
    { name: 'Fernanda Lima', role: 'Bombeiro Sênior', cred: 'BC-004', cpf: '111.222.333-04', pix: 'fernanda@brigade.com', status: 'Em Missão', eventsCount: 89 },
    { name: 'Pedro Oliveira', role: 'Bombeiro Civil', cred: 'BC-005', cpf: '111.222.333-05', pix: 'pedro@brigade.com', status: 'Ativo', eventsCount: 34 },
    { name: 'Juliana Mendes', role: 'Coordenadora', cred: 'BC-006', cpf: '111.222.333-06', pix: 'juliana@brigade.com', status: 'Disponível', eventsCount: 51 },
  ]
  for (const m of team) {
    await prisma.teamMember.upsert({ where: { cred: m.cred }, update: {}, create: m })
  }

  console.log('✅ Seed concluído! Brigada Camarão está pronta.')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
