function ConfirmDelete({ onCancel, onConfirm }) {
  return (
    <div className="modal-overlay-enter fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" role="presentation" onClick={onCancel}>
      <section role="dialog" aria-modal="true" aria-labelledby="delete-title" className="modal-card-enter w-full max-w-[280px] rounded-[24px] bg-white p-4 text-left shadow-xl" onClick={(event) => event.stopPropagation()}>
        <h2 id="delete-title" className="type-title m-0 font-bold leading-tight text-[#111111]">Excluir este texto?</h2>
        <p className="type-subtitle title-subtitle-gap leading-[1.2] text-[#111111]">Este texto será excluído permanentemente e não poderá ser recuperado.</p>
        <div className="mt-7 space-y-2">
          <button type="button" onClick={onCancel} className="primary-action w-full rounded-full bg-[#F5F5F5] text-[16px] text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">Cancelar</button>
          <button type="button" onClick={onConfirm} className="primary-action w-full rounded-full bg-[#E9152D] text-[16px] text-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#E9152D] focus:ring-offset-2">Excluir</button>
        </div>
      </section>
    </div>
  )
}

export default ConfirmDelete