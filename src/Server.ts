import { Endpoint, HttpMethod, Routes } from './Common'

type Params<EP extends Endpoint> = {
  path: Stringify<EP['path']>
  body: EP['body']
}

type EpHandler<EP extends Endpoint> = (params: Params<EP>) => Promise<EP['result']>

export type Handlers<T> = { [K in keyof T]: T[K] extends Endpoint ? EpHandler<T[K]> : never }
export type Handler<T, K extends keyof T> = Handlers<T>[K]

type Stringify<T> = {
  [K in keyof T]: T[K] extends string ? T[K] : string
}

export function addHandlers<T>(router: Router, routes: Routes<T>, handlers: Handlers<T>): void {
  for (const name in routes) {
    const { method, pattern } = routes[name]

    router[method](pattern, createHandler(handlers[name]))
  }
}

const createHandler = <EP extends Endpoint>(
  handler: EpHandler<EP>
) => async (req: Request<EP['path'], EP['body']>, res: Response<EP['result']>): Promise<void> => {
  try {
    const result = await handler({ path: req.params, body: req.body })

    res.status(result ? 200 : 204).send(result)
  } catch (error) {
    res.sendStatus(500)
  }
}

// Server / router helper types, rough match to Express API

type Request<PathParams, Body> = {
  body: Body
  params: Stringify<PathParams>
}

type Response<Result> = {
  status(code: number): Response<Result>
  send(content: Result): Response<Result>
  sendStatus(code: number): Response<Result>
}

type RawHandler<PathParams, Body, Result> = (req: Request<PathParams, Body>, res: Response<Result>) => void

type Router = {
  [Method in HttpMethod]: (path: string, handler: RawHandler<any, any, any>) => void
}
