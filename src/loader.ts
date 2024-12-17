import { urlContextMap } from "./context.ts"
import type { Loader } from "./types/loader.ts"

/**
 * Given a existing document loader function, return a new document loader function. The new function will first check
 * if the given URL is in the built-in context map. If not found, it will fallback to using the passed document loader.
 *
 * This function can be used to ensure that any local, in-memory, immutable context documents provided by this library
 * will be used prior to any external document loader.
 *
 * @param {Loader} loader A fallback loader that will be used if the given URL is not in the built-in context map.
 * @returns {Loader} A new document loader that will first check the built-in context map before using the passed
 * fallback loader.
 */
export function extend(loader: Loader): Loader {
  return (url: string) => {
    if (urlContextMap.has(url)) {
      return Promise.resolve({
        documentUrl: url,
        document: urlContextMap.get(url)!,
      })
    }
    return loader(url)
  }
}
