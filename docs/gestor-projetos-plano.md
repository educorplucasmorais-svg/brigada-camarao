# Gestor de Projetos — App Kanban (Apps Script + Google Sheets)

## Contexto

Lucas presta serviço para empresas (a primeira é a **Brigada Camarão**, cujo site já foi entregue e vive no repo atual). Novos produtos serão entregues à mesma empresa e a outros clientes. Falta uma ferramenta **própria** para gerir essa carteira de entregas: hoje não existe nada disso no repositório — não há board, tarefa, drag & drop, apontamento de horas nem modelo de projeto (verificado por varredura no `src/` e no `server/prisma/schema.prisma`).

A necessidade, na prática:

- Ver **todos os projetos/soluções** de todos os clientes em um só lugar, com prioridade e saúde de prazo.
- Um **quadro estilo Trello**, com arrastar e soltar entre colunas, distinguindo o que é **bug**, **correção**, **feature**, **release/versionamento**.
- Ao **clicar no projeto**, abrir o detalhe com **campos editáveis** e as **etapas** da entrega; marcar o *check* a cada etapa cumprida, mantendo o progresso atualizado.
- **Registro de horas consumidas** por solução.
- **Recursos/ferramentas utilizados** por solução.
- Visual atraente, gestão manual e intuitiva: mover, mapear e entender onde cada processo está.

**Decisão de arquitetura (definida pelo usuário):** Node.js + **clasp** + **Google Apps Script**, com uma **planilha do Google Sheets como banco de dados** e a interface servida por `HtmlService`. Pasta local versionada com os arquivos `.gs` e `.html`. Multiusuário (eu + equipe), identidade visual própria (não herda a marca do cliente).

**Por que faz sentido:** zero custo de infraestrutura, zero servidor para manter, autenticação e compartilhamento resolvidos pela própria conta Google, dados auditáveis e editáveis direto na planilha, e o repo já tem precedente de Apps Script (`google-sheets-sync/Code.gs`).

---

## Onde este plano será executado

Repositório de destino: `https://github.com/caramelosmartsolution-ai/Gest-o-de-Projetos-`.

**Esta sessão não alcança esse repo** — `add_repo` retorna `cross-tier adds are not supported` (a sessão nasceu com `educorplucasmorais-svg/brigada-camarao`) e a API do GitHub nega leitura. Decisão do usuário: **abrir uma nova sessão tendo o repo novo como fonte** e construir direto lá, no escopo completo.

Portanto, nesta sessão a única ação é **versionar este plano** em `docs/gestor-projetos-plano.md` na branch `claude/epp-product-management-vkn6by`, para que ele seja acessível pelo GitHub e possa ser colado/lido na nova sessão.

Pré-requisito da nova sessão: o GitHub App do Claude precisa estar instalado na organização `caramelosmartsolution-ai` (senão a nova sessão também será negada). Como a estrutura abaixo é **raiz-completa e autocontida**, o conteúdo de `gestor-projetos/` passa a ser a raiz do repo novo — ou seja, na nova sessão os arquivos nascem direto na raiz, sem essa pasta-mãe.

---

## Estrutura de arquivos

