import type { OneOrMany } from "./jsonld/base.ts"
import type { Context, Type, URL } from "./jsonld/keywords.ts"

export interface Proof {
  "@context"?: Context
  id?: URL
  type: Type
  challenge?: string
  created?: string
  cryptosuite?: string
  domain?: OneOrMany<string>
  expires?: string
  nonce?: string
  previousProof?: OneOrMany<string>
  proofPurpose: string
  proofValue?: string
  verificationMethod?: string
}
