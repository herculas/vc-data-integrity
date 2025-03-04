import type { IRI } from "../types/jsonld/base.ts"

/**
 * An error that is thrown when a data integrity error is encountered. When exposing these errors through an HTTP
 * interface, implementers SHOULD use {@link https://datatracker.ietf.org/doc/html/rfc9457 | RFC-9457} to encode the
 * error data structure:
 *
 *  - The `type` value of the error object MUST be a URL that starts with the value `https://w3id.org/security#` and
 *    ends with the error code.
 *  - The `title` value of the error object SHOULD provide a short but specific human-readable string for the error.
 *  - The `detail` value of the error object SHOULD provide a longer human-readable explanation of the error.
 *
 * @see https://www.w3.org/TR/cid/#processing-errors
 * @see https://www.w3.org/TR/vc-data-integrity/#processing-errors
 * @see https://w3c.github.io/vc-data-integrity/vocab/security/vocabulary.html#individual_definitions
 */
export class ProcessingError extends Error {
  code: ProcessingErrorCode
  type: IRI

  constructor(code: ProcessingErrorCode, title: string, detail: string) {
    super(detail)
    this.code = code
    this.name = title
    this.message = detail
    this.type = `https://w3id.org/security#${ProcessingErrorCode[code]}`
  }
}

/**
 * The error codes that can be returned by the library.
 */
export enum ProcessingErrorCode {
  /**
   * A request to generate a proof failed.
   *
   * @see https://www.w3.org/TR/vc-data-integrity/#processing-errors
   * @see https://w3id.org/security#PROOF_GENERATION_ERROR
   */
  PROOF_GENERATION_ERROR,

  /**
   * An error was encountered during proof verification.
   *
   * @see https://www.w3.org/TR/vc-data-integrity/#processing-errors
   * @see https://w3id.org/security#PROOF_VERIFICATION_ERROR
   */
  PROOF_VERIFICATION_ERROR,

  /**
   * An error was encountered during the transformation process.
   *
   * @see https://www.w3.org/TR/vc-data-integrity/#processing-errors
   * @see https://w3id.org/security#PROOF_TRANSFORMATION_ERROR
   */
  PROOF_TRANSFORMATION_ERROR,

  /**
   * The `domain` value in a proof did not match the expected value.
   *
   * @see https://www.w3.org/TR/vc-data-integrity/#processing-errors
   * @see https://w3id.org/security#INVALID_DOMAIN_ERROR
   */
  INVALID_DOMAIN_ERROR,

  /**
   * The `challenge` value in a proof did not match the expected value.
   *
   * @see https://www.w3.org/TR/vc-data-integrity/#processing-errors
   * @see https://w3id.org/security#INVALID_CHALLENGE_ERROR
   */
  INVALID_CHALLENGE_ERROR,

  /**
   * The verification method value in a data integrity proof was malformed.
   *
   * @see https://www.w3.org/TR/cid-1.0/#processing-errors
   * @see https://w3id.org/security#INVALID_VERIFICATION_METHOD_URL
   */
  INVALID_VERIFICATION_METHOD_URL,

  /**
   * The `id` value in a controlled identifier document was malformed.
   *
   * @see https://www.w3.org/TR/cid-1.0/#processing-errors
   * @see https://w3id.org/security#INVALID_CONTROLLED_IDENTIFIER_DOCUMENT_ID
   */
  INVALID_CONTROLLED_IDENTIFIER_DOCUMENT_ID,

  /**
   * The controlled identifier document was malformed.
   *
   * @see https://www.w3.org/TR/cid-1.0/#processing-errors
   * @see https://w3id.org/security#INVALID_CONTROLLED_IDENTIFIER_DOCUMENT
   */
  INVALID_CONTROLLED_IDENTIFIER_DOCUMENT,

  /**
   * The verification method in a controlled identifier document was malformed.
   *
   * @see https://www.w3.org/TR/cid-1.0/#processing-errors
   * @see https://w3id.org/security#INVALID_VERIFICATION_METHOD
   */
  INVALID_VERIFICATION_METHOD,

  /**
   * The verification method in a controlled identifier document was not associated using the expected verification
   * relationship as expressed in the `proofPurpose` property in the data integrity proof.
   *
   * @see https://www.w3.org/TR/cid-1.0/#processing-errors
   * @see https://w3id.org/security#INVALID_RELATIONSHIP_FOR_VERIFICATION_METHOD
   */
  INVALID_RELATIONSHIP_FOR_VERIFICATION_METHOD,
}
