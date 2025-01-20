import type { OneOrMany } from "./base.ts"
import type { NodeObject } from "./objects.ts"

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
 * An Internationalized Resource Identifier (IRI) is defined to extend the syntax of URIs to a much wider repertoire of
 * characters.
 *
 * The absolute form of an IRI contains a scheme, along with a path and optionally a query and fragment segments.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc3987
 */
export type IRI = string

/**
 * A Uniform Resource Identifier (URI) is defined as a sequence of characters chosen from a limited subset of the
 * repertoire of US-ASCII characters. The characters in URIs are frequently used for representing words of natural
 * languages.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc3986
 */
export type URI = IRI

/**
 * A frame is a JSON-LD document which describes the form for transforming another JSON-LD document using matching and
 * embedding rules. A frame document allows additional keywords and certain map entries to describe the matching and
 * transforming process.
 *
 * @see https://www.w3.org/TR/json-ld11-framing/#dfn-frame
 */
export type Frame = NodeObject | URI
