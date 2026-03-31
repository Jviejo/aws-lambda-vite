import type { Task } from '../api'
import TaskItem from './TaskItem'

interface Props {
  tasks: Task[]
  onToggle: (id: string, completed: boolean) => Promise<void>
  onDelete: (id: string) => Promise<void>
  loading: boolean
}

export default function TaskList({ tasks, onToggle, onDelete, loading }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-sm">No hay tareas todavía. Agrega una arriba.</p>
      </div>
    )
  }

  const pending = tasks.filter((t) => !t.completed)
  const completed = tasks.filter((t) => t.completed)

  return (
    <div className="flex flex-col gap-2">
      {pending.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} loading={loading} />
      ))}

      {completed.length > 0 && (
        <>
          {pending.length > 0 && <div className="border-t border-slate-100 my-2" />}
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
            Completadas ({completed.length})
          </p>
          {completed.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} loading={loading} />
          ))}
        </>
      )}
    </div>
  )
}
