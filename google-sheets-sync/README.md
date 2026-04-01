# 🦐 Brigada Camarão — Google Sheets Backup Sync

## Visão Geral

Sistema de backup automático que sincroniza o banco de dados do app com o Google Sheets a cada 6 horas.

**Planilha:** [Abrir no Google Sheets](https://docs.google.com/spreadsheets/d/1Ab02MPDSN9-VfNj9p_HhxI32VdJuhDsZb4yOvRUSlKA/edit)

## Abas Criadas

| Aba | Tabela | Dados |
|-----|--------|-------|
| 🏠 Dashboard | — | KPIs, contadores, última sync |
| 👤 Usuários | `User` | Nome, email, role, status (sem senha!) |
| 🔥 Eventos | `Event` | Título, data, local, vagas, orçamento |
| 📋 Vagas | `Vacancy` | Cargo, quantidade, remuneração |
| 💰 Orçamentos | `Quote` | Cliente, tipo, valor, status |
| 📝 Itens Orçamento | `QuoteItem` | Descrição, quantidade, preço |
| 🧑‍🚒 Equipe | `TeamMember` | Nome, cargo, certificações |
| ✅ Inscrições | `Registration` | Usuário, evento, status, verificação |
| 📊 Audit Log | `AuditLog` | Ação, entidade, IP, timestamp |
| 📋 Sync Log | — | Histórico de sincronizações |

## Instalação (5 minutos)

### 1. Configurar a Planilha

1. Abra a planilha no Google Sheets
2. Menu: **Extensões → Apps Script**
3. Apague todo o código existente
4. Copie e cole o conteúdo de `Code.gs`
5. Salve (**Ctrl+S**)
6. Clique em **▶ Run** na função `setup`
7. Autorize as permissões quando solicitado

### 2. Configurar o Servidor

O backend precisa do endpoint de exportação. Verifique que `server/src/routes/export.ts` existe e está registrado no `server/src/index.ts`.

```bash
cd server
npm run dev
```

### 3. Para Produção (Deploy)

Altere `CONFIG.API_URL` no Apps Script:

```javascript
// De:
API_URL: 'http://localhost:3333/api/export/all',
// Para:
API_URL: 'https://sua-api.vercel.app/api/export/all',
```

> **Nota:** Para acessar `localhost` do Apps Script, use [ngrok](https://ngrok.com) como túnel temporário.

## Menu na Planilha

Após instalar, o menu **🦐 Brigada Camarão** aparece com:

- **🔄 Sincronizar Agora** — Puxa todos os dados do banco
- **📊 Atualizar Dashboard** — Recalcula KPIs das abas
- **🏗️ Criar/Recriar Abas** — (Re)cria todas as abas
- **🎨 Aplicar Formatação** — Zebra, cores, filtros
- **⏰ Ativar Sync Automático** — Trigger a cada 6h
- **⛔ Desativar Sync Automático** — Remove triggers

## Segurança (LGPD)

- ❌ Senhas **nunca** são exportadas
- 🔑 API protegida por `x-api-key` header
- 📋 Audit log registra todas as ações
- 🔒 Dados sensíveis (CPF, PIX) exportados apenas em abas protegidas

## API Endpoints

```
GET /api/export/all          → Exporta todas as tabelas
GET /api/export/table/:name  → Exporta tabela específica
```

Headers obrigatórios:
```
x-api-key: brigada-sync-2026
```

Tabelas válidas: `users`, `events`, `vacancies`, `quotes`, `quoteItems`, `teamMembers`, `registrations`, `auditLogs`
