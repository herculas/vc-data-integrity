import type { Loader } from "./loader.ts"

export type Relationship =
  | "authentication"
  | "assertionMethod"
  | "keyAgreement"
  | "capabilityInvocation"
  | "capabilityDelegation"

export interface Retrieve {
  /**
   * The document loader to use when fetching remote documents.
   */
  documentLoader: Loader
}
