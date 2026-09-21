// Espaços verticais do leitor (px). Precisam ser iguais aos do CSS:
// PARAGRAPH_GAP = classe `mt-6` entre parágrafos e TITLE_GAP = `.chapter-paragraph-gap`.
const PARAGRAPH_GAP = 24
const TITLE_GAP = 32

// Menor largura média de um caractere (em "em") usada só para limitar quanto
// texto precisa ser medido por página; é propositalmente pequena para nunca
// subestimar quantos caracteres cabem numa linha.
const MIN_CHAR_EM = 0.2

const CJK = /[぀-ヿ㐀-鿿가-힯]/
const BLANK = /^\s+$/
const OPENING_PUNCTUATION = /^[\p{Ps}\p{Pi}]+$/u

export function normalizeContent(content) {
  if (Array.isArray(content)) return content.filter(Boolean)
  return String(content ?? '').split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean)
}

// Área útil do leitor: a mesma caixa que o CSS entrega ao texto (`.chapter-content`),
// já descontando o topo (botões), as laterais e a margem inferior mínima com a
// área segura do aparelho. Ler daqui em vez de usar números fixos evita que a
// paginação e a tela divirjam.
export function measureReadingFrame() {
  const probe = document.createElement('div')
  probe.className = 'reading-frame'
  document.body.append(probe)
  const { width, height } = probe.getBoundingClientRect()
  probe.remove()
  return { width, height }
}

// Garante que a fonte de leitura já esteja carregada antes de medir o texto
// (medir com a fonte reserva dá um número de páginas diferente do real).
// Espera no máximo `timeoutMs` para nunca travar o app sem internet.
export async function loadReadingFont(fontFamily, fontSize, sample = '', timeoutMs = 1500) {
  if (typeof document === 'undefined' || !document.fonts?.load) return
  const load = document.fonts.load(`500 ${fontSize}px ${fontFamily}`, String(sample).slice(0, 200) || undefined).catch(() => undefined)
  await Promise.race([load, new Promise((resolve) => setTimeout(resolve, timeoutMs))])
}

// Divide um parágrafo em pedaços onde a página pode ser cortada.
// Idiomas com espaços: palavras (a pontuação fica colada na palavra).
// Chinês/japonês/coreano: segmentação por palavra do navegador, sem deixar
// pontuação de fechamento começando uma página.
function tokenize(text, locale) {
  if (CJK.test(text) && typeof Intl !== 'undefined' && Intl.Segmenter) {
    try {
      const tokens = []
      let opening = ''
      for (const { segment, isWordLike } of new Intl.Segmenter(locale, { granularity: 'word' }).segment(text)) {
        if (BLANK.test(segment)) {
          tokens.push(segment)
        } else if (!isWordLike && OPENING_PUNCTUATION.test(segment)) {
          opening += segment
        } else if (!isWordLike && tokens.length && !BLANK.test(tokens[tokens.length - 1])) {
          tokens[tokens.length - 1] += segment
        } else {
          tokens.push(opening + segment)
          opening = ''
        }
      }
      if (opening) tokens.push(opening)
      return tokens
    } catch {
      // cai para a divisão por espaços abaixo
    }
  }
  return text.match(/\s+|\S+/g) ?? []
}

