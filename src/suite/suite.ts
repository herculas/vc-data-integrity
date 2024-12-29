import { LDError } from "../error/error.ts"
import { LDErrorCode } from "../error/constants.ts"
import type { PlainDocument } from "../types/jsonld/document.ts"
import type { Proof } from "../types/jsonld/proof.ts"
import type { SuiteOptions, VerificationResult } from "../types/interface/suite.ts"

export class Suite {
  cryptosuite: string

  /**
   * @param {string} _suite The identifier of the cryptographic suite.
   */
  constructor(_suite: string) {
    this.cryptosuite = _suite
  }

  /**
   * Create a proof for the given document.
   *
   * @param {PlainDocument} _document The document to prove.
   * @param {SuiteOptions} _options The options to use.
   *
   * @returns {Promise<Proof>} Resolve to the created proof.
   */
  createProof(
    _document: PlainDocument,
    _options: SuiteOptions,
  ): Promise<Proof> {
    // throw new Error("Method not implemented.")
    throw new LDError(
      LDErrorCode.NOT_IMPLEMENTED,
      "Suite.createProof",
      "This method should be implemented by sub-classes!",
    )
  }

  /**
   * Derive a proof from the given document.
   *
   * @param {PlainDocument} _document The document to prove.
   * @param {SuiteOptions} _options The options to use.
   *
   * @returns {Promise<Proof>} Resolve to the derived proof.
   */
  deriveProof(
    _document: PlainDocument,
    _options: SuiteOptions,
  ): Promise<Proof> {
    throw new LDError(
      LDErrorCode.NOT_IMPLEMENTED,
      "Suite.deriveProof",
      "This method should be implemented by sub-classes!",
    )
  }

  /**
   * Verify a proof for the given document.
   *
   * @param {PlainDocument} _document The document to be verified.
   * @param {Proof} _proof The proof to be verified.
   * @param {SuiteOptions} _options The options to use.
   *
   * @returns {Promise<boolean>} Resolve to true if the proof is valid.
   */
  verifyProof(
    _document: PlainDocument,
    _proof: Proof,
    _options: SuiteOptions,
  ): Promise<VerificationResult> {
    throw new LDError(
      LDErrorCode.NOT_IMPLEMENTED,
      "Suite.verifyProof",
      "This method should be implemented by sub-classes!",
    )
  }
}
