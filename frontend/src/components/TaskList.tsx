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
      <div className="task-empty">
        <div className="task-empty-icon">—</div>
        <p className="task-empty-text">La página está en blanco.</p>
      </div>
    )
  }

  const pending = tasks.filter((t) => !t.completed)
  const completed = tasks.filter((t) => t.completed)

  return (
    <div>
      {pending.map((task, i) => (
        <TaskItem
          key={task.id}
          task={task}
          index={i}
          onToggle={onToggle}
          onDelete={onDelete}
          loading={loading}
        />
      ))}

      {completed.length > 0 && (
        <>
          <div className="task-section-label">
            Completadas &nbsp;{completed.length}
          </div>
          {completed.map((task, i) => (
            <TaskItem
              key={task.id}
              task={task}
              index={pending.length + i}
              onToggle={onToggle}
              onDelete={onDelete}
              loading={loading}
            />
          ))}
        </>
      )}
    </div>
  )
}
