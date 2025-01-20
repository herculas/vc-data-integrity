import type { Type } from "../jsonld/base.ts"

/**
 * The options for exporting a keypair.
 */
export type KeypairExportOptions = {
  type?: Type
  flag?: "private" | "public"
}

/**
 * The options for importing a keypair.
 */
export type KeypairImportOptions = {
  type?: Type
  checkContext?: boolean
  checkRevoked?: boolean
}
