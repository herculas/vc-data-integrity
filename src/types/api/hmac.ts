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
