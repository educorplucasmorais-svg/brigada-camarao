#!/usr/bin/env python3
"""
extract_signals.py — pull objective, auditable signals from a saved HTML page.

Stdlib only (html.parser) so it runs anywhere with no installs. Give it a saved
HTML file (or "-" for stdin). It reports the facts a data-driven site audit
rests on: meta/SEO tags, heading outline, images + alt coverage, links + CTA
candidates, forms + fields, and detected marketing/analytics tech.

Usage:
    python3 extract_signals.py page.html            # human-readable summary
    python3 extract_signals.py page.html --json     # machine-readable JSON
    curl -s URL | python3 extract_signals.py - --json

This is a static extractor: it sees the HTML as delivered, not the post-JS DOM.
For SPA/JS-rendered pages, feed it a browser-rendered page.html (see
references/tooling.md). It never fabricates: absent signals are reported absent.
"""
import sys
import json
import re
from html.parser import HTMLParser
from collections import Counter

# SEO length targets (characters) — widely used industry guidance.
TITLE_MIN, TITLE_MAX = 30, 60
DESC_MIN, DESC_MAX = 70, 160

# CTA-ish wording (pt-BR + en) used to flag conversion links/buttons.
CTA_WORDS = [
    "compr", "assin", "agend", "reserv", "matricul", "inscrev", "cadastr",
    "começ", "comec", "quero", "solicit", "orçament", "orcament", "contrat",
    "fale", "whatsapp", "chamar", "ligar", "agora", "grátis", "gratis", "teste",
    "experimente", "baixar", "download", "saiba", "conhec", "vem", "entrar",
    "buy", "subscribe", "book", "sign up", "signup", "get started", "start",
    "try", "free", "demo", "contact", "call", "learn more", "join", "register",
]

# Marketing / analytics tech fingerprints: label -> substrings to look for.
TECH_SIGNATURES = {
    "Google Analytics 4 (gtag)": ["gtag(", "googletagmanager.com/gtag", "G-"],
    "Google Tag Manager": ["googletagmanager.com/gtm", "GTM-", "dataLayer"],
    "Universal Analytics (legacy)": ["google-analytics.com/analytics.js", "ga('create"],
    "Meta/Facebook Pixel": ["connect.facebook.net", "fbq(", "fbevents.js"],
    "TikTok Pixel": ["analytics.tiktok.com", "ttq."],
    "Google Ads / Conversion": ["googleadservices.com", "google_conversion"],
    "Hotjar": ["hotjar.com", "hjSetting", "_hjSettings"],
    "Microsoft Clarity": ["clarity.ms", "clarity("],
    "LinkedIn Insight": ["snap.licdn.com", "_linkedin_partner_id"],
    "RD Station": ["rdstation", "d335luupugsy2.cloudfront"],
    "HubSpot": ["js.hs-scripts.com", "hubspot"],
    "WhatsApp link": ["wa.me/", "api.whatsapp.com", "whatsapp://"],
    "Intercom": ["widget.intercom.io", "intercomSettings"],
    "Crisp chat": ["client.crisp.chat"],
    "Tawk.to": ["tawk.to"],
    "jQuery": ["jquery"],
    "WordPress": ["/wp-content/", "/wp-includes/"],
    "React": ["react", "__NEXT_DATA__", "data-reactroot"],
    "Vue": ["vue.js", "__vue__", "data-v-"],
    "Wix": ["wix.com", "wixstatic"],
    "Squarespace": ["squarespace"],
    "Elementor": ["elementor"],
}


class SignalParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title_parts, self._in_title = [], False
        self.meta = []            # list of dicts of a <meta> tag's attrs
        self.links_rel = []       # <link rel=...>
        self.headings = []        # (level, text)
        self._heading_stack = []  # (level, buffer)
        self.images = []          # dict(src, alt, has_alt, has_dims, loading)
        self.anchors = []         # dict(href, text)
        self._anchor_stack = []   # (href, buffer)
        self.forms = []           # dict(action, method, fields=[...])
        self._form = None
        self.html_lang = None
        self.jsonld_blocks = []
        self._in_jsonld = False
        self._jsonld_buf = []
        self.script_srcs = []
        self.iframe_srcs = []
        self.viewport = None

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "html" and "lang" in a:
            self.html_lang = a["lang"]
        elif tag == "title":
            self._in_title = True
        elif tag == "meta":
            self.meta.append(a)
            name = (a.get("name") or "").lower()
            if name == "viewport":
                self.viewport = a.get("content")
        elif tag == "link":
            self.links_rel.append(a)
        elif tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
            self._heading_stack.append([int(tag[1]), ""])
        elif tag == "img":
            alt = a.get("alt")
            self.images.append({
                "src": a.get("src", ""),
                "alt": alt,
                "has_alt": alt is not None and alt.strip() != "",
                "has_dims": ("width" in a and "height" in a),
                "loading": a.get("loading"),
            })
        elif tag == "a":
            self._anchor_stack.append([a.get("href", ""), ""])
        elif tag == "form":
            self._form = {"action": a.get("action", ""),
                          "method": (a.get("method") or "get").lower(),
                          "fields": []}
        elif tag in ("input", "select", "textarea") and self._form is not None:
            self._form["fields"].append({
                "tag": tag,
                "type": a.get("type", "text" if tag == "input" else tag),
                "name": a.get("name") or a.get("id") or "",
                "required": ("required" in a),
                "placeholder": a.get("placeholder", ""),
            })
        elif tag == "script":
            if (a.get("type") or "").lower() == "application/ld+json":
                self._in_jsonld = True
                self._jsonld_buf = []
            if a.get("src"):
                self.script_srcs.append(a["src"])
        elif tag == "iframe" and a.get("src"):
            self.iframe_srcs.append(a["src"])

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False
        elif tag in ("h1", "h2", "h3", "h4", "h5", "h6") and self._heading_stack:
            level, buf = self._heading_stack.pop()
            text = " ".join(buf.split())
            if text:
                self.headings.append((level, text))
        elif tag == "a" and self._anchor_stack:
            href, buf = self._anchor_stack.pop()
            self.anchors.append({"href": href, "text": " ".join(buf.split())})
        elif tag == "form" and self._form is not None:
            self.forms.append(self._form)
            self._form = None
        elif tag == "script" and self._in_jsonld:
            self._in_jsonld = False
            raw = "".join(self._jsonld_buf).strip()
            if raw:
                self.jsonld_blocks.append(raw)

    def handle_data(self, data):
        if self._in_title:
            self.title_parts.append(data)
        if self._heading_stack:
            self._heading_stack[-1][1] += data
        if self._anchor_stack:
            self._anchor_stack[-1][1] += data
        if self._in_jsonld:
            self._jsonld_buf.append(data)


def _meta_get(meta, key, val):
    for m in meta:
        if (m.get(key) or "").lower() == val.lower():
            return m.get("content", "")
    return None


def is_cta(text, href):
    blob = f"{text} {href}".lower()
    return any(w in blob for w in CTA_WORDS)


def detect_tech(raw_html):
    low = raw_html.lower()
    found = []
    for label, sigs in TECH_SIGNATURES.items():
        if any(s.lower() in low for s in sigs):
            found.append(label)
    return found


def visible_word_count(raw_html):
    no_script = re.sub(r"(?is)<(script|style)[^>]*>.*?</\1>", " ", raw_html)
    text = re.sub(r"(?s)<[^>]+>", " ", no_script)
    text = re.sub(r"&[a-z#0-9]+;", " ", text)
    return len(text.split())


def analyze(raw_html):
    p = SignalParser()
    p.feed(raw_html)

    title = " ".join("".join(p.title_parts).split())
    description = _meta_get(p.meta, "name", "description")
    og = {m.get("property", "")[3:]: m.get("content", "")
          for m in p.meta if (m.get("property") or "").lower().startswith("og:")}
    tw = {m.get("name", "")[8:]: m.get("content", "")
          for m in p.meta if (m.get("name") or "").lower().startswith("twitter:")}

    h1s = [t for (lv, t) in p.headings if lv == 1]
    imgs_total = len(p.images)
    imgs_alt = sum(1 for i in p.images if i["has_alt"])

    internal, external, cta = [], [], []
    for an in p.anchors:
        href = an["href"] or ""
        if href.startswith(("mailto:", "tel:", "javascript:", "#")) or not href:
            bucket = internal
        elif href.startswith("http"):
            bucket = external
        else:
            bucket = internal
        bucket.append(an)
        if an["text"] and is_cta(an["text"], href):
            cta.append({"text": an["text"][:80], "href": href[:120]})

    jsonld_types = []
    for block in p.jsonld_blocks:
        try:
            data = json.loads(block)
        except Exception:
            m = re.findall(r'"@type"\s*:\s*"([^"]+)"', block)
            jsonld_types.extend(m)
            continue
        for obj in (data if isinstance(data, list) else [data]):
            if isinstance(obj, dict) and "@type" in obj:
                t = obj["@type"]
                jsonld_types.extend(t if isinstance(t, list) else [t])

    return {
        "seo": {
            "title": title or None,
            "title_length": len(title) if title else 0,
            "title_ok": bool(title) and TITLE_MIN <= len(title) <= TITLE_MAX,
            "meta_description": description,
            "description_length": len(description) if description else 0,
            "description_ok": bool(description) and DESC_MIN <= len(description) <= DESC_MAX,
            "canonical": next((l.get("href") for l in p.links_rel
                               if (l.get("rel") or "").lower() == "canonical"), None),
            "robots": _meta_get(p.meta, "name", "robots"),
            "lang": p.html_lang,
            "viewport": p.viewport,
            "open_graph": og or None,
            "twitter_card": tw or None,
            "jsonld_types": sorted(set(jsonld_types)) or None,
        },
        "structure": {
            "h1_count": len(h1s),
            "h1_text": h1s,
            "heading_outline": [{"level": lv, "text": t[:110]} for lv, t in p.headings],
            "heading_total": len(p.headings),
            "word_count": visible_word_count(raw_html),
        },
        "images": {
            "total": imgs_total,
            "with_alt": imgs_alt,
            "alt_coverage_pct": round(100 * imgs_alt / imgs_total) if imgs_total else None,
            "missing_dimensions": sum(1 for i in p.images if not i["has_dims"]),
            "lazy_loaded": sum(1 for i in p.images if (i["loading"] or "") == "lazy"),
        },
        "links": {
            "total": len(p.anchors),
            "internal": len(internal),
            "external": len(external),
            "cta_candidates": cta,
            "cta_count": len(cta),
        },
        "forms": [{
            "action": f["action"], "method": f["method"],
            "field_count": len(f["fields"]),
            "required_count": sum(1 for x in f["fields"] if x["required"]),
            "fields": [x["name"] or x["type"] for x in f["fields"]],
        } for f in p.forms],
        "tech_detected": detect_tech(raw_html),
        "resources": {
            "external_scripts": len(p.script_srcs),
            "iframes": p.iframe_srcs,
            "html_bytes": len(raw_html.encode("utf-8", "ignore")),
        },
    }


