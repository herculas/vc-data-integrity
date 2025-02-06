import type { Type } from "../jsonld/literals.ts"

/**
 * The keypair type.
 */
export type KeyFlag = "public" | "private"

/**
 * The options for exporting a keypair.
 */
export interface Export {
  type?: Type
  flag?: KeyFlag
}

/**
 * The options for importing a keypair.
 */
export interface Import {
  type?: Type
  checkContext?: boolean
  checkRevoked?: boolean
}
