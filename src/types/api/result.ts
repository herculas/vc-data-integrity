import type { JsonLdDocument, OneOrMany } from "../jsonld/base.ts"
import type { ProcessingError } from "../../error/process.ts"

/**
 * The result of a cryptographic verification.
 */
export type Verification = {
  /**
   * A boolean that is `true` if the verification succeeded, or `false` otherwise.
   */
  verified: boolean

  /**
   * A map that represents the secured data document with the verified proofs removed if `verified` is `true`, or `null`
   * otherwise.
   */
  verifiedDocument?: JsonLdDocument
  warnings?: OneOrMany<ProcessingError>
  errors?: OneOrMany<ProcessingError>
}

/**
 * The result of a validation result.
 */
export type Validation = {
  /**
   * A boolean that is `true` if the verification succeeded, or `false` otherwise.
   */
  validated: boolean

  /**
   * A map that represents the validated document with the if `verified` is `true`, or `null` otherwise.
   */
  validatedDocument?: JsonLdDocument
  warnings?: OneOrMany<ProcessingError>
  errors?: OneOrMany<ProcessingError>
}
