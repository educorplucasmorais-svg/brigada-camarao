<p align="center">
  <img src="public/images/logo-brigada.png" alt="Brigada Camarão" width="120" />
</p>

<h1 align="center">🦐 Brigada Camarão — Sentinel Command</h1>

<p align="center">
  <strong>Plataforma de gestão inteligente para a maior brigada de incêndio do Brasil</strong><br/>
  Recrutamento · Eventos · Orçamentos · Dashboard 3 Níveis · Mobile-First
</p>

<p align="center">
  <a href="https://brigada-camarao.vercel.app">🌐 Live Demo</a> ·
  <a href="https://www.instagram.com/brigadacamarao/">📸 Instagram</a> ·
  <a href="https://docs.google.com/spreadsheets/d/1Ab02MPDSN9-VfNj9p_HhxI32VdJuhDsZb4yOvRUSlKA/edit">📊 Planilha Backup</a>
</p>

---

## 🔐 Credenciais de Acesso

| Usuário | Email | Senha | Role | Acesso |
|---------|-------|-------|------|--------|
| **Admin** | `admin@brigadacamarao.com` | qualquer senha | `admin` | Dashboard completo + 3 visões |
| **COO** | `coo@brigadacamarao.com` | qualquer senha | `coo` | Painel Executivo COO |
| **Staff** | `staff@brigadacamarao.com` | qualquer senha | `staff` | Visão operacional |

> ⚠️ Em modo offline (backend desligado), o login aceita **qualquer senha** via mock fallback.  
> Com o backend rodando (`:3333`), a autenticação é via JWT + bcrypt.

---

## 🏗️ Arquitetura

```
brigada-camarao/
├── public/
│   └── images/
│       ├── logo-brigada.png          # Logo oficial BG-55
│       └── hero/                     # Slideshow de fotos (login)
│           ├── hero-1.jpg ... hero-5.jpg
│           └── instagram-extractor.js
├── src/
│   ├── components/                   # UI Components (Sidebar, StatsCard, StatusBadge)
│   ├── contexts/                     # AuthContext (JWT + Mock fallback)
│   ├── data/                         # Mock data (offline mode)
│   ├── layouts/                      # AdminLayout (sidebar + content)
│   ├── lib/                          # API client
│   ├── pages/
│   │   ├── public/                   # LoginPage (slideshow hero)
│   │   └── admin/                    # DashboardPage, COODashboardPage
│   ├── types/                        # TypeScript interfaces
│   └── index.css                     # Design System (MD3 + Glassmorphism)
├── server/
│   ├── prisma/schema.prisma          # 8 modelos (User, Event, Vacancy, Quote...)
│   ├── src/
│   │   ├── routes/                   # auth, events, vacancies, quotes, team, registrations, export
│   │   ├── lib/prisma.ts             # Prisma client
│   │   ├── seed.ts                   # Dados iniciais
│   │   └── index.ts                  # Express server (:3333)
│   └── package.json
├── google-sheets-sync/
│   ├── Code.gs                       # Apps Script — backup para Google Sheets
│   └── README.md                     # Instruções de instalação
├── .github/workflows/ci.yml          # CI/CD — GitHub Actions → Vercel
├── vercel.json                       # SPA routing + security headers
├── ESTRATEGIA_MARKETING.md           # Plano de marketing completo
└── package.json
```

---

## 🎨 Design System

| Propriedade | Valor |
|-------------|-------|
| **Primary** | `#ba100a` (vermelho Brigada) |
| **Surface** | `#fffbff` (branco quente) |
| **Fonte Headlines** | Manrope (font-headline) |
| **Fonte Body** | Inter (font-sans) |
| **Glassmorphism** | `.glass` (75% white, blur 16px) |
| **Animação** | `.chameleon-gradient` (8s infinite) |
| **Hover** | `.card-hover` (translateY -3px, desabilitado no mobile) |
| **Logo Pulse** | `.logo-pulse` (glow animation) |

---

## 📊 Dashboard — 3 Visões

### 🔭 Estratégico (C-Level)
- OKRs com RadialBarChart (progresso visual)
- Receita anual vs. meta (AreaChart)
- Market share e metas corporativas

### 🎯 Tático (Gerência)
- KPIs operacionais (StatsCards)
- Pipeline de vendas (BarChart)
- Receita mensal (AreaChart)
- Eventos em andamento

