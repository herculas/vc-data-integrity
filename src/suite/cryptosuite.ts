import { DataIntegrityError } from "../error/error.ts"
import { ErrorCode } from "../error/code.ts"

import type { JsonLdDocument } from "../types/jsonld/base.ts"
import type { Proof } from "../types/data/proof.ts"
import type { Type } from "../types/jsonld/literals.ts"

import type * as Result from "../types/api/result.ts"

/**
 * Base class from which various linked data cryptographic suites inherit.
 *
 * @see https://www.w3.org/TR/vc-data-integrity/
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
  static readonly type: Type = "DataIntegrityProof"

  /**
   * The `cryptosuite` property MUST be a string that identifies the cryptographic suite. If the processing environment
   * supports string subtypes, the subtype of the `cryptosuite` property MUST be the
   * {@link https://w3id.org/security#cryptosuiteString | cryptosuiteString} subtype.
   */
  static readonly cryptosuite: string

  /**
   * An algorithm that takes an input document and proof options as input, and produces a data integrity proof or an
   * error.
   *
   * @param {PlainDocument} _unsecuredDocument The unsecured document to create the proof from.
   * @param {object} _options A set of proof options.
   *
   * @returns {Promise<Proof>} Resolve to the created proof.
   */
  static createProof(_unsecuredDocument: JsonLdDocument, _options: object): Promise<Proof> {
    throw new DataIntegrityError(
      ErrorCode.NOT_IMPLEMENTED_ERROR,
      "Cryptosuite.createProof",
      "The createProof method must be implemented by a subclass.",
    )
  }

  /**
   * An algorithm that takes a secured data document and a proof as input, and produces a derived proof.
   *
   * @param {PlainDocument} _securedDocument The secured document to derive the proof from.
   * @param {object} _options A set of proof options, along with any custom API options, such as a document loader.
   *
   * @returns {Promise<Proof>} Resolve to the derived proof.
   */
  static deriveProof(_securedDocument: JsonLdDocument, _options: object): Promise<Proof> {
    throw new DataIntegrityError(
      ErrorCode.NOT_IMPLEMENTED_ERROR,
      "Cryptosuite.deriveProof",
      "The deriveProof method must be implemented by a subclass.",
    )
  }

  /**
   * An algorithm that takes a secured data document as input, and produces a cryptosuite verification result or an
   * error.
   *
   * @param {PlainDocument} _securedDocument The secured document to be verified.
   * @param {object} _options A set of verification options.
   *
   * @returns {Promise<Result.Verification>} Resolve to a verification result.
   */
  static verifyProof(_securedDocument: JsonLdDocument, _options: object): Promise<Result.Verification> {
    throw new DataIntegrityError(
      ErrorCode.NOT_IMPLEMENTED_ERROR,
      "Cryptosuite.verifyProof",
      "The verifyProof method must be implemented by a subclass.",
    )
  }
}
