#!/usr/bin/env python3
"""Gera preview.html a partir de index.html (template do Apps Script).

Substitui os tokens <?= cfg.X ?> pelos valores do CONFIG abaixo, para você
visualizar/testar a landing localmente sem publicar no Apps Script.

Uso: python3 build_preview.py  ->  escreve preview.html
"""
import re

# Espelhe aqui o CONFIG do Code.gs (só para o preview local).
CFG = {
    "checkoutMensal":    "https://www.academyzaya.com.br/plans-pricing",
    "checkoutSemestral": "https://www.academyzaya.com.br/plans-pricing",
    "checkoutAnual":     "https://www.academyzaya.com.br/plans-pricing",
    "ctaPrimario":       "#planos",
    "whatsapp":          "https://wa.me/5511926884424",
    "vslEmbedUrl":       "",
    "ga4Id":             "",
    "metaPixelId":       "",
    "canonical":         "https://www.academyzaya.com.br/",
}


def main():
    html = open("index.html", encoding="utf-8").read()
    out = re.sub(r"<\?=\s*(.*?)\s*\?>",
                 lambda m: CFG.get(m.group(1).strip().replace("cfg.", ""), ""),
                 html)
    open("preview.html", "w", encoding="utf-8").write(out)
    print(f"preview.html gerado ({len(out)} bytes). Abra no navegador.")


if __name__ == "__main__":
    main()
