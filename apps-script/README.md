# Academy by Zaya — landing (Google Apps Script)

Rebuild da landing `academyzaya.com.br` como **Web App do Google Apps Script
(HTML Service)** — leve, rápida e indexável. Baseado na auditoria em
[`/analysis`](../analysis).

## Arquivos

- `Code.gs` — `doGet()` que serve o HTML + objeto `CONFIG` (checkout, WhatsApp,
  pixels, VSL). **É aqui que você edita** as URLs e IDs.
- `index.html` — a landing (HTML + CSS inline, ~25 KB vs. 1,35 MB do Wix).
- `appsscript.json` — manifesto (Web App público, timezone SP, V8).
- `build_preview.py` — gera `preview.html` local (substitui os tokens do
  template) para você ver/testar sem publicar.

## O que mudou vs. o site atual (resumo da auditoria)

| Problema no Wix | Correção aqui |
|---|---|
| CTAs de compra com `href` vazio | Todo CTA é ligado ao checkout via `data-cta` + `CONFIG` |
| `noindex`, sem meta description, 9 `<H1>` | Indexável, meta description, **1 `<H1>`**, OG tags |
| Schema só `WebSite` | JSON-LD `Course` + `FAQPage` + `Organization` |
| Prova social falsa ("52 assistindo", "Caio garantiu") | Removida; depoimentos com nome/resultado reais |
| 1,35 MB + 32 scripts | ~25 KB, sem framework, fontes com preconnect |
| Preço/mês inconsistente com o à vista | Planos com valor à vista + /mês equivalente + % de desconto |
| Contraste baixo no mármore | Fundos sólidos atrás do texto |

## Configurar (antes de publicar)

Edite `CONFIG` no `Code.gs`:

```js
checkoutMensal / checkoutSemestral / checkoutAnual  // URLs reais de checkout
whatsapp        // link do WhatsApp
ga4Id           // ex.: 'G-XXXXXXX'  (vazio = desativado)
metaPixelId     // ex.: '1234567890'  (vazio = desativado)
vslEmbedUrl     // embed do vídeo VSL (vazio = mostra placeholder)
```

E no `index.html`, troque os placeholders `[Nome real]` / `[Depoimento real]`
pelos depoimentos verdadeiros e as iniciais das mentoras por fotos.

## Preview local (sem publicar)

```bash
python3 build_preview.py           # gera preview.html
# abra preview.html no navegador, ou:
bash ../.claude/skills/site-analysis/scripts/render_pdf.sh preview.html preview.pdf
```

## Publicar

**Opção A — Editor do Apps Script (manual):**
1. Crie um projeto em https://script.google.com
2. Cole `Code.gs`, e crie um arquivo HTML chamado `index` com o conteúdo de `index.html`
3. Cole o conteúdo de `appsscript.json` (ative "Mostrar appsscript.json" nas configurações)
4. Implantar → Nova implantação → **App da Web** → Acesso: **Qualquer pessoa**
5. Copie a URL `/exec` — essa é a landing publicada

**Opção B — clasp (linha de comando):**
```bash
npm i -g @google/clasp
clasp login
clasp create --type webapp --title "Academy by Zaya"
clasp push
clasp deploy
```

> Observação: o Web App do Apps Script tem uma URL `script.google.com/.../exec`.
> Para usar `academyzaya.com.br`, aponte via redirect/proxy ou considere hospedar
> o mesmo `index.html` estático (Netlify/Vercel/Cloudflare Pages) — o HTML é
> autossuficiente e não depende do backend do Apps Script.
