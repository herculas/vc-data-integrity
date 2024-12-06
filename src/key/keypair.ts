/**
 * The keypair interface.
 */
export abstract class Keypair {
  id?: string
  controller?: string
  type: string
  revoked?: Date

  /**
   * Generate a keypair instance.
   *
   * @param {string} id The identifier of the key, typically hashed from the controller URL and the key fingerprint.
   * @param {string} controller The controller of the key, typically a URL of the entity controlling the key.
   * @param {Type} type The type of the key.
   * @param {Date} revoked The time when the key was revoked in RFC3339 format. If not present, the key is considered
   * active.
   */
  constructor(type: string, id?: string, controller?: string, revoked?: Date) {
    this.type = type
    this.id = id
    this.controller = controller
    this.revoked = revoked
  }

  /**
   * Generate a new keypair.
   *
   * @param {object} options Suite-specific options for keypair generation.
   *
   * @returns {Promise<Keypair>} Resolve to a new keypair instance.
   */
  abstract generate(options: object): Promise<Keypair>

  /**
   * Import a keypair instance from a provided externally fetched document.
   *
   * @param {object} document An externally fetched key document.
   * @param {boolean} checkContext Whether to check that the fetched document contains the context required by the
   * key's cryptographic suite.
   * @param {boolean} checkRevoked Whether to check that the fetched document contains a `revoked` timestamp.
   *
   * @returns {Promise<Keypair>} Resolve to a keypair instance.
   */
  abstract fromDocument(document: object, checkContext: boolean, checkRevoked: boolean): Promise<Keypair>

  /**
   * Import a keypair from provided options.
   *
   * @param {object} options Suite-specific options for keypair import.
   *
   * @returns {Promise<Keypair>} Resolve to a keypair instance.
   */
  abstract from(options: object): Promise<Keypair>

  /**
   * Export the serialized representation of the keypair, along with other metadata which can be used to form a proof.
   *
   * @param {boolean} pkFlag Whether to include the public key in the export.
   * @param {boolean} skFlag Whether to include the private key in the export.
   *
   * @returns {object} The serialized keypair to be exported.
   */
  abstract export(pkFlag: boolean, skFlag: boolean): object

  /**
   * Calculate the public key fingerprint, multibase + multicodec encoded. The specific fingerprint method is
   * determined by the key suite, and is often either a hash of the public key material, or the full encoded public
   * key.
   *
   * This method is frequently used to initialize the key identifier or generate some types of cryptonym DIDs.
   *
   * @returns {string} The fingerprint.
   */
  abstract fingerprint(): string

  /**
   * Verify that a provided fingerprint matches the public key material belonging to this keypair.
   *
   * @param {string} fingerprint A public key fingerprint.
   *
   * @returns {boolean} `true` if the fingerprint matches the public key material, `false` otherwise.
   */
  abstract verifyFingerprint(fingerprint: string): boolean
}
