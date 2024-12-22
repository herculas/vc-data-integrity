import type { Loader } from "./loader.ts"

export type Suite = {
  purpose: Purpose
  proofs?: Array<Proof>
  loader?: Loader
}

export type Purpose = {
  document?: PlainDocument
  suite?: Suite
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
