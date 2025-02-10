import type { JsonLdDocument } from "../jsonld/base.ts"
import type { URI } from "../jsonld/literals.ts"

/**
 * The result of loading a document.
 */
export interface RemoteDocument {
  /**
   * The URL of the context.
   */
  contextUrl?: URI

  /**
   * The URL of the document.
   */
  documentUrl?: URI

  /**
   * The resolved document.
   */
  document?: JsonLdDocument
}

/**
 * A document loader function that loads a remote document given its URL.
 */
export type Loader = (url: URI) => Promise<RemoteDocument>
