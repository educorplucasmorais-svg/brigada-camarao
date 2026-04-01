import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

const app = express()
const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'brigada-camarao-secret-2026'
const API_KEY = process.env.API_KEY || 'brigada-sync-2026'
const PORT = process.env.PORT || 3333

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }))
app.use(express.json())

// ── Auth middleware ──────────────────────────────────────────
const auth = (req, res, next) => {
  const h = req.headers.authorization
  if (!h?.startsWith('Bearer ')) return res.status(401).json({ error: 'Token required' })
  try { req.user = jwt.verify(h.slice(7), JWT_SECRET); next() }
  catch { res.status(401).json({ error: 'Invalid token' }) }
}

const apiKey = (req, res, next) => {
  if (req.headers['x-api-key'] !== API_KEY) return res.status(403).json({ error: 'Invalid API key' })
  next()
}

// ── Health ───────────────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  const evCount = await prisma.event.count().catch(() => 0)
  res.json({ status: 'ok', ts: new Date().toISOString(), events: evCount })
})

// ── Auth ─────────────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, cpf, pix, cred, role = 'staff' } = req.body
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' })
    const hash = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({ data: { name, email, passwordHash: hash, cpf, pix, cred, role } })
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' })
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  } catch (e) {
    if (e.code === 'P2002') return res.status(409).json({ error: 'Email already exists' })
    res.status(500).json({ error: e.message })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
    await prisma.auditLog.create({ data: { action: 'LOGIN', entity: 'User', userId: user.id, ipAddress: req.ip } })
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' })
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, cred: user.cred } })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// ── Events ───────────────────────────────────────────────────
app.get('/api/events', auth, async (req, res) => {
  const { status, type } = req.query
  const where = {}
  if (status) where.status = status
  if (type) where.type = { contains: type }
  const events = await prisma.event.findMany({ where, orderBy: { date: 'asc' } })
  res.json(events)
})

app.post('/api/events', auth, async (req, res) => {
  if (!['admin', 'coo'].includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' })
  try {
    const ev = await prisma.event.create({ data: { ...req.body, date: new Date(req.body.date) } })
    await prisma.auditLog.create({ data: { action: 'CREATE_EVENT', entity: 'Event', entityId: ev.id, userId: req.user.id, ipAddress: req.ip } })
    res.json(ev)
  } catch (e) { res.status(400).json({ error: e.message }) }
})

app.put('/api/events/:id', auth, async (req, res) => {
  if (!['admin', 'coo'].includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' })
  try {
    const data = { ...req.body }
    if (data.date) data.date = new Date(data.date)
    delete data.id
    const ev = await prisma.event.update({ where: { id: req.params.id }, data })
    res.json(ev)
  } catch (e) { res.status(400).json({ error: e.message }) }
})

app.delete('/api/events/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' })
  await prisma.event.delete({ where: { id: req.params.id } })
  res.json({ ok: true })
})

