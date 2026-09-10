import { createPortal } from 'react-dom'

function Portal({ children }) {
  const target = typeof document !== 'undefined' ? document.getElementById('portal-root') : null
  if (!target) return null
  return createPortal(children, target)
}

export default Portal
