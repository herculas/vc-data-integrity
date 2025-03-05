import type { IRI } from "../serialize/base.ts"
import type { JsonLdObject, OneOrMany } from "../serialize/document.ts"
import type { VerificationMethod, VerificationRelationship } from "./method.ts"

/**
 * A controlled identifier document describing a DID subject, including mechanisms, such as cryptographic keys, that the
 * DID subject or a DID delegate can use to authenticate itself and prove its association with the DID.

 * A controlled identifier document specifies one or more relationships between an identifier and a set of verification
 * methods and/or service endpoints. The controlled identifier document SHOULD contain verification relationships that
 * explicitly permit the use of certain verification methods for specific purposes.
 *
 * @see https://www.w3.org/TR/controller-document
 * @see https://www.w3.org/TR/did-core/#did-document-properties
 * @see https://www.w3.org/TR/did-core/#did-documents
 * @see https://www.w3.org/TR/did-core/#did-subject
 */
export interface CIDDocument extends JsonLdObject {
  /**
   * The basic identifier for the controlled identifier document.
   *
   * The value of this property MUST be a string that conforms to the DID syntax.
   *
   * @see https://www.w3.org/TR/did-core/#did-subject
   *
   * @example "did:example:123456789abcdefghijk"
   * @example "https://controller.example"
   */
  id: IRI

  /**
   * A subject can have multiple identifiers that are used for different purposes or at different times. The assertion
   * that two or more identifiers refer to the same subject can be made using the `alsoKnownAs` property.
   *
   * The value of this property MUST be an set of strings that conform to the URL syntax.
   *
   * @see https://www.w3.org/TR/did-core/#also-known-as
   *
   * @example
   * ```json
   * [
   *    "https://someOtherIdentifier.example/xyz",
   *    "https://yetAnotherIdentifier.example/987"
   * ]
   */
  alsoKnownAs?: Array<IRI>

  /**
   * An entity that is authorized to make changes to this document. Whoever can update the content of the resource
   * returned from dereferencing the controller document's canonical URL is, by definition, a controller of the document
   * and its canonical identifier. Proofs that satisfy a controlled identifier document's verification methods are taken
   * as cryptographic assurance that the controller of the identifier created those proofs.
   *
   * The value of this property MUST be a string, or a set of strings, that conforms to the DID syntax.
   *
   * @see https://www.w3.org/TR/did-core/#did-controller
   *
   * @example "did:example:bcehfew7h32f32h7af3"
   * @example "https://controllerB.example/abc"
   */
  controller?: OneOrMany<IRI>

  /**
   * A DID document can express verification methods, such as cryptographic public keys, which can be used to
   * authenticate or authorize interactions with the DID subject or associated parties.
   *
   * The value of this property MUST be an set of verification methods, where each one is expressed using a map.
   *
   * @see https://www.w3.org/TR/did-core/#verification-methods
   *
   * @example
   * ```json
   * [{
   *    "id": "https://controller.example#authn-key-123",
   *    "type": "Multikey",
   *    "controller": "https://controller.example",
   *    "expires": "2025-12-01T00:00:00Z",
   *    "publicKeyMultibase": "z6MkmM42vxfqZQsv4ehtTjFFxQ4sQKS2w6WR7emozFAn5cxu"
   * }, {
   *    "id": "https://controller.example/101#key-20240828",
   *    "type": "JsonWebKey",
   *    "controller": "https://controller.example/101",
   *    "revoked": "2024-12-10T15:28:32Z",
   *    "publicKeyJwk": {
   *        "kid": "key-20240828",
   *        "kty": "EC",
   *        "crv": "P-256",
   *        "alg": "ES256",
   *        "x": "f83OJ3D2xF1Bg8vub9tLe1gHMzV76e8Tus9uPHvRVEU",
   *        "y": "x_FEzRu9m36HLN_tue659LNpXW6pCyStikYjKIWI5a0"
   * }]
   * ```
   */
  verificationMethod?: Array<VerificationMethod>

  /**
   * The authentication property is used to specify how the DID subject is expected to be authenticated, for purposes
   * such as logging into a website or engaging in any sort of challenge-response protocol.
   *
   * The value of this property MUST be a set of one or more verification methods. Each verification method MAY be
   * embedded directly or referenced by DID URL.
   *
   * @see https://www.w3.org/TR/did-core/#authentication
   *
   * @example
   * ```json
   * [
   *    "did:example:123456789abcdefghi#keys-1",
   *    {
   *        "id": "did:example:123456789abcdefghi#keys-2",
   *        "type": "Ed25519VerificationKey2020",
   *        "controller": "did:example:123456789abcdefghi",
   *        "publicKeyMultibase": "zH3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV"
   *    }
   * ]
   * ```
   */
  authentication?: Array<VerificationRelationship>

