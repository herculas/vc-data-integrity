import type { Flag } from "../api/suite.ts"
import type { LoadDocumentCallback } from "../serialize/loader.ts"

/**
 * Options for retrieving a verification method.
 */
export interface Retrieve {
  /**
   * The callback of the loader to be used to retrieve remote documents and contexts, implementing the
   * `LoadDocumentCallback` interface.
   *
   * @see https://www.w3.org/TR/json-ld11-api/#dom-jsonldoptions-documentloader
   */
  documentLoader: LoadDocumentCallback
}

/**
 * The options for exporting a keypair.
 */
export interface Export {
  /**
   * The type of the keypair. This field should be the same as the type of the exported controlled identifier document.
   */
  type?: string

  /**
   * The type of key to export, either "public" or "private".
   */
  flag?: Flag
}

/**
 * The options for importing a keypair.
 */
export interface Import {
  /**
   * Whether to check the context of the keypair during import.
   */
  checkContext?: boolean

  /**
   * Whether to check the expiration status of the keypair during import.
   */
  checkExpired?: boolean

  /**
   * Whether to check the revocation status of the keypair during import.
   */
  checkRevoked?: boolean
}
