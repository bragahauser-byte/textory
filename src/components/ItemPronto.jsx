import { Settings, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import ConfirmDelete from './ConfirmDelete.jsx'

function ItemPronto({ title, subtitle, onRead, onClose, onDelete }) {
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <main className="screen-shell relative flex min-h-screen flex-col bg-white text-[#111111]">
      <header className="flex items-start justify-between">
        <button
          type="button"
          aria-label="Fechar item"
          onClick={onClose}
          className="top-control flex items-center justify-center rounded-full bg-[#f5f5f5] transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-4"
        >
          <X size={24} strokeWidth={2.3} aria-hidden="true" />
        </button>
        <div className="flex gap-3"><button type="button" aria-label="Excluir leitura" onClick={() => setDeleteOpen(true)} className="top-control flex items-center justify-center rounded-full bg-[#FFC3C4] text-[#ef233c] focus:outline-none focus:ring-2 focus:ring-[#ef233c]"><Trash2 size={24} strokeWidth={2.3} aria-hidden="true" /></button><button type="button" aria-label="Abrir configurações" className="top-control flex items-center justify-center rounded-full bg-[#f5f5f5]"><Settings size={24} strokeWidth={2.5} aria-hidden="true" /></button></div>
      </header>

      <section className="screen-header-gap">
        <h1 className="type-title content-enter m-0 font-bold leading-none">{title}</h1>
        <p className="type-subtitle content-enter title-subtitle-gap text-[#777777]" style={{ animationDelay: '70ms' }}>{subtitle}</p>
      </section>

      <button
        type="button"
        onClick={onRead}
        className="primary-action mt-auto w-full rounded-full bg-[#171717] text-[16px] text-white transition-transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-4"
      >
        Ler
      </button>
      {deleteOpen && <ConfirmDelete onCancel={() => setDeleteOpen(false)} onConfirm={() => { setDeleteOpen(false); onDelete?.() }} />}
    </main>
  )
}

export default ItemPronto