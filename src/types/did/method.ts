import type { DID, DIDURL } from "./keywords.ts"
import type { JWK } from "./jwk.ts"
import type { NodeObject } from "../jsonld/node.ts"
import type { Type } from "../jsonld/keywords.ts"

export type VerificationMethod = VerificationMethodMap | DIDURL

/**
 * A set of data describing a verification method, such as a cryptographic key, that can be used to authenticate or
 * authorize a interactions with a DID subject or associated parties. For example, a cryptographic public key can be
 * used as a verification method with respect to a digital signature; in such usage, it verifies that the signer could
 * use the associated cryptographic private key.
 *
 * @see https://www.w3.org/TR/did-core/#verification-methods
 * @see https://www.w3.org/TR/did-core/#verification-material
 */
export interface VerificationMethodMap extends NodeObject {
  /**
   * The identifier for a particular verification method.
   *
   * The value of this property MUST be a string that conforms to the DID URL syntax.
   *
   * @see https://www.w3.org/TR/did-core/#dfn-verificationmethod
   */
  id: DIDURL

  /**
   * The `controller` property is used to express the entity that controls the corresponding private key.
   *
   * The value of this property MUST be a string that conforms to the DID syntax.
   *
   * @see https://www.w3.org/TR/did-core/#dfn-verificationmethod
   */
  controller: DID

  /**
   * The `type` property is used to express the type of verification method.
   *
   * The value of this property MUST be a string that references exactly one verification method type.
   *
   * @see https://www.w3.org/TR/did-core/#dfn-verificationmethod
   */
  type: Type

  /**
   * The `publicKeyJwk` property is used to express a public key in JSON Web Key (JWK) format.
   *
   * The value of this property MUST be a map representing a JWK that conforms
   * {@link https://datatracker.ietf.org/doc/html/rfc7517 | RFC-7517}.
   *
   * It is RECOMMENDED that verification methods that use JWKs to represent their public keys, using the value of `kid`
   * as their fragment identifier. It is RECOMMENDED that JWK `kid` values are set to the public key thumbprint as
   * defined in {@link https://datatracker.ietf.org/doc/html/rfc7638 | RFC-7638}.
   *
   * @see https://www.w3.org/TR/did-core/#dfn-publickeyjwk
   * @see https://datatracker.ietf.org/doc/html/rfc7517
   * @see https://datatracker.ietf.org/doc/html/rfc7638
   */
  publicKeyJwk?: JWK

  /**
   * The `publicKeyMultibase` property is used to express a public key in multibase format.
   *
   * The value of this property MUST be a string representation of a multibase encoded public key.
   *
   * A verification method MUST NOT contain multiple verification material properties for the same material. For
   * example, expressing key material in a verification method using both `publicKeyJwk` and `publicKeyMultibase` at the
   * same time is prohibited.
   *
   * @see https://www.w3.org/TR/did-core/#dfn-publickeymultibase
   * @see https://datatracker.ietf.org/doc/html/draft-multiformats-multibase-03
   */
  publicKeyMultibase?: string
}
