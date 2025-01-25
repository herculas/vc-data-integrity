import type { DID, DIDURL } from "./keywords.ts"
import type { JWK } from "./jwk.ts"
import type { NodeObject } from "../jsonld/objects.ts"
import type { DateTime, Type } from "../jsonld/base.ts"

/**
 * A verification method is a set of data describing a cryptographic key, key pair, or other verification material that
 * can be used to authenticate or authorize a DID subject or associated parties. It can also be a reference to a
 * verification method.
 */
export type VerificationMethodRef = VerificationMethod | DIDURL

/**
 * A set of data describing a verification method, such as a cryptographic key, that can be used to authenticate or
 * authorize a interactions with a DID subject or associated parties. For example, a cryptographic public key can be
 * used as a verification method with respect to a digital signature; in such usage, it verifies that the signer could
 * use the associated cryptographic private key.
 *
 * @see https://www.w3.org/TR/did-core/#verification-methods
 * @see https://www.w3.org/TR/did-core/#verification-material
 */
export interface VerificationMethod extends NodeObject {
  /**
   * The verification method identifier can be used in a proof to refer to a specific instance of a verification method,
   * which is called the verification method definition.
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
   * The value of this property MUST be a string that references exactly one verification method type, e.g.,
   * `JsonWebKey` or `Multikey`.
   *
   * @see https://www.w3.org/TR/did-core/#dfn-verificationmethod
   */
  type: Type

  /**
   * The date and time when the verification method expire. Once the value is set, it is not expected to be updated,
   * and system depending on this value are expected to not verify any proofs associated with the verification method
   * at or after the time of expiration.
   *
   * The value of this property MUST be a dateTimeStamp string.
   */
  expires?: DateTime

  /**
   * The date and time when the verification method has been revoked. Once the value is set, it is not expected to be
   * updated, and system depending on this value are expected to not verify any proofs associated with the verification
   * method at or after the time of revocation.
   */
  revoked?: DateTime
}

/**
 * The JSON Web Key (JWK) data model is a specific type of verification method that uses the JWK specification
 * {@link https://datatracker.ietf.org/doc/html/rfc7517 | RFC-7517} to encode key types into a set of parameters.
 */
export interface VerificationMethodJwk extends VerificationMethod {
  /**
   * The `publicKeyJwk` property is used to express a public key in JSON Web Key (JWK) format.
   *
   * The value of this property MUST be a map representing a JWK that conforms
   * {@link https://datatracker.ietf.org/doc/html/rfc7517 | RFC-7517}. The public JWK MUST NOT include any members of
   * the private information class, such as `d`.
   *
   * It is RECOMMENDED that verification methods that use JWKs to represent their public keys, using the value of `kid`
   * as their fragment identifier. It is RECOMMENDED that JWK `kid` values are set to the public key thumbprint as
   * defined in {@link https://datatracker.ietf.org/doc/html/rfc7638 | RFC-7638} using the SHA-256 hash function of the
   * public key.
   *
   * @see https://www.w3.org/TR/did-core/#dfn-publickeyjwk
   * @see https://datatracker.ietf.org/doc/html/rfc7517
   * @see https://datatracker.ietf.org/doc/html/rfc7638
   */
  publicKeyJwk?: JWK

  /**
   * The `secretKeyJwk` property is used to express a private key in JSON Web Key (JWK) format.
   *
   * The value of this property MUST be a map representing a JWK that conforms
   * {@link https://datatracker.ietf.org/doc/html/rfc7517 | RFC-7517}. It MUST NOT be used if the data structure
   * containing it is public or may be revealed to parties other than the legitimate holder of the secret key.
   */
  secretKeyJwk?: JWK
}

/**
 * The Multikey data model is a specific type of verification method that encodes key types into a single binary stream
 * that is encoded as a Multibase value.
 * 
 * A Multibase value encodes a binary value as a base-encoded string. The value starts with a single character hearer,
 * which identifies the base and encoding alphabet used to encode a binary value, followed by the encoded binary value.
 * The common Multibase header values and their associated base encoding alphabets, as provided below, are normative:
 * 
 *    - `u`: The base-64-url-no-pad alphabet is used to encode the bytes. The base-alphabet consists of the following
 *           characters, in order: `A-Z`, `a-z`, `0-9`, `-`, and `_`.
 *    - `z`: The base-58-btc alphabet is used to encode the bytes. The base-alphabet consists of the following 
 *           characters, in order: `1-9`, `A-H`, `J-N`, `P-Z`, `a-k`, `m-z`.
 */
