import type { JsonLdDocument, OneOrMany } from "../serialize/document.ts"

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

  /**
   * Warnings that occurred during the verification process.
   */
  warnings?: OneOrMany<Error>

  /**
   * Errors that occurred during the verification process.
   */
  errors?: OneOrMany<Error>
}

/**
 * The result of a verifying multiple cryptographic proofs.
 */
export type VerificationCombined = {
  /**
   * A boolean that is `true` if the verification succeeded, or `false` otherwise.
   */
  status: boolean

  /**
   * A map that represents the secured data document with the verified proofs removed if `status` is `true`, or `null`
   * otherwise.
   */
  document?: JsonLdDocument
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

  /**
   * Warnings that occurred during the validation process.
   */
  warnings?: OneOrMany<Error>

  /**
   * Errors that occurred during the validation process.
   */
  errors?: OneOrMany<Error>
}
