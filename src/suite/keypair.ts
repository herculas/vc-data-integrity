import { DataIntegrityError } from "../error/error.ts"
import { ErrorCode } from "../error/constants.ts"
import type { DIDURL, URI } from "../types/jsonld/literals.ts"
import type { Type } from "../types/jsonld/literals.ts"
import type { VerificationMethod } from "../types/did/method.ts"

/**
 * The keypair base class. This class is used to represent a cryptographic keypair, which is used to sign and verify
 * messages, as well as encrypt and decrypt data.
 */
export abstract class Keypair {
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
  controller?: DIDURL

  /**
   * The date and time when the keypair has been revoked. If not specified, the keypair is considered active.
   *
   * Note that this mechanism is slightly different from the DID Document key revocation, where a DID controller can
   * revoke a key from that DID by simply removing it from the DID Document.
   */
  revoked?: Date

  /**
   * The type of the cryptographic suite used by this keypair instance, which should be specified by the sub-classes.
   */
  readonly type: Type

  /**
   * Initialize a keypair instance.
   *
   * @param {string} _id The identifier of the keypair.
   * @param {Type} _type The type of the cryptosuite.
   * @param {string} [_controller] The controller of the keypair.
   * @param {Date} [_revoked] The time when the key was revoked. If not present, the key is considered active.
   */
  constructor(_type: Type, _id?: URI, _controller?: DIDURL, _revoked?: Date) {
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
  abstract initialize(_seed?: Uint8Array): void

  /**
   * Calculate the public key fingerprint, multibase + multicodec encoded. The specific fingerprint method is
   * determined by the key suite, and is often either a hash of the public key material, or the full encoded public
   * key.
   *
   * This method is frequently used to initialize the key identifier or generate some types of cryptonym DIDs.
   *
   * @returns {string} Resolve to the fingerprint.
   */
  abstract generateFingerprint(): Promise<string>

  /**
   * Verify that a provided fingerprint matches the public key material belonging to this keypair.
   *
   * @param {string} _fingerprint A public key fingerprint.
   *
   * @returns {boolean} `true` if the fingerprint matches the public key material, `false` otherwise.
   */
  abstract verifyFingerprint(_fingerprint: string): Promise<boolean>

  /**
   * Export the serialized representation of the keypair, along with other metadata which can be used to form a proof.
   *
   * @param {ExportOptions} _options Options for keypair export.
   *
   * @returns {Promise<VerificationMethod>} Resolve to a serialized keypair document.
   */
  abstract export(_options: ExportOptions): Promise<VerificationMethod>

  /**
   * Import a keypair from a serialized representation of a keypair.
   *
   * @param {VerificationMethod} _document An externally fetched controlled identifier document.
   * @param {ImportOptions} _options Options for keypair import.
   *
   * @returns {Promise<Keypair>} Resolve to a keypair instance.
   */
  static import(_document: VerificationMethod, _options: ImportOptions): Promise<Keypair> {
    throw new DataIntegrityError(
      ErrorCode.NOT_IMPLEMENTED_ERROR,
      "Keypair.import",
      "The import method is not implemented.",
    )
  }
}

/**
 * The keypair type.
 */
export type KeyFlag = "public" | "private"

/**
 * The options for exporting a keypair.
 */
export type ExportOptions = {
  type?: Type
  flag?: KeyFlag
}

/**
 * The options for importing a keypair.
 */
export type ImportOptions = {
  type?: Type
  checkContext?: boolean
  checkRevoked?: boolean
}
