import { useEffect, useState, useCallback } from 'react'
import { api } from './api'
import type { Task } from './api'
import AddTask from './components/AddTask'
import TaskList from './components/TaskList'
import ProgressRing from './components/ProgressRing'
import './index.css'

const DAYS_ES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

function getDate() {
  const d = new Date()
  return {
    day: d.getDate(),
    month: MONTHS_ES[d.getMonth()],
    year: d.getFullYear(),
    weekday: DAYS_ES[d.getDay()],
  }
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const date = getDate()

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
    <div className="app">
      {/* ── Sidebar ────────────────────────────────── */}
      <aside className="sidebar">
        <span className="sidebar-label">Agenda</span>

        <div className="sidebar-ring">
          <ProgressRing total={total} done={done} />
        </div>

        <div className="sidebar-date">
          <div className="sidebar-day">{date.day}</div>
          <div className="sidebar-month">{date.month} {date.year}</div>
          <div className="sidebar-weekday">{date.weekday}</div>
        </div>
      </aside>

      {/* ── Main ───────────────────────────────────── */}
      <main className="main">
        <AddTask onAdd={handleAdd} loading={loading} />

        {error && (
          <div className="error-bar">
            {error}
          </div>
        )}

        {loading && tasks.length === 0 ? (
          <div className="loading-row">
            <span className="add-spinner" style={{ width: 20, height: 20 }} />
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onToggle={handleToggle}
            onDelete={handleDelete}
            loading={loading}
          />
        )}
      </main>
    </div>
  )
}
