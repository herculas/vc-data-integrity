/**
 * One or multiple values of type `T`.
 */
export type OneOrMany<T> = T | Array<T>
export interface JsonArray extends Array<JsonValue> {}

type JsonValue = Scalar | JsonObject | JsonArray

export interface JsonObject {
  [key: string]: JsonValue | undefined
}

/**
 * A scalar is either a string, number, boolean, or null.
 */
export type Scalar = string | number | boolean | null

/**
 * A type is a string that represents a type IRI or a compact IRI.
 */
export type Type = string

/**
 * A dateTimeStamp is a string that represents a date and time in the `dateTimeStamp` format.
 */
export type DateTime = string
