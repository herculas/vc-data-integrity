import type { DataIntegrityError } from "../../error/error.ts"
import type { JsonLdDocument, OneOrMany } from "../jsonld/base.ts"

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
  warnings?: OneOrMany<DataIntegrityError>
  errors?: OneOrMany<DataIntegrityError>
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
  warnings?: OneOrMany<DataIntegrityError>
  errors?: OneOrMany<DataIntegrityError>
}
