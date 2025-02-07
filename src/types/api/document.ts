import type { Loader } from "./loader.ts"

/**
 * The verification relationships that can be used to verify a document.
 */
export type Relationship =
  | "authentication"
  | "assertionMethod"
  | "keyAgreement"
  | "capabilityInvocation"
  | "capabilityDelegation"

/**
 * Options for retrieving a verification method.
 */
export interface Retrieve {
  /**
   * The document loader to use when fetching remote documents.
   */
  documentLoader: Loader
}
