/** The Base Result type.
 * 
 * @typeParam V The type of the Ok value.
 * @typeParam E The type of the Err value.
 */
interface BaseResult<V, E> {
  isOk(): this is Ok<V, E>;
  isErr(): this is Err<V, E>;
  match<VR, ER>(matcher: Matcher<V, VR, E, ER>): Result<VR, ER>;

  /**
   * Returns the contained `Ok` value.
   * 
   * throws and error if the inner value is an `Err`.
   */
  unwrap(): V | never;
}

export type Result<V, E> = (Ok<V, E> | Err<V, E>) & {
  //map<V extends Result<any, any>, X>(result: V, fn: (v: ResultOk<V>) => X): Result<X, ResultErr<V>>
};

// type ResultOk<V extends Result<any, any>> = V extends Result<infer OK, any> ? OK : never;

// type ResultErr<V extends Result<any, any>> = V extends Result<any, infer Err> ? Err : never;

/** The `Ok` type.
 * 
 * This type represents a complete or correct value being returned.
 */
export interface Ok<V, E> extends BaseResult<V, E> {
  isOk(): this is Ok<V, E>;
  isErr(): false;
  value(): V;
  unwrap(): V;
}

/** The `Err` type.
 * 
 * This type represents an error that occured and is meant to be handled .
 */
export interface Err<V, E> extends BaseResult<V, E> {
  isOk(): false;
  isErr(): this is Err<V, E>;
  error(): E;
  unwrap(): never;
}

/** A type representing a branch between Ok and Error.
 * 
 * A matcher is used to construct a new Result depending on
 * the contents.
 * 
 * # Examples
 * ```ts
 * const x = Ok(2)
 *  .match({
 *    ok: v => Ok(v * 2),
 *    err: e => e
 *  }); 
 * ```
 */
export interface Matcher<V, VR, E, ER> {
  ok: ResultReturnType<V> extends void ? () => VR : (v: V) => VR;
  err: ResultReturnType<E> extends void ? () => ER : (e: E) => ER;
}

/** The main constructor for constructon a result.
 * 
 * @param param0  The value of the result.
 */
function baseResult<V, E>(
  value: V | E,
  create_ok: boolean,
): Result<V, E> {
  function isOk() {
    return create_ok;
  }

  function isErr() {
    return !isOk();
  }

  function match<VR, ER>(
    matcher: Matcher<V, VR, E, ER>,
  ): Result<ResultReturnType<VR>, ResultReturnType<ER>> {
    if (create_ok) {
      const v = value as V;
      const new_value = matcher.ok(v);
      return Ok(new_value);
    } else {
      return Err(matcher.err(value as E));
    }
  }

  function unwrap(): V {
    if (create_ok) {
      return value as V;
    }

    throw `Unwrapping Err: ${value}`;
  }

  if (isOk()) {
    return {
      isOk,
      isErr,
      value: () => value,
      match,
      unwrap,
    } as Result<V, E>;
  }

  return {
    isOk,
    isErr,
    error: () => value,
    match,
  } as Result<V, E>;
}

export type ResultReturnType<InnerType> = InnerType extends undefined | void
  ? void
  : InnerType;

// export function Ok<V, E>(): Ok<void, E>;
// export function Ok<V, E>(value: undefined): Ok<void, E>;
// export function Ok<V, E>(value: V): Ok<V, E>;
export function Ok<V, E>(value?: V): Ok<ResultReturnType<V>, E> {
  return baseResult<V, E>(
    value as any,
    true,
  ) as Ok<ResultReturnType<V>, E>;
}

export function Err<V, E>(error?: E): Err<V, ResultReturnType<E>> {
  return baseResult<V, E>(
    error as any,
    false,
  ) as Err<V, ResultReturnType<E>>;
}