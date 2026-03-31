import type { Task } from '../api'

interface Props {
  task: Task
  onToggle: (id: string, completed: boolean) => Promise<void>
  onDelete: (id: string) => Promise<void>
  loading: boolean
}

export default function TaskItem({ task, onToggle, onDelete, loading }: Props) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition group ${
        task.completed
          ? 'bg-slate-50 border-slate-100'
          : 'bg-white border-slate-200 hover:border-indigo-200 hover:shadow-sm'
      }`}
    >
      <button
        onClick={() => onToggle(task.id, !task.completed)}
        disabled={loading}
        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 transition flex items-center justify-center ${
          task.completed
            ? 'bg-emerald-500 border-emerald-500'
            : 'border-slate-300 hover:border-indigo-400'
        } disabled:opacity-50`}
        aria-label={task.completed ? 'Marcar incompleta' : 'Marcar completa'}
      >
        {task.completed && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <span
        className={`flex-1 text-sm leading-relaxed ${
          task.completed ? 'line-through text-slate-400' : 'text-slate-700'
        }`}
      >
        {task.title}
      </span>

      <button
        onClick={() => onDelete(task.id)}
        disabled={loading}
        className="opacity-0 group-hover:opacity-100 flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition disabled:opacity-30"
        aria-label="Eliminar tarea"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  )
}
