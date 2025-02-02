export enum ErrorCode {
  NETWORK_CONNECTION_ERROR = 0,
  CONTEXT_MISMATCH_ERROR = 2,

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
