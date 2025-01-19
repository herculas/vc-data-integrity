import type { NodeObject } from "../jsonld/node.ts"
import type { OneOrMany } from "../jsonld/base.ts"
import type { Types } from "../jsonld/keywords.ts"
import type { URL } from "../jsonld/document.ts"

/**
 * Service are used to express ways of communicating with the DID subject or associated entities. A service can be any
 * type of service the DID subject wants to advertise, including decentralized identity management services for further
 * discovery, authentication, authorization, or interaction.
 *
 * @see https://www.w3.org/TR/did-core/#services
 */
export interface Service extends NodeObject {
  /**
   * The identifier of the service.
   *
   * The value of this property MUST be a URI conforming to
   * {@link https://datatracker.ietf.org/doc/html/rfc3986 | RFC-3986}. A conforming producer MUST NOT produce multiple
   * service entries with the same `id`. A conforming consumer MUST produce an error if it detects multiple service
   * entries with the same `id`.
   */
  id: URL

  /**
   * The type of service.
   *
   * The value of this property MUST be a string, or a set of strings.
   */
  type: Types

  /**
   * The service endpoint.
   *
   * The value of this property MUST be a string, a map, or a set composed of one or more strings and/or maps. All
   * string values MUST be valid URIs conforming to {@link https://datatracker.ietf.org/doc/html/rfc3986 | RFC-3986}
   * and normalized according to the rules in Section 6 of
   * {@link https://datatracker.ietf.org/doc/html/rfc3986 | RFC-3986}, and to any normalization rules in its applicable
   * URI scheme specification.
   *
   * @see https://www.w3.org/TR/did-core/#dfn-serviceendpoint
   */
  serviceEndpoint: OneOrMany<URL>
}

// FIXME: service endpoint can be a map, but we don't have a way to represent that yet