  /**
   * The assertionMethod property is used to specify how the DID subject is expected to express claims, such as
   * purposes of issuing a Verifiable Credential.
   *
   * The value of this property MUST be a set of one or more verification methods. Each verification method MAY be
   * embedded directly or referenced by DID URL.
   *
   * @see https://www.w3.org/TR/did-core/#assertion
   *
   * @example
   * ```json
   * [
   *    "did:example:123456789abcdefghi#keys-1",
   *    {
   *        "id": "did:example:123456789abcdefghi#keys-2",
   *        "type": "Ed25519VerificationKey2020",
   *        "controller": "did:example:123456789abcdefghi",
   *        "publicKeyMultibase": "zH3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV"
   *    }
   * ]
   * ```
   */
  assertionMethod?: Array<VerificationRelationship>

  /**
   * The keyAgreement property is used to specify how an entity can generate encryption material in order to transmit
   * confidential information intended for the DID subject, such as for the purpose of establishing a secure
   * communication channel with the recipient.
   *
   * The value of this property MUST be a set of one or more verification methods. Each verification method MAY be
   * embedded directly or referenced by DID URL.
   *
   * @see https://www.w3.org/TR/did-core/#key-agreement
   *
   * @example
   * ```json
   * [
   *    "did:example:123456789abcdefghi#keys-1",
   *    {
   *        "id": "did:example:123#zC9ByQ8aJs8vrNXyDhPHHNNMSHPcaSgNpjjsBYpMMjsTdS",
   *        "type": "X25519KeyAgreementKey2019",
   *        "controller": "did:example:123",
   *        "publicKeyMultibase": "z9hFgmPVfmBZwRvFEyniQDBkz9LmV7gDEqytWyGZLmDXE"
   *    }
   * ]
   * ```
   */
  keyAgreement?: Array<VerificationRelationship>

  /**
   * The capabilityInvocation property is used to specify a verification method that might be used by the DID subject
   * to invoke a cryptographic capability, such as the authorization to update the DID document.
   *
   * The value of this property MUST be a set of one or more verification methods. Each verification method MAY be
   * embedded directly or referenced by DID URL.
   *
   * @see https://www.w3.org/TR/did-core/#capability-invocation
   *
   * @example
   * ```json
   * [
   *    "did:example:123456789abcdefghi#keys-1",
   *    {
   *        "id": "did:example:123456789abcdefghi#keys-2",
   *        "type": "Ed25519VerificationKey2020",
   *        "controller": "did:example:123456789abcdefghi",
   *        "publicKeyMultibase": "zH3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV"
   *    }
   * ]
   * ```
   */
  capabilityInvocation?: Array<VerificationRelationship>

  /**
   * The capabilityDelegation property is used to specify a mechanism that might be used by the DID subject to delegate
   * a cryptographic capability to another party, such as delegating the authority to access a specific HTTP API to a
   * subroutine.
   *
   * The value of this property MUST be a set of one or more verification methods. Each verification method MAY be
   * embedded directly or referenced by DID URL.
   *
   * @see https://www.w3.org/TR/did-core/#capability-delegation
   *
   * @example
   * ```json
   * [
   *    "did:example:123456789abcdefghi#keys-1",
   *    {
   *        "id": "did:example:123456789abcdefghi#keys-2",
   *        "type": "Ed25519VerificationKey2020",
   *        "controller": "did:example:123456789abcdefghi",
   *        "publicKeyMultibase": "zH3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV"
   *    }
   * ]
   * ```
   */
  capabilityDelegation?: Array<VerificationRelationship>

  /**
   * Services are used in DID documents to express ways of communicating with the DID subject or associated entities.
   * A service can be any type of service the DID subject wants to advertise, including decentralized identity
   * management services for further discovery, authentication, authorization, or interaction.
   *
   * The value of this property MUST be a set of services, where each one is expressed using a map.
   *
   * @see https://www.w3.org/TR/did-core/#services
   *
   * @example
   * ```json
   * [{
   *    "id": "did:example:123#linked-domain",
   *    "type": "LinkedDomains",
   *    "serviceEndpoint": "https://bar.example.com"
   * }]
   * ```
   */
  service?: Array<Service>
}

/**
 * Service are used to express ways of communicating with the DID subject or associated entities. A service can be any
 * type of service the DID subject wants to advertise, including decentralized identity management services for further
 * discovery, authentication, authorization, or interaction.
 *
 * @see https://www.w3.org/TR/did-core/#services
 */
export interface Service extends JsonLdObject {
  /**
   * The identifier of the service.
   *
   * The value of this property MUST be a URI conforming to [RFC-3986]. A conforming producer MUST NOT produce multiple
   * service entries with the same `id`. A conforming consumer MUST produce an error if it detects multiple service
   * entries with the same `id`.
   *
   * @see https://datatracker.ietf.org/doc/html/rfc3986
   */
  id: IRI

  /**
   * The type of service.
   *
   * The value of this property MUST be a string, or a set of strings.
   */
  type: OneOrMany<string>

  /**
   * The service endpoint.
   *
   * The value of this property MUST be a string, a map, or a set composed of one or more strings and/or maps. All
   * string values MUST be valid URIs conforming to [RFC-3986] and normalized according to the rules in Section 6 of
   * [RFC-3986], and to any normalization rules in its applicable URI scheme specification.
   *
   * @see https://www.w3.org/TR/did-core/#dfn-serviceendpoint
   * @see https://datatracker.ietf.org/doc/html/rfc3986
   */
  serviceEndpoint: OneOrMany<IRI>
}
