import type { Context, OneOrMany } from "./basic.ts"

export interface Proof {
  "@context"?: Context
  id?: string
  type: OneOrMany<string>
  proofPurpose: string
  verificationMethod?: string
  cryptosuite?: string
  created?: string
  expires?: string
  domain?: OneOrMany<string>
  challenge?: string
  proofValue?: string
  previousProof?: OneOrMany<string>
  nonce?: string
}
