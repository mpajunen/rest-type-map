import { Endpoint, HttpMethod, Route, Routes } from './Common'

type HandlerFull<EP extends Endpoint> = (params: EP['path'], body: EP['body']) => Promise<EP['result']>
type HandlerPath<EP extends Endpoint> = (params: EP['path']) => Promise<EP['result']>
type HandlerNone<EP extends Endpoint> = () => Promise<EP['result']>

type EpHandler<EP extends Endpoint> =
  EP['body'] extends object
    ? HandlerFull<EP>
    : EP['path'] extends object
    ? HandlerPath<EP>
    : HandlerNone<EP>

export type Handlers<T> = { [K in keyof T]: T[K] extends Endpoint ? EpHandler<T[K]> : never }
export type Handler<T, K extends keyof T> = Handlers<T>[K]

export function createHandlers<T>(client: HttpClient, routes: Routes<T>): Handlers<T> {
  function createHandler<EP extends Endpoint>({ method, pattern }: Route<EP>): EpHandler<EP> {
    const handler: HandlerFull<EP> = (params, data) => {
      const url = getUrl(pattern, params)

      return client.request<EP['result']>({ data, method, url }).then(r => r.data)
    }

    return handler as EpHandler<EP>
  }

  const handlers = {} as Handlers<T>
  for (const name in routes) {
    handlers[name] = createHandler(routes[name]) as any
  }

  return handlers
}

const getUrl = (path: string, params?: object): string =>
  Object.entries(params ?? {}).reduce(
    (current: string, [name, value]) => current.replace(`:${name}`, encodeURIComponent(value)),
    path,
  )

// HttpClient helper type, rough match to Axios API
type HttpClient = {
  request: <Data>(config: { data?: object, method: HttpMethod, url: string }) => Promise<{ data: Data }>
}
