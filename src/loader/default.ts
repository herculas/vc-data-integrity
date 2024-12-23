import type { LoadedDocument } from "../types/interface/loader.ts"
import type { URL } from "../types/jsonld/keywords.ts"

/**
 * Construct the default document loader for fetching JSON-LD documents.
 * 
 * @param {URL} url The URL to fetch.
 * 
 * @returns {Promise<LoadedDocument>} Resolve to the loaded document.
 */
export async function defaultLoader(url: URL): Promise<LoadedDocument> {
  try {
    const response = await fetch(url)
    const document = await response.json()
    return {
      contextUrl: url,
      documentUrl: url,
      document: document,
    }
  } catch (error) {
    throw new Error(`Failed to fetch ${url}: ${error}`)
  }
}