### ⚙️ Operacional (Campo)
- Agenda de eventos do dia
- Timeline de check-ins
- Resumo financeiro
- Checklist de equipamentos

---

## 🚀 Início Rápido

### Frontend (React + Vite)

```bash
cd brigada-camarao
npm install
npm run dev
# → http://localhost:5173
```

### Backend (Express + Prisma + SQLite)

```bash
cd server
npm install
npx prisma db push
npx tsx src/seed.ts
npm run dev
# → http://localhost:3333
```

### Google Sheets Sync

1. Abra a [planilha](https://docs.google.com/spreadsheets/d/1Ab02MPDSN9-VfNj9p_HhxI32VdJuhDsZb4yOvRUSlKA/edit)
2. **Extensões → Apps Script**
3. Cole o conteúdo de `google-sheets-sync/Code.gs`
4. Execute `setup()` → autorize → pronto!

---

## 🔌 API Endpoints

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `GET` | `/api/health` | Health check | — |
| `POST` | `/api/auth/login` | Login (retorna JWT) | — |
| `POST` | `/api/auth/register` | Registro | — |
| `GET` | `/api/events` | Listar eventos | Bearer |
| `GET` | `/api/vacancies` | Listar vagas | Bearer |
| `GET` | `/api/quotes` | Listar orçamentos | Bearer |
| `GET` | `/api/team` | Listar equipe | Bearer |
| `GET` | `/api/registrations` | Listar inscrições | Bearer |
| `GET` | `/api/stats` | KPIs do dashboard | Bearer |
| `GET` | `/api/export/all` | Export completo (Sheets sync) | x-api-key |
| `GET` | `/api/export/table/:name` | Export tabela específica | x-api-key |

**API Key para Sheets:** `brigada-sync-2026`

---

## 🗄️ Banco de Dados (Prisma Schema)

| Modelo | Campos Principais |
|--------|-------------------|
| `User` | name, email, role (admin/coo/staff), cpf, pix, status |
| `Event` | title, date, location, capacity, budget, status |
| `Vacancy` | title, quantity, compensation, requirements |
| `Quote` | client, type, totalValue, status, validUntil |
| `QuoteItem` | description, quantity, unitPrice |
| `TeamMember` | name, role, certifications, status |
| `Registration` | userId, eventId, status, dataHash (verificação SHA-256) |
| `AuditLog` | action, entity, userId, ipAddress |

---

## 📱 Mobile-First

Otimizado para bombeiros usando celular durante eventos:

- **Touch targets**: mínimo 48px em todos os botões
- **Charts responsivos**: `h-48 → h-64 → h-72` (mobile → tablet → desktop)
- **Sidebar drawer**: 280px com active:scale feedback
- **Animações**: desabilitadas em `prefers-reduced-motion`
- **Scrollbar**: 4px no mobile
- **Tabs**: labels abreviados (`ESTR.`, `TÁT.`, `OPER.`)

---

## 🚢 Deploy

| Serviço | URL | Branch |
|---------|-----|--------|
| **Frontend** | [brigada-camarao.vercel.app](https://brigada-camarao.vercel.app) | `main` (auto-deploy) |
| **GitHub** | [educorplucasmorais-svg/brigada-camarao](https://github.com/educorplucasmorais-svg/brigada-camarao) | `main` |
| **Sheets Backup** | [Planilha](https://docs.google.com/spreadsheets/d/1Ab02MPDSN9-VfNj9p_HhxI32VdJuhDsZb4yOvRUSlKA/edit) | Auto-sync 6h |

---

## 📈 Marketing

Consulte o plano completo em [`ESTRATEGIA_MARKETING.md`](./ESTRATEGIA_MARKETING.md):
- Análise SWOT
- Estratégia Instagram (calendário editorial)
- SEO e posicionamento
- Roadmap de expansão

---

## 🛡️ Segurança

- **JWT** com expiração de 24h
- **bcrypt** para hash de senhas
- **SHA-256** para verificação de integridade de registros
- **LGPD**: senhas nunca exportadas na API de export
- **Headers**: X-Frame-Options DENY, X-Content-Type-Options nosniff
- **CORS**: whitelist de origens permitidas

---

<p align="center">
  <strong>🦐 Brigada Camarão — Prevenir · Combater · Salvar</strong><br/>
  <em>Desde 2009 · BH/MG · 13K+ seguidores</em><br/><br/>
  <code>Sempre perto de você</code>
</p>
