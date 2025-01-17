import type { Loader } from "./loader.ts"
import type { OneOrMany } from "../jsonld/base.ts"
import type { PlainDocument } from "../jsonld/document.ts"
import type { Purpose } from "../../purpose/purpose.ts"
import type { Proof } from "../jsonld/proof.ts"

/**
 * Options for a cryptographic suite.
 */
export type SuiteOptions = {
  purpose: Purpose
  proofs?: Array<Proof>
  loader?: Loader
}

/**
 * The result of a cryptographic verification.
 */
export type VerificationResult = {
  verified: boolean
  verifiedDocument?: PlainDocument
  warnings?: OneOrMany<Error>
  errors?: OneOrMany<Error>
}
