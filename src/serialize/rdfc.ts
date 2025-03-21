/**
 * A set of functions to serialize and deserialize JSON-LD documents to and from RDF datasets, as well as to perform
 * RDF dataset canonicalization.
 *
 * @module rdfc
 *
 * @see https://www.w3.org/TR/rdf-canon/
 * @see https://www.w3.org/TR/json-ld/
 * @see https://www.w3.org/TR/json-ld11-api/
 * @see https://www.w3.org/TR/json-ld11-framing/
 */

import * as jsonld from "jsonld"
import * as rdf from "rdf-canonize"

import type { Canonize } from "../types/options/serialize.ts"
import type { Compact, Expand, Flatten, Frame, Normalize, ToRdf } from "../types/options/serialize.ts"
import type { Context } from "../types/serialize/keyword.ts"
import type { IRI } from "../types/serialize/base.ts"
import type { JsonLdDocument, JsonLdObject, OneOrMany } from "../types/serialize/document.ts"
import type { NQuad, RdfDataset } from "../types/serialize/rdf.ts"

/**
 * Compaction is the process of applying a developer-supplied context to shorten IRIs to terms or compact IRIs and
 * JSON-LD values expressed in expanded form to simple values such as strings or numbers. Often this makes it simpler to
 * work with document as the data is expressed in application-specific terms. Compact documents are also typically
 * easier to read and write for humans.
 *
 * JSON-LD's media type defines a profile parameter which can be used to signal or request compacted document form. The
 * profile URI identifying compacted document form is `http://www.w3.org/ns/json-ld#compacted`.
 *
 * @param {JsonLdDocument} input The JSON-LD document to compact.
 * @param {Context} context The context to compact with.
 * @param {Compact} [options] The options to use.
 *
 * @returns {Promise<JsonLdObject>} Resolve to the compacted JSON-LD document.
 *
 * @see https://www.w3.org/TR/json-ld/#compacted-document-form
 * @see https://www.w3.org/TR/json-ld11-api/#compaction
 */
export async function compact(
  input: JsonLdDocument,
  context: Context,
  options?: Compact,
): Promise<JsonLdObject> {
  return await jsonld.default.compact(input, context, options)
}

/**
 * Expansion is the process of taking a JSON-LD document and applying a context such that all IRIs, types, and values
 * are expanded so that `@context` is no longer necessary.
 *
 * Expansion has two important goals:
 *
 * 1. removing any contextual information from the document, and
 * 2. ensuring all values are represented in a regular form.
 *
 * These goals are accomplished by expanding all entry keys to IRIs and by expressing all values in arrays in expanded
 * form. Expanded form is the most verbose and regular way of expressing of values in JSON-LD; all contextual
 * information from the document is instead stored locally with each value.
 *
 * @param {JsonLdDocument} input The JSON-LD document to expand.
 * @param {Expand} [options] The options to use.
 *
 * @returns {Promise<JsonLdDocument>} Resolve to the expanded JSON-LD document.
 *
 * @see https://www.w3.org/TR/json-ld/#expanded-document-form
 * @see https://www.w3.org/TR/json-ld11-api/#expansion
 */
export async function expand(
  input: JsonLdDocument,
  options?: Expand,
): Promise<Array<JsonLdObject>> {
  return await jsonld.default.expand(input, options)
}

/**
 * Flattening collects all properties of a node in a single map and labels all blank nodes with blank node identifiers.
 * This ensures a shape of the data and consequently may drastically simplify the code required to process JSON-LD in
 * certain applications.
 *
 * JSON-LD's media type defines a profile parameter which can be used to signal or request flattened document form. The
 * profile URI identifying flattened document form is `http://www.w3.org/ns/json-ld#flattened`. It can be combined with
 * the profile URL identifying expanded document form or compacted document form.
 *
 * @param {JsonLdDocument} input The JSON-LD document to flatten.
 * @param {Context} [context] The context to flatten with.
 * @param {Flatten} [options] The options to use.
 *
 * @returns {Promise<JsonLdObject>} Resolve to the flattened JSON-LD document.
 */
export async function flatten(
  input: JsonLdDocument,
  context?: Context,
  options?: Flatten,
): Promise<JsonLdObject> {
  return await jsonld.default.flatten(input, context, options)
}

