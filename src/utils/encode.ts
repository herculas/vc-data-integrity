import { decodeBase58, decodeBase64Url, encodeBase58, encodeBase64Url } from "@std/encoding"

import { ImplementationError, ImplementationErrorCode } from "../error/implement.ts"

const BASE_58_BTC_PREFIX = "z"

/**
 * Encode a byte array into a base-58-btc string.
 *
 * @param {Uint8Array} data A byte array to be encoded.
 *
 * @returns {string} The base-58-btc encoded string.
 */
function encodeBase58Btc(data: Uint8Array): string {
  return BASE_58_BTC_PREFIX + encodeBase58(data)
}

/**
 * Decode a base-58-btc-encoded string into a byte array.
 *
 * @param {Uint8Array} str A base-58-btc-encoded string.
 *
 * @returns {Uint8Array} The decoded byte array.
 */
function decodeBase58Btc(str: string): Uint8Array {
  if (!str.startsWith(BASE_58_BTC_PREFIX)) {
    throw new ImplementationError(
      ImplementationErrorCode.DECODING_ERROR,
      "encode/base58::decode",
      "Invalid base-58-btc prefix!",
    )
  }
  return decodeBase58(str.slice(BASE_58_BTC_PREFIX.length))
}

/**
 * Encode and decode functions for various encoding formats.
 */
export const base58btc = {
  encode: encodeBase58Btc,
  decode: decodeBase58Btc,
}

/**
 * Encode and decode functions for various encoding formats.
 */
export const base64Url = {
  encode: encodeBase64Url,
  decode: decodeBase64Url,
}
