# Academy Zaya — Redesign & Site Analysis Skill

Repositório do novo projeto. Dois objetivos:

1. **Produto: a skill `site-analysis`** — um motor repetível que audita uma
   landing page com base em dados e gera um **PDF que justifica cada mudança**
   contra o padrão atual de mercado. É o produto que estamos construindo.
2. **Redesign do Academy Zaya** — refazer a landing page
   (`academyzaya.com.br`) a partir do diagnóstico da skill, com implementação
   em **Google Apps Script (HTML Service)**.

## Estrutura

```
.
├── .claude/skills/site-analysis/   → a skill (o produto). Ver o README dela.
├── apps-script/                    → (a criar) a nova landing page em Apps Script
├── analysis/                       → (a criar) auditoria + PDF do Academy Zaya
└── legacy-brigada-camarao/         → app anterior (Brigada Camarão) arquivado
```

## Status atual

- ✅ Skill `site-analysis` criada e validada de ponta a ponta (extração de
  sinais → placar de 12 dimensões → benchmark de mercado → PDF). Veja
  `.claude/skills/site-analysis/README.md`.
- ✅ Repositório limpo para o novo projeto (app antigo arquivado em
  `legacy-brigada-camarao/`, recuperável pelo histórico do git).
- ⏳ **Auditoria real do Academy Zaya:** bloqueada — este ambiente não acessa
  `academyzaya.com.br` (política de rede/egress, HTTP 403). Precisa do conteúdo
  da página (HTML colado, página salva ou screenshots) para rodar a skill.
- ⏳ **Redesign em Apps Script:** depende da auditoria.

## Como rodar a skill

```bash
cd .claude/skills/site-analysis
python3 scripts/extract_signals.py <pagina>.html --json > signals.json
# Claude preenche assets/report-template.html seguindo SKILL.md
bash scripts/render_pdf.sh report.html report.pdf
```

## O app anterior

O conteúdo em `legacy-brigada-camarao/` é o projeto Brigada Camarão (app React
+ servidor Prisma) que ocupava este repositório. Foi arquivado, não apagado —
todo o histórico permanece no git. Para removê-lo de vez, basta apagar a pasta.
