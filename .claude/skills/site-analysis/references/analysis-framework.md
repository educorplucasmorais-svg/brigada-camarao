# Analysis Framework — 12 Dimensions

Read this in full on every run. Score each dimension 0–100 using the anchors
below, and attach evidence to every score. The anchors describe what a given
band looks like; interpolate for in-between pages.

Evidence tiers (tag every finding):
- **Measured** — pulled from `signals.json`, the DOM, a Lighthouse/PSI run, or
  the user's analytics.
- **Benchmarked** — compared to a documented standard (cite it, see
  `market-standards.md`).
- **Judgment** — expert inference where no measurement exists; allowed, but
  labeled so, and used sparingly.

## Weighting for the overall score

Weighted mean of the 12 dimension scores. Weights reflect what actually moves
outcomes for a service landing page:

| # | Dimension | Weight |
|---|-----------|-------:|
| 1 | Positioning & value proposition | 15% |
| 2 | Messaging & copy | 12% |
| 3 | Conversion path & CTAs | 15% |
| 4 | Trust & social proof | 10% |
| 5 | Information architecture & flow | 7% |
| 6 | Visual design & brand system | 8% |
| 7 | Mobile & responsive | 8% |
| 8 | Performance & Core Web Vitals | 8% |
| 9 | SEO & discoverability | 6% |
| 10 | Accessibility | 4% |
| 11 | Analytics & measurement | 3% |
| 12 | Market fit & competitive positioning | 4% |

Report the overall as a 0–100 number plus a letter band: A (85+), B (70–84),
C (55–69), D (40–54), F (<40).

---

## 1. Positioning & value proposition (weight 15%)

**Inspect:** The above-the-fold zone. Within 5 seconds, can a first-time
visitor answer: What is this? Who is it for? What do I get? Why you and not a
competitor? Is there one obvious next action?

**Standard:** A single, specific, outcome-oriented headline; a supporting
subhead that adds the "how/for whom"; one primary CTA visible without scrolling.
Vague taglines ("Excelência em cada detalhe") fail — they describe the seller,
not the buyer's outcome.

**Rubric:**
- 85–100: Instantly clear who/what/outcome; differentiated; single strong CTA.
- 70–84: Clear offer, weak differentiation or a soft CTA.
- 55–69: Requires scrolling/inference to understand the offer.
- 40–54: Generic slogan; no clear audience or outcome.
- <40: Cannot tell what is sold or to whom.

## 2. Messaging & copy (weight 12%)

**Inspect:** Do headings lead with benefits/outcomes or with features/internal
jargon? Is language specific (numbers, timeframes, named outcomes) or filler?
Is it written to the reader ("você") or about the company ("nós somos")? One
idea per section? Scannable?

**Standard:** Benefit-led, concrete, second-person, proof-adjacent. Every claim
that can be quantified, is. Removes hedging and superlatives without proof.

**Rubric:**
- 85–100: Specific, benefit-led, customer-voiced, proof next to claims.
- 70–84: Mostly benefit-led; some generic filler or feature-dumping.
- 55–69: Feature/company focused; vague adjectives dominate.
- 40–54: Jargon or slogans; little real information.
- <40: Copy communicates nothing actionable.

## 3. Conversion path & CTAs (weight 15%)

**Inspect (use signals.json forms + link inventory):** Is there a primary
conversion action, repeated at natural decision points? Is CTA copy specific
("Agendar aula grátis") vs. generic ("Enviar")? Form field count and whether
each field is justified (every extra field costs conversions). Friction: logins,
captchas, PDFs, dead ends. Is WhatsApp/click-to-call present for local service?
Is there a low-commitment offer (free trial, quote, assessment)?

**Standard:** One primary conversion goal; CTA repeated ~every 1–2 viewport
heights; minimum viable form fields; a concrete, low-risk first step; mobile
click-to-call/WhatsApp for local services.

**Rubric:**
- 85–100: Clear single goal, specific repeated CTAs, minimal-friction offer.
- 70–84: Good CTA but too many fields or only one CTA far down the page.
- 55–69: CTA present but generic/buried; notable friction.
- 40–54: Unclear what to do next; heavy forms; dead ends.
- <40: No conversion path at all.

## 4. Trust & social proof (weight 10%)

**Inspect:** Testimonials (with name/photo/result vs. anonymous), ratings,
client/partner logos, case results with numbers, certifications, guarantees,
real team/location, verifiable contact. For regulated services (health, legal,
finance), required credentials.

**Standard:** Specific, attributable proof placed near the ask. Named
testimonials with outcomes beat anonymous praise; quantified results beat
adjectives; recognizable logos and real photos beat stock.

**Rubric:**
- 85–100: Multiple attributable, specific proofs positioned near CTAs.
- 70–84: Some proof but generic or thin.
- 55–69: Only anonymous or vague testimonials.
- 40–54: Almost no trust signals.
- <40: None; or signals that read as fake/stock.

## 5. Information architecture & page flow (weight 7%)

**Inspect:** Section order tells a story (hook → problem → solution → proof →
offer → objection handling → CTA)? Logical hierarchy? No redundant or orphan
sections? Nav helps rather than distracts (landing pages often need *less* nav)?

**Standard:** A deliberate narrative arc that moves a cold visitor toward the
action, with progressive disclosure and objection handling before the ask.

**Rubric:**
- 85–100: Clear persuasive arc; every section earns its place.
- 70–84: Reasonable order; a couple of weak/misplaced sections.
- 55–69: Sections feel arbitrary; arc unclear.
- 40–54: Confusing or repetitive structure.
- <40: No discernible structure.

