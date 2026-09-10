import { ArrowLeft, BookOpen, FileText, FileType2, Link2, Settings, X } from 'lucide-react'
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import mammoth from 'mammoth'
import JSZip from 'jszip'
import { useState } from 'react'
import { useLocale } from '../context/useLocale.js'

const MAX_FILE_SIZE = 20 * 1024 * 1024
GlobalWorkerOptions.workerSrc = pdfWorker
const FILE_TYPES = {
  txt: { extensions: ['.txt'], mimeTypes: ['text/plain'], label: '.txt' },
  pdf: { extensions: ['.pdf'], mimeTypes: ['application/pdf'], label: '.pdf' },
  docx: { extensions: ['.docx'], mimeTypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'], label: '.docx' },
  epub: { extensions: ['.epub'], mimeTypes: ['application/epub+zip'], label: '.epub' },
}

function readTextFile(file, errorMessage) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(new Error(errorMessage))
    reader.readAsText(file)
  })
}

async function readPdfFile(file, errorMessage) {
  const pdf = await getDocument({ data: await file.arrayBuffer() }).promise
  const pages = []
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber)
    const content = await page.getTextContent()
    pages.push(content.items.map((item) => item.str).join(' '))
  }
  const text = pages.join('\n\n').trim()
  if (!text) throw new Error(errorMessage)
  return text
}

async function readDocxFile(file, errorMessage) {
  const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })
  const text = result.value.trim()
  if (!text) throw new Error(errorMessage)
  return text
}

function resolveEpubPath(baseDir, href) {
  const parts = [...baseDir]
  for (const segment of href.split('/')) {
    if (segment === '.' || segment === '') continue
    if (segment === '..') parts.pop()
    else parts.push(segment)
  }
  return parts.join('/')
}

function extractEpubParagraphs(chapterHtml) {
  const doc = new DOMParser().parseFromString(chapterHtml, 'text/html')
  const body = doc.body || doc.documentElement
  const paragraphNodes = body.querySelectorAll('p')
  if (paragraphNodes.length) {
    return Array.from(paragraphNodes).map((node) => node.textContent.replace(/\s+/g, ' ').trim()).filter(Boolean)
  }
  const text = body.textContent.replace(/\s+/g, ' ').trim()
  return text ? [text] : []
}

async function readEpubFile(file, errorMessage, drmMessage) {
  let zip
  try {
    zip = await JSZip.loadAsync(await file.arrayBuffer())
  } catch {
    throw new Error(errorMessage)
  }

  if (zip.file('META-INF/encryption.xml')) throw new Error(drmMessage)

  const containerXml = await zip.file('META-INF/container.xml')?.async('string')
  const containerDoc = containerXml ? new DOMParser().parseFromString(containerXml, 'application/xml') : null
  const opfPath = containerDoc && !containerDoc.querySelector('parsererror')
    ? containerDoc.querySelector('rootfile')?.getAttribute('full-path')
    : null
  if (!opfPath) throw new Error(errorMessage)

  const opfXml = await zip.file(opfPath)?.async('string')
  const opfDoc = opfXml ? new DOMParser().parseFromString(opfXml, 'application/xml') : null
  if (!opfDoc || opfDoc.querySelector('parsererror')) throw new Error(errorMessage)

  const manifest = {}
  opfDoc.querySelectorAll('manifest > item').forEach((item) => {
    const id = item.getAttribute('id')
    const href = item.getAttribute('href')
    if (id && href) manifest[id] = href
  })

  const spineIds = Array.from(opfDoc.querySelectorAll('spine > itemref')).map((item) => item.getAttribute('idref')).filter(Boolean)
  const opfDir = opfPath.split('/').slice(0, -1)
  const bookTitle = opfDoc.getElementsByTagNameNS('http://purl.org/dc/elements/1.1/', 'title')[0]?.textContent?.trim()
    || opfDoc.querySelector('metadata > title')?.textContent?.trim()
    || ''

  const paragraphs = []
  for (const id of spineIds) {
    const href = manifest[id]
    if (!href) continue
    const chapterFile = zip.file(resolveEpubPath(opfDir, href))
    if (!chapterFile) continue
    const chapterHtml = await chapterFile.async('string')
    paragraphs.push(...extractEpubParagraphs(chapterHtml))
  }

  const text = paragraphs.join('\n\n').trim()
  if (!text) throw new Error(errorMessage)
  return bookTitle ? `${bookTitle}\n\n${text}` : text
}

async function extractFileText(file, type, messages) {
  if (type === 'txt') return readTextFile(file, messages.txtRead)
  if (type === 'pdf') return readPdfFile(file, messages.pdfExtract)
  if (type === 'epub') return readEpubFile(file, messages.epubRead, messages.epubDrm)
  return readDocxFile(file, messages.docxRead)
}

