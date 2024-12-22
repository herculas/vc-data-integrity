import type { LoadedDocument } from "../types/interface/loader.ts"

export async function defaultLoader(_url: string): Promise<LoadedDocument> {
  try {
    const response = await fetch(_url)
    const document = await response.json()
    return {
      contextUrl: _url,
      documentUrl: _url,
      document: document,
    }
  } catch (error) {
    throw new Error(`Failed to fetch ${_url}: ${error}`)
  }
}