```
gestor-projetos/                 # = raiz do repo novo
├── package.json                 # scripts: dev, push, pull, open, deploy, seed
├── .clasp.json.example          # scriptId (o .clasp.json real fica no .gitignore)
├── .claspignore
├── .gitignore
├── README.md                    # passo a passo: clasp login → create → push → deploy
├── src/                         # rootDir do clasp (o que sobe pro Apps Script)
│   ├── appsscript.json          # V8, timeZone America/Sao_Paulo, webapp, oauthScopes
│   ├── Config.gs                # abas, colunas, enums (colunas do board, tipos, prioridades), cores
│   ├── Setup.gs                 # setup(): cria planilha + abas + cabeçalhos + formatação + semente
│   ├── Db.gs                    # micro-ORM sobre Sheets: list/get/insert/update/remove/reorder
│   ├── Auth.gs                  # e-mail da sessão → aba Usuarios → papel; guard de toda API
│   ├── Api.gs                   # funções expostas ao client via google.script.run
│   ├── Metrics.gs               # progresso, farol de prazo, horas, contadores de bug
│   ├── Triggers.gs              # onOpen (menu na planilha) + gatilho diário de recálculo
│   ├── WebApp.gs                # doGet() + include()
│   └── ui/
│       ├── Index.html           # shell da SPA
│       ├── styles.css.html      # design system próprio (tokens dark premium)
│       ├── app.js.html          # store, router, render, toasts, undo
│       ├── dnd.js.html          # drag & drop próprio (Pointer Events, funciona no touch)
│       ├── board.js.html        # Kanban
│       ├── project.js.html      # detalhe: etapas, horas, recursos, versões
│       └── views.js.html        # portfólio, timesheet, configurações
└── tools/
    ├── dev-server.mjs           # Node: preview local com google.script.run mockado
    └── mock-data.json           # dados de exemplo para o preview
```

Observação técnica: o clasp preserva subpastas (o arquivo vira `ui/Index.html` no editor do Apps Script), então `include('ui/styles.css')` funciona normalmente.

---

## Modelo de dados (abas da planilha)

Uma aba por entidade, primeira linha de cabeçalho, coluna `id` (UUID) como chave.

| Aba | Campos |
|---|---|
| `Clientes` | id, nome, contato, email, telefone, obs |
| `Projetos` | id, cliente_id, nome, codigo, descricao, status (ativo/pausado/entregue/arquivado), prioridade, versao_atual, data_inicio, prazo, valor_contrato, horas_estimadas, cor, tags, criado_em, atualizado_em |
| `Etapas` | id, projeto_id, ordem, titulo, descricao, **concluida**, data_prevista, data_conclusao, responsavel, peso |
| `Cards` | id, projeto_id, etapa_id, titulo, descricao, **tipo** (feature/bug/correcao/melhoria/release/suporte), **prioridade** (baixa/media/alta/critica), **coluna** (backlog/em_andamento/revisao/bloqueado/entregue), ordem, responsavel, prazo, estimativa_h, versao_alvo, criado_em, concluido_em |
| `Horas` | id, data, projeto_id, card_id, responsavel, minutos, descricao, faturavel |
| `Recursos` | id, projeto_id, nome, categoria (infra/api/lib/servico/design/hardware), fornecedor, custo_mensal, custo_unico, status, link, obs |
| `Versoes` | id, projeto_id, tag (semver), data, tipo (major/minor/patch), notas, status (planejada/publicada) |
| `Usuarios` | email, nome, papel (owner/editor/viewer), ativo |
| `Log` | timestamp, email, acao, entidade, entidade_id, detalhe |

`Setup.gs` cria tudo, aplica congelamento de cabeçalho, largura de coluna, validação de dados nos campos de enum e cores por aba — a planilha fica utilizável na mão também.

---

## Telas

1. **Portfólio (home)** — grade de cartões de projeto: barra de progresso (etapas concluídas ÷ total), **farol de prazo** (no prazo / atenção / atrasado, calculado em `Metrics.gs`), horas consumidas vs. estimadas, versão atual, próxima etapa com data, contador de bugs abertos. Filtros por cliente, status e prioridade + faixa de KPIs no topo.
2. **Quadro (Kanban)** — colunas **Backlog · Em andamento · Em revisão · Bloqueado · Entregue**. Arrastar entre colunas e reordenar dentro da coluna. Cartão com faixa de cor por **tipo**, selo de **prioridade**, responsável, chip de **prazo** (vermelho quando atrasado), chip de **versão-alvo** e horas lançadas. Filtro por projeto (ou "todos"), tipo e responsável; opção de raias por projeto.
3. **Detalhe do projeto** — abre ao clicar no projeto (painel lateral amplo). Campos **editáveis inline** (nome, descrição, prazo, valor, versão, status, prioridade) com salvamento automático; **Etapas** com checkbox e reordenação por arraste + barra de progresso que atualiza na hora; **Horas** (lista, cronômetro e lançamento manual, com total); **Recursos utilizados** (tabela editável); **Versões/changelog**; atividade recente vinda do `Log`.
4. **Timesheet** — lançamentos de horas com filtros (projeto, período, responsável, faturável) e totalizadores.
5. **Configurações** — usuários e papéis, clientes, exportação/backup.

