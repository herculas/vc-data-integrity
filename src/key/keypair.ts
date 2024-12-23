import type { DIDURL } from "../types/did/keywords.ts"
import type { PlainDocument } from "../types/jsonld/document.ts"
import type { Type, URL } from "../types/jsonld/keywords.ts"

/**
 * The keypair base class.
 * This class should be extended by specific key types.
 */
export class Keypair {
  id?: URL
  controller?: DIDURL
  type: Type
  revoked?: Date

  /**
   * Generate a keypair instance.
   *
   * @param {string} _id The identifier of the key, typically hashed from the controller URL and the key fingerprint.
   * @param {string} _controller The controller of the key, typically a URL of the entity controlling the key.
   * @param {Type} _type The type of the key.
   * @param {Date} _revoked The time when the key was revoked in RFC3339 format. If not present, the key is considered
   * active.
   */
  constructor(_type: Type, _id?: URL, _controller?: DIDURL, _revoked?: Date) {
    this.type = _type
    this.id = _id
    this.controller = _controller
    this.revoked = _revoked
  }

  /**
   * Generate a keypair instance from a provided seed.
   *
   * @param {Uint8Array} _seed A seed to generate the keypair from. If not provided, a random seed will be used.
   */
  generate(_seed?: Uint8Array) {
    throw new Error("Method not implemented.")
  }

  /**
   * Calculate the public key fingerprint, multibase + multicodec encoded. The specific fingerprint method is
   * determined by the key suite, and is often either a hash of the public key material, or the full encoded public
   * key.
   *
   * This method is frequently used to initialize the key identifier or generate some types of cryptonym DIDs.
   *
   * @returns {string} The fingerprint.
   */
  fingerprint(): string {
    throw new Error("Method not implemented.")
  }

  /**
   * Verify that a provided fingerprint matches the public key material belonging to this keypair.
   *
   * @param {string} _fingerprint A public key fingerprint.
   *
   * @returns {boolean} `true` if the fingerprint matches the public key material, `false` otherwise.
   */
  verifyFingerprint(_fingerprint: string): boolean {
    throw new Error("Method not implemented.")
  }

  /**
   * Export the serialized representation of the keypair, along with other metadata which can be used to form a proof.
   *
   * @param {string} _flag The flag to determine which part of the keypair to export.
   *
   * @returns {object} The serialized keypair to be exported.
   */
  export(_flag: "private" | "public" | "both"): PlainDocument {
    throw new Error("Method not implemented.")
  }

  /**
   * Import a keypair from provided options.
   *
   * @param {object} _options Suite-specific options for keypair import.
   *
   * @returns {Promise<Keypair>} Resolve to a keypair instance.
   */
  static from(_options: object): Promise<Keypair> {
    throw new Error("Method not implemented.")
  }

  /**
   * Import a keypair instance from a provided externally fetched document.
   *
   * @param {PlainDocument} _document An externally fetched key document.
   * @param {boolean} _checkContext Whether to check that the fetched document contains the context required by the
   * key's cryptographic suite.
   * @param {boolean} _checkRevoked Whether to check that the fetched document contains a `revoked` timestamp.
   *
   * @returns {Promise<Keypair>} Resolve to a keypair instance.
   */
  static fromDocument(_document: PlainDocument, _checkContext: boolean, _checkRevoked: boolean): Promise<Keypair> {
    throw new Error("Method not implemented.")
  }
}
