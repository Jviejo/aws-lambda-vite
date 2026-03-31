const API_URL = import.meta.env.VITE_API_URL as string

export interface Task {
  id: string
  title: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data as T
}

export const api = {
  list: () => request<Task[]>('/tasks'),
  create: (title: string) =>
    request<Task>('/tasks', { method: 'POST', body: JSON.stringify({ title }) }),
  update: (id: string, patch: Partial<Pick<Task, 'title' | 'completed'>>) =>
    request<Task>(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(patch) }),
  delete: (id: string) =>
    request<{ message: string }>(`/tasks/${id}`, { method: 'DELETE' }),
}
