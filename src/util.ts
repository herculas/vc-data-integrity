import * as jsonld from "jsonld"
import type * as Options from "./types/options.ts"
import type { Proof } from "./mod.ts"
import { SECURITY_CONTEXT_V2_URL } from "./context.ts"

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
// deno-lint-ignore require-await
export async function canonize(input: object, options: Options.Canonize): Promise<string> {
  return jsonld.default.canonize(input, {
    algorithm: "URDNA2015",
    format: "application/n-quads",
    documentLoader: options.loader,
    skipExpansion: options.skipExpansion,
  })
}

/**
 * Canonize an object using the URDNA2015 algorithm for proof creation.
 *
 * @param {object} proof The proof to canonize.
 * @param {Options.Canonize} options The options.
 *
 * @returns {Promise<string>} Resolve to the canonized proof.
 */
export function canonizeForProof(proof: Proof, options: Options.Canonize): Promise<string> {
  proof["@context"] = SECURITY_CONTEXT_V2_URL
  delete proof.proofValue
  return canonize(proof, {
    loader: options.loader,
    skipExpansion: false,
  })
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
