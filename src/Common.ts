export type HttpMethod = 'delete' | 'get' | 'patch' | 'post' | 'put'

type MaybeObject = object | undefined

type Params<PathParams extends MaybeObject, Body extends MaybeObject> = {
  path: PathParams
  body: Body
}

type RouteBase<Pattern extends string, Method extends HttpMethod> = {
  pattern: Pattern
  method: Method
}

type EndpointBase<PathParams extends MaybeObject, Body extends MaybeObject, Result, Pattern extends string, Method extends HttpMethod> =
  Params<PathParams, Body> & RouteBase<Pattern, Method> & { result: Result }

export type Endpoint<T = any> = T extends EndpointBase<infer PathParams, infer Body, infer Result, infer Path, infer Method>
  ? EndpointBase<PathParams, Body, Result, Path, Method>
  : never

export type Route<T> = T extends EndpointBase<infer PathParams, infer Body, infer Result, infer Path, infer Method>
  ? RouteBase<Path, Method>
  : never

export type Endpoints<T> = { [K in keyof T]: Endpoint<T[K]> }

export type Routes<T> = { [K in keyof T]: Route<T[K]> }
