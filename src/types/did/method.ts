import type { DID, DIDURL } from "./keywords.ts"

export type MethodMap = VerificationMethod | DIDURL

/**
 * A set of data describing a verification method, such as a cryptographic key, that can be used to authenticate a
 * DID subject.
 *
 * @see https://www.w3.org/TR/did-core/#verification-methods
 */
export interface VerificationMethod {
  /**
   * The identifier for a particular verification method.
   *
   * The value of this property MUST be a string that conforms to the DID URL syntax.
   */
  id: DIDURL

  /**
   * The controller property is used to express the entity that controls the corresponding private key.
   *
   * The value of this property MUST be a string that conforms to the DID syntax.
   */
  controller: DID

  /**
   * The type property is used to express the type of verification method.
   *
   * The value of this property MUST be a string that references exactly one verification method type.
   * To maximize interoperability, the value of this property SHOULD be a string from an established vocabulary.
   */
  type: string
  publicKeyJwk?: object
  publicKeyMultibase?: string
}
