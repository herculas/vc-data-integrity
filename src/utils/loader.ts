import { DataIntegrityError } from "../error/error.ts"
import { ErrorCode } from "../error/code.ts"
import { URL_CONTEXT_MAP } from "../context/context.ts"

import type { JsonLdDocument } from "../types/jsonld/base.ts"
import type { Loader, RemoteDocument } from "../types/api/loader.ts"
import type { URI } from "../types/jsonld/literals.ts"

/**
 * Construct the default document loader for fetching JSON-LD documents.
 *
 * @param {URI} url The URL to fetch.
 *
 * @returns {Promise<RemoteDocument>} Resolve to the loaded document.
 */
export async function defaultLoader(url: URI): Promise<RemoteDocument> {
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
        document: URL_CONTEXT_MAP.get(url)! as JsonLdDocument,
      })
    }
    return loader(url)
  }
}