export interface VerificationMethodMultibase extends VerificationMethod {
  /**
   * A public key in multibase format. A verification method MUST NOT contain multiple verification material properties
   * for the same material. For example, expressing key material in a verification method using both `publicKeyJwk` and
   * `publicKeyMultibase` at the same time is prohibited.
   *
   * The value of this property MUST be a string representation of a multibase encoded public key. The public key values
   * are expressed using the rules in the table below:
   *
   *    - ECDSA 256-bit public key: The multikey encoding of a P-256 public key MUST start with the two-byte prefix
   *      `0x8024` (the varint expression of `0x1200`) followed by the 33-byte compressed public key data, resulting in
   *      a 35-byte value.
   *    - ECDSA 384-bit public key: The multikey encoding of a P-384 public key MUST start with the two-byte prefix
   *      `0x8124` (the varint expression of `0x1201`) followed by the 49-byte compressed public key data, resulting in
   *     a 51-byte value.
   *    - Ed25519 256-bit public key: The multikey encoding of an Ed25519 public key MUST start with the two-byte prefix
   *      `0xed01` (the varint expression of `0xed`) followed by the 32-byte public key data, resulting in a 34-byte
   *      value.
   *    - BLS12-381 381-bit public key: The multikey encoding of an BLS12-381 public key in the G2 group MUST start with
   *      the two-byte prefix `0xeb01` (the varint expression of `0xeb`) followed by the 96-byte compressed public key
   *      data, resulting in a 98-byte value.
   *    - SM2 256-bit public key: The multikey encoding of an SM2 public key MUST start with the two-byte prefix
   *      `0x8624` (the varint expression of `0x1206`) followed by the 33-byte compressed public key data, resulting in
   *      a 35-byte value.
   *
   * All of the resulting bytes MUST be encoded using the base-58-btc alphabet, and then prepended with the base-58-btc
   * multibase header `z`.
   *
   * @see https://www.w3.org/TR/did-core/#dfn-publickeymultibase
   * @see https://datatracker.ietf.org/doc/html/draft-multiformats-multibase-03
   * @see https://www.w3.org/TR/controller-document/#Multikey
   */
  publicKeyMultibase?: string

  /**
   * A private key in multibase format. Developers are advised to not accidentally publish a representation of a secret
   * key.
   *
   * The value of this property MUST be a string representation of a multibase encoded private key. The secret key
   * values are expressed using the rules in the table below:
   *
   *    - ECDSA 256-bit secret key: The multikey encoding of a P-256 secret key MUST start with the two-byte prefix
   *      `0x8626` (the varint expression of `0x1306`) followed by the 32-byte secret key data, resulting in a 34-byte
   *      value.
   *    - ECDSA 384-bit secret key: The multikey encoding of a P-384 secret key MUST start with the two-byte prefix
   *      `0x8726` (the varint expression of `0x1307`) followed by the 48-byte secret key data, resulting in a 50-byte
   *      value.
   *    - Ed25519 256-bit secret key: The multikey encoding of an Ed25519 secret key MUST start with the two-byte prefix
   *      `0x8026` (the varint expression of `0x1300`) followed by the 32-byte secret key data, resulting in a 34-byte
   *      value.
   *    - BLS12-381 381-bit secret key: The multikey encoding of an BLS12-381 secret key in the G2 group MUST start with
   *      the two-byte prefix `0x8030` (the varint expression of `0x130a`) followed by the 48-byte compressed secret key
   *      data, resulting in a 50-byte value.
   *    - SM2 256-bit secret key: The multikey encoding of an SM2 secret key MUST start with the two-byte prefix
   *      `0x9026` (the varint expression of `0x1310`) followed by the 32-byte secret key data, resulting in a 34-byte
   *      value.
   *
   * All of the resulting bytes MUST be encoded using the base-58-btc alphabet, and then prepended with the base-58-btc
   * multibase header `z`.
   */
  secretKeyMultibase?: string
}
