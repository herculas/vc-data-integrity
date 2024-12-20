export type DocCache = {
  doc: object
  hash: Uint8Array
}

export type VerificationResult = {
  verified: boolean
  error?: Error
}
