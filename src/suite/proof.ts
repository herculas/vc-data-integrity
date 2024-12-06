import type { Id, OneOrMany, Type } from "../syntax.ts"

export interface Proof {
  id?: Id
  type: Type
  proofPurpose: string
  verificationMethod?: string
  cryptosuite?: string
  created?: string
  expires?: string
  domain?: OneOrMany<string>
  challenge?: string
  proofValue: string
  previousProof?: OneOrMany<string>
  nonce?: string
}
