export type HttpMethod = 'delete' | 'get' | 'patch' | 'post' | 'put'

export type Endpoints<T = any> = { [K in keyof T]: Endpoint<T[K]> }

export type Routes<T> = { [K in keyof T]: Route<T[K]> }

export type Endpoint<T = any> =
  T extends EndpointBase<infer PathParams, infer Body, infer Result, infer Pattern, infer Method>
    ? EndpointBase<PathParams, Body, Result, Pattern, Method>
    : never

export type Route<T> =
  T extends EndpointBase<infer PathParams, infer Body, infer Result, infer Pattern, infer Method>
    ? RouteBase<Pattern, Method>
    : never

type EndpointBase<
  PathParams extends MaybeObject,
  Body extends MaybeObject,
  Result,
  Pattern extends string,
  Method extends HttpMethod,
> = Call<PathParams, Body, Result> & RouteBase<Pattern, Method>

type Call<PathParams extends MaybeObject, Body extends MaybeObject, Result> = {
  path: PathParams
  body: Body
  result: Result
}

type RouteBase<Pattern extends string, Method extends HttpMethod> = {
  pattern: Pattern
  method: Method
}

type MaybeObject = object | undefined
