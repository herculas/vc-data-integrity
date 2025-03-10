import * as jsonld from "../serialize/jsonld.ts"

import { BasicError, BasicErrorCode } from "../error/basic.ts"

import type { JsonLdDocument, JsonLdObject, JsonObject, JsonValue } from "../types/serialize/document.ts"
import type { NQuad } from "../types/serialize/rdf.ts"
import type { URNScheme } from "../types/serialize/base.ts"

import type * as JsonLdOptions from "../types/api/jsonld.ts"

/**
 * Replace all blank node identifiers in an array of N-Quad strings with custom scheme URNs.
 *
 * Note that this operation is intended to be reversible through the use of the `deskolemizeNQuads` function.
 *
 * @param {Array<NQuad>} inputNQuads An array of N-Quad strings.
 * @param {URNScheme} urnScheme A URN scheme.
 *
 * @returns {Array<NQuad>} An array of N-Quad strings with blank node identifiers replaced with URNs.
 *
 * @see https://www.w3.org/TR/vc-di-ecdsa/#skolemizenquads
 */
export function skolemizeNQuads(inputNQuads: Array<NQuad>, urnScheme: URNScheme): Array<NQuad> {
  // Procedure:
  //
  // 1. Create a new array of N-Quad strings, `skolemizedNQuads`.
  // 2. For each N-Quad string, `s1`, in `inputNQuads`, do:
  //
  //    2.1. Create a new empty string, `s2`, that is a copy of `s1` replacing any occurrences of a blank node
  //         identifier with a URN ("urn:"), plus the input custom scheme (`urnScheme`), plus a colon (":"), and the
  //         value of the blank node identifier. For example, a regular expression of a similar form to the following
  //         would achieve the desired result: `s1.replace(/(_:([^\s]+))/g, '<urn:custom-scheme:$2>')`.
  //    2.2. Append `s2` to `skolemizedNQuads`.
  //
  // 3. Return `skolemizedNQuads`.

  const skolemizedNQuads: Array<NQuad> = []
  for (const s1 of inputNQuads) {
    const s2 = s1.replace(/(_:([^\s]+))/g, `<urn:${urnScheme}:$2>`)
    skolemizedNQuads.push(s2)
  }
  return skolemizedNQuads
}

/**
 * Replace all custom scheme URNs in an array of N-Quad strings with a blank node identifier.
 *
 * Note that this operation is intended to be reversible through the use of the `skolemizeNQuads` function.
 *
 * @param {Array<NQuad>} inputNQuads An array of N-Quad strings.
 * @param {URNScheme} urnScheme A URN scheme.
 *
 * @returns {Array<NQuad>} An array of N-Quad strings with URNs replaced with blank node identifiers.
 *
 * @see https://www.w3.org/TR/vc-di-ecdsa/#deskolemizenquads
 */
export function deskolemizeNQuads(inputNQuads: Array<NQuad>, urnScheme: URNScheme): Array<NQuad> {
  // Procedure:
  //
  // 1. Create a new array of N-Quad strings, `deskolemizedNQuads`.
  // 2. For each N-Quad string, `s1`, in `inputNQuads`, do:
  //
  //    2.1. Create a new empty string, `s2`, that is a copy of `s1` replacing any occurrences of a URN ("urn:"), plus
  //         the input custom scheme (`urnScheme`), plus a colon (":"), and the value of the blank node identifier with
  //         a blank node prefix ("_:"), plus the value of the blank node identifier. For example, a regular expression
  //         of a similar form to the following would achieve the desired result:
  //         `s1.replace(/(<urn:custom-scheme:([^>]+)>)/g, '_:$2')`.
  //    2.2. Append `s2` to `deskolemizedNQuads`.
  //
  // 3. Return `deskolemizedNQuads`.

  const deskolemizedNQuads: Array<NQuad> = []
  for (const s1 of inputNQuads) {
    const regex = new RegExp(`(<urn:${urnScheme}:([^>]+)>)`, "g")
    const s2 = s1.replace(regex, "_:$2")
    deskolemizedNQuads.push(s2)
  }
  return deskolemizedNQuads
}

/**
 * Convert a skolemized JSON-LD document, such as one created using the algorithm in `skolemizeCompactJsonLd`, to an
 * array of deskolemized N-Quads.
 *
 * @param {JsonLdDocument} skolemizedDocument A JSON-LD document.
 * @param {URNScheme} urnScheme A URN scheme, which should match the scheme used in the skolemization process.
 * @param {JsonLdOptions.ToRdf} [options] Any additional custom options.
 *
 * @returns {Array<NQuad>} Resolve to an array of deskolemized N-Quad strings.
 *
 * @see https://www.w3.org/TR/vc-di-ecdsa/#todeskolemizednquads
 */
