import type { OneOrMany } from "../jsonld/base.ts"
import type { Context, URL } from "../jsonld/keywords.ts"
import type { DID } from "./keywords.ts"
import type { MethodMap, VerificationMethod } from "./method.ts"
import type { Service } from "./service.ts"

/**
 * A set od data describing a DID subject, including mechanisms, such as cryptographic keys, that the DID subject or a
 * DID delegate can use to authenticate itself and prove its association with the DID.
 *
 * @see https://www.w3.org/TR/did-core/#did-document-properties
 * @see https://www.w3.org/TR/did-core/#did-documents
 * @see https://www.w3.org/TR/did-core/#did-subject
 * 
 * @property {Array<VerificationMethod>} [verificationMethod] A set of verification method objects.
 * @property {Array<MethodMap>} [authentication] A set of either verification method objects or strings that conform to the DID syntax.
 * @property {Array<MethodMap>} [assertionMethod] A set of either verification method objects or strings that conform to the DID syntax.
 * @property {Array<MethodMap>} [keyAgreement] A set of either verification method objects or strings that conform to the DID syntax.
 * @property {Array<MethodMap>} [capabilityInvocation] A set of either verification method objects or strings that conform to the DID syntax.
 * @property {Array<MethodMap>} [capabilityDelegation] A set of either verification method objects or strings that conform to the DID syntax.
 * @property {Array<Service>} [service] A set of service endpoint objects.
 */
export interface DIDDocument {
  /**
   * A JSON-LD context definition.
   */
  "@context"?: Context

  /**
   * The DID for a particular DID subject.
   * 
   * The value of this property MUST be a string that conforms to the DID syntax.
   */
  id: DID

  /**
   * A DID subject can have multiple identifiers for different purposes, or at different times.
   * The assertion that two or more DIDs (or other types of URIs) refer to the same DID subject can be made using this property.
   * 
   * The value of this property MUST be an set of strings that conform to the URL syntax.
   */
  alsoKnownAs?: Array<URL>

  /**
   * An entity that is authorized to make changes to this DID document.
   * 
   * The value of this property MUST be a string, or a set of strings, that conforms to the DID syntax.
   */
  controller?: OneOrMany<DID>

  /**
   * A DID document can express verification methods, such as cryptographic public keys, which can be used to 
   * authenticate or authorize interactions with the DID subject or associated parties.
   * 
   * The value of this property MUST be an set of verification methods, where each one is expressed using a map.
   */
  verificationMethod?: Array<VerificationMethod>
  authentication?: Array<MethodMap>
  assertionMethod?: Array<MethodMap>
  keyAgreement?: Array<MethodMap>
  capabilityInvocation?: Array<MethodMap>
  capabilityDelegation?: Array<MethodMap>
  service?: Array<Service>
}
