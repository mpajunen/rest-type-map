// A basic object data store with CRUD operations

export type Store<T extends { id: number }> = {
  add(values: Omit<T, 'id'>): T
  edit(id: number, values: Omit<T, 'id'>): T
  get(id: number): T
  getAll(): T[]
  remove(id: number): void
}

export function createStore<T extends { id: number }>(initialData: Omit<T, 'id'>[]): Store<T> {
  const add = (values: Omit<T, 'id'>) => {
    maxId += 1
    return edit(maxId, values)
  }
  const edit = (id: number, values: Omit<T, 'id'>) => {
    const record = { id, ...values } as T
    data[id] = record
    return record
  }
  const get = (id: number) => data[id]
  const getAll = () => Object.values(data)
  const remove = (id: number) => {
    delete data[id]
  }

  const data: Record<number, T> = {}
  let maxId = 0

  initialData.forEach(add)

  return { add, edit, get, getAll, remove }
}
