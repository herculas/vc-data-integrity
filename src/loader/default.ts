import { LDErrorCode } from "../error/constants.ts"
import { LDError } from "../error/error.ts"
import type { LoadedDocument } from "../types/interface/loader.ts"
import type { URI } from "../types/jsonld/document.ts"

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
    throw new LDError(
      LDErrorCode.NETWORK_FAILURE,
      "loader.defaultLoader",
      `Failed to fetch the resource from ${url}: ${error}!`,
    )
  }
}
