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
    <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nueva tarea..."
        disabled={loading}
        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:opacity-50 text-sm"
      />
      <button
        type="submit"
        disabled={loading || !title.trim()}
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold rounded-xl transition text-sm whitespace-nowrap"
      >
        {loading ? 'Agregando...' : '+ Agregar'}
      </button>
    </form>
  )
}
