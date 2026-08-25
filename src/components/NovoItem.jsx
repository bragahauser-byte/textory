import { ArrowLeft, FileText, FileType2, Settings } from 'lucide-react'
import { useState } from 'react'

function NovoItem({ onBack, onTransform }) {
  const [text, setText] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const hasContent = text.trim().length > 0 || selectedFile !== null

  function handleFileChange(event) {
    setSelectedFile(event.target.files?.[0] ?? null)
  }

  function handleTextChange(event) {
    setText(event.target.value)
    if (event.target.value.trim()) setSelectedFile(null)
  }

  return (
    <main className="screen-shell relative flex min-h-screen flex-col bg-white text-[#111111]">
      <header className="flex items-start justify-between">
        <button
          type="button"
          aria-label="Voltar para a biblioteca"
          onClick={onBack}
          className="top-control flex items-center justify-center rounded-full bg-[#f5f5f5] transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-4"
        >
          <ArrowLeft size={24} strokeWidth={2.5} aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Abrir configurações"
          className="top-control flex items-center justify-center rounded-full bg-[#f5f5f5] transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-4"
        >
          <Settings size={24} strokeWidth={2.5} aria-hidden="true" />
        </button>
      </header>

      <section className="screen-header-gap">
        <h1 className="type-title m-0 font-bold leading-none">Novo texto</h1>
        <p className="type-subtitle title-subtitle-gap max-w-[470px] leading-[1.25] text-[#777777]">
          Cole um texto ou importe um arquivo para começar
        </p>

        <textarea
          value={text}
          onChange={handleTextChange}
          placeholder="Cole seu texto aqui"
          className="mt-8 h-[170px] w-full resize-none rounded-2xl border border-[#e7e7e7] p-4 text-[16px] outline-none placeholder:text-[#a5a5a5] focus:border-[#111111] sm:h-[190px]"
        />

        <div className="mt-6 grid grid-cols-3 gap-3">
          <FilePicker label="Texto (.txt)" accept=".txt,text/plain" icon={<FileText />} onChange={handleFileChange} />
          <FilePicker label="PDF" accept=".pdf,application/pdf" icon={<FileType2 />} onChange={handleFileChange} />
          <FilePicker label="Word (.docx)" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" icon={<FileType2 />} onChange={handleFileChange} />
        </div>
        {selectedFile && <p className="mt-3 truncate text-[12px] text-[#777777]">{selectedFile.name}</p>}
      </section>

      <button
        type="button"
        disabled={!hasContent}
        onClick={() => onTransform({ text, file: selectedFile })}
        className="primary-action mt-auto w-full rounded-full bg-[#171717] px-5 text-[16px] font-normal text-white transition-transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-4 disabled:cursor-not-allowed disabled:bg-[#a6a6a6] disabled:hover:scale-100"
      >
        Transformar em leitura
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