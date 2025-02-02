import type { NodeObject } from "./objects.ts"
import type { OneOrMany } from "./base.ts"
import type { URI } from "./literals.ts"

/**
 * A JSON-LD document is a serialization of an RDF dataset using JSON-LD.
 *
 * @see https://www.w3.org/TR/json-ld11/#json-ld-grammar
 */
export type JsonLdDocument = OneOrMany<NodeObject>

/**
 * A plain document is a single JSON-LD document.
 */
export type PlainDocument = NodeObject

/**
 * A frame is a JSON-LD document which describes the form for transforming another JSON-LD document using matching and
 * embedding rules. A frame document allows additional keywords and certain map entries to describe the matching and
 * transforming process.
 *
 * @see https://www.w3.org/TR/json-ld11-framing/#dfn-frame
 */
export type Frame = NodeObject | URI
