import type { IRI, IRIReference } from "../jsonld/base.ts"
import type { JsonLdDocument, OneOrMany } from "../jsonld/document.ts"

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
 * @param {LoadDocumentOptions} [options] A set of options to determine the behavior of the callback.
 *
 * @see https://www.w3.org/TR/json-ld11-api/#loaddocumentcallback
 */
export type LoadDocumentCallback = (url: IRI | IRIReference, options?: LoadDocumentOptions) => Promise<RemoteDocument>

/**
 * The `LoadDocumentOptions` type is used to pass various options to the `LoadDocumentCallback` function.
 *
 * @see https://www.w3.org/TR/json-ld11-api/#loaddocumentoptions
 */
export type LoadDocumentOptions = {
  /**
   * If set to `true`, when extracting JSON-LD script elements from HTML, unless a specific fragment identifier is
   * targeted, extracts all encountered JSON-LD script elements using an array form, if necessary.
   */
  extractAllScripts?: boolean

  /**
   * When the resulting `contentType` is `text/html` or `application/xhtml+xml`, this option determines the profile to
   * use for selecting JSON-LD script elements.
   */
  profile?: string

  /**
   * One or more IRIs to use in the request as a profile parameter.
   */
  requestProfile?: OneOrMany<string>
}
