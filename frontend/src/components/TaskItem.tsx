import type { Task } from '../api'

interface Props {
  task: Task
  index: number
  onToggle: (id: string, completed: boolean) => Promise<void>
  onDelete: (id: string) => Promise<void>
  loading: boolean
}

export default function TaskItem({ task, index, onToggle, onDelete, loading }: Props) {
  return (
    <div
      className="task-item"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Number */}
      <span className="task-num">{String(index + 1).padStart(2, '0')}</span>

      {/* Diamond checkbox */}
      <button
        className={`task-check${task.completed ? ' completed' : ''}`}
        onClick={() => onToggle(task.id, !task.completed)}
        disabled={loading}
        aria-label={task.completed ? 'Marcar pendiente' : 'Marcar completada'}
      >
        {task.completed ? '◆' : '◇'}
      </button>

      {/* Title */}
      <span className={`task-title${task.completed ? ' completed' : ''}`}>
        {task.title}
      </span>

      {/* Delete */}
      <button
        className="task-delete"
        onClick={() => onDelete(task.id)}
        disabled={loading}
        aria-label="Eliminar tarea"
      >
        ×
      </button>
    </div>
  )
}
