# site-analysis

A Claude skill that runs a **deep, data-driven audit of a website or landing
page** and produces a **client-ready PDF that justifies every recommended
change against current market standards**. Built to be a repeatable product,
not a one-off opinion.

## What it does

1. **Gets the real page** (fetch, or user-provided HTML/screenshots when the
   environment blocks the fetch).
2. **Extracts hard signals** with `scripts/extract_signals.py` (stdlib only):
   SEO/meta, heading outline, image alt coverage, links & CTAs, forms & fields,
   and marketing/analytics tech.
3. **Scores 12 dimensions** against a 0–100 rubric
   (`references/analysis-framework.md`) — value prop, copy, CRO, trust, IA,
   design, mobile, performance/CWV, SEO, accessibility, analytics, market fit.
4. **Benchmarks to the market** by service category
   (`references/market-standards.md`) — the evidence for "atualização de mercado."
5. **Writes prioritized, evidence-tagged findings** (Measured / Benchmarked /
   Judgment) ranked by impact ÷ effort.
6. **Renders a PDF report** from `assets/report-template.html` via headless
   Chromium (`scripts/render_pdf.sh`).

## Quick start

```bash
# 1. signals from a saved page
python3 scripts/extract_signals.py page.html --json > signals.json

# 2. (Claude fills assets/report-template.html -> report.html following SKILL.md)

# 3. render the PDF
bash scripts/render_pdf.sh report.html report.pdf
```

## Design principles

- **Never invent data.** Absent signals are reported absent; every claim is
  tagged by evidence tier.
- **Portable.** Extraction is stdlib-only; PDF uses pre-installed Chromium with
  a WeasyPrint / `pdf`-skill fallback.
- **Defensible.** Recommendations cite the market standard they meet, so the
  PDF survives a skeptical client.

## Layout

```
site-analysis/
├── SKILL.md                     # workflow (read first)
├── references/
│   ├── analysis-framework.md    # 12 dimensions + 0-100 rubric  (read every run)
│   ├── market-standards.md      # standards by service category
│   ├── report-and-pdf.md        # report structure + PDF rendering
│   └── tooling.md               # fetching, browser rendering, CWV measurement
├── scripts/
│   ├── extract_signals.py       # stdlib HTML signal extractor
│   └── render_pdf.sh            # HTML -> PDF (Chromium / WeasyPrint)
├── assets/
│   └── report-template.html     # print-ready report template
└── evals/
    ├── evals.json               # test prompts + assertions
    └── sample.html              # offline test page
```

## Roadmap (productization)

- Live-fetch + browser render wired into the extractor (post-JS DOM, screenshots).
- Lighthouse/PSI integration for real Core Web Vitals.
- Automated competitor pull for the market benchmark.
- A/B redesign generator (audit → wireframe → copy) with stack targets
  (React, Apps Script HTML Service, etc.).
