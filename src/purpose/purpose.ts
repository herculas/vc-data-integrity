import { assertTime } from "../utils/time.ts"
import type { JsonLdDocument } from "../types/jsonld/document.ts"
import type { Loader } from "../types/loader.ts"
import type { Proof } from "../types/proof.ts"
import type { Suite } from "../suite/suite.ts"
import type { ValidationResult } from "../types/interface/purpose.ts"
import type { VerificationMethod } from "../types/interface/common.ts"

/**
 * A class that represents a purpose for a proof.
 */
export class Purpose {
  term: string
  date: Date
  delta: number

  /**
   * @param {string} term The `proofPurpose` term defined in the linked data proof specification.
   * @param {Date} date The date of the creation of the proof.
   * @param {number} delta A maximum number of seconds that the date of the proof can deviate from.
   */
  constructor(term: string, date?: Date, delta?: number) {
    this.term = term
    this.date = date || new Date()
    this.delta = delta || Infinity
  }

  /**
   * Validate the purpose of a proof.
   *
   * This method is called during proof verification, after the proof value has been checked against the given
   * verification method, e.g., in the case of a digital signature, the signature has been cryptographically
   * verified agianst the public key.
   *
   * @param {Proof} _proof A proof with the matching purpose.
   * @param {JsonLdDocument} _document The document that the proof is to be verified against.
   * @param {Suite} _suite The cryptographic suite that the proof is to be verified against.
   * @param {VerificationMethod} _method The verification method that the proof is to be verified against.
   *
   * @returns {Promise<ValidationResult>} Resolve to an object with `valid` and `error` properties.
   */
  // deno-lint-ignore require-await
  async validate(
    proof: Proof,
    _document: JsonLdDocument,
    _suite: Suite,
    _method: VerificationMethod,
    _loader: Loader,
  ): Promise<ValidationResult> {
    try {
      assertTime(this.date, this.delta, proof.created)
      return { valid: true }
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error : new Error("Purpose validation failed!"),
      }
    }
  }

  /**
   * Update a proof when it is created, adding any properties specific to this purpose.
   *
   * This method is called prior to proof value been generated, such that any properties addded may be included in
   * the proof value.
   *
   * @param {Proof} proof A proof with the matching purpose.
   * @param {JsonLdDocument} _document The document that the proof is to be generated against.
   * @param {Suite} _suite The cryptographic suite that the proof is to be generated against.
   *
   * @returns {Promise<Proof>} Resolve to the proof instance.
   */
  // deno-lint-ignore require-await
  async update(
    proof: Proof,
    _document: JsonLdDocument,
    _suite: Suite,
    _loader: Loader,
  ): Promise<Proof> {
    proof.proofPurpose = this.term
    return proof
  }
}
