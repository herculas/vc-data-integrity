import type { Loader } from "../utils/loader.ts"
import type { OneOrMany } from "../types/jsonld/base.ts"
import type { PlainDocument } from "../types/jsonld/document.ts"
import type { Proof } from "../types/did/proof.ts"
import type { Type } from "../types/jsonld/literals.ts"

/**
 * Base class from which various linked data cryptographic suites inherit.
 *
 * @see https://www.w3.org/TR/vc-data-integrity/
 */
export abstract class Cryptosuite {
  /**
   * The `cryptosuite` property MUST be a string that identifies the cryptographic suite. If the processing environment
   * supports string subtypes, the subtype of the `cryptosuite` property MUST be the
   * {@link https://w3id.org/security#cryptosuiteString | cryptosuiteString} subtype.
   */
  readonly cryptosuite: string

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
  readonly type: Type

  /**
   * @param {string} _suite The identifier of the cryptographic suite.
   * @param {Type} _type The type of the cryptographic suite, default to `DataIntegrityProof`.
   */
  constructor(_suite: string, _type?: Type) {
    this.type = _type ?? "DataIntegrityProof"
    this.cryptosuite = _suite
  }

  /**
   * An algorithm that takes an input document and proof options as input, and produces a data integrity proof or an
   * error.
   *
   * @param {PlainDocument} _inputDocument The document to prove.
   * @param {CreateOptions} _options The options to use.
   *
   * @returns {Promise<Proof>} Resolve to the created proof.
   */
  abstract createProof(_inputDocument: PlainDocument, _options: CreateOptions): Promise<Proof>

  /**
   * An algorithm that takes a secured data document as input, and produces a cryptosuite verification result or an
   * error.
   *
   * @param {PlainDocument} _securedDocument The secured document to be verified.
   * @param {VerifyOptions} _options The options to use.
   *
   * @returns {Promise<VerificationResult>} Resolve to a verification result.
   */
  abstract verifyProof(_securedDocument: PlainDocument, _options: VerifyOptions): Promise<VerificationResult>
}

type CreateOptions = {
  proof: Partial<Proof>
  loader?: Loader
}

type VerifyOptions = {
  loader?: Loader
}

/**
 * The result of a cryptographic verification.
 */
export type VerificationResult = {
  /**
   * A boolean that is `true` if the verification succeeded, or `false` otherwise.
   */
  verified: boolean

  /**
   * A map that represents the secured data document with the verified proofs removed if `verified` is `true`, or `null`
   * otherwise.
   */
  verifiedDocument?: PlainDocument
  warnings?: OneOrMany<Error>
  errors?: OneOrMany<Error>
}
