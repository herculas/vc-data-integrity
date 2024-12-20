import { Suite } from "./suite.ts"
import { SECURITY_CONTEXT_V2_URL } from "../context/constants.ts"
import { toW3CTimestampString } from "../utils/time.ts"
import { canonize, expandMethod, includeContext } from "../utils/jsonld.ts"
import { sha256 } from "../utils/crypto.ts"
import { concatenate } from "../utils/format.ts"
import type { Keypair } from "../key/keypair.ts"
import type { Purpose } from "../purpose/purpose.ts"
import type { Loader } from "../types/loader.ts"
import type { JsonLdDocument } from "../types/jsonld/document.ts"
import type { Proof } from "../types/proof.ts"
import type { DocCache, VerificationResult } from "../types/interface/suite.ts"
import type { ContextURL, Type } from "../types/jsonld/keywords.ts"
import type { VerificationMethod } from "../types/interface/common.ts"

/**
 * Base class from which various linked data signature suites inherit.
 * This class should not be used directly, but should be extended by sub-classes.
 */
export class Signature extends Suite {
  keypair: Keypair
  context: ContextURL
  time: Date
  proof?: Proof

  private cache?: DocCache

  /**
   * @param {Type} type The suite name, should be provided by sub-classes.
   * @param {Keypair} keypair The keypair used to create the signature.
   * @param {ContextURL} context The json-ld context URL that defines the terms of this suite.
   * @param {Proof} proof A json-ld document with options for this instance.
   * @param {Date} time The time of the operation.
   */
  constructor(type: Type, keypair: Keypair, context: ContextURL, time?: Date, proof?: Proof) {
    super(type)
    this.keypair = keypair
    this.context = context
    this.proof = proof
    this.time = time || new Date()
  }

  /**
   * Create a signature with respect to the given document.
   *
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
    _purpose: Purpose,
    proofs: Array<Proof>,
    loader: Loader,
  ): Promise<VerificationResult> {
    try {
      const compressed = await this.compress(document, proof, proofs, loader)
      const method = await this.getVerificationMethod(document, proof, loader)
      this.verifySignature(document, proof, compressed, method, loader)
      return { verified: true }
    } catch (error) {
      if (error instanceof Error) {
        return { verified: false, error: error }
      } else if (typeof error === "string") {
        return { verified: false, error: new Error(error) }
      }
      return { verified: false, error: new Error("[Signature] An unknown error occurred during verification.") }
    }
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

  verifySignature(
    _document: JsonLdDocument,
    _proof: Proof,
    _verifyData: Uint8Array,
    _method: VerificationMethod,
    _loader: Loader,
  ) {
    throw new Error("[Signature] Method should be implemented by sub-class!")
  }

  /**
   * Add extensions to the proof, mostly for legacy support.
   *
   * @param {JsonLdDocument} _document The document.
   * @param {Proof} _proof The proof to be updated.
   * @param {Purpose} _purpose The purpose of the proof.
   * @param {Array<Proof>} _proofs Any existing proofs.
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
   * Ensure the document to be signed contains the required signature suite specific context.
   * If `add` is set to true, the context will be added to the document if it is missing.
   * Else, if `add` is set to false, an error will be thrown if the context is missing.
   *
   * @param {JsonLdDocument} document The document to be signed.
   * @param {boolean} add Whether to add the context if it is missing.
   */
  protected ensureSuiteContext(document: JsonLdDocument, add: boolean = false) {
    if (Array.isArray(document)) {
      document = document[0]
    }
    if (includeContext(document, this.context)) return
    if (!add) {
      throw new Error(`[Signature] Required context '${this.context}' not found in document.`)
    }
    const existingContext = document["@context"] || []
    document["@context"] = Array.isArray(existingContext)
      ? [...existingContext, this.context]
      : [existingContext, this.context]
  }

  /**
   * Canonize an object using the URDNA2015 algorithm.
   *
   * @param {object} input The document to canonize.
   * @param {Loader} loader A loader for external documents.
   * @param {boolean} skipExpansion Whether to skip the expansion step.
   * @returns {Promise<string>} Resolve to the canonized document.
   */
  async canonize(input: object, loader: Loader, skipExpansion: boolean = false): Promise<string> {
    return await canonize(input, {
      algorithm: "URDNA2015",
      format: "application/n-quads",
      documentLoader: loader,
      skipExpansion: skipExpansion,
    })
  }

  /**
   * Canonize an object using the URDNA2015 algorithm for proof creation.
   *
   * @param {Proof} proof The proof to canonize.
   * @param {JsonLdDocument} _document The document for reference.
   * @param {Loader} loader A loader for external documents.
   *
   * @returns {Promise<string>} Resolve to the canonized proof.
   */
  async canonizeForProof(proof: Proof, _document: JsonLdDocument, loader: Loader): Promise<string> {
    proof["@context"] = SECURITY_CONTEXT_V2_URL

    delete proof.nonce
    delete proof.proofValue

    return await this.canonize(proof, loader, false)
  }

  /**
   * Create the data to be signed and verified.
   *
   * @param {JsonLdDocument} document The document to be signed.
   * @param {Proof} proof The proof.
   * @param {Array} _proofs Any existing proofs.
   * @param {Loader} loader A loader for external documents.
   */
  protected async compress(
    document: JsonLdDocument,
    proof: Proof,
    _proofs: Array<Proof>,
    loader: Loader,
  ): Promise<Uint8Array> {
    let cachedHash: Uint8Array
    if (this.cache && this.cache.doc === document) {
      cachedHash = this.cache.hash
    } else {
      const canonizedDoc = await this.canonize(document, loader, false)
      const docBytes = await sha256(canonizedDoc)
      this.cache = {
        doc: document,
        hash: docBytes,
      }
      cachedHash = docBytes
    }

    const canonizedProof = await this.canonizeForProof(proof, document, loader)
    const proofBytes = await sha256(canonizedProof)

    return concatenate(proofBytes, cachedHash)
  }

  /**
   * Fetch the verification method from the document.
   *
   * @param {JsonLdDocument} _document The document to be signed or verified.
   * @param {Proof} proof The proof.
   * @param {Loader} loader A loader for external documents.
   */
  protected async getVerificationMethod(
    _document: JsonLdDocument,
    proof: Proof,
    loader: Loader,
  ): Promise<VerificationMethod> {
    if (!proof.verificationMethod) {
      throw new Error("[Signature] Verification method not found.")
    }
    const framed = await expandMethod(proof.verificationMethod, loader)
    if (!framed) {
      throw new Error("[Signature] Verification method not found.")
    }
    return framed
  }
}
