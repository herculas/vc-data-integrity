import { LDError } from "../error/error.ts"
import { LDErrorCode } from "../error/constants.ts"
import type { DIDURL } from "../types/did/keywords.ts"
import type { PlainDocument } from "../types/jsonld/document.ts"
import type { Type, URL } from "../types/jsonld/keywords.ts"
import type * as Options from "../types/interface/options.ts"
import type { VerificationResult } from "../types/interface/suite.ts"

/**
 * The keypair base class. This class is used to represent a cryptographic keypair, which is used to sign and verify
 * messages, as well as encrypt and decrypt data.
 */
export class Keypair {
  /**
   * The identifier of this keypair. If not otherwise specified, will be hashed from the controller and the key
   * fingerprint.
   */
  id?: URL

  /**
   * The controller of this keypair.
   *
   * The value of this property MUST be a string that conforms to the DID URL syntax.
   */
  controller?: DIDURL

  /**
   * The type of the cryptographic suite used by this keypair instance, which should be specified by the sub-classes.
   */
  type: Type

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
   * @param {Type} _type The type of the cryptosuite.
   * @param {string} [_controller] The controller of the keypair.
   * @param {Date} [_revoked] The time when the key was revoked. If not present, the key is considered active.
   */
  constructor(_type: Type, _id?: URL, _controller?: DIDURL, _revoked?: Date) {
    this.type = _type
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
    throw new LDError(
      LDErrorCode.NOT_IMPLEMENTED,
      "Keypair.generate",
      "This method should be implemented by sub-classes!",
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
    throw new LDError(
      LDErrorCode.NOT_IMPLEMENTED,
      "Keypair.fingerprint",
      "This method should be implemented by sub-classes!",
    )
  }

  /**
   * Verify that a provided fingerprint matches the public key material belonging to this keypair.
   *
   * @param {string} _fingerprint A public key fingerprint.
   *
   * @returns {boolean} `true` if the fingerprint matches the public key material, `false` otherwise.
   */
  verifyFingerprint(_fingerprint: string): Promise<VerificationResult> {
    throw new LDError(
      LDErrorCode.NOT_IMPLEMENTED,
      "Keypair.verifyFingerprint",
      "This method should be implemented by sub-classes!",
    )
  }

  /**
   * Export the serialized representation of the keypair, along with other metadata which can be used to form a proof.
   *
   * @param {Options.Export} _options Options for keypair export.
   *
   * @returns {Promise<PlainDocument>} Resolve to a serialized keypair document.
   */
  export(_options: Options.Export): Promise<PlainDocument> {
    throw new LDError(
      LDErrorCode.NOT_IMPLEMENTED,
      "Keypair.export",
      "This method should be implemented by sub-classes!",
    )
  }

  /**
   * Import a keypair from a serialized representation of a keypair.
   *
   * @param {PlainDocument} _document An externally fetched key document.
   * @param {Options.Import} _options Options for keypair import.
   *
   * @returns {Promise<Keypair>} Resolve to a keypair instance.
   */
  static import(_document: PlainDocument, _options: Options.Import): Promise<Keypair> {
    throw new LDError(
      LDErrorCode.NOT_IMPLEMENTED,
      "Keypair.import",
      "This method should be implemented by sub-classes!",
    )
  }
}
