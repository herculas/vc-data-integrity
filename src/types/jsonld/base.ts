import type { Primitive } from "./keywords.ts"

/**
 * One or multiple values of type `T`.
 */
export type OneOrMany<T> = T | Array<T>
export interface JsonArray extends Array<JsonValue> {}

type JsonValue = Primitive | JsonObject | JsonArray

export interface JsonObject {
  [key: string]: JsonValue | undefined
}