// ── Vacancies ────────────────────────────────────────────────
app.get('/api/vacancies', auth, async (req, res) => {
  const vacancies = await prisma.vacancy.findMany({ orderBy: { createdAt: 'desc' } })
  res.json(vacancies)
})
app.post('/api/vacancies', auth, async (req, res) => {
  if (!['admin', 'coo'].includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' })
  const v = await prisma.vacancy.create({ data: req.body })
  res.json(v)
})
app.put('/api/vacancies/:id', auth, async (req, res) => {
  const data = { ...req.body }; delete data.id
  const v = await prisma.vacancy.update({ where: { id: req.params.id }, data })
  res.json(v)
})
app.delete('/api/vacancies/:id', auth, async (req, res) => {
  await prisma.vacancy.delete({ where: { id: req.params.id } })
  res.json({ ok: true })
})

// ── Quotes ───────────────────────────────────────────────────
app.get('/api/quotes', auth, async (req, res) => {
  const quotes = await prisma.quote.findMany({ include: { items: true }, orderBy: { createdAt: 'desc' } })
  res.json(quotes)
})
app.post('/api/quotes', auth, async (req, res) => {
  if (!['admin', 'coo'].includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' })
  const { items, validUntil, ...rest } = req.body
  const q = await prisma.quote.create({
    data: {
      ...rest,
      validUntil: validUntil ? new Date(validUntil) : null,
      items: items?.length ? { create: items } : undefined
    },
    include: { items: true }
  })
  res.json(q)
})
app.put('/api/quotes/:id', auth, async (req, res) => {
  const { items, validUntil, id, ...rest } = req.body
  const data = { ...rest }
  if (validUntil) data.validUntil = new Date(validUntil)
  const q = await prisma.quote.update({ where: { id: req.params.id }, data, include: { items: true } })
  res.json(q)
})
app.delete('/api/quotes/:id', auth, async (req, res) => {
  await prisma.quoteItem.deleteMany({ where: { quoteId: req.params.id } })
  await prisma.quote.delete({ where: { id: req.params.id } })
  res.json({ ok: true })
})

// ── Team ─────────────────────────────────────────────────────
app.get('/api/team', auth, async (req, res) => {
  const { status } = req.query
  const where = status ? { status } : {}
  const team = await prisma.teamMember.findMany({ where, orderBy: { name: 'asc' } })
  res.json(team)
})
app.post('/api/team', auth, async (req, res) => {
  if (!['admin', 'coo'].includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' })
  const m = await prisma.teamMember.create({ data: req.body })
  res.json(m)
})
app.put('/api/team/:id', auth, async (req, res) => {
  const data = { ...req.body }; delete data.id
  const m = await prisma.teamMember.update({ where: { id: req.params.id }, data })
  res.json(m)
})
app.delete('/api/team/:id', auth, async (req, res) => {
  await prisma.teamMember.delete({ where: { id: req.params.id } })
  res.json({ ok: true })
})

// ── Stats (KPIs) ─────────────────────────────────────────────
app.get('/api/stats', auth, async (req, res) => {
  const [evTotal, evActive, teamTotal, teamAvail, qApproved, qTotal] = await Promise.all([
    prisma.event.count(),
    prisma.event.count({ where: { status: 'Ativo' } }),
    prisma.teamMember.count(),
    prisma.teamMember.count({ where: { status: 'Disponível' } }),
    prisma.quote.aggregate({ where: { status: 'Aprovado' }, _sum: { totalValue: true } }),
    prisma.quote.aggregate({ _sum: { totalValue: true } }),
  ])
  res.json({
    events: { total: evTotal, active: evActive },
    team: { total: teamTotal, available: teamAvail },
    revenue: {
      approved: qApproved._sum.totalValue || 0,
      pipeline: qTotal._sum.totalValue || 0,
    }
  })
})

// ── Export (Google Sheets sync) ──────────────────────────────
app.get('/api/export/all', apiKey, async (req, res) => {
  const [events, vacancies, quotes, team] = await Promise.all([
    prisma.event.findMany(),
    prisma.vacancy.findMany(),
    prisma.quote.findMany({ include: { items: true } }),
    // LGPD: exclude CPF from exports
    prisma.teamMember.findMany({ select: { id: true, name: true, role: true, cred: true, pix: true, status: true, eventsCount: true } })
  ])
  res.json({ events, vacancies, quotes, team, exportedAt: new Date().toISOString() })
})

app.get('/api/export/table/:name', apiKey, async (req, res) => {
  const tables = { events: 'event', vacancies: 'vacancy', quotes: 'quote', team: 'teamMember' }
  const t = tables[req.params.name]
  if (!t) return res.status(404).json({ error: 'Unknown table' })
  const data = await prisma[t].findMany()
  res.json(data)
})

// ── Registrations ────────────────────────────────────────────
app.post('/api/registrations', auth, async (req, res) => {
  const { eventId } = req.body
  const hash = crypto.createHash('sha256').update(`${req.user.id}-${eventId}-${Date.now()}`).digest('hex')
  const reg = await prisma.registration.create({
    data: { userId: req.user.id, eventId, status: 'confirmed', dataHash: hash }
  })
  res.json(reg)
})

app.get('/api/registrations', auth, async (req, res) => {
  const where = req.user.role === 'admin' ? {} : { userId: req.user.id }
  const regs = await prisma.registration.findMany({ where, include: { event: true } })
  res.json(regs)
})

// ── Start ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🔥 Brigada Camarão API → http://localhost:${PORT}`)
})
