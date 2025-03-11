/**
 * This module provides functions for type checking.
 *
 * @module guard
 */

/**
 * Check if the value is an non-null object. Note that this function will return true for arrays.
 *
 * @param {unknown} value The value to be checked.
 *
 * @returns {boolean} `true` if the value is an object, `false` otherwise.
 */
export function isObject(value: unknown): value is object {
  return typeof value === "object" && value !== null
}

/**
 * Check if the value is a pure object, i.e., an object that is not an array.
 *
 * @param {unknown} value The value to be checked.
 *
 * @returns {boolean} `true` if the value is a pure object, `false` otherwise.
 */
export function isPureObject(value: unknown): value is object {
  return isObject(value) && !Array.isArray(value)
}

/**
 * Check if the value is a scalar, i.e., a string, number, boolean, null, or undefined.
 *
 * @param {unknown} value The value to be checked.
 *
 * @returns {boolean} `true` if the value is a scalar, `false` otherwise.
 */
export function isScalar(value: unknown): value is string | number | boolean | null | undefined {
  return isPureScalar(value) || value === null || value === undefined
}

/**
 * Check if the value is a scalar. Note that this function will return false for null and undefined.
 *
 * @param {unknown} value The value to be checked.
 *
 * @returns {boolean} `true` if the value is a pure scalar, `false` otherwise.
 */
export function isPureScalar(value: unknown): value is string | number | boolean {
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean"
}
