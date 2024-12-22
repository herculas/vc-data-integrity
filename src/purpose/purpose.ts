import { assertTime } from "../utils/time.ts"
import type { Loader } from "../types/interface/loader.ts"
import type { ValidationResult } from "../types/interface/purpose.ts"
import type { PlainDocument } from "../types/jsonld/document.ts"
import type { Proof } from "../types/jsonld/proof.ts"
import type { MethodMap } from "../types/did/method.ts"
import type { Suite } from "../suite/suite.ts"

/**
 * A class that represents a purpose for a proof.
 */
export class Purpose {
  date: Date
  delta: number
  proofPurpose: string

  /**
   * @param {string} purpose The proof purpose defined in the linked data proof specification.
   * @param {Date} date The date of the creation of the proof.
   * @param {number} delta A maximum number of seconds that the date of the proof can deviate from.
   */
  constructor(purpose: string, date?: Date, delta?: number) {
    this.proofPurpose = purpose
    this.date = date || new Date()
    this.delta = delta || Infinity
  }

  /**
   * Validate the purpose of a proof.
   *
   * This method is called during proof verification, after the proof value has been checked against the given
   * verification method, e.g., in the case of a digital signature, the signature has been cryptographically verified
   * against the public key.
   *
   * @param {Proof} proof A proof with the matching purpose.
   * @param {PlainDocument} _document The document that the proof is to be verified against.
   * @param {Suite} _suite The cryptographic suite that the proof is to be verified against.
   * @param {MethodMap} _method The verification method that the proof is to be verified against.
   *
   * @returns {Promise<ValidationResult>} Resolve to an object with `valid` and `error` properties.
   */
  // deno-lint-ignore require-await
  async validate(
    proof: Proof,
    _document: PlainDocument,
    _suite: Suite,
    _method: MethodMap,
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
   * This method is called prior to proof value been generated, such that any properties added may be included in the
   * proof value.
   *
   * @param {Proof} proof A proof with the matching purpose.
   * @param {PlainDocument} _document The document that the proof is to be generated against.
   * @param {Suite} _suite The cryptographic suite that the proof is to be generated against.
   *
   * @returns {Promise<Proof>} Resolve to the proof instance.
   */
  // deno-lint-ignore require-await
  async update(
    proof: Proof,
    _document: PlainDocument,
    _suite: Suite,
    _loader: Loader,
  ): Promise<Proof> {
    proof.proofPurpose = this.proofPurpose
    return proof
  }
}
