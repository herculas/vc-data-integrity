import { labelReplacementCanonicalizeNQuads } from "./canonize.ts"
import { selectCanonicalNQuads } from "./select.ts"
import { skolemizeCompactJsonLd, toDeskolemizedNQuads } from "./skolemize.ts"

import type { Canonize, Compact, Expand, ToRdf } from "../types/options/serialize.ts"
import type { JsonLdDocument, JsonLdObject } from "../types/serialize/document.ts"
import type { LabelMap, LabelMapFactory } from "../types/api/disclose.ts"
import type { NQuad } from "../types/serialize/rdf.ts"
import type { URNScheme } from "../types/serialize/base.ts"

/**
 * Output canonical N-Quad strings that match custom selections of a compact JSON-LD document. It does this by
 * canonicalizing a compact JSON-LD document (replacing any blank node identifier using a label map), and grouping the
 * resulting canonical N-Quad strings according to the selection associated with each group. Each group will be defined
 * using an assigned name and array of JSON Pointers. The JSON pointers will be used to select portions of the
 * skolemized document, such that the output can be converted to canonical N-Quads to perform group matching.
 *
 * @param {JsonLdObject} document A compact JSON-LD document.
 * @param {LabelMapFactory} labelMapFactoryFunction A label map factory function.
 * @param {Map<string, Array<string>>} groupDefinitions A map of named group definitions.
 * @param {object} [options] Any additional custom options, such as a document loader.
 *
 * Note that the `document` is assumed to use a JSON-LD context that aliases `@id` and `@type` to `id` and `type`,
 * respectively, and to use only one `@context` property at the top level of the document.
 *
 * @returns {object} An object containing the created groups (`groups`), the skolemized compact JSON-LDd document
 * (`skolemizedCompactDocument`), the skolemized expanded JSON-LD document (`skolemizedExpandedDocument`), the
 * deskolemized N-Quad strings (`deskolemizedNQuads`), the blank node label map (`labelMap`), and the canonical N-Quad
 * strings (`nQuads`).
 *
 * @see https://www.w3.org/TR/vc-di-ecdsa/#canonicalizeandgroup
 */
export async function canonicalizeAndGroup(
  document: JsonLdObject,
  labelMapFactoryFunction: LabelMapFactory,
  groupDefinitions: Map<string, Array<string>>,
  options?:
    & {
      urnScheme?: URNScheme
      randomString?: string
    }
    & Expand
    & Compact
    & ToRdf
    & Partial<Canonize>,
): Promise<{
  groups: Map<string, {
    matching: Map<number, NQuad>
    nonMatching: Map<number, NQuad>
    deskolemizedNQuads: Array<NQuad>
  }>
  skolemizedExpandedDocument: JsonLdDocument
  skolemizedCompactDocument: JsonLdDocument
  deskolemizedNQuads: Array<NQuad>
  labelMap: LabelMap
  nQuads: Array<NQuad>
}> {
  // Procedure:
  //
  // 1. Initialize `skolemizedExpandedDocument` and `skolemizedCompactDocument` to their associated values in the result
  //    of the `skolemizeCompactJsonLd` function, passing `document` and `options` as parameters.
  // 2. Initialize `deskolemizedNQuads` to the result of the `toDeskolemizedNQuads` function, passing
  //    `skolemizedExpandedDocument` and `options` as parameters.
  // 3. Initialize `nQuads` and `labelMap` to their associated values in the result of the
  //    `labelReplacementCanonicalizeNQuads` function, passing `labelMapFactoryFunction`, `deskolemizedNQuads` as
  //    `nQuads`, and `options` as parameters.
  // 4. Initialize `selections` to a new map.
  // 5. For each key (`name`) and value (`pointers`) entry in `groupDefinitions`:
  //
  //    5.1. Add an entry with a key of `name` and a value that is the result of the `selectCanonicalNQuads` function,
  //         passing `pointers`, `labelMap`, `skolemizedCompactDocument` as `document`, and `options` as parameters.
  //
  // 6. Initialize `groups` to an empty object.
  // 7. For each key (`name`) and value (`selectionResult`) entry in `selections`:
  //
  //    7.1. Initialize `matching` to an empty map.
  //    7.2. Initialize `nonMatching` to an empty map.
  //    7.3. Initialize `selectedNQuads` to `nQuads` from `selectionResult`.
  //    7.4. Initialize `selectedDeskolemizedNQuads` from `deskolemizedNQuads` from `selectionResult`.
  //    7.5. For each element (`nq`) and index (`index`) in `nQuads`:
  //
  //         7.5.1. Create a map entry, `entry`, with a key of `index` and a value of `nq`.
  //         7.5.2. If `selectedNQuads` includes `nq` then add `entry` to `matching`; otherwise, add `entry` to
  //                `nonMatching`.
  //
  //    7.6. Set `name` in `groups` to an object containing `matching`, `nonMatching`, and `selectedDeskolemizedNQuads`
  //         as `deskolemizedNQuads`.
  //
  // 8. Return an object containing `groups`, `skolemizedExpandedDocument`, `skolemizedCompactDocument`,
  //    `deskolemizedNQuads`, `labelMap`, and `nQuads`.

  const skolemized = await skolemizeCompactJsonLd(document, options?.urnScheme, options?.randomString, options)
  const skolemizedExpandedDocument = skolemized.expanded
  const skolemizedCompactDocument = skolemized.compact

  const deskolemizedNQuads = await toDeskolemizedNQuads(skolemizedExpandedDocument, options?.urnScheme, options)

  const labeled = await labelReplacementCanonicalizeNQuads(deskolemizedNQuads, labelMapFactoryFunction, options)
  const nQuads = labeled.canonicalNQuads
  const labelMap = labeled.labelMap

  const selections = new Map<string, {
    selectionDocument: JsonLdDocument
    deskolemizedNQuads: Array<NQuad>
    nQuads: Array<NQuad>
  }>()

  await Promise.all([...groupDefinitions].map(async ([name, pointers]) => {
    selections.set(
      name,
      await selectCanonicalNQuads(
        pointers,
        skolemizedCompactDocument,
        labelMap,
        options?.urnScheme,
        options,
      ),
    )
  }))

  const groups = new Map<string, {
    matching: Map<number, NQuad>
    nonMatching: Map<number, NQuad>
    deskolemizedNQuads: Array<NQuad>
  }>()
  for (const [name, selectionResult] of selections) {
    const matching = new Map<number, NQuad>()
    const nonMatching = new Map<number, NQuad>()

    const selectedNQuads = selectionResult.nQuads
    const selectedDeskolemizedNQuads = selectionResult.deskolemizedNQuads

    nQuads.forEach((nq, index) => selectedNQuads.includes(nq) ? matching.set(index, nq) : nonMatching.set(index, nq))
    groups.set(name, { matching, nonMatching, deskolemizedNQuads: selectedDeskolemizedNQuads })
  }

  return {
    groups,
    skolemizedExpandedDocument,
    skolemizedCompactDocument,
    deskolemizedNQuads,
    labelMap,
    nQuads,
  }
}
