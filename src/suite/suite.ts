import type { PlainDocument } from "../types/jsonld/document.ts"
import type { Proof } from "../types/jsonld/proof.ts"
import type * as Options from "../types/interface/options.ts"
import type { VerificationResult } from "../types/interface/suite.ts"

export class Suite {
  cryptosuite: string

  /**
   * @param {string} suite The identifier of the cryptographic suite.
   */
  constructor(_suite: string) {
    this.cryptosuite = _suite
  }

  /**
   * Create a proof for the given document.
   *
   * @param {PlainDocument} _document The document to prove.
   * @param {Options.Suite} _options The options to use.
   *
   * @returns {Promise<Proof>} Resolve to the created proof.
   */
  createProof(
    _document: PlainDocument,
    _options: Options.Suite,
  ): Promise<Proof> {
    throw new Error("Method not implemented.")
  }

  /**
   * Derive a proof from the given document.
   *
   * @param {PlainDocument} _document The document to prove.
   * @param {Options.Suite} _options The options to use.
   *
   * @returns {Promise<Proof>} Resolve to the derived proof.
   */
  deriveProof(
    _document: PlainDocument,
    _options: Options.Suite,
  ): Promise<Proof> {
    throw new Error("Method not implemented.")
  }

  /**
   * Verify a proof for the given document.
   *
   * @param {PlainDocument} _document The document to be verified.
   * @param {Proof} _proof The proof to be verified.
   * @param {Options.Suite} _options The options to use.
   *
   * @returns {Promise<boolean>} Resolve to true if the proof is valid.
   */
  verifyProof(
    _document: PlainDocument,
    _proof: Proof,
    _options: Options.Suite,
  ): Promise<VerificationResult> {
    throw new Error("Method not implemented.")
  }
}
