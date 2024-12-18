import * as jsonld from "jsonld"
import type * as Options from "./types/options.ts"
import { SECURITY_CONTEXT_V2_URL } from "./context.ts"
import type { Loader } from "./types/loader.ts"
import type { NodeObject } from "./types/basic.ts"

export function toW3CTimestampString(date?: Date | number | string): string {
  if (!date) {
    date = new Date()
  } else if (typeof date === "number" || typeof date === "string") {
    date = new Date(date)
  }
  const str = date.toISOString()
  return str.substring(0, str.length - 5) + "Z"
}

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
 * Canonize an object using the URDNA2015 algorithm.
 *
 * @param {object} input The document to canonize.
 * @param {Options.Canonize} options The options.
 *
 * @returns {Promise<string>} Resolve to the canonized document.
 */
export async function canonize(input: object, options: Options.Canonize): Promise<string> {
  return await jsonld.default.canonize(input, options)
}

export async function frame(method: string, loader: Loader): Promise<object> {
  const framed = await jsonld.default.frame(method, {
    "@context": SECURITY_CONTEXT_V2_URL,
    "@embed": "@always",
    id: method,
  }, {
    documentLoader: loader,
    compactToRelative: false,
    expandContext: SECURITY_CONTEXT_V2_URL,
  })
  if (!framed) {
    throw new Error(`Verification method ${method} not found.`)
  }
  return framed
}

/**
 * Check if a provided document includes a context URL in its `@context` property.
 * 
 * @param {NodeObject} document A JSON-LD document.
 * @param {string} context The context URL to check.
 * 
 * @returns {boolean} `true` if the context is included, `false` otherwise. 
 */
export function includeContext(document: NodeObject, context: string): boolean {
  if (Array.isArray(document)) {
    document = document[0]
  }
  const fromContext = document["@context"]
  if (context === fromContext) {
    return true
  } else if (Array.isArray(fromContext)) {
    return fromContext.includes(context)
  }
  return false
}

/**
 * Hash a string using SHA-256.
 *
 * @param {string} str The string to hash.
 *
 * @returns {Promise<Uint8Array>} Resolve to the hash value.
 */
export async function sha256(str: string): Promise<Uint8Array> {
  const bytes = new TextEncoder().encode(str)
  const digest = await crypto.subtle.digest("SHA-256", bytes)
  return new Uint8Array(digest)
}