def print_summary(s):
    def line(k, v):
        print(f"  {k:<24} {v}")
    seo = s["seo"]
    print("\n=== SEO / META ===")
    line("Title", f'({seo["title_length"]} chars, ok={seo["title_ok"]}) {seo["title"]!r}')
    line("Meta description", f'({seo["description_length"]} chars, ok={seo["description_ok"]}) '
                             f'{(seo["meta_description"] or "MISSING")[:80]!r}')
    line("Lang / Viewport", f'{seo["lang"]} / {seo["viewport"]}')
    line("Canonical / Robots", f'{seo["canonical"]} / {seo["robots"]}')
    line("Open Graph", "present" if seo["open_graph"] else "MISSING")
    line("Twitter card", "present" if seo["twitter_card"] else "MISSING")
    line("JSON-LD schema", ", ".join(seo["jsonld_types"]) if seo["jsonld_types"] else "MISSING")

    st = s["structure"]
    print("\n=== STRUCTURE ===")
    line("H1 count", f'{st["h1_count"]}  {st["h1_text"]}')
    line("Headings total", st["heading_total"])
    line("Visible word count", st["word_count"])
    print("  Outline:")
    for h in st["heading_outline"][:40]:
        print(f'    {"  " * (h["level"] - 1)}H{h["level"]}: {h["text"]}')

    im = s["images"]
    print("\n=== IMAGES ===")
    line("Total / with alt", f'{im["total"]} / {im["with_alt"]}  (coverage {im["alt_coverage_pct"]}%)')
    line("Missing dimensions", f'{im["missing_dimensions"]} (CLS risk)')
    line("Lazy-loaded", im["lazy_loaded"])

    ln = s["links"]
    print("\n=== LINKS / CTAs ===")
    line("Total/internal/external", f'{ln["total"]} / {ln["internal"]} / {ln["external"]}')
    line("CTA candidates", ln["cta_count"])
    for c in ln["cta_candidates"][:12]:
        print(f'    • {c["text"]!r} -> {c["href"]}')

    print("\n=== FORMS ===")
    if not s["forms"]:
        print("  (none found)")
    for i, f in enumerate(s["forms"], 1):
        line(f"Form {i}", f'{f["method"].upper()} {f["action"]!r} — '
                          f'{f["field_count"]} fields ({f["required_count"]} required)')
        line("  fields", ", ".join(f["fields"]))

    print("\n=== TECH DETECTED ===")
    print("  " + (", ".join(s["tech_detected"]) if s["tech_detected"] else "none detected"))
    res = s["resources"]
    print("\n=== RESOURCES ===")
    line("HTML size", f'{res["html_bytes"]/1024:.1f} KB')
    line("External scripts", res["external_scripts"])
    line("Iframes", len(res["iframes"]))
    print()


def main():
    args = [a for a in sys.argv[1:]]
    as_json = "--json" in args
    paths = [a for a in args if not a.startswith("--")]
    if not paths:
        print(__doc__)
        sys.exit(1)
    src = paths[0]
    raw = sys.stdin.read() if src == "-" else open(src, encoding="utf-8", errors="ignore").read()
    signals = analyze(raw)
    if as_json:
        print(json.dumps(signals, ensure_ascii=False, indent=2))
    else:
        print_summary(signals)


if __name__ == "__main__":
    main()
