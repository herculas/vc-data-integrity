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
