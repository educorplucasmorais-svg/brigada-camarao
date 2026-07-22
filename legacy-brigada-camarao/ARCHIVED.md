# Arquivado — Brigada Camarão

Esta pasta contém o projeto **Brigada Camarão** (app React + TypeScript com
servidor Node/Prisma, sync com Google Sheets, deploy na Vercel) que ocupava a
raiz deste repositório antes do pivô para o projeto **Academy Zaya + skill
site-analysis**.

- **Motivo:** o repositório foi reaproveitado para um novo projeto.
- **Como foi movido:** `git mv` de todos os arquivos da raiz para cá — nada foi
  perdido, e o histórico completo continua no git.
- **Recuperar:** `git mv legacy-brigada-camarao/<item> .` traz de volta para a
  raiz. Ou consulte o histórico anterior à branch `claude/academy-zaya-redesign-jlukd3`.
- **Remover de vez:** apagar esta pasta e commitar.

> Observação: os workflows de CI e o `vercel.json` originais foram movidos para
> cá, então não rodam mais no novo projeto. Se o app Brigada Camarão ainda
> estiver em produção na Vercel a partir do `main`, o `main` não foi tocado —
> esta mudança está só na branch de feature.
