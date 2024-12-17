import type { Keypair } from "../key/keypair.ts"
import type { Purpose } from "../purpose/purpose.ts"
import type { Loader } from "../types/loader.ts"
import type { DocCache, JsonLdDocument } from "../types/document.ts"
import { canonize, canonizeForProof, concatenate, sha256, toW3CTimestampString } from "../util.ts"
import type { Proof } from "../types/proof.ts"
import { Suite } from "./suite.ts"
import type { OneOrMany } from "../types/basic.ts"

/**
 * Base class from which various linked data signature suites inherit.
 * This class should not be used directly, but should be extended by sub-classes.
 */
export class Signature extends Suite {
  keypair: Keypair
  context: string
  time: Date
  proof?: Proof

  private cache?: DocCache

  /**
   * @param {string|Array<string>} type The suite name, should be provided by sub-classes.
   * @param {Keypair} keypair The keypair used to create the signature.
   * @param {string} context The json-ld context URL that defines the terms of this suite.
   * @param {object} proof A json-ld document with options for this instance.
   * @param {Date} time The time of the operation.
   */
  constructor(type: OneOrMany<string>, keypair: Keypair, context: string, time?: Date, proof?: Proof) {
    super(type)
    this.keypair = keypair
    this.context = context
    this.proof = proof
    this.time = time || new Date()
  }

  /**
   * Create a signature with respect to the given document and.
   * @param {JsonLdDocument} document The document to be signed.
   * @param {Purpose} purpose The purpose of the proof.
   * @param {Array<Proof>} proofs Any existing proofs.
   * @param {Loader} loader A loader for external documents.
   *
   * @returns {Promise<Proof>} Resolve to the created proof.
   */
  override async prove(
    document: JsonLdDocument,
    purpose: Purpose,
    proofs: Array<Proof>,
    loader: Loader,
  ): Promise<Proof> {
    // construct a proof instance, fill in the signature options
    let proof: Proof
    if (this.proof) {
      proof = Object.assign({
        type: this.type,
        proofPurpose: purpose.term,
        proofValue: "",
      }, this.proof)
    } else {
      proof = {
        type: this.type,
        proofPurpose: purpose.term,
        proofValue: "",
      }
    }

    // set the proof creation date-time
    if (!proof.created) {
      const date = this.time
      const dateStr = toW3CTimestampString(date)
      proof.created = dateStr
    }

    proof = await this.updateProof(document, proof, purpose, proofs, loader)
    proof = await purpose.update(proof, document, this, loader)
    const compressed = await this.compress(document, proof, proofs, loader)
    proof = await this.generateSignature(document, proof, compressed, loader)

    return proof
  }

  override async verify(
    document: JsonLdDocument,
    proof: Proof,
    purpose: Purpose,
    proofs: Array<Proof>,
    loader: Loader,
  ): Promise<boolean> {
    const compressed = await this.compress(document, proof, proofs, loader)

  }

  override derive(
    _document: JsonLdDocument,
    _purpose: Purpose,
    _proofs: Array<Proof>,
    _loader: Loader,
  ): Promise<Proof> {
    throw new Error("[Signature] Method should be implemented by sub-class!")
  }

  generateSignature(
    _document: JsonLdDocument,
    _proof: Proof,
    _verifyData: Uint8Array,
    _loader: Loader,
  ): Promise<Proof> {
    throw new Error("[Signature] Method should be implemented by sub-class!")
  }

  verifySignature(_document: object, _proof: Proof, _verifyData: Uint8Array): Promise<boolean> {
    throw new Error("[Signature] Method should be implemented by sub-class!")
  }

  /**
   * Add extensions to the proof, mostly for legacy support.
   *
   * @param {JsonLdDocument} _document The document.
   * @param {Proof} _proof The proof to be updated.
   * @param {Purpose} _purpose The purpose of the proof.
   * @param {Array} _proofs Any existing proofs.
   *
   * @returns {Promise<Proof>} Resolve to the created proof.
   */
  updateProof(
    _document: JsonLdDocument,
    _proof: Proof,
    _purpose: Purpose,
    _proofs: Array<Proof>,
    _loader: Loader,
  ): Promise<Proof> {
    return Promise.resolve(_proof)
  }

  /**
   * Create the data to be signed and verified.
   *
   * @param {JsonLdDocument} document The document to be signed.
   * @param {Proof} proof The proof.
   * @param {Array} proofs Any existing proofs.
   * @param {Loader} loader A loader for external documents.
   */
  private async compress(
    document: JsonLdDocument,
    proof: Proof,
    _proofs: Array<Proof>,
    loader: Loader,
  ): Promise<Uint8Array> {
    let cachedHash: Uint8Array
    if (this.cache && this.cache.doc === document) {
      cachedHash = this.cache.hash
    } else {
      const canonizedDoc = await canonize(document, { loader: loader })
      const docBytes = await sha256(canonizedDoc)
      this.cache = {
        doc: document,
        hash: docBytes,
      }
      cachedHash = docBytes
    }

    const canonizedProof = await canonizeForProof(proof, { loader: loader })
    const proofBytes = await sha256(canonizedProof)

    return concatenate(proofBytes, cachedHash)
  }

  private ensureSuiteContext(context: string) {
    if (this.context !== context) {
      throw new Error(
        `Signature suite context mismatch; expected ` +
          `'${this.context}' but got '${context}'.`,
      )
    }
  }

  /**
   * Fetch the verification method from the document.
   *
   * @param {JsonLdDocument} document The document to be signed or verified.
   * @param {Proof} proof The proof.
   * @param {Loader} loader A loader for external documents.
   */
  private getVerificationMethod(document: JsonLdDocument, proof: Proof,  loader: Loader) {}
}
