import * as jsonld from "../serialize/jsonld.ts"
import * as rdf from "../serialize/rdf.ts"

import type { JsonLdDocument } from "../types/jsonld/document.ts"

import type * as JsonLdOptions from "../types/api/jsonld.ts"
import type * as RdfOptions from "../types/api/rdf.ts"

export type LabelMapFactory = (canonicalIdMap: Map<string, string>) => Promise<Map<string, string>>

/**
 * Canonicalize an array of N-Quad strings and replace any blank node identifiers in the canonicalized result using
 * a label map factory function.
 *
 * @param {Array<string>} nQuads An array of N-Quad strings.
 * @param {LabelMapFactory} labelMapFactoryFunction A label map factory function.
 * @param {object} [options] Custom options.
 *
 * @returns {Promise<object>} Resolve to an N-Quads representation of the `canonicalNQuads` as an array of N-Quad
 * strings, with the replaced blank node labels, and a map from the old blank node identifiers to the new blank node
 * identifiers `labelMap`.
 *
 * @see https://www.w3.org/TR/vc-di-ecdsa/#labelreplacementcanonicalizenquads
 */
export async function labelReplacementCanonicalizeNQuads(
  nQuads: Array<string>,
  labelMapFactoryFunction: LabelMapFactory,
  options?: object,
): Promise<{
  labelMap: Map<string, string>
  canonicalNQuads: Array<string>
}> {
  // Procedure:
  //
  // 1. Run the RDF Dataset Canonicalization Algorithm on the joined `nQuads`, passing any custom options, and as
  //    output, get the canonicalized dataset, which includes a canonical bnode identifier map, `canonicalIdMap`.
  // 2. Pass `canonicalIdMap` to `labelMapFactoryFunction` to produce a new bnode identifier map, `labelMap`.
  // 3. Use the canonicalized dataset and `labelMap` to produce the canonical N-Quads representation as an array of
  //    N-Quad strings, `canonicalNQuads`.
  // 4. Return an object containing `labelMap` and `canonicalNQuads`.

  // 1: canonicalize the N-Quads
  let canonicalIdMap = new Map<string, string>()
  const output = await _canonize(nQuads.join(""), {
    inputFormat: "application/n-quads",
    canonicalIdMap,
    ...options,
  })

  // 2: create the label map
  canonicalIdMap = _trimBlankPrefixes(canonicalIdMap)
  const labelMap = await labelMapFactoryFunction(canonicalIdMap)

  // 3: relabel the blank nodes
  const newLabelMap = new Map<string, string>()
  for (const [input, newLabel] of labelMap) {
    newLabelMap.set(canonicalIdMap.get(input)!, newLabel)
  }
  const canonicalNQuads = relabelBlankNodes((output as string).split("\n").slice(0, -1), newLabelMap).sort()

  // 4: return the result
  return {
    labelMap,
    canonicalNQuads,
  }
}

/**
 * Canonicalize a JSON-LD document and replace any blank node identifiers in the canonicalized result using a label map
 * factory function.
 *
 * @param {JsonLdDocument} document A JSON-LD document.
 * @param {Function} labelMapFactoryFunction A label map factory function.
 * @param {object} [options] Custom options.
 *
 * @returns {object} An N-Quads representation of the `canonicalNQuads` as an array of N-Quad strings, with the replaced
 * blank node labels, and a map from the old blank node identifiers to the new blank node identifiers `labelMap`.
 *
 * @see https://www.w3.org/TR/vc-di-ecdsa/#labelreplacementcanonicalizejsonld
 */
export function labelReplacementCanonicalizeJsonLd(
  document: JsonLdDocument,
  labelMapFactoryFunction: LabelMapFactory,
  options?: object,
) {
  // Procedure:
  //
  // 1. Deserialize the JSON-LD document to RDF, `rdf`, using the Deserialize JSON-LD to RDF algorithm, passing any
  //    custom options, such as a document loader.
  // 2. Serialize `rdf` to an array of N-Quad strings, `nQuads`.
  // 3. Return the result of calling the `labelReplacementCanonicalizeNQuads` function, passing `nQuads`,
  //    `labelMapFactoryFunction`, and `options` as arguments.
}

/**
 * Create a label map factory function that uses an input label map to replace canonical blank node identifiers with
 * another value.
 *
 * @param {object} labelMap A label map.
 *
 * @returns {Function} A label map factory function.
 *
 * @see https://www.w3.org/TR/vc-di-ecdsa/#createlabelmapfunction
 */
