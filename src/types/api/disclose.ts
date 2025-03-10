import type { BlankNode } from "../serialize/base.ts"

/**
 * A factory function that hmac the input data into a digest in the form of a Uint8Array.
 *
 * @param {Uint8Array} data The input data to hash.
 */
export type HMAC = (data: Uint8Array) => Promise<Uint8Array>

/**
 * A factory function that hashes the input data into a digest in the form of a Uint8Array.
 *
 * @param {Uint8Array} data The input data to hash.
 *
 * @returns {Promise<Uint8Array>} Resolve to the hash digest.
 */
export type Hasher = (data: Uint8Array) => Promise<Uint8Array>

/**
 * A map from the old blank node identifiers to the new blank node identifiers.
 */
export type LabelMap = Map<BlankNode, BlankNode>

/**
 * A factory function that creates a label map from a canonical blank node identifier map.
 */
export type LabelMapFactory = (canonicalIdMap: LabelMap) => Promise<LabelMap>

/**
 * The path to a node in a JSON object, represented as a string or a number. The path is a sequence of keys and indices
 * separated by a dot. For example, the path to the value of the key "b" in the object {"a": {"b": 1}} is "a/b".
 */
export type Path = string | number
