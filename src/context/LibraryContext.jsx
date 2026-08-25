import { useCallback, useEffect, useMemo, useState } from 'react'
import { LibraryContext } from './libraryContext.js'

const STORAGE_KEY = 'meu-app-leitura-library'

function readLibrary() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(stored) ? stored : []
  } catch {
    return []
  }
}

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function LibraryProvider({ children }) {
  const [readings, setReadings] = useState(readLibrary)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(readings))
  }, [readings])

  const addReading = useCallback((reading) => {
    const newReading = {
      ...reading,
      id: reading.id ?? createId(),
      createdAt: reading.createdAt ?? Date.now(),
    }
    setReadings((current) => [newReading, ...current])
    return newReading
  }, [])

  const getReading = useCallback((id) => {
    return readings.find((reading) => reading.id === id)
  }, [readings])

  const removeReading = useCallback((id) => {
    setReadings((current) => current.filter((reading) => reading.id !== id))
  }, [])

  const value = useMemo(() => ({ readings, addReading, getReading, removeReading }), [readings, addReading, getReading, removeReading])
  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
}
