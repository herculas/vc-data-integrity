import type { OneOrMany } from "../jsonld/base.ts"
import type { Type, URL } from "../jsonld/keywords.ts"

/**
 * Service are used to express ways of communicating with the DID subject or associated entities.
 */
export interface Service {
  /**
   * The identifier of the service.
   *
   * The value of this property MUST be a string that conforms to the URL syntax [RFC-3986].
   */
  id: URL

  /**
   * The type of service.
   *
   * The value of this property MUST be a string, or a set of strings.
   */
  type: Type

  /**
   * The service endpoint.
   *
   * The value of this property MUST be a string, a map, or a set composed of one or more strings and/or maps. All
   * string values MUST be valid URIs conforming to [RFC-3986].
   */
  serviceEndpoint: OneOrMany<URL>
}

// TODO: service endpoint can be a map, but we don't have a way to represent that yet
