import type { Type } from "../jsonld/keywords.ts"

export type KeypairExportOptions = {
  type?: Type
  flag?: "private" | "public"
}

export type KeypairImportOptions = {
  type?: Type
  checkContext?: boolean
  checkRevoked?: boolean
}
