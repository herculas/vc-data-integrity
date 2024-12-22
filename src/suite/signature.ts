import { toW3CTimestampString } from "../utils/time.ts"
import { canonizeDocument, canonizeProof, expandVerificationMethod, includeContext } from "../utils/jsonld.ts"
import { concatenate } from "../utils/format.ts"
import { sha256 } from "../utils/crypto.ts"
import { Suite } from "./suite.ts"
import type { CachedDocument, VerificationResult } from "../types/interface/suite.ts"
import type { ContextURL } from "../types/jsonld/keywords.ts"
import type { Keypair } from "../key/keypair.ts"
import type { Loader } from "../types/interface/loader.ts"
import type { MethodMap } from "../types/did/method.ts"
import type { PlainDocument } from "../types/jsonld/document.ts"
import type { Proof } from "../types/jsonld/proof.ts"
import type { Purpose } from "../purpose/purpose.ts"
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
   * @param {string} suite The identifier of the cryptographic suite, should be provided by sub-classes.
   * @param {Keypair} keypair The keypair used to create the signature.
   * @param {ContextURL} context The json-ld context URL that defines the terms of this suite.
   * @param {Proof} proof A json-ld document with options for this instance.
   * @param {Date} time The time of the operation.
   */
  constructor(suite: string, keypair: Keypair, context: ContextURL, time?: Date, proof?: Proof) {
    super(suite)
    this.keypair = keypair
    this.context = context
    this.proof = proof
    this.time = time || new Date()
  }

  /**
   * Create a signature with respect to the given document.
   *
   * @param {PlainDocument} document The document to be signed.
   * @param {Options.Suite} options Options for the signature suite.
   *
   * @returns {Promise<Proof>} Resolve to the created proof.
   */
  override async createProof(
    document: PlainDocument,
    options: Options.Suite,
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
        proofPurpose: options.purpose.proofPurpose,
        proofValue: "",
      }
    }

    // set the proof creation date-time
    if (!proof.created) {
      const date = this.time
      const dateStr = toW3CTimestampString(date)
      proof.created = dateStr
    }

    proof = await options.purpose.update(proof, {document: document, suite: this, })

    // proof = await options.purpose.update(proof, document, this, options.loader)
    // const compressed = await this.compress(document, proof, options.proofs, options.loader)
    // proof = await this.sign(document, proof, compressed, options.loader)

    return proof
  }

  override deriveProof(
    _document: PlainDocument,
    _options: Options.Suite,
  ): Promise<Proof> {
    throw new Error("[Signature] Method should be implemented by sub-class!")
  }

  override async verifyProof(
    document: PlainDocument,
    proof: Proof,
    options: Options.Suite,
  ): Promise<VerificationResult> {
    try {
      const compressed = await this.compress(document, proof, proofs, loader)
      const method = await expandVerificationMethod(loader, proof.verificationMethod)
      this.verify(document, proof, compressed, method, loader)
      return {
        verified: true,
        verifiedDocument: document,
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
    _loader: Loader,
  ): Promise<Proof> {
    throw new Error("[Signature] Method should be implemented by sub-class!")
  }

  verify(
    _document: PlainDocument,
    _proof: Proof,
    _verifyData: Uint8Array,
    _method: MethodMap,
    _loader: Loader,
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
    _proofs: Array<Proof>,
    loader: Loader,
  ): Promise<Uint8Array> {
    let cachedHash: Uint8Array
    if (this.cache && this.cache.doc === document) {
      cachedHash = this.cache.hash
    } else {
      const canonizedDocument = await canonizeDocument(document, loader)
      const docBytes = await sha256(canonizedDocument)
      this.cache = {
        doc: document,
        hash: docBytes,
      }
      cachedHash = docBytes
    }
    const canonizedProof = await canonizeProof(proof, loader)
    const proofBytes = await sha256(canonizedProof)
    return concatenate(proofBytes, cachedHash)
  }
}
