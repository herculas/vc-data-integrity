import type { Loader } from "./loader.ts"
import type { OneOrMany } from "../jsonld/base.ts"
import type { PlainDocument } from "../jsonld/document.ts"
import type { Proof } from "../did/proof.ts"
import type { DID } from "../did/keywords.ts"

/**
 * Options for a cryptographic suite.
 */
export type SuiteOptions = {
  proofs?: Array<Proof>
  loader?: Loader
}

type AlgorithmBasicOptions = {
  challenge?: string
  domain?: string
}

export type AddOneOptions = SuiteOptions & AlgorithmBasicOptions
export type AddManyOptions = AddOneOptions & { previousProof?: OneOrMany<DID> }
export type VerifyOptions = AddOneOptions & { expectedProofPurpose?: string }

/**
 * The result of a cryptographic verification.
 */
export type VerificationResult = {
  /**
   * A boolean that is `true` if the verification succeeded, or `false` otherwise.
   */
  verified: boolean

  /**
   * A map that represents the secured data document with the verified proofs removed if `verified` is `true`, or `null`
   * otherwise.
   */
  verifiedDocument?: PlainDocument
  warnings?: OneOrMany<Error>
  errors?: OneOrMany<Error>
}
