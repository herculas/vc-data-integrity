import type { JsonLdDocument, JsonLdObject } from "../types/jsonld/document.ts"

/**
 * Canonicalize an array of N-Quad strings and replace any blank node identifiers in the canonicalized result using
 * a label map factory function.
 *
 * @param {string} nQuads An array of N-Quad strings.
 * @param {Function} labelMapFactoryFunction A label map factory function.
 * @param {object} [options] Custom options.
 *
 * @returns {object} An N-Quads representation of the `canonicalNQuads` as an array of N-Quad strings, with the replaced
 * blank node labels, and a map from the old blank node identifiers to the new blank node identifiers `labelMap`.
 *
 * @see https://www.w3.org/TR/vc-di-ecdsa/#labelreplacementcanonicalizenquads
 */
function labelReplacementCanonicalizeNQuads(
  nQuads: string,
  labelMapFactoryFunction: Function,
  options?: object,
) {
  // Procedure:
  //
  // 1. Run the RDF Dataset Canonicalization Algorithm on the joined `nQuads`, passing any custom options, and as
  //    output, get the canonicalized dataset, which includes a canonical bnode identifier map, `canonicalIdMap`.
  // 2. Pass `canonicalIdMap` to `labelMapFactoryFunction` to produce a new bnode identifier map, `labelMap`.
  // 3. Use the canonicalized dataset and `labelMap` to produce the canonical N-Quads representation as an array of
  //    N-Quad strings, `canonicalNQuads`.
  // 4. Return an object containing `labelMap` and `canonicalNQuads`.
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
  labelMapFactoryFunction: Function,
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
export function createLabelMapFunction(labelMap: object) {
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
export function createHmacIdLabelMapFunction(hmac: Function) {
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
 * Replace all blank node identifiers in an array of N-Quad strings with custom scheme URNs.
 *
 * Note that this operation is intended to be reversible through the use of the `deskolemizeNQuads` function.
 *
 * @param {Array<string>} inputNQuads An array of N-Quad strings.
 * @param {string} urnScheme A URN scheme.
 *
 * @returns {Array<string>} An array of N-Quad strings with blank node identifiers replaced with URNs.
 *
 * @see https://www.w3.org/TR/vc-di-ecdsa/#skolemizenquads
 */
function skolemizeNQuads(inputNQuads: Array<string>, urnScheme: string) {
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
}

/**
 * Replace all custom scheme URNs in an array of N-Quad strings with a blank node identifier.
 *
 * Note that this operation is intended to be reversible through the use of the `skolemizeNQuads` function.
 *
 * @param {Array<string>} inputNQuads An array of N-Quad strings.
 * @param {string} urnScheme A URN scheme.
 *
 * @returns {Array<string>} An array of N-Quad strings with URNs replaced with blank node identifiers.
 *
 * @see https://www.w3.org/TR/vc-di-ecdsa/#deskolemizenquads
 */
function deskolemizeNQuads(inputNQuads: Array<string>, urnScheme: string) {
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
}

/**
 * Replace all blank node identifiers in an expanded JSON-LD document with custom-scheme URNs, including assigning such
 * URNs to blank nodes that are unlabeled.
 *
 * Note that the skolemization used in this operation is intended to be reversible through the use of the
 * `toDeskolemizedNQuads` function.
 *
 * @param {JsonLdDocument} expanded An expanded JSON-LD document.
 * @param {string} urnScheme A custom URN scheme.
 * @param {string} randomString A UUID string or other comparably random string.
 * @param {number} count A reference to a shared integer.
 * @param {object} [options] Any additional custom options, such as a document loader.
 *
 * @returns {JsonLdDocument} The expanded form of the skolemized JSON-LD document.
 *
 * @see https://www.w3.org/TR/vc-di-ecdsa/#skolemizeexpandedjsonld
 */
function skolemizeExpandedJsonLd(
  expanded: JsonLdDocument,
  urnScheme: string,
  randomString: string,
  count: number,
  options?: object,
) {
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
}

/**
 * Replace all blank node identifiers in a compact JSON-LD document with custom-scheme URNs.
 *
 * Note that the skolemization used in this operation is intended to be reversible through the use of the
 * `toDeskolemizedNQuads` function which uses the same custom URN scheme.
 *
 * @param {JsonLdDocument} document A compact JSON-LD document.
 * @param {string} [urnScheme] A custom URN scheme which defaults to "custom-scheme:".
 * @param {object} [options] Any additional custom options, such as a document loader.
 *
 * Note that the `document` is assumed to use only one `@context` property at the top level of the document.
 *
 * @returns {object} An expanded form of the skolemized JSON-LD document, and a compact form of the skolemized
 * JSON-LD document.
 *
 * @see https://www.w3.org/TR/vc-di-ecdsa/#skolemizecompactjsonld
 */
function skolemizeCompactJsonLd(
  document: JsonLdDocument,
  urnScheme: string = "custom-scheme:",
  options?: object,
) {
  // Procedure:
  //
  // 1. Initialize `expanded` to the result of the JSON-LD Expansion algorithm, passing `document` and `options` as
  //    arguments.
  // 2. Initialize `skolemizedExpandedDocument` to the result of the `skolemizeExpandedJsonLd` function.
  // 3. Initialize `skolemizedCompactDocument` to the result of the JSON-LD Compaction algorithm, passing
  //    `skolemizedExpandedDocument` and `options` as arguments.
  // 4. Return an object with both `skolemizedExpandedDocument` and `skolemizedCompactDocument`.
}

/**
 * Convert a skolemized JSON-LD document, such as one created using the algorithm in `skolemizeCompactJsonLd`, to an
 * array of deskolemized N-Quads.
 *
 * @param {JsonLdDocument} skolemizedDocument A JSON-LD document.
 * @param {object} [options] Any additional custom options, such as a document loader.
 *
 * @returns {Array<string>} An array of deskolemized N-Quad strings.
 *
 * @see https://www.w3.org/TR/vc-di-ecdsa/#todeskolemizednquads
 */
function toDeskolemizedNQuads(skolemizedDocument: JsonLdDocument, options?: object) {
  // Procedure:
  //
  // 1. Initialize `skolemizedDataset` to the result of the Deserialize JSON-LD to RDF algorithm, passing `options`, to
  //    convert `skolemizedDocument` from JSON-LD to RDF in N-Quads format.
  // 2. Split `skolemizedDataset` into an array of individual N-Quad strings, `skolemizedNQuads`.
  // 3. Set `deskolemizedNQuads` to the result of calling the `deskolemizeNQuads` function, passing `skolemizedNQuads`
  //    and "custom-scheme:" as parameters. Implementations MAY choose a different `urnScheme` that is different than
  //    the default "custom-scheme:" so long as the same scheme name was used to generate the `skolemizedDocument`.
  // 4. Return `deskolemizedNQuads`.
}

/**
 * Convert a JSON Pointer to an array of paths into a JSON tree.
 *
 * @param {string} pointer A JSON Pointer string.
 *
 * @returns {Array<string>} An array of paths.
 *
 * @see https://www.w3.org/TR/vc-di-ecdsa/#jsonpointertopaths
 */
function jsonPointerToPaths(pointer: string) {
  // Procedure:
  //
  // 1. Initialize `paths` to an empty array.
  // 2. Initialize `splitPath` to an array by splitting `pointer` on the "/" character and skipping the first, empty,
  //    split element. In JavaScript notation, this step is equivalent to the following code:
  //    `pointer.split('/').slice(1)`.
  // 3. For each `path` in `splitPath`, do:
  //
  //    3.1. If `path` does not include `~`, then add `path` to `paths`, converting it to an integer if it parses as
  //         one, leaving it as a string if it does not.
  //    3.2. Otherwise, unescape any JSON pointer escape sequences in `path` and add the result to `paths`.
  //
  // 4. Return `paths`.
}

/**
 * Create an initial selection (a fragment of a JSON-LD document) based on a JSON-LD object. This is a helper function
 * used within the `selectJsonLd` function.
 *
 * @param {JsonLdObject} source A JSON-LD object.
 *
 * @returns {JsonLdObject} A JSON-LD document fragment object.
 *
 * @see https://www.w3.org/TR/vc-di-ecdsa/#createinitialselection
 */
function createInitialSelection(source: JsonLdObject) {
  // Procedure:
  //
  // 1. Initialize `selection` to an empty object.
  // 2. If `source` has an `id` that is not a blank node identifier, set `selection.id` to its value. Note: All
  //    non-blank node identifiers in the path of any JSON Pointer MUST be included in the selection, this includes any
  //    root document identifier.
  // 3. If `source.type` is set, set `selection.type` to its value. Note: The selection MUST include all `type`s in the
  //    path of any JSON Pointer, including any root document `type`.
  // 4. Return `selection`.
}

/**
 * Selects a portion of a compact JSON-LD document using paths parsed from a parsed JSON Pointer. This is a helper
 * function used within the `selectJsonLd` function.
 *
 * @param {Array<string>} paths An array of paths parsed from a JSON Pointer.
 * @param {JsonLdDocument} document A compact JSON-LD document.
 * @param {JsonLdDocument} selectionDocument A selection document to be populated.
 * @param {Array} arrays An array of arrays for tracking selected arrays.
 *
 * This algorithm produces no output; instead, it populates the given `selectionDocument` with any values selected via
 * `paths`.
 *
 * @see https://www.w3.org/TR/vc-di-ecdsa/#selectpaths
 */
function selectPaths(
  paths: Array<string>,
  document: JsonLdDocument,
  selectionDocument: JsonLdDocument,
  arrays: Array<Array<number>>,
) {
  // Procedure:
  //
  // 1. Initialize `parentValue` to `document`.
  // 2. Initialize `value` to `parentValue`.
  // 3. Initialize `selectedParent` to `selectionDocument`.
  // 4. Initialize `selectedValue` to `selectedParent`.
  // 5. For each `path` in `paths`, do:
  //
  //    5.1. Set `selectedParent` to `selectedValue`.
  //    5.2. Set `parentValue` to `value`.
  //    5.3. Set `value` to `parentValue.path`. If `value` is now undefined, an error MUST be raised and SHOULD convey
  //         an error type of `PROOF_GENERATION_ERROR`, indicating that the JSON Pointer does not match the given
  //         `document`.
  //    5.4. Set `selectedValue` to `selectedParent.path`.
  //    5.5. If `selectedValue` is now undefined:
  //
  //         5.5.1. If `value` is an array, set `selectedValue` to an empty array and append `selectedValue` to
  //                `arrays`.
  //         5.5.2. Otherwise, set `selectedValue` to an initial selection passing `value` as `source` to the
  //                `createInitialSelection` function.
  //         5.5.3. Set `selectedParent.path` to `selectedValue`.
  //
  // 6. Note: With path traversal complete at the target value, the selected value will now be computed.
  // 7. If `value` is a literal, set `selectedValue` to `value`.
  // 8. If `value` is an array, set `selectedValue` to a copy of `value`.
  // 9. In all other cases, set `selectedValue` to an object that merges a shallow copy of `selectedValue` with a deep
  //    copy of `value`, e.g., `{...selectedValue, ...deepCopy(value)}`.
  // 10. Get the last `path`, `lastPath`, from `paths`.
  // 11. Set `selectedParent.lastPath` to `selectedValue`.
}

/**
 * Select a portion of a compact JSON-LD document using an array of JSON Pointers.
 *
 * @param {Array<string>} pointers An array of JSON Pointers.
 * @param {JsonLdDocument} document A compact JSON-LD document which is
 *
 * Note that the `document` is assumed to use a JSON-LD context that aliases `@id` and `@type` to `id` and `type`,
 * respectively, and to use only one `@context` property at the top level of the document.
 *
 * @returns {JsonLdDocument} A new JSON-LD document that represents a selection of the original JSON-LD document.
 *
 * @see https://www.w3.org/TR/vc-di-ecdsa/#selectjsonld
 */
export function selectJsonLd(pointers: Array<string>, document: JsonLdDocument) {
  // Procedure:
  //
  // 1. If `pointers` is empty, return `null`. This indicates nothing has been selected from the original document.
  // 2. Initialize `arrays` to an empty array. This variable will be used to track selected sparse arrays to make them
  //    dense after all `pointers` have been processed.
  // 3. Initialize `selectionDocument` to an initial selection passing `document` as `source` to the
  //    `createInitialSelection` function.
  // 4. Set the value of the `@context` property in `selectionDocument` to a copy of the value of the `@context`
  //    property in `document`.
  // 5. For each `pointer` in `pointers`, walk the document from root to the pointer target value, building the
  //    `selectionDocument` along the way:
  //
  //    5.1. Parse `pointer` into an array of paths, `paths`, using the `jsonPointerToPaths` function.
  //    5.2. Call the `selectPaths` function, passing `paths`, `document`, `selectionDocument`, and `arrays` as
  //         parameters.
  //
  // 6. For each `array` in `arrays`, do:
  //
  //    6.1. Make `array` dense by removing any undefined elements between elements that are defined.
  //
  // 7. Return `selectionDocument`.
}

/**
 * Relabel the blank node identifiers in an array of N-Quad strings using a blank node label map.
 *
 * @param {Array<string>} nQuads An array of N-Quad strings.
 * @param {object} labelMap A blank node label map.
 *
 * @returns {Array<string>} An array of N-Quad strings with the blank node identifiers re-labeled.
 *
 * @see https://www.w3.org/TR/vc-di-ecdsa/#relabelblanknodes
 */
function relabelBlankNodes(nQuads: Array<string>, labelMap: object) {
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
}

/**
 * Select a portion of a skolemized compact JSON-LD document using an array of JSON Pointers, and outputs the resulting
 * canonical N-Quads with any blank node labels replaced using the given label map.
 *
 * @param {Array<string>} pointers An array of JSON Pointers.
 * @param {JsonLdDocument} skolemizedCompactDocument A skolemized compact JSON-LD document.
 * @param {object} labelMap A blank node label map.
 * @param {object} [options] Any additional custom options, such as a document loader.
 *
 * Note that the `document` is assumed to use a JSON-LD context that aliases `@id` and `@type` to `id` and `type`,
 * respectively, and to use only one `@context` property at the top level of the document.
 *
 * @returns {object} An object containing the new JSON-LD document that represents a selection of the original JSON-LD
 * document (`selectionDocument`), an array of deskolemized N-Quad strings (`deskolemizedNQuads`), and an array of
 * canonical N-Quads with replacement blank node labels (`nQuads`).
 *
 * @see https://www.w3.org/TR/vc-di-ecdsa/#selectcanonicalnquads
 */
function selectCanonicalNQuads(
  pointers: Array<string>,
  skolemizedCompactDocument: JsonLdDocument,
  labelMap: object,
  options?: object,
) {
  // Procedure:
  //
  // 1. Initialize `selectionDocument` to the result of the `selectJsonLd` function, passing `pointers` and
  //    `skolemizedCompactDocument` as parameters.
  // 2. Initialize `deskolemizedNQuads` to the result of the `toDeskolemizedNQuads` function, passing
  //    `selectionDocument` as `skolemizedCompactDocument`, and `options` as parameters.
  // 3. Initialize `nQuads` to the result of the `relabelBlankNodes` function, passing `deskolemizedNQuads` as `nQuads`,
  //    and `labelMap` as parameters.
  // 4. Return an object containing `selectionDocument`, `deskolemizedNQuads`, and `nQuads`.
}

/**
 * Output canonical N-Quad strings that match custom selections of a compact JSON-LD document. It does this by
 * canonicalizing a compact JSON-LD document (replacing any blank node identifier using a label map), and grouping the
 * resulting canonical N-Quad strings according to the selection associated with each group. Each group will be defined
 * using an assigned name and array of JSON Pointers. The JSON pointers will be used to select portions of the
 * skolemized document, such that the output can be converted to canonical N-Quads to perform group matching.
 *
 * @param {JsonLdDocument} document A compact JSON-LD document.
 * @param {Function} labelMapFactoryFunction A label map factory function.
 * @param {object} groupDefinitions A map of named group definitions.
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
export function canonicalizeAndGroup(
  document: JsonLdDocument,
  labelMapFactoryFunction: Function,
  groupDefinitions: object,
  options?: object,
) {
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
}

/**
 * Cryptographically hash an array of mandatory to disclose N-Quads using a provided hashing API.
 *
 * @param {Array<string>} mandatory An array of mandatory to disclose N-Quads.
 * @param {Function} hasher A hashing function.
 *
 * @returns {string} A cryptographic hash.
 *
 * @see https://www.w3.org/TR/vc-di-ecdsa/#hashmandatorynquads
 */
export function hashMandatoryNQuads(mandatory: Array<string>, hasher: Function) {
  // Procedure:
  //
  // 1. Initialize `bytes` to the UTF-8 representation of the joined `mandatory` N-Quads.
  // 2. Initialize `mandatoryHash` to the result of using `hasher` to hash `bytes`.
  // 3. Return `mandatoryHash`.
}
