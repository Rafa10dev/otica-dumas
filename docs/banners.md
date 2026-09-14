# Banners

Os banners são ativos estáticos e não possuem CRUD administrativo neste momento. Coloque os arquivos em `public/banners/` usando estes nomes:

| Página | Desktop | Mobile |
| --- | --- | --- |
| Home | `home-desktop.webp` | `home-mobile.webp` |
| Catálogo | `catalogo-desktop.webp` | `catalogo-mobile.webp` |
| Sobre | `sobre-desktop.webp` | `sobre-mobile.webp` |
| Contato | `contato-desktop.webp` | `contato-mobile.webp` |

Recomendam-se 1920×600 px para desktop e 1080×900 px para mobile, em WebP otimizado. Para substituir um banner, substitua o arquivo correspondente e faça o deploy; as páginas não precisam ser reconstruídas estruturalmente.

`lib/banners.ts` centraliza os caminhos. `PageHero` verifica a existência dos arquivos, seleciona a versão mobile por meio de `picture` em telas menores e usa desktop como fallback. Se nenhum arquivo existir, exibe um placeholder azul/vermelho discreto. O texto, headings e CTAs permanecem em HTML, separados da imagem, para preservar acessibilidade, SEO e responsividade.
