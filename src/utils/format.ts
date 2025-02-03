import type { OneOrMany } from "../types/jsonld/base.ts"
import type { PlainDocument } from "../types/jsonld/document.ts"
import type { URI } from "../types/jsonld/literals.ts"

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
 * Check if the provided document includes a specific context URL in its `@context` property. The context can be a
 * single URL or an array of URLs. If the context is an array, the function will return `true` if any of the URLs are
 * included in the document.
 *
 * @param {PlainDocument} document A JSON-LD document.
 * @param {OneOrMany<URI>} contexts An array of context URLs to check.
 *
 * @returns {boolean} `true` if any one of the context URLs is included in the document, `false` otherwise.
 */
export function includeContext(document: PlainDocument, contexts: OneOrMany<URI>): boolean {
  contexts = severalToMany(contexts)
  return contexts.some((context) => {
    const fromContext = document["@context"]
    if (context === fromContext) {
      return true
    } else if (Array.isArray(fromContext)) {
      return fromContext.includes(context)
    }
    return false
  })
}
