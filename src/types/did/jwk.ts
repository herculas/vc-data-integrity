/**
 * A JSON Web Key (JWK) is a JavaScript Object Notation (JSON) data structure that represents a cryptographic key.
 */
export interface JWK {
  /**
   * The `kty` (key type) parameter identifies the cryptographic algorithm family used with the key.
   *
   * The `kty` value is a case-sensitive string.
   */
  kty: string

  /**
   * The `use` (public key use) parameter identifies the intended use of the public key.
   * The `use` parameter is employed to indicate whether a public key is used for encrypting data or verifying the
   * signature on data.
   *
   * Values defined by this specification are:
   *    - `sig` for signature, and
   *    - `enc` for encryption.
   * Other values MAY be used.
   *
   * The `use` value is a case-sensitive string.
   */
  use?: string

  /**
   * The `key_ops` (key operations) parameter identifies the operation(s) for which the key is intended to be used.
   * The `key_ops` parameter is intended for use cases in which public, private, or symmetric keys may be present.
   *
   * Its value is an array of key operation values. Values defined by this specification are:
   *    - `sign`: compute digital signature or MAC
   *    - `verify`: verify digital signature or MAC
   *    - `encrypt`: encrypt content
   *    - `decrypt`: decrypt content and validate decryption, if applicable
   *    - `wrapKey`: encrypt key
   *    - `unwrapKey`: decrypt key and validate decryption, if applicable
   *    - `deriveKey`: derive key
   *    - `deriveBits`: derive bits not to be used as a key
   * Other values MAY be used.
   *
   * The `key_ops` values are case-sensitive strings.
   */
  key_ops?: Array<string>

  /**
   * The `alg` (algorithm) parameter identifies the algorithm intended for use with the key.
   *
   * The `alg` value is a case-sensitive ASCII string.
   */
  alg?: string

  /**
   * The `kid` (key ID) parameter is used to match a specific key.
   * This is used, for instance, to choose among a set of keys within a JWK Set during key rollover.
   * When `kid` values are used within a JWK Set, different keys within the JWK Set SHOULD use distinct `kid` values.
   *
   * The `kid` value is a case-sensitive string.
   */
  kid?: string

  /**
   * The `x5u` (X.509 URL) parameter is a URI [RFC-3986] that refers to a resource for an X.509 public key certificate
   * or certificate chain [RFC-5820].
   * The identified resource MUST provide a representation of the certificate or certificate chain that conforms to
   * [RFC-5280] in PEM encoded form.
   */
  x5u?: string

  /**
   * The `x5c` (X.509 certificate chain) parameter contains a chain of one or more PKIX certificates [RFC-5280].
   * The certificate chain is represented as a JSON array of certificate value strings.
   * Each string in the array is a base64-encoded (not base64url-encoded) DER [ITU-X690-2008] PKIX certificate value.
   */
  x5c?: Array<string>

  /**
   * The `x5t` (X.509 certificate SHA-1 thumbprint) parameter is a base64url-encoded SHA-1 thumbprint (a.k.a. digest) of
   * the DER encoding of an X.509 certificate [RFC-5280].
   */
  x5t?: string

  /**
   * The `x5t#S256` (X.509 certificate SHA-256 thumbprint) parameter is a base64url-encoded SHA-256 thumbprint (a.k.a.
   * digest) of the DER encoding of an X.509 certificate [RFC-5280].
   */
  "x5t#S256"?: string
}
