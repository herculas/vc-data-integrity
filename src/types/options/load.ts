import type { OneOrMany } from "../serialize/document.ts"

/**
 * The `LoadDocumentOptions` type is used to pass various options to the `LoadDocumentCallback` function.
 *
 * @see https://www.w3.org/TR/json-ld11-api/#loaddocumentoptions
 */
export type LoadProfile = {
  /**
   * If set to `true`, when extracting JSON-LD script elements from HTML, unless a specific fragment identifier is
   * targeted, extracts all encountered JSON-LD script elements using an array form, if necessary.
   */
  extractAllScripts?: boolean

  /**
   * When the resulting `contentType` is `text/html` or `application/xhtml+xml`, this option determines the profile to
   * use for selecting JSON-LD script elements.
   */
  profile?: string

  /**
   * One or more IRIs to use in the request as a profile parameter.
   */
  requestProfile?: OneOrMany<string>
}
