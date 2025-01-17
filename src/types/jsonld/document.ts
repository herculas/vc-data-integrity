import type { OneOrMany } from "./base.ts"
import type { NodeObject } from "./node.ts"

/**
 * A JSON-LD document is a valid JSON document that conforms to the JSON-LD grammar.
 *
 * @see https://www.w3.org/TR/json-ld11/#json-ld-grammar
 */
export type JsonLdDocument = OneOrMany<NodeObject>

/**
 * A plain document is a single JSON-LD document.
 */
export type PlainDocument = NodeObject

/**
 * A DOMString is a sequence of Unicode characters.
 */
export type DOMString = string

/**
 * An URL is a DOMString that represents an absolute URL.
 */
export type URL = DOMString

/**
 * An IRI is a URL that conforms to the IRI specification.
 */
export type IRI = URL

/**
 * An IRI reference is an IRI or a relative reference.
 */
export type IRIReference = URL

/**
 * A context URL is an URL that represents a JSON-LD context.
 */
export type ContextURL = URL

/**
 * A frame is a JSON object that represents a frame.
 */
export type Frame = NodeObject | URL