**Identidade visual:** tema escuro próprio, superfícies em camadas, cantos generosos, tipografia Manrope/Inter, uma cor de acento âmbar/dourada (marca própria, distinta do vermelho do cliente), micro-animações discretas e respeito a `prefers-reduced-motion`. Tokens em `styles.css.html`, nada de hex solto nos componentes.

---

## Decisões técnicas que sustentam o app

- **Uma chamada de boot:** `getBootstrap()` devolve todas as abas de uma vez; a UI trabalha em memória. Cache em `CacheService` (invalidado a cada escrita).
- **UI otimista:** toda ação aplica na hora e chama `google.script.run` com `withFailureHandler` para reverter e avisar via toast — indispensável, porque cada chamada leva de 200 ms a 1 s.
- **Concorrência (multiusuário):** `LockService.getScriptLock()` em toda escrita, com timeout; escrita por `id`, nunca por índice de linha memorizado no cliente.
- **Papéis:** deploy como *"executar como usuário que acessa"*; `Session.getActiveUser().getEmail()` cruzado com a aba `Usuarios`. Quem roda o `setup()` vira `owner`. `viewer` recebe a UI em modo leitura (é a base para, depois, dar acesso de acompanhamento ao cliente).
- **Drag & drop próprio** (`dnd.js.html`, ~150 linhas, Pointer Events): funciona no iframe do `HtmlService` e no toque do celular, sem depender de CDN externa.
- **Preview local sem deploy:** `npm run dev` sobe `tools/dev-server.mjs`, que serve a UI e injeta um `google.script.run` falso servido por `mock-data.json`. Permite iterar o visual sem conta Google, e permite gerar capturas de tela do resultado.

---

## Ordem de execução

1. Esqueleto: `package.json`, `.clasp.json.example`, `.claspignore`, `appsscript.json`, `README.md`.
2. `Config.gs` + `Db.gs` + `Setup.gs` (planilha nasce completa e semeada com o projeto "Site Brigada Camarão" já preenchido, como exemplo real).
3. `Auth.gs` + `Api.gs` + `Metrics.gs` + `WebApp.gs` + `Triggers.gs`.
4. `tools/dev-server.mjs` + `mock-data.json` (para ver a UI antes de qualquer deploy).
5. UI: `styles.css.html` → `Index.html` → `app.js.html` → `dnd.js.html` → `board.js.html` → `project.js.html` → `views.js.html`.
6. `README.md` final com o passo a passo de instalação e o comando de migração para o repo novo.

## Verificação

- `npm run dev` e navegar: portfólio → quadro → arrastar cartões entre colunas → abrir projeto → marcar etapa → lançar horas → adicionar recurso. Conferir em desktop e em largura de celular (captura de tela via Playwright, já disponível no ambiente).
- `node --check` em todos os `.gs` e nos blocos de JS (o dev-server carrega e valida os módulos).
- No Apps Script (executado pelo usuário, exige `clasp login` interativo): `clasp push` → rodar `setup()` → conferir as 9 abas criadas → `clasp deploy` → abrir a URL do webapp → repetir o roteiro acima com dados reais → abrir a planilha e confirmar que as linhas refletem as ações.
- Multiusuário: adicionar um segundo e-mail na aba `Usuarios` como `editor`, abrir em outra conta e mover um cartão; confirmar que a alteração aparece para o outro usuário após atualizar.
