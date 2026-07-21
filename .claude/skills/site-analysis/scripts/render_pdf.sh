#!/usr/bin/env bash
# render_pdf.sh — render a filled report.html to PDF with whatever is available.
# Usage: bash render_pdf.sh report.html report.pdf
# Tries headless Chromium first (usually pre-installed), then WeasyPrint.
set -euo pipefail
IN="${1:?usage: render_pdf.sh <input.html> <output.pdf>}"
OUT="${2:?usage: render_pdf.sh <input.html> <output.pdf>}"

CHROME="$(command -v chromium 2>/dev/null || command -v chromium-browser 2>/dev/null \
  || command -v google-chrome 2>/dev/null || command -v google-chrome-stable 2>/dev/null \
  || ls /opt/pw-browsers/chromium*/chrome-linux/chrome 2>/dev/null | head -1 || true)"

if [ -n "${CHROME:-}" ]; then
  # 2>/dev/null hides harmless dbus/gpu warnings on headless boxes.
  "$CHROME" --headless --no-sandbox --disable-gpu \
    --print-to-pdf="$OUT" --no-pdf-header-footer "$(readlink -f "$IN")" 2>/dev/null
  echo "Rendered with Chromium -> $OUT"
  exit 0
fi

if python3 -c "import weasyprint" 2>/dev/null; then
  python3 -c "from weasyprint import HTML; HTML('$IN').write_pdf('$OUT')"
  echo "Rendered with WeasyPrint -> $OUT"
  exit 0
fi

echo "No PDF renderer found (no Chromium, no WeasyPrint)." >&2
echo "Install one, or hand report.html to the 'pdf' skill if available." >&2
exit 1