/**
 * Framing is used to shape the data in JSON-LD document, using an example frame document which is used to both match
 * the flattened data and show an example of how the resulting data should be shaped.
 *
 * Matching is performed by using properties present in the frame to find objects in the data that share common values.
 * Matching can be done either using all properties present in the frame, or any property in the frame. By chaining
 * together objects using matched property values, objects can be embedded within one another.
 *
 * A frame also includes a context, which is used for compacting the resulting framed output.
 *
 * JSON-LD's media type defines a `profile` parameter which can be used to signal or request framed document form. The
 * profile URI identifying framed document form is `http://www.w3.org/ns/json-ld#framed`. JSON-LD's media type also
 * defines a `profile` parameter which can be used to identify a script element in an HTML document containing a frame.
 * The first script element of type `application/ld+json;profile=http://www.w3.org/ns/json-ld#frame` will be used to
 * find a frame.
 *
 * @param {JsonLdDocument} input The JSON-LD document to frame.
 * @param {Frame} frame The JSON-LD frame to use.
 * @param {Frame} [options] The options.
 *
 * @returns {Promise<JsonLdObject>} Resolve to the framed JSON-LD document.
 *
 * @see https://www.w3.org/TR/json-ld/#framed-document-form
 * @see https://www.w3.org/TR/json-ld11-framing/#framing
 */
export async function frame(
  input: JsonLdDocument,
  frame: JsonLdObject | IRI,
  options?: Frame,
): Promise<JsonLdObject> {
  return await jsonld.default.frame(input, frame, options)
}

/**
 * Perform the RDF dataset canonicalization on the specified input, which should be a JSON-LD document unless the
 * `inputFormat` field is specified in the options. The output should be an RDF dataset unless the `format` field is
 * specified in the options.
 *
 * The canonization process sets `safe` to `true` and `base` to `null` by default, in order to produce safe outputs
 * and "fail closed". This is different from the other API transformations which allow unsafe defaults (for
 * cryptographic usage) in order to comply with the JSON-LD 1.1 specification.
 *
 * @param {JsonLdDocument} input The input document to normalize.
 * @param {Normalize} [options] The options to use.
 *
 * @returns {Promise<NQuad>} Resolve to the normalized RDF dataset.
 *
 * @see https://www.w3.org/TR/json-ld11-api/#rdf-serialization-deserialization
 */
export async function normalize(
  input: JsonLdDocument,
  options?: Normalize,
): Promise<NQuad> {
  return await jsonld.default.canonize(input, options)
}

/**
 * Deserialize a JSON-LD document to an RDF dataset.
 *
 * @param {JsonLdDocument} input The JSON-LD document to deserialize.
 * @param {ToRdf} [options] The options to use.
 *
 * @returns {Promise<NQuad>} Resolve to the RDF dataset, which is a string of N-Quads.
 */
export async function toRdf(
  input: JsonLdDocument,
  options?: ToRdf,
): Promise<NQuad | RdfDataset> {
  return await jsonld.default.toRDF(input, options)
}

/**
 * RDFC-1.0 canonically labels an RDF dataset by assigning each blank node a canonical identifier. In RDFC-1.0, an RDF
 * dataset is represented as a set of quads of the form `<s, p, o, g>`, where the graph component `g` is empty if and
 * only if the triple `<s, p, o>` is in the default graph.
 *
 * It is expected that, for two RDF datasets, RDFC-1.0 returns the same canonically labeled list of quads if and only if
 * the two datasets are isomorphic (i.e., the same modulo blank node identifiers).
 *
 * @param {OneOrMany<NQuad> | RdfDataset} input The RDF dataset to canonize.
 * @param {Canonize} [options] The options to use.
 *
 * @returns {Promise<NQuad>} Resolve to the canonically labeled RDF dataset.
 *
 * @see https://www.w3.org/TR/rdf-canon/#canon-algorithm
 */
export async function canonize(
  input: OneOrMany<NQuad> | RdfDataset,
  options: Canonize,
): Promise<NQuad> {
  return await rdf.default.canonize(input, options)
}

/**
 * Convert an RDF dataset to N-Quad strings.
 *
 * @param {RdfDataset} dataset The RDF dataset to serialize.
 *
 * @returns {Array<NQuad>} The serialized RDF dataset.
 */
export function serialize(dataset: RdfDataset): Array<NQuad> {
  const serialized: string = rdf.default.NQuads.serialize(dataset)
  return serialized.split("\n").slice(0, -1)
}
