import type { NodeObject } from "../jsonld/node.ts"
import type { Type } from "../jsonld/keywords.ts"

/**
 * A JSON Web Key (JWK) is a JavaScript Object Notation (JSON) data structure that represents a cryptographic key.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc7517
 */
export interface JWK extends NodeObject {
  /**
   * The `kty` (key type) parameter identifies the cryptographic algorithm family used with the key. `kty` values should
   * either be registered in the IANA "JSON Web Key Types" registry established by
   * {@link https://datatracker.ietf.org/doc/html/rfc7518 | RFC-7518} or be a value that
   * contains a Collision-Resistant Name.
   *
   * Values defined by this specification are:
   *    - `EC`: Elliptic Curve,
   *    - `RSA`: RSA, and
   *    - `oct`: Octet sequence (used to represent symmetric keys).
   *
   * The `kty` value is a case-sensitive string.
   *
   * @see https://datatracker.ietf.org/doc/html/rfc7517#section-4.1
   */
  kty: Type

  /**
   * The `use` (public key use) parameter identifies the intended use of the public key.
   * The `use` parameter is employed to indicate whether a public key is used for encrypting data or verifying the
   * signature on data.
   *
   * Values defined by this specification are:
   *    - `sig`: signature, and
   *    - `enc`: encryption.
   *
   * When a key is used to wrap another key and a public key use designation for the first key is desired, the `use`
   * value should be `enc`, since key wrapping is a kind of encryption. The `enc` value is also to be used for public
   * keys used for key agreement operations.
   *
   * The `use` value is a case-sensitive string.
   *
   * @see https://datatracker.ietf.org/doc/html/rfc7517#section-4.2
   */
  use?: string

  /**
   * The `key_ops` (key operations) parameter identifies the operation(s) for which the key is intended to be used.
   * The `key_ops` parameter is intended for use cases in which public, private, or symmetric keys may be present.
   *
   * Its value is an array of key operation values. Values defined by this specification are:
   *    - `sign`: compute digital signature or MAC,
   *    - `verify`: verify digital signature or MAC,
   *    - `encrypt`: encrypt content,
   *    - `decrypt`: decrypt content and validate decryption (if applicable),
   *    - `wrapKey`: encrypt key,
   *    - `unwrapKey`: decrypt key and validate decryption (if applicable),
   *    - `deriveKey`: derive key, and
   *    - `deriveBits`: derive bits not to be used as a key.
   *
   * The `key_ops` values are case-sensitive strings. Duplication of key operation values MUST NOT be present in the
   * array.
   *
   * Multiple unrelated key operations SHOULD NOT be specified for a key because of the potential vulnerabilities
   * associated with using the same key with multiple algorithms. Thus, the combination of `sign` with `verify`,
   * `encrypt` with `decrypt`, and `wrapKey` with `unwrapKey` are permitted, but other combinations SHOULD NOT be used.
   *
   * The `use` and `key_ops` JWK members SHOULD NOT be used together; however, if both are used, the information they
   * convey MUST be consistent. Applications should specify which of these members they use, if either is to be used.
   *
   * @see https://datatracker.ietf.org/doc/html/rfc7517#section-4.3
   */
  key_ops?: Array<string>

  /**
   * The `alg` (algorithm) parameter identifies the algorithm intended for use with the key.
   *
   * The `alg` value is a case-sensitive ASCII string.
   *
   * @see https://datatracker.ietf.org/doc/html/rfc7517#section-4.4
   */
  alg?: string

  /**
   * The `kid` (key ID) parameter is used to match a specific key. This is used, for instance, to choose among a set of
   * keys within a JWK Set during key rollover.
   *
   * The structure of the `kid` value is unspecified. When `kid` values are used within a JWK Set, different keys within
   * the JWK Set SHOULD use distinct `kid` values. One exception in which different keys might use the same `kid` value
   * is if they have different `kty` values but are considered to be equivalent alternatives by the application using
   * them.
   *
   * The `kid` value is a case-sensitive string.
   *
   * When used with JWS or JWE, the `kid` value should match a JWS or JWE `kid` Header Parameter value.
   *
   * @see https://datatracker.ietf.org/doc/html/rfc7517#section-4.5
   */
  kid?: string

