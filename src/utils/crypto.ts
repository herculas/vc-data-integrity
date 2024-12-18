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