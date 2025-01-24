import type { Loader } from "./loader.ts"
import type { PlainDocument } from "../jsonld/document.ts"
import type { Cryptosuite } from "../../suite/suite.ts"
import type { VerificationMethodMap } from "../did/method.ts"

/**
 * Options for a purpose.
 */
export type PurposeOptions = {
  document?: PlainDocument
  suite?: Cryptosuite
  method?: VerificationMethodMap
  loader?: Loader
}
