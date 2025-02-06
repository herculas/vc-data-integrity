import type { Loader } from "./loader.ts"

export interface Retrieve {
  /**
   * The document loader to use when fetching remote documents.
   */
  documentLoader: Loader
}

export type Base =
  | "base58"
  | "base64"
  | "base64url"
  | "base64nopad"
  | "base64urlnopad"