export function createLabelMapFunction(labelMap: Map<string, string>): LabelMapFactory {
  // Procedure:
  //
  // 1. Create a function, `labelMapFactoryFunction`, with one required input (a canonical node identifier map,
  //    `canonicalIdMap`), that will return a blank node identifier map, `bnodeIdMap`, as output. Set the function's
  //    implementation as follows:
  //
  //    1.1. Generate a new empty bnode identifier map, `bnodeIdMap`.
  //    1.2. For each map entry `entry` in `canonicalIdMap`, do:
  //
  //         1.2.1. Use the canonical identifier from the value in `entry` as a key in `labelMap` to get the new label
  //                `newLabel`.
  //         1.2.2. Add a new entry `newEntry` to `bnodeIdMap` using the key from `entry` and `newLabel` as the value.
  //
  //    1.3. Return `bnodeIdMap`.
  //
  // 2. Return `labelMapFactoryFunction`.

  return (canonicalIdMap: Map<string, string>) => {
    const bnodeIdMap = new Map<string, string>()
    for (const [input, newLabel] of canonicalIdMap) {
      bnodeIdMap.set(input, labelMap.get(newLabel)!)
    }
    return Promise.resolve(bnodeIdMap)
  }
}

/**
 * Create a label map factory function that uses an HMAC to replace canonical blank node identifiers with their encoded
 * HMAC digests.
 *
 * Note that a different primitive could be created that returned a label map factory function that would instead sort
 * the resulting HMAC digests and assign labels in the produced label map using a prefix and integers based on their
 * sorted order. This primitive might be useful for selective disclosure schemes, such as BBS, that favor unlinkability
 * over minimizing unrevealed data leakage.
 *
 * @param {Function} hmac An HMAC previously initialized with a secret key.
 *
 * @returns {Function} A label map factory function.
 *
 * @see https://www.w3.org/TR/vc-di-ecdsa/#createhmacidlabelmapfunction
 */
export function createHmacIdLabelMapFunction(hmac: Function): LabelMapFactory {
  // Procedure:
  //
  // 1. Create a function, `labelMapFactoryFunction`, with one required input (a canonical node identifier map,
  //    `canonicalIdMap`), that will return a blank node identifier map, `bnodeIdMap`, as output. Set the function's
  //    implementation as follows:
  //
  //    1.1. Generate a new empty bnode identifier map, `bnodeIdMap`.
  //    1.2. For each map entry `entry` in `canonicalIdMap`, do:
  //
  //         1.2.1. HMAC the canonical identifier from the value in `entry` to get an HMAC digest, `digest`.
  //         1.2.2. Generate a new string value, `b64urlDigest`, and initialize it to "u" followed by appending a
  //                base-64-url-no-pad encoded version of the `digest` value.
  //         1.2.3. Add a new entry `newEntry` to `bnodeIdMap` using the key from `entry` and `b64urlDigest` as the
  //                value.
  //
  //    1.3. Return `bnodeIdMap`.
  //
  // 2. Return `labelMapFactoryFunction`.
}

/**
 * Relabel the blank node identifiers in an array of N-Quad strings using a blank node label map.
 *
 * @param {Array<string>} nQuads An array of N-Quad strings.
 * @param {Map<string, string>} labelMap A blank node label map.
 *
 * @returns {Array<string>} An array of N-Quad strings with the blank node identifiers re-labeled.
 *
 * @see https://www.w3.org/TR/vc-di-ecdsa/#relabelblanknodes
 */
export function relabelBlankNodes(nQuads: Array<string>, labelMap: Map<string, string>): Array<string> {
  // Procedure:
  //
  // 1. Create a new array of N-Quad strings, `relabeledNQuads`.
  // 2. For each N-Quad string, `s1`, in `nQuads`, do:
  //
  //    2.1. Create a new string, `s2`, such that it is a copy of `s1` except each blank node identifier therein has
  //         been replaced with the value associated with it as a key in `labelMap`.
  //    2.2. Append `s2` to `relabeledNQuads`.
  //
  // 3. Return `relabeledNQuads`.

  return nQuads.map((s1) => s1.replace(/(_:([^\s]+))/g, (_m, _s1, label) => `_:${labelMap.get(label)}`))
}

async function _canonize(input: string | JsonLdDocument, options: object) {
  let outerInput: object | string = input
  const outerOptions: RdfOptions.Canonize = {
    algorithm: "RDFC-1.0",
    format: "application/n-quads",
    ...options,
  }

  if (typeof input !== "string") {
    const innerOptions: JsonLdOptions.ToRdf = {
      safe: true,
      rdfDirection: "i18n-datatype",
      produceGeneralizedRdf: false,
      ...outerOptions,
    }
    delete innerOptions.format
    outerInput = await jsonld.toRdf(input, innerOptions)
  }

  return await rdf.canonize(outerInput, outerOptions)
}

function _trimBlankPrefixes(map: Map<string, string>): Map<string, string> {
  const result = new Map<string, string>()
  for (const [key, value] of map) {
    result.set(key.replace(/^_:/, ""), value.replace(/^_:/, ""))
  }
  return result
}
