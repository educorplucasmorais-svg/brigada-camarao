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
├── apps-script/                    → nova landing em Apps Script (rebuild)
├── analysis/                       → auditoria + PDF do Academy Zaya
└── legacy-brigada-camarao/         → app anterior (Brigada Camarão) arquivado
```

## Status atual

- ✅ Skill `site-analysis` criada e validada de ponta a ponta (extração de
  sinais → placar de 12 dimensões → benchmark de mercado → PDF). Veja
  `.claude/skills/site-analysis/README.md`.
- ✅ Repositório limpo para o novo projeto (app antigo arquivado em
  `legacy-brigada-camarao/`, recuperável pelo histórico do git).
- ✅ **Auditoria real do Academy Zaya:** nota **64/100 (C)**. Relatório e PDF
  em `analysis/` (`Auditoria-Academy-by-Zaya.pdf`).
- ✅ **Redesign em Apps Script:** nova landing leve e indexável em
  `apps-script/` (~25 KB vs 1,35 MB do Wix). Ver `apps-script/README.md`.
- ⏳ **Pendências para publicar:** URLs de checkout, depoimentos reais, fotos
  das mentoras, IDs de GA4/Meta Pixel e embed do VSL (tudo em `Code.gs`).

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