// Divide o texto em páginas que CABEM na área útil. Parágrafos maiores que uma
// página são quebrados entre páginas (sempre no fim de uma palavra), então nenhum
// trecho fica para fora da tela e nenhum texto se perde.
//
// Retorna: Array<Array<{ index: number, text: string }>>
//   - `index` é o parágrafo de origem; `text` é o pedaço dele que aparece na página.
export function paginateContent(content, {
  title = '',
  fontFamily,
  fontSize,
  lineHeight,
  letterSpacing = '0px',
  width,
  height,
  dir = 'ltr',
  locale = typeof document === 'undefined' ? undefined : document.documentElement.lang || undefined,
} = {}) {
  const paragraphs = normalizeContent(content)
  if (typeof document === 'undefined') return [paragraphs.map((text, index) => ({ index, text }))]

  const frame = width && height ? { width, height } : measureReadingFrame()
  const lineBox = Number(lineHeight) || Number(fontSize) * 1.5 || 24

  // Mesmo estilo do texto renderizado em Leitura.jsx
  const style = `font-family:${fontFamily};font-size:${fontSize}px;font-weight:500;line-height:${lineBox}px;letter-spacing:${letterSpacing};overflow-wrap:break-word;`
  const measure = document.createElement('div')
  measure.setAttribute('aria-hidden', 'true')
  measure.style.cssText = `position:absolute;top:0;left:-99999px;width:${frame.width}px;visibility:hidden;pointer-events:none;direction:${dir};`
  const node = document.createElement('p')
  node.style.cssText = `margin:0;${style}`
  measure.append(node)

  let titleReserve = 0
  if (title) {
    const titleNode = document.createElement('h1')
    titleNode.textContent = title
    titleNode.style.cssText = `margin:0;text-transform:uppercase;${style}`
    measure.append(titleNode)
  }
  document.body.append(measure)

  const heightOf = (text) => {
    node.textContent = text
    return node.getBoundingClientRect().height
  }
  if (title) titleReserve = measure.querySelector('h1').getBoundingClientRect().height + TITLE_GAP

  // Em algumas fontes (Amiri, Literata, Lora...) a caixa das letras é maior que a
  // altura da linha, e a última linha "sai" alguns px para baixo. Medimos isso na
  // fonte real e descontamos, para o texto nunca entrar na margem inferior.
  node.textContent = paragraphs.find(Boolean)?.slice(0, 48) || 'Hg'
  const glyphs = document.createRange()
  glyphs.selectNodeContents(node)
  const overhang = Math.ceil(Math.max(0, (glyphs.getBoundingClientRect().height - lineBox) / 2))

  const maxCharsPerLine = Math.ceil(frame.width / (Number(fontSize) * MIN_CHAR_EM)) + 1
  const TOLERANCE = 0.5

  const pages = []
  let page = []
  let used = 0
  const pageHeight = frame.height - overhang
  let budget = pageHeight - titleReserve // a primeira página tem o título

  const closePage = () => {
    pages.push(page)
    page = []
    used = 0
    budget = pageHeight
  }

  paragraphs.forEach((paragraph, index) => {
    let tokens = tokenize(paragraph, locale)
    let start = 0

    while (start < tokens.length) {
      while (start < tokens.length && BLANK.test(tokens[start])) start++
      if (start >= tokens.length) break

      const gap = page.length ? PARAGRAPH_GAP : 0
      // Página vazia sempre comporta pelo menos uma linha (evita laço em telas minúsculas).
      const space = Math.max(budget - used - gap, page.length ? 0 : lineBox)

      // Sem espaço nem para uma linha: o parágrafo continua na próxima página.
      if (space < lineBox - TOLERANCE && page.length) {
        closePage()
        continue
      }

      const join = (count) => tokens.slice(start, start + count).join('').trimEnd()
      const fits = (count) => heightOf(join(count)) <= space + TOLERANCE

      // Quantidade máxima de "palavras" que vale a pena medir nesta página.
      const remaining = tokens.length - start
      const maxChars = Math.max(1, Math.floor(space / lineBox)) * maxCharsPerLine
      let upper = 0
      for (let chars = 0; upper < remaining && chars < maxChars; upper++) chars += tokens[start + upper].length
      upper = Math.max(1, upper)

      let count
      if (upper === remaining && fits(remaining)) {
        count = remaining
      } else {
        let low = 1
        let high = upper
        while (low < high) {
          const middle = (low + high + 1) >> 1
          if (fits(middle)) low = middle
          else high = middle - 1
        }
        count = low
      }

      if (!fits(count)) {
        // Nem uma palavra cabe. Com a página já ocupada, recomeça numa página limpa.
        if (page.length) {
          closePage()
          continue
        }
        // Palavra maior que a página inteira (ex.: URL enorme): divide por caracteres.
        const word = tokens[start]
        let low = 1
        let high = word.length - 1
        while (low < high) {
          const middle = (low + high + 1) >> 1
          if (heightOf(word.slice(0, middle)) <= space + TOLERANCE) low = middle
          else high = middle - 1
        }
        const pieces = [word.slice(0, low), word.slice(low)].filter(Boolean)
        tokens = [...tokens.slice(0, start), ...pieces, ...tokens.slice(start + 1)]
        count = 1
      }

      const text = join(count)
      page.push({ index, text })
      used += gap + heightOf(text)
      start += count

      // Ainda sobrou parágrafo: a página encheu, o resto vai para a próxima.
      if (start < tokens.length) closePage()
    }
  })

  if (page.length) pages.push(page)
  measure.remove()
  return pages.length ? pages : [[]]
}
