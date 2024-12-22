export type CachedDocument = {
  doc: object
  hash: Uint8Array
}

export type VerificationResult = {
  verified: boolean
  error?: Error
}
