import type { OneOrMany } from "./base.ts"
import type { NodeObject } from "./node.ts"

/**
 * A JSON-LD document is a valid JSON document that conforms to the JSON-LD grammar.
 *
 * @see https://www.w3.org/TR/json-ld11/#json-ld-grammar
 */
export type JsonLdDocument = OneOrMany<NodeObject>

export type PlainDocument = NodeObject

export type DOMString = string
export type URL = DOMString
export type IRI = URL
export type IRIReference = URL
export type ContextURL = URL
export type Frame = NodeObject | URL
