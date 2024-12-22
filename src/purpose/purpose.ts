import { assertTime } from "../utils/time.ts"
import type { Proof } from "../types/jsonld/proof.ts"
import type * as Options from "../types/interface/options.ts"
import type { VerificationResult } from "../types/interface/suite.ts"

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
   * @param {Options.Purpose} _options The options for the purpose.
   *
   * @returns {Promise<VerificationResult>} Resolve to an object with `valid` and `error` properties.
   */
  // deno-lint-ignore require-await
  async validate(
    proof: Proof,
    _options: Options.Purpose,
  ): Promise<VerificationResult> {
    try {
      assertTime(this.date, this.delta, proof.created)
      return {
        verified: true,
      }
    } catch (error) {
      return {
        verified: false,
        errors: error instanceof Error ? error : new Error("Purpose validation failed!"),
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
   * @param {Options.Purpose} _options The options for the purpose.
   * @returns {Promise<Proof>} Resolve to the proof instance.
   */
  // deno-lint-ignore require-await
  async update(
    proof: Proof,
    _options: Options.Purpose,
  ): Promise<Proof> {
    proof.proofPurpose = this.proofPurpose
    return proof
  }
}
