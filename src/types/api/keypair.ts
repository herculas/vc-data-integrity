import type { Relationship } from "./document.ts"

/**
 * The keypair type.
 */
export type Flag = "public" | "private"

/**
 * The options for exporting a keypair.
 */
export interface Export {
  type?: string
  flag?: Flag
  relationship?: Set<Relationship>
}

/**
 * The options for importing a keypair.
 */
export interface Import {
  checkContext?: boolean
  checkRevoked?: boolean
}