export async function toDeskolemizedNQuads(
  skolemizedDocument: JsonLdDocument,
  urnScheme?: URNScheme,
  options?: JsonLdOptions.ToRdf,
): Promise<Array<NQuad>> {
  // Procedure:
  //
  // 1. Initialize `skolemizedDataset` to the result of the Deserialize JSON-LD to RDF algorithm, passing `options`, to
  //    convert `skolemizedDocument` from JSON-LD to RDF in N-Quads format.
  // 2. Split `skolemizedDataset` into an array of individual N-Quad strings, `skolemizedNQuads`.
  // 3. Set `deskolemizedNQuads` to the result of calling the `deskolemizeNQuads` function, passing `skolemizedNQuads`
  //    and "custom-scheme:" as parameters. Implementations MAY choose a different `urnScheme` that is different than
  //    the default "custom-scheme:" so long as the same scheme name was used to generate the `skolemizedDocument`.
  // 4. Return `deskolemizedNQuads`.

  urnScheme = urnScheme || "custom-scheme"
  const skolemizedDataset = await jsonld.toRdf(skolemizedDocument, {
    ...options,
    format: "application/n-quads",
  }) as string
  const skolemizedNQuads = skolemizedDataset.split("\n").slice(0, -1).map((nq) => nq + "\n")
  const deskolemizedNQuads = deskolemizeNQuads(skolemizedNQuads, urnScheme)
  return deskolemizedNQuads
}

/**
 * Replace all blank node identifiers in an expanded JSON-LD document with custom-scheme URNs, including assigning such
 * URNs to blank nodes that are unlabeled.
 *
 * Note that the skolemization used in this operation is intended to be reversible through the use of the
 * `toDeskolemizedNQuads` function.
 *
 * @param {Array<JsonLdObject>} expanded An expanded JSON-LD document.
 * @param {URNScheme} [urnScheme] A custom URN scheme.
 * @param {string} [randomString] A UUID string or other comparably random string.
 * @param {number} [count] A reference to a shared integer.
 *
 * @returns {Array<JsonLdObject>} The expanded form of the skolemized JSON-LD document.
 *
 * @see https://www.w3.org/TR/vc-di-ecdsa/#skolemizeexpandedjsonld
 */
function skolemizeExpandedJsonLd(
  expanded: Array<JsonLdObject>,
  urnScheme?: URNScheme,
  randomString?: string,
  count?: number,
): Array<JsonLdObject> {
  urnScheme = urnScheme || "custom-scheme"
  randomString = randomString || crypto.randomUUID()
  count = count || 0
  return skolemizeExpandedRecursive(
    expanded as Array<JsonValue>,
    {
      urnScheme,
      randomString,
      count,
    },
  ) as Array<JsonLdObject>
}

/**
 * The inner recursive function for skolemizing an expanded JSON-LD document.
 *
 * @param {Array<InnerExpanded>} expanded An expanded JSON-LD document, or elements thereof.
 * @param {object} options Options for skolemizing the expanded JSON-LD document.
 *
 * @returns {Array<InnerExpanded>} The expanded form of the skolemized JSON-LD document, or elements thereof.
 */
