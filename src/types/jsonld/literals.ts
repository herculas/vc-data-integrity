/**
 * A Uniform Resource Identifier (URI) is defined as a sequence of characters chosen from a limited subset of the
 * repertoire of US-ASCII characters. The characters in URIs are frequently used for representing words of natural
 * languages.
 *
 * A URI can be further classified as a locator, a name, or both. The term "Uniform Resource Locator" (URL) refers to
 * the subset of URIs that, in addition to identifying a resource, provide a means of locating the resource by
 * describing its primary access mechanism (e.g., its network "location"). The term "Uniform Resource Name" (URN) has
 * been used historically to refer to both URIs under the "urn" scheme
 * {@link https://datatracker.ietf.org/doc/html/rfc2141 | RFC-2141}, which are required to remain globally unique and
 * persistent even when the resource ceases to exist or becomes unavailable, and to any other URI with the properties
 * of a name.
 *
 * An individual scheme does not have to be classified as being just one of "locator" or "name". Instances of URIs from
 * any given scheme may have the characteristics of locators or names or both, often depending on the persistence and
 * care in the assignment of identifiers by the naming authority, rather than on any quality of the scheme.
 *
 * The generic URI syntax consists of a hierarchical sequence of components referred to as the scheme, authority, path,
 * query, and fragment.
 *
 * ```
 * URI                = scheme ":" hier-part [ "?" query ] [ "#" fragment ]
 * scheme             = ALPHA *( ALPHA / DIGIT / "+" / "-" / "." )
 * hier-part          = "//" authority path-abempty
 *                      / path-absolute
 *                      / path-rootless
 *                      / path-empty
 * authority          = [ userinfo "@" ] host [ ":" port ]
 * userinfo           = *( unreserved / pct-encoded / sub-delims / ":" )
 * host               = IP-literal / IPv4address / reg-name
 *
 * IP-literal         = "[" ( IPv6address / IPvFuture  ) "]"
 * IPvFuture          = "v" 1*HEXDIG "." 1*( unreserved / sub-delims / ":" )
 * IPv6address        =                              6( h16 ":" ) ls32
 *                      /                       "::" 5( h16 ":" ) ls32
 *                      / [               h16 ] "::" 4( h16 ":" ) ls32
 *                      / [ *1( h16 ":" ) h16 ] "::" 3( h16 ":" ) ls32
 *                      / [ *2( h16 ":" ) h16 ] "::" 2( h16 ":" ) ls32
 *                      / [ *3( h16 ":" ) h16 ] "::"    h16 ":"   ls32
 *                      / [ *4( h16 ":" ) h16 ] "::"              ls32
 *                      / [ *5( h16 ":" ) h16 ] "::"              h16
 *                      / [ *6( h16 ":" ) h16 ] "::"
 * ls32               = ( h16 ":" h16 ) / IPv4address ; least-significant 32 bits of address
 * h16                = 1*4HEXDIG ; 16 bits of address represented in hexadecimal
 *
 * IPv4address        = dec-octet "." dec-octet "." dec-octet "." dec-octet
 * dec-octet          = DIGIT                   ; 0-9
 *                      / %x31-39 DIGIT         ; 10-99
 *                      / "1" 2DIGIT            ; 100-199
 *                      / "2" %x30-34 DIGIT     ; 200-249
 *                      / "25" %x30-35          ; 250-255
 * reg-name           = *( unreserved / pct-encoded / sub-delims )
 *
 * port               = *DIGIT
 *
 * path               = path-abempty      ; begins with "/" or is empty
 *                      / path-absolute   ; begins with "/" but not "//"
 *                      / path-noscheme   ; begins with a non-colon segment
 *                      / path-rootless   ; begins with a segment
 *                      / path-empty      ; zero characters
 * path-abempty       = *( "/" segment )
 * path-absolute      = "/" [ segment-nz *( "/" segment ) ]
 * path-noscheme      = segment-nz-nc *( "/" segment )
 * path-rootless      = segment-nz *( "/" segment )
 * path-empty         = 0<pchar>
 * segment            = *pchar
 * segment-nz         = 1*pchar
 * segment-nz-nc      = 1*( unreserved / pct-encoded / sub-delims / "@" ) ; non-zero-length segment without any ":"
 * pchar              = unreserved / pct-encoded / sub-delims / ":" / "@"
 *
 * query              = *( pchar / "/" / "?" )
 * fragment           = *( pchar / "/" / "?" )
 *
 * pct-encoded        = "%" HEXDIG HEXDIG
 * unreserved         = ALPHA / DIGIT / "-" / "." / "_" / "~"
 * reserved           = gen-delims / sub-delims
 * gen-delims         = ":" / "/" / "?" / "#" / "[" / "]" / "@"
 * sub-delims         = "!" / "$" / "&" / "'" / "(" / ")" / "*" / "+" / "," / ";" / "="
 * ```
 *
 * @see https://datatracker.ietf.org/doc/html/rfc3986
 *
 * @example "ftp://ftp.is.co.za/rfc/rfc1808.txt"
 * @example "http://www.ietf.org/rfc/rfc2396.txt"
 * @example "ldap://[2001:db8::7]/c=GB?objectClass?one"
 * @example "mailto:John.Doe@example.com"
 * @example "news:comp.infosystems.www.servers.unix"
 * @example "tel:+1-816-555-1212"
 * @example "telnet://192.0.2.16:80/"
 * @example "urn:oasis:names:specification:docbook:dtd:xml:4.1.2"
 */
export type URI = string

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
 *
 * @example "did:example:123456789abcdefghi"
 */
export type DID = URI

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
 *
 * @example "did:example:123?service=agent&relativeRef=/credentials#degree"
 * @example "did:example:123?versionTime=2021-05-10T17:00:00Z"
 * @example "did:example:123?service=files&relativeRef=/resume.pdf"
 */
export type DIDURL = URI

/**
 * A type is a string that represents a type IRI or a compact IRI.
 */
export type Type = string

/**
 * A dateTimeStamp is a string that represents a date and time in the `dateTimeStamp` format. The lexical space of
 * `dateTimeStamp` is reduced from that of `dateTime` by requiring a `timezoneFrag` fragment in the lexical
 * representations.
 *
 * @see https://www.w3.org/TR/xmlschema11-2/#dateTimeStamp
 *
 * @example "2020-01-01T19:23:24Z"
 * @example "2021-05-10T17:00:00.123Z"
 */
export type DateTime = string
