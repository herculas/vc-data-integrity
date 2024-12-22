import type { Purpose } from "../../mod.ts"
import type { Loader } from "./loader.ts"

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

export type AddProof = {
  purpose: Purpose
  loader?: Loader
  domain?: string
  challenge?: string
}
