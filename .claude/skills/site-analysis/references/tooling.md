# Tooling — Fetching, Rendering, Measuring

## Fetching the page

1. **`WebFetch` / `curl`** first. Save raw HTML to `page.html`.
2. **Blocked (403 / egress policy / 407)** — in some managed environments the
   outbound proxy denies certain domains by policy. Do **not** retry or route
   around it; that's an organization decision. Report it plainly and switch to
   user-provided content (paste source, save page, screenshots) or a
   user-run measurement. Say clearly it was the *environment*, not the site.
3. **SPA / JS-rendered** — a raw fetch returns an empty shell. Use a browser
   (below) to get the post-JS DOM, or ask the user to save the fully-rendered
   page.

## Rendering with a browser (post-JS DOM + screenshots)

Chromium is frequently pre-installed (Playwright under `/opt/pw-browsers`; do
not run `playwright install`). Use it to capture the real DOM and images:

```python
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width":390,"height":844}, is_mobile=True)  # mobile first
    pg.goto(URL, wait_until="networkidle")
    html = pg.content()
    open("page.html","w").write(html)
    pg.screenshot(path="mobile.png", full_page=True)
    pg.set_viewport_size({"width":1440,"height":900})
    pg.screenshot(path="desktop.png", full_page=True)
    b.close()
```

If the environment's proxy blocks the target domain, the browser will be blocked
too — fall back to user-provided content.

## Measuring Core Web Vitals / performance

Static HTML can't give real LCP/CLS/INP. Options, best first:

1. **PageSpeed Insights (field + lab)** — ask the user to run
   `https://pagespeed.web.dev/` on the URL and paste the LCP/CLS/INP and the
   opportunities list. This is the most credible source for the report.
2. **Local Lighthouse** if Node/Chrome available:
   `npx lighthouse <URL> --only-categories=performance --output=json --quiet`
   (needs network access to the target).
3. **Static proxies** from `signals.json` when nothing else is possible: page
   weight, image count/size, render-blocking scripts, missing image dimensions
   (CLS risk), no lazy-loading. Score from these and tag **Judgment**, and
   recommend a real Lighthouse/PSI run as the first roadmap item.

Always record which method produced each performance number so the report's
confidence is honest.
