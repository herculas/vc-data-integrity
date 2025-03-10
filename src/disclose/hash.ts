import type { Hasher } from "../types/api/disclose.ts"
import type { NQuad } from "../types/serialize/rdf.ts"

/**
 * Cryptographically hash an array of mandatory to disclose N-Quads using a provided hashing API.
 *
 * @param {Array<NQuad>} mandatory An array of mandatory to disclose N-Quads.
 * @param {Hasher} hasher A cryptographic function.
 *
 * @returns {Promise<Uint8Array>} Resolve to the hash of the mandatory N-Quads.
 *
 * @see https://www.w3.org/TR/vc-di-ecdsa/#hashmandatorynquads
 */
export async function hashMandatoryNQuads(mandatory: Array<NQuad>, hasher: Hasher): Promise<Uint8Array> {
  // Procedure:
  //
  // 1. Initialize `bytes` to the UTF-8 representation of the joined `mandatory` N-Quads.
  // 2. Initialize `mandatoryHash` to the result of using `hasher` to hash `bytes`.
  // 3. Return `mandatoryHash`.

  const bytes = new TextEncoder().encode(mandatory.join(""))
  const mandatoryHash = await hasher(bytes)
  return mandatoryHash
}
