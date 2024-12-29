import { assertTime } from "../utils/time.ts"
import { LDError } from "../error/error.ts"
import { LDErrorCode } from "../error/constants.ts"
import type { Proof } from "../types/jsonld/proof.ts"
import type { PurposeOptions } from "../types/interface/purpose.ts"
import type { VerificationResult } from "../types/interface/suite.ts"

/**
 * A class that represents a purpose for a proof.
 */
export class Purpose {
  date: Date
  delta: number
  proofPurpose: string

  /**
   * @param {string} _purpose The proof purpose defined in the linked data proof specification.
   * @param {Date} _date The date of the creation of the proof.
   * @param {number} _delta A maximum number of seconds that the date of the proof can deviate from.
   */
  constructor(_purpose: string, _date?: Date, _delta?: number) {
    this.proofPurpose = _purpose
    this.date = _date || new Date()
    this.delta = _delta || Infinity
  }

  /**
   * Update a proof when it is created, adding any properties specific to this purpose. This method is called prior to
   * proof value been generated, such that any properties added may be included in the proof value.
   *
   * @param {Proof} _proof A proof with the matching purpose.
   * @param {PurposeOptions} _options The options for the purpose.
   *
   * @returns {Promise<Proof>} Resolve to the proof instance.
   */
  update(
    _proof: Proof,
    _options: PurposeOptions,
  ): Promise<Proof> {
    _proof.proofPurpose = this.proofPurpose
    return Promise.resolve(_proof)
  }

  /**
   * Validate the purpose of a proof.
   *
   * This method is called during proof verification, after the proof value has been checked against the given
   * verification method, e.g., in the case of a digital signature, the signature has been cryptographically verified
   * against the public key.
   *
   * @param {Proof} _proof A proof with the matching purpose.
   * @param {PurposeOptions} _options The options for the purpose.
   *
   * @returns {Promise<VerificationResult>} Resolve to an object with `valid` and `error` properties.
   */
  validate(
    _proof: Proof,
    _options: PurposeOptions,
  ): Promise<VerificationResult> {
    try {
      assertTime(this.date, this.delta, _proof.created)
      return Promise.resolve({
        verified: true,
      })
    } catch (error) {
      return Promise.resolve({
        verified: false,
        errors: new LDError(
          LDErrorCode.PURPOSE_VALIDATION_FAILURE,
          "Purpose.validate",
          `Purpose validation failed: ${error}`,
        ),
      })
    }
  }
}
