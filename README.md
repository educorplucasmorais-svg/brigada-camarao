# 🦐 Brigada Camarão — Sentinel Command

<p align="center">
  <strong>Plataforma completa de gestão inteligente para brigada civil</strong><br/>
  React · Vite · Express · Prisma · Claude AI (Cookbooks) · Google Sheets Backup
</p>

---

## 🔐 Credenciais de Acesso

| Usuário | Email | Senha | Role |
|---------|-------|-------|------|
| **Admin** | `admin@brigadacamarao.com` | `admin123` | `admin` |
| **COO** | `coo@brigadacamarao.com` | `coo123` | `coo` |
| **Staff** | `staff@brigadacamarao.com` | `staff123` | `staff` |

> Em modo offline (sem backend), o app funciona com banco de dados local no navegador (window.storage / localStorage).

---

## 🏗️ Arquitetura

```
brigada-camarao-app/
├── src/
│   ├── App.jsx              # App completo (Login + Employee + Admin)
│   ├── main.jsx             # Entry point React
│   └── index.css            # Global styles
├── server/
│   ├── src/
│   │   ├── index.ts         # Express API (JWT + Prisma)
│   │   └── seed.ts          # Dados iniciais
│   └── prisma/
│       └── schema.prisma    # 8 modelos de dados
├── google-sheets-sync/
│   └── Code.gs              # Apps Script — backup Google Sheets
├── .github/workflows/
│   └── ci.yml               # CI/CD → Vercel + Railway
├── .env.example             # Variáveis de ambiente
├── vercel.json              # Config deploy frontend
└── README.md
```

---

## 🤖 Integração Claude AI — Cookbooks Pattern

O **Sentinel AI** usa o padrão **Agentic Loop with Tool Use** dos Claude Cookbooks:

```javascript
// 1. Definição de ferramentas (Tool Use)
const AI_TOOLS = [
  { name: 'get_stats',      description: 'Estatísticas em tempo real' },
  { name: 'filter_events',  description: 'Filtrar eventos por status/tipo' },
  { name: 'analyze_revenue', description: 'Análise financeira' },
  { name: 'team_summary',   description: 'Resumo da equipe' },
]

// 2. Agentic Loop — Claude Cookbooks pattern
// Continua chamando a API enquanto stop_reason === 'tool_use'
while (data.stop_reason === 'tool_use') {
  const results = uses.map(u => runTool(u.name, u.input, db))
  data = await callAPI([...msgs, assistantMsg, toolResults])
}
```

O assistente consulta o banco de dados em tempo real e responde em português.

---

## 🗄️ Banco de Dados — Prisma Schema

| Modelo | Campos principais |
|--------|-------------------|
| `User` | name, email, passwordHash, cpf, pix, cred, role |
| `Event` | title, type, date, time, location, pay, total, filled, status |
| `Vacancy` | title, type, pay, slots, req, status |
| `Quote` | client, type, totalValue, status, validUntil, contact |
| `QuoteItem` | description, quantity, unitPrice |
| `TeamMember` | name, role, cred, cpf, pix, status, eventsCount |
| `Registration` | userId, eventId, status, dataHash (SHA-256) |
| `AuditLog` | action, entity, userId, ipAddress |

---

## 🚀 Início Rápido

### 1. Frontend (React + Vite)
```bash
npm install
npm run dev
# → http://localhost:5173
```

### 2. Backend (Express + Prisma + SQLite)
```bash
cd server
npm install
cp ../.env.example .env      # configure DATABASE_URL e JWT_SECRET
npx prisma db push
npx tsx src/seed.ts           # popula dados iniciais
npm run dev
# → http://localhost:3333
```

### 3. Google Sheets Backup
1. Abra a [Planilha Brigada Camarão](https://docs.google.com/spreadsheets/d/1Ab02MPDSN9-VfNj9p_HhxI32VdJuhDsZb4yOvRUSlKA/edit)
2. **Extensões → Apps Script**
3. Cole o conteúdo de `google-sheets-sync/Code.gs`
4. Troque `API_BASE` pela URL do seu backend
5. Execute `setup()` → autorize → sync automático a cada 6h

---

## 🌐 Deploy Gratuito

### Frontend → Vercel
```bash
npm i -g vercel
vercel --prod
```
Configure as variáveis no Dashboard do Vercel:
- `VITE_API_URL` → URL do Railway
- `VITE_ANTHROPIC_KEY` → Sua chave Anthropic

### Backend → Railway
1. Crie projeto em [railway.app](https://railway.app)
2. Conecte o repositório, selecione a pasta `server/`
3. Adicione PostgreSQL (plugin Railway)
4. Configure:
   - `DATABASE_URL` (Railway gera automaticamente)
   - `JWT_SECRET` (gere um seguro)
   - `FRONTEND_URL` (URL do Vercel)

---

## 🔌 API Endpoints

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `GET` | `/api/health` | Health check | — |
| `POST` | `/api/auth/login` | Login JWT | — |
| `POST` | `/api/auth/register` | Cadastro | — |
| `GET/POST/PUT/DELETE` | `/api/events` | CRUD Eventos | Bearer |
| `GET/POST/PUT/DELETE` | `/api/vacancies` | CRUD Vagas | Bearer |
| `GET/POST/PUT/DELETE` | `/api/quotes` | CRUD Orçamentos | Bearer |
| `GET/POST/PUT/DELETE` | `/api/team` | CRUD Equipe | Bearer |
| `GET` | `/api/stats` | KPIs dashboard | Bearer |
| `GET` | `/api/export/all` | Export Sheets | x-api-key |

**API Key Sheets:** `brigada-sync-2026`

---

## 🛡️ Segurança

- **JWT** com expiração 24h
- **bcrypt** para hash de senhas (salt 12)
- **SHA-256** para integridade de registros
- **LGPD**: CPF nunca exportado para Sheets
- **CORS**: whitelist de origens
- **Headers**: X-Frame-Options DENY, nosniff

---

## 📱 Admin — Funcionalidades

- ✅ Dashboard 3 visões (Estratégico / Tático / Operacional)
- ✅ CRUD completo: Eventos, Vagas, Orçamentos, Equipe
- ✅ Filtros + busca em tempo real por entidade
- ✅ Exportar CSV → Google Sheets (backup direto)
- ✅ Sentinel AI (Claude) para análises em linguagem natural
- ✅ Banco de dados persistente (window.storage / SQLite / PostgreSQL)
- ✅ Modais de edição com validação
- ✅ Toast notifications + confirmação de exclusão
- ✅ Pipeline de orçamentos + métricas financeiras

---

<p align="center">
  <strong>🦐 Brigada Camarão — Prevenir · Combater · Salvar</strong><br/>
  <em>Desde 2009 · BH/MG · 13K+ seguidores</em>
</p>
