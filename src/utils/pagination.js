export function normalizeContent(content) {
  if (Array.isArray(content)) return content.filter(Boolean)
  return String(content ?? '').split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean)
}

export function paginateContent(content, { title = '', fontFamily, fontSize, lineHeight, width, height } = {}) {
  const paragraphs = normalizeContent(content)
  if (typeof document === 'undefined') return [paragraphs.map((_, index) => index)]
  const measure = document.createElement('div')
  measure.style.cssText = `position:absolute;left:-99999px;width:${width ?? Math.max(window.innerWidth - 64, 1)}px;visibility:hidden;`
  const style = `font-family:${fontFamily};font-size:${fontSize}px;font-weight:500;line-height:${lineHeight}px;letter-spacing:0px;`
  if (title) {
    const titleNode = document.createElement('h1')
    titleNode.textContent = title
    titleNode.style.cssText = `margin:0;${style}`
    measure.append(titleNode)
  }
  const nodes = paragraphs.map((paragraph, index) => {
    const node = document.createElement('p')
    node.textContent = paragraph
    node.style.cssText = `margin:${index ? '24px' : '0'} 0 0;${style}`
    measure.append(node)
    return node
  })
  document.body.append(measure)
  const availableHeight = Math.max(0, (height ?? window.innerHeight) - 132 - 40)
  const titleNode = measure.querySelector('h1')
  const titleOffset = titleNode ? titleNode.getBoundingClientRect().height + 32 : 0
  const pages = []
  let current = []
  let currentHeight = 0
  nodes.forEach((node, index) => {
    const paragraphHeight = node.getBoundingClientRect().height
    const gap = current.length ? 24 : 0
    const offset = pages.length === 0 ? titleOffset : 0
    if (current.length && currentHeight + gap + paragraphHeight > availableHeight - offset) {
      pages.push(current)
      current = []
      currentHeight = 0
    }
    current.push(index)
    currentHeight += (current.length > 1 ? 24 : 0) + paragraphHeight
  })
  if (current.length) pages.push(current)
  measure.remove()
  return pages.length ? pages : [[]]
}