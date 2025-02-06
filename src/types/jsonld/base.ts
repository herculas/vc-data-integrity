import type { NodeObject } from "./objects.ts"
import type { URI } from "./literals.ts"

/**
 * One or multiple values of type `T`.
 */
export type OneOrMany<T> = T | Array<T>

/**
 * A JSON primitive also known as a scalar value, is a value that is not an object or array. It is a value that can be
 * represented as a single string, number, boolean, or null value.
 */
export type JsonPrimitive = string | number | boolean | null

export interface JsonArray extends Array<JsonValue> {}

export interface JsonObject {
  [key: string]: JsonValue | undefined
}

type JsonValue = JsonPrimitive | JsonObject | JsonArray

export type JsonLdObject = NodeObject

/**
 * A JSON-LD document is a serialization of an RDF dataset using JSON-LD. A JSON-LD document MUST be a valid JSON text
 * as described in {@link https://datatracker.ietf.org/doc/html/rfc8259 | RFC-8259}, or some format that can be
 * represented in the JSON-LD internal representation that is equivalent to a valid JSON text.
 *
 * @see https://www.w3.org/TR/json-ld11/#json-ld-grammar
 */
export type JsonLdDocument = OneOrMany<JsonLdObject>

/**
 * A frame is a JSON-LD document which describes the form for transforming another JSON-LD document using matching and
 * embedding rules. A frame document allows additional keywords and certain map entries to describe the matching and
 * transforming process.
 *
 * @see https://www.w3.org/TR/json-ld11-framing/#dfn-frame
 */
export type Frame = NodeObject | URI
