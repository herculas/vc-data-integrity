import type { OneOrMany } from "../jsonld/base.ts"
import type { URL } from "../jsonld/keywords.ts"
import type { NodeObject } from "../jsonld/node.ts"
import type { DID } from "./keywords.ts"
import type { VerificationMethod, VerificationMethodMap } from "./method.ts"
import type { Service } from "./service.ts"

/**
 * A set od data describing a DID subject, including mechanisms, such as cryptographic keys, that the DID subject or a
 * DID delegate can use to authenticate itself and prove its association with the DID.
 *
 * @see https://www.w3.org/TR/did-core/#did-document-properties
 * @see https://www.w3.org/TR/did-core/#did-documents
 * @see https://www.w3.org/TR/did-core/#did-subject
 */
export interface DIDDocument extends NodeObject {
  /**
   * The DID for a particular DID subject.
   *
   * The value of this property MUST be a string that conforms to the DID syntax.
   * 
   * @see https://www.w3.org/TR/did-core/#did-subject
   */
  id: DID

  /**
   * A DID subject can have multiple identifiers for different purposes, or at different times.
   * The assertion that two or more DIDs (or other types of URIs) refer to the same DID subject can be made using this
   * property.
   *
   * The value of this property MUST be an set of strings that conform to the URL syntax.
   * 
   * @see https://www.w3.org/TR/did-core/#also-known-as
   */
  alsoKnownAs?: Array<URL>

  /**
   * An entity that is authorized to make changes to this DID document.
   *
   * The value of this property MUST be a string, or a set of strings, that conforms to the DID syntax.
   * 
   * @see https://www.w3.org/TR/did-core/#did-controller
   */
  controller?: OneOrMany<DID>

  /**
   * A DID document can express verification methods, such as cryptographic public keys, which can be used to
   * authenticate or authorize interactions with the DID subject or associated parties.
   *
   * The value of this property MUST be an set of verification methods, where each one is expressed using a map.
   * 
   * @see https://www.w3.org/TR/did-core/#verification-methods
   */
  verificationMethod?: Array<VerificationMethodMap>

  /**
   * The authentication property is used to specify how the DID subject is expected to be authenticated, for purposes
   * such as logging into a website or engaging in any sort of challenge-response protocol.
   *
   * The value of this property MUST be a set of one or more verification methods. Each verification method MAY be
   * embedded directly or referenced by DID URL.
   * 
   * @see https://www.w3.org/TR/did-core/#authentication
   */
  authentication?: Array<VerificationMethod>

  /**
   * The assertionMethod property is used to specify how the DID subject is expected to express claims, such as
   * purposes of issuing a Verifiable Credential.
   *
   * The value of this property MUST be a set of one or more verification methods. Each verification method MAY be
   * embedded directly or referenced by DID URL.
   * 
   * @see https://www.w3.org/TR/did-core/#assertion
   */
  assertionMethod?: Array<VerificationMethod>

  /**
   * The keyAgreement property is used to specify how an entity can generate encryption material in order to transmit
   * confidential information intended for the DID subject, such as for the purpose of establishing a secure
   * communication channel with the recipient.
   *
   * The value of this property MUST be a set of one or more verification methods. Each verification method MAY be
   * embedded directly or referenced by DID URL.
   * 
   * @see https://www.w3.org/TR/did-core/#key-agreement
   */
  keyAgreement?: Array<VerificationMethod>

  /**
   * The capabilityInvocation property is used to specify a verification method that might be used by the DID subject
   * to invoke a cryptographic capability, such as the authorization to update the DID document.
   *
   * The value of this property MUST be a set of one or more verification methods. Each verification method MAY be
   * embedded directly or referenced by DID URL.
   * 
   * @see https://www.w3.org/TR/did-core/#capability-invocation
   */
  capabilityInvocation?: Array<VerificationMethod>

  /**
   * The capabilityDelegation property is used to specify a mechanism that might be used by the DID subject to delegate
   * a cryptographic capability to another party, such as delegating the authority to access a specific HTTP API to a
   * subroutine.
   *
   * The value of this property MUST be a set of one or more verification methods. Each verification method MAY be
   * embedded directly or referenced by DID URL.
   * 
   * @see https://www.w3.org/TR/did-core/#capability-delegation
   */
  capabilityDelegation?: Array<VerificationMethod>

  /**
   * Services are used in DID documents to express ways of communicating with the DID subject or associated entities.
   * A service can be any type of service the DID subject wants to advertise, including decentralized identity
   * management services for further discovery, authentication, authorization, or interaction.
   *
   * The value of this property MUST be a set of services, where each one is expressed using a map.
   * 
   * @see https://www.w3.org/TR/did-core/#services
   */
  service?: Array<Service>
}