  /**
   * The `x5u` (X.509 URL) parameter is a URI ({@link https://datatracker.ietf.org/doc/html/rfc3986 | RFC-3986}) that
   * refers to a resource for an X.509 public key certificate or certificate chain
   * ({@link https://datatracker.ietf.org/doc/html/rfc5280 | RFC-5280}).
   *
   * The identified resource MUST provide a representation of the certificate or certificate chain that conforms to
   * ({@link https://datatracker.ietf.org/doc/html/rfc5280 | RFC-5280}) in PEM-encoded form, with each certificate
   * delimited as specified in Section 6.1 of ({@link https://datatracker.ietf.org/doc/html/rfc4945 | RFC-4945}). The
   * key in the first certificate MUST match the public key represented by other members of the JWK.
   *
   * The protocol used to acquire the resource MUST provide integrity protection; an HTTP GET request to retrieve the
   * certificate MUST use TLS. The identity of the server MUST be validated, as per Section 6 of
   * ({@link https://datatracker.ietf.org/doc/html/rfc6125 | RFC-6125}).
   *
   * @see https://datatracker.ietf.org/doc/html/rfc7517#section-4.6
   */
  x5u?: string

  /**
   * The `x5c` (X.509 certificate chain) parameter contains a chain of one or more PKIX certificates
   * ({@link https://datatracker.ietf.org/doc/html/rfc5280 | RFC-5280}). The certificate chain is represented as a JSON
   * array of certificate value strings. Each string in the array is a base64-encoded
   * ({@link https://datatracker.ietf.org/doc/html/rfc4648 | RFC-4648}) DER PKIX certificate value.
   *
   * The PKIX certificate containing the key value MUST be the first certificate. This MAY be followed by additional
   * certificates, with each subsequent certificate being the one used to certify the previous one. The key in the first
   * certificate MUST match the public key represented by other members of the JWK.
   *
   * @see https://datatracker.ietf.org/doc/html/rfc7517#section-4.7
   */
  x5c?: Array<string>

  /**
   * The `x5t` (X.509 certificate SHA-1 thumbprint) parameter is a base64url-encoded SHA-1 thumbprint (a.k.a. digest) of
   * the DER encoding of an X.509 certificate ({@link https://datatracker.ietf.org/doc/html/rfc5280 | RFC-5280}).
   *
   * Note that certificate thumbprints are also sometimes known as certificate fingerprints. The key in the certificate
   * MUST match the public key represented by other members of the JWK.
   *
   * @see https://datatracker.ietf.org/doc/html/rfc7517#section-4.8
   */
  x5t?: string

  /**
   * The `x5t#S256` (X.509 certificate SHA-256 thumbprint) parameter is a base64url-encoded SHA-256 thumbprint (a.k.a.
   * digest) of the DER encoding of an X.509 certificate
   * ({@link https://datatracker.ietf.org/doc/html/rfc5280 | RFC-5280}).
   *
   * Note that certificate thumbprints are also sometimes known as certificate fingerprints. The key in the certificate
   * MUST match the public key represented by other members of the JWK.
   *
   * @see https://datatracker.ietf.org/doc/html/rfc7517#section-4.9
   */
  "x5t#S256"?: string
}

/**
 * A JWK Set is a JSON object that represents a set of JWKs. The JSON object MUST have a `keys` member, which is an
 * array of JWKs.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc7517#section-5
 */
export interface JWKSet extends NodeObject {
  /**
   * The `keys` parameter is an array of JWKs. By default, the order of the JWK values within the array does not imply
   * an order of preference among them, although applications of JWK Sets can choose to assign a meaning to the order
   * for their purposes, if desired.
   */
  keys: Array<JWK>
}

/**
 * An Elliptic Curve JWK (JWKEC) is a JWK that represents an Elliptic Curve key. When use this type of the JWK, the
 * `kty` member MUST have the value `EC`.
 *
 * An Elliptic Curve public key is represented by a pair of coordinates drawn from a finite field, which together
 * define a point on an elliptic curve.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc7518#section-6.2
 */
export interface JWKEC extends JWK {
  kty: "EC"
  /**
   * The `crv` (curve) parameter identifies the cryptographic curve used with the key.
   *
   * Values defined by this specification are:
   *    - `P-256`: NIST P-256 curve,
   *    - `P-384`: NIST P-384 curve, and
   *    - `P-521`: NIST P-521 curve.
   * Additional `crv` values can be registered by other specifications.
   *
   * The `crv` value is a case-sensitive string.
   *
   * @see https://datatracker.ietf.org/doc/html/rfc7518#section-6.2.1.1
   */
  crv: string

