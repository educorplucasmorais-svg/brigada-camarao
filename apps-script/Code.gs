/**
 * Academy by Zaya — landing page (Google Apps Script / HTML Service).
 *
 * Serve uma landing leve e indexável (rebuild da página Wix, seguindo a
 * auditoria em /analysis). Toda a configuração que muda (checkout, pixels,
 * WhatsApp, preços) fica em CONFIG para você editar sem mexer no HTML.
 *
 * Deploy: Implantar > Nova implantação > Tipo "App da Web" > Acesso "Qualquer
 * pessoa". Ou use clasp (ver README.md).
 */

// ————— Configuração (edite aqui) —————
var CONFIG = {
  // URL do checkout de cada plano (Wix pricing-plans, Hotmart, Stripe, etc.).
  // Enquanto não tiver, deixe apontando para o Wix atual.
  checkoutMensal:    'https://www.academyzaya.com.br/plans-pricing',
  checkoutSemestral: 'https://www.academyzaya.com.br/plans-pricing',
  checkoutAnual:     'https://www.academyzaya.com.br/plans-pricing',
  // CTA primário do topo (leva ao plano recomendado ou rola até #planos).
  ctaPrimario:       '#planos',
  whatsapp:          'https://wa.me/5511926884424',
  // IDs de rastreamento (deixe vazio para desativar).
  ga4Id:             '',            // ex.: 'G-XXXXXXX'
  metaPixelId:       '',            // ex.: '123456789012345'
  // URL do vídeo VSL (embed). Deixe vazio para ocultar o bloco de vídeo.
  vslEmbedUrl:       '',            // ex.: 'https://www.youtube.com/embed/...'
  canonical:         'https://www.academyzaya.com.br/'
};

function doGet() {
  var t = HtmlService.createTemplateFromFile('index');
  t.cfg = CONFIG;
  return t.evaluate()
    .setTitle('Academy by Zaya — destrave sua comunicação')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
}

/** Permite incluir partials, se quiser dividir o HTML depois. */
function include(name) {
  return HtmlService.createHtmlOutputFromFile(name).getContent();
}
