import { canonizeDocument, canonizeProof } from "../jsonld/canonize.ts"
import { concatenate, includeContext } from "../utils/format.ts"
import { defaultLoader } from "../loader/default.ts"
import { LDError } from "../error/error.ts"
import { LDErrorCode } from "../error/constants.ts"
import { sha256 } from "../utils/crypto.ts"
import { Cryptosuite } from "./suite.ts"
import { toW3CTimestampString } from "../utils/time.ts"
import type { DIDURL } from "../types/did/keywords.ts"
import type { Keypair } from "../key/keypair.ts"
import type { Loader } from "../types/interface/loader.ts"
import type { IRI, PlainDocument } from "../types/jsonld/document.ts"
import type { Proof } from "../types/did/proof.ts"
import type { SuiteOptions, VerificationResult } from "../types/interface/suite.ts"
import type { VerificationMethodMap } from "../types/did/method.ts"

/**
 * Base class from which various linked data signature suites inherit.
 *
 * This class should not be used directly, but should be extended by sub-classes.
 */
export class DataIntegrityProof extends Cryptosuite {
  context: IRI
  keypair: Keypair
  time: Date

  /**
   * @param {string} _suite The identifier of the cryptographic suite, should be provided by sub-classes.
   * @param {Keypair} _keypair The keypair used to create the signature.
   * @param {IRI} _context The json-ld context URL that defines the terms of this suite.
   * @param {Proof} _proof A json-ld document with options for this instance.
   * @param {Date} _time The time of the operation.
   */
  constructor(_suite: string, _keypair: Keypair, _context: IRI, _time?: Date, _proof?: Proof) {
    super(_suite)
    this.keypair = _keypair
    this.context = _context
    this.proofValue = _proof
    this.time = _time || new Date()
  }

  /**
   * Create a signature with respect to the given document.
   *
   * @param {PlainDocument} _document The document to be signed.
   * @param {SuiteOptions} _options Options for the signature suite.
   *
   * @returns {Promise<Proof>} Resolve to the created proof.
   */
  override async createProof(
    _document: PlainDocument,
    _options: SuiteOptions,
  ): Promise<Proof> {
    // construct a proof instance, fill in the signature options
    let proof: Proof
    if (this.proofValue) {
      proof = Object.assign({
        type: "DataIntegrityProof",
        cryptosuite: this.proofValue.cryptosuite,
        proofPurpose: this.proofValue.proofPurpose,
        proofValue: "",
      }, this.proofValue)
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
    _options: SuiteOptions,
  ): Promise<Proof> {
    throw new LDError(
      LDErrorCode.NOT_IMPLEMENTED,
      "Signature.deriveProof",
      "This method should be implemented by sub-classes!",
    )
  }

  override async verifyProof(
    _document: PlainDocument,
    _proof: Proof,
    _options: SuiteOptions,
  ): Promise<VerificationResult> {
    try {
      _options.loader = _options.loader || defaultLoader
      const compressed = await this.compress(_document, _proof, _options.loader, _options.proofs)
      const method = await this.expandMethod(_proof.verificationMethod!, _options.loader)
      const result = await this.verify(_document, _proof, compressed, method, _options.loader)
      return {
        verified: result.verified,
        verifiedDocument: _document,
        errors: result.errors,
      }
    } catch (error) {
      return {
        verified: false,
        errors: new LDError(
          LDErrorCode.PROOF_VERIFICATION_FAILURE,
          "Signature.verifyProof",
          `Error occurred during verification: ${error}`,
        ),
      }
    }
  }

  sign(
    _document: PlainDocument,
    _proof: Proof,
    _verifyData: Uint8Array,
    _loader?: Loader,
  ): Promise<Proof> {
    throw new LDError(
      LDErrorCode.NOT_IMPLEMENTED,
      "Signature.sign",
      "This method should be implemented by sub-classes!",
    )
  }

  verify(
    _document: PlainDocument,
    _proof: Proof,
    _verifyData: Uint8Array,
    _method?: VerificationMethodMap,
    _loader?: Loader,
  ): Promise<VerificationResult> {
    throw new LDError(
      LDErrorCode.NOT_IMPLEMENTED,
      "Signature.verify",
      "This method should be implemented by sub-classes!",
    )
  }

  /**
   * Ensure the document to be signed contains the required signature suite specific context. If `add` is set to true,
   * the context will be added to the document if it is missing. Else, if `add` is set to false, an error will be thrown
   * if the context is missing.
   *
   * @param {PlainDocument} document The document to be signed.
   * @param {boolean} add Whether to add the context if it is missing.
   */
  ensureSuiteContext(document: PlainDocument, add: boolean = false) {
    if (includeContext(document, this.context)) return
    if (!add) {
      throw new LDError(
        LDErrorCode.CONTEXT_MISMATCH,
        "Signature.ensureSuiteContext",
        `Required context '${this.context}' not found in document!`,
      )
    }
    const existingContext = document["@context"] || []
    document["@context"] = Array.isArray(existingContext)
      ? [...existingContext, this.context]
      : [existingContext, this.context]
  }

  /**
   * Expand the verification method from the given method ID.
   * @param {DIDURL} [methodId] The method ID to be expanded.
   * @param {Loader} [loader] A loader for external documents.
   *
   * @returns {Promise<VerificationMethodMap>} Resolve to the expanded verification method.
   */
  async expandMethod(methodId?: DIDURL, loader?: Loader): Promise<VerificationMethodMap | undefined> {
    if (methodId) {
      if (!loader) {
        throw new LDError(
          LDErrorCode.LOADER_ERROR,
          "Signature.expandMethod",
          "A loader must be provided to expand the verification method!",
        )
      }
      const result = await loader(methodId)
      return result.document! as VerificationMethodMap
    }
    return
  }

  /**
   * Create the data to be signed and verified.
   *
   * @param {PlainDocument} document The document to be signed.
   * @param {Proof} proof The proof.
   * @param {Array} _proofs Any existing proofs.
   * @param {Loader} loader A loader for external documents.
   */
  async compress(
    document: PlainDocument,
    proof: Proof,
    loader: Loader,
    _proofs?: Array<Proof>,
  ): Promise<Uint8Array> {
    const canonizedDocument = await canonizeDocument(document, loader)
    const canonizedProof = await canonizeProof(proof, loader, document["@context"])

    const documentHash = await sha256(canonizedDocument)
    const proofHash = await sha256(canonizedProof)

    return concatenate(proofHash, documentHash)
  }
}
