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
