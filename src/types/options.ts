import type { Loader } from "./loader.ts"

export type Canonize = {
  loader: Loader
  skipExpansion?: boolean
}
