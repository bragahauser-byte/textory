import { JSDOM } from 'jsdom'
import { Readability } from '@mozilla/readability'

const FETCH_TIMEOUT_MS = 10000
const MAX_RESPONSE_BYTES = 5 * 1024 * 1024
const MAX_TEXT_LENGTH = 300000

function isPrivateHost(hostname) {
  const lower = hostname.toLowerCase()
  if (lower === 'localhost' || lower.endsWith('.localhost')) return true

  const ipv4 = lower.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)
  if (ipv4) {
    const [a, b] = ipv4.slice(1).map(Number)
    if (a === 127 || a === 10 || a === 0) return true
    if (a === 172 && b >= 16 && b <= 31) return true
    if (a === 192 && b === 168) return true
    if (a === 169 && b === 254) return true
  }

  if (lower === '::1' || lower.startsWith('fc') || lower.startsWith('fd') || lower.startsWith('fe80') || lower.startsWith('[::1]')) return true
  return false
}

function parseTargetUrl(rawUrl) {
  let target
  try {
    target = new URL(rawUrl.trim())
  } catch {
    return null
  }
  if (target.protocol !== 'http:' && target.protocol !== 'https:') return null
  if (isPrivateHost(target.hostname)) return null
  return target
}

async function readBodyWithCap(response, controller) {
  const reader = response.body?.getReader ? response.body.getReader() : null
  if (!reader) {
    const text = await response.text()
    if (text.length > MAX_RESPONSE_BYTES) return null
    return text
  }

  const decoder = new TextDecoder()
  let html = ''
  let received = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    received += value.byteLength
    if (received > MAX_RESPONSE_BYTES) {
      controller.abort()
      return null
    }
    html += decoder.decode(value, { stream: true })
  }
  return html
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'method_not_allowed' })
  }

  const url = typeof req.body?.url === 'string' ? req.body.url : ''
  if (!url.trim()) return res.status(400).json({ error: 'invalid_url' })

  const target = parseTargetUrl(url)
  if (!target) return res.status(400).json({ error: 'invalid_url' })

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

  let response
  try {
    response = await fetch(target.toString(), {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TextoryBot/1.0; +reading-import)',
        Accept: 'text/html,application/xhtml+xml',
      },
    })
  } catch {
    clearTimeout(timeout)
    return res.status(502).json({ error: 'fetch_failed' })
  }

  if (!response.ok) {
    clearTimeout(timeout)
    return res.status(502).json({ error: 'fetch_failed' })
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('html') && !contentType.includes('xml')) {
    clearTimeout(timeout)
    return res.status(415).json({ error: 'unsupported_content_type' })
  }

  const contentLength = Number(response.headers.get('content-length') ?? 0)
  if (contentLength > MAX_RESPONSE_BYTES) {
    clearTimeout(timeout)
    return res.status(413).json({ error: 'too_large' })
  }

  const html = await readBodyWithCap(response, controller)
  clearTimeout(timeout)
  if (html === null) return res.status(413).json({ error: 'too_large' })

  let article
  try {
    const dom = new JSDOM(html, { url: target.toString() })
    article = new Readability(dom.window.document).parse()
  } catch {
    return res.status(422).json({ error: 'extraction_failed' })
  }

  const text = article?.textContent?.trim()
  if (!text) return res.status(422).json({ error: 'extraction_failed' })

  return res.status(200).json({
    title: (article.title || '').trim(),
    text: text.slice(0, MAX_TEXT_LENGTH),
  })
}
