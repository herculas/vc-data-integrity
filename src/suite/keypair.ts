import { BasicError, BasicErrorCode } from "../error/basic.ts"

import type { Type } from "../types/jsonld/literals.ts"
import type { URI } from "../types/jsonld/literals.ts"
import type { VerificationMethod } from "../types/data/method.ts"

import type * as KeypairOptions from "../types/api/keypair.ts"

/**
 * The keypair base class. This class is used to represent a cryptographic keypair, which is used to sign and verify
 * messages, as well as encrypt and decrypt data.
 */
export class Keypair {
  /**
   * The type of the cryptographic suite used by this keypair instance, which should be specified by the sub-classes.
   */
  static readonly type: Type

  /**
   * The identifier of this keypair. The identifier of a keypair should use the controller DID as the base, and append
   * a fragment identifier to identify the specific verification method.
   *
   * If not otherwise specified, will be hashed from the controller and the key fingerprint.
   *
   * The value of this property MUST be a string that conforms to the URL syntax with a fragment identifier.
   */
  id?: URI

  /**
   * The controller of this keypair, which should be the URI that identifies the entity that controls this keypair.
   *
   * The value of this property MUST be a string that conforms to the URL syntax.
   */
  controller?: URI

  /**
   * The date and time when the keypair is expired. If not specified, the keypair is considered active.
   *
   * Once this value is set, it is not expected to be updated, and systems depending on the value are expected to not
   * verify any proofs associated with this keypair at or after the time of expiration.
   */
  expires?: Date

  /**
   * The date and time when the keypair has been revoked. If not specified, the keypair is considered active.
   *
   * Note that this mechanism is slightly different from the DID Document key revocation, where a DID controller can
   * revoke a key from that DID by simply removing it from the DID Document.
   */
  revoked?: Date

  /**
   * Initialize a keypair instance.
   *
   * @param {Type} type The type of the cryptographic suite used by this keypair instance.
   * @param {string} [_id] The identifier of the keypair.
   * @param {string} [_controller] The controller of the keypair.
   * @param {Date} [_expires] The time when the key expires. If not present, the key is considered active.
   * @param {Date} [_revoked] The time when the key was revoked. If not present, the key is considered active.
   */
  constructor(_id?: URI, _controller?: URI, _expires?: Date, _revoked?: Date) {
    this.id = _id
    this.controller = _controller
    this.expires = _expires
    this.revoked = _revoked
  }

  /**
   * Initialize the private and public keys of the keypair using the seed provided. If no seed is provided, a random
   * seed will be used.
   *
   * @param {Uint8Array} [_seed] A seed to generate the keypair from. If not specified, a random one will be used.
   */
  initialize(_seed?: Uint8Array) {
    throw new BasicError(
      BasicErrorCode.METHOD_NOT_IMPLEMENTED_ERROR,
      "Keypair.initialize",
      "The initialize method must be implemented by a subclass.",
    )
  }

  /**
   * Calculate the public key fingerprint, multibase + multicodec encoded. The specific fingerprint method is
   * determined by the key suite, and is often either a hash of the public key material, or the full encoded public
   * key.
   *
   * This method is frequently used to initialize the key identifier or generate some types of cryptonym DIDs.
   *
   * @returns {Promise<string>} Resolve to the fingerprint.
   */
  generateFingerprint(): Promise<string> {
    throw new BasicError(
      BasicErrorCode.METHOD_NOT_IMPLEMENTED_ERROR,
      "Keypair.generateFingerprint",
      "The generateFingerprint method must be implemented by a subclass.",
    )
  }

  /**
   * Verify that a provided fingerprint matches the public key material belonging to this keypair.
   *
   * @param {string} _fingerprint A public key fingerprint.
   *
   * @returns {Promise<boolean>} `true` if the fingerprint matches the public key material, `false` otherwise.
   */
  verifyFingerprint(_fingerprint: string): Promise<boolean> {
    throw new BasicError(
      BasicErrorCode.METHOD_NOT_IMPLEMENTED_ERROR,
      "Keypair.verifyFingerprint",
      "The verifyFingerprint method must be implemented by a subclass.",
    )
  }

  /**
   * Export the serialized representation of the keypair, along with other metadata which can be used to form a proof.
   *
   * @param {KeypairOptions.Export} [_options] Options for keypair export.
   *
   * @returns {Promise<VerificationMethod>} Resolve to a verification method containing this keypair and other metadata.
   */
  export(_options?: KeypairOptions.Export): Promise<VerificationMethod> {
    throw new BasicError(
      BasicErrorCode.METHOD_NOT_IMPLEMENTED_ERROR,
      "Keypair.export",
      "The export method must be implemented by a subclass.",
    )
  }

  /**
   * Import a keypair from a controlled identifier document which contains a verification method that represents a
   * keypair of specific type.
   *
   * @param {VerificationMethod} _document An externally fetched verification method containing a serialized keypair.
   * @param {KeypairOptions.Import} [_options] Options for keypair import.
   *
   * @returns {Promise<Keypair>} Resolve to a keypair instance.
   */
  static import(_document: VerificationMethod, _options?: KeypairOptions.Import): Promise<Keypair> {
    throw new BasicError(
      BasicErrorCode.METHOD_NOT_IMPLEMENTED_ERROR,
      "Keypair::import",
      "The import method must be implemented by a subclass.",
    )
  }
}
