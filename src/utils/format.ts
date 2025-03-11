/**
 * This module provides utility functions for formatting data.
 *
 * @module format
 */

import { ImplementationError, ImplementationErrorCode } from "../error/implement.ts"

import type { OneOrMany } from "../types/serialize/document.ts"

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
 * Convert a value of one or many element(s) to an array.
 *
 * @param {OneOrMany<T>} several The value with one or many elements.
 *
 * @returns {Array<T>} The array of elements.
 */
export function severalToMany<T>(several: OneOrMany<T>): Array<T> {
  return Array.isArray(several) ? several : [several]
}

/**
 * Converts a Date object, a number, or a string to a W3C timestamp string.
 * @param {Date | number | string} [date] The date to convert.
 *
 * @returns {string} The W3C timestamp string.
 */
export function toW3CTimestamp(date?: Date | number | string): string {
  if (!date) {
    date = new Date()
  } else if (typeof date === "number" || typeof date === "string") {
    date = new Date(date)
  }
  const str = date.toISOString()
  return str.substring(0, str.length - 5) + "Z"
}

/**
 * Convert a byte array into a hexadecimal string.
 *
 * @param {Uint8Array} bytes The byte array to be converted.
 *
 * @returns {string} The hexadecimal string.
 */
export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}

/**
 * Convert a hexadecimal string into a byte array.
 *
 * @param {string} hex The hexadecimal string to be converted.
 *
 * @returns {Uint8Array} The byte array.
 */
export function hexToBytes(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) {
    throw new ImplementationError(
      ImplementationErrorCode.DECODING_ERROR,
      "utils/format#hexToBytes",
      "The length of the hexadecimal string must be even.",
    )
  }
  if (hex.length === 0) {
    return new Uint8Array(0)
  }
  return new Uint8Array(hex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)))
}
