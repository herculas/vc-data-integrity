import type { ContextURL } from "../types/jsonld/document.ts"
import type { OneOrMany } from "../types/jsonld/base.ts"
import type { PlainDocument } from "../types/jsonld/document.ts"

/**
 * Concatenate multiple Uint8Arrays.
 *
 * @param {Array<Uint8Array>} arrays The arrays to concatenate.
 *
 * @returns {Uint8Array} The concatenated array.
 */
export function concatenate(...arrays: Array<Uint8Array>): Uint8Array {
  const length = arrays.reduce((acc, arr) => acc + arr.length, 0)
  const result = new Uint8Array(length)
  let offset = 0
  for (const arr of arrays) {
    result.set(arr, offset)
    offset += arr.length
  }
  return result
}

/**
 * Convert a value of one or many element(s) to an array.
 *
 * @param {OneOrMany<T>} several The value with one or many elements.
 *
 * @returns {Array<T>} The array of elements.
 */
export function severalToMany<T>(several: OneOrMany<T>): Array<T> {
  return Array.isArray(several) ? several : [several]
}

/**
 * Check if a provided document includes a context URL in its `@context` property.
 *
 * @param {PlainDocument} document A JSON-LD document.
 * @param {ContextURL} context The context URL to check.
 *
 * @returns {boolean} `true` if the context is included, `false` otherwise.
 */
export function includeContext(document: PlainDocument, context: ContextURL): boolean {
  const fromContext = document["@context"]
  if (context === fromContext) {
    return true
  } else if (Array.isArray(fromContext)) {
    return fromContext.includes(context)
  }
  return false
}