  /**
   * The `x` (x coordinate) parameter contains the x coordinate for the Elliptic Curve point. It is represented as the
   * base64url encoding of the octet string representation of the coordinate, as defined in Section 2.3.5 of
   * {@link https://www.secg.org/sec1-v2.pdf | SEC1: Elliptic Curve Cryptography}. The length of this octet string MUST
   * be the full size of a coordinate for the curve specified in the `crv` parameter. For example, if the value of `crv`
   * is `P-521`, the octet string must be 66 octets long.
   *
   * @see https://datatracker.ietf.org/doc/html/rfc7518#section-6.2.1.2
   */
  x: string

  /**
   * The `y` (y coordinate) parameter contains the y coordinate for the Elliptic Curve point. It is represented as the
   * base64url encoding of the octet string representation of the coordinate, as defined in Section 2.3.5 of
   * {@link https://www.secg.org/sec1-v2.pdf | SEC1: Elliptic Curve Cryptography}. The length of this octet string MUST
   * be the full size of a coordinate for the curve specified in the `crv` parameter. For example, if the value of `crv`
   * is `P-521`, the octet string must be 66 octets long.
   *
   * @see https://datatracker.ietf.org/doc/html/rfc7518#section-6.2.1.3
   */
  y: string

  /**
   * The `d` (ECC private key) parameter contains the Elliptic Curve private key value. It is represented as the
   * base64url encoding of the octet string representation of the key, as defined in Section 2.3.7 of
   * {@link https://www.secg.org/sec1-v2.pdf | SEC1: Elliptic Curve Cryptography}. The length of this octet string MUST
   * be `ceiling(log-base-2(n)/8)` octets (where `n` is the order of the curve).
   *
   * @see https://datatracker.ietf.org/doc/html/rfc7518#section-6.2.2.1
   */
  d?: string
}

/**
 * An RSA JWK (JWKRSA) is a JWK that represents an RSA key. When use this type of the JWK, the `kty` member MUST have
 * the value `RSA`.
 *
 * The semantic of the parameters defined in this interface are the same as those defined in Section 3.1 and 3.2 of
 * {@link https://datatracker.ietf.org/doc/html/rfc3447 | RFC-3447}.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc7518#section-6.3
 * @see https://datatracker.ietf.org/doc/html/rfc3447#section-3.1
 * @see https://datatracker.ietf.org/doc/html/rfc3447#section-3.2
 */
export interface JWKRSA extends JWK {
  kty: "RSA"
  /**
   * The `n` (modulus) parameter contains the modulus value for the RSA public key. It is represented as a
   * Base64urlUInt-encoded value.
   *
   * Note that implementers have found that some cryptographic libraries prefix an extra zero-valued octet to the
   * modulus representations they return, for instance, returning 257 octets for a 2048-bit key, rather than 256.
   * Implementations using such libraries will need to take care to omit this extra octet from the base64url-encoded
   * representation.
   *
   * @see https://datatracker.ietf.org/doc/html/rfc7518#section-6.3.1.1
   */
  n: string

  /**
   * The `e` (exponent) parameter contains the exponent value for the RSA public key. It is represented as a
   * Base64urlUInt-encoded value.
   *
   * For instance, when representing the value 65537, the octet sequence to be base64url-encoded MUST consist of the
   * three octets [0x01, 0x00, 0x01]; the resulting representation for this value is "AQAB".
   *
   * @see https://datatracker.ietf.org/doc/html/rfc7518#section-6.3.1.2
   */
  e: string

  /**
   * The `d` (private exponent) parameter contains the private exponent value for the RSA private key.
   *
   * It is represented as a Base64urlUInt-encoded value.
   *
   * The parameter `d` is REQUIRED for RSA private keys.
   *
   * @see https://datatracker.ietf.org/doc/html/rfc7518#section-6.3.2.1
   */
  d?: string

  /**
   * The `p` (first prime factor) parameter contains the first prime factor for the RSA private key.
   *
   * It is represented as a Base64urlUInt-encoded value.
   *
   * This parameter enable optimization of RSA private key operations, and SHOULD be included by producers of JWKs
   * representing RSA private keys. If the producer includes the `p` parameter, then it MUST also include the `q`,
   * `dp`, `dq`, and `qi` parameters.
   *
   * @see https://datatracker.ietf.org/doc/html/rfc7518#section-6.3.2.2
   */
  p?: string

  /**
   * The `q` (second prime factor) parameter contains the second prime factor for the RSA private key.
   *
   * It is represented as a Base64urlUInt-encoded value.
   *
   * This parameter enable optimization of RSA private key operations, and SHOULD be included by producers of JWKs
   * representing RSA private keys. If the producer includes the `q` parameter, then it MUST also include the `p`,
   * `dp`, `dq`, and `qi` parameters.
   *
   * @see https://datatracker.ietf.org/doc/html/rfc7518#section-6.3.2.3
   */
  q?: string

