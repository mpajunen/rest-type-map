// A basic object data store with CRUD operations

type WithId<T> = T & { id: number }

export type Store<T> = {
  add(values: T): WithId<T>
  edit(id: number, values: T): WithId<T>
  get(id: number): WithId<T>
  getAll(): WithId<T>[]
  remove(id: number): void
}

export function createStore<T>(initialData: T[]): Store<T> {
  const add = (values: T) => {
    maxId += 1
    return edit(maxId, values)
  }
  const edit = (id: number, values: T) => {
    const record = { ...values, id }
    data[id] = record
    return record
  }
  const get = (id: number) => data[id]
  const getAll = () => Object.values(data)
  const remove = (id: number) => {
    delete data[id]
  }

  const data: Record<number, WithId<T>> = {}
  let maxId = 0

  initialData.forEach(add)

  return { add, edit, get, getAll, remove }
}
