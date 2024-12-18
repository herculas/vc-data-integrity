import type { NodeObject, OneOrMany } from "./basic.ts"

/**
 * A JSON-LD document is a valid JSON document that conforms to the JSON-LD grammar.
 * @see https://www.w3.org/TR/json-ld11/#json-ld-grammar
 */
export type JsonLdDocument = OneOrMany<NodeObject>
