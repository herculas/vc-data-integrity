import { BasicError, BasicErrorCode } from "../error/basic.ts"
import { ProcessingError, ProcessingErrorCode } from "../error/process.ts"

import type { JsonLdDocument, JsonLdObject } from "../types/serialize/document.ts"

/**
 * Convert a JSON Pointer to an array of paths into a JSON tree.
 *
 * @param {string} pointer A JSON Pointer string.
 *
 * @returns {Array<string | number>} An array of paths.
 *
 * @see https://www.w3.org/TR/vc-di-ecdsa/#jsonpointertopaths
 */
export function jsonPointerToPaths(pointer: string): Array<string | number> {
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

  const paths: Array<string | number> = []
  const splitPath = pointer.split("/").slice(1)

  for (const path of splitPath) {
    if (!path.includes("~")) {
      paths.push(isNaN(parseInt(path)) ? path : parseInt(path))
    } else {
      paths.push(
        path.replace(/~[01]/g, (match) => {
          if (match === "~1") return "/"
          if (match === "~0") return "~"
          throw new BasicError(
            BasicErrorCode.DOCUMENT_CONTENT_ERROR,
            "disclose/select#jsonPointerToPaths",
            `Invalid JSON Pointer escape sequence: ${match}`,
          )
        }),
      )
    }
  }
  return paths
}

/**
 * Create an initial selection (a fragment of a JSON-LD document) based on a JSON-LD object. This is a helper function
 * used within the `selectJsonLd` function.
 *
 * @param {JsonLdObject} source A JSON-LD object.
 *
 * @returns {Record<string, unknown>} A JSON-LD document fragment object.
 *
 * @see https://www.w3.org/TR/vc-di-ecdsa/#createinitialselection
 */
function createInitialSelection(source: JsonLdObject): Record<string, unknown> {
  // Procedure:
  //
  // 1. Initialize `selection` to an empty object.
  // 2. If `source` has an `id` that is not a blank node identifier, set `selection.id` to its value. Note: All
  //    non-blank node identifiers in the path of any JSON Pointer MUST be included in the selection, this includes any
  //    root document identifier.
  // 3. If `source.type` is set, set `selection.type` to its value. Note: The selection MUST include all `type`s in the
  //    path of any JSON Pointer, including any root document `type`.
  // 4. Return `selection`.

  const selection: Record<string, unknown> = {}
  if ("id" in source && source.id !== undefined) {
    if (typeof source.id === "string" && !source.id.startsWith("_:")) {
      selection.id = source.id
    }
  }

  if ("type" in source) {
    selection.type = source.type
  }

  return selection
}

/**
 * Selects a portion of a compact JSON-LD document using paths parsed from a parsed JSON Pointer. This is a helper
 * function used within the `selectJsonLd` function.
 *
 * @param {Array<string>} paths An array of paths parsed from a JSON Pointer.
 * @param {JsonLdObject} document A compact JSON-LD document.
 * @param {Record<string, unknown>} selectionDocument A selection document to be populated.
 * @param {Array} arrays An array of arrays for tracking selected arrays.
 *
 * This algorithm produces no output; instead, it populates the given `selectionDocument` with any values selected via
 * `paths`.
 *
 * @see https://www.w3.org/TR/vc-di-ecdsa/#selectpaths
 */
function selectPaths(
  paths: Array<string>,
  document: JsonLdObject,
  selectionDocument: Record<string, unknown>,
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

  let parentValue: string | number | boolean | object = document
  let value: string | number | boolean | object = parentValue
  let selectedParent = selectionDocument
  let selectedValue = selectedParent

  for (const path of paths) {
    selectedParent = selectedValue
    parentValue = value

    if ((path in parentValue) || Object.hasOwn(parentValue, path)) {
      value = parentValue[path]
    } else {
      throw new ProcessingError(
        ProcessingErrorCode.PROOF_GENERATION_ERROR,
        "disclose/select#selectPaths",
        `JSON Pointer does not match the given document: ${path}`,
      )
    }

    selectedValue = selectedParent[path]
    if (selectedValue === undefined) {
      if (Array.isArray(value)) {
        selectedValue = []
        arrays.push(selectedValue)
      } else {
        selectedValue = createInitialSelection(value)
      }
      selectedParent[path] = selectedValue
    }
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    selectedValue = value
  } else if (Array.isArray(value)) {
    selectedValue = structuredClone(value)
  } else {
    selectedValue = { ...selectedValue, ...structuredClone(value) }
  }

  const lastPath = paths[paths.length - 1]
  selectedParent[lastPath] = selectedValue
}

/**
 * Select a portion of a compact JSON-LD document using an array of JSON Pointers.
 *
 * @param {Array<string>} pointers An array of JSON Pointers.
 * @param {JsonLdObject} document A compact JSON-LD document which is
 *
 * Note that the `document` is assumed to use a JSON-LD context that aliases `@id` and `@type` to `id` and `type`,
 * respectively, and to use only one `@context` property at the top level of the document.
 *
 * @returns {Record<string, unknown> | null} A new JSON-LD document that represents a selection of the original JSON-LD
 * document.
 *
 * @see https://www.w3.org/TR/vc-di-ecdsa/#selectjsonld
 */
export function selectJsonLd(pointers: Array<string>, document: JsonLdObject): Record<string, unknown> | null {
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

  if (pointers.length === 0) return null
  const arrays = []
  const selectionDocument = createInitialSelection(document)

  return selectionDocument
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
