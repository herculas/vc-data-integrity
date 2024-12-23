import { concatenate } from "../utils/format.ts"
import { sha256 } from "../utils/crypto.ts"
import { canonizeDocument, canonizeProof, expandVerificationMethod, includeContext } from "../utils/jsonld.ts"
import { toW3CTimestampString } from "../utils/time.ts"
import { defaultLoader } from "../loader/default.ts"
import { Suite } from "./suite.ts"
import type { CachedDocument, VerificationResult } from "../types/interface/suite.ts"
import type { ContextURL } from "../types/jsonld/keywords.ts"
import type { Keypair } from "../key/keypair.ts"
import type { Loader } from "../types/interface/loader.ts"
import type { MethodMap } from "../types/did/method.ts"
import type { PlainDocument } from "../types/jsonld/document.ts"
import type { Proof } from "../types/jsonld/proof.ts"
import type * as Options from "../types/interface/options.ts"

/**
 * Base class from which various linked data signature suites inherit.
 * This class should not be used directly, but should be extended by sub-classes.
 */
export class Signature extends Suite {
  keypair: Keypair
  context: ContextURL
  time: Date

  proof?: Proof
  private cache?: CachedDocument

  /**
   * @param {string} _suite The identifier of the cryptographic suite, should be provided by sub-classes.
   * @param {Keypair} _keypair The keypair used to create the signature.
   * @param {ContextURL} _context The json-ld context URL that defines the terms of this suite.
   * @param {Proof} _proof A json-ld document with options for this instance.
   * @param {Date} _time The time of the operation.
   */
  constructor(_suite: string, _keypair: Keypair, _context: ContextURL, _time?: Date, _proof?: Proof) {
    super(_suite)
    this.keypair = _keypair
    this.context = _context
    this.proof = _proof
    this.time = _time || new Date()
  }

  /**
   * Create a signature with respect to the given document.
   *
   * @param {PlainDocument} _document The document to be signed.
   * @param {Options.Suite} _options Options for the signature suite.
   *
   * @returns {Promise<Proof>} Resolve to the created proof.
   */
  override async createProof(
    _document: PlainDocument,
    _options: Options.Suite,
  ): Promise<Proof> {
    // construct a proof instance, fill in the signature options
    let proof: Proof
    if (this.proof) {
      proof = Object.assign({
        type: "DataIntegrityProof",
        cryptosuite: this.proof.cryptosuite,
        proofPurpose: this.proof.proofPurpose,
        proofValue: "",
      }, this.proof)
    } else {
      proof = {
        type: "DataIntegrityProof",
        cryptosuite: this.cryptosuite,
        proofPurpose: _options.purpose.proofPurpose,
        proofValue: "",
      }
    }

    // set the proof creation date-time
    if (!proof.created) {
      const date = this.time
      const dateStr = toW3CTimestampString(date)
      proof.created = dateStr
    }

    _options.loader = _options.loader || defaultLoader
    proof = await _options.purpose.update(proof, { document: _document, suite: this, loader: _options.loader })
    const compressed = await this.compress(_document, proof, _options.loader, _options.proofs)
    proof = await this.sign(_document, proof, compressed, _options.loader)

    return proof
  }

  override deriveProof(
    _document: PlainDocument,
    _options: Options.Suite,
  ): Promise<Proof> {
    throw new Error("[Signature] Method should be implemented by sub-class!")
  }

  override async verifyProof(
    _document: PlainDocument,
    _proof: Proof,
    _options: Options.Suite,
  ): Promise<VerificationResult> {
    try {
      _options.loader = _options.loader || defaultLoader
      const compressed = await this.compress(_document, _proof, _options.loader, _options.proofs)
      const method = await expandVerificationMethod(_proof.verificationMethod!, _options.loader)
      this.verify(_document, _proof, compressed, method, _options.loader)
      return {
        verified: true,
        verifiedDocument: _document,
      }
    } catch (error) {
      return {
        verified: false,
        errors: error instanceof Error
          ? error
          : new Error("[Signature] An unknown error occurred during verification."),
      }
    }
  }

  sign(
    _document: PlainDocument,
    _proof: Proof,
    _verifyData: Uint8Array,
    _loader?: Loader,
  ): Promise<Proof> {
    throw new Error("[Signature] Method should be implemented by sub-class!")
  }

  verify(
    _document: PlainDocument,
    _proof: Proof,
    _verifyData: Uint8Array,
    _method: MethodMap,
    _loader?: Loader,
  ) {
    throw new Error("[Signature] Method should be implemented by sub-class!")
  }

  /**
   * Ensure the document to be signed contains the required signature suite specific context.
   * If `add` is set to true, the context will be added to the document if it is missing.
   * Else, if `add` is set to false, an error will be thrown if the context is missing.
   *
   * @param {PlainDocument} document The document to be signed.
   * @param {boolean} add Whether to add the context if it is missing.
   */
  ensureSuiteContext(document: PlainDocument, add: boolean = false) {
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
   * Create the data to be signed and verified.
   *
   * @param {PlainDocument} document The document to be signed.
   * @param {Proof} proof The proof.
   * @param {Array} _proofs Any existing proofs.
   * @param {Loader} loader A loader for external documents.
   */
  protected async compress(
    document: PlainDocument,
    proof: Proof,
    loader: Loader,
    _proofs?: Array<Proof>,
  ): Promise<Uint8Array> {
    let documentHash: Uint8Array
    if (this.cache && this.cache.document === document) {
      documentHash = this.cache.hash
    } else {
      const canonizedDocument = await canonizeDocument(document, loader)
      const docBytes = await sha256(canonizedDocument)
      this.cache = {
        document: document,
        hash: docBytes,
      }
      documentHash = docBytes
    }
    const canonizedProof = await canonizeProof(proof, loader)
    const proofHash = await sha256(canonizedProof)
    return concatenate(proofHash, documentHash)
  }
}
