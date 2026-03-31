import { useState } from 'react'
import type { FormEvent } from 'react'

interface Props {
  onAdd: (title: string) => Promise<void>
  loading: boolean
}

export default function AddTask({ onAdd, loading }: Props) {
  const [title, setTitle] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    await onAdd(trimmed)
    setTitle('')
  }

  return (
    <form onSubmit={handleSubmit} className="add-form">
      <span className="add-label">Nueva entrada</span>
      <div className="add-row">
        <input
          className="add-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="¿Qué necesitas hacer hoy?"
          disabled={loading}
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="add-btn"
          aria-label="Agregar tarea"
        >
          {loading
            ? <span className="add-spinner" />
            : '→'}
        </button>
      </div>
    </form>
  )
}