function skolemizeExpandedRecursive(
  expanded: Array<JsonValue>,
  options: {
    urnScheme: URNScheme
    randomString: string
    count: number
  },
): Array<JsonValue> {
  // Procedure:
  //
  // 1. Initialize `skolemizedExpandedDocument` to an empty array.
  // 2. For each `element` in `expanded`, do:
  //
  //    2.1. If either `element` is not an object, or it contains the key `@value`, append a copy of `element` to
  //         `skolemizedExpandedDocument` and continue to the next `element`.
  //    2.2. Otherwise, initialize `skolemizedNode` to an object, and for each `property` and `value` in `element`, do:
  //
  //         2.2.1. If `value` is an array, set the value of `property` in `skolemizedNode` to the result of calling
  //                this algorithm recursively passing `value` for `expanded` and keeping the other parameters the same.
  //         2.2.2. Otherwise, set the value of `property` in `skolemizedNode` to the first element in the array result
  //                of calling this algorithm recursively passing an array with `value` as its only element for expanded
  //                and keeping the other parameters the same.
  //
  //    2.3. If `skolemizedNode` has no `@id` property, set the value of the `@id` property in `skolemizedNode` to the
  //         concatenation of "urn:", `urnScheme`, "_", randomString, "_", and the value of `count`, incrementing the
  //         value of `count` afterwards.
  //    2.4. Otherwise, if the value of the `@id` property in `skolemizedNode` starts with "_:", preserve the existing
  //         blank node identifier when skolemizing by setting the value of the `@id` property in `skolemizedNode` to
  //         the concatenation of "urn:", `urnScheme`, and the blank node identifier (i.e., the existing value of the
  //         `@id` property minus the "_:" prefix; e.g., if the existing value of the `@id` property is `_:b0`, the
  //         blank node identifier is `b0`).
  //    2.5. Append `skolemizedNode` to `skolemizedExpandedDocument`.
  //
  // 3. Return `skolemizedExpandedDocument`.

  const skolemizedExpandedDocument: Array<JsonValue> = []
  for (const element of expanded) {
    if (element === null) continue
    if (typeof element !== "object" || ("@value" in element && Object.hasOwn(element, "@value"))) {
      skolemizedExpandedDocument.push(structuredClone(element))
      continue
    }
    const skolemizedNode: JsonObject = {}
    for (const [property, value] of Object.entries(element)) {
      skolemizedNode[property] = Array.isArray(value)
        ? skolemizeExpandedRecursive(value, options)
        : skolemizeExpandedRecursive([value as JsonValue], options)[0]
    }
    if (!skolemizedNode["@id"]) {
      skolemizedNode["@id"] = `urn:${options.urnScheme}:_${options.randomString}_${options.count++}`
    } else {
      if (typeof skolemizedNode["@id"] !== "string") {
        throw new BasicError(
          BasicErrorCode.DOCUMENT_CONTENT_ERROR,
          "disclose/skolemize#skolemizeExpandedJsonLd",
          "The value of the `@id` property in `skolemizedNode` MUST NOT be an array.",
        )
      }
      if (skolemizedNode["@id"].startsWith("_:")) {
        skolemizedNode["@id"] = `urn:${options.urnScheme}:${skolemizedNode["@id"].slice(2)}`
      }
    }
    skolemizedExpandedDocument.push(skolemizedNode)
  }
  return skolemizedExpandedDocument
}

/**
 * Replace all blank node identifiers in a compact JSON-LD document with custom-scheme URNs.
 *
 * Note that the skolemization used in this operation is intended to be reversible through the use of the
 * `toDeskolemizedNQuads` function which uses the same custom URN scheme.
 *
 * @param {JsonLdObject} document A compact JSON-LD document.
 * @param {URNScheme} [urnScheme] A custom URN scheme which defaults to "custom-scheme:".
 * @param {string} [randomString] A UUID string or other comparably random string.
 * @param {JsonLdOptions.Expand & JsonLdOptions.Compact} [options] Any additional custom options.
 *
 * Note that the `document` is assumed to use only one `@context` property at the top level of the document.
 *
 * @returns {object} An expanded form of the skolemized JSON-LD document, and a compact form of the skolemized
 * JSON-LD document.
 *
 * @see https://www.w3.org/TR/vc-di-ecdsa/#skolemizecompactjsonld
 */
export async function skolemizeCompactJsonLd(
  document: JsonLdObject,
  urnScheme?: URNScheme,
  randomString?: string,
  options?: JsonLdOptions.Expand & JsonLdOptions.Compact,
): Promise<{
  expanded: JsonLdDocument
  compact: JsonLdDocument
}> {
  // Procedure:
  //
  // 1. Initialize `expanded` to the result of the JSON-LD Expansion algorithm, passing `document` and `options` as
  //    arguments.
  // 2. Initialize `skolemizedExpandedDocument` to the result of the `skolemizeExpandedJsonLd` function.
  // 3. Initialize `skolemizedCompactDocument` to the result of the JSON-LD Compaction algorithm, passing
  //    `skolemizedExpandedDocument` and `options` as arguments.
  // 4. Return an object with both `skolemizedExpandedDocument` and `skolemizedCompactDocument`.

  const context = document["@context"]
  if (!context) {
    throw new BasicError(
      BasicErrorCode.DOCUMENT_CONTENT_ERROR,
      "disclose/skolemize#skolemizeCompactJsonLd",
      "The document MUST use only one `@context` property at the top level.",
    )
  }

  const expanded = await jsonld.expand(document, options)
  const skolemizedExpandedDocument = skolemizeExpandedJsonLd(expanded, urnScheme, randomString)
  const skolemizedCompactDocument = await jsonld.compact(skolemizedExpandedDocument, context, options)

  return {
    expanded: skolemizedExpandedDocument,
    compact: skolemizedCompactDocument,
  }
}
