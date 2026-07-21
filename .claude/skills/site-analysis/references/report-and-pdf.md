# Report Structure & PDF Rendering

## Report structure (use this exact order)

The report is the deliverable. Build it from `assets/report-template.html`,
filling the placeholders. Keep this section order — it mirrors how a client
reads and decides:

1. **Cover** — page name/URL, date, analyst, overall score + letter band.
2. **Executive summary** — 4–6 sentences: the verdict, the 2–3 biggest
   point-losers, and the headline opportunity. A busy founder should get the
   whole story here.
3. **Scorecard** — all 12 dimensions as a table: score, weight, weighted
   points, one-line rationale. Include the overall.
4. **Findings** — grouped by severity (Critical → Low). Each finding uses the
   Step-4 shape (Finding / Evidence / Impact / Recommendation / Why-now / Effort)
   with the evidence tier tagged.
5. **Market benchmark** — the category, the standards being applied, and how
   2–3 current competitors compare. This is the "market update" spine.
6. **Prioritized roadmap** — the findings ranked by impact ÷ effort, as a table
   the client can execute top-down. Optionally group into Quick wins / Structural
   / Strategic.
7. **Appendix** — the raw extracted `signals.json` (or a readable rendering of
   it) so every number is auditable, plus method notes (how the page was
   obtained, what was measured vs. inferred).

Keep claims tagged Measured / Benchmarked / Judgment throughout.

## Rendering the PDF

The template is self-contained and print-optimized (`@page` + print CSS). Render
HTML → PDF with whatever is available, in this order:

### Option A — Headless Chromium (preferred; usually pre-installed)

```bash
# Find the Chromium binary (Playwright installs under /opt/pw-browsers)
CHROME=$(command -v chromium || command -v chromium-browser || command -v google-chrome || ls /opt/pw-browsers/chromium*/chrome-linux/chrome 2>/dev/null | head -1)
"$CHROME" --headless --no-sandbox --disable-gpu \
  --print-to-pdf=report.pdf --no-pdf-header-footer \
  --print-to-pdf-no-header report.html
```

If the `--print-to-pdf` flags vary by build, the Playwright Python API is the
robust path:

```python
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page()
    pg.goto("file:///abs/path/report.html", wait_until="networkidle")
    pg.pdf(path="report.pdf", format="A4", print_background=True,
           margin={"top":"14mm","bottom":"14mm","left":"12mm","right":"12mm"})
    b.close()
```

### Option B — WeasyPrint (if installed)

```bash
python3 -c "from weasyprint import HTML; HTML('report.html').write_pdf('report.pdf')"
```

### Option C — the bundled `pdf` skill

If a separate `pdf` skill is available in the environment, hand it the HTML.
Don't reinvent conversion if a dedicated tool exists.

## Charts without dependencies

For the scorecard visual, prefer **inline SVG** bars in the HTML (no JS, no CDN
— required if the PDF renderer runs offline). A horizontal bar per dimension
whose width = score% and whose color follows the band (A green → F red) reads
well in print. The template includes a helper pattern; keep colorblind-safe
hues and never encode meaning by color alone (label the number too).

## Delivery

Render, then send the PDF to the user with `SendUserFile` (status `proactive`
if they're away). Also keep `report.html` and `signals.json` in the workspace so
the analysis is reproducible and re-renderable.
