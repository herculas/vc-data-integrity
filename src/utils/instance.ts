import { equal } from "@std/assert"

type InstanceType = object | string | number | boolean | undefined | null

/**
 * Check if any subtree in the input map contains a property with the specified key.
 *
 * @param {InstanceType} map The input map to check.
 * @param {string} key The key to search for.
 *
 * @returns {boolean} `true` if the key is found; otherwise, `false`.
 */
export function hasProperty(map: InstanceType, key: string): boolean {
  // the map is undefined or null, directly return false
  if (map === undefined || map === null) return false

  // the map is not an object, directly return false
  if (typeof map !== "object") return false

  // the map is an array, recursively check if any of the items in the array contains the key
  if (Array.isArray(map)) return map.some((item) => hasProperty(item, key))

  // the map itself is an object, check if it contains the key
  if (key in map) return true

  // the map is an object not containing the key, recursively check if any of the items in the object contains the key
  return Object.values(map).some((value) => typeof value === "object" && hasProperty(value, key))
}

/**
 * Compare two objects deeply and strictly, ignoring the order of keys in objects and items in arrays.
 *
 * @param {InstanceType} a An instance to compare.
 * @param {InstanceType} b An instance to compare.
 *
 * @returns {boolean} `true` if the two objects are equal; otherwise, `false`.
 */
export function deepEqual(a: InstanceType, b: InstanceType): boolean {
  // if one of the two inputs is undefined or null, the other one should be undefined or null as well
  if ((a === undefined || a === null) && (b === undefined || b === null)) return true

  // if one of the two inputs is undefined or null, the other one is not, they are not equal
  if (a === undefined || a === null || b === undefined || b === null) return false

  // if the two inputs are not objects, compare them directly
  if (typeof a !== "object" || typeof b !== "object") return a === b

  const alpha = structuredClone(a)
  const bravo = structuredClone(b)

  /**
   * Convert all inner arrays in the provided instance into sets.
   *
   * @param {InstanceType} instance The instance to convert.
   *
   * @returns {InstanceType} The converted instance, with all inner arrays converted into sets.
   */
  const convertArrays = (instance: InstanceType): InstanceType => {
    // the provided instance is undefined or null, directly return the instance
    if (instance === undefined || instance === null) return instance

    // the provided instance is not an object, directly return the instance
    if (typeof instance !== "object") return instance

    // the provided instance itself is an array, convert the array into a set directly
    if (Array.isArray(instance)) return new Set(instance.map((item) => convertArrays(item)))

    // the provided instance is an object, process its contents recursively
    const entries = Object
      .entries(instance)
      .map(([key, value]) => [key, typeof value === "object" ? convertArrays(value) : value])
    return Object.fromEntries(entries)
  }

  // compare the two resulted objects using the `equal` function from the deno standard library
  return equal(convertArrays(alpha), convertArrays(bravo))
}
