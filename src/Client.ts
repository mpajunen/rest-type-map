import { Endpoint, HttpMethod, Route, Routes } from './Common'

export type ClientApi<T> = {
  [K in keyof T]: T[K] extends Endpoint<infer PathParams, infer Body, infer Result, infer Path, infer Method>
    ? ClientHandler<PathParams, Body, Result>
    : never
}

export type ClientHandler<PathParams, Body, Result> =
  Body extends object ? (path: PathParams, body: Body) => Promise<Result>
    : PathParams extends object ? (path: PathParams) => Promise<Result>
    : () => Promise<Result>

export function createClientApi<T>(client: HttpClient, routes: Routes<T>): ClientApi<T> {
  function createHandler<PathParams extends object | undefined, Body extends object | undefined, Result, Path, Method>(
    route: Route<Path, Method>,
  ): ClientHandler<PathParams, Body, Result> {
    return (
      (path: PathParams, body: Body): Promise<Result> =>
        client[route.method](getParametrizedPath(route.path, path), body).then(r => r.data)
    ) as ClientHandler<PathParams, Body, Result>
  }

  const api: ClientApi<T> = {} as ClientApi<T>
  for (const name in routes) {
    api[name] = createHandler(routes[name] as any) as any
  }

  return api
}

const getParametrizedPath = (path: string, params: object = {}): string =>
  Object.entries(params).reduce(
    (current: string, [name, value]) => current.replace(`:${name}`, value),
    path,
  )

// HttpClient helper type, rough match to Axios API

type HttpClient = {
  [Method in HttpMethod]: (path: string, body?: object) => Promise<{ data: any }>
}
