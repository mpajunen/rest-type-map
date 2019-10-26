import { Endpoint, HttpMethod, Routes } from './Common'

export type ServerParams<Path, Body> = {
  path: Stringify<Path>
  body: Body
}

export type ServerHandler<PathParams, Body, Result> =
  (params: ServerParams<PathParams, Body>) => Promise<Result>

export type ServerHandlers<T> = {
  [K in keyof T]: T[K] extends Endpoint<infer PathParams, infer Body, infer Result, infer Path, infer Method>
    ? ServerHandler<PathParams, Body, Result>
    : never
}

export type Stringify<T> = {
  [K in keyof T]: T[K] extends string ? T[K] : string
}

export function addServerApi<T>(router: Router, routes: Routes<T>, handlers: ServerHandlers<T>): void {
  for (const name in routes) {
    const { method, path } = routes[name]

    router[method as HttpMethod](path as string, createHandler(handlers[name]))
  }
}

const createHandler = <PathParams, Body, Result>(
  handler: ServerHandler<PathParams, Body, Result>
) => async (req: Request<PathParams, Body>, res: Response<Result>): Promise<void> => {
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