const URL_ERROR_KEYS = {
  invalid_url: 'urlInvalid',
  fetch_failed: 'urlFetchFailed',
  unsupported_content_type: 'urlUnsupported',
  too_large: 'urlTooLarge',
  extraction_failed: 'urlExtractFailed',
}

function NovoItem({ initialText = '', onBack, onTransform }) {
  const [text, setText] = useState(initialText)
  const [selectedFile, setSelectedFile] = useState(null)
  const [importedUrlLabel, setImportedUrlLabel] = useState('')
  const [linkOpen, setLinkOpen] = useState(false)
  const [linkValue, setLinkValue] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [errorSource, setErrorSource] = useState('file')
  const [inputVersion, setInputVersion] = useState(0)
  const { t } = useLocale()
  const { direction } = useLocale()
  const hasContent = text.trim().length > 0

  async function handleFileChange(event, type) {
    const file = event.target.files?.[0]
    if (!file) return
    const fileType = FILE_TYPES[type]
    const extension = `.${file.name.split('.').pop()?.toLowerCase()}`
    const validMime = !file.type || fileType.mimeTypes.includes(file.type)
    if (!fileType.extensions.includes(extension) || !validMime) {
      setSelectedFile(null)
      setError(t('errors.invalidType', { type: fileType.label }))
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setSelectedFile(null)
      setError(t('errors.tooLarge'))
      return
    }

    setError('')
    setImportedUrlLabel('')
    setSelectedFile(file)
    setIsProcessing(true)
    try {
      setText(await extractFileText(file, type, {
        txtRead: t('errors.txtRead'),
        pdfExtract: t('errors.pdfExtract'),
        docxRead: t('errors.docxRead'),
        epubRead: t('errors.epubRead'),
        epubDrm: t('errors.epubDrm'),
      }))
    } catch (extractionError) {
      const message = type === 'pdf' ? t('errors.pdfExtract') : extractionError instanceof Error ? extractionError.message : t('errors.generic')
      setError(message)
      setErrorSource('file')
      setSelectedFile(null)
    } finally {
      setIsProcessing(false)
    }
  }

  async function handleUrlImport(event) {
    event.preventDefault()
    const trimmed = linkValue.trim()
    if (!trimmed) return

    setError('')
    setSelectedFile(null)
    setImportedUrlLabel('')
    setIsProcessing(true)
    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed }),
      })
      const data = await response.json().catch(() => null)
      if (!response.ok || !data?.text) {
        const key = URL_ERROR_KEYS[data?.error] ?? 'urlExtractFailed'
        throw new Error(t(`errors.${key}`))
      }
      setText(data.title ? `${data.title}\n\n${data.text}` : data.text)
      let host = trimmed
      try { host = new URL(trimmed).hostname } catch { /* keep raw input as fallback label */ }
      setImportedUrlLabel(t('newItem.urlImportedFrom', { host }))
      setLinkOpen(false)
      setLinkValue('')
    } catch (importError) {
      setError(importError instanceof Error ? importError.message : t('errors.generic'))
      setErrorSource('url')
    } finally {
      setIsProcessing(false)
    }
  }

  function handleTextChange(event) {
    setText(event.target.value)
    setError('')
    if (event.target.value.trim()) {
      setSelectedFile(null)
      setImportedUrlLabel('')
    }
  }

  function chooseAnotherFile() {
    setError('')
    setSelectedFile(null)
    setImportedUrlLabel('')
    setInputVersion((version) => version + 1)
  }

  return (
    <main className="relative flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
      <header className="flex items-start justify-between">
        <button
          type="button"
          aria-label={t('newItem.back')}
          onClick={onBack}
          className="top-control flex items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-text)] transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--color-text)] focus:ring-offset-4 focus:ring-offset-[var(--color-bg)]"
        >
          <ArrowLeft className={direction === 'rtl' ? 'icon-mirror' : ''} size={24} strokeWidth={2.5} aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label={t('newItem.settings')}
          className="top-control flex items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-text)] transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--color-text)] focus:ring-offset-4 focus:ring-offset-[var(--color-bg)]"
        >
          <Settings size={24} strokeWidth={2.5} aria-hidden="true" />
        </button>
      </header>

      <section className="screen-header-gap">
        <h1 className="type-title m-0 font-bold leading-none">{t('newItem.title')}</h1>
        <p className="type-subtitle title-subtitle-gap max-w-[470px] leading-[1.25] text-[var(--color-text-secondary)]">
          {t('newItem.subtitle')}
        </p>

        {isProcessing ? <div className="mt-8 flex h-[170px] items-center justify-center gap-3 rounded-2xl border border-[var(--color-border)] text-[16px] text-[var(--color-text-secondary)] sm:h-[190px]"><span className="file-spinner size-5 rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-accent)]" aria-hidden="true" />{linkOpen || importedUrlLabel ? t('newItem.urlLoading') : t('newItem.loading')}</div> : <textarea value={text} onChange={handleTextChange} placeholder={t('newItem.placeholder')} className="mt-8 h-[170px] w-full resize-none rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4 text-[16px] text-[var(--color-text)] outline-none placeholder:text-[var(--color-placeholder)] focus:border-[var(--color-text)] sm:h-[190px]" />}

        <div className="mt-6 grid grid-cols-3 gap-3">
          <FilePicker key={`txt-${inputVersion}`} label={t('newItem.txt')} accept=".txt,text/plain" icon={<FileText />} onChange={(event) => handleFileChange(event, 'txt')} />
          <FilePicker key={`pdf-${inputVersion}`} label={t('newItem.pdf')} accept=".pdf,application/pdf" icon={<FileType2 />} onChange={(event) => handleFileChange(event, 'pdf')} />
          <FilePicker key={`docx-${inputVersion}`} label={t('newItem.docx')} accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" icon={<FileType2 />} onChange={(event) => handleFileChange(event, 'docx')} />
          <FilePicker key={`epub-${inputVersion}`} label={t('newItem.epub')} accept=".epub,application/epub+zip" icon={<BookOpen />} onChange={(event) => handleFileChange(event, 'epub')} />
          <ActionPicker label={t('newItem.link')} icon={<Link2 />} active={linkOpen} onClick={() => setLinkOpen((open) => !open)} />
        </div>

        {linkOpen && (
          <form onSubmit={handleUrlImport} className="mt-3 flex items-center gap-2 rounded-2xl border border-[var(--color-border)] p-2 pl-4">
            <input
              type="url"
              inputMode="url"
              value={linkValue}
              onChange={(event) => setLinkValue(event.target.value)}
              placeholder={t('newItem.urlPlaceholder')}
              className="min-w-0 flex-1 bg-transparent text-[14px] text-[var(--color-text)] outline-none placeholder:text-[var(--color-placeholder)]"
            />
            <button type="submit" disabled={!linkValue.trim() || isProcessing} className="shrink-0 rounded-full bg-[var(--color-accent)] px-4 py-2 text-[13px] font-semibold text-[var(--color-accent-text)] disabled:cursor-not-allowed disabled:bg-[var(--color-disabled)]">
              {t('newItem.urlSubmit')}
            </button>
            <button type="button" aria-label={t('newItem.urlCancel')} onClick={() => { setLinkOpen(false); setLinkValue('') }} className="flex size-8 shrink-0 items-center justify-center rounded-full text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
              <X size={18} aria-hidden="true" />
            </button>
          </form>
        )}

        {selectedFile && <p className="mt-3 truncate text-[12px] text-[var(--color-text-secondary)]">{selectedFile.name}</p>}
        {importedUrlLabel && <p className="mt-3 truncate text-[12px] text-[var(--color-text-secondary)]">{importedUrlLabel}</p>}
        {error && <div className="mt-3 rounded-xl border border-[var(--color-danger)] bg-[var(--color-danger-surface)] p-3 text-[13px] text-[var(--color-danger-text)]" role="alert"><p className="m-0">{error}</p><button type="button" onClick={chooseAnotherFile} className="mt-2 font-semibold underline">{errorSource === 'url' ? t('newItem.tryAgain') : t('newItem.chooseAnother')}</button></div>}
      </section>

      <button
        type="button"
        disabled={!hasContent || isProcessing || Boolean(error)}
        onClick={() => onTransform({ text, file: selectedFile })}
        className="primary-action mt-auto w-full rounded-full bg-[var(--color-accent)] px-5 text-[16px] font-normal text-[var(--color-accent-text)] transition-transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-[var(--color-text)] focus:ring-offset-4 focus:ring-offset-[var(--color-bg)] disabled:cursor-not-allowed disabled:bg-[var(--color-disabled)] disabled:hover:scale-100"
      >
        {t('newItem.transform')}
      </button>
    </main>
  )
}

function FilePicker({ label, accept, icon, onChange }) {
  return (
    <label className="flex h-[88px] cursor-pointer flex-col justify-between rounded-2xl border border-[var(--color-border)] p-3 transition-[transform,border-color] duration-120 hover:border-[var(--color-text)] active:scale-[0.96]">
      <input type="file" accept={accept} onChange={onChange} className="sr-only" />
      <span className="text-[var(--color-text)]">{icon}</span>
      <span className="whitespace-nowrap text-[12px] font-semibold">{label}</span>
    </label>
  )
}

function ActionPicker({ label, icon, onClick, active }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-[88px] flex-col justify-between rounded-2xl border p-3 text-start transition-[transform,border-color] duration-120 active:scale-[0.96] ${active ? 'border-[var(--color-text)]' : 'border-[var(--color-border)] hover:border-[var(--color-text)]'}`}
    >
      <span className="text-[var(--color-text)]">{icon}</span>
      <span className="whitespace-nowrap text-[12px] font-semibold">{label}</span>
    </button>
  )
}

export default NovoItem
