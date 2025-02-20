/**
 * An error that is thrown when a basic error is encountered.
 */
export class BasicError extends Error {
  code: BasicErrorCode

  constructor(code: BasicErrorCode, title: string, detail: string) {
    super(detail)
    this.code = code
    this.name = title
    this.message = detail
  }
}

/**
 * The error codes that can be returned by the library.
 */
export enum BasicErrorCode {
  /**
   * An error was encountered during network connection.
   */
  NETWORK_CONNECTION_ERROR,

  /**
   * A method has not been implemented by a subclass.
   */
  METHOD_NOT_IMPLEMENTED_ERROR,

  /**
   * The document associated with the given URL was not found.
   */
  DOCUMENT_NOT_FOUND_ERROR,
}
