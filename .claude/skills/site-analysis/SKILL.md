---
name: site-analysis
description: >-
  Deep, data-driven audit of a website or landing page that produces a scored
  diagnosis and a client-ready PDF justifying every recommended change against
  current market standards. Use this whenever the user wants to analyze,
  audit, critique, "olhar", diagnosticar, or improve a website / landing page /
  homepage / página de vendas; whenever they ask WHY a page should change or
  want evidence to justify a redesign; whenever they mention conversion (CRO),
  bounce rate, SEO, Core Web Vitals, copy/messaging, trust/prova social, or
  "atualização de mercado" for a site; and whenever they want a before/after
  redesign rationale. Trigger even if the user only pastes a URL or HTML and
  says "what do you think?" or "melhora isso". Prefer this skill over ad-hoc
  commentary — the value is the repeatable rubric + evidence + PDF, not opinion.
---

# Site Analysis

## What this skill is for

Turn "this page feels off" into a **rigorous, evidence-backed diagnosis** and a
**PDF that justifies every proposed change** using current market standards for
the page's service category. The output is meant to survive a skeptical client
or founder asking "says who?" — so every finding carries evidence (a quoted
line, a measured number, a screenshot region, a named best practice), never
just taste.

This is a **product-grade, repeatable engine**, not a one-off opinion. Run it
the same way every time so two different pages get comparable scores.

## The non-negotiable rule: analyze real data, never invent it

The whole point is "based on data." So:

- **Only make claims you can back with evidence you actually gathered.** If you
  did not see the page, do not describe it. If you could not measure load time,
  say "not measured," don't guess a number.
- When a signal is missing, **say what's missing and how to get it** — that gap
  is itself a finding.
- Separate three tiers in the report: **Measured** (extracted/observed),
  **Benchmarked** (compared to a documented standard), and **Judgment**
  (expert inference). Never blur them.

## Step 0 — Get the page content (handle the common blockers)

You need the real page. Try these in order and use whatever works:

1. **Direct fetch** — `WebFetch` or `curl` the URL. If it returns the HTML,
   save it to the workspace as `page.html`.
2. **If fetch is blocked** (403, egress policy, Cloudflare, JS-only SPA, login
   wall): don't fight it. Ask the user to provide the content one of these ways,
   and tell them exactly how:
   - Paste the page source (`Ctrl+U` → select all → paste), or save the page
     (`Ctrl+S`, "Webpage, Complete") and share the `.html`.
   - Send full-page screenshots (desktop **and** mobile — mobile is where most
     service traffic is).
   - Provide any analytics they have (GA4 bounce/conversion, heatmaps, ad data).
3. **If a browser is available** (Playwright/Chromium is often pre-installed):
   render the page yourself to capture the post-JS DOM and a screenshot. See
   `references/tooling.md`.

Record which method you used — it affects confidence. A screenshots-only audit
can judge design and copy but cannot measure performance or read meta tags.

## Step 1 — Extract the hard signals (this is what makes it "data")

Run the bundled extractor on the saved HTML to pull objective signals so the
audit rests on facts, not vibes:

```bash
python3 scripts/extract_signals.py page.html --json > signals.json
python3 scripts/extract_signals.py page.html            # human-readable summary
```

It reports (stdlib only, no installs): title & meta description (with length vs.
SEO targets), viewport/lang/charset, Open Graph & Twitter cards, JSON-LD schema
types, full heading outline (and H1 count/order problems), word count, image
count & **alt-text coverage %**, link inventory (internal/external, and CTA-like
anchors), forms and every field, and detected marketing/analytics tech (GA4,
GTM, Meta Pixel, hotjar, etc.). Read `signals.json` before writing findings.

For performance and Core Web Vitals (LCP/CLS/INP), which static HTML can't give
you, see `references/tooling.md` for how to measure with the browser or ask the
user for a PageSpeed/Lighthouse run.

## Step 2 — Score every dimension against the rubric

Grade the page on the twelve dimensions in
`references/analysis-framework.md`. That file is the heart of the skill: for
each dimension it lists what to inspect, the market standard to compare
against, and a 0–100 scoring rubric with concrete anchors. Read it in full and
score each dimension **with evidence attached to every score**.

The twelve dimensions:

1. Positioning & value proposition (above-the-fold clarity)
2. Messaging & copy (benefit-led, specific, proof-backed)
3. Conversion path & CTAs (offer, friction, form design)
4. Trust & social proof
5. Information architecture & page flow
6. Visual design & brand system
7. Mobile & responsive experience
8. Performance & Core Web Vitals
9. SEO & discoverability
10. Accessibility (WCAG)
11. Analytics & measurement readiness
12. Market fit & competitive positioning (the "atualização de mercado")

Compute an overall weighted score (weights are in the framework file — CRO and
value-prop count more than, say, schema markup).

## Step 3 — Benchmark to the market, by category

Identify the page's **service category** (gym/academia, course/infoproduct,
clinic, agency, SaaS, local service, etc.) and compare against the current
standards and patterns for that category in `references/market-standards.md`.
This is what backs the "thinking about the market update for this type of
service" requirement — each recommendation should cite the standard it's
meeting, not just "looks nicer."

## Step 4 — Write findings as a prioritized change list

Every finding uses this shape so it's actionable and defensible:

```
[Dimension] [Severity: Critical / High / Medium / Low]
Finding: <what's wrong, one sentence>
Evidence: <Measured/Benchmarked/Judgment> — <the specific proof>
Impact: <which metric this hurts: conversion, bounce, trust, reach…>
Recommendation: <the specific change>
Why now (market): <the standard/trend this aligns to>
Effort: <S / M / L>
```

Then rank by **impact ÷ effort** so the top of the list is the highest-leverage
work. Put this ranked list in the report as the "Roadmap."

## Step 5 — Produce the report and the PDF

Build the report from `assets/report-template.html` (a styled, self-contained,
print-optimized template) and render it to PDF. Full instructions, including
the Chromium print-to-PDF command and a WeasyPrint fallback, are in
`references/report-and-pdf.md`. The report must contain, in order: executive
summary + overall score, the scorecard (all 12 dimensions), the evidence-backed
findings, the market benchmark, the prioritized roadmap, and an appendix with
the raw `signals.json` so the numbers are auditable.

Deliver the PDF with `SendUserFile` when available.

## Optional Step 6 — Redesign direction

If the user wants the rebuild (not just the audit), translate the top findings
into a concrete redesign: new above-the-fold, section-by-section wireframe in
words, and revised copy. Keep it traceable — each redesign choice should map
back to a finding. Implementation stack (React, Apps Script HTML Service, etc.)
is the user's call; ask if unspecified.

## Reference files

- `references/analysis-framework.md` — the 12 dimensions, what to inspect,
  standards, and 0–100 rubrics. **Read this every run.**
- `references/market-standards.md` — current landing-page standards by service
  category; the evidence base for "market update" claims.
- `references/report-and-pdf.md` — report structure + how to render the PDF.
- `references/tooling.md` — fetching blocked pages, browser rendering,
  measuring Core Web Vitals.
- `scripts/extract_signals.py` — stdlib HTML signal extractor.
- `assets/report-template.html` — print-ready report template.
