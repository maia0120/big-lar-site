# Site Big Lar Marcenaria & Marmoraria

Site one-page estático (HTML + CSS + JavaScript puro, sem build e sem dependências).

## Estrutura
```
index.html          página inteira (textos, seções, SEO)
css/style.css       visual
js/main.js          menu, galeria ampliada, aberto/fechado, formulário -> WhatsApp
img/logo.png        logo (também usada como favicon)
img/galeria/        fotos dos projetos
```

## Publicar no GitHub Pages
1. Crie um repositório no GitHub e envie todo o conteúdo desta pasta (o `index.html` deve ficar na raiz).
2. No repositório: **Settings > Pages > Build and deployment**.
3. Em *Source* escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`, e salve.
4. Em alguns minutos o site fica em `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.

## Como editar
- **Fotos da galeria:** coloque o arquivo em `img/galeria/` e, em `index.html`, copie um bloco `<button class="g">` da seção "GALERIA", trocando `src` e `alt`. Tamanhos: sem classe (normal), `wide` (larga), `tall` (alta), `big` (grande).
- **Prints das avaliações:** em `index.html`, troque os blocos `<div class="pr">` por uma `<img>` (há um comentário mostrando como).
- **Ambientes:** copie um bloco `<button class="amb">` da seção "AMBIENTES".
- **Facebook:** troque o link de busca pelo endereço da página (procure por `facebook.com/search` no `index.html`; aparece em 2 lugares).
- **WhatsApp:** o número aparece como `5511983986998` no `index.html` e no topo de `js/main.js`.
- **Horários:** altere a lista `SCHED` em `js/main.js` e os textos da seção Contato.
- **Cor de destaque:** variável `--orange` no início de `css/style.css`.
- **SEO:** depois de publicar, coloque o endereço real do site nas tags `og:image` e `image` (use o link completo da logo) e cadastre o site no Google Search Console e no Google Meu Negócio.
