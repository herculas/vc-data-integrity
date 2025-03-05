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
 * An interface for encoding and decoding binary values using a specific base and encoding alphabet.
 */
export interface MultibaseCodec {
  /**
   * The multibase header which identifies the base and encoding alphabet used to encode the binary value.
   */
  header?: string

  /**
   * Encode a byte array into a multibase string.
   *
   * @param {Uint8Array} data A byte array to be encoded.
   * @param {boolean} [attachHeader] Whether to attach the multibase header to the encoded string.
   *
   * @returns {string} The multibase encoded string.
   */
  encode: (data: Uint8Array, attachHeader?: boolean) => string

  /**
   * Decode a multibase-encoded string into a byte array.
   *
   * @param {string} str A multibase-encoded string.
   * @param {boolean} [checkHeader] Whether to check the multibase header of the encoded string.
   *
   * @returns {Uint8Array} The decoded byte array.
   */
  decode: (str: string, checkHeader?: boolean) => Uint8Array
}

/**
 * Encode and decode binary values using the base-58-btc encoding alphabet.
 */
export const base58btc: MultibaseCodec = {
  header: "z",
  encode: (data: Uint8Array, attachHeader: boolean = true): string =>
    (attachHeader ? base58btc.header : "") + base58.encode(data),
  decode: (str: string, checkHeader: boolean = true): Uint8Array => {
    if (checkHeader && !str.startsWith(base58btc.header!)) {
      throw new ImplementationError(
        ImplementationErrorCode.DECODING_ERROR,
        "multibase/base58btc::decode",
        `The encoded string MUST start with the base-58-btc header since "checkHeader" is set to ${checkHeader}!`,
      )
    }
    return base58.decode(checkHeader ? str.slice(base58btc.header!.length) : str)
  },
}

/**
 * Encode and decode binary values using the base-64-url encoding alphabet.
 */
export const base64url: MultibaseCodec = {
  header: "u",
  encode: (data: Uint8Array, attachHeader: boolean = true): string =>
    (attachHeader ? base64url.header : "") + url.encode(data),
  decode: (str: string, checkHeader: boolean = true): Uint8Array => {
    if (checkHeader && !str.startsWith(base64url.header!)) {
      throw new ImplementationError(
        ImplementationErrorCode.DECODING_ERROR,
        "multibase/base64url::decode",
        `The encoded string MUST start with the base-64-url header since "checkHeader" is set to ${checkHeader}!`,
      )
    }
    return url.decode(checkHeader ? str.slice(base64url.header!.length) : str)
  },
}

/**
 * Encode and decode binary values using the base-64-url-no-pad encoding alphabet.
 */
export const base64urlnopad: MultibaseCodec = {
  header: "u",
  encode: (data: Uint8Array, attachHeader: boolean = true): string =>
    (attachHeader ? base64urlnopad.header : "") + nopad.encode(data),
  decode: (str: string, checkHeader: boolean = true): Uint8Array => {
    if (checkHeader && !str.startsWith(base64urlnopad.header!)) {
      throw new ImplementationError(
        ImplementationErrorCode.DECODING_ERROR,
        "multibase/base64urlnopad::decode",
        `The encoded string MUST start with the base-64-url-no-pad header since "checkHeader" is set to ${checkHeader}!`,
      )
    }
    return nopad.decode(checkHeader ? str.slice(base64urlnopad.header!.length) : str)
  },
}
