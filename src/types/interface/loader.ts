import type { URI } from "../jsonld/document.ts"

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
