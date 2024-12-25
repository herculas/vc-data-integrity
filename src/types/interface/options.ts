import type { Loader } from "./loader.ts"
import type { PlainDocument } from "../jsonld/document.ts"
import type { Proof } from "../jsonld/proof.ts"
import type { Purpose as ProofPurpose } from "../../purpose/purpose.ts"
import type { Suite as DataIntegrityProof } from "../../suite/suite.ts"
import type { Type } from "../jsonld/keywords.ts"
import type { VerificationMethodMap } from "../did/method.ts"

export type Suite = {
  purpose: ProofPurpose
  proofs?: Array<Proof>
  loader?: Loader
}

export type Purpose = {
  document?: PlainDocument
  suite?: DataIntegrityProof
  method?: VerificationMethodMap
  loader?: Loader
}

export type Export = {
  type?: Type
  flag?: "private" | "public"
}

export type Import = {
  type?: Type
  checkContext?: boolean
  checkRevoked?: boolean
}

export type Canonize = {
  algorithm?: string
  base?: string
  expandContext?: string | object
  skipExpansion?: boolean
  format?: string
  safe?: boolean
  produceGeneralizedRdf?: boolean
  documentLoader?: Loader
  rdfDirection?: string
}
