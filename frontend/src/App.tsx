import { useEffect, useState, useCallback } from 'react'
import { api } from './api'
import type { Task } from './api'
import AddTask from './components/AddTask'
import TaskList from './components/TaskList'
import './index.css'

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setTasks(await api.list())
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadTasks() }, [loadTasks])

  async function handleAdd(title: string) {
    setLoading(true)
    setError(null)
    try {
      const task = await api.create(title)
      setTasks((prev) => [...prev, task])
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  async function handleToggle(id: string, completed: boolean) {
    setLoading(true)
    setError(null)
    try {
      const updated = await api.update(id, { completed })
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    setLoading(true)
    setError(null)
    try {
      await api.delete(id)
      setTasks((prev) => prev.filter((t) => t.id !== id))
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const total = tasks.length
  const done = tasks.filter((t) => t.completed).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-start justify-center pt-16 px-4 pb-16">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 mb-4 shadow-lg shadow-indigo-200">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Lista de Tareas</h1>
          {total > 0 && (
            <p className="mt-1 text-sm text-slate-500">
              {done} de {total} {total === 1 ? 'tarea completada' : 'tareas completadas'}
            </p>
          )}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-6">
          <AddTask onAdd={handleAdd} loading={loading} />

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {loading && tasks.length === 0 ? (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <TaskList
              tasks={tasks}
              onToggle={handleToggle}
              onDelete={handleDelete}
              loading={loading}
            />
          )}
        </div>

        {/* Progress bar */}
        {total > 0 && (
          <div className="mt-4 px-1">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Progreso</span>
              <span>{Math.round((done / total) * 100)}%</span>
            </div>
            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${(done / total) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
