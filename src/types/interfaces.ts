export type DocCache = {
  doc: object
  hash: Uint8Array
}

export type VerificationMethod = {}

export type VerificationResult = {
  verified: boolean
  error?: string
  method?: VerificationMethod
}
