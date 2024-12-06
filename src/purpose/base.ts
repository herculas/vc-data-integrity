import type { Proof } from "../suite/proof.ts"
import type { Suite } from "../suite/suite.ts"

/**
 * A class that represents a purpose for a proof.
 */
export interface Purpose {
  term: string
  date: Date
  delta: number

  /**
   * Validate the purpose of a proof.
   *
   * This method is called during proof verification, after the proof value has been checked against the given
   * verification method.
   *
   * @param {Proof} proof A proof with the matching purpose.
   * @param {object} document
   * @param {Suite} suite
   * @param {object} method
   *
   * @returns {Promise<ValidationResult>} Resolve to an object with `valid` and `error` properties.
   */
  validate(
    proof: Proof,
    document?: object,
    suite?: Suite,
    method?: object,
  ): Promise<ValidationResult>

  /**
   * Update a proof when it is been created, adding any properties specific to this purpose.
   *
   * This method is called prior to proof value been generated, such that any properties addded may be included in
   * the proof value.
   *
   * @param {Proof} proof A proof with the matching purpose.
   * @param {object} document
   * @param {Suite} suite
   *
   * @returns {Promise<Proof>} Resolve to the proof instance.
   */
  update(proof: Proof, document?: object, suite?: Suite): Promise<Proof>
}

export interface ValidationResult {
  valid: boolean
  error?: Error
}
