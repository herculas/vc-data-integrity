import type { URL } from "../jsonld/document.ts"

/**
 * A decentralized identifier (DID) is a globally unique persistent identifier that does not require a centralized
 * registration authority, and is often generated and/or registered cryptographically. Many--but not all--DID methods
 * makes use of distributed ledger technology (DLT) or some other form of decentralized network.
 *
 * A DID scheme defines the formal syntax of a DID. The generic DID scheme begins with the prefix `did:`. A specific DID
 * scheme is defined in a DID method specification.
 *
 * A DID method is a definition of how a specific DID scheme is implemented. A DID method is defined by a DID method
 * specification, which specifies the precise operations by which DIDs and DID documents are created, resolved, updated,
 * and deactivated. In a specific DID method scheme, the DID method name follows the first colon and terminates with the
 * second colon, e.g., `did:method-name:`.
 *
 * The generic DID scheme is a URI scheme conformant with
 * {@link https://datatracker.ietf.org/doc/html/rfc3986 | RFC-3986}. The ABNF definition can be found below, which uses
 * the syntax in {@link https://datatracker.ietf.org/doc/html/rfc5234 | RFC-5234} and the corresponding definitions for
 * `ALPHA` and `DIGIT`. All other rule names not defined in the ABNF below are defined in
 * {@link https://datatracker.ietf.org/doc/html/rfc3986 | RFC-3986}.
 * 
 * All DIDs MUST conform to the DID Syntax ABNF Rules defined below:
 *
 * ```
 * did                = "did:" method-name ":" method-specific-id
 * method-name        = 1*method-char
 * method-char        = %x61-7A / DIGIT
 * method-specific-id = *( *idchar ":" ) 1*idchar
 * idchar             = ALPHA / DIGIT / "." / "-" / "_" / pct-encoded
 * pct-encoded        = "%" HEXDIG HEXDIG
 * ```
 *
 * @see https://www.w3.org/TR/did-core
 * @see https://www.w3.org/TR/did-core/#did-syntax
 * @see https://www.w3.org/TR/did-core/#dfn-decentralized-identifiers
 * @see https://www.w3.org/TR/did-core/#dfn-did-schemes
 * @see https://www.w3.org/TR/did-core/#dfn-did-methods
 */
export type DID = URL

/**
 * A DID URL is a network location identifier for a specific resource. It can be used to retrieve things like 
 * representations of DID subjects, verification methods, services, specific parts of a DID document, or other 
 * resources.
 * 
 * The following is the ABNF definition of a DID URL, which uses the syntax in 
 * {@link https://datatracker.ietf.org/doc/html/rfc5234 | RFC-5234}. It builds on the `did` syntax. The `path-abempty`,
 * `query`, and `fragment` components are defined in {@link https://datatracker.ietf.org/doc/html/rfc3986 | RFC-3986}.
 * 
 * All DID URLs MUST conform to the DID URL Syntax ABNF Rules defined below:
 * 
 * ```
 * did-url = did path-abempty [ "?" query ] [ "#" fragment ]
 * ```
 * 
 * @see https://www.w3.org/TR/did-core
 * @see https://www.w3.org/TR/did-core/#did-url-syntax
 */
export type DIDURL = URL
