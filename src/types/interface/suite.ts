import type { OneOrMany } from "../jsonld/base.ts"
import type { PlainDocument } from "../jsonld/document.ts"

export type CachedDocument = {
  doc: object
  hash: Uint8Array
}

export type VerificationResult = {
  verified: boolean
  verifiedDocument?: PlainDocument
  warnings?: OneOrMany<Error>
  errors?: OneOrMany<Error>
}
