/**
 * A Multibase value encodes a binary value as a base-encoded string. The value starts with a single character header,
 * which identifies the base and encoding alphabet used to encode the binary value, followed by the encoded binary value
 * (using that base and alphabet).
 *
 * @module multibase
 *
 * @see https://www.w3.org/TR/cid-1.0/#multibase-0
 */

import { base58, base64url as url, base64urlnopad as nopad } from "@scure/base"

import { ImplementationError, ImplementationErrorCode } from "../error/implement.ts"

/**
 * The base-58-btc encoding suite.
 */
export const base58btc = {
  /**
   * The base-58-btc multibase header which identifies the base and encoding alphabet used to encode the binary value.
   */
  header: "z",

  /**
   * Encode a byte array into a base-58-btc string.
   *
   * @param {Uint8Array} data A byte array to be encoded.
   * @param {boolean} [attachHeader] Whether to attach the base-58-btc header to the encoded string.
   *
   * @returns {string} The base-58-btc encoded string.
   */
  encode: (data: Uint8Array, attachHeader: boolean = true): string =>
    (attachHeader ? base58btc.header : "") + base58.encode(data),

  /**
   * Decode a base-58-btc-encoded string into a byte array.
   *
   * @param {string} str A base-58-btc-encoded string.
   * @param {boolean} [checkHeader] Whether to check the base-58-btc header of the encoded string.
   *
   * @returns {Uint8Array} The decoded byte array.
   */
  decode: (str: string, checkHeader: boolean = true): Uint8Array => {
    if (checkHeader && !str.startsWith(base58btc.header)) {
      throw new ImplementationError(
        ImplementationErrorCode.DECODING_ERROR,
        "multibase/base58btc::decode",
        `The encoded string MUST start with the base-58-btc header since "checkHeader" is set to ${checkHeader}!`,
      )
    }

    return base58.decode(checkHeader ? str.slice(base58btc.header.length) : str)
  },
}

/**
 * The base-64-url encoding suite.
 */
export const base64url = {
  /**
   * Encode a byte array into a base-64-url string.
   *
   * @param {Uint8Array} data A byte array to be encoded.
   *
   * @returns {string} The base-64-url encoded string.
   */
  encode: url.encode,

  /**
   * Decode a base-64-url-encoded string into a byte array.
   *
   * @param {string} str A base-64-url-encoded string.
   *
   * @returns {Uint8Array} The decoded byte array.
   */
  decode: url.decode,
}

/**
 * The base-64-url-no-pad encoding suite.
 */
export const base64urlnopad = {
  /**
   * The base-64-url-no-pad multibase header which identifies the base and encoding alphabet used to encode the binary
   * value.
   */
  header: "u",

  /**
   * Encode a byte array into a base-64-url-no-pad string.
   *
   * @param {Uint8Array} data A byte array to be encoded.
   * @param {boolean} [attachHeader] Whether to attach the base-64-url-no-pad header to the encoded string.
   *
   * @returns {string} The base-64-url-no-pad encoded string.
   */
  encode: (data: Uint8Array, attachHeader: boolean = true): string =>
    (attachHeader ? base64urlnopad.header : "") + nopad.encode(data),

  /**
   * Decode a base-64-url-no-pad-encoded string into a byte array.
   *
   * @param {string} str A base-64-url-no-pad-encoded string.
   * @param {boolean} [checkHeader] Whether to check the base-64-url-no-pad header of the encoded string.
   *
   * @returns {Uint8Array} The decoded byte array.
   */
  decode: (str: string, checkHeader: boolean = true): Uint8Array => {
    if (checkHeader && !str.startsWith(base64urlnopad.header)) {
      throw new ImplementationError(
        ImplementationErrorCode.DECODING_ERROR,
        "multibase/base64urlnopad::decode",
        `The encoded string MUST start with the base-64-url-no-pad header since "checkHeader" is set to ${checkHeader}!`,
      )
    }

    return nopad.decode(checkHeader ? str.slice(base64urlnopad.header.length) : str)
  },
}
