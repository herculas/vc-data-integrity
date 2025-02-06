/**
 * The error codes that can be returned by the library.
 */
export enum ErrorCode {
  NETWORK_CONNECTION_ERROR = 0,
  NOT_IMPLEMENTED_ERROR = 1,
  CONTEXT_MISMATCH_ERROR = 2,

  /**
   * A request to generate a proof failed.
   * 
   * @see https://www.w3.org/TR/vc-data-integrity/#processing-errors
   * @see https://w3id.org/security#PROOF_GENERATION_ERROR
   */
  PROOF_GENERATION_ERROR = -16,

  /**
   * An error was encountered during proof verification.
   * 
   * @see https://www.w3.org/TR/vc-data-integrity/#processing-errors
   * @see https://w3id.org/security#PROOF_VERIFICATION_ERROR
   */
  PROOF_VERIFICATION_ERROR = -17,

  /**
   * An error was encountered during the transformation process.
   * 
   * @see https://www.w3.org/TR/vc-data-integrity/#processing-errors
   * @see https://w3id.org/security#PROOF_TRANSFORMATION_ERROR
   */
  PROOF_TRANSFORMATION_ERROR = -18,

  /**
   * The `domain` value in a proof did not match the expected value.
   * 
   * @see https://www.w3.org/TR/vc-data-integrity/#processing-errors
   * @see https://w3id.org/security#INVALID_DOMAIN_ERROR
   */
  INVALID_DOMAIN_ERROR = -19,

  /**
   * The `challenge` value in a proof did not match the expected value.
   * 
   * @see https://www.w3.org/TR/vc-data-integrity/#processing-errors
   * @see https://w3id.org/security#INVALID_CHALLENGE_ERROR
   */
  INVALID_CHALLENGE_ERROR = -20,

  /**
   * The verification method value in a data integrity proof was malformed.
   * 
   * @see https://www.w3.org/TR/cid-1.0/#processing-errors
   * @see https://w3id.org/security#INVALID_VERIFICATION_METHOD_URL
   */
  INVALID_VERIFICATION_METHOD_URL = -21,

  /**
   * The `id` value in a controlled identifier document was malformed.
   * 
   * @see https://www.w3.org/TR/cid-1.0/#processing-errors
   * @see https://w3id.org/security#INVALID_CONTROLLED_IDENTIFIER_DOCUMENT_ID
   */
  INVALID_CONTROLLED_IDENTIFIER_DOCUMENT_ID = -22,

  /**
   * The controlled identifier document was malformed.
   * 
   * @see https://www.w3.org/TR/cid-1.0/#processing-errors
   * @see https://w3id.org/security#INVALID_CONTROLLED_IDENTIFIER_DOCUMENT
   */
  INVALID_CONTROLLED_IDENTIFIER_DOCUMENT = -23,

  /**
   * The verification method in a controlled identifier document was malformed.
   * 
   * @see https://www.w3.org/TR/cid-1.0/#processing-errors
   * @see https://w3id.org/security#INVALID_VERIFICATION_METHOD
   */
  INVALID_VERIFICATION_METHOD = -24,

  /**
   * The verification method in a controlled identifier document was not associated using the expected verification
   * relationship as expressed in the `proofPurpose` property in the data integrity proof.
   * 
   * @see https://www.w3.org/TR/cid-1.0/#processing-errors
   * @see https://w3id.org/security#INVALID_RELATIONSHIP_FOR_VERIFICATION_METHOD
   */
  INVALID_RELATIONSHIP_FOR_VERIFICATION_METHOD = -25,
}
