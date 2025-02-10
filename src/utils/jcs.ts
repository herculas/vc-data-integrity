import { ImplementationError } from "../mod.ts"
import { ImplementationErrorCode } from "../error/implement.ts"

import type { JsonLdDocument } from "../types/jsonld/base.ts"

/**
 * Canonize a JSON document using the JSON Canonicalization Scheme (JCS).
 *
 * @param {JsonLdDocument} input The JSON-LD document to canonize.
 *
 * @returns {string} The canonized JSON-LD document.
 */
export function canonize(input: JsonLdDocument): string {
  const canonized = recursive(input)
  return canonized
}

/**
 * Recursively canonize a JSON object using the JSON Canonicalization Scheme (JCS).
 *
 * @param {unknown} object The object to canonize.
 *
 * @returns {string} The canonized JSON object.
 */
function recursive(object: unknown): string {
  // check if the object is a illegal number
  if (typeof object === "number" && (isNaN(object) || !isFinite(object))) {
    throw new ImplementationError(
      ImplementationErrorCode.ENCODING_ERROR,
      "jcs#recursive",
      "Illegal number value in the object.",
    )
  }

  // primitive types, directly stringify them
  if (object === null || typeof object !== "object") {
    return JSON.stringify(object)
  }

  // has a `toJSON` method, call it and return the result
  if ("toJSON" in object && typeof object.toJSON === "function") {
    return recursive(object.toJSON())
  }

  // is an array, maintain the element order and recursively call the function
  if (Array.isArray(object)) {
    const values = object.reduce((previousValue, currentValue, currentIndex) => {
      const comma = currentIndex === 0 ? "" : ","
      const value = currentValue === undefined || typeof currentValue === "symbol" ? null : currentValue
      return `${previousValue}${comma}${recursive(value)}`
    }, "")
    return `[${values}]`
  }

  // is an object, sort the keys before serializing
  const values = Object.keys(object).sort().reduce((previousValue, currentKey): string => {
    const temp = object[currentKey as keyof typeof object]
    if (temp === undefined || typeof temp === "symbol") {
      return previousValue
    }
    const comma = previousValue.length === 0 ? "" : ","
    return `${previousValue}${comma}${recursive(currentKey)}:${recursive(temp)}`
  }, "")

  return `{${values}}`
}
