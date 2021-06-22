import { Endpoint, Endpoints, HttpMethod, Route, Routes } from './Common'

export type Handlers<T extends Endpoints> = { [K in keyof T]: Handler<T[K]> }
type Handler<EP extends Endpoint> =
  EP['body'] extends object
    ? HandlerFull<EP>
    : EP['path'] extends object
    ? HandlerPath<EP>
    : HandlerNone<EP>
type HandlerFull<EP extends Endpoint> = (params: EP['path'], body: EP['body']) => Promise<EP['result']>
type HandlerPath<EP extends Endpoint> = (params: EP['path']) => Promise<EP['result']>
type HandlerNone<EP extends Endpoint> = () => Promise<EP['result']>

/** Create client API from routes */
export function createHandlers<T extends Endpoints>(
  client: HttpClient,
  routes: Routes<T>,
): Handlers<T> {
  function createHandler<EP extends T[keyof T]>({ method, pattern }: Route<EP>) {
    const handler: HandlerFull<EP> = (params, data) => {
      const url = getUrl(pattern, params)

      return client.request<EP['result']>({ data, method, url }).then(r => r.data)
    }

    // Remove unnecessary undefined parameters:
    return handler as Handler<EP>
  }

  // Can't infer that all handlers are created:
  const handlers = {} as Handlers<T>
  for (const name in routes) {
    handlers[name] = createHandler(routes[name])
  }

  return handlers
}

/** Create request URL from path parameters */
const getUrl = (path: string, params?: object): string =>
  Object.entries(params ?? {}).reduce(
    (current, [name, value]) => current.replace(`:${name}`, encodeURIComponent(value)),
    path,
  )

/** HTTP client helper type, rough match to Axios API */
type HttpClient = {
  request: <Data>(config: HttpConfig) => Promise<{ data: Data }>
}
type HttpConfig = { data?: object, method: HttpMethod, url: string }
