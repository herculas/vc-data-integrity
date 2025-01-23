export enum LDErrorCode {
  NETWORK_FAILURE = 10,
  NOT_IMPLEMENTED = 11,
  CONTEXT_MISMATCH = 12,
  LOADER_ERROR = 13,
  PURPOSE_VALIDATION_FAILURE = 21,
  PROOF_VERIFICATION_FAILURE = 31,

  /**
   * A request to generate a proof failed.
   */
  PROOF_GENERATION_ERROR = -16,

  /**
   * An error was encountered during proof verification.
   */
  PROOF_VERIFICATION_ERROR = -17,

  /**
   * An error was encountered during the transformation process.
   */
  PROOF_TRANSFORMATION_ERROR = -18,

  /**
   * The `domain` value in a proof did not match the expected value.
   */
  INVALID_DOMAIN_ERROR = -19,

  /**
   * The `challenge` value in a proof did not match the expected value.
   */
  INVALID_CHALLENGE_ERROR = -20,
}
