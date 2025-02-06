import { DataIntegrityError } from "../error/error.ts"
import { ErrorCode } from "../error/code.ts"

import type { CIDDocument } from "../types/data/cid.ts"
import type { Type } from "../types/jsonld/literals.ts"
import type { URI } from "../types/jsonld/literals.ts"

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
   * The identifier of this keypair. If not otherwise specified, will be hashed from the controller and the key
   * fingerprint.
   */
  id?: URI

  /**
   * The controller of this keypair.
   *
   * The value of this property MUST be a string that conforms to the DID URL syntax.
   */
  controller?: URI

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
   * @param {string} _id The identifier of the keypair.
   * @param {string} [_controller] The controller of the keypair.
   * @param {Date} [_revoked] The time when the key was revoked. If not present, the key is considered active.
   */
  constructor(_id?: URI, _controller?: URI, _revoked?: Date) {
    this.id = _id
    this.controller = _controller
    this.revoked = _revoked
  }

  /**
   * Initialize the private and public keys of the keypair using the seed provided. If no seed is provided, a random
   * seed will be used.
   *
   * @param {Uint8Array} [_seed] A seed to generate the keypair from. If not specified, a random one will be used.
   */
  initialize(_seed?: Uint8Array) {
    throw new DataIntegrityError(
      ErrorCode.NOT_IMPLEMENTED_ERROR,
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
   * @returns {string} Resolve to the fingerprint.
   */
  generateFingerprint(): Promise<string> {
    throw new DataIntegrityError(
      ErrorCode.NOT_IMPLEMENTED_ERROR,
      "Keypair.generateFingerprint",
      "The generateFingerprint method must be implemented by a subclass.",
    )
  }

  /**
   * Verify that a provided fingerprint matches the public key material belonging to this keypair.
   *
   * @param {string} _fingerprint A public key fingerprint.
   *
   * @returns {boolean} `true` if the fingerprint matches the public key material, `false` otherwise.
   */
  verifyFingerprint(_fingerprint: string): Promise<boolean> {
    throw new DataIntegrityError(
      ErrorCode.NOT_IMPLEMENTED_ERROR,
      "Keypair.verifyFingerprint",
      "The verifyFingerprint method must be implemented by a subclass.",
    )
  }

  /**
   * Export the serialized representation of the keypair, along with other metadata which can be used to form a proof.
   *
   * @param {ExportOptions} _options Options for keypair export.
   *
   * @returns {Promise<CIDDocument>} Resolve to a controlled identifier document containing the verification method.
   */
  export(_options: KeypairOptions.Export): Promise<CIDDocument> {
    throw new DataIntegrityError(
      ErrorCode.NOT_IMPLEMENTED_ERROR,
      "Keypair.export",
      "The export method must be implemented by a subclass.",
    )
  }

  /**
   * Import a keypair from a serialized representation of a keypair.
   *
   * @param {CIDDocument} _document An externally fetched controlled identifier document.
   * @param {ImportOptions} _options Options for keypair import.
   *
   * @returns {Promise<Keypair>} Resolve to a keypair instance.
   */
  static import(_document: CIDDocument, _options: KeypairOptions.Import): Promise<Keypair> {
    throw new DataIntegrityError(
      ErrorCode.NOT_IMPLEMENTED_ERROR,
      "Keypair.import",
      "The import method is not implemented.",
    )
  }
}
