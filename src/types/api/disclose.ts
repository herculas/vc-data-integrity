import type { BlankNode } from "../serialize/base.ts"

export interface HMAC {
  /**
   * HMAC the input data.
   *
   * @param {Uint8Array} data The input data to HMAC.
   *
   * @returns {Uint8Array} The HMAC digest.
   */
  sign: (data: Uint8Array) => Uint8Array
}

/**
 * A map from the old blank node identifiers to the new blank node identifiers.
 */
export type LabelMap = Map<BlankNode, BlankNode>

/**
 * A factory function that creates a label map from a canonical blank node identifier map.
 */
export type LabelMapFactory = (canonicalIdMap: LabelMap) => Promise<LabelMap>
