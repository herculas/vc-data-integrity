import { LDError } from "../error/error.ts"
import { LDErrorCode } from "../error/constants.ts"
import type { PlainDocument } from "../types/jsonld/document.ts"
import type { Proof } from "../types/did/proof.ts"
import type { SuiteOptions, VerificationResult } from "../types/interface/suite.ts"
import type { Type } from "../types/jsonld/base.ts"

/**
 * Base class from which various linked data cryptographic suites inherit.
 */
export class Cryptosuite {
  /**
   * The `type` property of a data integrity proof MUST contain the string `DataIntegrityProof`.
   * 
   * One of the design patterns seen in Data Integrity cryptosuites from 2012 to 2020 was use of the `type` property to
   * establish a specific type for a cryptographic suite; the Ed25519Signature2020 cryptographic suite was one such
   * specification. This led to a greater burden on cryptographic suite implementations, where every new cryptographic
   * suite required specification of a new JSON-LD Context, resulting in a sub-optimal developer experience. A 
   * streamlined version of this design pattern in 2020, such that a developer would only need to include a single JSON-
   * LD Context to support all modern cryptographic suites. This encouraged more modern cryptosuites -- such as the
   * EdDSA cryptosuites and the ECDSA cryptosuites -- to be built based on the streamlined pattern.
   * 
   * To improve the developer experience, authors creating new Data Integrity cryptographic suite specifications SHOULD
   * use the modern pattern -- where the `type` property is set to `DataIntegrityProof`; the `cryptosuite` property 
   * carries the identifier for the cryptosuite; and any cryptosuite-specific cryptographic data is encapsulated (i.e.,
   * not directly exposed as application layer data) within `proofValue`.
   */
  type: Type

  /**
   * The `cryptosuite` property MUST be a string that identifies the cryptographic suite. If the processing environment
   * supports string subtypes, the subtype of the `cryptosuite` property MUST be the
   * `https://w3id.org/security#cryptosuiteString` subtype.
   */
  cryptosuite: string

  /**
   * The `proofValue` property MUST be used.
   */
  proofValue?: Proof

  /**
   * @param {string} _suite The identifier of the cryptographic suite.
   * @param {Proof} _proof A data integrity proof.
   */
  constructor(_suite: string, type?: Type, _proof?: Proof) {
    this.type = type ?? "DataIntegrityProof"
    this.cryptosuite = _suite
    this.proofValue = _proof
  }

  /**
   * An algorithm that takes an input document and proof options as input, and produces a data integrity proof or an 
   * error.
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
   * An algorithm that takes a secured data document as input, and produces a cryptosuite verification result or an 
   * error.
   *
   * @param {PlainDocument} _document The document to be verified.
   * @param {Proof} _proof The proof to be verified.
   * @param {SuiteOptions} _options The options to use.
   *
   * @returns {Promise<VerificationResult>} Resolve to a verification result.
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
