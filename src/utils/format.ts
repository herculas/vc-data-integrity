import type { OneOrMany } from "../types/jsonld/base.ts"

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
