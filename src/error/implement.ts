/**
 * An error that is thrown when a implementation error of the cryptographic suite is encountered.
 */
export class ImplementationError extends Error {
  code: ImplementationErrorCode

  constructor(code: ImplementationErrorCode, title: string, detail: string) {
    super(detail)
    this.code = code
    this.name = title
    this.message = detail
  }
}

/**
 * The error codes that can be returned by the library.
 */
export enum ImplementationErrorCode {
  /**
   * The length of the keypair is invalid.
   */
  INVALID_KEYPAIR_LENGTH = 101,

  /**
   * The keypair has not been initialized, or the required fields of a keypair are missing.
   */
  INVALID_KEYPAIR_CONTENT = 102,

  /**
   * An error occurred while exporting an object.
   */
  KEYPAIR_EXPORT_ERROR = 103,

  /**
   * An error occurred while importing a document into an object.
   */
  KEYPAIR_IMPORT_ERROR = 104,

  /**
   * The keypair has expired or has been revoked.
   */
  KEYPAIR_EXPIRED_ERROR = 105,

  /**
   * An encoding error was encountered.
   */
  ENCODING_ERROR = 111,

  /**
   * A decoding error was encountered.
   */
  DECODING_ERROR = 112,
}
