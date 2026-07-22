// =============================================================
// BRIGADA CAMARÃO — INSTAGRAM IMAGE EXTRACTOR
// =============================================================
// COMO USAR:
// 1. Abra https://www.instagram.com/brigadacamarao/ no Chrome
// 2. Role a página para carregar pelo menos 5-10 posts
// 3. Pressione F12 (ou Ctrl+Shift+J) para abrir o Console
// 4. Cole este script inteiro e pressione Enter
// 5. As 5 melhores fotos serão baixadas automaticamente!
// =============================================================

(async () => {
  const images = document.querySelectorAll('article img[src*="scontent"], img[src*="instagram"]');
  const uniqueUrls = [];
  const seen = new Set();
  
  images.forEach(img => {
    const src = img.src;
    // Pula fotos de perfil e ícones pequenos
    if (src && !seen.has(src) && !src.includes('s150x150') && !src.includes('s44x44') && !src.includes('s64x64') && img.naturalWidth > 200) {
      seen.add(src);
      uniqueUrls.push(src);
    }
  });

  console.log(`🦐 Encontradas ${uniqueUrls.length} fotos. Baixando as 5 melhores...`);
  
  const toDownload = uniqueUrls.slice(0, 5);
  
  for (let i = 0; i < toDownload.length; i++) {
    try {
      const response = await fetch(toDownload[i]);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hero-${i + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.log(`✅ hero-${i + 1}.jpg baixado!`);
      await new Promise(r => setTimeout(r, 500));
    } catch (e) {
      console.error(`❌ Erro no hero-${i + 1}: ${e.message}`);
    }
  }
  
  console.log('🦐 Pronto! Mova os arquivos para: brigada-camarao/public/images/hero/');
})();
