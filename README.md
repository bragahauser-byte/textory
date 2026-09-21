# Textory

Leitor de textos minimalista, feito para deixar a leitura digital mais confortável, focada e pessoal. Cole um texto, importe um arquivo ou uma página da web e leia em uma interface limpa, ajustando tipografia, modo de leitura, tema e espaçamento ao seu gosto.

**Acesse:** https://bragahauser-byte.github.io/textory/

## Recursos

- **Entrada de conteúdo:** texto colado, arquivos `.txt`, `.pdf`, `.docx` e `.epub` (até 20 MB) e importação por link.
- **Leitura paginada:** o texto é dividido em páginas que cabem na tela, com margem inferior confortável. Toque nas laterais para trocar de página e no centro para mostrar ou esconder os controles.
- **Continua de onde parou:** a última página lida de cada texto é lembrada.
- **Personalização:** tamanho do texto, estilo de fonte, espaço entre linhas e quatro modos de leitura (claro, papel, suave e escuro), além de tema claro/escuro para o restante do app.
- **9 idiomas:** português, inglês, espanhol, francês, alemão, árabe (com leitura da direita para a esquerda), chinês, japonês e coreano.
- **Instalável:** funciona como PWA (dá para adicionar à tela inicial do celular).
- **Privado por padrão:** a biblioteca e as preferências ficam apenas no navegador (`localStorage`); nada é enviado a um servidor, exceto a URL informada na importação por link.

## Tecnologias

React 19, Vite, Tailwind CSS 4, [lucide-react](https://lucide.dev), [pdf.js](https://mozilla.github.io/pdf.js/) (PDF), [mammoth](https://github.com/mwilliamson/mammoth.js) (DOCX), [JSZip](https://stuk.github.io/jszip/) (EPUB), [Readability](https://github.com/mozilla/readability) e jsdom (extração de texto de páginas web).

## Rodando localmente

Requer Node.js `^20.19.0` ou `>=22.12.0`.

```bash
npm install
npm run dev      # servidor de desenvolvimento
npm run lint     # verificação de código
npm run build    # build de produção (raiz "/")
npm run preview  # serve o build localmente
```

## Estrutura

```
api/extract.js         função serverless da importação por link (Readability + jsdom)
src/components/        telas (Home, NovoItem, Leitura, Ajustes) e componentes de interface
src/context/           biblioteca, configurações, idioma e tema
src/locales/           traduções (pt, en, es, fr, de, ar, zh, ja, ko)
src/utils/pagination.js  paginação do texto em páginas que cabem na tela
```

## Publicação

- **GitHub Pages:** `npm run deploy` gera o build para `/textory/` (`vite build --mode pages`) e publica a pasta `dist` na branch `gh-pages`. Em *Settings → Pages*, use a branch `gh-pages`.
- **Vercel (ou similar):** o build padrão (`npm run build`) serve na raiz e habilita a função `api/extract.js`. A **importação por link só funciona nesse tipo de hospedagem**, pois precisa de um backend; no GitHub Pages essa opção mostra a mensagem de erro padrão. Texto colado e arquivos funcionam em qualquer hospedagem.

A função `api/extract.js` bloqueia endereços privados/locais, limita o tempo (10 s) e o tamanho da resposta (5 MB) e aceita apenas páginas HTML.
