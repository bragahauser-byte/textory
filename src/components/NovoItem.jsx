import { ArrowLeft, FileText, FileType2, Settings } from 'lucide-react'
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import mammoth from 'mammoth'
import { useState } from 'react'
import { useLocale } from '../context/useLocale.js'

const MAX_FILE_SIZE = 20 * 1024 * 1024
GlobalWorkerOptions.workerSrc = pdfWorker
const FILE_TYPES = {
  txt: { extensions: ['.txt'], mimeTypes: ['text/plain'], label: '.txt' },
  pdf: { extensions: ['.pdf'], mimeTypes: ['application/pdf'], label: '.pdf' },
  docx: { extensions: ['.docx'], mimeTypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'], label: '.docx' },
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

async function extractFileText(file, type, messages) {
  if (type === 'txt') return readTextFile(file, messages.txtRead)
  if (type === 'pdf') return readPdfFile(file, messages.pdfExtract)
  return readDocxFile(file, messages.docxRead)
}

function NovoItem({ initialText = '', onBack, onTransform }) {
  const [text, setText] = useState(initialText)
  const [selectedFile, setSelectedFile] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
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
    setSelectedFile(file)
    setIsProcessing(true)
    try {
      setText(await extractFileText(file, type, { txtRead: t('errors.txtRead'), pdfExtract: t('errors.pdfExtract'), docxRead: t('errors.docxRead') }))
    } catch (extractionError) {
      const message = type === 'pdf' ? t('errors.pdfExtract') : extractionError instanceof Error ? extractionError.message : t('errors.generic')
      setError(message)
      setSelectedFile(null)
    } finally {
      setIsProcessing(false)
    }
  }

  function handleTextChange(event) {
    setText(event.target.value)
    setError('')
    if (event.target.value.trim()) setSelectedFile(null)
  }

  function chooseAnotherFile() {
    setError('')
    setSelectedFile(null)
    setInputVersion((version) => version + 1)
  }

  return (
    <main className="relative flex flex-col bg-white text-[#111111]">
      <header className="flex items-start justify-between">
        <button
          type="button"
          aria-label={t('newItem.back')}
          onClick={onBack}
          className="top-control flex items-center justify-center rounded-full bg-[#f5f5f5] transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-4"
        >
          <ArrowLeft className={direction === 'rtl' ? 'icon-mirror' : ''} size={24} strokeWidth={2.5} aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label={t('newItem.settings')}
          className="top-control flex items-center justify-center rounded-full bg-[#f5f5f5] transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-4"
        >
          <Settings size={24} strokeWidth={2.5} aria-hidden="true" />
        </button>
      </header>

      <section className="screen-header-gap">
        <h1 className="type-title m-0 font-bold leading-none">{t('newItem.title')}</h1>
        <p className="type-subtitle title-subtitle-gap max-w-[470px] leading-[1.25] text-[#777777]">
          {t('newItem.subtitle')}
        </p>

        {isProcessing ? <div className="mt-8 flex h-[170px] items-center justify-center gap-3 rounded-2xl border border-[#e7e7e7] text-[16px] text-[#777777] sm:h-[190px]"><span className="file-spinner size-5 rounded-full border-2 border-[#d5d5d5] border-t-[#171717]" aria-hidden="true" />{t('newItem.loading')}</div> : <textarea value={text} onChange={handleTextChange} placeholder={t('newItem.placeholder')} className="mt-8 h-[170px] w-full resize-none rounded-2xl border border-[#e7e7e7] p-4 text-[16px] outline-none placeholder:text-[#a5a5a5] focus:border-[#111111] sm:h-[190px]" />}

        <div className="mt-6 grid grid-cols-3 gap-3">
          <FilePicker key={`txt-${inputVersion}`} label={t('newItem.txt')} accept=".txt,text/plain" icon={<FileText />} onChange={(event) => handleFileChange(event, 'txt')} />
          <FilePicker key={`pdf-${inputVersion}`} label={t('newItem.pdf')} accept=".pdf,application/pdf" icon={<FileType2 />} onChange={(event) => handleFileChange(event, 'pdf')} />
          <FilePicker key={`docx-${inputVersion}`} label={t('newItem.docx')} accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" icon={<FileType2 />} onChange={(event) => handleFileChange(event, 'docx')} />
        </div>
        {selectedFile && <p className="mt-3 truncate text-[12px] text-[#777777]">{selectedFile.name}</p>}
        {error && <div className="mt-3 rounded-xl border border-[#ef233c] bg-[#fff4f4] p-3 text-[13px] text-[#b42318]" role="alert"><p className="m-0">{error}</p><button type="button" onClick={chooseAnotherFile} className="mt-2 font-semibold underline">{t('newItem.chooseAnother')}</button></div>}
      </section>

      <button
        type="button"
        disabled={!hasContent || isProcessing || Boolean(error)}
        onClick={() => onTransform({ text, file: selectedFile })}
        className="primary-action mt-auto w-full rounded-full bg-[#171717] px-5 text-[16px] font-normal text-white transition-transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-4 disabled:cursor-not-allowed disabled:bg-[#a6a6a6] disabled:hover:scale-100"
      >
        {t('newItem.transform')}
      </button>
    </main>
  )
}

function FilePicker({ label, accept, icon, onChange }) {
  return (
    <label className="flex h-[88px] cursor-pointer flex-col justify-between rounded-2xl border border-[#e7e7e7] p-3 transition-[transform,border-color] duration-120 hover:border-[#111111] active:scale-[0.96]">
      <input type="file" accept={accept} onChange={onChange} className="sr-only" />
      <span className="text-[#111111]">{icon}</span>
      <span className="whitespace-nowrap text-[12px] font-semibold">{label}</span>
    </label>
  )
}

export default NovoItem