  /**
   * The `dp` (first factor CRT exponent) parameter contains the Chinese Remainder Theorem (CRT) exponent of the first
   * factor.
   *
   * It is represented as a Base64urlUInt-encoded value.
   *
   * This parameter enable optimization of RSA private key operations, and SHOULD be included by producers of JWKs
   * representing RSA private keys. If the producer includes the `dp` parameter, then it MUST also include the `p`,
   * `q`, `dq`, and `qi` parameters.
   *
   * @see https://datatracker.ietf.org/doc/html/rfc7518#section-6.3.2.4
   */
  dp?: string

  /**
   * The `dq` (second factor CRT exponent) parameter contains the Chinese Remainder Theorem (CRT) exponent of the second
   * factor.
   *
   * It is represented as a Base64urlUInt-encoded value.
   *
   * This parameter enable optimization of RSA private key operations, and SHOULD be included by producers of JWKs
   * representing RSA private keys. If the producer includes the `dq` parameter, then it MUST also include the `p`,
   * `q`, `dp`, and `qi` parameters.
   *
   * @see https://datatracker.ietf.org/doc/html/rfc7518#section-6.3.2.5
   */
  dq?: string

  /**
   * The `qi` (first CRT coefficient) parameter contains the Chinese Remainder Theorem (CRT) coefficient of the second
   * factor.
   *
   * It is represented as a Base64urlUInt-encoded value.
   *
   * This parameter enable optimization of RSA private key operations, and SHOULD be included by producers of JWKs
   * representing RSA private keys. If the producer includes the `qi` parameter, then it MUST also include the `p`,
   * `q`, `dp`, and `dq` parameters.
   *
   * @see https://datatracker.ietf.org/doc/html/rfc7518#section-6.3.2.6
   */
  qi?: string

  /**
   * The `oth` (other primes info) parameter contains an array of information about any third and subsequent primes,
   * should they exist.
   *
   * When only two primes have been used (the normal case), the `oth` parameter MUST be omitted. When three or more
   * primes have been used, the number of array elements MUST be the number of primes used minus two. If the consumer of
   * a JWK does not support private keys with more than two primes and it encounters a private key that includes the
   * `oth` parameter, then it MUST NOT use the key.
   *
   * @see https://datatracker.ietf.org/doc/html/rfc7518#section-6.3.2.7
   */
  oth?: Array<OtherPrimeInfo>
}

/**
 * This structure contains the information for the additional primes `r_3, ..., r_u` in order. When three or more primes
 * have been used in a RSA private key, the following primes should be included in the `oth` parameter of that key. For
 * more information on this case, see the description of the `OtherPrimeInfo` parameters in Appendix A.1.2 of
 * {@link https://datatracker.ietf.org/doc/html/rfc3447 | RFC-3447}.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc3447#appendix-A.1.2
 * @see https://datatracker.ietf.org/doc/html/rfc7518#section-6.3.2.7
 */
export interface OtherPrimeInfo extends NodeObject {
  /**
   * The `r` (prime factor) parameter represents the value of a subsequent prime factor.
   *
   * It is represented as a Base64urlUInt-encoded value.
   *
   * @see https://datatracker.ietf.org/doc/html/rfc7518#section-6.3.2.7.1
   */
  r: string

  /**
   * The `d` (factor CRT exponent) parameter represents the CRT exponent of the corresponding prime factor.
   *
   * It is represented as a Base64urlUInt-encoded value.
   *
   * @see https://datatracker.ietf.org/doc/html/rfc7518#section-6.3.2.7.2
   */
  d: string

  /**
   * The `t` (factor CRT coefficient) parameter represents the CRT coefficient of the corresponding prime factor.
   *
   * It is represented as a Base64urlUInt-encoded value.
   *
   * @see https://datatracker.ietf.org/doc/html/rfc7518#section-6.3.2.7.3
   */
  t: string
}

/**
 * An Octet Sequence JWK (JWKOct) is a JWK that represents a symmetric key. When use this type of the JWK, the `kty`
 * member MUST have the value `oct`. An `alg` member SHOULD also be present in the JWK to identify the algorithm
 * intended to be used with the key, unless the application use another means or convention to determine the algorithm
 * used.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc7518#section-6.4
 */
export interface JWKOct extends JWK {
  kty: "oct"
  /**
   * The `k` (key value) parameter contains the value of the symmetric (or other single-valued) key.
   *
   * It is represented as the base64url encoding of the octet sequence containing the key value.
   */
  k: string
}
