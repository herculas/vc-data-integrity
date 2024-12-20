import type { JWK } from "./jwk.ts"
import type { DID, DIDURL } from "./keywords.ts"

export type MethodMap = VerificationMethod | DIDURL

/**
 * A set of data describing a verification method, such as a cryptographic key, that can be used to authenticate a DID
 * subject.
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

  /**
   * The publicKeyJwk property is used to express a public key in JWK format.
   *
   * The value of this property MUST be a map representing a JSON Web Key (JWK) that conforms [RFC-7517].
   * It is RECOMMENDED that verification methods that use JWKs to represent their public keys use the value of `kid`
   * as their fragment identifier.
   * It is RECOMMENDED that JWK `kid` values are set to the public key fingerprint [RFC-7638].
   *
   * @see https://www.rfc-editor.org/rfc/rfc7517
   * @see https://www.rfc-editor.org/rfc/rfc7638
   */
  publicKeyJwk?: JWK

  /**
   * The publicKeyMultibase property is used to express a public key in multibase format.
   *
   * The value of this property MUST be a string representation of a multibase encoded public key.
   *
   * @see https://datatracker.ietf.org/doc/html/draft-multiformats-multibase-03
   */
  publicKeyMultibase?: string
}
