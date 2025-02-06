import type { JsonLdDocument } from "../jsonld/base.ts"
import type { URI } from "../jsonld/literals.ts"

/**
 * The result of loading a document.
 */
export interface RemoteDocument {
  contextUrl?: URI
  documentUrl?: URI
  document?: JsonLdDocument
}

/**
 * A `Loader` is a function that loads a document from a URL.
 */
export type Loader = (url: URI) => Promise<RemoteDocument>
