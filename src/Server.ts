import { Endpoint, Endpoints, HttpMethod, Routes } from './Common'

export type Handlers<T extends Endpoints> = { [K in keyof T]: Handler<T[K]> }
export type Handler<EP extends Endpoint> = (params: Params<EP>) => Promise<EP['result']>

type Params<EP extends Endpoint> = {
  path: Stringify<EP['path']>
  body: EP['body']
}
type Stringify<T> = { [K in keyof T]: T[K] extends string ? T[K] : string }

export function addHandlers<T extends Endpoints>(
  router: Router,
  routes: Routes<T>,
  handlers: Handlers<T>,
): void {
  for (const name in routes) {
    const { method, pattern } = routes[name]

    router[method](pattern, createHandler(handlers[name]))
  }
}

const createHandler = <EP extends Endpoint>(handler: Handler<EP>): RouteHandler<EP> =>
  async (req, res) => {
    try {
      const result = await handler({ path: req.params, body: req.body })

      res.send(result)
    } catch (error) {
      res.sendStatus(500)
    }
  }

// Server / router helper types, rough match to Express API

type Router = Record<HttpMethod, (path: string, handler: RouteHandler<any>) => void>
type RouteHandler<EP extends Endpoint> =
  (req: Request<EP['path'], EP['body']>, res: Response<EP['result']>) => void

type Request<PathParams, Body> = {
  body: Body
  params: Stringify<PathParams>
}
type Response<Result> = {
  send(content: Result): Response<Result>
  sendStatus(code: number): Response<Result>
}
