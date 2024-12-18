import type { Proof } from "../types/proof.ts"
import type { Suite } from "../suite/suite.ts"
import type { Loader } from "../types/loader.ts"
import type { JsonLdDocument } from "../types/jsonld/document.ts"

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
   * verification method.
   *
   * @param {Proof} _proof A proof with the matching purpose.
   * @param {JsonLdDocument} _document
   * @param {Suite} _suite
   * @param {object} _method
   *
   * @returns {Promise} Resolve to an object with `valid` and `error` properties.
   */
  validate(
    _proof: Proof,
    _document?: JsonLdDocument,
    _suite?: Suite,
    _method?: object,
    _loader?: Loader,
  ): Promise<{ valid: boolean; error?: Error }> {
    throw new Error("Method not implemented.")
  }

  /**
   * Update a proof when it is been created, adding any properties specific to this purpose.
   *
   * This method is called prior to proof value been generated, such that any properties addded may be included in
   * the proof value.
   *
   * @param {Proof} _proof A proof with the matching purpose.
   * @param {JsonLdDocument} _document
   * @param {Suite} _suite
   *
   * @returns {Promise<Proof>} Resolve to the proof instance.
   */
  update(
    _proof: Proof,
    _document?: JsonLdDocument,
    _suite?: Suite,
    _loader?: Loader,
  ): Promise<Proof> {
    throw new Error("Method not implemented.")
  }
}
