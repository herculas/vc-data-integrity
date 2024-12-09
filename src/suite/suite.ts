import type { Proof } from "./proof.ts"
import type { Purpose } from "../purpose/purpose.ts"
import type { Type } from "../syntax.ts"

export interface Suite {
  type: Type

  /**
   * Create a proof for the given document.
   *
   * @param {object} document The document to prove.
   * @param {Purpose} purpose The purpose of the proof.
   * @param {Array<Proof>} set Any existing proofs to include in the new proof.
   *
   * @returns {Promise<Proof>} Resolve to the created proof.
   */
  prove(document: object, purpose: Purpose, set: Array<Proof>): Promise<Proof>

  /**
   * Derive a proof from the given document.
   *
   * @param {object} document The document to prove.
   * @param {Purpose} purpose The purpose of the proof.
   * @param {Array<Proof>} set Any existing proofs.
   *
   * @returns {Promise<Proof>} Resolve to the derived proof.
   */
  derive(document: object, purpose: Purpose, set: Array<Proof>): Promise<Proof>

  /**
   * Verify a proof for the given document.
   *
   * @param {object} document The document to be verified.
   * @param {Proof} proof The proof to be verified.
   * @param {Purpose} purpose The purpose of the proof.
   * @param {Array<Proof>} set Any existing proofs.
   *
   * @returns {Promise<boolean>} Resolve to true if the proof is valid.
   */
  verify(
    document: object,
    proof: object,
    purpose: Purpose,
    set: Array<Proof>,
  ): Promise<boolean>
}
