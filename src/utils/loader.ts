import { DataIntegrityError } from "../error/error.ts"
import { ErrorCode } from "../error/constants.ts"
import { URL_CONTEXT_MAP } from "../context/context.ts"
import type { URI } from "../types/jsonld/literals.ts"

/**
 * The result of loading a document.
 */
export type LoadedDocument = {
  contextUrl?: URI
  documentUrl?: URI
  document?: object
}

/**
 * A `Loader` is a function that loads a document from a URL.
 */
export type Loader = (url: URI) => Promise<LoadedDocument>

/**
 * Construct the default document loader for fetching JSON-LD documents.
 *
 * @param {URI} url The URL to fetch.
 *
 * @returns {Promise<LoadedDocument>} Resolve to the loaded document.
 */
export async function defaultLoader(url: URI): Promise<LoadedDocument> {
  try {
    const response = await fetch(url)
    const document = await response.json()
    return {
      contextUrl: url,
      documentUrl: url,
      document: document,
    }
  } catch (error) {
    throw new DataIntegrityError(
      ErrorCode.NETWORK_CONNECTION_ERROR,
      "loader.defaultLoader",
      `Failed to fetch the resource from ${url}: ${error}!`,
    )
  }
}

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
export function extendLoader(loader: Loader): Loader {
  return (url: string) => {
    if (URL_CONTEXT_MAP.has(url)) {
      return Promise.resolve({
        documentUrl: url,
        document: URL_CONTEXT_MAP.get(url)!,
      })
    }
    return loader(url)
  }
}
