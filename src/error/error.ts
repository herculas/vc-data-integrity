import { ErrorCode } from "./code.ts"

import type { URI } from "../types/jsonld/literals.ts"

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
export class DataIntegrityError extends Error {
  code: ErrorCode
  type: URI

  constructor(code: ErrorCode, title: string, detail: string) {
    super(detail)
    this.code = code
    this.name = title
    this.message = detail
    this.type = `https://w3id.org/security#${ErrorCode[code]}`
  }
}
