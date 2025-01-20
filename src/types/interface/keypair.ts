import type { JWK } from "../did/jwk.ts"
import type { VerificationMethodMap } from "../did/method.ts"
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

/**
 * A JSON-LD document that represents a keypair.
 */
export interface KeypairDocument extends VerificationMethodMap {
  /**
   * The `revoked` property is used to express the date and time when the keypair has been revoked. If not specified,
   * the keypair is considered active.
   *
   * The value of this property MUST be a string representation of a date and time.
   */
  revoked?: string

  /**
   * The `privateKeyJwk` property is used to express a private key in JSON Web Key (JWK) format.
   */
  privateKeyJwk?: JWK

  /**
   * The `privateKeyMultibase` property is used to express a private key in multibase format.
   *
   * The value of this property MUST be a string representation of a multibase encoded private key.
   *
   * @see https://datatracker.ietf.org/doc/html/draft-multiformats-multibase-03
   */
  secretKeyMultibase?: string
}