## 6. Visual design & brand system (weight 8%)

**Inspect:** Consistent type scale, spacing, and color system? Deliberate visual
hierarchy guiding the eye to CTAs? Image quality (bespoke vs. generic stock)?
Contrast and legibility? Does it look current or dated (e.g., tiny cramped type,
skeuomorphic bevels, 2012-era carousels)?

**Standard:** A coherent design system, generous whitespace, strong hierarchy,
authentic imagery, and a modern-but-not-trendy aesthetic appropriate to the
category.

**Rubric:**
- 85–100: Cohesive, modern, hierarchy clearly serves conversion.
- 70–84: Solid but generic; minor inconsistency.
- 55–69: Dated or inconsistent; hierarchy unclear.
- 40–54: Visually noisy or amateur.
- <40: Broken/unstyled/illegible.

## 7. Mobile & responsive (weight 8%)

**Inspect (signals.json viewport + screenshots):** Viewport meta present? Tap
targets ≥44px? Text legible without zoom? No horizontal scroll? Sticky mobile
CTA / click-to-call? Images sized for mobile? Given most service traffic is
mobile, judge the mobile experience as primary, not an afterthought.

**Standard:** Mobile-first: thumb-reachable CTAs, legible type, fast, no layout
breakage, sticky action bar for calls/WhatsApp.

**Rubric:**
- 85–100: Excellent mobile UX; sticky/reachable actions.
- 70–84: Responsive but not optimized (small taps, no sticky CTA).
- 55–69: Usable but awkward on mobile.
- 40–54: Significant mobile breakage.
- <40: Not usable on mobile / no viewport meta.

## 8. Performance & Core Web Vitals (weight 8%)

**Inspect:** LCP, CLS, INP (needs a browser or PSI/Lighthouse run — see
`tooling.md`). Static proxies from HTML: page weight, number/size of images,
render-blocking scripts, missing width/height on images (CLS risk), no
lazy-loading. If you truly can't measure, score from the static proxies and
mark **Judgment**, and recommend a Lighthouse run.

**Standard (Google CWV "good"):** LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms; mobile
weight budget in the low single-digit MB; images optimized/next-gen formats.

**Rubric:**
- 85–100: All three CWV in "good"; lean assets.
- 70–84: One metric "needs improvement."
- 55–69: Two metrics off, or heavy unoptimized assets.
- 40–54: Poor CWV / very heavy page.
- <40: Broken or extremely slow.

## 9. SEO & discoverability (weight 6%)

**Inspect (signals.json):** Title tag quality/length (~50–60 chars), meta
description (~150–160), exactly one H1, logical heading hierarchy, descriptive
alt text coverage, Open Graph/Twitter cards for sharing, JSON-LD schema
(LocalBusiness, Organization, Product, FAQ as relevant), canonical, indexable.

**Standard:** Unique keyword-aligned title/description, clean heading hierarchy,
alt text on meaningful images, social cards, and structured data matching the
business type.

**Rubric:**
- 85–100: Strong meta, clean hierarchy, schema + OG present.
- 70–84: Decent meta; missing schema or some alt text.
- 55–69: Weak/duplicate meta; hierarchy issues.
- 40–54: Missing title/description/H1; no OG.
- <40: Effectively invisible to search/social.

## 10. Accessibility (weight 4%)

**Inspect:** `lang` set, alt text on informative images, color contrast (WCAG AA
4.5:1 body / 3:1 large), keyboard/focusable controls, form labels, no
information-by-color-only, semantic landmarks. Accessibility overlaps SEO and
widens the reachable audience — it's not just compliance.

**Standard:** WCAG 2.1 AA on the essentials: contrast, labels, alt text, focus,
language.

**Rubric:**
- 85–100: Meets AA essentials.
- 70–84: Minor issues (a few contrast/alt gaps).
- 55–69: Several AA failures.
- 40–54: Broadly inaccessible.
- <40: Unusable with assistive tech.

## 11. Analytics & measurement readiness (weight 3%)

**Inspect (signals.json tech detection):** Is anything measuring behavior — GA4,
GTM, Meta/TikTok pixel, server events, call tracking? Are conversions
trackable (form submit, WhatsApp click)? You can't optimize what you can't
measure, so absence of analytics is itself a high-value finding.

**Standard:** At least GA4 + a conversion event on the primary action; ad
pixels if the business runs paid traffic; consent handling where required.

**Rubric:**
- 85–100: Analytics + conversion events + pixels wired.
- 70–84: Analytics present, conversions not clearly tracked.
- 55–69: Basic pageview analytics only.
- 40–54: Fragmentary/broken tracking.
- <40: No measurement at all.

## 12. Market fit & competitive positioning (weight 4%)

**Inspect:** Does the page meet the *current* expectations for its category
(see `market-standards.md`)? Is it differentiated from local/online
competitors, or interchangeable? Does it reflect where the category is going
(e.g., booking/self-serve, WhatsApp-first, video, transparent pricing,
community/social proof) or where it was five years ago?

**Standard:** Meets or exceeds current category norms and stakes a clear,
defensible position.

**Rubric:**
- 85–100: Modern for the category and clearly differentiated.
- 70–84: Meets norms; undifferentiated.
- 55–69: Slightly behind current norms.
- 40–54: Clearly dated vs. competitors.
- <40: Years behind; would lose every head-to-head.

---

## Turning scores into the overall verdict

1. Multiply each dimension score by its weight; sum for the 0–100 overall.
2. Assign the letter band.
3. In the executive summary, lead with the overall, then the 2–3 dimensions
   dragging it down the most (score × weight = biggest point loss), because
   those are where the redesign creates the most value.
