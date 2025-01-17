import type { URL } from "../jsonld/document.ts"

/**
 * The result of loading a document.
 */
export type LoadedDocument = {
  contextUrl?: URL
  documentUrl?: URL
  document?: object
}

/**
 * A `Loader` is a function that loads a document from a URL.
 */
export type Loader = (url: URL) => Promise<LoadedDocument>
