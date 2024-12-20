import type { JsonLdDocument } from "../types/jsonld/document.ts"
import type { Type } from "../types/jsonld/keywords.ts"
import type { Loader } from "../types/interface/loader.ts"
import type { Proof } from "../types/interface/proof.ts"
import type { Purpose } from "../purpose/purpose.ts"
import type { VerificationResult } from "../types/interface/suite.ts"

export class Suite {
  type: Type

  /**
   * @param {Type} type The `type` term specified in the Linked Data Proofs specification.
   */
  constructor(type: Type) {
    this.type = type
  }

  /**
   * Create a proof for the given document.
   *
   * @param {JsonLdDocument} _document The document to prove.
   * @param {Purpose} _purpose The purpose of the proof.
   * @param {Array<Proof>} _proofs Any existing proofs to include in the new proof.
   * @param {Loader} _loader A loader to resolve external documents.
   *
   * @returns {Promise<Proof>} Resolve to the created proof.
   */
  prove(
    _document: JsonLdDocument,
    _purpose: Purpose,
    _proofs: Array<Proof>,
    _loader: Loader,
  ): Promise<Proof> {
    throw new Error("Method not implemented.")
  }

  /**
   * Derive a proof from the given document.
   *
   * @param {JsonLdDocument} _document The document to prove.
   * @param {Purpose} _purpose The purpose of the proof.
   * @param {Array<Proof>} _proofs Any existing proofs.
   * @param {Loader} _loader A loader to resolve external documents.
   *
   * @returns {Promise<Proof>} Resolve to the derived proof.
   */
  derive(
    _document: JsonLdDocument,
    _purpose: Purpose,
    _proofs: Array<Proof>,
    _loader: Loader,
  ): Promise<Proof> {
    throw new Error("Method not implemented.")
  }

  /**
   * Verify a proof for the given document.
   *
   * @param {JsonLdDocument} _document The document to be verified.
   * @param {Proof} _proof The proof to be verified.
   * @param {Purpose} _purpose The purpose of the proof.
   * @param {Array<Proof>} _proofs Any existing proofs.
   * @param {Loader} _loader A loader to resolve external documents.
   *
   * @returns {Promise<boolean>} Resolve to true if the proof is valid.
   */
  verify(
    _document: JsonLdDocument,
    _proof: Proof,
    _purpose: Purpose,
    _proofs: Array<Proof>,
    _loader: Loader,
  ): Promise<VerificationResult> {
    throw new Error("Method not implemented.")
  }
}
