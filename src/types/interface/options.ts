import type { Loader } from "./loader.ts"
import type { MethodMap } from "../did/method.ts"
import type { PlainDocument } from "../jsonld/document.ts"
import type { Proof } from "../jsonld/proof.ts"
import type { Purpose as ProofPurpose } from "../../purpose/purpose.ts"
import type { Suite as DataIntegrityProof } from "../../suite/suite.ts"

export type Suite = {
  purpose: ProofPurpose
  proofs?: Array<Proof>
  loader?: Loader
}

export type Purpose = {
  document?: PlainDocument
  suite?: DataIntegrityProof
  method?: MethodMap
  loader?: Loader
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
