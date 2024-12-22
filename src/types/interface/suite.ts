import type { OneOrMany } from "../jsonld/base.ts"
import type { PlainDocument } from "../jsonld/document.ts"

export type CachedDocument = {
  hash: Uint8Array
  document: PlainDocument
}

export type VerificationResult = {
  verified: boolean
  verifiedDocument?: PlainDocument
  warnings?: OneOrMany<Error>
  errors?: OneOrMany<Error>
}
