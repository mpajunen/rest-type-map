export type HttpMethod = 'delete' | 'get' | 'patch' | 'post' | 'put'

export type Params<Path, Body> = {
  path: Path
  body: Body
}

export type Route<Path, Method> = {
  path: Path extends string ? Path : never
  method: Method extends HttpMethod ? Method : never
}

export type Routes<T> = {
  [K in keyof T]: T[K] extends Endpoint<infer PathParams, infer Body, infer Result, infer Path, infer Method>
    ? Route<Path, Method>
    : never
}

export type Endpoint<PathParams, Body, Result, Path, Method> =
  & { params: Params<PathParams, Body>; result: Result }
  & Route<Path, Method>
