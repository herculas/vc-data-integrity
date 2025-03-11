import type { IRI, IRIReference } from "./base.ts"
import type { JsonLdDocument } from "./document.ts"
import type { LoadProfile } from "../options/load.ts"

/**
 * The `RemoteDocument` type is used by a `LoadDocumentCallback` to return information about a remote document or
 * context.
 *
 * @see https://www.w3.org/TR/json-ld11-api/#remotedocument
 */
export interface RemoteDocument {
  /**
   * The Content-Type of the loaded document, exclusive of any optional parameters.
   */
  contextType?: string

  /**
   * If available, the value of the HTTP Link Header [RFC-8288] using the `http://www.w3.org/ns/json-ld#context` link
   * relation in the response. If the response's Content-Type is `application/ld+json`, the HTTP Link Header is ignored.
   * If multiple Link Headers using the `http://www.w3.org/ns/json-ld#context` link relation are found, the `Promise` of
   * the `LoadDocumentCallback` is rejected with a `JsonLdError` with the `multiple context link headers` error code.
   */
  contextUrl?: IRI | IRIReference

  /**
   * The retrieved document. This can either be the raw payload or the already parsed document.
   */
  document?: JsonLdDocument

  /**
   * The final URL of the loaded document. This is important to handle HTTP redirects properly.
   */
  documentUrl?: IRI | IRIReference

  /**
   * The value of any `profile` parameter retrieved as part of the original `contextType`.
   */
  profile?: string
}

/**
 * The `LoadDocumentCallback` defines a callback that custom document loaders have to implement to be used to retrieve
 * remote documents and contexts. The callback returns a Promise resolving to a `RemoteDocument`. On failure, the
 * Promise with a `JsonLdError` having an appropriate error code.
 *
 * @param {IRI | IRIReference} url The URL of the remote document or context to load.
 * @param {LoadProfile} [options] A set of options to determine the behavior of the callback.
 *
 * @see https://www.w3.org/TR/json-ld11-api/#loaddocumentcallback
 */
export type LoadDocumentCallback = (url: IRI | IRIReference, options?: LoadProfile) => Promise<RemoteDocument>
